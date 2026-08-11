"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import { getCourse, getTopic } from "../../../../../lib/courses";
import TopicAccessGate from "../../../../../components/TopicAccessGate";
import SubtopicStepper from "../../../../../components/SubtopicStepper";
import { useAuth } from "../../../../../components/AuthProvider";
import { loadLocalProgress, loadRemoteProgress, markLessonComplete } from "../../../../../lib/progress";
import { playSound } from "../../../../../lib/sounds";

export default function SubtopicPage({
  params,
}: {
  params: { courseSlug: string; topicSlug: string; lessonId: string };
}) {
  const course = getCourse(params.courseSlug);
  const topic = getTopic(params.courseSlug, params.topicSlug);
  if (!course || !topic) notFound();

  const lessonIndex = topic.lessons.findIndex((l) => l.id === params.lessonId);
  const lesson = topic.lessons[lessonIndex];
  if (!lesson) notFound();

  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    (async () => {
      if (!user) {
        setLocked(lessonIndex > 0);
        setChecked(true);
        return;
      }
      const progress = await loadRemoteProgress(user.id);
      const doneCount = progress[topic.slug]?.lessonsCompleted.length ?? 0;
      setLocked(lessonIndex > doneCount);
      setChecked(true);
    })();
  }, [user, authLoading, topic.slug, lessonIndex]);

  const isLastSubtopic = lessonIndex === topic.lessons.length - 1;
  const nextLesson = topic.lessons[lessonIndex + 1];

  function handleComplete() {
    if (!user) return;
    markLessonComplete(topic.slug, lesson.id, user.id);
    playSound(isLastSubtopic ? "complete" : "unlock");
    if (nextLesson) {
      router.push(`/courses/${course.slug}/${topic.slug}/${nextLesson.id}`);
    } else {
      router.push(`/courses/${course.slug}/${topic.slug}/quiz`);
    }
  }

  return (
    <TopicAccessGate courseSlug={course.slug} topicSlug={topic.slug}>
      {!checked ? null : locked ? (
        <div className="glass-card glow-border mx-auto max-w-lg rounded-2xl p-10 text-center">
          <div className="text-5xl">🔒</div>
          <h1 className="mt-4 text-xl font-bold text-[var(--text-hi)]">
            {user ? "Complete the previous subtopic first" : "Sign in required"}
          </h1>
          <p className="mt-2 text-sm text-[var(--text-mid)]">
            {user
              ? "Subtopics unlock strictly in order — go back and finish the one before this."
              : "You can preview the first subtopic, but signing in is required to progress further."}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href={`/courses/${course.slug}/${topic.slug}`}
              className="rounded-md border border-[var(--border-strong)] bg-[var(--surface-2)] px-5 py-2.5 text-sm font-semibold text-[var(--text-hi)] transition hover:bg-[var(--surface-3)]"
            >
              ← Back to Subtopics
            </Link>
            {!user && (
              <Link
                href="/login"
                className="rounded-md bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--primary-dark)]"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--primary)]">
              {topic.title} · Subtopic {lessonIndex + 1} of {topic.lessons.length}
            </p>
            <h1 className="mt-1 text-2xl font-bold text-[var(--text-hi)]">{lesson.title}</h1>
          </div>

          {user ? (
            <SubtopicStepper lesson={lesson} onComplete={handleComplete} isLastSubtopic={isLastSubtopic} />
          ) : (
            <div className="glass-card glow-border mx-auto max-w-xl rounded-2xl p-8 text-center">
              <p className="text-sm text-[var(--text-mid)]">
                {lesson.body[0]}
              </p>
              <p className="mt-4 text-sm text-[var(--text-lo)]">
                Sign in to unlock the full interactive walkthrough and mark this subtopic complete.
              </p>
              <Link
                href="/login"
                className="mt-5 inline-block rounded-md bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--primary-dark)]"
              >
                Sign In →
              </Link>
            </div>
          )}

          <div className="text-center">
            <Link
              href={`/courses/${course.slug}/${topic.slug}`}
              className="text-sm text-[var(--text-mid)] hover:text-[var(--primary)]"
            >
              ← Back to Subtopics
            </Link>
          </div>
        </div>
      )}
    </TopicAccessGate>
  );
}
