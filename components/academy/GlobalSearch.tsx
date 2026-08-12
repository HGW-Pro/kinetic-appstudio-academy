"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

type SearchKind = "Course" | "Topic" | "Lesson" | "Glossary";
type SearchResult = { id: string; title: string; kind: SearchKind; subtitle: string; href: string };
type CourseRow = { id: string; title: string; slug: string };
type TopicRow = { id: string; title: string; slug: string; course_id: string };
type LessonRow = { id: string; title: string; topic_id: string };
type GlossaryRow = { id: string; slug: string; term: string; simple_explanation: string | null };

const GROUPS: SearchKind[] = ["Course", "Topic", "Lesson", "Glossary"];

export default function GlobalSearch() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    function handleShortcut(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
      }
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  useEffect(() => {
    if (open) window.setTimeout(() => inputRef.current?.focus(), 0);
  }, [open]);

  useEffect(() => {
    const trimmed = query.trim();
    if (!open || trimmed.length < 2) {
      setResults([]);
      setLoading(false);
      setError(null);
      return;
    }
    let cancelled = false;
    const timer = window.setTimeout(async () => {
      setLoading(true);
      setError(null);
      const pattern = `%${trimmed}%`;
      const [courseIndex, topicIndex, coursesResult, topicsResult, lessonsResult, glossaryResult] = await Promise.all([
        supabase.from("courses").select("id,title,slug").eq("is_published", true),
        supabase.from("topics").select("id,title,slug,course_id"),
        supabase.from("courses").select("id,title,slug").eq("is_published", true).ilike("title", pattern).limit(6),
        supabase.from("topics").select("id,title,slug,course_id").ilike("title", pattern).limit(6),
        supabase.from("subtopics").select("id,title,topic_id").ilike("title", pattern).limit(8),
        supabase.from("glossary_terms").select("id,slug,term,simple_explanation").or(`term.ilike.${pattern},definition.ilike.${pattern},simple_explanation.ilike.${pattern}`).limit(8),
      ]);
      if (cancelled) return;
      if (courseIndex.error || topicIndex.error || coursesResult.error || topicsResult.error || lessonsResult.error || glossaryResult.error) {
        setError("Search is temporarily unavailable. Please try again.");
        setResults([]);
        setLoading(false);
        return;
      }
      const courses = (courseIndex.data ?? []) as CourseRow[];
      const topics = (topicIndex.data ?? []) as TopicRow[];
      const courseById = new Map(courses.map((course) => [course.id, course]));
      const topicById = new Map(topics.map((topic) => [topic.id, topic]));
      const found: SearchResult[] = [];
      ((coursesResult.data ?? []) as CourseRow[]).forEach((course) => found.push({ id: course.id, title: course.title, kind: "Course", subtitle: "Course", href: `/courses/${course.slug}` }));
      ((topicsResult.data ?? []) as TopicRow[]).forEach((topic) => {
        const course = courseById.get(topic.course_id);
        if (course) found.push({ id: topic.id, title: topic.title, kind: "Topic", subtitle: course.title, href: `/courses/${course.slug}/${topic.slug}` });
      });
      ((lessonsResult.data ?? []) as LessonRow[]).forEach((lesson) => {
        const topic = topicById.get(lesson.topic_id);
        const course = topic ? courseById.get(topic.course_id) : undefined;
        if (topic && course) found.push({ id: lesson.id, title: lesson.title, kind: "Lesson", subtitle: `${course.title} · ${topic.title}`, href: `/courses/${course.slug}/${topic.slug}/${lesson.id}` });
      });
      ((glossaryResult.data ?? []) as GlossaryRow[]).forEach((term) => {
        found.push({ id: term.id, title: term.term, kind: "Glossary", subtitle: term.simple_explanation ?? "Glossary term", href: `/glossary#${term.slug}` });
      });
      setResults(found);
      setLoading(false);
    }, 240);
    return () => { cancelled = true; window.clearTimeout(timer); };
  }, [open, query]);

  function close() {
    setOpen(false);
    setQuery("");
    setResults([]);
  }

  function navigate(result: SearchResult) {
    close();
    router.push(result.href);
  }

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} aria-label="Search Kinetic Academy" className="hidden min-w-0 items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-left text-sm text-[var(--text-lo)] shadow-sm hover:border-[var(--border-strong)] hover:bg-[var(--surface)] md:flex md:w-full md:max-w-md">
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4 4" strokeLinecap="round" /></svg>
        <span className="min-w-0 flex-1 truncate">Search Kinetic Academy</span>
        <kbd className="rounded border border-[var(--border)] bg-[var(--surface)] px-1.5 py-0.5 text-xs font-medium text-[var(--text-lo)]">Ctrl K</kbd>
      </button>
      <button type="button" onClick={() => setOpen(true)} aria-label="Search Kinetic Academy" className="flex h-10 w-10 items-center justify-center rounded-md text-[var(--text-mid)] hover:bg-[var(--surface-2)] md:hidden">
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4 4" strokeLinecap="round" /></svg>
      </button>
      {open && <div role="dialog" aria-modal="true" aria-label="Search Kinetic Academy" className="fixed inset-0 z-50 bg-slate-950/30 p-4 sm:p-8" onMouseDown={(event) => { if (event.target === event.currentTarget) close(); }}>
        <div className="mx-auto mt-[10vh] w-full max-w-2xl overflow-hidden rounded-xl border border-[var(--border-strong)] bg-[var(--surface)] shadow-2xl">
          <div className="flex items-center gap-3 border-b border-[var(--border)] px-4 py-3">
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-[var(--text-lo)]" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4 4" strokeLinecap="round" /></svg>
            <input ref={inputRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search courses, lessons, and glossary" className="min-w-0 flex-1 bg-transparent text-base text-[var(--text-hi)] outline-none placeholder:text-[var(--text-lo)]" />
            <button type="button" onClick={close} className="rounded border border-[var(--border)] px-2 py-1 text-xs font-semibold text-[var(--text-mid)] hover:bg-[var(--surface-2)]">Esc</button>
          </div>
          <div className="max-h-[60vh] overflow-y-auto p-2">
            {query.trim().length < 2 ? <p className="px-3 py-8 text-center text-sm text-[var(--text-lo)]">Type at least two characters to search the academy.</p> : loading ? <p className="px-3 py-8 text-center text-sm text-[var(--text-lo)]">Searching…</p> : error ? <p role="alert" className="m-2 rounded-md bg-[var(--error-soft)] px-3 py-3 text-sm text-[var(--error)]">{error}</p> : results.length === 0 ? <p className="px-3 py-8 text-center text-sm text-[var(--text-lo)]">No matching courses, topics, lessons, or glossary terms.</p> : GROUPS.map((kind) => {
              const group = results.filter((result) => result.kind === kind);
              if (!group.length) return null;
              return <section key={kind} className="py-2" aria-label={`${kind} results`}><h2 className="px-3 pb-1 text-xs font-semibold uppercase tracking-[0.13em] text-[var(--text-lo)]">{kind}s</h2>{group.map((result) => <button key={`${result.kind}-${result.id}`} type="button" onClick={() => navigate(result)} className="flex w-full items-center gap-3 rounded-md px-3 py-3 text-left hover:bg-[var(--surface-2)]"><span className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--primary)]/[0.08] text-xs font-bold text-[var(--primary)]">{result.kind.slice(0, 1)}</span><span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold text-[var(--text-hi)]">{result.title}</span><span className="block truncate text-xs text-[var(--text-lo)]">{result.subtitle}</span></span><span aria-hidden="true" className="text-[var(--text-lo)]">→</span></button>)}</section>;
            })}
          </div>
        </div>
      </div>}
    </>
  );
}
