"use client";

import { useEffect, useState } from "react";
import type { Lesson } from "../lib/curriculum";
import { loadProgress, markLessonComplete } from "../lib/progress";

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
  const [openId, setOpenId] = useState<string | null>(lessons[0]?.id ?? null);
  const [completed, setCompleted] = useState<string[]>([]);

  useEffect(() => {
    const state = loadProgress();
    setCompleted(state[moduleSlug]?.lessonsCompleted ?? []);
  }, [moduleSlug]);

  function handleComplete(lessonId: string) {
    markLessonComplete(moduleSlug, lessonId);
    setCompleted((prev) => (prev.includes(lessonId) ? prev : [...prev, lessonId]));
  }

  return (
    <div className="space-y-4">
      {lessons.map((lesson, i) => {
        const isOpen = openId === lesson.id;
        const isDone = completed.includes(lesson.id);
        return (
          <div key={lesson.id} className="glass-card overflow-hidden rounded-2xl">
            <button
              onClick={() => setOpenId(isOpen ? null : lesson.id)}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
            >
              <div className="flex items-center gap-4">
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    isDone
                      ? "bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)] text-white"
                      : "bg-white/5 text-[var(--text-lo)]"
                  }`}
                >
                  {isDone ? "✓" : i + 1}
                </span>
                <div>
                  <p className="font-semibold text-[var(--text-hi)]">{lesson.title}</p>
                  <p className="text-xs text-[var(--text-lo)]">
                    {lesson.minutes} min
                    {lesson.version && lesson.version !== "both" ? ` · New in ${lesson.version}` : ""}
                  </p>
                </div>
              </div>
              <span className={`text-lg text-[var(--text-lo)] transition ${isOpen ? "rotate-90" : ""}`}>
                ›
              </span>
            </button>
            {isOpen && (
              <div className="border-t border-white/5 px-6 py-5">
                <div className="prose-lesson">
                  {lesson.body.map((p, idx) => (
                    <p key={idx}>{renderBody(p)}</p>
                  ))}
                </div>
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
                  {isDone ? "Completed ✓" : "Mark as complete"}
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
