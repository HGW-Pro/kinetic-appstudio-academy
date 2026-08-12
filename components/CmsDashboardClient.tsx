"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useAuth } from "./AuthProvider";
import { supabase } from "../lib/supabaseClient";
import { cmsModuleSlug } from "../lib/cms/shared";
import { loadRemoteProgress, type ProgressState } from "../lib/progress";

type CourseSummary = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  topics: { id: string; title: string; slug: string; subtopicCount: number }[];
};

export default function CmsDashboardClient() {
  const { user, loading: authLoading } = useAuth();
  const [courses, setCourses] = useState<CourseSummary[]>([]);
  const [progress, setProgress] = useState<ProgressState>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      const { data: courseRows, error: courseError } = await supabase
        .from("courses")
        .select("id, title, slug, description, image_url")
        .eq("is_published", true)
        .order("sequence_order", { ascending: true });
      if (courseError) {
        if (!cancelled) {
          setError(courseError.message);
          setLoading(false);
        }
        return;
      }
      const ids = (courseRows ?? []).map((c) => c.id);
      const { data: topicRows, error: topicError } = ids.length
        ? await supabase.from("topics").select("id, course_id, title, slug").in("course_id", ids).order("sequence_order")
        : { data: [], error: null };
      if (topicError) {
        if (!cancelled) {
          setError(topicError.message);
          setLoading(false);
        }
        return;
      }
      const topicIds = (topicRows ?? []).map((t) => t.id);
      const { data: subtopicRows, error: subtopicError } = topicIds.length
        ? await supabase.from("subtopics").select("id, topic_id").in("topic_id", topicIds)
        : { data: [], error: null };
      if (subtopicError) {
        if (!cancelled) {
          setError(subtopicError.message);
          setLoading(false);
        }
        return;
      }
      const counts = new Map<string, number>();
      for (const s of subtopicRows ?? []) counts.set(s.topic_id, (counts.get(s.topic_id) ?? 0) + 1);
      const byCourse = new Map<string, { id: string; title: string; slug: string; subtopicCount: number }[]>();
      for (const t of topicRows ?? []) {
        const list = byCourse.get(t.course_id) ?? [];
        list.push({ id: t.id, title: t.title, slug: t.slug, subtopicCount: counts.get(t.id) ?? 0 });
        byCourse.set(t.course_id, list);
      }
      const p = user ? await loadRemoteProgress(user.id) : {};
      if (!cancelled) {
        setCourses((courseRows ?? []).map((c) => ({ ...c, topics: byCourse.get(c.id) ?? [] })));
        setProgress(p);
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [authLoading, user]);

  const overall = useMemo(() => {
    let total = 0, complete = 0, certified = 0;
    for (const c of courses) for (const t of c.topics) {
      total += t.subtopicCount;
      const p = progress[cmsModuleSlug(c.slug, t.slug)];
      complete += p?.lessonsCompleted.length ?? 0;
      if (p?.completedAt) certified += 1;
    }
    return { total, complete, certified, pct: total ? Math.min(100, Math.round((complete / total) * 100)) : 0 };
  }, [courses, progress]);

  if (loading) return <div className="py-16 text-center text-sm text-[var(--text-lo)]">Loading your learning dashboard…</div>;
  if (error) return <div className="rounded-xl border border-[var(--error)]/30 bg-[var(--error-soft)] p-5 text-sm text-[var(--error)]">⚠️ Could not load dashboard: {error}</div>;

  return (
    <div className="space-y-8">
      <div className="glass-card glow-border rounded-2xl p-7">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--primary)]">Learning Dashboard</p>
        <h1 className="mt-2 text-3xl font-bold text-[var(--text-hi)]">Your certification progress</h1>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div><p className="text-2xl font-bold text-[var(--text-hi)]">{overall.pct}%</p><p className="text-xs text-[var(--text-lo)]">Overall progress</p></div>
          <div><p className="text-2xl font-bold text-[var(--text-hi)]">{overall.complete}/{overall.total}</p><p className="text-xs text-[var(--text-lo)]">Subtopics completed</p></div>
          <div><p className="text-2xl font-bold text-[var(--text-hi)]">{overall.certified}</p><p className="text-xs text-[var(--text-lo)]">Topics certified</p></div>
        </div>
        <div className="progress-track mt-6 h-3"><div className="progress-fill h-full" style={{ width: `${overall.pct}%` }} /></div>
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-[var(--text-hi)]">Your courses</h2>
        {courses.map((course) => {
          const total = course.topics.reduce((n, t) => n + t.subtopicCount, 0);
          const done = course.topics.reduce((n, t) => n + (progress[cmsModuleSlug(course.slug, t.slug)]?.lessonsCompleted.length ?? 0), 0);
          const pct = total ? Math.min(100, Math.round((done / total) * 100)) : 0;
          return <div key={course.id} className="glass-card rounded-xl p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex gap-4"><div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg bg-[var(--surface-2)] text-2xl">{course.image_url ? <img src={course.image_url} alt="" className="h-full w-full object-cover" /> : "📚"}</div><div><h3 className="font-semibold text-[var(--text-hi)]">{course.title}</h3><p className="mt-1 text-sm text-[var(--text-mid)]">{course.description}</p></div></div>
              <Link href={`/courses/${course.slug}`} className="rounded-md bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--primary-dark)]">Continue →</Link>
            </div>
            <div className="mt-5 progress-track h-2"><div className="progress-fill h-full" style={{ width: `${pct}%` }} /></div>
            <p className="mt-2 text-xs text-[var(--text-lo)]">{done}/{total} subtopics complete · {course.topics.length} topics · {pct}%</p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">{course.topics.map((topic, i) => { const p = progress[cmsModuleSlug(course.slug, topic.slug)]; return <div key={topic.id} className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-xs"><span className="mr-2 font-semibold text-[var(--primary)]">{p?.completedAt ? "✓" : i + 1}</span>{topic.title}<span className="float-right text-[var(--text-lo)]">{p?.lessonsCompleted.length ?? 0}/{topic.subtopicCount}</span></div>; })}</div>
          </div>;
        })}
      </section>
    </div>
  );
}
