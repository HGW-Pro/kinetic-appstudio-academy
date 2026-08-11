import Link from "next/link";
import { modules, totalQuizQuestions } from "../lib/allModules";

export default function HomePage() {
  const totalLessons = modules.reduce((n, m) => n + m.lessons.length, 0);
  const totalMinutes = modules.reduce((n, m) => n + m.estMinutes, 0);

  // First module (Kinetic Basics: Login & Navigation) is a standalone prerequisite step.
  // Everything after it belongs to the single "Kinetic Application Studio" course umbrella.
  const [prereq, ...studioModules] = modules;

  return (
    <div className="space-y-16">
      <section className="hero-band relative overflow-hidden rounded-2xl px-6 py-16 text-center text-white sm:px-12">
        <span className="mx-auto mb-6 flex w-fit items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide">
          🎓 Internal Certification Course
        </span>
        <h1 className="mx-auto max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
          The Kinetic Application Studio Course
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base text-white/85 sm:text-lg">
          One sequential course, {modules.length} modules, {totalLessons} lessons, and {totalQuizQuestions()} knowledge-check
          questions — distilled from the official Kinetic AppStudio 2023.1 &amp; 2023.2 guides. Each
          module unlocks only after you pass the one before it.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/modules"
            className="rounded-md bg-white px-6 py-3 text-sm font-semibold text-[var(--primary-dark)] shadow-sm transition hover:bg-white/90"
          >
            Start the Course →
          </Link>
          <Link
            href="/dashboard"
            className="rounded-md border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
          >
            View My Progress
          </Link>
        </div>
        <div className="mx-auto mt-10 grid max-w-2xl grid-cols-3 gap-4 text-left">
          <Stat value={`${modules.length}`} label="Modules" />
          <Stat value={`${totalMinutes}m`} label="Est. Time" />
          <Stat value={`${totalQuizQuestions()}`} label="Quiz Questions" />
        </div>
      </section>

      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-[var(--text-hi)]">
            Course outline (in order)
          </h2>
          <p className="mt-1 text-sm text-[var(--text-mid)]">
            One prerequisite step, then everything else lives under a single course:
            Kinetic Application Studio. Modules unlock strictly one at a time.
          </p>
        </div>

        {/* Step 1 — prerequisite, sits outside the Application Studio course itself */}
        {prereq && (
          <div className="glass-card mb-6 flex items-center gap-4 rounded-2xl p-6">
            <span className="text-3xl">{prereq.icon}</span>
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--primary)]">
                Prerequisite · Module 1
              </p>
              <h3 className="text-lg font-semibold text-[var(--text-hi)]">{prereq.title}</h3>
              <p className="mt-1 text-sm text-[var(--text-mid)]">{prereq.tagline}</p>
            </div>
            <div className="hidden shrink-0 text-right text-xs text-[var(--text-lo)] sm:block">
              <p className="font-semibold text-[var(--text-hi)]">{prereq.lessons.length}</p>
              <p>lessons</p>
            </div>
          </div>
        )}

        {/* The single umbrella course — every remaining module nests under it */}
        <div className="glass-card glow-border rounded-2xl p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[var(--primary)] text-2xl text-white">
              🧭
            </span>
            <div>
              <span className="badge-pill">Main Course</span>
              <h3 className="mt-2 text-xl font-bold text-[var(--text-hi)]">Kinetic Application Studio</h3>
              <p className="mt-1 text-sm text-[var(--text-mid)]">
                Modules 2–{modules.length} · Application Map, Components, Data Rules &amp; Events,
                DataViews, Functions, and Publishing all live inside this one course.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-3 border-l-2 border-[var(--border)] pl-5 sm:pl-6">
            {studioModules.map((m, idx) => (
              <div
                key={m.slug}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{m.icon}</span>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--primary)]">
                      Module {idx + 2} · {m.difficulty}
                    </p>
                    <h4 className="text-sm font-semibold text-[var(--text-hi)]">{m.title}</h4>
                    <p className="mt-0.5 text-xs text-[var(--text-mid)]">{m.tagline}</p>
                  </div>
                </div>
                <div className="flex shrink-0 gap-4 text-xs text-[var(--text-lo)]">
                  <span>{m.lessons.length} lessons</span>
                  <span>{m.estMinutes}m</span>
                  <span>{m.quiz.length} quiz Qs</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link href="/modules" className="text-sm font-medium text-[var(--primary)] hover:underline">
            View full course →
          </Link>
        </div>
      </section>

      <section className="glass-card rounded-3xl p-8 text-center">
        <h2 className="text-2xl font-semibold text-[var(--text-hi)]">
          Ready to prove it? Try a real lab.
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-[var(--text-mid)]">
          Every training track pairs with a hands-on lab in the Labs section, so you build actual
          Kinetic configurations — not just answer trivia.
        </p>
        <Link
          href="/labs"
          className="mt-6 inline-block rounded-md border border-[var(--border-strong)] bg-[var(--surface-2)] px-6 py-3 text-sm font-semibold text-[var(--text-hi)] transition hover:bg-[var(--surface-3)]"
        >
          Explore Hands-On Labs →
        </Link>
      </section>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-center">
      <p className="text-xl font-bold text-white">{value}</p>
      <p className="text-[11px] uppercase tracking-wide text-white/70">{label}</p>
    </div>
  );
}
