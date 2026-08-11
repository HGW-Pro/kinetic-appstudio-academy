import { modules as baseModules } from "./curriculum";
import type { Module } from "./curriculum";
import { epicorBasicsModule } from "./epicorBasicsModule";

// Kinetic Application Studio — the single master course.
// epicorBasicsModule is prepended so employees start with general Epicor
// login/navigation before touching Application Studio itself.
export const modules: Module[] = [epicorBasicsModule, ...baseModules];

export function getModule(slug: string) {
  return modules.find((m) => m.slug === slug);
}

export function totalQuizQuestions() {
  return modules.reduce((sum, m) => sum + m.quiz.length, 0);
}
