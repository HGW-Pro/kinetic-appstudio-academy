"use client";

export type MockupRow = {
  label: string;
  note?: string;
  highlight?: boolean;
};

export type Mockup = {
  title: string;
  subtitle?: string;
  rows: MockupRow[];
};

export default function VisualMockup({ mockup }: { mockup: Mockup }) {
  return (
    <div className="my-5 overflow-hidden rounded-xl border border-[var(--border-strong)] shadow-sm">
      {/* fake title bar, like a screenshot window chrome */}
      <div className="flex items-center gap-2 border-b border-[var(--border)] bg-[var(--surface-2)] px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[var(--error)]/60" />
        <span className="h-2.5 w-2.5 rounded-full bg-[var(--warning)]/60" />
        <span className="h-2.5 w-2.5 rounded-full bg-[var(--success)]/60" />
        <p className="ml-2 text-xs font-semibold text-[var(--text-hi)]">{mockup.title}</p>
        {mockup.subtitle && (
          <span className="ml-auto text-[10px] uppercase tracking-wide text-[var(--text-lo)]">
            {mockup.subtitle}
          </span>
        )}
      </div>
      <div className="divide-y divide-[var(--border)] bg-[var(--surface)]">
        {mockup.rows.map((row, i) => (
          <div
            key={i}
            className={`flex items-center justify-between gap-4 px-4 py-2.5 text-sm ${
              row.highlight ? "bg-[var(--primary)]/[0.06]" : ""
            }`}
          >
            <span
              className={`font-medium ${
                row.highlight ? "text-[var(--primary)]" : "text-[var(--text-hi)]"
              }`}
            >
              {row.label}
            </span>
            {row.note && <span className="text-xs text-[var(--text-lo)]">{row.note}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
