export type ModuleProgress = {
  lessonsCompleted: string[];
  quizScore?: number; // percentage 0-100
  quizAttempts?: number;
  completedAt?: string;
};

export type ProgressState = Record<string, ModuleProgress>;

const KEY = "kinetic-academy-progress-v1";

export function loadProgress(): ProgressState {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as ProgressState) : {};
  } catch {
    return {};
  }
}

export function saveProgress(state: ProgressState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(state));
}

export function markLessonComplete(moduleSlug: string, lessonId: string) {
  const state = loadProgress();
  const mod = state[moduleSlug] ?? { lessonsCompleted: [] };
  if (!mod.lessonsCompleted.includes(lessonId)) {
    mod.lessonsCompleted = [...mod.lessonsCompleted, lessonId];
  }
  state[moduleSlug] = mod;
  saveProgress(state);
  return state;
}

export function recordQuizResult(moduleSlug: string, scorePct: number) {
  const state = loadProgress();
  const mod = state[moduleSlug] ?? { lessonsCompleted: [] };
  mod.quizScore = Math.max(scorePct, mod.quizScore ?? 0);
  mod.quizAttempts = (mod.quizAttempts ?? 0) + 1;
  if (scorePct >= 80 && !mod.completedAt) {
    mod.completedAt = new Date().toISOString();
  }
  state[moduleSlug] = mod;
  saveProgress(state);
  return state;
}

export function overallStats(totalModules: number, totalLessons: number) {
  const state = loadProgress();
  let lessonsDone = 0;
  let modulesCertified = 0;
  let bestScoreSum = 0;
  let scoredModules = 0;
  Object.values(state).forEach((m) => {
    lessonsDone += m.lessonsCompleted.length;
    if (m.completedAt) modulesCertified += 1;
    if (typeof m.quizScore === "number") {
      bestScoreSum += m.quizScore;
      scoredModules += 1;
    }
  });
  return {
    lessonsDone,
    totalLessons,
    modulesCertified,
    totalModules,
    avgScore: scoredModules ? Math.round(bestScoreSum / scoredModules) : 0,
  };
}
