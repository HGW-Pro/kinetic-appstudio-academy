import Link from "next/link";
import { modules } from "../../lib/curriculum";

export default function ModulesPage() {
  return (
    <div className="space-y-8">
      <div>
        <span className="badge-pill">📚 Curriculum</span>
        <h1 className="mt-4 text-3xl font-bold text-[var(--text-hi)]">Training Modules</h1>
        <p className="mt-2 max-w-2xl text-sm text-[var(--text-mid)]">
          Work through these in order for a guided path, or jump straight to the topic you need.
          Every module ends with a scored knowledge-check assignment.
        </p>
      </div>

      <div className="space-y-5">
        {modules.map((m, idx) => (
          <Link
            key={m.slug}
            href={`/modules/${m.slug}`}
            className="group glass-card flex flex-col gap-4 rounded-2xl p-6 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[var(--accent)]/10 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-start gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/5 text-2xl">
                {m.icon}
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--accent-2)]">
                  Module {idx + 1} · {m.difficulty}
                </p>
                <h2 className="mt-1 text-lg font-semibold text-[var(--text-hi)] group-hover:text-[var(--accent-2)]">
                  {m.title}
                </h2>
                <p className="mt-1 text-sm text-[var(--text-mid)]">{m.tagline}</p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-4 pl-16 text-xs text-[var(--text-lo)] sm:pl-0 sm:text-right">
              <div>
                <p className="text-sm font-semibold text-[var(--text-hi)]">{m.lessons.length}</p>
                <p>lessons</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--text-hi)]">{m.estMinutes}m</p>
                <p>duration</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--text-hi)]">{m.quiz.length}</p>
                <p>quiz Qs</p>
              </div>
              <span className="text-lg text-[var(--text-lo)] transition group-hover:translate-x-1 group-hover:text-[var(--accent-2)]">
                →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
