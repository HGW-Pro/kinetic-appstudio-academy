import Link from "next/link";
import { notFound } from "next/navigation";
import { modules, getModule } from "../../../lib/curriculum";
import LessonList from "../../../components/LessonList";

export function generateStaticParams() {
  return modules.map((m) => ({ slug: m.slug }));
}

export default function ModuleDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const mod = getModule(params.slug);
  if (!mod) notFound();

  const idx = modules.findIndex((m) => m.slug === mod.slug);
  const prev = modules[idx - 1];
  const next = modules[idx + 1];

  return (
    <div className="space-y-10">
      <div className="glass-card glow-border rounded-3xl p-8">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-4xl">{mod.icon}</span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--accent-2)]">
              Module {idx + 1} of {modules.length} · {mod.difficulty}
            </p>
            <h1 className="text-2xl font-bold text-[var(--text-hi)] sm:text-3xl">{mod.title}</h1>
          </div>
        </div>
        <p className="mt-4 max-w-2xl text-sm text-[var(--text-mid)]">{mod.tagline}</p>
        <div className="mt-5 flex flex-wrap gap-3 text-xs text-[var(--text-lo)]">
          <span className="badge-pill">{mod.lessons.length} lessons</span>
          <span className="badge-pill">{mod.estMinutes} min</span>
          <span className="badge-pill">{mod.quiz.length}-question assignment</span>
        </div>
      </div>

      <LessonList moduleSlug={mod.slug} lessons={mod.lessons} />

      <div className="glass-card rounded-2xl p-6 text-center">
        <h2 className="text-lg font-semibold text-[var(--text-hi)]">
          Ready to test your knowledge?
        </h2>
        <p className="mt-1 text-sm text-[var(--text-mid)]">
          Score 80% or higher on the {mod.quiz.length}-question assignment to earn this module's badge.
        </p>
        <Link
          href={`/modules/${mod.slug}/quiz`}
          className="mt-5 inline-block rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[var(--accent)]/30 transition hover:scale-[1.02]"
        >
          Take the Assignment →
        </Link>
      </div>

      <div className="flex items-center justify-between text-sm">
        {prev ? (
          <Link href={`/modules/${prev.slug}`} className="text-[var(--text-mid)] hover:text-[var(--accent-2)]">
            ← {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`/modules/${next.slug}`} className="text-[var(--text-mid)] hover:text-[var(--accent-2)]">
            {next.title} →
          </Link>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}
