"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCourse, getTopic } from "../../../../../lib/courses";
import QuizEngine from "../../../../../components/QuizEngine";
import TopicAccessGate from "../../../../../components/TopicAccessGate";
import { useAuth } from "../../../../../components/AuthProvider";
import { supabase } from "../../../../../lib/supabaseClient";
import { cmsModuleSlug } from "../../../../../lib/cms/shared";
import { loadRemoteProgress } from "../../../../../lib/progress";
import type { QuizQuestionSchema } from "../../../../../lib/admin/types";

export default function TopicQuizPage({
  params,
}: {
  params: { courseSlug: string; topicSlug: string };
}) {
  const legacyCourse = getCourse(params.courseSlug);
  const legacyTopic = legacyCourse ? getTopic(params.courseSlug, params.topicSlug) : null;
  const isLegacy = !!(legacyCourse && legacyTopic);

  const { user, loading: authLoading } = useAuth();
  const [checked, setChecked] = useState(false);
  const [subtopicsIncomplete, setSubtopicsIncomplete] = useState(false);

  const [cmsChecked, setCmsChecked] = useState(false);
  const [cmsCourseTitle, setCmsCourseTitle] = useState<string | null>(null);
  const [cmsTopicTitle, setCmsTopicTitle] = useState<string | null>(null);
  const [cmsQuestions, setCmsQuestions] = useState<QuizQuestionSchema[] | null>(null);

  useEffect(() => {
    if (!isLegacy) return;
    if (authLoading || !user) {
      setChecked(true);
      return;
    }
    (async () => {
      const progress = await loadRemoteProgress(user.id);
      const done = progress[legacyTopic!.slug]?.lessonsCompleted.length ?? 0;
      setSubtopicsIncomplete(done < legacyTopic!.lessons.length);
      setChecked(true);
    })();
  }, [isLegacy, user, authLoading, legacyTopic]);

  useEffect(() => {
    (async () => {
      const { data: course } = await supabase
        .from("courses")
        .select("id, title, slug")
        .eq("slug", params.courseSlug)
        .eq("is_published", true)
        .maybeSingle();
      if (!course) {
        setCmsChecked(true);
        return;
      }
      const { data: topic } = await supabase
        .from("topics")
        .select("id, title, slug")
        .eq("course_id", course.id)
        .eq("slug", params.topicSlug)
        .maybeSingle();
      if (!topic) {
        setCmsChecked(true);
        return;
      }
      setCmsCourseTitle(course.title);
      setCmsTopicTitle(topic.title);

      const { data: subtopics } = await supabase
        .from("subtopics")
        .select("id")
        .eq("topic_id", topic.id)
        .order("sequence_order", { ascending: true });
      const lastSubtopicId = (subtopics ?? [])[subtopics!.length - 1]?.id;
      if (lastSubtopicId) {
        const { data: quiz } = await supabase
          .from("quizzes")
          .select("questions_json")
          .eq("subtopic_id", lastSubtopicId)
          .maybeSingle();
        if (quiz && Array.isArray(quiz.questions_json) && quiz.questions_json.length > 0) {
          setCmsQuestions(quiz.questions_json as QuizQuestionSchema[]);
        }
      }
      setCmsChecked(true);
    })();
  }, [params.courseSlug, params.topicSlug]);

  // Use the CMS whenever the published course/topic exists. The legacy quiz
  // path is intentionally retained only as a compatibility fallback.
  const hasCmsQuizRoute = cmsChecked && !!cmsCourseTitle && !!cmsTopicTitle;

  if (cmsChecked && !hasCmsQuizRoute && isLegacy) {
    const course = legacyCourse!;
    const topic = legacyTopic!;
    const idx = course.topics.findIndex((t) => t.slug === topic.slug);
    const nextTopic = course.topics[idx + 1];

    if (!authLoading && !user) {
      return (
        <div className="glass-card glow-border mx-auto max-w-lg rounded-2xl p-10 text-center">
          <div className="text-5xl">🔒</div>
          <h1 className="mt-4 text-xl font-bold text-[var(--text-hi)]">Sign in to take this assignment</h1>
          <p className="mt-2 text-sm text-[var(--text-mid)]">
            Assignments and certifications are tied to your account so progress syncs across devices.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/login"
              className="rounded-md bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--primary-dark)]"
            >
              Sign In
            </Link>
            <Link
              href={`/courses/${params.courseSlug}/${params.topicSlug}`}
              className="rounded-md border border-[var(--border-strong)] bg-[var(--surface-2)] px-5 py-2.5 text-sm font-semibold text-[var(--text-hi)] transition hover:bg-[var(--surface-3)]"
            >
              ← Back to Topic
            </Link>
          </div>
        </div>
      );
    }

    return (
      <TopicAccessGate courseSlug={params.courseSlug} topics={course.topics} topicSlug={params.topicSlug}>
        {checked && subtopicsIncomplete ? (
          <div className="glass-card glow-border mx-auto max-w-lg rounded-2xl p-10 text-center">
            <div className="text-5xl">📘</div>
            <h1 className="mt-4 text-xl font-bold text-[var(--text-hi)]">Finish the subtopics first</h1>
            <p className="mt-2 text-sm text-[var(--text-mid)]">
              Complete every subtopic in this topic before taking the assignment.
            </p>
            <Link
              href={`/courses/${params.courseSlug}/${params.topicSlug}`}
              className="mt-6 inline-block rounded-md bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--primary-dark)]"
            >
              ← Back to Topic
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="text-center">
              <span className="badge-pill mx-auto w-fit">📝 Knowledge Check</span>
              <h1 className="mt-4 text-2xl font-bold text-[var(--text-hi)] sm:text-3xl">
                {topic.title} — Assignment
              </h1>
              <p className="mt-2 text-sm text-[var(--text-mid)]">
                {topic.quiz.length} questions · Instant feedback · 80% required to pass
              </p>
            </div>
            <QuizEngine
              moduleSlug={topic.slug}
              moduleTitle={topic.title}
              questions={topic.quiz}
              nextHref={nextTopic ? `/courses/${params.courseSlug}/${nextTopic.slug}` : undefined}
            />
          </div>
        )}
      </TopicAccessGate>
    );
  }

  if (!cmsChecked) return null;
  if (!cmsQuestions || !cmsCourseTitle || !cmsTopicTitle) notFound();

  if (!authLoading && !user) {
    return (
      <div className="glass-card glow-border mx-auto max-w-lg rounded-2xl p-10 text-center">
        <div className="text-5xl">🔒</div>
        <h1 className="mt-4 text-xl font-bold text-[var(--text-hi)]">Sign in to take this assignment</h1>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/login"
            className="rounded-md bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--primary-dark)]"
          >
            Sign In
          </Link>
          <Link
            href={`/courses/${params.courseSlug}/${params.topicSlug}`}
            className="rounded-md border border-[var(--border-strong)] bg-[var(--surface-2)] px-5 py-2.5 text-sm font-semibold text-[var(--text-hi)] transition hover:bg-[var(--surface-3)]"
          >
            ← Back to Topic
          </Link>
        </div>
      </div>
    );
  }

  const moduleSlug = cmsModuleSlug(params.courseSlug, params.topicSlug);
  const questionsWithId = cmsQuestions.map((q, i) => ({ ...q, id: `q${i}` }));

  return (
    <div className="space-y-8">
      <div className="text-center">
        <span className="badge-pill mx-auto w-fit">📝 Knowledge Check</span>
        <h1 className="mt-4 text-2xl font-bold text-[var(--text-hi)] sm:text-3xl">
          {cmsTopicTitle} — Assignment
        </h1>
        <p className="mt-2 text-sm text-[var(--text-mid)]">
          {cmsQuestions.length} questions · Instant feedback · 80% required to pass
        </p>
      </div>
      <QuizEngine
        moduleSlug={moduleSlug}
        moduleTitle={cmsTopicTitle}
        questions={questionsWithId}
        nextHref={`/courses/${params.courseSlug}`}
      />
    </div>
  );
}
