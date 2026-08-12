"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../AuthProvider";
import { markLessonComplete } from "../../lib/progress";
import { normalizeContentBlocks, type SubtopicRecord } from "../../lib/admin/types";
import CmsContentRenderer from "./CmsContentRenderer";

export default function LibrarySubtopicClient({
  courseSlug,
  topicSlug,
  moduleSlug,
  subtopic,
  subtopicIndex,
  totalSubtopics,
  nextSubtopicId,
  hasQuizHere,
}: {
  courseSlug: string;
  topicSlug: string;
  moduleSlug: string;
  subtopic: SubtopicRecord;
  subtopicIndex: number;
  totalSubtopics: number;
  nextSubtopicId: string | null;
  hasQuizHere: boolean;
}) {
  const { user } = useAuth();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  // Defensive: renders correctly even for subtopics saved before the
  // ordered SlideNode[] schema (see lib/admin/types.ts normalizeContentBlocks).
  const blocks = normalizeContentBlocks(subtopic.content_json);

  async function handleComplete() {
    if (!user) return;
    setSaving(true);
    setSyncError(null);
    const { remoteWrite } = markLessonComplete(moduleSlug, subtopic.id, user.id);
    if (remoteWrite) {
      const { error } = await remoteWrite;
      if (error) {
        setSaving(false);
        setSyncError("Saved on this device, but couldn't sync to your account: " + error);
        return;
      }
    }
    setSaving(false);
    if (nextSubtopicId) {
      router.push(`/library/${courseSlug}/${topicSlug}/${nextSubtopicId}`);
    } else if (hasQuizHere) {
      router.push(`/library/${courseSlug}/${topicSlug}/${subtopic.id}/quiz`);
    } else {
      router.push(`/library/${courseSlug}/${topicSlug}`);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-6 py-10">
      <div className="flex items-center justify-center gap-1.5">
        {Array.from({ length: totalSubtopics }).map((_, i) => (
          <span
            key={i}
            className={`h-1.5 max-w-10 flex-1 rounded-full ${
              i <= subtopicIndex ? "bg-[var(--primary)]" : "bg-[var(--surface-3)]"
            }`}
          />
        ))}
      </div>
      <p className="text-center text-xs text-[var(--text-lo)]">
        Subtopic {subtopicIndex + 1} of {totalSubtopics}
      </p>

      {syncError && (
        <div className="rounded-lg border border-[var(--error)]/30 bg-[var(--error-soft)] px-4 py-3 text-sm text-[var(--error)]">
          ⚠️ {syncError}
        </div>
      )}

      <div className="glass-card glow-border rounded-2xl p-8">
        <h1 className="text-xl font-bold text-[var(--text-hi)] sm:text-2xl">{subtopic.title}</h1>
        <div className="mt-6">
          <CmsContentRenderer blocks={blocks} />
        </div>

        <div className="mt-8 flex items-center justify-between border-t border-[var(--border)] pt-6">
          <Link
            href={`/library/${courseSlug}/${topicSlug}`}
            className="rounded-md border border-[var(--border-strong)] bg-[var(--surface-2)] px-5 py-2.5 text-sm font-semibold text-[var(--text-hi)] transition hover:bg-[var(--surface-3)]"
          >
            ← Back
          </Link>
          {user ? (
            <button
              onClick={handleComplete}
              disabled={saving}
              className="rounded-md bg-[var(--primary)] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--primary-dark)] disabled:opacity-60"
            >
              {saving ? "Saving…" : nextSubtopicId ? "Complete & Continue →" : hasQuizHere ? "Complete → Take Quiz" : "Complete Topic →"}
            </button>
          ) : (
            <Link
              href="/login"
              className="rounded-md bg-[var(--primary)] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--primary-dark)]"
            >
              Sign in to continue →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
