import type { ReactNode } from "react";

export type LearningMode = "Learn" | "See" | "Explore" | "Practice" | "Challenge" | "Knowledge Check";

type LessonSectionProps = {
  mode: LearningMode;
  children: ReactNode;
};

const modeCopy: Record<LearningMode, string> = {
  Learn: "Concept",
  See: "Guided example",
  Explore: "Interactive exploration",
  Practice: "Guided practice",
  Challenge: "Independent challenge",
  "Knowledge Check": "Check your understanding",
};

export default function LessonSection({ mode, children }: LessonSectionProps) {
  return (
    <section className="border-t border-[var(--border)] pt-6 first:border-t-0 first:pt-0" aria-label={`${mode}: ${modeCopy[mode]}`}>
      <div className="mb-4 flex items-center gap-3">
        <span className="rounded-full border border-[var(--primary)]/20 bg-[var(--primary)]/[0.06] px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.1em] text-[var(--primary)]">
          {mode}
        </span>
        <span className="text-xs font-medium text-[var(--text-lo)]">{modeCopy[mode]}</span>
        <span aria-hidden="true" className="h-px flex-1 bg-[var(--border)]" />
      </div>
      {children}
    </section>
  );
}
