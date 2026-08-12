"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../AuthProvider";
import { supabase } from "../../lib/supabaseClient";
import { cmsModuleSlug } from "../../lib/cms/shared";
import { loadLocalProgress, loadRemoteProgress, enrollInModule, type ProgressState } from "../../lib/progress";
import { getLabsForTopic } from "../../lib/labs";
import TopicOverview from "../learning/TopicOverview";

type Course = { id: string; title: string; slug: string; description: string | null };
type Topic = {
  id: string;
  title: string;
  slug: string;
  sequence_order: number;
  difficulty: string | null;
  est_minutes: number | null;
  learning_objectives: unknown;
  prerequisite_topic_id: string | null;
};
type Subtopic = { id: string; title: string; sequence_order: number; est_minutes: number | null; content_json: unknown };

function hasChallengeBlock(content: unknown): boolean {
  if (!Array.isArray(content)) return false;
  return content.some((block) => {
    if (!block || typeof block !== "object") return false;
    const candidate = block as { type?: unknown; mode?: unknown };
    return candidate.type === "Challenge" || candidate.mode === "Challenge";
  });
}

// Kept at its original path for route compatibility. The old accordion UI has
// been replaced by the focused TopicOverview composition below.
export default function CmsTopicAccordion({ courseSlug, topicSlug }: { courseSlug: string; topicSlug: string }) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [topic, setTopic] = useState<Topic | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [subtopics, setSubtopics] = useState<Subtopic[]>([]);
  const [progress, setProgress] = useState<ProgressState>({});
  const [enrolled, setEnrolled] = useState(false);
  const [quizQuestionCount, setQuizQuestionCount] = useState(0);
  const [ready, setReady] = useState(false);
  const [continuing, setContinuing] = useState(false);
  const [dataError, setDataError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const moduleSlug = course && topic ? cmsModuleSlug(course.slug, topic.slug) : "";

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setReady(false);
      setDataError(null);
      setActionError(null);
      const { data: loadedCourse, error: courseError } = await supabase
        .from("courses")
        .select("id,title,slug,description")
        .eq("slug", courseSlug)
        .eq("is_published", true)
        .maybeSingle<Course>();
      if (cancelled) return;
      if (courseError || !loadedCourse) {
        setDataError("Course not found.");
        setReady(true);
        return;
      }
      setCourse(loadedCourse);
      const { data: loadedTopics, error: topicError } = await supabase
        .from("topics")
        .select("id,title,slug,sequence_order,difficulty,est_minutes,learning_objectives,prerequisite_topic_id")
        .eq("course_id", loadedCourse.id)
        .order("sequence_order");
      if (cancelled) return;
      const selectedTopic = (loadedTopics ?? []).find((item) => item.slug === topicSlug) as Topic | undefined;
      if (topicError || !selectedTopic) {
        setDataError("Topic not found.");
        setReady(true);
        return;
      }
      setTopics((loadedTopics ?? []) as Topic[]);
      setTopic(selectedTopic);
      const { data: loadedSubtopics, error: subtopicError } = await supabase
        .from("subtopics")
        .select("id,title,sequence_order,est_minutes,content_json")
        .eq("topic_id", selectedTopic.id)
        .order("sequence_order");
      if (cancelled) return;
      if (subtopicError) setDataError("Lessons could not be loaded.");
      setSubtopics((loadedSubtopics ?? []) as Subtopic[]);
      const subtopicIds = (loadedSubtopics ?? []).map((item) => item.id);
      if (subtopicIds.length > 0) {
        const { data: quizRows } = await supabase
          .from("quizzes")
          .select("questions_json")
          .in("subtopic_id", subtopicIds);
        if (cancelled) return;
        setQuizQuestionCount((quizRows ?? []).reduce((sum, row) => sum + (Array.isArray(row.questions_json) ? row.questions_json.length : 0), 0));
      } else {
        setQuizQuestionCount(0);
      }
      setReady(true);
    })();
    return () => { cancelled = true; };
  }, [courseSlug, topicSlug]);

  useEffect(() => {
    if (!ready || !moduleSlug || authLoading) return;
    let cancelled = false;
    (async () => {
      const state = user ? await loadRemoteProgress(user.id) : loadLocalProgress();
      if (cancelled) return;
      setProgress(state);
      setEnrolled(Boolean(state[moduleSlug]?.enrolled));
    })();
    return () => { cancelled = true; };
  }, [ready, moduleSlug, user, authLoading]);

  const completedIds = progress[moduleSlug]?.lessonsCompleted ?? [];
  const orderedLessons = useMemo(
    () => subtopics.map((subtopic) => ({ id: subtopic.id, title: subtopic.title, estMinutes: subtopic.est_minutes && subtopic.est_minutes > 0 ? subtopic.est_minutes : 5 })),
    [subtopics]
  );
  const firstIncomplete = orderedLessons.find((lesson) => !completedIds.includes(lesson.id)) ?? null;
  const allLessonsDone = orderedLessons.length > 0 && !firstIncomplete;
  const certified = Boolean(progress[moduleSlug]?.completedAt);
  const topicIndex = topic ? topics.findIndex((item) => item.id === topic.id) : -1;
  const nextTopic = topicIndex >= 0 ? topics[topicIndex + 1] ?? null : null;
  const hasAssessment = quizQuestionCount > 0;
  const prerequisiteName = topic?.prerequisite_topic_id ? topics.find((item) => item.id === topic.prerequisite_topic_id)?.title ?? "Required topic" : null;
  const objectives = Array.isArray(topic?.learning_objectives)
    ? topic.learning_objectives.filter((objective): objective is string => typeof objective === "string" && objective.trim().length > 0)
    : [];
  const displayObjectives = objectives.length > 0 ? objectives : orderedLessons.map((lesson) => lesson.title);
  const challengeLesson = subtopics.find((subtopic) => hasChallengeBlock(subtopic.content_json));
  const relatedLabs = course && topic ? getLabsForTopic(course.slug, topic.slug) : [];

  async function handleContinue() {
    if (!user || !topic) return;
    setContinuing(true);
    setActionError(null);
    if (!enrolled) {
      const { error: enrollError } = await enrollInModule(user.id, moduleSlug);
      if (enrollError) {
        setActionError(enrollError);
        setContinuing(false);
        return;
      }
      setEnrolled(true);
    }
    // Route to the learner's true next step instead of falling back to the
    // last lesson: next incomplete lesson → topic assessment → next topic.
    if (firstIncomplete) {
      router.push(`/courses/${courseSlug}/${topicSlug}/${firstIncomplete.id}`);
      return;
    }
    if (hasAssessment && !certified) {
      router.push(`/courses/${courseSlug}/${topicSlug}/quiz`);
      return;
    }
    router.push(nextTopic ? `/courses/${courseSlug}/${nextTopic.slug}` : "/learning-path");
  }

  const continueLabel = firstIncomplete
    ? "Continue Learning →"
    : allLessonsDone && hasAssessment && !certified
      ? "Take the assessment →"
      : nextTopic
        ? "Next topic →"
        : "Review learning path →";

  if (!ready || authLoading) return <div className="py-16 text-center text-sm text-[var(--text-lo)]">Loading topic…</div>;
  if (dataError || !course || !topic) return <div role="alert" className="rounded-xl border border-[var(--error)]/30 bg-[var(--error-soft)] p-5 text-[var(--error)]">{dataError ?? "Topic unavailable."}</div>;

  const topicMinutes = topic.est_minutes && topic.est_minutes > 0
    ? topic.est_minutes
    : orderedLessons.reduce((total, lesson) => total + lesson.estMinutes, 0);

  return (
    <>
      {actionError && <p role="alert" className="mb-5 rounded-lg border border-[var(--error)]/30 bg-[var(--error-soft)] px-4 py-3 text-sm text-[var(--error)]">{actionError}</p>}
      <TopicOverview
        courseSlug={course.slug}
        courseTitle={course.title}
        topicSlug={topic.slug}
        title={topic.title}
        description={course.description || `Build confidence through a focused sequence of ${orderedLessons.length} lessons.`}
        difficulty={topic.difficulty?.trim() || "Standard"}
        estMinutes={topicMinutes || Math.max(orderedLessons.length * 5, 5)}
        prerequisiteName={prerequisiteName}
        objectives={displayObjectives.length > 0 ? displayObjectives : ["Complete the lessons in this topic to build practical Kinetic fluency."]}
        lessons={orderedLessons}
        completedIds={completedIds}
        isSignedIn={Boolean(user)}
        isEnrolled={enrolled}
        isCertified={Boolean(progress[moduleSlug]?.completedAt)}
        onContinue={handleContinue}
        isContinuing={continuing}
        continueLabel={continueLabel}
        assessment={hasAssessment ? { questionCount: quizQuestionCount, unlocked: allLessonsDone, passed: certified, href: `/courses/${courseSlug}/${topicSlug}/quiz` } : null}
        practicalMilestone={relatedLabs.length > 0 ? <div className="space-y-3"><div><p className="text-xs font-semibold uppercase tracking-[0.13em] text-[var(--primary)]">Practical milestone</p><h2 className="mt-1 text-lg font-semibold text-[var(--text-hi)]">Put this topic into practice</h2><p className="mt-1 text-sm text-[var(--text-mid)]">Build a working Kinetic customization after completing the guided lessons.</p></div><div className="flex flex-wrap gap-3">{relatedLabs.map((lab) => <Link key={lab.slug} href={`/labs/${lab.slug}`} className="inline-flex min-h-10 items-center rounded-md bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--primary-dark)]">🧪 {lab.title} →</Link>)}</div></div> : undefined}
        challenge={challengeLesson ? <><p className="text-xs font-semibold uppercase tracking-[0.13em] text-[var(--accent)]">Practical challenge</p><h2 className="mt-1 text-lg font-semibold text-[var(--text-hi)]">{challengeLesson.title}</h2><p className="mt-1 text-sm text-[var(--text-mid)]">Apply this topic&apos;s concepts in a hands-on challenge.</p></> : undefined}
      />
    </>
  );
}
