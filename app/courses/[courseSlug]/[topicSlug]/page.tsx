"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCourse, getTopic } from "../../../../lib/courses";
import TopicAccessGate from "../../../../components/TopicAccessGate";
import { useAuth } from "../../../../components/AuthProvider";
import {
  loadLocalProgress,
  loadRemoteProgress,
  enrollInModule,
  type ProgressState,
} from "../../../../lib/progress";

export default function TopicPage({
  params,
}: {
  params: { courseSlug: string; topicSlug: string };
}) {
  const course = getCourse(params.courseSlug);
  if (!course) notFound();
  const topic = getTopic(params.courseSlug, params.topicSlug);
  if (!topic) notFound();

  const { user, loading: authLoading } = useAuth();
  const [progress, setProgress] = useState<ProgressState>({});
  const [ready, setReady] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [enrollError, setEnrollError] = useState<string | null>(null);

  const idx = course.topics.findIndex((t) => t.slug === topic.slug);
  const prevTopic = course.topics[idx - 1];
  const nextTopic = course.topics[idx + 1];

  useEffect(() => {
    if (authLoading) return;
    (async () => {
      const p = user ? await loadRemoteProgress(user.id) : loadLocalProgress();
      setProgress(p);
      setEnrolled(!!p[topic.slug]?.enrolled);
      setReady(true);
    })();
  }, [user, authLoading, topic.slug]);

  async function handleEnroll() {
    if (!user) return;
    setEnrolling(true);
    setEnrollError(null);
    const { error } = await enrollInModule(user.id, topic.slug);
    setEnrolling(false);
    if (error) {
      setEnrollError("Enrollment failed to save: " + error);
      return;
    }
    setEnrolled(true);
  }

  const doneIds = progress[topic.slug]?.lessonsCompleted ?? [];
  const highestUnlocked = user ? Math.min(doneIds.length, topic.lessons.length - 1) : 0;
  const firstIncomplete =
    topic.lessons.find((l) => !doneIds.includes(l.id)) ?? topic.lessons[topic.lessons.length - 1];
  const allDone = doneIds.length >= topic.lessons.length;
  const isCertified = !!progress[topic.slug]?.completedAt;

  return (
    <TopicAccessGate courseSlug={params.courseSlug} topics={course.topics} topicSlug={params.topicSlug}>
      <div className="space-y-8">
        <div className="glass-card glow-border rounded-2xl p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{topic.icon}</span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--primary)]">
                  Topic {idx + 1} of {course.topics.length} · {topic.difficulty}
                </p>
                <h1 className="text-2xl font-bold text-[var(--text-hi)] sm:text-3xl">{topic.title}</h1>
              </div>
            </div>

            {user ? (
              <div className="flex flex-col items-end gap-1">
                <button
                  onClick={handleEnroll}
                  disabled={enrolling || enrolled}
                  className={`rounded-md px-4 py-2 text-sm font-semibold shadow-sm transition ${
                    enrolled
                      ? "cursor-default bg-[var(--success-soft)] text-[var(--success)]"
                      : "bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)]"
                  }`}
                >
                  {enrolled ? "Enrolled ✓" : enrolling ? "Enrolling…" : "Enroll in Topic"}
                </button>
                {enrollError && (
                  <p className="max-w-xs text-right text-xs text-[var(--error)]">⚠️ {enrollError}</p>
                )}
              </div>
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
            {isCertified && <span className="badge-pill">🏆 Certified</span>}
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-[var(--primary)]">
            Subtopics
          </h2>
          <div className="space-y-2">
            {topic.lessons.map((l, i) => {
              const done = doneIds.includes(l.id);
              const locked = ready && i > highestUnlocked;
              const row = (
                <div
                  className={`flex items-center justify-between rounded-lg border px-4 py-3 transition ${
                    locked
                      ? "border-[var(--border)] bg-[var(--surface-2)] opacity-60"
                      : "border-[var(--border-strong)] bg-[var(--surface)] hover:bg-[var(--surface-2)]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                        done
                          ? "bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] text-white"
                          : locked
                          ? "bg-[var(--surface-3)] text-[var(--text-lo)]"
                          : "border border-[var(--primary)] text-[var(--primary)]"
                      }`}
                    >
                      {done ? "✓" : locked ? "🔒" : i + 1}
                    </span>
                    <span className="text-sm font-medium text-[var(--text-hi)]">{l.title}</span>
                  </div>
                  <span className="text-xs text-[var(--text-lo)]">{l.minutes} min</span>
                </div>
              );
              return locked ? (
                <div key={l.id}>{row}</div>
              ) : (
                <Link key={l.id} href={`/courses/${params.courseSlug}/${params.topicSlug}/${l.id}`}>
                  {row}
                </Link>
              );
            })}
          </div>

          <Link
            href={`/courses/${params.courseSlug}/${params.topicSlug}/${firstIncomplete.id}`}
            className="mt-5 inline-block rounded-md bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--primary-dark)]"
          >
            {doneIds.length === 0 ? "Start Topic →" : allDone ? "Review Subtopics →" : "Continue Learning →"}
          </Link>
        </div>

        <div className="glass-card rounded-2xl p-6 text-center">
          <h2 className="text-lg font-semibold text-[var(--text-hi)]">Ready to test your knowledge?</h2>
          <p className="mt-1 text-sm text-[var(--text-mid)]">
            {allDone
              ? `Score 80%+ on the ${topic.quiz.length}-question assignment to earn this topic's badge and unlock the next.`
              : "Finish every subtopic above first."}
          </p>
          {allDone ? (
            <Link
              href={`/courses/${params.courseSlug}/${params.topicSlug}/quiz`}
              className="mt-5 inline-block rounded-md bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--primary-dark)]"
            >
              Take the Assignment →
            </Link>
          ) : (
            <span className="mt-5 inline-block rounded-md bg-[var(--surface-2)] px-6 py-3 text-sm font-semibold text-[var(--text-lo)]">
              Locked
            </span>
          )}
        </div>

        <div className="flex items-center justify-between text-sm">
          {prevTopic ? (
            <Link
              href={`/courses/${params.courseSlug}/${prevTopic.slug}`}
              className="text-[var(--text-mid)] hover:text-[var(--primary)]"
            >
              ← {prevTopic.title}
            </Link>
          ) : (
            <span />
          )}
          {nextTopic ? (
            <Link
              href={`/courses/${params.courseSlug}/${nextTopic.slug}`}
              className="text-[var(--text-mid)] hover:text-[var(--primary)]"
            >
              {nextTopic.title} →
            </Link>
          ) : (
            <span />
          )}
        </div>
      </div>
    </TopicAccessGate>
  );
}
