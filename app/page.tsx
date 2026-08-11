import Link from "next/link";
import { modules, totalQuizQuestions } from "../lib/curriculum";

export default function HomePage() {
  const totalLessons = modules.reduce((n, m) => n + m.lessons.length, 0);
  const totalMinutes = modules.reduce((n, m) => n + m.estMinutes, 0);

  return (
    <div className="space-y-16">
      <section className="relative overflow-hidden rounded-3xl glass-card glow-border px-6 py-16 text-center sm:px-12">
        <span className="badge-pill mx-auto mb-6 w-fit">
          🎓 Internal Certification Track
        </span>
        <h1 className="mx-auto max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
          Master{" "}
          <span className="bg-gradient-to-r from-[var(--accent)] via-[var(--accent-2)] to-[var(--accent-3)] bg-clip-text text-transparent">
            Kinetic Application Studio
          </span>{" "}
          the fast, hands-on way
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base text-[var(--text-mid)] sm:text-lg">
          {modules.length} bite-sized modules, {totalLessons} lessons, and {totalQuizQuestions()} knowledge-check
          questions distilled straight from the official Kinetic AppStudio 2023.1 &amp; 2023.2 guides —
          plus a real hands-on lab to prove you can actually build it.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/modules"
            className="rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[var(--accent)]/30 transition hover:scale-[1.02]"
          >
            Start Training →
          </Link>
          <Link
            href="/dashboard"
            className="rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-[var(--text-hi)] transition hover:bg-white/10"
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
              What you'll learn
            </h2>
            <p className="mt-1 text-sm text-[var(--text-mid)]">
              A structured path from first launch to production-grade layers.
            </p>
          </div>
          <Link href="/modules" className="text-sm font-medium text-[var(--accent-2)] hover:underline">
            See all modules →
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((m, idx) => (
            <Link
              key={m.slug}
              href={`/modules/${m.slug}`}
              className="group glass-card flex flex-col justify-between rounded-2xl p-6 transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-[var(--accent)]/10"
            >
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-3xl">{m.icon}</span>
                  <span className="badge-pill">{m.difficulty}</span>
                </div>
                <h3 className="text-lg font-semibold text-[var(--text-hi)] group-hover:text-[var(--accent-2)]">
                  {idx + 1}. {m.title}
                </h3>
                <p className="mt-2 text-sm text-[var(--text-mid)]">{m.tagline}</p>
              </div>
              <div className="mt-5 flex items-center justify-between text-xs text-[var(--text-lo)]">
                <span>{m.lessons.length} lessons</span>
                <span>{m.estMinutes} min</span>
                <span>{m.quiz.length}-question quiz</span>
              </div>
            </Link>
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
          className="mt-6 inline-block rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-[var(--text-hi)] transition hover:bg-white/10"
        >
          Explore Hands-On Labs →
        </Link>
      </section>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="glass-card rounded-xl px-4 py-3 text-center">
      <p className="text-xl font-bold text-[var(--text-hi)]">{value}</p>
      <p className="text-[11px] uppercase tracking-wide text-[var(--text-lo)]">{label}</p>
    </div>
  );
}
