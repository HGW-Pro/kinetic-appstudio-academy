export type LearningPathTopic = {
  id: string;
  title: string;
  slug: string;
  sequenceOrder: number;
  difficulty: string | null;
  estMinutes: number | null;
  subtopicCount: number;
  subtopics: { id: string; title: string; sequenceOrder: number }[];
};

export type LearningPathCourse = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  sequenceOrder: number;
  prerequisiteTopicId: string | null;
  topics: LearningPathTopic[];
  topicCount: number;
  lessonCount: number;
  estMinutes: number | null;
  difficulty: string | null;
};

export type LearningPathNodeStatus = "completed" | "current" | "upcoming" | "locked";

export type LearningPathCourseProgress = {
  course: LearningPathCourse;
  completion: number;
  completedLessons: number;
  totalLessons: number;
  completedTopics: number;
  status: LearningPathNodeStatus;
  prerequisiteTitle: string | null;
};

export type SkillProgressItem = {
  id: string;
  name: string;
  percentage: number;
  taggedUnitCount?: number;
};
