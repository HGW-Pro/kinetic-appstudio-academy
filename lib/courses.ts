import { modules } from "./allModules";
import type { Module } from "./curriculum";

// Course -> Main Topic -> Subtopic
// A "Main Topic" is a Module (e.g. "Data Rules & Events"); a "Subtopic" is a Lesson.
// New courses are added simply by appending to this array — nothing else in the
// app needs to change to support them.
export type Course = {
  slug: string;
  title: string;
  description: string;
  icon: string;
  topics: Module[];
  comingSoon?: boolean;
};

export const courses: Course[] = [
  {
    slug: "kinetic-application-studio",
    title: "Kinetic Application Studio",
    description:
      "Master Epicor Kinetic's low-code customization environment — from logging in, through Application Map, Data Rules, Events, DataViews, and Functions, to publishing production-grade layers.",
    icon: "🧭",
    topics: modules,
  },
  {
    slug: "baq-to-updatable-baq",
    title: "BAQ to Updatable BAQ",
    description:
      "Turn a read-only Business Activity Query into a fully updatable data entry screen. Coming soon.",
    icon: "🗄️",
    topics: [],
    comingSoon: true,
  },
];

export function getCourse(courseSlug: string) {
  return courses.find((c) => c.slug === courseSlug);
}

export function getTopic(courseSlug: string, topicSlug: string) {
  const course = getCourse(courseSlug);
  return course?.topics.find((t) => t.slug === topicSlug);
}

export function totalSubtopics(course: Course) {
  return course.topics.reduce((n, t) => n + t.lessons.length, 0);
}

export function totalCourseMinutes(course: Course) {
  return course.topics.reduce((n, t) => n + t.estMinutes, 0);
}
