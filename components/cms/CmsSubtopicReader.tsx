"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { useAuth } from "../AuthProvider";
import { supabase } from "../../lib/supabaseClient";
import { cmsModuleSlug } from "../../lib/cms/shared";
import { loadLocalProgress, loadRemoteProgress, markLessonComplete } from "../../lib/progress";
import { normalizeContentBlocks, type ContentBlock } from "../../lib/admin/types";
import CmsContentRenderer from "./CmsContentRenderer";

type Lesson = {id:string; title:string; content_json: ContentBlock[]};
export default function CmsSubtopicReader({courseSlug,topicSlug,subtopicId}:{courseSlug:string;topicSlug:string;subtopicId:string}) {
 const {user,loading:authLoading}=useAuth(); const router=useRouter();
 const [lessons,setLessons]=useState<Lesson[]>([]); const [lesson,setLesson]=useState<Lesson|null>(null); const [moduleSlug,setModuleSlug]=useState(""); const [done,setDone]=useState<string[]>([]); const [ready,setReady]=useState(false); const [saving,setSaving]=useState(false); const [error,setError]=useState<string|null>(null);
 useEffect(()=>{(async()=>{const {data:c}=await supabase.from("courses").select("id,slug").eq("slug",courseSlug).eq("is_published",true).maybeSingle(); if(!c){setReady(true);return;} const {data:t}=await supabase.from("topics").select("id,slug").eq("course_id",c.id).eq("slug",topicSlug).maybeSingle(); if(!t){setReady(true);return;} const {data:ss}=await supabase.from("subtopics").select("id,title,content_json").eq("topic_id",t.id).order("sequence_order"); const all=(ss??[]) as Lesson[]; setLessons(all); setLesson(all.find(x=>x.id===subtopicId)??null); const key=cmsModuleSlug(c.slug,t.slug); setModuleSlug(key); const p=user?await loadRemoteProgress(user.id):loadLocalProgress(); setDone(p[key]?.lessonsCompleted??[]); setReady(true);})();},[courseSlug,topicSlug,subtopicId,user]);
 if(!ready)return <div className="py-16 text-center text-sm text-[var(--text-lo)]">Loading subtopic…</div>; if(!lesson)notFound();
 const idx=lessons.findIndex(x=>x.id===lesson.id), next=lessons[idx+1], locked=idx>Math.min(done.length,lessons.length-1), isDone=done.includes(lesson.id);
 async function complete(){if(!user)return;setSaving(true);const {remoteWrite}=markLessonComplete(moduleSlug,lesson.id,user.id);if(remoteWrite){const {error:e}=await remoteWrite;if(e){setError(e);setSaving(false);return;}}setSaving(false);if(next)router.push(`/courses/${courseSlug}/${topicSlug}/${next.id}`);else router.push(`/courses/${courseSlug}/${topicSlug}`);}
 if(locked)return <div className="glass-card glow-border mx-auto max-w-lg rounded-2xl p-10 text-center"><div className="text-5xl">🔒</div><h1 className="mt-4 text-xl font-bold text-[var(--text-hi)]">This subtopic is locked</h1><Link href={`/courses/${courseSlug}/${topicSlug}`} className="mt-6 inline-block rounded-md bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-white">← Back to Topic</Link></div>;
 return <div className="mx-auto max-w-2xl space-y-6"><div className="flex items-center justify-center gap-1.5">{lessons.map((l,i)=><span key={l.id} className={`h-1.5 max-w-10 flex-1 rounded-full ${i<idx||done.includes(l.id)?"bg-[var(--primary)]":i===idx?"bg-[var(--primary-light)]":"bg-[var(--surface-3)]"}`}/>)}</div><p className="text-center text-xs text-[var(--text-lo)]">Subtopic {idx+1} of {lessons.length}</p>{error&&<p className="rounded-lg bg-[var(--error-soft)] p-3 text-sm text-[var(--error)]">⚠️ {error}</p>}<div className="glass-card glow-border rounded-2xl p-8"><h1 className="text-xl font-bold text-[var(--text-hi)] sm:text-2xl">{lesson.title}</h1><div className="mt-6"><CmsContentRenderer blocks={normalizeContentBlocks(lesson.content_json)}/></div><div className="mt-8 flex items-center justify-between border-t border-[var(--border)] pt-6"><Link href={`/courses/${courseSlug}/${topicSlug}`} className="rounded-md border border-[var(--border-strong)] bg-[var(--surface-2)] px-5 py-2.5 text-sm font-semibold text-[var(--text-hi)]">← Back</Link>{isDone?<span className="rounded-md bg-[var(--surface-2)] px-5 py-2.5 text-sm font-semibold text-[var(--text-lo)]">Completed ✓</span>:user?<button onClick={complete} disabled={saving} className="rounded-md bg-[var(--primary)] px-6 py-2.5 text-sm font-semibold text-white">{saving?"Saving…":next?"Complete & Continue →":"Complete Topic →"}</button>:<Link href="/login" className="rounded-md bg-[var(--primary)] px-6 py-2.5 text-sm font-semibold text-white">Sign in to continue →</Link>}</div></div></div>;
}
