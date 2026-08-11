"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { getCourse } from "../../../../lib/courses";
import SubtopicPlayer from "../../../../components/SubtopicPlayer";
import ModuleAccessGate from "../../../../components/ModuleAccessGate";
import { useAuth } from "../../../../components/AuthProvider";
import { enrollInModule } from "../../../../lib/progress";

export default function TopicPage({
  params,
}: {
  params: { courseSlug: string; topicSlug: string };
}) {
  const course = getCourse(params.courseSlug);
  if (!course) notFound();
  const topic = course.topics.find((t) => t.slug === params.topicSlug);
  if (!topic) notFound();

  const { user } = useAuth();
  const [enrolled, setEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);

  const idx = course.topics.findIndex((t) => t.slug === topic.slug);
  const prev = course.topics[idx - 1];
  const next = course.topics[idx + 1];

  useEffect(() => {
    setEnrolled(false);
  }, [topic.slug]);

  async function handleEnroll() {
    if (!user) return;
    setEnrolling(true);
    await enrollInModule(user.id, topic.slug);
    setEnrolling(false);
    setEnrolled(true);
  }

  return (
    <ModuleAccessGate moduleSlug={topic.slug}>
      <div className="space-y-10">
        <div className="glass-card glow-border rounded-2xl p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{topic.icon}</span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--primary)]">
                  {course.title} · Topic {idx + 1} of {course.topics.length} · {topic.difficulty}
                </p>
                <h1 className="text-2xl font-bold text-[var(--text-hi)] sm:text-3xl">{topic.title}</h1>
              </div>
            </div>

            {user ? (
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

        <SubtopicPlayer topicSlug={topic.slug} lessons={topic.lessons} />

        <div className="glass-card rounded-2xl p-6 text-center">
          <h2 className="text-lg font-semibold text-[var(--text-hi)]">
            Ready to test your knowledge?
          </h2>
          <p className="mt-1 text-sm text-[var(--text-mid)]">
            Score 80% or higher on the {topic.quiz.length}-question assignment to earn this topic's
            badge and unlock the next one.
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
            <Link
              href={`/courses/${course.slug}/${prev.slug}`}
              className="text-[var(--text-mid)] hover:text-[var(--primary)]"
            >
              ← {prev.title}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              href={`/courses/${course.slug}/${next.slug}`}
              className="text-[var(--text-mid)] hover:text-[var(--primary)]"
            >
              {next.title} →
            </Link>
          ) : (
            <span />
          )}
        </div>
      </div>
    </ModuleAccessGate>
  );
}
