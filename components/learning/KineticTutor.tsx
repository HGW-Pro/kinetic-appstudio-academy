"use client";

import { useState } from "react";

export type KineticTutorProps = {
  lessonTitle: string;
  topicTitle: string;
  className?: string;
};

/**
 * Future tutor boundary. It intentionally performs no network request until
 * a grounded academy-content service is configured.
 */
export default function KineticTutor({ lessonTitle, topicTitle, className = "" }: KineticTutorProps) {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function ask(event: React.FormEvent) {
    event.preventDefault();
    if (!question.trim()) return;
    setSubmitted(true);
  }

  return (
    <aside className={`border border-[var(--border)] bg-[var(--surface-2)] ${className}`} aria-labelledby="kinetic-tutor-heading">
      <button type="button" onClick={() => setOpen((current) => !current)} aria-expanded={open} className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left">
        <span><span id="kinetic-tutor-heading" className="block text-sm font-semibold text-[var(--text-hi)]">Ask Kinetic Tutor</span><span className="mt-0.5 block text-xs text-[var(--text-lo)]">Future content-grounded help for this lesson</span></span>
        <span aria-hidden="true" className="text-[var(--text-lo)]">{open ? "−" : "+"}</span>
      </button>
      {open && (
        <form onSubmit={ask} className="border-t border-[var(--border)] px-4 py-4">
          <label className="block text-xs font-semibold uppercase tracking-[0.11em] text-[var(--text-lo)]">Question about {topicTitle}</label>
          <textarea value={question} onChange={(event) => { setQuestion(event.target.value); setSubmitted(false); }} rows={3} placeholder={`For example: Why does ${lessonTitle} matter?`} className="mt-2 w-full resize-y border border-[var(--border-strong)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text-hi)] outline-none placeholder:text-[var(--text-lo)] focus:border-[var(--primary)]" />
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-[var(--text-lo)]">Questions are not sent or stored.</p>
            <button type="submit" disabled={!question.trim()} className="rounded-md bg-[var(--primary)] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[var(--primary-dark)] disabled:opacity-50">Ask</button>
          </div>
          {submitted && <p role="status" className="mt-3 border-l-2 border-[var(--accent)] bg-[var(--accent-soft)] px-3 py-2 text-sm text-[var(--text-mid)]">Kinetic Tutor is coming soon — your question was not sent.</p>}
        </form>
      )}
    </aside>
  );
}
