import Link from "next/link";
import { labs } from "../../lib/labs";

export default function LabsPage() {
  return (
    <div className="space-y-8">
      <div>
        <span className="badge-pill">🧪 Practice</span>
        <h1 className="mt-4 text-3xl font-bold text-[var(--text-hi)]">Hands-On Labs</h1>
        <p className="mt-2 max-w-2xl text-sm text-[var(--text-mid)]">
          Practice real Kinetic AppStudio scenarios, starting with BAQ-based combos and expanding
          into events, data rules, and debugging.
        </p>
      </div>

      <div className="glass-card rounded-xl p-6">
        <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-[var(--primary)]">
          Available Labs
        </p>
        <div className="space-y-3">
          {labs.map((lab) => (
            <div
              key={lab.slug}
              className="flex flex-col gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="badge-pill">{lab.tag}</span>
                  <h2 className="text-base font-semibold text-[var(--text-hi)]">{lab.title}</h2>
                </div>
                <p className="mt-1 text-sm text-[var(--text-mid)]">{lab.summary}</p>
              </div>
              <Link
                href={`/labs/${lab.slug}`}
                className="shrink-0 rounded-md bg-[var(--primary)] px-4 py-2 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--primary-dark)]"
              >
                Open Lab →
              </Link>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center">
        <Link href="/dashboard" className="text-sm font-medium text-[var(--primary)] hover:underline">
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
