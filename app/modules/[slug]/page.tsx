"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { modules, getModule } from "../../../lib/allModules";
import LessonList from "../../../components/LessonList";
import ModuleAccessGate from "../../../components/ModuleAccessGate";
import { useAuth } from "../../../components/AuthProvider";
import { enrollInModule } from "../../../lib/progress";

export default function ModuleDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const mod = getModule(params.slug);
  if (!mod) notFound();

  const { user } = useAuth();
  const [enrolled, setEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [enrollError, setEnrollError] = useState<string | null>(null);

  const idx = modules.findIndex((m) => m.slug === mod.slug);
  const prev = modules[idx - 1];
  const next = modules[idx + 1];

  useEffect(() => {
    setEnrolled(false);
    setEnrollError(null);
  }, [mod.slug]);

  async function handleEnroll() {
    if (!user) return;
    setEnrolling(true);
    setEnrollError(null);
    const { error } = await enrollInModule(user.id, mod.slug);
    setEnrolling(false);
    if (error) {
      setEnrollError("Enrollment failed to save: " + error);
      return;
    }
    setEnrolled(true);
  }

  return (
    <ModuleAccessGate moduleSlug={mod.slug}>
      <div className="space-y-10">
        <div className="glass-card glow-border rounded-2xl p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{mod.icon}</span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--primary)]">
                  Module {idx + 1} of {modules.length} · {mod.difficulty}
                </p>
                <h1 className="text-2xl font-bold text-[var(--text-hi)] sm:text-3xl">{mod.title}</h1>
              </div>
            </div>

            {user ? (
              <div className="flex flex-col items-end gap-1">
                <button
                  onClick={handleEnroll}
                  disabled={enrolling || enrolled}
                  className={`rounded-md px-4 py-2 text-sm font-semibold shadow-sm transition ${
                    enrolled
                      ? "cursor-default bg-[var(--success-soft)] text-[var(--success)]"
                      : "bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)]"
                  }`}
                >
                  {enrolled ? "Enrolled ✓" : enrolling ? "Enrolling…" : "Enroll in Module"}
                </button>
                {enrollError && (
                  <p className="max-w-xs text-right text-xs text-[var(--error)]">⚠️ {enrollError}</p>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="rounded-md border border-[var(--border-strong)] bg-[var(--surface-2)] px-4 py-2 text-sm font-semibold text-[var(--text-hi)] transition hover:bg-[var(--surface-3)]"
              >
                Sign in to enroll
              </Link>
            )}
          </div>
          <p className="mt-4 max-w-2xl text-sm text-[var(--text-mid)]">{mod.tagline}</p>
          <div className="mt-5 flex flex-wrap gap-3 text-xs text-[var(--text-lo)]">
            <span className="badge-pill">{mod.lessons.length} lessons</span>
            <span className="badge-pill">{mod.estMinutes} min</span>
            <span className="badge-pill">{mod.quiz.length}-question assignment</span>
          </div>
        </div>

        <LessonList moduleSlug={mod.slug} lessons={mod.lessons} />

        <div className="glass-card rounded-2xl p-6 text-center">
          <h2 className="text-lg font-semibold text-[var(--text-hi)]">
            Ready to test your knowledge?
          </h2>
          <p className="mt-1 text-sm text-[var(--text-mid)]">
            Score 80% or higher on the {mod.quiz.length}-question assignment to earn this module's badge
            and unlock the next module.
          </p>
          <Link
            href={`/modules/${mod.slug}/quiz`}
            className="mt-5 inline-block rounded-md bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--primary-dark)]"
          >
            Take the Assignment →
          </Link>
        </div>

        <div className="flex items-center justify-between text-sm">
          {prev ? (
            <Link href={`/modules/${prev.slug}`} className="text-[var(--text-mid)] hover:text-[var(--primary)]">
              ← {prev.title}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link href={`/modules/${next.slug}`} className="text-[var(--text-mid)] hover:text-[var(--primary)]">
              {next.title} →
            </Link>
          ) : (
            <span />
          )}
        </div>
      </div>
    </ModuleAccessGate>
  );
}
