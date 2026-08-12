import "server-only";
import { createSupabaseServerClient } from "../supabase/server";
import type { CourseRecord, TopicRecord, SubtopicRecord, QuizRecord } from "../admin/types";
import { cmsModuleSlug } from "./shared";

// Read-only fetchers for the PUBLIC student-facing side of the CMS
// (courses/topics/subtopics/quizzes tables). All four tables have a
// public SELECT RLS policy (see supabase/migrations), so these work for
// signed-out visitors too -- only write actions (enrolling, completing a
// lesson, submitting a quiz) require sign-in, enforced separately by
// lib/progress.ts, exactly like the legacy /courses and /modules routes.

export async function getPublicCourses(): Promise<CourseRecord[]> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .order("sequence_order", { ascending: true })
    .returns<CourseRecord[]>();
  if (error) {
    console.error("getPublicCourses failed", error);
    return [];
  }
  return data ?? [];
}

export async function getPublicCourse(courseSlug: string): Promise<CourseRecord | null> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("slug", courseSlug)
    .maybeSingle<CourseRecord>();
  if (error) {
    console.error("getPublicCourse failed", error);
    return null;
  }
  return data ?? null;
}

export async function getPublicTopics(courseId: string): Promise<TopicRecord[]> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("topics")
    .select("*")
    .eq("course_id", courseId)
    .order("sequence_order", { ascending: true })
    .returns<TopicRecord[]>();
  if (error) {
    console.error("getPublicTopics failed", error);
    return [];
  }
  return data ?? [];
}

export async function getPublicTopic(courseId: string, topicSlug: string): Promise<TopicRecord | null> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("topics")
    .select("*")
    .eq("course_id", courseId)
    .eq("slug", topicSlug)
    .maybeSingle<TopicRecord>();
  if (error) {
    console.error("getPublicTopic failed", error);
    return null;
  }
  return data ?? null;
}

export async function getPublicSubtopics(topicId: string): Promise<SubtopicRecord[]> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("subtopics")
    .select("*")
    .eq("topic_id", topicId)
    .order("sequence_order", { ascending: true })
    .returns<SubtopicRecord[]>();
  if (error) {
    console.error("getPublicSubtopics failed", error);
    return [];
  }
  return data ?? [];
}

export async function getPublicSubtopic(subtopicId: string): Promise<SubtopicRecord | null> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("subtopics")
    .select("*")
    .eq("id", subtopicId)
    .maybeSingle<SubtopicRecord>();
  if (error) {
    console.error("getPublicSubtopic failed", error);
    return null;
  }
  return data ?? null;
}

export async function getPublicQuizForSubtopic(subtopicId: string): Promise<QuizRecord | null> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("quizzes")
    .select("*")
    .eq("subtopic_id", subtopicId)
    .maybeSingle<QuizRecord>();
  if (error) {
    console.error("getPublicQuizForSubtopic failed", error);
    return null;
  }
  return data ?? null;
}

export async function getPublicQuizzesForSubtopics(subtopicIds: string[]): Promise<Record<string, QuizRecord>> {
  if (subtopicIds.length === 0) return {};
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("quizzes")
    .select("*")
    .in("subtopic_id", subtopicIds)
    .returns<QuizRecord[]>();
  if (error) {
    console.error("getPublicQuizzesForSubtopics failed", error);
    return {};
  }
  const map: Record<string, QuizRecord> = {};
  for (const q of data ?? []) map[q.subtopic_id] = q;
  return map;
}

// Re-exported so any existing `import { cmsModuleSlug } from "../cms/queries"`
// call site keeps working unchanged -- the actual implementation now lives
// in ./shared (no "server-only"), so client components should import it
// from there directly instead.
export { cmsModuleSlug };
