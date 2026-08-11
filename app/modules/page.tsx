"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { modules } from "../../lib/allModules";
import { useAuth } from "../../components/AuthProvider";
import { loadLocalProgress, loadRemoteProgress, type ProgressState } from "../../lib/progress";

export default function ModulesPage() {
  const { user, loading: authLoading } = useAuth();
  const [progress, setProgress] = useState<ProgressState>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    (async () => {
      const p = user ? await loadRemoteProgress(user.id) : loadLocalProgress();
      setProgress(p);
      setReady(true);
    })();
  }, [user, authLoading]);

  const highestUnlocked = (() => {
    if (!user) return 0;
    let idx = 0;
    for (let i = 0; i < modules.length; i++) {
      if (progress[modules[i].slug]?.completedAt) {
        idx = i + 1;
      } else {
        break;
      }
    }
    return Math.min(idx, modules.length - 1);
  })();

  return (
    <div className="space-y-8">
      <div>
        <span className="badge-pill">🎓 One Course, In Order</span>
        <h1 className="mt-4 text-3xl font-bold text-[var(--text-hi)]">Kinetic Application Studio</h1>
        <p className="mt-2 max-w-2xl text-sm text-[var(--text-mid)]">
          This is a single sequential course. Each module below unlocks only after you pass the
          assignment for the one before it — start at Module 1 and work straight through.
        </p>
      </div>

      <div className="space-y-4">
        {modules.map((m, idx) => {
          const isCertified = !!progress[m.slug]?.completedAt;
          const isLocked = ready && (!user ? idx > 0 : idx > highestUnlocked);
          const card = (
            <div
              className={`group glass-card flex flex-col gap-4 rounded-xl p-6 transition sm:flex-row sm:items-center sm:justify-between ${
                isLocked ? "opacity-60" : "hover:-translate-y-0.5 hover:shadow-md"
              }`}
            >
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[var(--surface-2)] text-2xl">
                  {isLocked ? "🔒" : m.icon}
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[var(--primary)]">
                    Module {idx + 1} · {m.difficulty}
                    {isCertified ? " · 🏆 Certified" : ""}
                  </p>
                  <h2 className="mt-1 text-lg font-semibold text-[var(--text-hi)] group-hover:text-[var(--primary)]">
                    {m.title}
                  </h2>
                  <p className="mt-1 text-sm text-[var(--text-mid)]">{m.tagline}</p>
                  {isLocked && (
                    <p className="mt-1 text-xs text-[var(--text-lo)]">
                      {user ? "Complete the previous module to unlock" : "Sign in to unlock"}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-4 pl-16 text-xs text-[var(--text-lo)] sm:pl-0 sm:text-right">
                <div>
                  <p className="text-sm font-semibold text-[var(--text-hi)]">{m.lessons.length}</p>
                  <p>lessons</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--text-hi)]">{m.estMinutes}m</p>
                  <p>duration</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--text-hi)]">{m.quiz.length}</p>
                  <p>quiz Qs</p>
                </div>
                {!isLocked && (
                  <span className="text-lg text-[var(--text-lo)] transition group-hover:translate-x-1 group-hover:text-[var(--primary)]">
                    →
                  </span>
                )}
              </div>
            </div>
          );

          return isLocked ? (
            <div key={m.slug} className="cursor-not-allowed">
              {card}
            </div>
          ) : (
            <Link key={m.slug} href={`/modules/${m.slug}`}>
              {card}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
