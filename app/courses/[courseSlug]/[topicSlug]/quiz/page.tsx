"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCourse } from "../../../../../lib/courses";
import QuizEngine from "../../../../../components/QuizEngine";
import ModuleAccessGate from "../../../../../components/ModuleAccessGate";
import { useAuth } from "../../../../../components/AuthProvider";
import { loadRemoteProgress } from "../../../../../lib/progress";

export default function TopicQuizPage({
  params,
}: {
  params: { courseSlug: string; topicSlug: string };
}) {
  const course = getCourse(params.courseSlug);
  if (!course) notFound();
  const topic = course.topics.find((t) => t.slug === params.topicSlug);
  if (!topic) notFound();

  const { user, loading: authLoading } = useAuth();
  const [checked, setChecked] = useState(false);
  const [lessonsIncomplete, setLessonsIncomplete] = useState(false);

  const idx = course.topics.findIndex((t) => t.slug === topic.slug);
  const next = course.topics[idx + 1];

  useEffect(() => {
    if (authLoading || !user) {
      setChecked(true);
      return;
    }
    (async () => {
      const progress = await loadRemoteProgress(user.id);
      const done = progress[topic.slug]?.lessonsCompleted.length ?? 0;
      setLessonsIncomplete(done < topic.lessons.length);
      setChecked(true);
    })();
  }, [user, authLoading, topic.slug, topic.lessons.length]);

  if (!authLoading && !user) {
    return (
      <div className="glass-card glow-border mx-auto max-w-lg rounded-2xl p-10 text-center">
        <div className="text-5xl">🔒</div>
        <h1 className="mt-4 text-xl font-bold text-[var(--text-hi)]">Sign in to take this assignment</h1>
        <p className="mt-2 text-sm text-[var(--text-mid)]">
          Assignments and certifications are tied to your account so progress syncs across devices.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/login"
            className="rounded-md bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--primary-dark)]"
          >
            Sign In
          </Link>
          <Link
            href={`/courses/${course.slug}/${topic.slug}`}
            className="rounded-md border border-[var(--border-strong)] bg-[var(--surface-2)] px-5 py-2.5 text-sm font-semibold text-[var(--text-hi)] transition hover:bg-[var(--surface-3)]"
          >
            ← Back to Topic
          </Link>
        </div>
      </div>
    );
  }

  return (
    <ModuleAccessGate moduleSlug={topic.slug}>
      {checked && lessonsIncomplete ? (
        <div className="glass-card glow-border mx-auto max-w-lg rounded-2xl p-10 text-center">
          <div className="text-5xl">📘</div>
          <h1 className="mt-4 text-xl font-bold text-[var(--text-hi)]">Finish the subtopics first</h1>
          <p className="mt-2 text-sm text-[var(--text-mid)]">
            Complete every subtopic in this topic before taking the assignment.
          </p>
          <Link
            href={`/courses/${course.slug}/${topic.slug}`}
            className="mt-6 inline-block rounded-md bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--primary-dark)]"
          >
            ← Back to Subtopics
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="text-center">
            <span className="badge-pill mx-auto w-fit">📝 Knowledge Check</span>
            <h1 className="mt-4 text-2xl font-bold text-[var(--text-hi)] sm:text-3xl">
              {topic.title} — Assignment
            </h1>
            <p className="mt-2 text-sm text-[var(--text-mid)]">
              {topic.quiz.length} questions · Instant feedback · 80% required to pass
            </p>
          </div>
          <QuizEngine
            moduleSlug={topic.slug}
            moduleTitle={topic.title}
            questions={topic.quiz}
            nextHref={next ? `/courses/${course.slug}/${next.slug}` : undefined}
            backHref={`/courses/${course.slug}`}
          />
        </div>
      )}
    </ModuleAccessGate>
  );
}
