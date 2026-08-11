import { modules } from "./allModules";
import type { Module } from "./curriculum";

// Course -> Topic -> Subtopic hierarchy.
// A "Topic" is an existing Module; a "Subtopic" is an existing Lesson.
// This wrapper lets us add entirely new courses later (e.g. "BAQ to Updatable BAQ")
// without touching the Kinetic Application Studio data at all — just push a new
// Course object with its own `topics` array built the same way allModules.ts does.
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
      "Master Epicor Kinetic's low-code customization platform — from login, through Application Map, Data Rules, Events, DataViews, Functions, and Publishing.",
    icon: "🧭",
    topics: modules,
  },
  // Future courses go here, e.g.:
  // {
  //   slug: "baq-to-updatable-baq",
  //   title: "BAQ to Updatable BAQ",
  //   tagline: "Turn a read-only BAQ into a fully updatable data entry screen.",
  //   icon: "🗃️",
  //   topics: [...],
  // },
];

export function getCourse(slug: string) {
  return courses.find((c) => c.slug === slug);
}

export function getTopic(courseSlug: string, topicSlug: string) {
  const course = getCourse(courseSlug);
  return course?.topics.find((t) => t.slug === topicSlug);
}
