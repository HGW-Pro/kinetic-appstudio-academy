"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useAuth } from "./AuthProvider";
import { getEmployeeSkillProgress } from "../lib/cms/skill-progress";
import { cmsModuleSlug } from "../lib/cms/shared";
import { loadLocalProgress, loadRemoteProgress, type ProgressState } from "../lib/progress";
import LearningPath from "./academy/LearningPath";
import SkillProgress from "./academy/SkillProgress";
import { getCurrentLearning, getLearningPathProgress } from "./academy/learningPathState";
import type { LearningPathCourse, SkillProgressItem } from "./academy/learningPathTypes";

type DashboardProps = {
  courses: LearningPathCourse[];
};

export default function CmsDashboardClient({ courses }: DashboardProps) {
  const { user, loading: authLoading } = useAuth();
  const [progress, setProgress] = useState<ProgressState>({});
  const [skillProgress, setSkillProgress] = useState<SkillProgressItem[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    let cancelled = false;

    async function loadDashboard() {
      setLoading(true);
      const [nextProgress, skills] = await Promise.all([
        user ? loadRemoteProgress(user.id) : Promise.resolve(loadLocalProgress()),
        getEmployeeSkillProgress(user?.id),
      ]);
      if (!cancelled) {
        setProgress(nextProgress);
        setSkillProgress(skills);
        setLoading(false);
      }
    }

    void loadDashboard();
    return () => {
      cancelled = true;
    };
  }, [authLoading, user]);

  const path = useMemo(() => getLearningPathProgress(courses, progress), [courses, progress]);
  const current = useMemo(() => getCurrentLearning(courses, progress), [courses, progress]);
  const courseProxySkills = useMemo(
    () => path.map((item) => ({ id: item.course.id, name: item.course.title, percentage: item.completion })),
    [path]
  );
  const skillsSource = skillProgress?.length ? "skills" : courseProxySkills.length ? "course-proxy" : "empty";

  const totals = useMemo(() => {
    const totalLessons = path.reduce((sum, item) => sum + item.totalLessons, 0);
    const completedLessons = path.reduce((sum, item) => sum + item.completedLessons, 0);
    const completedTopics = path.reduce((sum, item) => sum + item.completedTopics, 0);
    const totalTopics = courses.reduce((sum, course) => sum + course.topicCount, 0);
    const bestScores = Object.values(progress)
      .map((item) => item.quizScore)
      .filter((score): score is number => typeof score === "number");
    return {
      completion: totalLessons ? Math.round((completedLessons / totalLessons) * 100) : 0,
      completedLessons,
      totalLessons,
      completedTopics,
      totalTopics,
      averageQuiz: bestScores.length ? Math.round(bestScores.reduce((sum, score) => sum + score, 0) / bestScores.length) : null,
    };
  }, [courses, path, progress]);

  const learnerName =
    (typeof user?.user_metadata?.full_name === "string" && user.user_metadata.full_name) ||
    user?.email?.split("@")[0] ||
    "there";
  const currentTopic = current?.course.topics.find(
    (topic) => !progress[cmsModuleSlug(current.course.slug, topic.slug)]?.completedAt
  );
  const currentSubtopic = currentTopic?.subtopics.find(
    (subtopic) => !progress[cmsModuleSlug(current?.course.slug ?? "", currentTopic.slug)]?.lessonsCompleted.includes(subtopic.id)
  );

  if (loading) {
    return <div className="py-16 text-center text-sm text-[var(--text-lo)]">Loading your learning dashboard…</div>;
  }

  return (
    <div className="space-y-10 pb-4">
      <section className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--primary)]">Learning dashboard</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[var(--text-hi)]">Welcome back, {learnerName}</h1>
        <p className="mt-3 text-sm leading-6 text-[var(--text-mid)]">
          Pick up where you left off and keep building practical Kinetic skills.
        </p>
      </section>

      <section aria-labelledby="continue-heading" className="border-y border-[var(--border)] py-7">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--primary)]">Next step</p>
            <h2 id="continue-heading" className="mt-1 text-xl font-semibold text-[var(--text-hi)]">Continue learning</h2>
          </div>
          {current && <span className="text-sm tabular-nums text-[var(--text-lo)]">{current.completion}% complete</span>}
        </div>

        {current ? (
          <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div>
              <p className="text-sm font-medium text-[var(--primary)]">{current.course.title}</p>
              <h3 className="mt-1 text-2xl font-semibold tracking-tight text-[var(--text-hi)]">
                {currentSubtopic?.title ?? currentTopic?.title ?? "Continue your course"}
              </h3>
              <p className="mt-2 text-sm text-[var(--text-mid)]">
                {currentSubtopic
                  ? `Up next in ${currentTopic?.title}.`
                  : `${current.completedLessons} of ${current.totalLessons} lessons completed.`}
              </p>
              <div className="progress-track mt-5 h-2.5 max-w-2xl" role="progressbar" aria-label={`${current.course.title} progress`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={current.completion}>
                <div className="progress-fill h-full" style={{ width: `${current.completion}%` }} />
              </div>
            </div>
            <Link
              href={`/courses/${current.course.slug}${currentTopic ? `/${currentTopic.slug}` : ""}`}
              className="inline-flex min-h-11 items-center justify-center rounded-md bg-[var(--primary)] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--primary-dark)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]"
            >
              {current.completion ? "Continue learning" : "Start course"} <span aria-hidden="true" className="ml-2">→</span>
            </Link>
          </div>
        ) : courses.length ? (
          <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-[var(--text-mid)]">You have completed every published course in this learning path.</p>
            <Link href="/learning-path" className="text-sm font-semibold text-[var(--primary)] hover:text-[var(--primary-dark)]">Review your path →</Link>
          </div>
        ) : (
          <p className="mt-5 text-sm text-[var(--text-mid)]">Published courses will appear here as soon as they are ready.</p>
        )}
      </section>

      <section aria-labelledby="journey-heading">
        <div className="flex items-baseline justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--primary)]">Curriculum</p>
            <h2 id="journey-heading" className="mt-1 text-xl font-semibold text-[var(--text-hi)]">Your Kinetic journey</h2>
          </div>
          <Link href="/learning-path" className="text-sm font-semibold text-[var(--primary)] hover:text-[var(--primary-dark)]">View learning path →</Link>
        </div>
        <div className="mt-4 max-w-4xl">
          <LearningPath courses={courses} progress={progress} compact />
        </div>
      </section>

      <div className="grid gap-x-12 gap-y-10 xl:grid-cols-[minmax(0,1fr)_minmax(18rem,0.75fr)]">
        <SkillProgress items={skillProgress?.length ? skillProgress : courseProxySkills} source={skillsSource} />

        <section aria-labelledby="challenge-heading" className="border-l-2 border-[var(--accent)] px-5 py-1">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">Practice</p>
          <h2 id="challenge-heading" className="mt-1 text-lg font-semibold text-[var(--text-hi)]">Today&apos;s challenge</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--text-mid)]">
            Build a Customer Entry Panel and configure an order-date default in a guided Application Studio simulation.
          </p>
          <Link href="/challenges" className="mt-4 inline-flex min-h-10 items-center text-sm font-semibold text-[var(--primary)] hover:text-[var(--primary-dark)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]">
            Start challenge <span aria-hidden="true" className="ml-2">→</span>
          </Link>
        </section>
      </div>

      <section aria-labelledby="statistics-heading" className="border-t border-[var(--border)] pt-7">
        <h2 id="statistics-heading" className="text-sm font-semibold text-[var(--text-hi)]">Learning statistics</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Statistic label="Overall progress" value={`${totals.completion}%`} />
          <Statistic label="Lessons completed" value={`${totals.completedLessons}/${totals.totalLessons}`} />
          <Statistic label="Topics certified" value={`${totals.completedTopics}/${totals.totalTopics}`} />
          <Statistic label="Best quiz average" value={totals.averageQuiz === null ? "No attempts yet" : `${totals.averageQuiz}%`} />
        </div>
      </section>
    </div>
  );
}

function Statistic({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-l border-[var(--border-strong)] pl-4">
      <p className="text-xl font-bold tabular-nums text-[var(--text-hi)]">{value}</p>
      <p className="mt-1 text-xs text-[var(--text-lo)]">{label}</p>
    </div>
  );
}
