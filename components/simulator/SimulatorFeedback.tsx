"use client";

export default function SimulatorFeedback({ complete, completedCount, totalCount }: { complete: boolean; completedCount: number; totalCount: number }) {
  if (complete) {
    return <section className="border border-[var(--success)]/40 bg-[var(--success-soft)] p-4" role="status" aria-live="polite"><p className="text-sm font-semibold text-[var(--success)]">Challenge complete</p><p className="mt-1 text-sm leading-6 text-[var(--text-mid)]">Your panel meets every required component and event configuration. You have translated the business requirement into a working training customization.</p></section>;
  }
  return <section className="border border-[var(--border)] bg-[var(--surface-2)] p-4" aria-live="polite"><p className="text-sm font-semibold text-[var(--text-hi)]">{completedCount} of {totalCount} requirements complete</p><p className="mt-1 text-sm leading-6 text-[var(--text-mid)]">Keep configuring the canvas. Select any placed component to edit its properties or attach its event.</p></section>;
}
