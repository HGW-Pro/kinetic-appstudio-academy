"use client";

import { useEffect, useState } from "react";
import { notFound, useRouter } from "next/navigation";
import { useAuth } from "../AuthProvider";
import { supabase } from "../../lib/supabaseClient";
import { cmsModuleSlug } from "../../lib/cms/shared";
import { loadLocalProgress, loadRemoteProgress, markLessonComplete } from "../../lib/progress";
import CmsContentRenderer from "./CmsContentRenderer";
import LessonLayout from "../learning/LessonLayout";

type Lesson = { id: string; title: string; sequence_order: number; est_minutes: number | null; content_json: unknown };
type Course = { id: string; title: string; slug: string };
type Topic = { id: string; title: string; slug: string; est_minutes: number | null; prerequisite_topic_id: string | null };
type TopicReference = { id: string; title: string };

export default function CmsSubtopicReader({ courseSlug, topicSlug, subtopicId }: { courseSlug: string; topicSlug: string; subtopicId: string }) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [topic, setTopic] = useState<Topic | null>(null);
  const [topics, setTopics] = useState<TopicReference[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [moduleSlug, setModuleSlug] = useState("");
  const [done, setDone] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setReady(false);
      setError(null);
      const { data: loadedCourse } = await supabase
        .from("courses")
        .select("id,title,slug")
        .eq("slug", courseSlug)
        .eq("is_published", true)
        .maybeSingle<Course>();
      if (cancelled || !loadedCourse) {
        if (!cancelled) setReady(true);
        return;
      }
      const { data: loadedTopics } = await supabase
        .from("topics")
        .select("id,title,slug,est_minutes,prerequisite_topic_id")
        .eq("course_id", loadedCourse.id)
        .order("sequence_order");
      if (cancelled) return;
      const loadedTopic = (loadedTopics ?? []).find((item) => item.slug === topicSlug) as Topic | undefined;
      if (!loadedTopic) {
        setReady(true);
        return;
      }
      const { data: loadedLessons, error: lessonError } = await supabase
        .from("subtopics")
        .select("id,title,sequence_order,est_minutes,content_json")
        .eq("topic_id", loadedTopic.id)
        .order("sequence_order");
      if (cancelled) return;
      const allLessons = (loadedLessons ?? []) as Lesson[];
      setCourse(loadedCourse);
      setTopic(loadedTopic);
      setTopics((loadedTopics ?? []) as TopicReference[]);
      setLessons(allLessons);
      setLesson(allLessons.find((item) => item.id === subtopicId) ?? null);
      setModuleSlug(cmsModuleSlug(loadedCourse.slug, loadedTopic.slug));
      if (lessonError) setError("Lesson content could not be loaded.");
      setReady(true);
    })();
    return () => { cancelled = true; };
  }, [courseSlug, topicSlug, subtopicId]);

  useEffect(() => {
    if (!ready || !moduleSlug || authLoading) return;
    let cancelled = false;
    (async () => {
      const progress = user ? await loadRemoteProgress(user.id) : loadLocalProgress();
      if (!cancelled) setDone(progress[moduleSlug]?.lessonsCompleted ?? []);
    })();
    return () => { cancelled = true; };
  }, [ready, moduleSlug, user, authLoading]);

  if (!ready || authLoading) return <div className="py-16 text-center text-sm text-[var(--text-lo)]">Loading lesson…</div>;
  if (!lesson || !course || !topic) notFound();

  const index = lessons.findIndex((item) => item.id === lesson.id);
  const completedCount = lessons.filter((item) => done.includes(item.id)).length;
  const locked = index > Math.min(completedCount, lessons.length - 1);
  const prerequisiteName = topic.prerequisite_topic_id ? topics.find((item) => item.id === topic.prerequisite_topic_id)?.title ?? "Required topic" : null;
  const topicEstMinutes = topic.est_minutes && topic.est_minutes > 0
    ? topic.est_minutes
    : lessons.reduce((total, item) => total + (item.est_minutes && item.est_minutes > 0 ? item.est_minutes : 5), 0);

  async function complete() {
    if (!user || !lesson) return;
    setSaving(true);
    setError(null);
    const { state, remoteWrite } = markLessonComplete(moduleSlug, lesson.id, user.id);
    setDone(state[moduleSlug]?.lessonsCompleted ?? []);
    if (remoteWrite) {
      const { error: writeError } = await remoteWrite;
      if (writeError) {
        setError(writeError);
        setSaving(false);
        return;
      }
    }
    setSaving(false);
    const next = lessons[index + 1];
    router.push(next ? `/courses/${courseSlug}/${topicSlug}/${next.id}` : `/courses/${courseSlug}/${topicSlug}`);
  }

  if (locked) {
    return (
      <div className="mx-auto max-w-lg border border-[var(--border)] bg-[var(--surface)] p-8 text-center shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.13em] text-[var(--primary)]">Lesson sequence</p>
        <h1 className="mt-2 text-xl font-bold text-[var(--text-hi)]">This lesson is locked</h1>
        <p className="mt-2 text-sm text-[var(--text-mid)]">Complete the preceding lesson to unlock this part of the topic.</p>
        <button type="button" onClick={() => router.push(`/courses/${courseSlug}/${topicSlug}`)} className="mt-6 inline-flex min-h-11 items-center justify-center rounded-md bg-[var(--primary)] px-5 py-2 text-sm font-semibold text-white hover:bg-[var(--primary-dark)]">Back to topic</button>
      </div>
    );
  }

  return (
    <LessonLayout
      courseTitle={course.title}
      courseSlug={course.slug}
      topicTitle={topic.title}
      topicSlug={topic.slug}
      topicEstMinutes={topicEstMinutes || Math.max(lessons.length * 5, 5)}
      prerequisiteName={prerequisiteName}
      lessons={lessons.map((item) => ({ id: item.id, title: item.title, estMinutes: item.est_minutes && item.est_minutes > 0 ? item.est_minutes : 5 }))}
      currentLessonId={lesson.id}
      completedIds={done}
      isSignedIn={Boolean(user)}
      isSaving={saving}
      onComplete={complete}
      error={error}
    >
      <CmsContentRenderer blocks={Array.isArray(lesson.content_json) ? lesson.content_json : []} quizContext={{ moduleSlug, moduleTitle: topic.title }} />
    </LessonLayout>
  );
}
