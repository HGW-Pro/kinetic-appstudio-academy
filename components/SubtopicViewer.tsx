"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Lesson } from "../lib/curriculum";
import { loadLocalProgress, markLessonComplete } from "../lib/progress";
import { useAuth } from "./AuthProvider";
import { playSound } from "../lib/sounds";
import FlowDiagramView from "./FlowDiagram";
import VisualMockup from "./VisualMockup";
import ImageGallery, { type LessonImage } from "./ImageGallery";

function renderInline(text: string) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : <span key={i}>{part}</span>
  );
}

type StepKind = "text" | "images" | "mockup" | "flow" | "protip";
type Step = { kind: StepKind; content: string; index?: number };

function buildSteps(lesson: Lesson, images?: LessonImage[]): Step[] {
  const steps: Step[] = lesson.body.map((p) => ({ kind: "text", content: p }));
  if (images && images.length > 0) steps.push({ kind: "images", content: "" });
  if (lesson.mockup) steps.push({ kind: "mockup", content: "" });
  if (lesson.flow) steps.push({ kind: "flow", content: "" });
  if (lesson.proTip) steps.push({ kind: "protip", content: lesson.proTip });
  return steps;
}

export default function SubtopicViewer({
  topicSlug,
  lessons,
  courseSlug,
}: {
  topicSlug: string;
  lessons: Lesson[];
  courseSlug: string;
}) {
  const { user, loading: authLoading } = useAuth();
  const [completed, setCompleted] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [revealCount, setRevealCount] = useState(1);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const state = loadLocalProgress();
    const done = state[topicSlug]?.lessonsCompleted ?? [];
    setCompleted(done);
    const firstIncompleteIdx = lessons.findIndex((l) => !done.includes(l.id));
    setActiveIndex(firstIncompleteIdx === -1 ? lessons.length - 1 : firstIncompleteIdx);
    setMounted(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topicSlug]);

  const lesson = lessons[activeIndex];
  const lessonImages = (lesson as unknown as { images?: LessonImage[] })?.images;
  const steps = useMemo(() => (lesson ? buildSteps(lesson, lessonImages) : []), [lesson, lessonImages]);

  useEffect(() => {
    setRevealCount(1);
  }, [activeIndex]);

  if (!mounted || !lesson) return null;

  const isDone = completed.includes(lesson.id);
  const isLast = activeIndex === lessons.length - 1;
  const highestUnlocked = user ? Math.min(completed.length, lessons.length - 1) : 0;
  const allStepsRevealed = revealCount >= steps.length;

  function goTo(idx: number) {
    if (idx > highestUnlocked) return;
    playSound("click");
    setActiveIndex(idx);
  }

  function revealNext() {
    playSound("click");
    setRevealCount((c) => Math.min(c + 1, steps.length));
  }

  function handleComplete() {
    if (!user) return;
    if (!isDone) {
      markLessonComplete(topicSlug, lesson.id, user.id);
      setCompleted((prev) => [...prev, lesson.id]);
    }
    playSound(isLast ? "complete" : "unlock");
    if (!isLast) {
      window.setTimeout(() => setActiveIndex(activeIndex + 1), 350);
    }
  }

  return (
    <div className="space-y-6">
      {/* Compact step tracker across subtopics */}
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
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--primary)]/25 bg-[var(--primary)]/[0.05] px-5 py-4">
          <p className="text-sm text-[var(--text-mid)]">
            <span className="font-semibold text-[var(--text-hi)]">Sign in required.</span>{" "}
            You can preview this subtopic, but must sign in to complete it and unlock the next one.
          </p>
          <Link
            href="/login"
            className="rounded-md bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--primary-dark)]"
          >
            Sign In →
          </Link>
        </div>
      )}

      {/* Single active subtopic, revealed step-by-step */}
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
          {steps.slice(0, revealCount).map((step, idx) => (
            <div key={idx} className="lesson-line" style={{ animationDelay: `${idx === revealCount - 1 ? 0 : 0}ms` }}>
              {step.kind === "text" && <p>{renderInline(step.content)}</p>}
              {step.kind === "images" && lessonImages && <ImageGallery images={lessonImages} />}
              {step.kind === "mockup" && lesson.mockup && <VisualMockup mockup={lesson.mockup} />}
              {step.kind === "flow" && lesson.flow && <FlowDiagramView flow={lesson.flow} />}
              {step.kind === "protip" && (
                <div className="rounded-lg border border-[var(--primary)]/20 bg-[var(--primary)]/[0.05] px-4 py-3 text-sm text-[var(--text-mid)]">
                  <span className="mr-2 font-semibold text-[var(--primary)]">💡 Pro tip:</span>
                  {step.content}
                </div>
              )}
            </div>
          ))}
        </div>

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

          {!allStepsRevealed ? (
            <button
              onClick={revealNext}
              className="rounded-md bg-[var(--primary)] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--primary-dark)]"
            >
              Continue ({revealCount}/{steps.length}) →
            </button>
          ) : user ? (
            <button
              onClick={handleComplete}
              disabled={isDone && !isLast}
              className={`rounded-md px-6 py-2.5 text-sm font-semibold shadow-sm transition ${
                isDone
                  ? "cursor-default bg-[var(--surface-2)] text-[var(--text-lo)]"
                  : "bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)]"
              }`}
            >
              {isDone
                ? isLast
                  ? "Subtopics Complete ✓"
                  : "Completed ✓"
                : isLast
                ? "Finish Topic →"
                : "Complete & Continue →"}
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
  );
}
