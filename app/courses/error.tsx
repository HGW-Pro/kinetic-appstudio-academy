"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function CoursesError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Courses route error boundary caught:", error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center justify-center rounded-2xl border border-[var(--border-strong)] bg-[var(--surface)] px-8 py-16 text-center shadow-sm">
      <span className="text-5xl">⚠️</span>
      <h1 className="mt-5 text-xl font-bold text-[var(--text-hi)]">
        Something went wrong loading this course
      </h1>
      <p className="mt-2 text-sm text-[var(--text-mid)]">
        This could be a temporary connection issue with our content database. Your progress is
        safe — try again in a moment.
      </p>
      {error.digest && (
        <p className="mt-3 rounded-md bg-[var(--surface-2)] px-3 py-1.5 font-mono text-xs text-[var(--text-lo)]">
          Error ref: {error.digest}
        </p>
      )}
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          onClick={reset}
          className="rounded-md bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--primary-dark)]"
        >
          ↻ Try Again
        </button>
        <Link
          href="/"
          className="rounded-md border border-[var(--border-strong)] bg-[var(--surface-2)] px-5 py-2.5 text-sm font-semibold text-[var(--text-hi)] transition hover:bg-[var(--surface-3)]"
        >
          Back to Courses
        </Link>
      </div>
    </div>
  );
}
