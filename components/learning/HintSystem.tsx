"use client";

import { useState } from "react";

type HintSystemProps = {
  hints?: string[];
  solution?: string;
  solutionLabel?: string;
};

export default function HintSystem({
  hints = [],
  solution,
  solutionLabel = "Show solution",
}: HintSystemProps) {
  const [revealedHints, setRevealedHints] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const nextHint = hints[revealedHints];
  const hasMoreHints = revealedHints < hints.length;
  const canShowSolution = Boolean(solution) && !hasMoreHints;

  if (hints.length === 0 && !solution) return null;

  return (
    <aside className="mt-5 border-t border-[var(--border)] pt-4" aria-label="Hints and solution">
      {revealedHints > 0 && (
        <ol className="mb-3 space-y-2" aria-live="polite">
          {hints.slice(0, revealedHints).map((hint, index) => (
            <li key={`${hint}-${index}`} className="border-l-2 border-[var(--primary)]/50 bg-[var(--primary)]/[0.04] px-3 py-2 text-sm text-[var(--text-mid)]">
              <span className="mr-2 text-xs font-semibold uppercase tracking-wide text-[var(--primary)]">Hint {index + 1}</span>
              {hint}
            </li>
          ))}
        </ol>
      )}

      <div className="flex flex-wrap gap-2">
        {hasMoreHints && (
          <button
            type="button"
            onClick={() => setRevealedHints((count) => count + 1)}
            className="rounded-md border border-[var(--border-strong)] bg-[var(--surface-2)] px-3 py-2 text-sm font-semibold text-[var(--text-hi)] hover:bg-[var(--surface-3)]"
          >
            {revealedHints === 0 ? "Hint 1" : `Hint ${revealedHints + 1}`}
          </button>
        )}
        {canShowSolution && solution && (
          <button
            type="button"
            onClick={() => setShowSolution((visible) => !visible)}
            className="rounded-md border border-[var(--primary)]/30 bg-[var(--primary)]/[0.05] px-3 py-2 text-sm font-semibold text-[var(--primary)] hover:bg-[var(--primary)]/[0.1]"
            aria-expanded={showSolution}
          >
            {showSolution ? "Hide solution" : solutionLabel}
          </button>
        )}
      </div>

      {nextHint && revealedHints === 0 && <p className="mt-2 text-xs text-[var(--text-lo)]">Need a nudge? Reveal the first hint when you are ready.</p>}
      {showSolution && solution && (
        <div className="mt-3 border-l-2 border-[var(--success)] bg-[var(--success-soft)] px-3 py-3 text-sm leading-6 text-[var(--text-mid)]" role="status">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--success)]">Solution</p>
          <p className="mt-1">{solution}</p>
        </div>
      )}
    </aside>
  );
}
