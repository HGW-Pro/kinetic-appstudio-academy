"use server";

import { assertAdminOrThrow } from "./guard";
import { createSupabaseServerClient } from "../supabase/server";
import { validateBulkImportPayload, ValidationError, type ContentBlock } from "./types";
import type { ActionResult } from "./actions";

// One-time migration: reads the REAL, currently-live curriculum data
// straight from the TypeScript modules that power the student site
// (lib/allModules.ts + lib/courses.ts) and imports it into the new
// courses/topics/subtopics/quizzes tables via the same atomic
// admin_bulk_import_course RPC the Bulk Import UI uses.
//
// Uses dynamic imports + defensive shape-checking rather than static
// named imports: we don't have full visibility into every export those
// files provide, so this avoids a build failure if an assumed export
// (e.g. a `courses` array) doesn't exist under that exact name, and
// instead degrades to a per-source warning that admins can see.
//
// Deliberately conservative about what it converts:
//   - lesson.body / lesson.proTip / lesson.images -> a single SlideText
//     content block (the part of every lesson we're certain about).
//   - lesson.mockup / lesson.flow are NOT converted (their exact prop
//     shapes weren't available to reconstruct safely). Lessons keep their
//     text content but get flagged in `warnings` for manual re-creation.
//   - A topic/module's single quiz is attached to its LAST subtopic,
//     since the new schema ties quizzes to a subtopic, not a whole topic.

interface LegacyLesson {
  id?: string;
  title: string;
  body?: string[];
  proTip?: string;
  mockup?: unknown;
  flow?: unknown;
  images?: { src: string; alt: string; caption?: string }[];
}

interface LegacyQuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface LegacyModuleLike {
  slug: string;
  title: string;
  tagline?: string;
  lessons: LegacyLesson[];
  quiz: LegacyQuizQuestion[];
}

interface LegacyCourseLike {
  slug: string;
  title: string;
  description?: string;
  topics: LegacyModuleLike[];
}

function isLegacyModuleLike(x: unknown): x is LegacyModuleLike {
  if (typeof x !== "object" || x === null) return false;
  const m = x as Record<string, unknown>;
  return (
    typeof m.slug === "string" &&
    typeof m.title === "string" &&
    Array.isArray(m.lessons) &&
    Array.isArray(m.quiz)
  );
}

function isLegacyCourseLike(x: unknown): x is LegacyCourseLike {
  if (typeof x !== "object" || x === null) return false;
  const c = x as Record<string, unknown>;
  return (
    typeof c.slug === "string" &&
    typeof c.title === "string" &&
    Array.isArray(c.topics) &&
    (c.topics as unknown[]).every(isLegacyModuleLike)
  );
}

function lessonToContentBlocks(lesson: LegacyLesson, warnings: string[], contextLabel: string): ContentBlock[] {
  const body = lesson.body && lesson.body.length > 0 ? lesson.body : ["(no content)"];
  const blocks: ContentBlock[] = [
    { type: "SlideText", heading: lesson.title, body, proTip: lesson.proTip, images: lesson.images },
  ];
  if (lesson.mockup) {
    warnings.push(`${contextLabel} > "${lesson.title}": had a visual mockup that was NOT migrated (needs manual re-creation).`);
  }
  if (lesson.flow) {
    warnings.push(`${contextLabel} > "${lesson.title}": had a flow diagram that was NOT migrated (needs manual re-creation).`);
  }
  return blocks;
}

function buildPayloadForCourse(course: LegacyCourseLike, sequenceOrder: number, warnings: string[]) {
  return {
    course: {
      title: course.title,
      slug: course.slug,
      description: course.description,
      sequence_order: sequenceOrder,
    },
    topics: course.topics.map((topic, ti) => ({
      title: topic.title,
      slug: topic.slug,
      sequence_order: ti,
      subtopics: topic.lessons.map((lesson, li) => {
        const isLast = li === topic.lessons.length - 1;
        return {
          title: lesson.title,
          sequence_order: li,
          content_json: lessonToContentBlocks(lesson, warnings, `${course.title} > ${topic.title}`),
          quiz: isLast && topic.quiz?.length > 0 ? { questions_json: topic.quiz } : undefined,
        };
      }),
    })),
  };
}

async function tryImportCourse(
  supabase: ReturnType<typeof createSupabaseServerClient>,
  course: LegacyCourseLike,
  sequenceOrder: number,
  warnings: string[],
  importedCourses: string[],
  failures: string[]
) {
  const payload = buildPayloadForCourse(course, sequenceOrder, warnings);
  try {
    const validated = validateBulkImportPayload(payload);
    const { error } = await supabase.rpc("admin_bulk_import_course", { payload: validated });
    if (error) {
      failures.push(`"${course.title}": ${error.message}`);
    } else {
      importedCourses.push(course.title);
    }
  } catch (err) {
    failures.push(`"${course.title}": ${err instanceof ValidationError ? err.message : String(err)}`);
  }
}

export async function migrateLegacyCurriculum(): Promise<
  ActionResult<{ importedCourses: string[]; warnings: string[] }>
> {
  try {
    await assertAdminOrThrow();
    const supabase = createSupabaseServerClient();

    const warnings: string[] = [];
    const importedCourses: string[] = [];
    const failures: string[] = [];
    let sequenceOrder = 0;

    // Source 1: lib/allModules.ts — flat list of modules, each becomes its
    // own single-topic course (topic slug mirrors the module slug).
    try {
      const allModulesMod: Record<string, unknown> = await import("../allModules");
      const candidateArrays = Object.values(allModulesMod).filter((v) => Array.isArray(v)) as unknown[][];
      const legacyModules = candidateArrays.find((arr) => arr.every(isLegacyModuleLike)) as
        | LegacyModuleLike[]
        | undefined;

      if (!legacyModules) {
        warnings.push("lib/allModules.ts: no array export matched the expected module shape — skipped.");
      } else {
        for (const mod of legacyModules) {
          const asCourse: LegacyCourseLike = {
            slug: mod.slug,
            title: mod.title,
            description: mod.tagline,
            topics: [{ slug: mod.slug, title: mod.title, lessons: mod.lessons, quiz: mod.quiz }],
          };
          await tryImportCourse(supabase, asCourse, sequenceOrder++, warnings, importedCourses, failures);
        }
      }
    } catch (err) {
      warnings.push(`lib/allModules.ts could not be loaded: ${err instanceof Error ? err.message : String(err)}`);
    }

    // Source 2: lib/courses.ts — already course > topic > lesson shaped.
    try {
      const coursesMod: Record<string, unknown> = await import("../courses");
      const candidateArrays = Object.values(coursesMod).filter((v) => Array.isArray(v)) as unknown[][];
      const hierarchicalCourses = candidateArrays.find((arr) => arr.every(isLegacyCourseLike)) as
        | LegacyCourseLike[]
        | undefined;

      if (!hierarchicalCourses) {
        warnings.push("lib/courses.ts: no array export matched the expected course shape — skipped.");
      } else {
        for (const course of hierarchicalCourses) {
          await tryImportCourse(supabase, course, sequenceOrder++, warnings, importedCourses, failures);
        }
      }
    } catch (err) {
      warnings.push(`lib/courses.ts could not be loaded: ${err instanceof Error ? err.message : String(err)}`);
    }

    if (importedCourses.length === 0) {
      return {
        ok: false,
        error:
          failures.length > 0
            ? `No courses were imported. Failures:\n${failures.join("\n")}`
            : "No courses were imported. See warnings for details.",
        data: { importedCourses: [], warnings: [...warnings, ...failures.map((f) => `FAILED: ${f}`)] },
      };
    }

    return {
      ok: true,
      data: {
        importedCourses,
        warnings: failures.length > 0 ? [...warnings, ...failures.map((f) => `FAILED: ${f}`)] : warnings,
      },
    };
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "UNAUTHENTICATED") return { ok: false, error: "You must be signed in." };
      if (err.message === "NOT_AUTHORIZED") return { ok: false, error: "Admin access required." };
      return { ok: false, error: err.message };
    }
    return { ok: false, error: "An unexpected error occurred during migration." };
  }
}
