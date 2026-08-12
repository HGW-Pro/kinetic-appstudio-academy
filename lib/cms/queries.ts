import "server-only";
import { createSupabaseServerClient } from "../supabase/server";
import type { CourseRecord, TopicRecord, SubtopicRecord, QuizRecord } from "../admin/types";
import { cmsModuleSlug } from "./shared";
import type { LearningPathCourse, LearningPathTopic } from "../../components/academy/learningPathTypes";

// Read-only fetchers for the PUBLIC student-facing side of the CMS. Only
// published courses (is_published = true) are ever returned to public
// callers -- admin views bypass this by querying the tables directly via
// createSupabaseServerClient() with the admin's own authenticated session.

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

// Alias matching the exact name requested for wiring into the main course
// catalog page: getCmsCourses() === getPublicCourses().
export const getCmsCourses = getPublicCourses;

export interface CmsCourseWithStats extends CourseRecord {
  topicCount: number;
  subtopicCount: number;
  quizQuestionCount: number;
}

interface NestedQuizRow {
  questions_json: unknown;
}
interface NestedSubtopicRow {
  id: string;
  quizzes: NestedQuizRow[] | NestedQuizRow | null;
}
interface NestedTopicRow {
  id: string;
  subtopics: NestedSubtopicRow[] | null;
}

function quizArray(raw: NestedQuizRow[] | NestedQuizRow | null): NestedQuizRow[] {
  return Array.isArray(raw) ? raw : raw ? [raw] : [];
}

function countQuizQuestions(raw: NestedQuizRow[] | NestedQuizRow | null): number {
  return quizArray(raw).reduce(
    (sum, q) => sum + (Array.isArray(q.questions_json) ? q.questions_json.length : 0),
    0
  );
}

// Same published-only course list as getCmsCourses(), but enriched with
// topic/subtopic/quiz-question counts -- mirrors the metadata row the
// premium course card already displays for the legacy hardcoded courses.
//
// Implemented as a single nested/embedded PostgREST query (courses ->
// topics -> subtopics -> quizzes) instead of four separate sequential
// round trips. The original version had to await courses, then topics
// (needs course IDs), then subtopics (needs topic IDs), then quizzes
// (needs subtopic IDs) -- a genuine FK dependency chain that Promise.all
// cannot parallelize, since each step's filter depends on the previous
// step's result. Embedding lets Postgres resolve the whole tree server-side
// in one request.
export async function getCmsCoursesWithStats(): Promise<CmsCourseWithStats[]> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("courses")
    .select(`*, topics ( id, subtopics ( id, quizzes ( questions_json ) ) )`)
    .eq("is_published", true)
    .order("sequence_order", { ascending: true });

  if (error || !data) {
    if (error) console.error("getCmsCoursesWithStats failed", error);
    return [];
  }

  return data.map((row) => {
    const { topics, ...courseFields } = row as CourseRecord & { topics: NestedTopicRow[] | null };
    const topicList = topics ?? [];
    let subtopicCount = 0;
    let quizQuestionCount = 0;
    for (const t of topicList) {
      const subtopics = t.subtopics ?? [];
      subtopicCount += subtopics.length;
      for (const s of subtopics) quizQuestionCount += countQuizQuestions(s.quizzes);
    }
    return {
      ...courseFields,
      topicCount: topicList.length,
      subtopicCount,
      quizQuestionCount,
    } as CmsCourseWithStats;
  });
}

// The learning path is derived exclusively from the published CMS
// curriculum. Progress is deliberately not fetched here: it belongs to the
// authenticated learner and is loaded by the client through the existing
// compatible progress helper.
export async function getLearningPathData(): Promise<LearningPathCourse[]> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("courses")
    .select(
      `*,
       topics (
         id, title, slug, sequence_order, difficulty, est_minutes,
         subtopics ( id, title, sequence_order )
       )`
    )
    .eq("is_published", true)
    .order("sequence_order", { ascending: true });

  if (error || !data) {
    if (error) console.error("getLearningPathData failed", error);
    return [];
  }

  type RawTopic = {
    id: string;
    title: string;
    slug: string;
    sequence_order: number;
    difficulty: string | null;
    est_minutes: number | null;
    subtopics: { id: string; title: string; sequence_order: number }[] | null;
  };
  type RawCourse = CourseRecord & {
    prerequisite_topic_id?: string | null;
    topics: RawTopic[] | null;
  };

  return (data as unknown as RawCourse[]).map((course) => {
    const topics: LearningPathTopic[] = (course.topics ?? [])
      .sort((a, b) => a.sequence_order - b.sequence_order)
      .map((topic) => ({
        id: topic.id,
        title: topic.title,
        slug: topic.slug,
        sequenceOrder: topic.sequence_order,
        difficulty: topic.difficulty && topic.difficulty.trim() ? topic.difficulty : null,
        estMinutes: topic.est_minutes && topic.est_minutes > 0 ? topic.est_minutes : null,
        subtopicCount: topic.subtopics?.length ?? 0,
        subtopics: (topic.subtopics ?? [])
          .sort((a, b) => a.sequence_order - b.sequence_order)
          .map((subtopic) => ({
            id: subtopic.id,
            title: subtopic.title,
            sequenceOrder: subtopic.sequence_order,
          })),
      }));
    const configuredDurations = topics.reduce((sum, topic) => sum + (topic.estMinutes ?? 0), 0);
    const unconfiguredLessons = topics.reduce(
      (sum, topic) => sum + (topic.estMinutes === null ? topic.subtopicCount : 0),
      0
    );
    const difficultyValues = Array.from(new Set(topics.map((topic) => topic.difficulty).filter(Boolean))) as string[];

    return {
      id: course.id,
      title: course.title,
      slug: course.slug,
      description: course.description,
      sequenceOrder: course.sequence_order,
      prerequisiteTopicId: course.prerequisite_topic_id ?? null,
      topics,
      topicCount: topics.length,
      lessonCount: topics.reduce((sum, topic) => sum + topic.subtopicCount, 0),
      // Existing topic views already use five minutes per lesson when an
      // estimate is absent. Preserve that documented presentation fallback
      // rather than inventing a separate path-only duration.
      estMinutes: topics.length ? configuredDurations + unconfiguredLessons * 5 : null,
      difficulty: difficultyValues.length === 1 ? difficultyValues[0] : difficultyValues.length > 1 ? "Mixed difficulty" : null,
    };
  });
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

// Topics for a course, enriched with the same metrics the legacy hardcoded
// topic cards show (subtopic count, estimated duration, quiz question
// count) so dynamic Supabase-backed courses render identical rich cards
// instead of a plain numbered list.
//
// Single nested/embedded query (topics -> subtopics -> quizzes) instead of
// three sequential round trips.
//
// Graceful fallbacks: difficulty defaults to "Standard" when null (the
// topics.difficulty column is nullable by design); estMinutes defaults to
// ~5 minutes per subtopic when topics.est_minutes hasn't been set -- the
// metrics bar always renders something rather than disappearing just
// because a topic hasn't been backfilled with that metadata yet.
export async function getPublicTopicsWithStats(courseId: string): Promise<CmsTopicWithStats[]> {
  const supabase = createSupabaseServerClient();

  const { data: topics, error } = await supabase
    .from("topics")
    .select(
      `id, title, slug, sequence_order, difficulty, est_minutes,
       subtopics ( id, quizzes ( questions_json ) )`
    )
    .eq("course_id", courseId)
    .order("sequence_order", { ascending: true });

  if (error || !topics || topics.length === 0) {
    if (error) console.error("getPublicTopicsWithStats failed", error);
    return [];
  }

  return (topics as unknown as (NestedTopicRow & {
    title: string;
    slug: string;
    sequence_order: number;
    difficulty: string | null;
    est_minutes: number | null;
  })[]).map((t) => {
    const subtopics = t.subtopics ?? [];
    const subtopicCount = subtopics.length;
    const quizQuestionCount = subtopics.reduce((sum, s) => sum + countQuizQuestions(s.quizzes), 0);
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
// needs, fetched via a single nested/embedded query (all topics in the
// course plus each one's subtopics and quizzes) instead of three
// sequential round trips.
export async function getPublicTopicDetail(courseId: string, topicSlug: string): Promise<CmsTopicDetail | null> {
  const supabase = createSupabaseServerClient();

  const { data: allTopics, error } = await supabase
    .from("topics")
    .select(
      `id, title, slug, sequence_order, difficulty,
       subtopics ( id, title, sequence_order, est_minutes, quizzes ( questions_json ) )`
    )
    .eq("course_id", courseId)
    .order("sequence_order", { ascending: true });

  if (error || !allTopics) {
    if (error) console.error("getPublicTopicDetail failed", error);
    return null;
  }

  type RawSubtopic = {
    id: string;
    title: string;
    sequence_order: number;
    est_minutes: number | null;
    quizzes: NestedQuizRow[] | NestedQuizRow | null;
  };
  type RawTopic = {
    id: string;
    title: string;
    slug: string;
    sequence_order: number;
    difficulty: string | null;
    subtopics: RawSubtopic[] | null;
  };

  const topicRow = (allTopics as unknown as RawTopic[]).find((t) => t.slug === topicSlug);
  if (!topicRow) return null;

  const subtopicRows = (topicRow.subtopics ?? []).map((s) => ({
    id: s.id,
    title: s.title,
    sequence_order: s.sequence_order,
    estMinutes: s.est_minutes && s.est_minutes > 0 ? s.est_minutes : 5,
  }));

  const quizQuestionCount = (topicRow.subtopics ?? []).reduce(
    (sum, s) => sum + countQuizQuestions(s.quizzes),
    0
  );

  return {
    topic: {
      id: topicRow.id,
      title: topicRow.title,
      slug: topicRow.slug,
      sequence_order: topicRow.sequence_order,
      difficulty: topicRow.difficulty && String(topicRow.difficulty).trim() ? String(topicRow.difficulty) : "Standard",
      estMinutes: Math.max(subtopicRows.reduce((sum, s) => sum + s.estMinutes, 0), 5),
      subtopicCount: subtopicRows.length,
      quizQuestionCount,
    },
    topicCount: allTopics.length,
    subtopics: subtopicRows,
    quizQuestionCount,
  };
}

export { cmsModuleSlug };
