"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "./supabase/server";
import { assertAdminOrThrow } from "./admin/guard";
import { TrainingSchemaError, validateTrainingBlock, validateTrainingDocument } from "./training-schema";

function slug(value: unknown, path: string): string {
  if (typeof value !== "string" || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(value)) throw new TrainingSchemaError(path, "must be lowercase-kebab-case");
  return value;
}
function text(value: unknown, path: string): string {
  if (typeof value !== "string" || !value.trim()) throw new TrainingSchemaError(path, "must be a non-empty string");
  return value;
}
function list(value: unknown, path: string): unknown[] {
  if (!Array.isArray(value) || value.length === 0) throw new TrainingSchemaError(path, "must be a non-empty array");
  return value;
}
function resolveAsset(value: string, base: string) {
  return /^https?:\/\//.test(value) ? value : `${base.replace(/\/$/, "")}/storage/v1/object/public/course-assets/${value.replace(/^\//, "")}`;
}

// V2 import path used by the admin template exporter. It validates
// InteractiveUI blocks through training-schema.ts while retaining all old
// block types, and invokes the existing per-course-savepoint RPC so one
// malformed course does not block the rest of a batch.
export async function bulkImportTrainingV2(rawJson: string) {
  try {
    await assertAdminOrThrow();
    const parsed = JSON.parse(rawJson) as unknown;
    validateTrainingDocument(parsed);
    const root = parsed as { courses: unknown[] };
    const base = process.env.NEXT_PUBLIC_SUPABASE_URL!;

    const courses = list(root.courses, "courses").map((rawCourse, ci) => {
      const item = rawCourse as Record<string, unknown>;
      const course = item.course as Record<string, unknown>;
      if (!course || typeof course !== "object") throw new TrainingSchemaError(`courses[${ci}].course`, "must be an object");
      const topics = list(item.topics, `courses[${ci}].topics`).map((rawTopic, ti) => {
        const topic = rawTopic as Record<string, unknown>;
        const subtopics = list(topic.subtopics, `courses[${ci}].topics[${ti}].subtopics`).map((rawSubtopic, si) => {
          const subtopic = rawSubtopic as Record<string, unknown>;
          const blocks = list(subtopic.content_json, `courses[${ci}].topics[${ti}].subtopics[${si}].content_json`).map((block, bi) => {
            const valid = validateTrainingBlock(block, `courses[${ci}].topics[${ti}].subtopics[${si}].content_json[${bi}]`);
            if (valid.type === "SlideText") {
              return { ...valid, body: valid.body.map((node) => node.type === "image" ? { ...node, src: resolveAsset(node.src, base) } : node) };
            }
            return valid;
          });
          const quiz = subtopic.quiz as Record<string, unknown> | undefined;
          return {
            title: text(subtopic.title, `courses[${ci}].topics[${ti}].subtopics[${si}].title`),
            sequence_order: typeof subtopic.sequence_order === "number" ? subtopic.sequence_order : si + 1,
            content_json: blocks,
            quiz: quiz ? { questions_json: list(quiz.questions_json, `courses[${ci}].topics[${ti}].subtopics[${si}].quiz.questions_json`) } : undefined,
          };
        });
        return { title: text(topic.title, `courses[${ci}].topics[${ti}].title`), slug: slug(topic.slug, `courses[${ci}].topics[${ti}].slug`), sequence_order: typeof topic.sequence_order === "number" ? topic.sequence_order : ti + 1, subtopics };
      });
      return {
        course: {
          title: text(course.title, `courses[${ci}].course.title`),
          slug: slug(course.slug, `courses[${ci}].course.slug`),
          description: typeof course.description === "string" ? course.description : null,
          image_url: typeof course.image_url === "string" ? resolveAsset(course.image_url, base) : null,
          sequence_order: typeof course.sequence_order === "number" ? course.sequence_order : ci + 1,
          is_published: course.is_published !== false,
        },
        topics,
      };
    });

    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.rpc("admin_bulk_import_courses", { payload: { courses } });
    if (error) return { ok: false, error: error.message };
    revalidatePath("/"); revalidatePath("/courses"); revalidatePath("/dashboard"); revalidatePath("/admin/courses");
    return { ok: true, data };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Invalid training JSON" };
  }
}
