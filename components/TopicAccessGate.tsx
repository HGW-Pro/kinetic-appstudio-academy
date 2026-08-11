"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "./AuthProvider";
import { loadLocalProgress, loadRemoteProgress } from "../lib/progress";
import { getCourse } from "../lib/courses";

export default function TopicAccessGate({
  courseSlug,
  topicSlug,
  children,
}: {
  courseSlug: string;
  topicSlug: string;
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
      const course = getCourse(courseSlug);
      const topics = course?.topics ?? [];
      const idx = topics.findIndex((t) => t.slug === topicSlug);
      let lock = false;
      let blocker = "";

      if (!user) {
        // Signed-out visitors can only ever preview the very first topic.
        lock = idx > 0;
        blocker = topics[0]?.title ?? "";
      } else {
        const progress = await loadRemoteProgress(user.id);
        for (let i = 0; i < idx; i++) {
          if (!progress[topics[i].slug]?.completedAt) {
            lock = true;
            blocker = topics[i].title;
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
  }, [user, authLoading, courseSlug, topicSlug]);

  if (!checked) return null;

  if (locked) {
    return (
      <div className="glass-card glow-border mx-auto max-w-lg rounded-2xl p-10 text-center">
        <div className="text-5xl">🔒</div>
        <h1 className="mt-4 text-xl font-bold text-[var(--text-hi)]">This topic is locked</h1>
        <p className="mt-2 text-sm text-[var(--text-mid)]">
          {user
            ? `Pass the assignment for "${blockerTitle}" first (score 80%+) to unlock this topic.`
            : "Sign in and complete the course in order to unlock this topic."}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href={`/courses/${courseSlug}`}
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
