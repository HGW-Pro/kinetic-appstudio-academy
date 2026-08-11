"use client";

import { notFound } from "next/navigation";
import { getModule, modules } from "../../../../lib/allModules";
import ModuleAccessGate from "../../../../components/ModuleAccessGate";
import QuizEngine from "../../../../components/QuizEngine";

export default function ModuleQuizPage({
  params,
}: {
  params: { slug: string };
}) {
  const mod = getModule(params.slug);
  if (!mod) notFound();

  const idx = modules.findIndex((m) => m.slug === mod.slug);
  const next = modules[idx + 1];

  return (
    <ModuleAccessGate moduleSlug={mod.slug}>
      <QuizEngine
        moduleSlug={mod.slug}
        moduleTitle={mod.title}
        questions={mod.quiz}
        nextHref={next ? `/modules/${next.slug}` : undefined}
      />
    </ModuleAccessGate>
  );
}
