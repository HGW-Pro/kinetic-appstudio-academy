"use client";

import dynamic from "next/dynamic";

const KineticSimulator = dynamic(() => import("./KineticSimulator"), {
  ssr: false,
  loading: () => <div className="border border-[var(--border)] bg-[var(--surface-2)] p-5 text-sm text-[var(--text-mid)]">Preparing your training simulator…</div>,
});

export default function SimulatorChallengeExperience() {
  return <KineticSimulator />;
}
