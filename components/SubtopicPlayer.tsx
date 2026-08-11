"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Lesson } from "../lib/curriculum";
import { loadLocalProgress, markLessonComplete } from "../lib/progress";
import { useAuth } from "./AuthProvider";
import { playSound } from "../lib/sounds";
import FlowDiagramView from "./FlowDiagram";
import VisualMockup from "./VisualMockup";
import ImageGallery, { type LessonImage } from "./ImageGallery";

function renderBody(text: string) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : <span key={i}>{part}</span>
  );
}

export default function SubtopicPlayer({
  topicSlug,
  lessons,
}: {
  topicSlug: string;
  lessons: Lesson[];
}) {
  const { user, loading: authLoading } = useAuth();
  const [completed, setCompleted] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [revealCount, setRevealCount] = useState(1);
  const [extraAck, setExtraAck] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const state = loadLocalProgress();
    const done = state[topicSlug]?.lessonsCompleted ?? [];
    setCompleted(done);
    const firstIncompleteIdx = lessons.findIndex((l) => !done.includes(l.id));
    setActiveIndex(firstIncompleteIdx === -1 ? Math.max(lessons.length - 1, 0) : firstIncompleteIdx);
    setMounted(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topicSlug]);

  useEffect(() => {
    setRevealCount(1);
    setExtraAck(false);
  }, [activeIndex]);

  if (!mounted || lessons.length === 0) return null;

  const lesson = lessons[activeIndex];
  const isDone = completed.includes(lesson.id);
  const isLast = activeIndex === lessons.length - 1;
  const highestUnlocked = user ? Math.min(completed.length, lessons.length - 1) : 0;
  const lessonImages = (lesson as unknown as { images?: LessonImage[] }).images;
  const hasExtra = !!lesson.mockup || !!lesson.flow || !!(lessonImages && lessonImages.length > 0);
  const allTextRevealed = revealCount >= lesson.body.length;
  const readyToComplete = allTextRevealed && (!hasExtra || extraAck);

  function goTo(idx: number) {
    if (idx > highestUnlocked) return;
    playSound("click");
    setActiveIndex(idx);
  }

  function revealNext() {
    playSound("click");
    setRevealCount((c) => Math.min(c + 1, lesson.body.length));
  }

  function acknowledgeExtra() {
    playSound("click");
    setExtraAck(true);
  }

  function handleComplete() {
    if (!user || isDone) return;
    markLessonComplete(topicSlug, lesson.id, user.id);
    setCompleted((prev) => (prev.includes(lesson.id) ? prev : [...prev, lesson.id]));
    playSound(isLast ? "complete" : "unlock");
    if (!isLast) {
      window.setTimeout(() => setActiveIndex((i) => i + 1), 500);
    }
  }

  return (
    <div className="space-y-6">
      {/* Compact subtopic stepper — navigable for review, never skippable ahead */}
      <div className="glass-card overflow-x-auto rounded-xl p-4">
        <div className="flex min-w-max items-center gap-1">
          {lessons.map((l, i) => {
            const done = completed.includes(l.id);
            const isCurrent = i === activeIndex;
            const locked = i > highestUnlocked;
            return (
              <div key={l.id} className="flex items-center">
                <button
                  onClick={() => goTo(i)}
                  disabled={locked}
                  title={l.title}
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all ${
                    done
                      ? "bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] text-white"
                      : isCurrent
                      ? "border-2 border-[var(--primary)] bg-[var(--surface)] text-[var(--primary)] node-glow"
                      : locked
                      ? "cursor-not-allowed bg-[var(--surface-2)] text-[var(--text-lo)]"
                      : "border border-[var(--border-strong)] bg-[var(--surface)] text-[var(--text-mid)] hover:border-[var(--primary)]"
                  }`}
                >
                  {done ? "✓" : locked ? "🔒" : i + 1}
                </button>
                {i < lessons.length - 1 && (
                  <div
                    className={`h-[2px] w-8 shrink-0 sm:w-12 ${
                      i < highestUnlocked ? "bg-[var(--primary-light)]" : "bg-[var(--border)]"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
        <p className="mt-3 text-xs text-[var(--text-lo)]">
          Subtopic {activeIndex + 1} of {lessons.length} · {completed.length} completed
        </p>
      </div>

      {!authLoading && !user && (
        <div className="rounded-xl border border-[var(--primary)]/25 bg-[var(--primary)]/[0.05] px-5 py-4 text-sm text-[var(--text-mid)]">
          <span className="font-semibold text-[var(--text-hi)]">Sign in required.</span> You can preview
          this subtopic, but must sign in to progress and unlock the next one.{" "}
          <Link href="/login" className="font-semibold text-[var(--primary)] hover:underline">
            Sign in →
          </Link>
        </div>
      )}

      {/* Single active subtopic, revealed step by step */}
      <div className="glass-card glow-border rounded-2xl p-8">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--primary)]">
              Subtopic {activeIndex + 1}
              {lesson.version && lesson.version !== "both" ? ` · New in ${lesson.version}` : ""}
            </p>
            <h2 className="mt-1 text-xl font-bold text-[var(--text-hi)] sm:text-2xl">{lesson.title}</h2>
          </div>
          <span className="badge-pill">{lesson.minutes} min</span>
        </div>

        <div className="prose-lesson mt-6 space-y-4">
          {lesson.body.slice(0, revealCount).map((p, idx) => (
            <p key={idx} className={idx === revealCount - 1 ? "lesson-line" : ""}>
              {renderBody(p)}
            </p>
          ))}
        </div>

        {!allTextRevealed && (
          <button
            onClick={revealNext}
            className="mt-5 rounded-md bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--primary-dark)] hover:scale-[1.02]"
          >
            Continue reading →
          </button>
        )}

        {allTextRevealed && lessonImages && lessonImages.length > 0 && (
          <ImageGallery images={lessonImages} />
        )}
        {allTextRevealed && lesson.mockup && <VisualMockup mockup={lesson.mockup} />}
        {allTextRevealed && lesson.flow && <FlowDiagramView flow={lesson.flow} />}

        {allTextRevealed && hasExtra && !extraAck && (
          <button
            onClick={acknowledgeExtra}
            className="mt-4 rounded-md border border-[var(--border-strong)] bg-[var(--surface-2)] px-5 py-2.5 text-sm font-semibold text-[var(--text-hi)] transition hover:bg-[var(--surface-3)]"
          >
            Got it, continue →
          </button>
        )}

        {readyToComplete && lesson.proTip && (
          <div className="mt-4 rounded-lg border border-[var(--primary)]/20 bg-[var(--primary)]/[0.05] px-4 py-3 text-sm text-[var(--text-mid)]">
            <span className="mr-2 font-semibold text-[var(--primary)]">💡 Pro tip:</span>
            {lesson.proTip}
          </div>
        )}

        {readyToComplete && (
          <div className="mt-8 flex items-center justify-between border-t border-[var(--border)] pt-6">
            <button
              onClick={() => goTo(activeIndex - 1)}
              disabled={activeIndex === 0}
              className={`rounded-md px-5 py-2.5 text-sm font-semibold transition ${
                activeIndex === 0
                  ? "cursor-not-allowed text-[var(--text-lo)]"
                  : "border border-[var(--border-strong)] bg-[var(--surface-2)] text-[var(--text-hi)] hover:bg-[var(--surface-3)]"
              }`}
            >
              ← Previous
            </button>

            {user ? (
              <button
                onClick={handleComplete}
                disabled={isDone}
                className={`rounded-md px-6 py-2.5 text-sm font-semibold shadow-sm transition ${
                  isDone
                    ? "cursor-default bg-[var(--surface-2)] text-[var(--text-lo)]"
                    : "bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)]"
                }`}
              >
                {isDone ? "Completed ✓" : isLast ? "Finish Topic →" : "Complete & Continue →"}
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
        )}
      </div>
    </div>
  );
}
