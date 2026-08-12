import type { ReactNode } from "react";
import HintSystem from "./HintSystem";

type PracticeExerciseProps = {
  title: string;
  objective?: string;
  instructions?: string[];
  hints?: string[];
  solution?: string;
  children?: ReactNode;
};

export default function PracticeExercise({
  title,
  objective,
  instructions = [],
  hints,
  solution,
  children,
}: PracticeExerciseProps) {
  return (
    <section className="border border-[var(--primary)]/25 bg-[var(--surface)] p-5 shadow-sm" aria-label={`Practice: ${title}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.13em] text-[var(--primary)]">Practice</p>
      <h3 className="mt-1 text-lg font-semibold text-[var(--text-hi)]">{title}</h3>
      {objective && <p className="mt-2 text-sm leading-6 text-[var(--text-mid)]">{objective}</p>}
      {instructions.length > 0 && (
        <ol className="mt-4 space-y-3">
          {instructions.map((instruction, index) => (
            <li key={`${instruction}-${index}`} className="flex gap-3 text-sm leading-6 text-[var(--text-mid)]">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--primary)]/[0.1] text-xs font-semibold text-[var(--primary)]">{index + 1}</span>
              <span>{instruction}</span>
            </li>
          ))}
        </ol>
      )}
      {children && <div className="mt-5">{children}</div>}
      <HintSystem hints={hints} solution={solution} />
    </section>
  );
}
