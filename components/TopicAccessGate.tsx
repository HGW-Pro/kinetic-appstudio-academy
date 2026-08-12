"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "./AuthProvider";
import { loadRemoteProgress, enrollInModule } from "../lib/progress";
import type { Module } from "../lib/curriculum";

export default function TopicAccessGate({
  courseSlug,
  topics,
  topicSlug,
  requireEnrollment = true,
  children,
}: {
  courseSlug: string;
  topics: Module[];
  topicSlug: string;
  // The topic overview page itself hosts the "Enroll" button, so it must NOT
  // require enrollment to be viewed — otherwise there's no way to enroll.
  // Subtopic and quiz pages set this to true (the default) so a user can't
  // start the actual content without enrolling first.
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

  const currentTopic = topics.find((t) => t.slug === topicSlug);

  useEffect(() => {
    if (authLoading) return;
    let cancelled = false;
    (async () => {
      const idx = topics.findIndex((t) => t.slug === topicSlug);
      let lock = false;
      let blocker = "";

      if (!user) {
        lock = idx > 0;
        blocker = topics[0]?.title ?? "";
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
        if (!progress[topics[i].slug]?.completedAt) {
          lock = true;
          blocker = topics[i].title;
          break;
        }
      }

      if (!cancelled) {
        setSequentialLocked(lock);
        setBlockerTitle(blocker);
        setEnrolled(!!progress[topicSlug]?.enrolled);
        setChecked(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user, authLoading, topicSlug, topics]);

  async function handleEnrollAndStart() {
    if (!user) return;
    setEnrolling(true);
    setEnrollError(null);
    const { error } = await enrollInModule(user.id, topicSlug);
    setEnrolling(false);
    if (error) {
      setEnrollError("Enrollment failed to save: " + error);
      return;
    }
    setEnrolled(true);
  }

  if (!checked) return null;

  // 1) Sequential lock — a previous topic isn't finished yet.
  if (sequentialLocked) {
    return (
      <div className="glass-card glow-border mx-auto max-w-lg rounded-2xl p-10 text-center">
        <div className="text-5xl">🔒</div>
        <h1 className="mt-4 text-xl font-bold text-[var(--text-hi)]">This topic is locked</h1>
        <p className="mt-2 text-sm text-[var(--text-mid)]">
          {user
            ? `Pass the assessment for "${blockerTitle}" first (score 80%+) to unlock this topic.`
            : "Sign in and complete the course in order to unlock this topic."}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href={`/courses/${courseSlug}`}
            className="rounded-md border border-[var(--border-strong)] bg-[var(--surface-2)] px-5 py-2.5 text-sm font-semibold text-[var(--text-hi)] transition hover:bg-[var(--surface-3)]"
          >
            ← Back to Course
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

  // 2) Not signed in at all — can't enroll, so can't start.
  if (!user) {
    return (
      <div className="glass-card glow-border mx-auto max-w-lg rounded-2xl p-10 text-center">
        <div className="text-5xl">🔑</div>
        <h1 className="mt-4 text-xl font-bold text-[var(--text-hi)]">Sign in to start this topic</h1>
        <p className="mt-2 text-sm text-[var(--text-mid)]">
          You need an account to enroll in "{currentTopic?.title ?? "this topic"}" and begin tracking
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
            href={`/courses/${courseSlug}`}
            className="rounded-md border border-[var(--border-strong)] bg-[var(--surface-2)] px-5 py-2.5 text-sm font-semibold text-[var(--text-hi)] transition hover:bg-[var(--surface-3)]"
          >
            ← Back to Course
          </Link>
        </div>
      </div>
    );
  }

  // 3) Signed in, but hasn't clicked Enroll for this specific topic yet.
  if (!enrolled) {
    return (
      <div className="glass-card glow-border mx-auto max-w-lg rounded-2xl p-10 text-center">
        <div className="text-5xl">{currentTopic?.icon ?? "📚"}</div>
        <h1 className="mt-4 text-xl font-bold text-[var(--text-hi)]">
          Enroll to start "{currentTopic?.title ?? "this topic"}"
        </h1>
        <p className="mt-2 text-sm text-[var(--text-mid)]">
          You need to enroll before you can open its subtopics or take the assessment.
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
            href={`/courses/${courseSlug}`}
            className="rounded-md border border-[var(--border-strong)] bg-[var(--surface-2)] px-5 py-2.5 text-sm font-semibold text-[var(--text-hi)] transition hover:bg-[var(--surface-3)]"
          >
            ← Back to Course
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
