"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { GlossaryTermWithLinks } from "../../lib/cms/glossary";

export default function GlossaryClient({ terms }: { terms: GlossaryTermWithLinks[] }) {
  const [query, setQuery] = useState("");
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const visibleTerms = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return terms;
    return terms.filter((term) =>
      [term.term, term.definition, term.simple_explanation, term.used_in].some((value) => value.toLowerCase().includes(needle))
    );
  }, [query, terms]);
  useEffect(() => {
    const slug = window.location.hash.replace(/^#/, "");
    if (slug && terms.some((term) => term.slug === slug)) setOpenSlug(slug);
  }, [terms]);

  return (
    <div className="mx-auto max-w-4xl pb-6">
      <header className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--primary)]">Reference</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[var(--text-hi)]">Epicor glossary</h1>
        <p className="mt-3 text-sm leading-6 text-[var(--text-mid)]">Clear definitions for the Kinetic and ERP concepts used across the academy.</p>
      </header>
      <label className="mt-7 block">
        <span className="sr-only">Search glossary terms</span>
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search BAQ, DataView, layers…" className="w-full rounded-lg border border-[var(--border-strong)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text-hi)] outline-none placeholder:text-[var(--text-lo)] focus:border-[var(--primary)]" />
      </label>
      <p className="mt-3 text-xs text-[var(--text-lo)]">{visibleTerms.length} {visibleTerms.length === 1 ? "term" : "terms"} {query ? "match your search" : "available"}</p>
      <div className="mt-4 divide-y divide-[var(--border)] border-y border-[var(--border)]">
        {visibleTerms.map((term) => {
          const expanded = openSlug === term.slug;
          return (
            <section id={term.slug} key={term.slug} className="py-1">
              <button type="button" onClick={() => setOpenSlug(expanded ? null : term.slug)} aria-expanded={expanded} className="flex w-full items-center justify-between gap-4 px-1 py-4 text-left hover:text-[var(--primary)]">
                <span><span className="block text-lg font-semibold text-[var(--text-hi)]">{term.term}</span><span className="mt-1 block text-sm text-[var(--text-mid)]">{term.simple_explanation}</span></span>
                <span aria-hidden="true" className="text-xl text-[var(--text-lo)]">{expanded ? "−" : "+"}</span>
              </button>
              {expanded && (
                <div className="grid gap-5 px-1 pb-5 pt-1 text-sm leading-6 text-[var(--text-mid)]">
                  <div><h2 className="text-xs font-semibold uppercase tracking-[0.13em] text-[var(--text-lo)]">Definition</h2><p className="mt-1">{term.definition}</p></div>
                  <div><h2 className="text-xs font-semibold uppercase tracking-[0.13em] text-[var(--text-lo)]">In plain language</h2><p className="mt-1">{term.simple_explanation}</p></div>
                  <div><h2 className="text-xs font-semibold uppercase tracking-[0.13em] text-[var(--text-lo)]">Where it is used</h2><p className="mt-1">{term.used_in}</p></div>
                  {term.relatedTopics.length > 0 && <div><h2 className="text-xs font-semibold uppercase tracking-[0.13em] text-[var(--text-lo)]">Related lessons</h2><div className="mt-2 flex flex-wrap gap-x-4 gap-y-2">{term.relatedTopics.map((topic) => <Link key={topic.slug} href={topic.href} className="font-semibold text-[var(--primary)] hover:text-[var(--primary-dark)]">{topic.title} →</Link>)}</div></div>}
                </div>
              )}
            </section>
          );
        })}
        {visibleTerms.length === 0 && <p className="py-10 text-center text-sm text-[var(--text-lo)]">No glossary terms match “{query}”.</p>}
      </div>
    </div>
  );
}
