"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "./AuthProvider";
import { loadRemoteProgress, enrollInModule } from "../lib/progress";
import { modules } from "../lib/allModules";

export default function ModuleAccessGate({
  moduleSlug,
  requireEnrollment = true,
  children,
}: {
  moduleSlug: string;
  // The module overview page hosts the "Enroll" button itself, so it passes
  // requireEnrollment={false}. Lesson list / quiz pages use the default
  // (true) so a user can't view or complete content without enrolling first.
  requireEnrollment?: boolean;
  children: React.ReactNode;
}) {
  const { user, loading: authLoading } = useAuth();
  const [checked, setChecked] = useState(false);
  const [sequentialLocked, setSequentialLocked] = useState(false);
  const [blockerTitle, setBlockerTitle] = useState("");
  const [enrolled, setEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [enrollError, setEnrollError] = useState<string | null>(null);

  const currentModule = modules.find((m) => m.slug === moduleSlug);

  useEffect(() => {
    if (authLoading) return;
    let cancelled = false;
    (async () => {
      const idx = modules.findIndex((m) => m.slug === moduleSlug);
      let lock = false;
      let blocker = "";

      if (!user) {
        lock = idx > 0;
        blocker = modules[0]?.title ?? "";
        if (!cancelled) {
          setSequentialLocked(lock);
          setBlockerTitle(blocker);
          setEnrolled(false);
          setChecked(true);
        }
        return;
      }

      const progress = await loadRemoteProgress(user.id);
      for (let i = 0; i < idx; i++) {
        if (!progress[modules[i].slug]?.completedAt) {
          lock = true;
          blocker = modules[i].title;
          break;
        }
      }

      if (!cancelled) {
        setSequentialLocked(lock);
        setBlockerTitle(blocker);
        setEnrolled(!!progress[moduleSlug]?.enrolled);
        setChecked(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user, authLoading, moduleSlug]);

  async function handleEnrollAndStart() {
    if (!user) return;
    setEnrolling(true);
    setEnrollError(null);
    const { error } = await enrollInModule(user.id, moduleSlug);
    setEnrolling(false);
    if (error) {
      setEnrollError("Enrollment failed to save: " + error);
      return;
    }
    setEnrolled(true);
  }

  if (!checked) return null;

  if (sequentialLocked) {
    return (
      <div className="glass-card glow-border mx-auto max-w-lg rounded-2xl p-10 text-center">
        <div className="text-5xl">🔒</div>
        <h1 className="mt-4 text-xl font-bold text-[var(--text-hi)]">This module is locked</h1>
        <p className="mt-2 text-sm text-[var(--text-mid)]">
          {user
            ? `Pass the assignment for "${blockerTitle}" first (score 80%+) to unlock this module.`
            : "Sign in and complete the course in order to unlock this module."}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/modules"
            className="rounded-md border border-[var(--border-strong)] bg-[var(--surface-2)] px-5 py-2.5 text-sm font-semibold text-[var(--text-hi)] transition hover:bg-[var(--surface-3)]"
          >
            ← Back to Modules
          </Link>
          {!user && (
            <Link
              href="/login"
              className="rounded-md bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--primary-dark)]"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    );
  }

  if (!requireEnrollment) {
    return <>{children}</>;
  }

  if (!user) {
    return (
      <div className="glass-card glow-border mx-auto max-w-lg rounded-2xl p-10 text-center">
        <div className="text-5xl">🔑</div>
        <h1 className="mt-4 text-xl font-bold text-[var(--text-hi)]">Sign in to start this module</h1>
        <p className="mt-2 text-sm text-[var(--text-mid)]">
          You need an account to enroll in "{currentModule?.title ?? "this module"}" and begin tracking
          your progress.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/login"
            className="rounded-md bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--primary-dark)]"
          >
            Sign In
          </Link>
          <Link
            href="/modules"
            className="rounded-md border border-[var(--border-strong)] bg-[var(--surface-2)] px-5 py-2.5 text-sm font-semibold text-[var(--text-hi)] transition hover:bg-[var(--surface-3)]"
          >
            ← Back to Modules
          </Link>
        </div>
      </div>
    );
  }

  if (!enrolled) {
    return (
      <div className="glass-card glow-border mx-auto max-w-lg rounded-2xl p-10 text-center">
        <div className="text-5xl">{currentModule?.icon ?? "📚"}</div>
        <h1 className="mt-4 text-xl font-bold text-[var(--text-hi)]">
          Enroll to start "{currentModule?.title ?? "this module"}"
        </h1>
        <p className="mt-2 text-sm text-[var(--text-mid)]">
          You need to enroll before you can open its lessons or take the assignment.
        </p>
        {enrollError && (
          <p className="mt-3 rounded-lg border border-[var(--error)]/30 bg-[var(--error-soft)] px-4 py-2 text-xs text-[var(--error)]">
            ⚠️ {enrollError}
          </p>
        )}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            onClick={handleEnrollAndStart}
            disabled={enrolling}
            className="rounded-md bg-[var(--primary)] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--primary-dark)] disabled:opacity-60"
          >
            {enrolling ? "Enrolling…" : "Enroll & Start →"}
          </button>
          <Link
            href="/modules"
            className="rounded-md border border-[var(--border-strong)] bg-[var(--surface-2)] px-5 py-2.5 text-sm font-semibold text-[var(--text-hi)] transition hover:bg-[var(--surface-3)]"
          >
            ← Back to Modules
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
