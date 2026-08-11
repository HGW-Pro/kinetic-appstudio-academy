"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "./AuthProvider";
import { loadLocalProgress, loadRemoteProgress } from "../lib/progress";
import { modules } from "../lib/allModules";

export default function ModuleAccessGate({
  moduleSlug,
  children,
}: {
  moduleSlug: string;
  children: React.ReactNode;
}) {
  const { user, loading: authLoading } = useAuth();
  const [checked, setChecked] = useState(false);
  const [locked, setLocked] = useState(false);
  const [blockerTitle, setBlockerTitle] = useState("");

  useEffect(() => {
    if (authLoading) return;
    let cancelled = false;
    (async () => {
      const idx = modules.findIndex((m) => m.slug === moduleSlug);
      let lock = false;
      let blocker = "";

      if (!user) {
        // Signed-out visitors can only ever preview the very first module.
        lock = idx > 0;
        blocker = modules[0]?.title ?? "";
      } else {
        const progress = await loadRemoteProgress(user.id);
        for (let i = 0; i < idx; i++) {
          if (!progress[modules[i].slug]?.completedAt) {
            lock = true;
            blocker = modules[i].title;
            break;
          }
        }
      }

      if (!cancelled) {
        setLocked(lock);
        setBlockerTitle(blocker);
        setChecked(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user, authLoading, moduleSlug]);

  if (!checked) return null;

  if (locked) {
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
            ← Back to Course Outline
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

  return <>{children}</>;
}
