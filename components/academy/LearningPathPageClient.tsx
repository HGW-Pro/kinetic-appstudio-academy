"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "../AuthProvider";
import { loadLocalProgress, loadRemoteProgress, type ProgressState } from "../../lib/progress";
import LearningPath from "./LearningPath";
import type { LearningPathCourse } from "./learningPathTypes";

export default function LearningPathPageClient({ courses }: { courses: LearningPathCourse[] }) {
  const { user, loading: authLoading } = useAuth();
  const [progress, setProgress] = useState<ProgressState>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    let cancelled = false;
    (async () => {
      const state = user ? await loadRemoteProgress(user.id) : loadLocalProgress();
      if (!cancelled) {
        setProgress(state);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [authLoading, user]);

  return (
    <div className="space-y-8">
      <section className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--primary)]">Kinetic Application Studio</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[var(--text-hi)]">Learning path</h1>
        <p className="mt-3 text-sm leading-6 text-[var(--text-mid)]">
          Follow the published curriculum in sequence. You can preview every course; complete the required work to unlock the next step.
        </p>
      </section>

      {!user && !authLoading && (
        <div className="flex flex-wrap items-center justify-between gap-4 border-y border-[var(--border)] py-4">
          <p className="text-sm text-[var(--text-mid)]">Sign in to keep your progress synced across devices.</p>
          <Link href="/login" className="text-sm font-semibold text-[var(--primary)] hover:text-[var(--primary-dark)]">Sign in →</Link>
        </div>
      )}

      <section aria-label="Course sequence" className="max-w-5xl">
        {loading ? (
          <p className="py-12 text-center text-sm text-[var(--text-lo)]">Loading your learning path…</p>
        ) : (
          <LearningPath courses={courses} progress={progress} />
        )}
      </section>
    </div>
  );
}
