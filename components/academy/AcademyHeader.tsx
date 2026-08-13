"use client";

import Link from "next/link";
import { useAuth } from "../AuthProvider";
import GlobalSearch from "./GlobalSearch";

function KineticMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 36 36" className="h-9 w-9 shrink-0">
      <path d="M6 5h8v9l8-9h8l-9.5 12L31 31h-8.5L14 20.8V31H6V5Z" fill="currentColor" />
    </svg>
  );
}

export default function AcademyHeader() {
  const { user, loading } = useAuth();
  const displayName =
    (typeof user?.user_metadata?.full_name === "string" && user.user_metadata.full_name) ||
    user?.email?.split("@")[0] ||
    "Learner";
  const initial = displayName.slice(0, 1).toUpperCase();

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--surface)]/95 shadow-[0_1px_2px_rgba(16,24,40,0.03)] backdrop-blur">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Link href="/dashboard" className="flex min-w-fit items-center gap-2 text-[var(--primary)]" aria-label="Kinetic Academy home">
          <KineticMark />
          <span className="hidden leading-tight sm:block">
            <span className="block text-sm font-semibold tracking-tight text-[var(--text-hi)]">Kinetic Academy</span>
            <span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--text-lo)]">Application Studio</span>
          </span>
        </Link>

        <div className="mx-auto min-w-0 flex-1 px-1 sm:px-4">
          <GlobalSearch />
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            aria-label="Notifications"
            title="Notifications are not configured yet"
            className="flex h-10 w-10 items-center justify-center rounded-md text-[var(--text-mid)] transition hover:bg-[var(--surface-2)] hover:text-[var(--text-hi)]"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M10 21h4" strokeLinecap="round" />
            </svg>
          </button>

          {!loading && user ? (
            <div className="flex items-center gap-2">
              <span className="hidden max-w-28 truncate text-sm font-medium text-[var(--text-mid)] lg:block">{displayName}</span>
              <span
                aria-hidden="true"
                title={displayName}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--primary)] text-sm font-semibold text-white shadow-sm"
              >
                {initial}
              </span>
            </div>
          ) : !loading ? (
            <Link
              href="/login"
              className="rounded-md bg-[var(--primary)] px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--primary-dark)]"
            >
              Sign in
            </Link>
          ) : (
            <span aria-label="Loading profile" className="h-9 w-9 animate-pulse rounded-full bg-[var(--surface-3)]" />
          )}
        </div>
      </div>
    </header>
  );
}
