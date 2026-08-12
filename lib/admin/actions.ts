"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "../supabase/server";
import { assertAdminOrThrow } from "./guard";
import {
  validateBulkImportPayload,
  shuffleBulkImportPayload,
  shuffleQuestions,
  ValidationError,
  type ContentBlock,
  type QuizQuestionSchema,
} from "./types";

export interface ActionResult<T = undefined> {
  ok: boolean;
  data?: T;
  error?: string;
}

function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function actionError(err: unknown): ActionResult<never> {
  if (err instanceof ValidationError) {
    return { ok: false, error: `Validation failed at ${err.message}` };
  }
  if (err instanceof Error) {
    if (err.message === "UNAUTHENTICATED") return { ok: false, error: "You must be signed in." };
    if (err.message === "NOT_AUTHORIZED") return { ok: false, error: "Admin access required." };
    return { ok: false, error: err.message };
  }
  return { ok: false, error: "An unexpected error occurred." };
}

// ---------------- Shared reordering helper ----------------
// Editing an item's "position" field previously just overwrote
// sequence_order with the typed number verbatim -- setting a topic to
// position 1 while another topic already held position 1 produced two
// topics both at 1, instead of shifting the existing one down. This
// computes a full re-sequenced order instead: remove the moved item from
// its current slot, clamp the desired 0-based index to a valid range,
// reinsert it there, and renumber every sibling in the same scope
// sequentially -- the same semantics as reordering a normal list.
async function reorderEntities(
  supabase: ReturnType<typeof createSupabaseServerClient>,
  table: "courses" | "topics" | "subtopics",
  scopeColumn: "course_id" | "topic_id" | null,
  scopeValue: string | null,
  movedId: string,
  desiredIndex: number
): Promise<{ error: string | null }> {
  let query = supabase.from(table).select("id").order("sequence_order", { ascending: true });
  if (scopeColumn && scopeValue) {
    query = query.eq(scopeColumn, scopeValue);
  }
  const { data, error } = await query;
  if (error) return { error: error.message };

  let ids = (data ?? []).map((r: { id: string }) => r.id);
  ids = ids.filter((id) => id !== movedId);
  const clamped = Math.max(0, Math.min(Math.trunc(desiredIndex), ids.length));
  ids.splice(clamped, 0, movedId);

  for (let i = 0; i < ids.length; i++) {
    const { error: updErr } = await supabase.from(table).update({ sequence_order: i }).eq("id", ids[i]);
    if (updErr) return { error: updErr.message };
  }
  return { error: null };
}

// ---------------- Courses ----------------

export async function createCourse(formData: FormData): Promise<ActionResult<{ id: string }>> {
  try {
    await assertAdminOrThrow();
    const supabase = createSupabaseServerClient();

    const title = String(formData.get("title") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const image_url = String(formData.get("image_url") ?? "").trim();
    const positionRaw = Number(formData.get("sequence_order") ?? 1);
    let slug = String(formData.get("slug") ?? "").trim();

    if (!title) return { ok: false, error: "Title is required." };
    if (!slug) slug = slugify(title);
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
      return { ok: false, error: "Slug must be lowercase-kebab-case (e.g. 'my-course')." };
    }
    if (!Number.isFinite(positionRaw)) {
      return { ok: false, error: "Position must be a number." };
    }

    const { data, error } = await supabase
      .from("courses")
      .insert({ title, slug, description: description || null, image_url: image_url || null, sequence_order: 999999 })
      .select("id")
      .single();

    if (error) {
      if (error.code === "23505") return { ok: false, error: `A course with slug "${slug}" already exists.` };
      return { ok: false, error: error.message };
    }

    const { error: reorderErr } = await reorderEntities(supabase, "courses", null, null, data.id, positionRaw - 1);
    if (reorderErr) return { ok: false, error: reorderErr };

    revalidatePath("/admin/courses");
    revalidatePath("/courses");
    return { ok: true, data: { id: data.id } };
  } catch (err) {
    return actionError(err);
  }
}

export async function updateCourse(courseId: string, formData: FormData): Promise<ActionResult> {
  try {
    await assertAdminOrThrow();
    const supabase = createSupabaseServerClient();

    const title = String(formData.get("title") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const image_url = String(formData.get("image_url") ?? "").trim();
    const positionRaw = Number(formData.get("sequence_order") ?? 1);
    const slug = String(formData.get("slug") ?? "").trim();

    if (!title) return { ok: false, error: "Title is required." };
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
      return { ok: false, error: "Slug must be lowercase-kebab-case." };
    }
    if (!Number.isFinite(positionRaw)) {
      return { ok: false, error: "Position must be a number." };
    }

    const { error } = await supabase
      .from("courses")
      .update({ title, slug, description: description || null, image_url: image_url || null })
      .eq("id", courseId);

    if (error) {
      if (error.code === "23505") return { ok: false, error: `A course with slug "${slug}" already exists.` };
      return { ok: false, error: error.message };
    }

    const { error: reorderErr } = await reorderEntities(supabase, "courses", null, null, courseId, positionRaw - 1);
    if (reorderErr) return { ok: false, error: reorderErr };

    revalidatePath("/admin/courses");
    revalidatePath(`/admin/courses/${courseId}`);
    revalidatePath("/courses");
    return { ok: true };
  } catch (err) {
    return actionError(err);
  }
}

export async function deleteCourse(courseId: string): Promise<ActionResult> {
  try {
    await assertAdminOrThrow();
    const supabase = createSupabaseServerClient();
    const { error } = await supabase.from("courses").delete().eq("id", courseId);
    if (error) return { ok: false, error: error.message };
    revalidatePath("/admin/courses");
    revalidatePath("/courses");
    return { ok: true };
  } catch (err) {
    return actionError(err);
  }
}

// ---------------- Topics ----------------

export async function createTopic(courseId: string, formData: FormData): Promise<ActionResult<{ id: string }>> {
  try {
    await assertAdminOrThrow();
    const supabase = createSupabaseServerClient();

    const title = String(formData.get("title") ?? "").trim();
    const positionRaw = Number(formData.get("sequence_order") ?? 1);
    let slug = String(formData.get("slug") ?? "").trim();

    if (!title) return { ok: false, error: "Title is required." };
    if (!slug) slug = slugify(title);
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
      return { ok: false, error: "Slug must be lowercase-kebab-case." };
    }
    if (!Number.isFinite(positionRaw)) {
      return { ok: false, error: "Position must be a number." };
    }

    const { data, error } = await supabase
      .from("topics")
      .insert({ course_id: courseId, title, slug, sequence_order: 999999 })
      .select("id")
      .single();

    if (error) {
      if (error.code === "23505") return { ok: false, error: `A topic with slug "${slug}" already exists in this course.` };
      return { ok: false, error: error.message };
    }

    const { error: reorderErr } = await reorderEntities(supabase, "topics", "course_id", courseId, data.id, positionRaw - 1);
    if (reorderErr) return { ok: false, error: reorderErr };

    revalidatePath(`/admin/courses/${courseId}`);
    revalidatePath("/courses");
    return { ok: true, data: { id: data.id } };
  } catch (err) {
    return actionError(err);
  }
}

export async function updateTopic(topicId: string, courseId: string, formData: FormData): Promise<ActionResult> {
  try {
    await assertAdminOrThrow();
    const supabase = createSupabaseServerClient();

    const title = String(formData.get("title") ?? "").trim();
    const slug = String(formData.get("slug") ?? "").trim();
    const positionRaw = Number(formData.get("sequence_order") ?? 1);

    if (!title) return { ok: false, error: "Title is required." };
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
      return { ok: false, error: "Slug must be lowercase-kebab-case." };
    }
    if (!Number.isFinite(positionRaw)) {
      return { ok: false, error: "Position must be a number." };
    }

    const { error } = await supabase.from("topics").update({ title, slug }).eq("id", topicId);

    if (error) {
      if (error.code === "23505") return { ok: false, error: `A topic with slug "${slug}" already exists in this course.` };
      return { ok: false, error: error.message };
    }

    const { error: reorderErr } = await reorderEntities(supabase, "topics", "course_id", courseId, topicId, positionRaw - 1);
    if (reorderErr) return { ok: false, error: reorderErr };

    revalidatePath(`/admin/courses/${courseId}`);
    revalidatePath("/courses");
    return { ok: true };
  } catch (err) {
    return actionError(err);
  }
}

export async function deleteTopic(topicId: string, courseId: string): Promise<ActionResult> {
  try {
    await assertAdminOrThrow();
    const supabase = createSupabaseServerClient();
    const { error } = await supabase.from("topics").delete().eq("id", topicId);
    if (error) return { ok: false, error: error.message };
    revalidatePath(`/admin/courses/${courseId}`);
    revalidatePath("/courses");
    return { ok: true };
  } catch (err) {
    return actionError(err);
  }
}

// ---------------- Subtopics ----------------

export async function createSubtopic(
  topicId: string,
  courseId: string,
  formData: FormData
): Promise<ActionResult<{ id: string }>> {
  try {
    await assertAdminOrThrow();
    const supabase = createSupabaseServerClient();

    const title = String(formData.get("title") ?? "").trim();
    const positionRaw = Number(formData.get("sequence_order") ?? 1);
    const contentRaw = String(formData.get("content_json") ?? "[]");

    if (!title) return { ok: false, error: "Title is required." };
    if (!Number.isFinite(positionRaw)) return { ok: false, error: "Position must be a number." };

    let content_json: ContentBlock[];
    try {
      const parsed = JSON.parse(contentRaw);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        return { ok: false, error: "content_json must be a non-empty JSON array." };
      }
      const { validateContentBlock } = await import("./types");
      content_json = parsed.map((b: unknown, i: number) => validateContentBlock(b, `content_json[${i}]`));
    } catch (err) {
      if (err instanceof ValidationError) throw err;
      return { ok: false, error: "content_json is not valid JSON." };
    }

    const { data, error } = await supabase
      .from("subtopics")
      .insert({ topic_id: topicId, title, sequence_order: 999999, content_json })
      .select("id")
      .single();

    if (error) return { ok: false, error: error.message };

    const { error: reorderErr } = await reorderEntities(supabase, "subtopics", "topic_id", topicId, data.id, positionRaw - 1);
    if (reorderErr) return { ok: false, error: reorderErr };

    revalidatePath(`/admin/courses/${courseId}`);
    revalidatePath("/courses");
    return { ok: true, data: { id: data.id } };
  } catch (err) {
    return actionError(err);
  }
}

export async function updateSubtopic(
  subtopicId: string,
  topicId: string,
  courseId: string,
  formData: FormData
): Promise<ActionResult> {
  try {
    await assertAdminOrThrow();
    const supabase = createSupabaseServerClient();

    const title = String(formData.get("title") ?? "").trim();
    const positionRaw = Number(formData.get("sequence_order") ?? 1);
    const contentRaw = String(formData.get("content_json") ?? "[]");

    if (!title) return { ok: false, error: "Title is required." };
    if (!Number.isFinite(positionRaw)) return { ok: false, error: "Position must be a number." };

    let content_json: ContentBlock[];
    try {
      const parsed = JSON.parse(contentRaw);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        return { ok: false, error: "content_json must be a non-empty JSON array." };
      }
      const { validateContentBlock } = await import("./types");
      content_json = parsed.map((b: unknown, i: number) => validateContentBlock(b, `content_json[${i}]`));
    } catch (err) {
      if (err instanceof ValidationError) throw err;
      return { ok: false, error: "content_json is not valid JSON." };
    }

    const { error } = await supabase.from("subtopics").update({ title, content_json }).eq("id", subtopicId);

    if (error) return { ok: false, error: error.message };

    const { error: reorderErr } = await reorderEntities(supabase, "subtopics", "topic_id", topicId, subtopicId, positionRaw - 1);
    if (reorderErr) return { ok: false, error: reorderErr };

    revalidatePath(`/admin/courses/${courseId}`);
    revalidatePath("/courses");
    return { ok: true };
  } catch (err) {
    return actionError(err);
  }
}

export async function deleteSubtopic(subtopicId: string, courseId: string): Promise<ActionResult> {
  try {
    await assertAdminOrThrow();
    const supabase = createSupabaseServerClient();
    const { error } = await supabase.from("subtopics").delete().eq("id", subtopicId);
    if (error) return { ok: false, error: error.message };
    revalidatePath(`/admin/courses/${courseId}`);
    revalidatePath("/courses");
    return { ok: true };
  } catch (err) {
    return actionError(err);
  }
}

// ---------------- Quizzes ----------------

export async function upsertQuiz(
  subtopicId: string,
  courseId: string,
  formData: FormData
): Promise<ActionResult> {
  try {
    await assertAdminOrThrow();
    const supabase = createSupabaseServerClient();

    const questionsRaw = String(formData.get("questions_json") ?? "[]");
    let questions_json: QuizQuestionSchema[];
    try {
      const parsed = JSON.parse(questionsRaw);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        return { ok: false, error: "questions_json must be a non-empty JSON array." };
      }
      const { validateQuizQuestion } = await import("./types");
      questions_json = parsed.map((q: unknown, i: number) => validateQuizQuestion(q, `questions_json[${i}]`));
    } catch (err) {
      if (err instanceof ValidationError) throw err;
      return { ok: false, error: "questions_json is not valid JSON." };
    }

    const shuffled = shuffleQuestions(questions_json);

    const { error } = await supabase
      .from("quizzes")
      .upsert({ subtopic_id: subtopicId, questions_json: shuffled }, { onConflict: "subtopic_id" });

    if (error) return { ok: false, error: error.message };

    revalidatePath(`/admin/courses/${courseId}`);
    return { ok: true };
  } catch (err) {
    return actionError(err);
  }
}

// ---------------- Bulk import: single course (legacy) ----------------

export async function bulkImportCourse(rawJson: string): Promise<ActionResult<{ courseId: string }>> {
  try {
    await assertAdminOrThrow();
    const supabase = createSupabaseServerClient();

    let parsed: unknown;
    try {
      parsed = JSON.parse(rawJson);
    } catch {
      return { ok: false, error: "The pasted text is not valid JSON." };
    }

    const payload = validateBulkImportPayload(parsed);
    const shuffled = shuffleBulkImportPayload(payload);

    const { data, error } = await supabase.rpc("admin_bulk_import_course", { payload: shuffled });

    if (error) {
      return { ok: false, error: `Import failed and was fully rolled back: ${error.message}` };
    }

    revalidatePath("/admin/courses");
    revalidatePath("/courses");
    return { ok: true, data: { courseId: data as string } };
  } catch (err) {
    return actionError(err);
  }
}

// ---------------- Bulk import: multiple NEW courses in one paste ----------------

export async function bulkImportCourses(rawJson: string): Promise<
  ActionResult<{ imported: { title: string; id: string }[]; errors: { title: string; error: string }[] }>
> {
  try {
    await assertAdminOrThrow();
    const supabase = createSupabaseServerClient();

    let parsed: unknown;
    try {
      parsed = JSON.parse(rawJson);
    } catch {
      return { ok: false, error: "The pasted text is not valid JSON." };
    }

    const { validateMultiCourseBulkImportPayload, resolveImagesInMultiPayload } = await import("./types");

    const payload = validateMultiCourseBulkImportPayload(parsed);
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const resolved = resolveImagesInMultiPayload(payload, supabaseUrl);
    const shuffled = { courses: resolved.courses.map((c) => shuffleBulkImportPayload(c)) };

    const { data, error } = await supabase.rpc("admin_bulk_import_courses", { payload: shuffled });

    if (error) {
      return { ok: false, error: `Import failed: ${error.message}` };
    }

    const result = data as { imported: { title: string; id: string }[]; errors: { title: string; error: string }[] };

    revalidatePath("/admin/courses");
    revalidatePath("/courses");

    if (result.imported.length === 0) {
      return {
        ok: false,
        error: `No courses were imported.\n${result.errors.map((e) => `"${e.title}": ${e.error}`).join("\n")}`,
        data: result,
      };
    }

    return { ok: true, data: result };
  } catch (err) {
    return actionError(err);
  }
}

// ---------------- Append topics/modules into an EXISTING course ----------------

export async function appendTopicsToCourse(rawJson: string): Promise<
  ActionResult<{ courseId: string; imported: { title: string; id: string }[]; errors: { title: string; error: string }[] }>
> {
  try {
    await assertAdminOrThrow();
    const supabase = createSupabaseServerClient();

    let parsed: unknown;
    try {
      parsed = JSON.parse(rawJson);
    } catch {
      return { ok: false, error: "The pasted text is not valid JSON." };
    }

    const { validateAppendTopicsPayload, resolveImagesInAppendPayload, shuffleAppendTopicsPayload } = await import(
      "./types"
    );

    const payload = validateAppendTopicsPayload(parsed);
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const resolved = resolveImagesInAppendPayload(payload, supabaseUrl);
    const shuffled = shuffleAppendTopicsPayload(resolved);

    const { data, error } = await supabase.rpc("admin_bulk_import_topics_into_course", {
      p_course_slug: shuffled.courseSlug,
      payload: { topics: shuffled.topics },
    });

    if (error) {
      return { ok: false, error: `Import failed: ${error.message}` };
    }

    const result = data as {
      course_id: string;
      imported: { title: string; id: string }[];
      errors: { title: string; error: string }[];
    };

    revalidatePath("/admin/courses");
    revalidatePath(`/admin/courses/${result.course_id}`);
    revalidatePath("/courses");
    revalidatePath("/library");

    if (result.imported.length === 0) {
      return {
        ok: false,
        error: `No topics were imported.\n${result.errors.map((e) => `"${e.title}": ${e.error}`).join("\n")}`,
        data: { courseId: result.course_id, imported: [], errors: result.errors },
      };
    }

    return { ok: true, data: { courseId: result.course_id, imported: result.imported, errors: result.errors } };
  } catch (err) {
    return actionError(err);
  }
}

// ---------------- One-time recovery: import any legacy modules missing from the CMS ----------------

const normalizeLegacyImage = (img: Record<string, unknown>) => {
  const src = img.src ?? img.url ?? img.imageUrl ?? img.href ?? img.path;
  if (typeof src !== "string" || !src.trim()) return null;
  const alt = img.alt ?? img.title ?? img.caption ?? "Lesson image";
  const caption = img.caption ?? img.description ?? img.title;
  return {
    src,
    alt: typeof alt === "string" ? alt : "Lesson image",
    caption: typeof caption === "string" ? caption : undefined,
  };
};

export async function importMissingModulesIntoCourse(
  targetCourseSlug: string
): Promise<ActionResult<{ imported: string[]; skipped: string[]; warnings: string[] }>> {
  try {
    await assertAdminOrThrow();
    const supabase = createSupabaseServerClient();

    const { data: courseRow, error: courseErr } = await supabase
      .from("courses")
      .select("id")
      .eq("slug", targetCourseSlug)
      .maybeSingle();
    if (courseErr || !courseRow) {
      return { ok: false, error: `Course with slug "${targetCourseSlug}" not found.` };
    }

    const { data: existingTopics, error: topicsErr } = await supabase
      .from("topics")
      .select("slug")
      .eq("course_id", courseRow.id);
    if (topicsErr) {
      return { ok: false, error: topicsErr.message };
    }
    const existingSlugs = new Set((existingTopics ?? []).map((t) => t.slug));

    const warnings: string[] = [];
    const imported: string[] = [];
    const skipped: string[] = [];

    let legacyModules: any[] | undefined;
    try {
      const allModulesMod: Record<string, unknown> = await import("../allModules");
      const candidateArrays = Object.values(allModulesMod).filter((v) => Array.isArray(v)) as unknown[][];
      legacyModules = candidateArrays.find((arr) =>
        arr.every(
          (m) =>
            typeof m === "object" &&
            m !== null &&
            typeof (m as any).slug === "string" &&
            typeof (m as any).title === "string" &&
            Array.isArray((m as any).lessons)
        )
      ) as any[] | undefined;
    } catch (err) {
      return { ok: false, error: `lib/allModules.ts could not be loaded: ${err instanceof Error ? err.message : String(err)}` };
    }

    if (!legacyModules) {
      return { ok: false, error: "lib/allModules.ts: no array export matched the expected module shape." };
    }

    const { validateAppendTopicsPayload, resolveImagesInAppendPayload, shuffleAppendTopicsPayload } = await import(
      "./types"
    );

    for (const mod of legacyModules) {
      if (existingSlugs.has(mod.slug)) {
        skipped.push(`${mod.title} (topic slug "${mod.slug}" already exists — not touched)`);
        continue;
      }

      const subtopics = (mod.lessons ?? []).map((lesson: any, li: number) => {
        const body: any[] = (lesson.body && lesson.body.length > 0 ? lesson.body : ["(no content)"]).map(
          (text: string) => ({ type: "paragraph", text })
        );
        if (Array.isArray(lesson.images)) {
          for (const raw of lesson.images) {
            const norm = normalizeLegacyImage(raw);
            if (norm) body.push({ type: "image", ...norm });
            else warnings.push(`${mod.title} > "${lesson.title}": an image had no recognizable src/url — skipped.`);
          }
        }
        if (lesson.mockup) warnings.push(`${mod.title} > "${lesson.title}": had a visual mockup, not migrated.`);
        if (lesson.flow) warnings.push(`${mod.title} > "${lesson.title}": had a flow diagram, not migrated.`);
        const isLast = li === (mod.lessons?.length ?? 1) - 1;
        return {
          title: lesson.title,
          sequence_order: li,
          content_json: [{ type: "SlideText", heading: lesson.title, body, proTip: lesson.proTip }],
          quiz: isLast && mod.quiz?.length > 0 ? { questions_json: mod.quiz } : undefined,
        };
      });

      try {
        const payload = validateAppendTopicsPayload({
          courseSlug: targetCourseSlug,
          topics: [{ title: mod.title, slug: mod.slug, subtopics }],
        });
        const resolved = resolveImagesInAppendPayload(payload, process.env.NEXT_PUBLIC_SUPABASE_URL!);
        const shuffled = shuffleAppendTopicsPayload(resolved);

        const { data, error } = await supabase.rpc("admin_bulk_import_topics_into_course", {
          p_course_slug: shuffled.courseSlug,
          payload: { topics: shuffled.topics },
        });

        if (error) {
          warnings.push(`FAILED to import "${mod.title}": ${error.message}`);
          continue;
        }
        const result = data as { imported: { title: string }[]; errors: { title: string; error: string }[] };
        if (result.errors.length > 0) {
          warnings.push(`FAILED to import "${mod.title}": ${result.errors[0].error}`);
        } else {
          imported.push(mod.title);
        }
      } catch (err) {
        warnings.push(`FAILED to import "${mod.title}": ${err instanceof ValidationError ? err.message : String(err)}`);
      }
    }

    revalidatePath("/admin/courses");
    revalidatePath("/library");

    return { ok: true, data: { imported, skipped, warnings } };
  } catch (err) {
    return actionError(err);
  }
}
