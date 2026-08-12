"use client";

export default function GlobalSearch() {
  return (
    <button
      type="button"
      aria-label="Search Kinetic Academy (coming soon)"
      title="Global search is coming in a later phase"
      className="hidden min-w-0 items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-left text-sm text-[var(--text-lo)] shadow-sm transition hover:border-[var(--border-strong)] hover:bg-[var(--surface)] md:flex md:w-full md:max-w-md"
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="6.5" />
        <path d="m16 16 4 4" strokeLinecap="round" />
      </svg>
      <span className="min-w-0 flex-1 truncate">Search Kinetic Academy</span>
      <kbd className="rounded border border-[var(--border)] bg-[var(--surface)] px-1.5 py-0.5 text-[10px] font-medium text-[var(--text-lo)]">
        Ctrl K
      </kbd>
    </button>
  );
}
