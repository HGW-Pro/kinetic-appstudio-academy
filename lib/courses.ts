import { modules } from "./allModules";
import type { Module } from "./curriculum";

// Course -> Topic -> Subtopic hierarchy.
// A "Topic" is exactly what we already model as a Module (it has Subtopics = Lessons + a Quiz).
// This wrapper lets us add future courses (e.g. "BAQ to Updatable BAQ") without touching
// the existing Kinetic Application Studio content at all.
export type Course = {
  slug: string;
  title: string;
  tagline: string;
  icon: string;
  status: "available" | "coming-soon";
  topics: Module[];
};

export const courses: Course[] = [
  {
    slug: "kinetic-application-studio",
    title: "Kinetic Application Studio",
    tagline:
      "Master Epicor Kinetic's low-code customization platform — login & navigation, Application Map, Components, Data Rules & Events, DataViews, Functions, and Publishing.",
    icon: "🧭",
    status: "available",
    topics: modules,
  },
  {
    slug: "baq-to-updatable-baq",
    title: "BAQ to Updatable BAQ",
    tagline: "Turn read-only Business Activity Queries into fully updatable data entry tools.",
    icon: "🛠️",
    status: "coming-soon",
    topics: [],
  },
];

export function getCourse(slug: string) {
  return courses.find((c) => c.slug === slug);
}

export function getTopic(courseSlug: string, topicSlug: string) {
  return getCourse(courseSlug)?.topics.find((t) => t.slug === topicSlug);
}
