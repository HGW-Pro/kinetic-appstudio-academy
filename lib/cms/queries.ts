import "server-only";
import { createSupabaseServerClient } from "../supabase/server";
import type { CourseRecord, TopicRecord, SubtopicRecord, QuizRecord } from "../admin/types";
import { cmsModuleSlug } from "./shared";

export async function getPublicCourses(): Promise<CourseRecord[]> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("is_published", true)
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
    .eq("is_published", true)
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

export const getCmsCourses = getPublicCourses;

export interface CmsCourseWithStats extends CourseRecord {
  topicCount: number;
  subtopicCount: number;
  quizQuestionCount: number;
}

export async function getCmsCoursesWithStats(): Promise<CmsCourseWithStats[]> {
  const supabase = createSupabaseServerClient();
  const courses = await getPublicCourses();
  if (courses.length === 0) return [];

  const courseIds = courses.map((c) => c.id);

  const { data: topics } = await supabase.from("topics").select("id, course_id").in("course_id", courseIds);
  const topicIds = (topics ?? []).map((t) => t.id);
  const topicCourseMap = new Map((topics ?? []).map((t) => [t.id, t.course_id]));

  const { data: subtopics } = topicIds.length
    ? await supabase.from("subtopics").select("id, topic_id").in("topic_id", topicIds)
    : { data: [] as { id: string; topic_id: string }[] };
  const subtopicIds = (subtopics ?? []).map((s) => s.id);

  const { data: quizzes } = subtopicIds.length
    ? await supabase.from("quizzes").select("subtopic_id, questions_json").in("subtopic_id", subtopicIds)
    : { data: [] as { subtopic_id: string; questions_json: unknown }[] };

  const subtopicTopicMap = new Map((subtopics ?? []).map((s) => [s.id, s.topic_id]));

  const topicCountByCourse = new Map<string, number>();
  for (const t of topics ?? []) {
    topicCountByCourse.set(t.course_id, (topicCountByCourse.get(t.course_id) ?? 0) + 1);
  }

  const subtopicCountByCourse = new Map<string, number>();
  for (const s of subtopics ?? []) {
    const courseId = topicCourseMap.get(s.topic_id);
    if (courseId) subtopicCountByCourse.set(courseId, (subtopicCountByCourse.get(courseId) ?? 0) + 1);
  }

  const quizQuestionCountByCourse = new Map<string, number>();
  for (const q of quizzes ?? []) {
    const topicId = subtopicTopicMap.get(q.subtopic_id);
    const courseId = topicId ? topicCourseMap.get(topicId) : undefined;
    if (courseId) {
      const count = Array.isArray(q.questions_json) ? q.questions_json.length : 0;
      quizQuestionCountByCourse.set(courseId, (quizQuestionCountByCourse.get(courseId) ?? 0) + count);
    }
  }

  return courses.map((c) => ({
    ...c,
    topicCount: topicCountByCourse.get(c.id) ?? 0,
    subtopicCount: subtopicCountByCourse.get(c.id) ?? 0,
    quizQuestionCount: quizQuestionCountByCourse.get(c.id) ?? 0,
  }));
}

export interface CmsTopicWithStats {
  id: string;
  title: string;
  slug: string;
  sequence_order: number;
  difficulty: string;
  estMinutes: number;
  subtopicCount: number;
  quizQuestionCount: number;
}

export async function getPublicTopicsWithStats(courseId: string): Promise<CmsTopicWithStats[]> {
  const supabase = createSupabaseServerClient();

  const { data: topics, error } = await supabase
    .from("topics")
    .select("id, title, slug, sequence_order, difficulty, est_minutes")
    .eq("course_id", courseId)
    .order("sequence_order", { ascending: true });

  if (error || !topics || topics.length === 0) {
    if (error) console.error("getPublicTopicsWithStats failed", error);
    return [];
  }

  const topicIds = topics.map((t) => t.id);

  const { data: subtopics } = await supabase
    .from("subtopics")
    .select("id, topic_id")
    .in("topic_id", topicIds);

  const subtopicsByTopic = new Map<string, string[]>();
  for (const s of subtopics ?? []) {
    const list = subtopicsByTopic.get(s.topic_id) ?? [];
    list.push(s.id);
    subtopicsByTopic.set(s.topic_id, list);
  }

  const allSubtopicIds = (subtopics ?? []).map((s) => s.id);
  const { data: quizzes } = allSubtopicIds.length
    ? await supabase.from("quizzes").select("subtopic_id, questions_json").in("subtopic_id", allSubtopicIds)
    : { data: [] as { subtopic_id: string; questions_json: unknown }[] };

  const quizCountBySubtopic = new Map<string, number>();
  for (const q of quizzes ?? []) {
    quizCountBySubtopic.set(q.subtopic_id, Array.isArray(q.questions_json) ? q.questions_json.length : 0);
  }

  return topics.map((t) => {
    const subtopicIds = subtopicsByTopic.get(t.id) ?? [];
    const subtopicCount = subtopicIds.length;
    const quizQuestionCount = subtopicIds.reduce((sum, id) => sum + (quizCountBySubtopic.get(id) ?? 0), 0);
    return {
      id: t.id,
      title: t.title,
      slug: t.slug,
      sequence_order: t.sequence_order,
      difficulty: t.difficulty && t.difficulty.trim() ? t.difficulty : "Standard",
      estMinutes: t.est_minutes && t.est_minutes > 0 ? t.est_minutes : Math.max(subtopicCount * 5, 5),
      subtopicCount,
      quizQuestionCount,
    };
  });
}

export interface CmsTopicDetail {
  topic: CmsTopicWithStats;
  topicCount: number;
  subtopics: { id: string; title: string; sequence_order: number; estMinutes: number }[];
  quizQuestionCount: number;
}

// Full detail for a single topic page: the topic itself (with difficulty/
// duration fallbacks), how many topics total exist in its course (for the
// "Topic X of Y" breadcrumb), every subtopic with its own duration, and
// the total quiz question count aggregated across all of that topic's
// subtopics' linked quizzes -- everything the premium topic overview UI
// needs in one call.
export async function getPublicTopicDetail(courseId: string, topicSlug: string): Promise<CmsTopicDetail | null> {
  const supabase = createSupabaseServerClient();

  const { data: allTopics, error: topicsErr } = await supabase
    .from("topics")
    .select("id, title, slug, sequence_order, difficulty")
    .eq("course_id", courseId)
    .order("sequence_order", { ascending: true });

  if (topicsErr || !allTopics) {
    if (topicsErr) console.error("getPublicTopicDetail failed", topicsErr);
    return null;
  }

  const topicRow = allTopics.find((t) => t.slug === topicSlug);
  if (!topicRow) return null;

  const { data: subtopics } = await supabase
    .from("subtopics")
    .select("id, title, sequence_order, est_minutes")
    .eq("topic_id", topicRow.id)
    .order("sequence_order", { ascending: true });

  const subtopicRows = (subtopics ?? []).map((s) => ({
    id: s.id,
    title: s.title,
    sequence_order: s.sequence_order,
    estMinutes: s.est_minutes && s.est_minutes > 0 ? s.est_minutes : 5,
  }));

  const subtopicIds = subtopicRows.map((s) => s.id);
  let quizQuestionCount = 0;
  if (subtopicIds.length > 0) {
    const { data: quizzes } = await supabase
      .from("quizzes")
      .select("questions_json")
      .in("subtopic_id", subtopicIds);
    quizQuestionCount = (quizzes ?? []).reduce(
      (sum, q) => sum + (Array.isArray(q.questions_json) ? q.questions_json.length : 0),
      0
    );
  }

  const totalSubtopicCount = subtopicRows.length;

  return {
    topic: {
      id: topicRow.id,
      title: topicRow.title,
      slug: topicRow.slug,
      sequence_order: topicRow.sequence_order,
      difficulty: topicRow.difficulty && String(topicRow.difficulty).trim() ? String(topicRow.difficulty) : "Standard",
      estMinutes: Math.max(subtopicRows.reduce((sum, s) => sum + s.estMinutes, 0), 5),
      subtopicCount: totalSubtopicCount,
      quizQuestionCount,
    },
    topicCount: allTopics.length,
    subtopics: subtopicRows,
    quizQuestionCount,
  };
}

export { cmsModuleSlug };
