"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Module } from "../lib/curriculum";
import { loadProgress, overallStats, type ProgressState } from "../lib/progress";

export default function DashboardClient({ modules }: { modules: Module[] }) {
  const [progress, setProgress] = useState<ProgressState>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setProgress(loadProgress());
    setMounted(true);
  }, []);

  const totalLessons = modules.reduce((n, m) => n + m.lessons.length, 0);
  const stats = mounted
    ? overallStats(modules.length, totalLessons)
    : { lessonsDone: 0, totalLessons, modulesCertified: 0, totalModules: modules.length, avgScore: 0 };

  const overallPct = totalLessons ? Math.round((stats.lessonsDone / totalLessons) * 100) : 0;

  return (
    <div className="space-y-10">
      <div>
        <span className="badge-pill">📈 Your Progress</span>
        <h1 className="mt-4 text-3xl font-bold text-[var(--text-hi)]">Learning Dashboard</h1>
        <p className="mt-2 max-w-2xl text-sm text-[var(--text-mid)]">
          Track your journey through the Kinetic AppStudio curriculum. Progress is saved locally
          on this device.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-4">
        <MetricCard label="Overall Progress" value={`${overallPct}%`} accent />
        <MetricCard label="Lessons Completed" value={`${stats.lessonsDone}/${stats.totalLessons}`} />
        <MetricCard label="Modules Certified" value={`${stats.modulesCertified}/${stats.totalModules}`} />
        <MetricCard label="Average Quiz Score" value={`${stats.avgScore}%`} />
      </div>

      <div>
        <h2 className="mb-5 text-xl font-semibold text-[var(--text-hi)]">Your Tracks</h2>
        <div className="space-y-4">
          {modules.map((m, idx) => {
            const mp = progress[m.slug];
            const lessonsDone = mp?.lessonsCompleted.length ?? 0;
            const pct = m.lessons.length ? Math.round((lessonsDone / m.lessons.length) * 100) : 0;
            const certified = !!mp?.completedAt;
            return (
              <div key={m.slug} className="glass-card rounded-2xl p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{m.icon}</span>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--accent-2)]">
                        Module {idx + 1}
                      </p>
                      <h3 className="text-base font-semibold text-[var(--text-hi)]">{m.title}</h3>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {certified && <span className="badge-pill">🏆 Certified</span>}
                    {typeof mp?.quizScore === "number" && (
                      <span className="badge-pill">Best score: {mp.quizScore}%</span>
                    )}
                    <Link
                      href={`/modules/${m.slug}`}
                      className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-[var(--text-hi)] transition hover:bg-white/10"
                    >
                      {lessonsDone > 0 ? "Continue" : "Start"} →
                    </Link>
                  </div>
                </div>
                <div className="progress-track mt-4 h-2">
                  <div className="progress-fill h-full" style={{ width: `${pct}%` }} />
                </div>
                <p className="mt-2 text-xs text-[var(--text-lo)]">
                  {lessonsDone}/{m.lessons.length} lessons complete
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6 text-center">
        <h2 className="text-lg font-semibold text-[var(--text-hi)]">Next up: put it into practice</h2>
        <p className="mt-1 text-sm text-[var(--text-mid)]">
          Head to the Labs section to apply what you've learned in a real Kinetic scenario.
        </p>
        <Link
          href="/labs"
          className="mt-5 inline-block rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[var(--accent)]/30 transition hover:scale-[1.02]"
        >
          Go to Hands-On Labs →
        </Link>
      </div>
    </div>
  );
}

function MetricCard({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="glass-card rounded-2xl p-5 text-center">
      <p
        className={`text-2xl font-bold ${
          accent ? "bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] bg-clip-text text-transparent" : "text-[var(--text-hi)]"
        }`}
      >
        {value}
      </p>
      <p className="mt-1 text-[11px] uppercase tracking-wide text-[var(--text-lo)]">{label}</p>
    </div>
  );
}
