"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "../AuthProvider";
import { loadRemoteProgress, loadLocalProgress, enrollInModule } from "../../lib/progress";
import type { SubtopicRecord } from "../../lib/admin/types";

export default function LibraryTopicClient({
  courseSlug,
  courseTitle,
  topicSlug,
  moduleSlug,
  subtopics,
  hasQuiz,
}: {
  courseSlug: string;
  courseTitle: string;
  topicSlug: string;
  moduleSlug: string;
  subtopics: SubtopicRecord[];
  hasQuiz: boolean;
}) {
  const { user, loading: authLoading } = useAuth();
  const [doneIds, setDoneIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [enrollError, setEnrollError] = useState<string | null>(null);
  const [certified, setCertified] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    (async () => {
      const p = user ? await loadRemoteProgress(user.id) : loadLocalProgress();
      setDoneIds(p[moduleSlug]?.lessonsCompleted ?? []);
      setEnrolled(!!p[moduleSlug]?.enrolled);
      setCertified(!!p[moduleSlug]?.completedAt);
      setReady(true);
    })();
  }, [user, authLoading, moduleSlug]);

  async function handleEnroll() {
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

  const highestUnlocked = user ? Math.min(doneIds.length, subtopics.length - 1) : 0;
  const allDone = subtopics.length > 0 && doneIds.length >= subtopics.length;

  return (
    <div className="space-y-6">
      <div className="glass-card flex flex-wrap items-center justify-between gap-3 rounded-xl p-5">
        <div className="text-sm text-[var(--text-mid)]">
          {subtopics.length} subtopic{subtopics.length === 1 ? "" : "s"}
          {hasQuiz && " · includes assignment(s)"}
          {certified && " · 🏆 Certified"}
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
              {enrolled ? "Enrolled ✓" : enrolling ? "Enrolling…" : "Enroll in Topic"}
            </button>
            {enrollError && <p className="max-w-xs text-right text-xs text-[var(--error)]">⚠️ {enrollError}</p>}
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

      {!enrolled && user && (
        <p className="rounded-lg border border-[var(--primary)]/20 bg-[var(--primary)]/[0.05] px-4 py-3 text-xs text-[var(--text-mid)]">
          💡 You must enroll before you can open any subtopic below.
        </p>
      )}

      <div className="space-y-2">
        {subtopics.map((s, i) => {
          const done = doneIds.includes(s.id);
          const locked = ready && (i > highestUnlocked || !enrolled);
          const row = (
            <div
              className={`flex items-center justify-between rounded-lg border px-4 py-3 transition ${
                locked
                  ? "border-[var(--border)] bg-[var(--surface-2)] opacity-60"
                  : "border-[var(--border-strong)] bg-[var(--surface)] hover:bg-[var(--surface-2)]"
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    done
                      ? "bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] text-white"
                      : locked
                      ? "bg-[var(--surface-3)] text-[var(--text-lo)]"
                      : "border border-[var(--primary)] text-[var(--primary)]"
                  }`}
                >
                  {done ? "✓" : locked ? "🔒" : i + 1}
                </span>
                <span className="text-sm font-medium text-[var(--text-hi)]">{s.title}</span>
              </div>
            </div>
          );
          return locked ? (
            <div key={s.id}>{row}</div>
          ) : (
            <Link key={s.id} href={`/library/${courseSlug}/${topicSlug}/${s.id}`}>
              {row}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
