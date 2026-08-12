"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "../AuthProvider";
import { supabase } from "../../lib/supabaseClient";
import { cmsModuleSlug } from "../../lib/cms/shared";
import { loadLocalProgress, loadRemoteProgress, enrollInModule, type ProgressState } from "../../lib/progress";
import { normalizeContentBlocks, type ContentBlock } from "../../lib/admin/types";
import CmsContentRenderer from "./CmsContentRenderer";

type Topic = { id: string; title: string; slug: string; sequence_order: number; difficulty: string | null };
type Subtopic = { id: string; title: string; sequence_order: number; est_minutes: number | null; content_json: ContentBlock[] };

export default function CmsTopicAccordion({ courseSlug, topicSlug }: { courseSlug: string; topicSlug: string }) {
  const { user, loading: authLoading } = useAuth();
  const [course, setCourse] = useState<{id:string; title:string; slug:string} | null>(null);
  const [topic, setTopic] = useState<Topic | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [subtopics, setSubtopics] = useState<Subtopic[]>([]);
  const [quizCount, setQuizCount] = useState(0);
  const [progress, setProgress] = useState<ProgressState>({});
  const [enrolled, setEnrolled] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const moduleSlug = course && topic ? cmsModuleSlug(course.slug, topic.slug) : "";

  useEffect(() => { (async () => {
    const { data: c } = await supabase.from("courses").select("id,title,slug").eq("slug", courseSlug).eq("is_published", true).maybeSingle();
    if (!c) { setError("Course not found."); setReady(true); return; }
    setCourse(c);
    const { data: ts } = await supabase.from("topics").select("id,title,slug,sequence_order,difficulty").eq("course_id", c.id).order("sequence_order");
    const t = (ts ?? []).find(x => x.slug === topicSlug);
    if (!t) { setError("Topic not found."); setReady(true); return; }
    setTopics(ts ?? []); setTopic(t);
    const { data: ss } = await supabase.from("subtopics").select("id,title,sequence_order,est_minutes,content_json").eq("topic_id", t.id).order("sequence_order");
    setSubtopics((ss ?? []) as Subtopic[]);
    const ids = (ss ?? []).map(x=>x.id);
    if (ids.length) { const {data:q} = await supabase.from("quizzes").select("questions_json").in("subtopic_id",ids); setQuizCount((q??[]).reduce((n,x)=>n+(Array.isArray(x.questions_json)?x.questions_json.length:0),0)); }
    setReady(true);
  })(); }, [courseSlug, topicSlug]);

  useEffect(() => { if (!ready || !moduleSlug || authLoading) return; (async()=> { const p = user ? await loadRemoteProgress(user.id) : loadLocalProgress(); setProgress(p); setEnrolled(!!p[moduleSlug]?.enrolled); })(); }, [ready,moduleSlug,user,authLoading]);

  async function enroll() { if (!user) return; const {error:e}=await enrollInModule(user.id,moduleSlug); if(e) setError(e); else setEnrolled(true); }

  if (!ready) return <div className="py-16 text-center text-sm text-[var(--text-lo)]">Loading topic…</div>;
  if (error || !course || !topic) return <div className="rounded-xl border border-[var(--error)]/30 bg-[var(--error-soft)] p-5 text-[var(--error)]">⚠️ {error ?? "Topic unavailable."}</div>;

  const done = progress[moduleSlug]?.lessonsCompleted ?? [];
  const highest = user ? Math.min(done.length, subtopics.length - 1) : 0;
  const allDone = subtopics.length > 0 && done.length >= subtopics.length;
  const certified = !!progress[moduleSlug]?.completedAt;
  const mins = subtopics.reduce((n,s)=>n+(s.est_minutes && s.est_minutes>0?s.est_minutes:5),0);
  const topicIndex = topics.findIndex(t=>t.id===topic.id);

  return <div className="space-y-8">
    <div className="glass-card glow-border rounded-2xl p-8">
      <div className="flex flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-3"><span className="text-4xl">📘</span><div><p className="text-xs font-semibold uppercase tracking-wide text-[var(--primary)]">Topic {topicIndex+1} of {topics.length} · {(topic.difficulty || "Standard").toUpperCase()}</p><h1 className="text-2xl font-bold text-[var(--text-hi)] sm:text-3xl">{topic.title}</h1></div></div>
      {user ? <button onClick={enroll} disabled={enrolled} className={`rounded-md px-4 py-2 text-sm font-semibold ${enrolled?"bg-[var(--success-soft)] text-[var(--success)]":"bg-[var(--primary)] text-white"}`}>{enrolled?"Enrolled ✓":"Enroll in Topic"}</button> : <Link href="/login" className="rounded-md border border-[var(--border-strong)] bg-[var(--surface-2)] px-4 py-2 text-sm font-semibold text-[var(--text-hi)]">Sign in to enroll</Link>}</div>
      <div className="mt-5 flex flex-wrap gap-3 text-xs text-[var(--text-lo)]"><span className="badge-pill">{subtopics.length} subtopics</span><span className="badge-pill">{mins} min</span><span className="badge-pill">{quizCount}-question assignment</span>{certified&&<span className="badge-pill">🏆 Certified</span>}</div>
    </div>

    <div className="relative">
      <div className="pointer-events-none absolute bottom-6 left-[23px] top-6 hidden w-[3px] sm:block"><div className="h-full w-full rounded-full bg-[var(--surface-3)]" /></div>
      <div className="space-y-5 sm:pl-14">
      {subtopics.map((s,i)=>{ const isDone=done.includes(s.id); const locked=!enrolled || i>highest; const open=openId===s.id&&!locked; return <div key={s.id} className="relative">
        <span className={`absolute -left-14 top-5 hidden h-12 w-12 items-center justify-center rounded-full border-2 text-sm font-bold sm:flex ${isDone?"border-[var(--primary-light)] bg-[var(--primary)] text-white":locked?"border-[var(--border-strong)] bg-[var(--surface)] text-[var(--text-lo)]":"border-[var(--primary)] bg-[var(--surface)] text-[var(--primary)]"}`}>{isDone?"✓":locked?"🔒":i+1}</span>
        <div className={`glass-card overflow-hidden rounded-xl ${locked?"opacity-60":""} ${open?"glow-border":""}`}><button disabled={locked} onClick={()=>setOpenId(open?null:s.id)} className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"><div><p className="font-semibold text-[var(--text-hi)]">{s.title}</p><p className="text-xs text-[var(--text-lo)]">{s.est_minutes&&s.est_minutes>0?s.est_minutes:5} min{locked?" · Enroll or complete previous subtopic to unlock":""}</p></div>{!locked&&<span className={`text-lg text-[var(--text-lo)] transition ${open?"rotate-90":""}`}>›</span>}</button>
        {open&&<div className="border-t border-[var(--border)] px-6 py-5"><CmsContentRenderer blocks={normalizeContentBlocks(s.content_json)} /><Link href={`/courses/${courseSlug}/${topicSlug}/${s.id}`} className="mt-5 inline-block rounded-md bg-[var(--primary)] px-5 py-2 text-xs font-semibold text-white">Open focused reading view →</Link></div>}</div>
      </div>; })}
      </div>
    </div>

    <div className="glass-card rounded-2xl p-6 text-center"><h2 className="text-lg font-semibold text-[var(--text-hi)]">Ready to test your knowledge?</h2><p className="mt-1 text-sm text-[var(--text-mid)]">{allDone?`Score 80%+ on the ${quizCount}-question assignment to earn this topic's badge and unlock the next.`:"Finish every subtopic above first."}</p>{allDone&&quizCount>0?<Link href={`/courses/${courseSlug}/${topicSlug}/quiz`} className="mt-5 inline-block rounded-md bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-white">Take the Assignment →</Link>:<span className="mt-5 inline-block rounded-md bg-[var(--surface-2)] px-6 py-3 text-sm text-[var(--text-lo)]">Locked</span>}</div>
  </div>;
}
