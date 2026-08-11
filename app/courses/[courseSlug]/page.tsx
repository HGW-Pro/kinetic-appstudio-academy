"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCourse } from "../../../lib/courses";
import { useAuth } from "../../../components/AuthProvider";
import { loadLocalProgress, loadRemoteProgress, type ProgressState } from "../../../lib/progress";

export default function CourseTopicsPage({ params }: { params: { courseSlug: string } }) {
  const course = getCourse(params.courseSlug);
  if (!course) notFound();

  const { user, loading: authLoading } = useAuth();
  const [progress, setProgress] = useState<ProgressState>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    (async () => {
      const p = user ? await loadRemoteProgress(user.id) : loadLocalProgress();
      setProgress(p);
      setReady(true);
    })();
  }, [user, authLoading]);

  const topics = course.topics;
  const highestUnlocked = (() => {
    if (!user) return 0;
    let idx = 0;
    for (let i = 0; i < topics.length; i++) {
      if (progress[topics[i].slug]?.completedAt) idx = i + 1;
      else break;
    }
    return Math.min(idx, Math.max(topics.length - 1, 0));
  })();

  return (
    <div className="space-y-8">
      <div>
        <span className="badge-pill">
          {course.icon} Course · {topics.length} Topics
        </span>
        <h1 className="mt-4 text-3xl font-bold text-[var(--text-hi)]">{course.title}</h1>
        <p className="mt-2 max-w-2xl text-sm text-[var(--text-mid)]">{course.tagline}</p>
      </div>

      <div className="space-y-4">
        {topics.map((t, idx) => {
          const isCertified = !!progress[t.slug]?.completedAt;
          const isLocked = ready && (!user ? idx > 0 : idx > highestUnlocked);
          const card = (
            <div
              className={`group glass-card flex flex-col gap-4 rounded-xl p-6 transition sm:flex-row sm:items-center sm:justify-between ${
                isLocked ? "opacity-60" : "hover:-translate-y-0.5 hover:shadow-md"
              }`}
            >
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[var(--surface-2)] text-2xl">
                  {isLocked ? "🔒" : t.icon}
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[var(--primary)]">
                    Topic {idx + 1} · {t.difficulty}
                    {isCertified ? " · 🏆 Certified" : ""}
                  </p>
                  <h2 className="mt-1 text-lg font-semibold text-[var(--text-hi)] group-hover:text-[var(--primary)]">
                    {t.title}
                  </h2>
                  <p className="mt-1 text-sm text-[var(--text-mid)]">{t.tagline}</p>
                  {isLocked && (
                    <p className="mt-1 text-xs text-[var(--text-lo)]">
                      {user ? "Complete the previous topic to unlock" : "Sign in to unlock"}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-4 pl-16 text-xs text-[var(--text-lo)] sm:pl-0 sm:text-right">
                <div>
                  <p className="text-sm font-semibold text-[var(--text-hi)]">{t.lessons.length}</p>
                  <p>subtopics</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--text-hi)]">{t.estMinutes}m</p>
                  <p>duration</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--text-hi)]">{t.quiz.length}</p>
                  <p>quiz Qs</p>
                </div>
                {!isLocked && (
                  <span className="text-lg text-[var(--text-lo)] transition group-hover:translate-x-1 group-hover:text-[var(--primary)]">
                    →
                  </span>
                )}
              </div>
            </div>
          );

          return isLocked ? (
            <div key={t.slug} className="cursor-not-allowed">
              {card}
            </div>
          ) : (
            <Link key={t.slug} href={`/courses/${course.slug}/${t.slug}`}>
              {card}
            </Link>
          );
        })}
      </div>

      <div className="text-center">
        <Link href="/" className="text-sm font-medium text-[var(--primary)] hover:underline">
          ← Back to Course Catalog
        </Link>
      </div>
    </div>
  );
}
