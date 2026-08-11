import Link from "next/link";
import { notFound } from "next/navigation";
import { labs, getLab } from "../../../lib/labs";

export function generateStaticParams() {
  return labs.map((l) => ({ slug: l.slug }));
}

export default function LabDetailPage({ params }: { params: { slug: string } }) {
  const lab = getLab(params.slug);
  if (!lab) notFound();

  return (
    <div className="space-y-8">
      <div className="glass-card glow-border rounded-2xl p-8">
        <span className="badge-pill">{lab.tag}</span>
        <h1 className="mt-4 text-2xl font-bold text-[var(--text-hi)] sm:text-3xl">{lab.title}</h1>
        <p className="mt-3 max-w-2xl text-sm text-[var(--text-mid)]">{lab.objective}</p>
      </div>

      <div className="glass-card rounded-xl p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--primary)]">
          Prerequisites
        </h2>
        <ul className="mt-3 space-y-2 text-sm text-[var(--text-mid)]">
          {lab.prerequisites.map((p, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="mt-0.5 text-[var(--primary)]">•</span>
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="glass-card rounded-xl p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--primary)]">
          Step-by-Step Guide
        </h2>
        <ol className="mt-4 space-y-4">
          {lab.steps.map((step, i) => (
            <li key={i} className="flex gap-4 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--primary)] text-xs font-bold text-white">
                {i + 1}
              </span>
              <div>
                <p className="font-semibold text-[var(--text-hi)]">{step.title}</p>
                <p className="mt-1 text-sm text-[var(--text-mid)]">{step.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="glass-card rounded-xl p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--primary)]">
          Acceptance Criteria
        </h2>
        <ul className="mt-3 space-y-2 text-sm text-[var(--text-mid)]">
          {lab.acceptanceCriteria.map((c, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="mt-0.5 text-[var(--success)]">✓</span>
              <span>{c}</span>
            </li>
          ))}
        </ul>
      </div>

      {lab.notes.length > 0 && (
        <div className="rounded-xl border border-[var(--primary)]/20 bg-[var(--primary)]/[0.05] p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--primary)]">
            Notes
          </h2>
          <ul className="mt-3 space-y-2 text-sm text-[var(--text-mid)]">
            {lab.notes.map((n, i) => (
              <li key={i}>💡 {n}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="text-center">
        <Link href="/labs" className="text-sm font-medium text-[var(--primary)] hover:underline">
          ← Back to Labs
        </Link>
      </div>
    </div>
  );
}
