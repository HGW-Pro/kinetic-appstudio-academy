import { modules } from "./allModules";
import type { Module } from "./curriculum";

// A Course is the top-level catalog entity. Each Course contains an ordered
// list of "Main Topics" (Modules), each of which contains an ordered list of
// "Subtopics" (Lessons). This layer exists purely so new courses (e.g. a
// future "BAQ to Updatable BAQ" course) can be added later without touching
// the existing Kinetic Application Studio content at all.
export type Course = {
  slug: string;
  title: string;
  tagline: string;
  icon: string;
  topics: Module[];
};

export const courses: Course[] = [
  {
    slug: "kinetic-application-studio",
    title: "Kinetic Application Studio",
    tagline:
      "Master Epicor Kinetic from first login through building, publishing, and governing Application Studio customizations.",
    icon: "🧭",
    topics: modules,
  },
  // Future courses go here, e.g.:
  // {
  //   slug: "baq-to-updatable-baq",
  //   title: "BAQ to Updatable BAQ",
  //   tagline: "Turn read-only Business Activity Queries into fully updatable data entry tools.",
  //   icon: "🛠️",
  //   topics: [],
  // },
];

export function getCourse(slug: string) {
  return courses.find((c) => c.slug === slug);
}

export function getTopic(courseSlug: string, topicSlug: string) {
  const course = getCourse(courseSlug);
  if (!course) return undefined;
  return course.topics.find((t) => t.slug === topicSlug);
}

export function totalLessonsInCourse(course: Course) {
  return course.topics.reduce((n, t) => n + t.lessons.length, 0);
}

export function totalQuizQuestionsInCourse(course: Course) {
  return course.topics.reduce((n, t) => n + t.quiz.length, 0);
}
