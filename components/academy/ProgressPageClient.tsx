"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useAuth } from "../AuthProvider";
import { getComputedSkillProgress } from "../../lib/cms/skill-progress";
import { cmsModuleSlug } from "../../lib/cms/shared";
import { loadLocalProgress, loadRemoteProgress, type ProgressState } from "../../lib/progress";
import type { LearningPathCourse, SkillProgressItem } from "./learningPathTypes";
import SkillProgress from "./SkillProgress";
import { getLearningPathProgress } from "./learningPathState";
import { supabase } from "../../lib/supabaseClient";

type QuizAttempt = { module_slug: string; score_pct: number; passed: boolean; attempted_at: string };

function moduleTitle(courses: LearningPathCourse[], moduleSlug: string) {
  for (const course of courses) {
    for (const topic of course.topics) {
      if (cmsModuleSlug(course.slug, topic.slug) === moduleSlug) return `${course.title} · ${topic.title}`;
    }
  }
  return moduleSlug.replace(/^cms:/, "").replace(/:/g, " · ");
}

export default function ProgressPageClient({ courses }: { courses: LearningPathCourse[] }) {
  const { user, loading: authLoading } = useAuth();
  const [progress, setProgress] = useState<ProgressState>({});
  const [skills, setSkills] = useState<SkillProgressItem[] | null>(null);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    let cancelled = false;
    async function load() {
      setLoading(true);
      const nextProgress = user ? await loadRemoteProgress(user.id) : loadLocalProgress();
      const [nextSkills, attemptsResult] = await Promise.all([
        getComputedSkillProgress(nextProgress),
        user
          ? supabase.from("quiz_attempts").select("module_slug,score_pct,passed,attempted_at").eq("employee_id", user.id).order("attempted_at", { ascending: false }).limit(20)
          : Promise.resolve({ data: [] as QuizAttempt[] }),
      ]);
      if (!cancelled) {
        setProgress(nextProgress);
        setSkills(nextSkills);
        setAttempts((attemptsResult.data ?? []) as QuizAttempt[]);
        setLoading(false);
      }
    }
    void load();
    return () => { cancelled = true; };
  }, [authLoading, user]);

  const courseProgress = useMemo(() => getLearningPathProgress(courses, progress), [courses, progress]);
  const totals = useMemo(() => {
    const totalLessons = courseProgress.reduce((sum, item) => sum + item.totalLessons, 0);
    const completedLessons = courseProgress.reduce((sum, item) => sum + item.completedLessons, 0);
    return { totalLessons, completedLessons, percentage: totalLessons ? Math.round((completedLessons / totalLessons) * 100) : 0 };
  }, [courseProgress]);

  if (loading) return <div className="py-16 text-center text-sm text-[var(--text-lo)]">Loading your progress…</div>;

  return (
    <div className="mx-auto max-w-5xl space-y-10 pb-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--primary)]">Learning record</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[var(--text-hi)]">Your progress</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--text-mid)]">Track completed lessons, your growing Kinetic skills, and assessment history.</p>
      </header>

      <section className="border-y border-[var(--border)] py-6" aria-labelledby="course-progress-heading">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <div><p className="text-xs font-semibold uppercase tracking-[0.13em] text-[var(--text-lo)]">Course completion</p><h2 id="course-progress-heading" className="mt-1 text-xl font-semibold text-[var(--text-hi)]">{totals.completedLessons} of {totals.totalLessons} lessons completed</h2></div>
          <span className="text-2xl font-bold tabular-nums text-[var(--primary)]">{totals.percentage}%</span>
        </div>
        <div className="progress-track mt-4 h-2.5" role="progressbar" aria-label="Overall course completion" aria-valuenow={totals.percentage} aria-valuemin={0} aria-valuemax={100}><div className="progress-fill h-full" style={{ width: `${totals.percentage}%` }} /></div>
      </section>

      <section className="grid gap-4 md:grid-cols-2" aria-label="Course progress">
        {courseProgress.map((item) => (
          <Link key={item.course.id} href={`/courses/${item.course.slug}`} className="border border-[var(--border)] bg-[var(--surface)] p-5 transition hover:border-[var(--primary)]">
            <div className="flex items-start justify-between gap-3"><h2 className="font-semibold text-[var(--text-hi)]">{item.course.title}</h2><span className="text-sm font-semibold tabular-nums text-[var(--primary)]">{item.completion}%</span></div>
            <p className="mt-2 text-sm text-[var(--text-mid)]">{item.completedLessons} of {item.totalLessons} lessons · {item.completedTopics} topics certified</p>
            <div className="progress-track mt-4 h-2"><div className="progress-fill h-full" style={{ width: `${item.completion}%` }} /></div>
          </Link>
        ))}
      </section>

      <SkillProgress items={skills ?? []} source={skills?.length ? "skills" : "empty"} />

      <section aria-labelledby="quiz-history-heading">
        <div className="flex flex-wrap items-baseline justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.13em] text-[var(--text-lo)]">Assessments</p><h2 id="quiz-history-heading" className="mt-1 text-xl font-semibold text-[var(--text-hi)]">Quiz history</h2></div>{!user && <p className="text-xs text-[var(--text-lo)]">Sign in to keep assessment history across devices.</p>}</div>
        {attempts.length > 0 ? <div className="mt-4 overflow-hidden border border-[var(--border)]"><div className="grid grid-cols-[minmax(0,1fr)_auto_auto] gap-4 bg-[var(--surface-2)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-[var(--text-lo)]"><span>Assessment</span><span>Score</span><span>Date</span></div>{attempts.map((attempt, index) => <div key={`${attempt.module_slug}-${attempt.attempted_at}-${index}`} className="grid grid-cols-[minmax(0,1fr)_auto_auto] gap-4 border-t border-[var(--border)] px-4 py-3 text-sm"><span className="truncate font-medium text-[var(--text-hi)]">{moduleTitle(courses, attempt.module_slug)}</span><span className={attempt.passed ? "font-semibold text-[var(--success)]" : "font-semibold text-[var(--text-mid)]"}>{attempt.score_pct}%</span><time className="text-[var(--text-lo)]" dateTime={attempt.attempted_at}>{new Date(attempt.attempted_at).toLocaleDateString()}</time></div>)}</div> : <p className="mt-4 border border-dashed border-[var(--border-strong)] px-4 py-7 text-center text-sm text-[var(--text-lo)]">No assessment attempts yet. Knowledge checks and topic assessments will appear here after you take them.</p>}
      </section>
    </div>
  );
}
