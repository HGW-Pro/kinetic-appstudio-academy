"use client";

import { useState } from "react";
import Link from "next/link";
import type { QuizQuestion } from "../lib/curriculum";
import { recordQuizResult } from "../lib/progress";

export default function QuizEngine({
  moduleSlug,
  moduleTitle,
  questions,
  nextModuleSlug,
}: {
  moduleSlug: string;
  moduleTitle: string;
  questions: QuizQuestion[];
  nextModuleSlug?: string;
}) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [locked, setLocked] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const q = questions[current];
  const isLast = current === questions.length - 1;

  function choose(idx: number) {
    if (locked) return;
    setSelected(idx);
    setLocked(true);
    if (idx === q.correctIndex) setScore((s) => s + 1);
  }

  function next() {
    if (isLast) {
      const pct = Math.round((score / questions.length) * 100);
      recordQuizResult(moduleSlug, pct);
      setFinished(true);
      return;
    }
    setCurrent((c) => c + 1);
    setSelected(null);
    setLocked(false);
  }

  function retake() {
    setCurrent(0);
    setSelected(null);
    setLocked(false);
    setScore(0);
    setFinished(false);
  }

  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    const passed = pct >= 80;
    return (
      <div className="glass-card glow-border mx-auto max-w-xl rounded-2xl p-10 text-center">
        <div className="text-6xl">{passed ? "🏆" : "📘"}</div>
        <h2 className="mt-4 text-2xl font-bold text-[var(--text-hi)]">
          {passed ? "Module Complete!" : "Almost there"}
        </h2>
        <p className="mt-2 text-sm text-[var(--text-mid)]">
          You scored <span className="font-semibold text-[var(--text-hi)]">{score}/{questions.length}</span> ({pct}%)
          on {moduleTitle}.
        </p>
        <div className="progress-track mx-auto mt-6 h-3 max-w-sm">
          <div className="progress-fill h-full" style={{ width: `${pct}%` }} />
        </div>
        {passed ? (
          <p className="mt-4 text-sm text-[var(--primary)]">
            🎉 You earned the badge for this module. Keep the streak going!
          </p>
        ) : (
          <p className="mt-4 text-sm text-[var(--text-mid)]">
            You need 80% to earn the badge. Review the lessons and try again — you've got this.
          </p>
        )}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            onClick={retake}
            className="rounded-md border border-[var(--border-strong)] bg-[var(--surface-2)] px-5 py-2.5 text-sm font-semibold text-[var(--text-hi)] transition hover:bg-[var(--surface-3)]"
          >
            Retake Quiz
          </button>
          {nextModuleSlug && passed && (
            <Link
              href={`/modules/${nextModuleSlug}`}
              className="rounded-md bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--primary-dark)]"
            >
              Next Module →
            </Link>
          )}
          <Link
            href="/dashboard"
            className="rounded-md border border-[var(--border-strong)] bg-[var(--surface-2)] px-5 py-2.5 text-sm font-semibold text-[var(--text-hi)] transition hover:bg-[var(--surface-3)]"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="flex items-center justify-between text-xs text-[var(--text-lo)]">
        <span>
          Question {current + 1} of {questions.length}
        </span>
        <span>Score so far: {score}</span>
      </div>
      <div className="progress-track h-2">
        <div
          className="progress-fill h-full"
          style={{ width: `${((current) / questions.length) * 100}%` }}
        />
      </div>

      <div className="glass-card glow-border rounded-2xl p-8">
        <h2 className="text-lg font-semibold text-[var(--text-hi)]">{q.question}</h2>
        <div className="mt-6 space-y-3">
          {q.options.map((opt, idx) => {
            const isCorrect = idx === q.correctIndex;
            const isSelected = idx === selected;
            let style =
              "border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-2)] text-[var(--text-mid)]";
            if (locked && isCorrect) {
              style = "border-[var(--success)]/40 bg-[var(--success-soft)] text-[var(--success)]";
            } else if (locked && isSelected && !isCorrect) {
              style = "border-[var(--error)]/40 bg-[var(--error-soft)] text-[var(--error)]";
            }
            return (
              <button
                key={idx}
                onClick={() => choose(idx)}
                disabled={locked}
                className={`w-full rounded-lg border px-5 py-3 text-left text-sm transition ${style}`}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {locked && (
          <div className="mt-5 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 text-sm text-[var(--text-mid)]">
            <span className="mr-2 font-semibold text-[var(--primary)]">
              {selected === q.correctIndex ? "✅ Correct." : "❌ Not quite."}
            </span>
            {q.explanation}
          </div>
        )}

        {locked && (
          <button
            onClick={next}
            className="mt-6 w-full rounded-md bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--primary-dark)]"
          >
            {isLast ? "See Results" : "Next Question →"}
          </button>
        )}
      </div>
    </div>
  );
}
