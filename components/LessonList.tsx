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

export default function LessonList({
  moduleSlug,
  lessons,
}: {
  moduleSlug: string;
  lessons: Lesson[];
}) {
  const { user, loading: authLoading } = useAuth();
  const [completed, setCompleted] = useState<string[]>([]);
  const [expandedId, setExpandedId] = useState<string>(lessons[0]?.id ?? "");
  const [justCompleted, setJustCompleted] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const state = loadLocalProgress();
    const done = state[moduleSlug]?.lessonsCompleted ?? [];
    setCompleted(done);
    const firstIncomplete = lessons.find((l) => !done.includes(l.id));
    setExpandedId(firstIncomplete ? firstIncomplete.id : lessons[lessons.length - 1]?.id ?? "");
    setMounted(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleSlug]);

  if (!mounted) return null;

  // Without a signed-in account, progress cannot advance past lesson 1 —
  // completion is gated on being signed in, same as Enroll.
  const highestUnlockedIndex = user
    ? Math.min(completed.length, lessons.length - 1)
    : 0;
  const pathPct = lessons.length > 1 ? (highestUnlockedIndex / (lessons.length - 1)) * 100 : 0;

  function handleComplete(lessonId: string, index: number) {
    if (!user) return;
    markLessonComplete(moduleSlug, lessonId, user.id);
    const updated = completed.includes(lessonId) ? completed : [...completed, lessonId];
    setCompleted(updated);
    setJustCompleted(lessonId);
    playSound(index === lessons.length - 1 ? "complete" : "unlock");

    const next = lessons[index + 1];
    window.setTimeout(() => {
      setJustCompleted(null);
      if (next) setExpandedId(next.id);
    }, 550);
  }

  function handleExpand(lessonId: string, currentlyExpanded: boolean) {
    playSound("click");
    setExpandedId(currentlyExpanded ? "" : lessonId);
  }

  return (
    <div className="relative">
      <div className="pointer-events-none absolute bottom-6 left-[23px] top-6 hidden w-[3px] sm:block">
        <div className="h-full w-full rounded-full bg-[var(--surface-3)]" />
        <div
          className="absolute left-0 top-0 w-full rounded-full bg-gradient-to-b from-[var(--primary)] to-[var(--primary-light)] transition-all duration-700 ease-out"
          style={{ height: `${Math.min(pathPct, 100)}%` }}
        />
      </div>

      {!authLoading && !user && (
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--primary)]/25 bg-[var(--primary)]/[0.05] px-5 py-4 sm:ml-14">
          <p className="text-sm text-[var(--text-mid)]">
            <span className="font-semibold text-[var(--text-hi)]">Sign in required.</span>{" "}
            You can read every lesson below, but you must sign in to mark lessons complete,
            unlock the next one, and track your certification.
          </p>
          <Link
            href="/login"
            className="rounded-md bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--primary-dark)]"
          >
            Sign In →
          </Link>
        </div>
      )}

      <div className="space-y-5 sm:pl-14">
        {lessons.map((lesson, i) => {
          const isDone = completed.includes(lesson.id);
          const isLocked = i > highestUnlockedIndex;
          const isExpanded = expandedId === lesson.id && !isLocked;
          const isPulsing = justCompleted === lesson.id;
          const isFrontier = i === highestUnlockedIndex && !isDone;
          const lessonImages = (lesson as unknown as { images?: LessonImage[] }).images;

          return (
            <div key={lesson.id} className="relative">
              <span
                className={`absolute -left-14 top-6 hidden h-12 w-12 items-center justify-center rounded-full border-2 text-sm font-bold transition-all duration-500 sm:flex ${
                  isDone
                    ? "border-[var(--primary-light)] bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] text-white"
                    : isFrontier
                    ? "border-[var(--primary)] bg-[var(--surface)] text-[var(--primary)] node-glow"
                    : isLocked
                    ? "border-[var(--border-strong)] bg-[var(--surface)] text-[var(--text-lo)]"
                    : "border-[var(--primary)] bg-[var(--surface)] text-[var(--primary)]"
                } ${isPulsing ? "node-pop" : ""}`}
              >
                {isDone ? "✓" : isLocked ? "🔒" : i + 1}
              </span>

              <div
                className={`glass-card overflow-hidden rounded-xl transition-all duration-300 ${
                  isLocked ? "opacity-60" : "opacity-100"
                } ${isExpanded ? "glow-border" : ""}`}
              >
                <button
                  onClick={() => !isLocked && handleExpand(lesson.id, isExpanded)}
                  disabled={isLocked}
                  className={`flex w-full items-center justify-between gap-4 px-6 py-5 text-left ${
                    isLocked ? "cursor-not-allowed" : ""
                  }`}
                >
                  <div className="flex items-center gap-4 sm:hidden">
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                        isDone
                          ? "bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] text-white"
                          : "bg-[var(--surface-2)] text-[var(--text-lo)]"
                      }`}
                    >
                      {isDone ? "✓" : isLocked ? "🔒" : i + 1}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--text-hi)]">{lesson.title}</p>
                    <p className="text-xs text-[var(--text-lo)]">
                      {lesson.minutes} min
                      {lesson.version && lesson.version !== "both" ? ` · New in ${lesson.version}` : ""}
                      {isLocked && user ? " · Complete the previous lesson to unlock" : ""}
                      {isLocked && !user && i > 0 ? " · Sign in to unlock" : ""}
                    </p>
                  </div>
                  {!isLocked && (
                    <span className={`text-lg text-[var(--text-lo)] transition ${isExpanded ? "rotate-90" : ""}`}>
                      ›
                    </span>
                  )}
                </button>

                {isExpanded && (
                  <div className="lesson-reveal border-t border-[var(--border)] px-6 py-5">
                    <div className="prose-lesson">
                      {lesson.body.map((p, idx) => (
                        <p key={idx} className="lesson-line" style={{ animationDelay: `${idx * 90}ms` }}>
                          {renderBody(p)}
                        </p>
                      ))}
                    </div>

                    {lessonImages && lessonImages.length > 0 && <ImageGallery images={lessonImages} />}
                    {lesson.mockup && <VisualMockup mockup={lesson.mockup} />}
                    {lesson.flow && <FlowDiagramView flow={lesson.flow} />}

                    {lesson.proTip && (
                      <div className="mt-4 rounded-lg border border-[var(--primary)]/20 bg-[var(--primary)]/[0.05] px-4 py-3 text-sm text-[var(--text-mid)]">
                        <span className="mr-2 font-semibold text-[var(--primary)]">💡 Pro tip:</span>
                        {lesson.proTip}
                      </div>
                    )}

                    {user ? (
                      <button
                        onClick={() => handleComplete(lesson.id, i)}
                        disabled={isDone}
                        className={`mt-5 rounded-md px-5 py-2 text-xs font-semibold transition ${
                          isDone
                            ? "cursor-default bg-[var(--surface-2)] text-[var(--text-lo)]"
                            : "bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)] hover:scale-[1.03]"
                        }`}
                      >
                        {isDone ? "Completed ✓" : i === lessons.length - 1 ? "Complete Module →" : "Complete & Continue →"}
                      </button>
                    ) : (
                      <Link
                        href="/login"
                        className="mt-5 inline-block rounded-md bg-[var(--primary)] px-5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[var(--primary-dark)]"
                      >
                        Sign in to complete & continue →
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
