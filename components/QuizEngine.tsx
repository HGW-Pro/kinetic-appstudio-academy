"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import type { QuizQuestion } from "../lib/curriculum";
import { recordQuizResult } from "../lib/progress";
import { useAuth } from "./AuthProvider";
import { playSound } from "../lib/sounds";
import Confetti from "./Confetti";
import { supabase } from "../lib/supabaseClient";

// Fisher-Yates shuffle — returns a new array, does not mutate the input.
function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Re-orders each question's options randomly and remaps correctIndex to match,
// so the correct answer isn't predictably in the same position every time.
function shuffleQuestionOptions(questions: QuizQuestion[]): QuizQuestion[] {
  return questions.map((q) => {
    const order = shuffle(q.options.map((_, i) => i));
    const options = order.map((i) => q.options[i]);
    const correctIndex = order.indexOf(q.correctIndex);
    return { ...q, options, correctIndex };
  });
}

interface LockoutStatus {
  locked: boolean;
  lockedUntil: string | null;
  failStreak: number;
}

function formatCountdown(msRemaining: number): string {
  const totalSeconds = Math.max(0, Math.floor(msRemaining / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours}h ${minutes}m ${seconds}s`;
}

// Reads the streak-lockout status computed server-side by the
// my_quiz_lockout_status() Postgres function (SECURITY DEFINER, scoped to
// auth.uid() so a user can only ever check their own status). 3 consecutive
// fails on this moduleSlug's quiz -> locked for 24h from the 3rd failure.
// The same rule is also enforced by a BEFORE INSERT trigger on
// quiz_attempts, so this client-side check is a UX convenience layered on
// top of a real server-side guarantee, not the only enforcement.
function useQuizLockout(moduleSlug: string, userId: string | undefined, refreshKey: number) {
  const [status, setStatus] = useState<LockoutStatus | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!userId) {
      setStatus({ locked: false, lockedUntil: null, failStreak: 0 });
      setChecked(true);
      return;
    }
    setChecked(false);
    (async () => {
      const { data, error } = await supabase.rpc("my_quiz_lockout_status", {
        p_module_slug: moduleSlug,
      });
      if (error) {
        console.error("quiz lockout check failed", error);
        setStatus({ locked: false, lockedUntil: null, failStreak: 0 });
      } else {
        setStatus(data as LockoutStatus);
      }
      setChecked(true);
    })();
  }, [moduleSlug, userId, refreshKey]);

  return { status, checked };
}

function LockoutScreen({ lockedUntil, label }: { lockedUntil: string; label: "Knowledge Check" | "Assessment" }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const remainingMs = new Date(lockedUntil).getTime() - now;

  if (remainingMs <= 0) {
    return (
      <div className="glass-card glow-border mx-auto max-w-xl rounded-2xl p-10 text-center">
        <div className="text-5xl">🔓</div>
        <h2 className="mt-4 text-xl font-bold text-[var(--text-hi)]">Lockout lifted</h2>
        <p className="mt-2 text-sm text-[var(--text-mid)]">Refresh the page to try the {label.toLowerCase()} again.</p>
      </div>
    );
  }

  return (
    <div className="glass-card glow-border mx-auto max-w-xl rounded-2xl p-10 text-center">
      <div className="text-5xl">🔒</div>
      <h2 className="mt-4 text-xl font-bold text-[var(--text-hi)]">{label} temporarily locked</h2>
      <p className="mt-2 text-sm text-[var(--text-mid)]">
        You&apos;ve missed this {label.toLowerCase()} 3 times in a row. Take a break and review the subtopics — you can
        try again in:
      </p>
      <p className="mt-4 rounded-lg bg-[var(--surface-2)] px-4 py-3 font-mono text-lg font-semibold text-[var(--primary)]">
        {formatCountdown(remainingMs)}
      </p>
      <Link
        href="/dashboard"
        className="mt-6 inline-block rounded-md border border-[var(--border-strong)] bg-[var(--surface-2)] px-5 py-2.5 text-sm font-semibold text-[var(--text-hi)] transition hover:bg-[var(--surface-3)]"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}

// Optimistic-UI sync status for the background quiz-result write. Note:
// this project pins react@18.3.1, which does NOT export React's
// `useOptimistic` hook (added in React 19) -- importing it would crash the
// build immediately. useState + useTransition below produce the identical
// UX (instant transition to the results screen, non-blocking background
// sync, error surfaced without rolling back the pass/fail result) without
// requiring a React major-version upgrade.
type SyncState = { status: "idle" | "pending" | "success" | "error"; error: string | null };

export default function QuizEngine({
  moduleSlug,
  moduleTitle,
  questions,
  nextHref,
  label = "Knowledge Check",
}: {
  moduleSlug: string;
  moduleTitle: string;
  questions: QuizQuestion[];
  nextHref?: string;
  /** Presentation-only terminology; scoring and lockout behavior are unchanged. */
  label?: "Knowledge Check" | "Assessment";
}) {
  const { user } = useAuth();
  const [shuffleSeed, setShuffleSeed] = useState(0);
  // Re-shuffled once per mount, and again on every retake (via shuffleSeed).
  const shuffledQuestions = useMemo(
    () => shuffleQuestionOptions(questions),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [questions, shuffleSeed]
  );

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [locked, setLocked] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const [lockoutRefresh, setLockoutRefresh] = useState(0);

  // Optimistic sync of the background Supabase write. The results screen
  // (finished/score/passed) renders the instant the last question is
  // answered -- it never waits on this. sync.status starts "pending" the
  // moment we transition to results and flips to "success"/"error" once
  // the write resolves, purely as a small non-blocking indicator.
  const [sync, setSync] = useState<SyncState>({ status: "idle", error: null });
  const [, startTransition] = useTransition();

  const { status: lockoutStatus, checked: lockoutChecked } = useQuizLockout(
    moduleSlug,
    user?.id,
    lockoutRefresh
  );

  const q = shuffledQuestions[current];
  const isLast = current === shuffledQuestions.length - 1;

  function choose(idx: number) {
    if (locked) return;
    setSelected(idx);
    setLocked(true);
    const correct = idx === q.correctIndex;
    playSound(correct ? "correct" : "wrong");
    if (correct) setScore((s) => s + 1);
  }

  function syncResultInBackground(pct: number) {
    setSync({ status: "pending", error: null });
    startTransition(async () => {
      const { remoteWrite } = recordQuizResult(moduleSlug, pct, user?.id);
      if (!remoteWrite) {
        setSync({ status: "success", error: null });
        setLockoutRefresh((r) => r + 1);
        return;
      }
      const { error } = await remoteWrite;
      if (error) {
        setSync({
          status: "error",
          error: "This score was saved on this device, but couldn't sync to your account: " + error,
        });
      } else {
        setSync({ status: "success", error: null });
      }
      // Re-check lockout status after the write settles -- if this was the
      // 3rd consecutive fail, the results screen below re-renders into the
      // locked state on its own via lockoutStatus.
      setLockoutRefresh((r) => r + 1);
    });
  }

  function next() {
    if (isLast) {
      const pct = Math.round((score / shuffledQuestions.length) * 100);
      const passed = pct >= 80;
      playSound(passed ? "fanfare" : "wrong");
      if (passed) {
        setCelebrate(true);
        window.setTimeout(() => setCelebrate(false), 3200);
      }
      // Instant: show the results screen right away, computed entirely
      // from local `score` -- no waiting on the network for this part.
      setFinished(true);
      // Background: the Supabase write and the lockout re-check happen
      // without blocking the transition above.
      syncResultInBackground(pct);
      return;
    }
    playSound("click");
    setCurrent((c) => c + 1);
    setSelected(null);
    setLocked(false);
  }

  function retake() {
    playSound("click");
    setShuffleSeed((s) => s + 1); // triggers a fresh shuffle of options
    setCurrent(0);
    setSelected(null);
    setLocked(false);
    setScore(0);
    setFinished(false);
    setSync({ status: "idle", error: null });
  }

  // Wait for the lockout check before rendering anything quiz-related, to
  // avoid a flash of quiz content for a user who is actually locked out.
  if (!lockoutChecked) return null;
  if (lockoutStatus?.locked && lockoutStatus.lockedUntil) {
    return <LockoutScreen lockedUntil={lockoutStatus.lockedUntil} label={label} />;
  }

  if (finished) {
    const pct = Math.round((score / shuffledQuestions.length) * 100);
    const passed = pct >= 80;
    const justLockedOut = !passed && lockoutStatus?.locked && lockoutStatus.lockedUntil;
    return (
      <>
        <Confetti fire={celebrate} />
        <div className="glass-card glow-border mx-auto max-w-xl rounded-2xl p-10 text-center">
          <div className={`text-6xl ${passed ? "trophy-bounce" : ""}`}>{passed ? "🏆" : "📘"}</div>
          <h2 className="mt-4 text-2xl font-bold text-[var(--text-hi)]">
            {passed ? "Topic Complete!" : "Almost there"}
          </h2>
          <p className="mt-2 text-sm text-[var(--text-mid)]">
            You scored <span className="font-semibold text-[var(--text-hi)]">{score}/{shuffledQuestions.length}</span> ({pct}%)
            on {moduleTitle}.
          </p>
          <div className="progress-track mx-auto mt-6 h-3 max-w-sm">
            <div className="progress-fill h-full" style={{ width: `${pct}%` }} />
          </div>
          {passed ? (
            <p className="mt-4 text-sm text-[var(--primary)]">
              🎉 You earned the badge for this topic. Keep the streak going!
            </p>
          ) : justLockedOut ? (
            <p className="mt-4 text-sm text-[var(--error)]">
              That&apos;s 3 misses in a row — this {label.toLowerCase()} is now locked for 24 hours. Review the
              subtopics before your next attempt.
            </p>
          ) : (
            <p className="mt-4 text-sm text-[var(--text-mid)]">
              You need 80% to earn the badge. Review the subtopics and try again — you've got this.
            </p>
          )}

          {/* Non-blocking sync indicator -- the result above already rendered
              instantly; this just reflects whether the background write has
              landed yet. */}
          {sync.status === "pending" && (
            <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-[var(--text-lo)]">
              <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--primary)]" />
              Syncing to your profile…
            </p>
          )}

          {!user && (
            <p className="mt-3 text-xs text-[var(--text-lo)]">
              Signed out — this score is saved on this device only.{" "}
              <Link href="/login" className="font-semibold text-[var(--primary)] hover:underline">
                Sign in
              </Link>{" "}
              to sync it to your profile.
            </p>
          )}
          {sync.status === "error" && sync.error && (
            <p className="mt-3 rounded-lg border border-[var(--error)]/30 bg-[var(--error-soft)] px-4 py-2 text-xs text-[var(--error)]">
              ⚠️ {sync.error}
            </p>
          )}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {justLockedOut ? (
              <Link
                href="/dashboard"
                className="rounded-md bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--primary-dark)]"
              >
                Back to Dashboard
              </Link>
            ) : (
              <>
                <button
                  onClick={retake}
                  className="rounded-md border border-[var(--border-strong)] bg-[var(--surface-2)] px-5 py-2.5 text-sm font-semibold text-[var(--text-hi)] transition hover:bg-[var(--surface-3)]"
                >
                  Retake {label}
                </button>
                {nextHref && passed && (
                  <Link
                    href={nextHref}
                    onClick={() => playSound("unlock")}
                    className="rounded-md bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--primary-dark)]"
                  >
                    Next Topic →
                  </Link>
                )}
                <Link
                  href="/dashboard"
                  className="rounded-md border border-[var(--border-strong)] bg-[var(--surface-2)] px-5 py-2.5 text-sm font-semibold text-[var(--text-hi)] transition hover:bg-[var(--surface-3)]"
                >
                  Back to Dashboard
                </Link>
              </>
            )}
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      {lockoutStatus && lockoutStatus.failStreak > 0 && lockoutStatus.failStreak < 3 && (
        <p className="rounded-md border border-[var(--error)]/30 bg-[var(--error-soft)] px-3 py-2 text-center text-xs text-[var(--error)]">
          ⚠️ {lockoutStatus.failStreak} missed attempt{lockoutStatus.failStreak === 1 ? "" : "s"} in a row —{" "}
          {3 - lockoutStatus.failStreak} more and this {label.toLowerCase()} locks for 24 hours.
        </p>
      )}
      <div className="flex items-center justify-between text-xs text-[var(--text-lo)]">
        <span>
          Question {current + 1} of {shuffledQuestions.length}
        </span>
        <span>Score so far: {score}</span>
      </div>
      <div className="progress-track h-2">
        <div
          className="progress-fill h-full"
          style={{ width: `${((current) / shuffledQuestions.length) * 100}%` }}
        />
      </div>

      <div className="glass-card glow-border rounded-2xl p-8">
        <h2 className="text-lg font-semibold text-[var(--text-hi)]">{q.question}</h2>
        <div className="mt-6 space-y-3">
          {q.options.map((opt, idx) => {
            const isCorrect = idx === q.correctIndex;
            const isSelected = idx === selected;
            let style =
              "border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-2)] text-[var(--text-mid)]";
            let extra = "";
            if (locked && isCorrect) {
              style = "border-[var(--success)]/40 bg-[var(--success-soft)] text-[var(--success)]";
              extra = "answer-pop";
            } else if (locked && isSelected && !isCorrect) {
              style = "border-[var(--error)]/40 bg-[var(--error-soft)] text-[var(--error)]";
              extra = "answer-shake";
            }
            return (
              <button
                key={idx}
                onClick={() => choose(idx)}
                disabled={locked}
                className={`w-full rounded-lg border px-5 py-3 text-left text-sm transition ${style} ${extra}`}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {locked && (
          <div className="mt-5 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 text-sm text-[var(--text-mid)]">
            <span className="mr-2 font-semibold text-[var(--primary)]">
              {selected === q.correctIndex ? "✅ Correct." : "❌ Not quite."}
            </span>
            {q.explanation}
          </div>
        )}

        {locked && (
          <button
            onClick={next}
            className="mt-6 w-full rounded-md bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--primary-dark)]"
          >
            {isLast ? "See Results" : "Next Question →"}
          </button>
        )}
      </div>
    </div>
  );
}
