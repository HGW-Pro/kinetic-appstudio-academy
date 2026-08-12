import type { ReactNode } from "react";
import HintSystem from "./HintSystem";

type ChallengePanelProps = {
  title: string;
  scenario?: string;
  hints?: string[];
  solution?: string;
  children: ReactNode;
};

export default function ChallengePanel({ title, scenario, hints, solution, children }: ChallengePanelProps) {
  return (
    <section className="border-l-4 border-[var(--accent)] bg-[var(--accent-soft)] px-5 py-5" aria-label={`Challenge: ${title}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.13em] text-[var(--accent)]">Challenge</p>
      <h3 className="mt-1 text-lg font-semibold text-[var(--text-hi)]">{title}</h3>
      {scenario && <p className="mt-2 text-sm leading-6 text-[var(--text-mid)]">{scenario}</p>}
      <div className="mt-5">{children}</div>
      <HintSystem hints={hints} solution={solution} />
    </section>
  );
}
