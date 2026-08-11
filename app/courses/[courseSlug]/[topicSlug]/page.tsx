"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCourse, getTopic } from "../../../../lib/courses";
import TopicAccessGate from "../../../../components/TopicAccessGate";
import { useAuth } from "../../../../components/AuthProvider";
import { loadLocalProgress, loadRemoteProgress, enrollInModule, type ProgressState } from "../../../../lib/progress";

export default function TopicDetailPage({
  params,
}: {
  params: { courseSlug: string; topicSlug: string };
}) {
  const course = getCourse(params.courseSlug);
  const topic = getTopic(params.courseSlug, params.topicSlug);
  if (!course || !topic) notFound();

  const { user, loading: authLoading } = useAuth();
  const [progress, setProgress] = useState<ProgressState>({});
  const [ready, setReady] = useState(false);
  const [enrolled, setEnrolled] = useState(false);

  const idx = course.topics.findIndex((t) => t.slug === topic.slug);
  const prev = course.topics[idx - 1];
  const next = course.topics[idx + 1];

  useEffect(() => {
    if (authLoading) return;
    (async () => {
      const p = user ? await loadRemoteProgress(user.id) : loadLocalProgress();
      setProgress(p);
      setReady(true);
    })();
  }, [user, authLoading, topic.slug]);

  const doneCount = progress[topic.slug]?.lessonsCompleted.length ?? 0;
  const highestUnlockedSubtopic = user ? Math.min(doneCount, topic.lessons.length - 1) : -1;

  async function handleEnroll() {
    if (!user) return;
    await enrollInModule(user.id, topic.slug);
    setEnrolled(true);
  }

  return (
    <TopicAccessGate courseSlug={course.slug} topicSlug={topic.slug}>
      <div className="space-y-10">
        <div className="glass-card glow-border rounded-2xl p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{topic.icon}</span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--primary)]">
                  {course.title} · Main Topic {idx + 1} of {course.topics.length}
                </p>
                <h1 className="text-2xl font-bold text-[var(--text-hi)] sm:text-3xl">{topic.title}</h1>
              </div>
            </div>
            {user ? (
              <button
                onClick={handleEnroll}
                disabled={enrolled}
                className={`rounded-md px-4 py-2 text-sm font-semibold shadow-sm transition ${
                  enrolled
                    ? "cursor-default bg-[var(--success-soft)] text-[var(--success)]"
                    : "bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)]"
                }`}
              >
                {enrolled ? "Enrolled ✓" : "Enroll in Topic"}
              </button>
            ) : (
              <Link
                href="/login"
                className="rounded-md border border-[var(--border-strong)] bg-[var(--surface-2)] px-4 py-2 text-sm font-semibold text-[var(--text-hi)] transition hover:bg-[var(--surface-3)]"
              >
                Sign in to enroll
              </Link>
            )}
          </div>
          <p className="mt-4 max-w-2xl text-sm text-[var(--text-mid)]">{topic.tagline}</p>
          <div className="mt-5 flex flex-wrap gap-3 text-xs text-[var(--text-lo)]">
            <span className="badge-pill">{topic.lessons.length} subtopics</span>
            <span className="badge-pill">{topic.estMinutes} min</span>
            <span className="badge-pill">{topic.quiz.length}-question assignment</span>
          </div>
        </div>

        <div>
          <h2 className="mb-4 text-lg font-semibold text-[var(--text-hi)]">
            Subtopics — complete each one in order
          </h2>
          <div className="space-y-3">
            {topic.lessons.map((lesson, i) => {
              const isDone = progress[topic.slug]?.lessonsCompleted.includes(lesson.id) ?? false;
              const isLocked = ready && (!user || i > highestUnlockedSubtopic + 1);
              const isNext = !isLocked && !isDone && (i === 0 || (progress[topic.slug]?.lessonsCompleted.includes(topic.lessons[i - 1].id) ?? false));
              const row = (
                <div
                  className={`flex items-center justify-between gap-4 rounded-xl border p-4 transition ${
                    isLocked
                      ? "cursor-not-allowed border-[var(--border)] bg-[var(--surface-2)] opacity-60"
                      : "border-[var(--border-strong)] bg-[var(--surface)] hover:-translate-y-0.5 hover:shadow-sm"
                  } ${isNext ? "glow-border" : ""}`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                        isDone
                          ? "bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] text-white"
                          : isLocked
                          ? "bg-[var(--surface-3)] text-[var(--text-lo)]"
                          : "border border-[var(--primary)] text-[var(--primary)]"
                      }`}
                    >
                      {isDone ? "✓" : isLocked ? "🔒" : i + 1}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-[var(--text-hi)]">{lesson.title}</p>
                      <p className="text-xs text-[var(--text-lo)]">{lesson.minutes} min</p>
                    </div>
                  </div>
                  {!isLocked && (
                    <span className="text-lg text-[var(--text-lo)]">{isDone ? "Review" : "Start"} →</span>
                  )}
                </div>
              );
              return isLocked ? (
                <div key={lesson.id}>{row}</div>
              ) : (
                <Link key={lesson.id} href={`/courses/${course.slug}/${topic.slug}/${lesson.id}`}>
                  {row}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 text-center">
          <h2 className="text-lg font-semibold text-[var(--text-hi)]">Ready to test your knowledge?</h2>
          <p className="mt-1 text-sm text-[var(--text-mid)]">
            Score 80% or higher to earn this topic's badge and unlock the next one.
          </p>
          <Link
            href={`/courses/${course.slug}/${topic.slug}/quiz`}
            className="mt-5 inline-block rounded-md bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--primary-dark)]"
          >
            Take the Assignment →
          </Link>
        </div>

        <div className="flex items-center justify-between text-sm">
          {prev ? (
            <Link href={`/courses/${course.slug}/${prev.slug}`} className="text-[var(--text-mid)] hover:text-[var(--primary)]">
              ← {prev.title}
            </Link>
          ) : (
            <Link href={`/courses/${course.slug}`} className="text-[var(--text-mid)] hover:text-[var(--primary)]">
              ← All Topics
            </Link>
          )}
          {next && (
            <Link href={`/courses/${course.slug}/${next.slug}`} className="text-[var(--text-mid)] hover:text-[var(--primary)]">
              {next.title} →
            </Link>
          )}
        </div>
      </div>
    </TopicAccessGate>
  );
}
