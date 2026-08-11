"use client";

import { useEffect, useState } from "react";
import type { Lesson } from "../lib/curriculum";
import { loadProgress, markLessonComplete } from "../lib/progress";
import FlowDiagramView from "./FlowDiagram";

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
  const [completed, setCompleted] = useState<string[]>([]);
  const [activeId, setActiveId] = useState<string>(lessons[0]?.id ?? "");
  const [justCompleted, setJustCompleted] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const state = loadProgress();
    const done = state[moduleSlug]?.lessonsCompleted ?? [];
    setCompleted(done);
    const firstIncomplete = lessons.find((l) => !done.includes(l.id));
    setActiveId(firstIncomplete ? firstIncomplete.id : lessons[lessons.length - 1]?.id ?? "");
    setMounted(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleSlug]);

  const activeIndex = lessons.findIndex((l) => l.id === activeId);

  function handleComplete(lessonId: string) {
    markLessonComplete(moduleSlug, lessonId);
    setCompleted((prev) => (prev.includes(lessonId) ? prev : [...prev, lessonId]));
    setJustCompleted(lessonId);
    const idx = lessons.findIndex((l) => l.id === lessonId);
    const next = lessons[idx + 1];
    window.setTimeout(() => {
      setJustCompleted(null);
      if (next) setActiveId(next.id);
    }, 550);
  }

  const doneCount = completed.length;
  const pathPct = lessons.length > 1 ? (doneCount / (lessons.length - 1)) * 100 : 0;

  if (!mounted) return null;

  return (
    <div className="relative">
      {/* Vertical progress spine */}
      <div className="pointer-events-none absolute bottom-6 left-[23px] top-6 hidden w-[3px] sm:block">
        <div className="h-full w-full rounded-full bg-white/[0.06]" />
        <div
          className="absolute left-0 top-0 w-full rounded-full bg-gradient-to-b from-[var(--accent)] to-[var(--accent-2)] transition-all duration-700 ease-out"
          style={{ height: `${Math.min(pathPct, 100)}%` }}
        />
      </div>

      <div className="space-y-5 sm:pl-14">
        {lessons.map((lesson, i) => {
          const isDone = completed.includes(lesson.id);
          const isActive = lesson.id === activeId;
          const isLocked = !isDone && !isActive;
          const isPulsing = justCompleted === lesson.id;

          return (
            <div key={lesson.id} className="relative">
              {/* node marker on the spine */}
              <span
                className={`absolute -left-14 top-6 hidden h-12 w-12 items-center justify-center rounded-full border-2 text-sm font-bold transition-all duration-500 sm:flex ${
                  isDone
                    ? "border-[var(--accent-2)] bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)] text-white"
                    : isActive
                    ? "border-[var(--accent)] bg-[var(--bg-1)] text-[var(--accent-2)] node-glow"
                    : "border-white/10 bg-[var(--bg-1)] text-[var(--text-lo)]"
                } ${isPulsing ? "node-pop" : ""}`}
              >
                {isDone ? "✓" : isLocked ? "🔒" : i + 1}
              </span>

              <div
                className={`glass-card overflow-hidden rounded-2xl transition-all duration-300 ${
                  isLocked ? "opacity-50" : "opacity-100"
                } ${isActive ? "glow-border" : ""}`}
              >
                <button
                  onClick={() => !isLocked && setActiveId(lesson.id)}
                  disabled={isLocked}
                  className={`flex w-full items-center justify-between gap-4 px-6 py-5 text-left ${
                    isLocked ? "cursor-not-allowed" : ""
                  }`}
                >
                  <div className="flex items-center gap-4 sm:hidden">
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                        isDone
                          ? "bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)] text-white"
                          : "bg-white/5 text-[var(--text-lo)]"
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
                      {isLocked ? " · Complete the previous lesson to unlock" : ""}
                    </p>
                  </div>
                  {!isLocked && (
                    <span className={`text-lg text-[var(--text-lo)] transition ${isActive ? "rotate-90" : ""}`}>
                      ›
                    </span>
                  )}
                </button>

                {isActive && !isLocked && (
                  <div className="border-t border-white/5 px-6 py-5">
                    <div className="prose-lesson">
                      {lesson.body.map((p, idx) => (
                        <p key={idx}>{renderBody(p)}</p>
                      ))}
                    </div>

                    {lesson.flow && <FlowDiagramView flow={lesson.flow} />}

                    {lesson.proTip && (
                      <div className="mt-4 rounded-xl border border-[var(--accent-2)]/25 bg-[var(--accent-2)]/5 px-4 py-3 text-sm text-[var(--text-mid)]">
                        <span className="mr-2 font-semibold text-[var(--accent-2)]">💡 Pro tip:</span>
                        {lesson.proTip}
                      </div>
                    )}

                    <button
                      onClick={() => handleComplete(lesson.id)}
                      disabled={isDone}
                      className={`mt-5 rounded-full px-5 py-2 text-xs font-semibold transition ${
                        isDone
                          ? "cursor-default bg-white/5 text-[var(--text-lo)]"
                          : "bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] text-white hover:scale-[1.02]"
                      }`}
                    >
                      {isDone ? "Completed ✓" : i === lessons.length - 1 ? "Complete Module →" : "Complete & Continue →"}
                    </button>
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
