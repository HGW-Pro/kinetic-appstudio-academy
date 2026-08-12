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

// ---------------- Courses ----------------

export async function createCourse(formData: FormData): Promise<ActionResult<{ id: string }>> {
  try {
    await assertAdminOrThrow();
    const supabase = createSupabaseServerClient();

    const title = String(formData.get("title") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const image_url = String(formData.get("image_url") ?? "").trim();
    const sequence_order = Number(formData.get("sequence_order") ?? 0);
    let slug = String(formData.get("slug") ?? "").trim();

    if (!title) return { ok: false, error: "Title is required." };
    if (!slug) slug = slugify(title);
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
      return { ok: false, error: "Slug must be lowercase-kebab-case (e.g. 'my-course')." };
    }
    if (!Number.isFinite(sequence_order)) {
      return { ok: false, error: "Sequence order must be a number." };
    }

    const { data, error } = await supabase
      .from("courses")
      .insert({
        title,
        slug,
        description: description || null,
        image_url: image_url || null,
        sequence_order,
      })
      .select("id")
      .single();

    if (error) {
      if (error.code === "23505") return { ok: false, error: `A course with slug "${slug}" already exists.` };
      return { ok: false, error: error.message };
    }

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
    const sequence_order = Number(formData.get("sequence_order") ?? 0);
    const slug = String(formData.get("slug") ?? "").trim();

    if (!title) return { ok: false, error: "Title is required." };
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
      return { ok: false, error: "Slug must be lowercase-kebab-case." };
    }
    if (!Number.isFinite(sequence_order)) {
      return { ok: false, error: "Sequence order must be a number." };
    }

    const { error } = await supabase
      .from("courses")
      .update({ title, slug, description: description || null, image_url: image_url || null, sequence_order })
      .eq("id", courseId);

    if (error) {
      if (error.code === "23505") return { ok: false, error: `A course with slug "${slug}" already exists.` };
      return { ok: false, error: error.message };
    }

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
    const sequence_order = Number(formData.get("sequence_order") ?? 0);
    let slug = String(formData.get("slug") ?? "").trim();

    if (!title) return { ok: false, error: "Title is required." };
    if (!slug) slug = slugify(title);
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
      return { ok: false, error: "Slug must be lowercase-kebab-case." };
    }
    if (!Number.isFinite(sequence_order)) {
      return { ok: false, error: "Sequence order must be a number." };
    }

    const { data, error } = await supabase
      .from("topics")
      .insert({ course_id: courseId, title, slug, sequence_order })
      .select("id")
      .single();

    if (error) {
      if (error.code === "23505") return { ok: false, error: `A topic with slug "${slug}" already exists in this course.` };
      return { ok: false, error: error.message };
    }

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
    const sequence_order = Number(formData.get("sequence_order") ?? 0);

    if (!title) return { ok: false, error: "Title is required." };
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
      return { ok: false, error: "Slug must be lowercase-kebab-case." };
    }
    if (!Number.isFinite(sequence_order)) {
      return { ok: false, error: "Sequence order must be a number." };
    }

    const { error } = await supabase
      .from("topics")
      .update({ title, slug, sequence_order })
      .eq("id", topicId);

    if (error) {
      if (error.code === "23505") return { ok: false, error: `A topic with slug "${slug}" already exists in this course.` };
      return { ok: false, error: error.message };
    }

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
    const sequence_order = Number(formData.get("sequence_order") ?? 0);
    const contentRaw = String(formData.get("content_json") ?? "[]");

    if (!title) return { ok: false, error: "Title is required." };
    if (!Number.isFinite(sequence_order)) return { ok: false, error: "Sequence order must be a number." };

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
      .insert({ topic_id: topicId, title, sequence_order, content_json })
      .select("id")
      .single();

    if (error) return { ok: false, error: error.message };

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
    const sequence_order = Number(formData.get("sequence_order") ?? 0);
    const contentRaw = String(formData.get("content_json") ?? "[]");

    if (!title) return { ok: false, error: "Title is required." };
    if (!Number.isFinite(sequence_order)) return { ok: false, error: "Sequence order must be a number." };

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

    const { error } = await supabase
      .from("subtopics")
      .update({ title, sequence_order, content_json })
      .eq("id", subtopicId);

    if (error) return { ok: false, error: error.message };

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

    // Shuffle each question's option order at save time, so the stored
    // data itself never carries a predictable "correct answer is always
    // position N" pattern, on top of QuizEngine also reshuffling per
    // attempt on the student side.
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

// ---------------- Bulk import (atomic via Postgres RPC) ----------------

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
