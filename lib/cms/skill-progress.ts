import { supabase } from "../supabaseClient";
import { cmsModuleSlug } from "./shared";
import type { ProgressState } from "../progress";
import type { SkillProgressItem } from "../../components/academy/learningPathTypes";

type SkillRow = {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  sequence_order?: number | null;
};
type TopicRow = {
  id: string;
  slug: string;
  course_id: string;
  skills: unknown;
  courses: { slug: string } | { slug: string }[] | null;
};
type SubtopicRow = { id: string; topic_id: string; skills: unknown };

function stringList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0).map((item) => item.trim());
}

function courseSlug(row: TopicRow): string | null {
  const course = Array.isArray(row.courses) ? row.courses[0] : row.courses;
  return course?.slug ?? null;
}

/**
 * Computes learner proficiency directly from the tagged CMS curriculum.
 * A tagged subtopic is one equally weighted unit. Topic tags apply to every
 * subtopic in that topic, while a subtopic may add more specific tags.
 * Passing a topic assessment (the existing `completedAt` contract) also
 * verifies its tagged units, so pre-existing quiz progress is represented.
 */
export async function getComputedSkillProgress(progress: ProgressState): Promise<SkillProgressItem[]> {
  const [skillsResult, topicsResult, subtopicsResult] = await Promise.all([
    supabase.from("skills").select("id,slug,name,sequence_order").order("sequence_order", { ascending: true }),
    supabase.from("topics").select("id,slug,course_id,skills,courses(slug)"),
    supabase.from("subtopics").select("id,topic_id,skills"),
  ]);

  if (skillsResult.error || !skillsResult.data?.length) return [];
  if (topicsResult.error || subtopicsResult.error) return [];

  const topics = (topicsResult.data ?? []) as TopicRow[];
  const subtopics = (subtopicsResult.data ?? []) as SubtopicRow[];
  const topicById = new Map(topics.map((topic) => [topic.id, topic]));
  const unitsBySkill = new Map<string, { total: number; completed: number }>();

  for (const lesson of subtopics) {
    const topic = topicById.get(lesson.topic_id);
    const owningCourseSlug = topic ? courseSlug(topic) : null;
    if (!topic || !owningCourseSlug) continue;

    const tags = new Set([...stringList(topic.skills), ...stringList(lesson.skills)]);
    if (tags.size === 0) continue;
    const moduleProgress = progress[cmsModuleSlug(owningCourseSlug, topic.slug)];
    const completed = Boolean(
      moduleProgress?.lessonsCompleted.includes(lesson.id) ||
      (moduleProgress?.completedAt && (moduleProgress.quizScore ?? 0) >= 80)
    );

    for (const tag of Array.from(tags)) {
      const bucket = unitsBySkill.get(tag) ?? { total: 0, completed: 0 };
      bucket.total += 1;
      if (completed) bucket.completed += 1;
      unitsBySkill.set(tag, bucket);
    }
  }

  return ((skillsResult.data ?? []) as SkillRow[])
    .sort((a, b) => (a.sequence_order ?? 9999) - (b.sequence_order ?? 9999))
    .map((skill) => {
      const bucket = unitsBySkill.get(skill.slug);
      return {
        id: skill.id,
        name: skill.name,
        percentage: bucket?.total ? Math.round((bucket.completed / bucket.total) * 100) : 0,
        taggedUnitCount: bucket?.total ?? 0,
      };
    });
}
