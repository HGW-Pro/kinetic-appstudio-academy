import Link from "next/link";
import { modules, totalQuizQuestions } from "../lib/allModules";

export default function HomePage() {
  const totalLessons = modules.reduce((n, m) => n + m.lessons.length, 0);
  const totalMinutes = modules.reduce((n, m) => n + m.estMinutes, 0);

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
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-[var(--text-hi)]">
              Course outline (in order)
            </h2>
            <p className="mt-1 text-sm text-[var(--text-mid)]">
              Modules are numbered and locked sequentially — no skipping ahead.
            </p>
          </div>
          <Link href="/modules" className="text-sm font-medium text-[var(--primary)] hover:underline">
            View full course →
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((m, idx) => (
            <div
              key={m.slug}
              className="glass-card flex flex-col justify-between rounded-2xl p-6"
            >
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-3xl">{m.icon}</span>
                  <span className="badge-pill">{m.difficulty}</span>
                </div>
                <h3 className="text-lg font-semibold text-[var(--text-hi)]">
                  {idx + 1}. {m.title}
                </h3>
                <p className="mt-2 text-sm text-[var(--text-mid)]">{m.tagline}</p>
              </div>
              <div className="mt-5 flex items-center justify-between text-xs text-[var(--text-lo)]">
                <span>{m.lessons.length} lessons</span>
                <span>{m.estMinutes} min</span>
                <span>{m.quiz.length}-question quiz</span>
              </div>
            </div>
          ))}
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
