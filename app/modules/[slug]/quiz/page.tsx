import { notFound } from "next/navigation";
import { modules, getModule } from "../../../../lib/curriculum";
import QuizEngine from "../../../../components/QuizEngine";

export function generateStaticParams() {
  return modules.map((m) => ({ slug: m.slug }));
}

export default function QuizPage({ params }: { params: { slug: string } }) {
  const mod = getModule(params.slug);
  if (!mod) notFound();

  const idx = modules.findIndex((m) => m.slug === mod.slug);
  const next = modules[idx + 1];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <span className="badge-pill mx-auto w-fit">📝 Knowledge Check</span>
        <h1 className="mt-4 text-2xl font-bold text-[var(--text-hi)] sm:text-3xl">
          {mod.title} — Assignment
        </h1>
        <p className="mt-2 text-sm text-[var(--text-mid)]">
          {mod.quiz.length} questions · Instant feedback · 80% required to pass
        </p>
      </div>
      <QuizEngine
        moduleSlug={mod.slug}
        moduleTitle={mod.title}
        questions={mod.quiz}
        nextModuleSlug={next?.slug}
      />
    </div>
  );
}
