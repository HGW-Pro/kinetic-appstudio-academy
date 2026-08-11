"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { getCourse, getTopic } from "../../../../../lib/courses";
import TopicAccessGate from "../../../../../components/TopicAccessGate";
import { useAuth } from "../../../../../components/AuthProvider";
import { loadLocalProgress, loadRemoteProgress, markLessonComplete } from "../../../../../lib/progress";
import { playSound } from "../../../../../lib/sounds";
import FlowDiagramView from "../../../../../components/FlowDiagram";
import VisualMockup from "../../../../../components/VisualMockup";
import ImageGallery, { type LessonImage } from "../../../../../components/ImageGallery";

function renderBody(text: string) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : <span key={i}>{part}</span>
  );
}

export default function SubtopicPage({
  params,
}: {
  params: { courseSlug: string; topicSlug: string; subtopicId: string };
}) {
  const course = getCourse(params.courseSlug);
  if (!course) notFound();
  const topic = getTopic(params.courseSlug, params.topicSlug);
  if (!topic) notFound();
  const lessonIdx = topic.lessons.findIndex((l) => l.id === params.subtopicId);
  if (lessonIdx === -1) notFound();
  const lesson = topic.lessons[lessonIdx];

  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [progressChecked, setProgressChecked] = useState(false);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [locked, setLocked] = useState(false);
  const [revealCount, setRevealCount] = useState(1);
  const [reviewedExtras, setReviewedExtras] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    (async () => {
      const progress = user ? await loadRemoteProgress(user.id) : loadLocalProgress();
      const done = progress[topic.slug]?.lessonsCompleted ?? [];
      setCompletedIds(done);
      setLocked(lessonIdx > Math.min(done.length, topic.lessons.length - 1));
      setProgressChecked(true);
    })();
    setRevealCount(1);
    setReviewedExtras(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading, topic.slug, lessonIdx]);

  const lessonImages = (lesson as unknown as { images?: LessonImage[] }).images;
  const hasExtras = !!(lesson.mockup || lesson.flow || (lessonImages && lessonImages.length));
  const allParasRevealed = revealCount >= lesson.body.length;
  const canComplete = allParasRevealed && (!hasExtras || reviewedExtras);
  const isDone = completedIds.includes(lesson.id);

  const prevLesson = topic.lessons[lessonIdx - 1];
  const nextLesson = topic.lessons[lessonIdx + 1];

  function handleReveal() {
    playSound("click");
    setRevealCount((c) => Math.min(c + 1, lesson.body.length));
  }

  function handleReviewExtras() {
    playSound("click");
    setReviewedExtras(true);
  }

  function handleComplete() {
    if (!user || !canComplete) return;
    markLessonComplete(topic.slug, lesson.id, user.id);
    setCompletedIds((prev) => (prev.includes(lesson.id) ? prev : [...prev, lesson.id]));
    playSound(nextLesson ? "unlock" : "complete");
    if (nextLesson) {
      router.push(`/courses/${params.courseSlug}/${params.topicSlug}/${nextLesson.id}`);
    } else {
      router.push(`/courses/${params.courseSlug}/${params.topicSlug}/quiz`);
    }
  }

  return (
    <TopicAccessGate courseSlug={params.courseSlug} topics={course.topics} topicSlug={params.topicSlug}>
      {!progressChecked ? null : locked ? (
        <div className="glass-card glow-border mx-auto max-w-lg rounded-2xl p-10 text-center">
          <div className="text-5xl">🔒</div>
          <h1 className="mt-4 text-xl font-bold text-[var(--text-hi)]">This subtopic is locked</h1>
          <p className="mt-2 text-sm text-[var(--text-mid)]">
            Complete the previous subtopics in "{topic.title}" first.
          </p>
          <Link
            href={`/courses/${params.courseSlug}/${params.topicSlug}`}
            className="mt-6 inline-block rounded-md bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--primary-dark)]"
          >
            ← Back to Topic
          </Link>
        </div>
      ) : (
        <div className="mx-auto max-w-2xl space-y-6">
          <div className="flex items-center justify-center gap-1.5">
            {topic.lessons.map((l, i) => (
              <span
                key={l.id}
                className={`h-1.5 max-w-10 flex-1 rounded-full ${
                  i < lessonIdx || completedIds.includes(l.id)
                    ? "bg-[var(--primary)]"
                    : i === lessonIdx
                    ? "bg-[var(--primary-light)]"
                    : "bg-[var(--surface-3)]"
                }`}
              />
            ))}
          </div>
          <p className="text-center text-xs text-[var(--text-lo)]">
            Subtopic {lessonIdx + 1} of {topic.lessons.length} · {topic.title}
          </p>

          <div className="glass-card glow-border rounded-2xl p-8">
            <div className="flex items-center justify-between gap-3">
              <h1 className="text-xl font-bold text-[var(--text-hi)] sm:text-2xl">{lesson.title}</h1>
              <span className="badge-pill shrink-0">{lesson.minutes} min</span>
            </div>

            <div className="prose-lesson mt-6 space-y-4">
              {lesson.body.slice(0, revealCount).map((p, idx) => (
                <p key={idx} className="lesson-line">
                  {renderBody(p)}
                </p>
              ))}
            </div>

            {!allParasRevealed && (
              <button
                onClick={handleReveal}
                className="mt-5 w-full rounded-md border border-[var(--border-strong)] bg-[var(--surface-2)] px-5 py-3 text-sm font-semibold text-[var(--text-hi)] transition hover:bg-[var(--surface-3)]"
              >
                Continue Reading → ({revealCount}/{lesson.body.length})
              </button>
            )}

            {allParasRevealed && hasExtras && (
              <div className="mt-2">
                {lessonImages && lessonImages.length > 0 && <ImageGallery images={lessonImages} />}
                {lesson.mockup && <VisualMockup mockup={lesson.mockup} />}
                {lesson.flow && <FlowDiagramView flow={lesson.flow} />}
                {lesson.proTip && (
                  <div className="mt-4 rounded-lg border border-[var(--primary)]/20 bg-[var(--primary)]/[0.05] px-4 py-3 text-sm text-[var(--text-mid)]">
                    <span className="mr-2 font-semibold text-[var(--primary)]">💡 Pro tip:</span>
                    {lesson.proTip}
                  </div>
                )}
                {!reviewedExtras && (
                  <button
                    onClick={handleReviewExtras}
                    className="mt-4 w-full rounded-md border border-[var(--primary)] bg-[var(--primary)]/10 px-5 py-3 text-sm font-semibold text-[var(--primary)] transition hover:bg-[var(--primary)]/15"
                  >
                    👆 I've reviewed this — Continue
                  </button>
                )}
              </div>
            )}

            {allParasRevealed && !hasExtras && lesson.proTip && (
              <div className="mt-4 rounded-lg border border-[var(--primary)]/20 bg-[var(--primary)]/[0.05] px-4 py-3 text-sm text-[var(--text-mid)]">
                <span className="mr-2 font-semibold text-[var(--primary)]">💡 Pro tip:</span>
                {lesson.proTip}
              </div>
            )}

            <div className="mt-8 flex items-center justify-between border-t border-[var(--border)] pt-6">
              {prevLesson ? (
                <Link
                  href={`/courses/${params.courseSlug}/${params.topicSlug}/${prevLesson.id}`}
                  className="rounded-md border border-[var(--border-strong)] bg-[var(--surface-2)] px-5 py-2.5 text-sm font-semibold text-[var(--text-hi)] transition hover:bg-[var(--surface-3)]"
                >
                  ← Previous
                </Link>
              ) : (
                <span />
              )}

              {isDone ? (
                <span className="rounded-md bg-[var(--surface-2)] px-5 py-2.5 text-sm font-semibold text-[var(--text-lo)]">
                  Completed ✓
                </span>
              ) : user ? (
                <button
                  onClick={handleComplete}
                  disabled={!canComplete}
                  className={`rounded-md px-6 py-2.5 text-sm font-semibold shadow-sm transition ${
                    canComplete
                      ? "bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)]"
                      : "cursor-not-allowed bg-[var(--surface-3)] text-[var(--text-lo)]"
                  }`}
                >
                  {nextLesson ? "Complete & Continue →" : "Complete Topic →"}
                </button>
              ) : (
                <Link
                  href="/login"
                  className="rounded-md bg-[var(--primary)] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--primary-dark)]"
                >
                  Sign in to continue →
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </TopicAccessGate>
  );
}
