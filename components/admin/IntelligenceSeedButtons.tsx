"use client";

import { useState } from "react";
import { seedDefaultGlossary, seedDefaultSkills } from "../../lib/admin/seed-intelligence";
import { useToast } from "./ToastProvider";

export default function IntelligenceSeedButtons() {
  const [running, setRunning] = useState<"skills" | "glossary" | null>(null);
  const { show } = useToast();

  async function seed(kind: "skills" | "glossary") {
    setRunning(kind);
    const result = kind === "skills" ? await seedDefaultSkills() : await seedDefaultGlossary();
    setRunning(null);
    if (!result.ok) {
      show(result.error ?? "Seeding failed.", "error");
      return;
    }
    show(kind === "skills" ? `Default skills are ready (${result.data?.count ?? 0}).` : `Glossary terms are ready (${result.data?.count ?? 0}).`, "success");
  }

  return (
    <section className="rounded-xl border border-sky-200 bg-sky-50 p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-sky-700">Academy intelligence</p>
      <h2 className="mt-1 text-base font-semibold text-sky-950">Seed reusable skills and glossary terms</h2>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-sky-900">
        These actions are idempotent: they upsert the 12 default skills and 13 glossary entries by slug without removing learner progress or curriculum data.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <button type="button" onClick={() => seed("skills")} disabled={running !== null} className="rounded-md bg-sky-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-800 disabled:opacity-50">
          {running === "skills" ? "Seeding skills…" : "Seed default skills"}
        </button>
        <button type="button" onClick={() => seed("glossary")} disabled={running !== null} className="rounded-md border border-sky-300 bg-white px-4 py-2 text-sm font-semibold text-sky-900 transition hover:bg-sky-100 disabled:opacity-50">
          {running === "glossary" ? "Seeding glossary…" : "Seed glossary terms"}
        </button>
      </div>
    </section>
  );
}
