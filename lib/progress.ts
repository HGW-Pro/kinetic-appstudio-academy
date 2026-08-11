import { supabase } from "./supabaseClient";

export type ModuleProgress = {
  lessonsCompleted: string[];
  quizScore?: number; // percentage 0-100
  quizAttempts?: number;
  completedAt?: string;
  enrolled?: boolean;
};

export type ProgressState = Record<string, ModuleProgress>;

const LOCAL_KEY = "kinetic-academy-progress-v1";

// ---- localStorage fallback (used when signed out, or as instant-UI cache) ----

export function loadLocalProgress(): ProgressState {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(LOCAL_KEY);
    return raw ? (JSON.parse(raw) as ProgressState) : {};
  } catch {
    return {};
  }
}

function saveLocalProgress(state: ProgressState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LOCAL_KEY, JSON.stringify(state));
}

// ---- Supabase-backed progress (used when signed in) ----

export async function loadRemoteProgress(userId: string): Promise<ProgressState> {
  const state: ProgressState = {};

  const [{ data: lessons }, { data: quizzes }, { data: enrollments }] = await Promise.all([
    supabase.from("lesson_progress").select("module_slug, lesson_id").eq("employee_id", userId),
    supabase
      .from("quiz_attempts")
      .select("module_slug, score_pct, passed, attempted_at")
      .eq("employee_id", userId)
      .order("attempted_at", { ascending: true }),
    supabase.from("enrollments").select("module_slug, status").eq("employee_id", userId),
  ]);

  (lessons ?? []).forEach((row) => {
    const mod = (state[row.module_slug] ??= { lessonsCompleted: [] });
    if (!mod.lessonsCompleted.includes(row.lesson_id)) {
      mod.lessonsCompleted.push(row.lesson_id);
    }
  });

  (quizzes ?? []).forEach((row) => {
    const mod = (state[row.module_slug] ??= { lessonsCompleted: [] });
    mod.quizScore = Math.max(row.score_pct, mod.quizScore ?? 0);
    mod.quizAttempts = (mod.quizAttempts ?? 0) + 1;
    if (row.passed && !mod.completedAt) {
      mod.completedAt = row.attempted_at;
    }
  });

  (enrollments ?? []).forEach((row) => {
    const mod = (state[row.module_slug] ??= { lessonsCompleted: [] });
    mod.enrolled = true;
  });

  return state;
}

export async function enrollInModule(userId: string, moduleSlug: string) {
  await supabase
    .from("enrollments")
    .upsert({ employee_id: userId, module_slug: moduleSlug }, { onConflict: "employee_id,module_slug" });
}

export async function markLessonCompleteRemote(userId: string, moduleSlug: string, lessonId: string) {
  await supabase
    .from("lesson_progress")
    .upsert(
      { employee_id: userId, module_slug: moduleSlug, lesson_id: lessonId },
      { onConflict: "employee_id,module_slug,lesson_id" }
    );
}

export async function recordQuizResultRemote(userId: string, moduleSlug: string, scorePct: number) {
  await supabase.from("quiz_attempts").insert({
    employee_id: userId,
    module_slug: moduleSlug,
    score_pct: scorePct,
    passed: scorePct >= 80,
  });
}

// ---- Unified helpers used by components: work signed-in or signed-out ----

export function markLessonComplete(moduleSlug: string, lessonId: string, userId?: string | null) {
  const state = loadLocalProgress();
  const mod = state[moduleSlug] ?? { lessonsCompleted: [] };
  if (!mod.lessonsCompleted.includes(lessonId)) {
    mod.lessonsCompleted = [...mod.lessonsCompleted, lessonId];
  }
  state[moduleSlug] = mod;
  saveLocalProgress(state);
  if (userId) void markLessonCompleteRemote(userId, moduleSlug, lessonId);
  return state;
}

export function recordQuizResult(moduleSlug: string, scorePct: number, userId?: string | null) {
  const state = loadLocalProgress();
  const mod = state[moduleSlug] ?? { lessonsCompleted: [] };
  mod.quizScore = Math.max(scorePct, mod.quizScore ?? 0);
  mod.quizAttempts = (mod.quizAttempts ?? 0) + 1;
  if (scorePct >= 80 && !mod.completedAt) {
    mod.completedAt = new Date().toISOString();
  }
  state[moduleSlug] = mod;
  saveLocalProgress(state);
  if (userId) void recordQuizResultRemote(userId, moduleSlug, scorePct);
  return state;
}

export function loadProgress(): ProgressState {
  return loadLocalProgress();
}

export function overallStats(totalModules: number, totalLessons: number, state?: ProgressState) {
  const s = state ?? loadLocalProgress();
  let lessonsDone = 0;
  let modulesCertified = 0;
  let bestScoreSum = 0;
  let scoredModules = 0;
  Object.values(s).forEach((m) => {
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
