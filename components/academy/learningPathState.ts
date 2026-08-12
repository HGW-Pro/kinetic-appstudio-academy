import { cmsModuleSlug } from "../../lib/cms/shared";
import type { ProgressState } from "../../lib/progress";
import type {
  LearningPathCourse,
  LearningPathCourseProgress,
  LearningPathNodeStatus,
} from "./learningPathTypes";

function clampPercentage(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function getLearningPathProgress(
  courses: LearningPathCourse[],
  progress: ProgressState
): LearningPathCourseProgress[] {
  const topicById = new Map(
    courses.flatMap((course) => course.topics.map((topic) => [topic.id, { course, topic }] as const))
  );

  return courses.map((course, index) => {
    const totalLessons = course.topics.reduce((sum, topic) => sum + topic.subtopicCount, 0);
    const completedLessons = course.topics.reduce((sum, topic) => {
      const completed = progress[cmsModuleSlug(course.slug, topic.slug)]?.lessonsCompleted.length ?? 0;
      return sum + Math.min(completed, topic.subtopicCount);
    }, 0);
    const completedTopics = course.topics.filter(
      (topic) => Boolean(progress[cmsModuleSlug(course.slug, topic.slug)]?.completedAt)
    ).length;
    const completion = totalLessons ? clampPercentage((completedLessons / totalLessons) * 100) : 0;
    const completed = course.topics.length > 0 && completedTopics === course.topics.length;
    const prerequisite = course.prerequisiteTopicId
      ? topicById.get(course.prerequisiteTopicId)
      : undefined;
    const prerequisiteTitle = prerequisite?.topic.title ?? null;
    const prerequisiteComplete = prerequisite
      ? Boolean(progress[cmsModuleSlug(prerequisite.course.slug, prerequisite.topic.slug)]?.completedAt)
      : null;
    const previousCoursesComplete = courses
      .slice(0, index)
      .every((previousCourse) =>
        previousCourse.topics.length > 0 &&
        previousCourse.topics.every((topic) => Boolean(progress[cmsModuleSlug(previousCourse.slug, topic.slug)]?.completedAt))
      );
    const unlocked = prerequisiteComplete ?? previousCoursesComplete;

    let status: LearningPathNodeStatus;
    if (completed) {
      status = "completed";
    } else if (!unlocked) {
      status = "locked";
    } else if (completion > 0 || courses.slice(0, index).every((prior) =>
      prior.topics.length > 0 &&
      prior.topics.every((topic) => Boolean(progress[cmsModuleSlug(prior.slug, topic.slug)]?.completedAt))
    )) {
      status = "current";
    } else {
      status = "upcoming";
    }

    return {
      course,
      completion,
      completedLessons,
      totalLessons,
      completedTopics,
      status,
      prerequisiteTitle,
    };
  });
}

export function getCurrentLearning(
  courses: LearningPathCourse[],
  progress: ProgressState
): LearningPathCourseProgress | null {
  const path = getLearningPathProgress(courses, progress);
  return path.find((item) => item.status === "current") ?? path.find((item) => item.status !== "completed") ?? null;
}
