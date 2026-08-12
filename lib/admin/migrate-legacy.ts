"use server";

import { assertAdminOrThrow } from "./guard";
import { createSupabaseServerClient } from "../supabase/server";
import {
  validateBulkImportPayload,
  shuffleBulkImportPayload,
  ValidationError,
  type ContentBlock,
  type SlideNode,
} from "./types";
import type { ActionResult } from "./actions";

// One-time migration: reads the REAL, currently-live curriculum data from
// lib/allModules.ts and lib/courses.ts and imports it into the new CMS
// tables via the same atomic admin_bulk_import_course RPC used by Bulk
// Import. Dynamic imports + runtime shape checks (not static named
// imports) so a missing/renamed export degrades to a warning rather than
// a build failure.
//
// IMPORTANT FIX: the first version of this migration assumed every legacy
// image entry already had a `src` field. In practice the legacy lesson
// data uses inconsistent field names (src/url/imageUrl), which caused
// EVERY course import to fail validation ("images[0].src: must be a
// string") and silently import nothing. normalizeLegacyImage() below now
// tries every known field name, matching the same defensive pattern
// already used in components/ImageGallery.tsx.

interface LegacyLesson {
  id?: string;
  title: string;
  body?: string[];
  proTip?: string;
  mockup?: unknown;
  flow?: unknown;
  images?: Record<string, unknown>[];
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

// Tries every field name we've seen used for image src/alt/caption across
// this codebase, instead of assuming one exact shape.
function normalizeLegacyImage(img: Record<string, unknown>): { src: string; alt: string; caption?: string } | null {
  const src = img.src ?? img.url ?? img.imageUrl ?? img.href ?? img.path;
  if (typeof src !== "string" || src.trim().length === 0) return null;
  const alt = img.alt ?? img.title ?? img.caption ?? "Lesson image";
  const caption = img.caption ?? img.description ?? img.title;
  return {
    src,
    alt: typeof alt === "string" ? alt : "Lesson image",
    caption: typeof caption === "string" ? caption : undefined,
  };
}

function lessonToContentBlocks(lesson: LegacyLesson, warnings: string[], contextLabel: string): ContentBlock[] {
  const body: SlideNode[] = (lesson.body && lesson.body.length > 0 ? lesson.body : ["(no content)"]).map(
    (text): SlideNode => ({ type: "paragraph", text })
  );

  if (lesson.images && lesson.images.length > 0) {
    for (const raw of lesson.images) {
      const normalized = normalizeLegacyImage(raw);
      if (normalized) {
        body.push({ type: "image", ...normalized });
      } else {
        warnings.push(
          `${contextLabel} > "${lesson.title}": an image entry had no recognizable src/url field and was skipped — fields present: ${Object.keys(raw).join(", ") || "(none)"}.`
        );
      }
    }
  }

  const blocks: ContentBlock[] = [
    { type: "SlideText", heading: lesson.title, body, proTip: lesson.proTip },
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
    // Shuffle every quiz question's option order at import time, so
    // migrated quizzes never carry over a predictable "correct answer is
    // always position N" pattern from the original hand-authored data.
    const shuffled = shuffleBulkImportPayload(validated);
    const { error } = await supabase.rpc("admin_bulk_import_course", { payload: shuffled });
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
