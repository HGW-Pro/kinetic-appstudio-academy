import Link from "next/link";

type CompletionFooterProps = {
  previousHref?: string;
  nextHref?: string;
  topicHref: string;
  isDone: boolean;
  isSignedIn: boolean;
  isSaving: boolean;
  onComplete: () => void;
  isFinalLesson: boolean;
};

export default function CompletionFooter({ previousHref, nextHref, topicHref, isDone, isSignedIn, isSaving, onComplete, isFinalLesson }: CompletionFooterProps) {
  return (
    <footer className="mt-10 border-t border-[var(--border)] pt-6">
      <p className={`mb-4 text-sm font-semibold ${isDone ? "text-[var(--success)]" : "text-[var(--text-mid)]"}`}>
        {isDone ? "✓ Lesson completed" : "Complete this lesson when you are ready to continue."}
      </p>
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        {previousHref ? (
          <Link href={previousHref} className="inline-flex min-h-11 items-center justify-center rounded-md border border-[var(--border-strong)] bg-[var(--surface)] px-4 py-2 text-sm font-semibold text-[var(--text-hi)] hover:bg-[var(--surface-2)]">
            ← Previous lesson
          </Link>
        ) : <span />}
        {isDone && nextHref ? (
          <Link href={nextHref} className="inline-flex min-h-11 items-center justify-center rounded-md bg-[var(--primary)] px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[var(--primary-dark)]">
            Next lesson →
          </Link>
        ) : isDone && isFinalLesson ? (
          <Link href={topicHref} className="inline-flex min-h-11 items-center justify-center rounded-md bg-[var(--primary)] px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[var(--primary-dark)]">
            Back to topic →
          </Link>
        ) : isSignedIn ? (
          <button type="button" onClick={onComplete} disabled={isSaving} className="inline-flex min-h-11 items-center justify-center rounded-md bg-[var(--primary)] px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[var(--primary-dark)] disabled:cursor-wait disabled:opacity-70">
            {isSaving ? "Saving progress…" : isFinalLesson ? "Complete topic →" : "Complete & continue →"}
          </button>
        ) : (
          <Link href="/login" className="inline-flex min-h-11 items-center justify-center rounded-md bg-[var(--primary)] px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[var(--primary-dark)]">
            Sign in to continue →
          </Link>
        )}
      </div>
    </footer>
  );
}
