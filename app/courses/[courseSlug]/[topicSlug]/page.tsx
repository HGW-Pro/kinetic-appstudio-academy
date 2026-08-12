"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCourse, getTopic } from "../../../../lib/courses";
import TopicAccessGate from "../../../../components/TopicAccessGate";
import { useAuth } from "../../../../components/AuthProvider";
import { supabase } from "../../../../lib/supabaseClient";
import { cmsModuleSlug } from "../../../../lib/cms/shared";
import {
  loadLocalProgress,
  loadRemoteProgress,
  enrollInModule,
  type ProgressState,
} from "../../../../lib/progress";

interface CmsSubtopicRow {
  id: string;
  title: string;
  sequence_order: number;
  estMinutes: number;
}
interface CmsTopicRow {
  id: string;
  title: string;
  slug: string;
  sequence_order: number;
  difficulty: string;
}
interface CmsCourseRow {
  id: string;
  title: string;
  slug: string;
}

export default function TopicPage({
  params,
}: {
  params: { courseSlug: string; topicSlug: string };
}) {
  const legacyCourse = getCourse(params.courseSlug);
  const legacyTopic = legacyCourse ? getTopic(params.courseSlug, params.topicSlug) : null;

  const { user, loading: authLoading } = useAuth();
  const [progress, setProgress] = useState<ProgressState>({});
  const [ready, setReady] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [enrollError, setEnrollError] = useState<string | null>(null);

  const [cmsChecked, setCmsChecked] = useState(false);
  const [cmsCourse, setCmsCourse] = useState<CmsCourseRow | null>(null);
  const [cmsTopic, setCmsTopic] = useState<CmsTopicRow | null>(null);
  const [cmsTopicCount, setCmsTopicCount] = useState(0);
  const [cmsSubtopics, setCmsSubtopics] = useState<CmsSubtopicRow[]>([]);
  const [cmsQuizQuestionCount, setCmsQuizQuestionCount] = useState(0);

  const cmsSlug = cmsCourse && cmsTopic ? cmsModuleSlug(cmsCourse.slug, cmsTopic.slug) : null;
  const moduleSlug = legacyTopic ? legacyTopic.slug : cmsSlug;

  useEffect(() => {
    if (authLoading || !moduleSlug) return;
    (async () => {
      const p = user ? await loadRemoteProgress(user.id) : loadLocalProgress();
      setProgress(p);
      setEnrolled(!!p[moduleSlug]?.enrolled);
      setReady(true);
    })();
  }, [user, authLoading, moduleSlug]);

  useEffect(() => {
    if (legacyCourse) return;
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
      setCmsCourse(course);

      const { data: allTopics } = await supabase
        .from("topics")
        .select("id, title, slug, sequence_order, difficulty")
        .eq("course_id", course.id)
        .order("sequence_order", { ascending: true });
      setCmsTopicCount((allTopics ?? []).length);

      const topic = (allTopics ?? []).find((t) => t.slug === params.topicSlug);
      if (!topic) {
        setCmsChecked(true);
        return;
      }
      setCmsTopic({
        id: topic.id,
        title: topic.title,
        slug: topic.slug,
        sequence_order: topic.sequence_order,
        difficulty: topic.difficulty && String(topic.difficulty).trim() ? String(topic.difficulty) : "Standard",
      });

      const { data: subtopics } = await supabase
        .from("subtopics")
        .select("id, title, sequence_order, est_minutes")
        .eq("topic_id", topic.id)
        .order("sequence_order", { ascending: true });

      const subtopicRows: CmsSubtopicRow[] = (subtopics ?? []).map((s) => ({
        id: s.id,
        title: s.title,
        sequence_order: s.sequence_order,
        estMinutes: s.est_minutes && s.est_minutes > 0 ? s.est_minutes : 5,
      }));
      setCmsSubtopics(subtopicRows);

      const subtopicIds = subtopicRows.map((s) => s.id);
      if (subtopicIds.length > 0) {
        const { data: quizzes } = await supabase
          .from("quizzes")
          .select("questions_json")
          .in("subtopic_id", subtopicIds);
        const total = (quizzes ?? []).reduce(
          (sum, q) => sum + (Array.isArray(q.questions_json) ? q.questions_json.length : 0),
          0
        );
        setCmsQuizQuestionCount(total);
      }
      setCmsChecked(true);
    })();
  }, [legacyCourse, params.courseSlug, params.topicSlug]);

  async function handleEnroll() {
    if (!user || !moduleSlug) return;
    setEnrolling(true);
    setEnrollError(null);
    const { error } = await enrollInModule(user.id, moduleSlug);
    setEnrolling(false);
    if (error) {
      setEnrollError("Enrollment failed to save: " + error);
      return;
    }
    setEnrolled(true);
  }

  if (legacyCourse && legacyTopic) {
    const course = legacyCourse;
    const topic = legacyTopic;
    const idx = course.topics.findIndex((t) => t.slug === topic.slug);
    const prevTopic = course.topics[idx - 1];
    const nextTopic = course.topics[idx + 1];

    const doneIds = progress[topic.slug]?.lessonsCompleted ?? [];
    const highestUnlocked = user ? Math.min(doneIds.length, topic.lessons.length - 1) : 0;
    const firstIncomplete =
      topic.lessons.find((l) => !doneIds.includes(l.id)) ?? topic.lessons[topic.lessons.length - 1];
    const allDone = doneIds.length >= topic.lessons.length;
    const isCertified = !!progress[topic.slug]?.completedAt;

    return (
      <TopicAccessGate
        courseSlug={params.courseSlug}
        topics={course.topics}
        topicSlug={params.topicSlug}
        requireEnrollment={false}
      >
        <div className="space-y-8">
          <div className="glass-card glow-border rounded-2xl p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{topic.icon}</span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[var(--primary)]">
                    Topic {idx + 1} of {course.topics.length} · {topic.difficulty}
                  </p>
                  <h1 className="text-2xl font-bold text-[var(--text-hi)] sm:text-3xl">{topic.title}</h1>
                </div>
              </div>

              {user ? (
                <div className="flex flex-col items-end gap-1">
                  <button
                    onClick={handleEnroll}
                    disabled={enrolling || enrolled}
                    className={`rounded-md px-4 py-2 text-sm font-semibold shadow-sm transition ${
                      enrolled
                        ? "cursor-default bg-[var(--success-soft)] text-[var(--success)]"
                        : "bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)]"
                    }`}
                  >
                    {enrolled ? "Enrolled ✓" : enrolling ? "Enrolling…" : "Enroll in Topic"}
                  </button>
                  {enrollError && (
                    <p className="max-w-xs text-right text-xs text-[var(--error)]">⚠️ {enrollError}</p>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="rounded-md border border-[var(--border-strong)] bg-[var(--surface-2)] px-4 py-2 text-sm font-semibold text-[var(--text-hi)] transition hover:bg-[var(--surface-3)]"
                >
                  Sign in to enroll
                </Link>
              )}
            </div>
            <p className="mt-4 max-w-2xl text-sm text-[var(--text-mid)]">{topic.tagline}</p>
            <div className="mt-5 flex flex-wrap gap-3 text-xs text-[var(--text-lo)]">
              <span className="badge-pill">{topic.lessons.length} subtopics</span>
              <span className="badge-pill">{topic.estMinutes} min</span>
              <span className="badge-pill">{topic.quiz.length}-question assignment</span>
              {isCertified && <span className="badge-pill">🏆 Certified</span>}
            </div>
            {!enrolled && user && (
              <p className="mt-4 rounded-lg border border-[var(--primary)]/20 bg-[var(--primary)]/[0.05] px-4 py-3 text-xs text-[var(--text-mid)]">
                💡 You must enroll before you can open any subtopic below or take the assignment.
              </p>
            )}
          </div>

          <div className="glass-card rounded-2xl p-6">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-[var(--primary)]">
              Subtopics
            </h2>
            <div className="space-y-2">
              {topic.lessons.map((l, i) => {
                const done = doneIds.includes(l.id);
                const locked = ready && i > highestUnlocked;
                const row = (
                  <div
                    className={`flex items-center justify-between rounded-lg border px-4 py-3 transition ${
                      locked
                        ? "border-[var(--border)] bg-[var(--surface-2)] opacity-60"
                        : "border-[var(--border-strong)] bg-[var(--surface)] hover:bg-[var(--surface-2)]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                          done
                            ? "bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] text-white"
                            : locked
                            ? "bg-[var(--surface-3)] text-[var(--text-lo)]"
                            : "border border-[var(--primary)] text-[var(--primary)]"
                        }`}
                      >
                        {done ? "✓" : locked ? "🔒" : i + 1}
                      </span>
                      <span className="text-sm font-medium text-[var(--text-hi)]">{l.title}</span>
                    </div>
                    <span className="text-xs text-[var(--text-lo)]">{l.minutes} min</span>
                  </div>
                );
                return locked ? (
                  <div key={l.id}>{row}</div>
                ) : (
                  <Link key={l.id} href={`/courses/${params.courseSlug}/${params.topicSlug}/${l.id}`}>
                    {row}
                  </Link>
                );
              })}
            </div>

            <Link
              href={`/courses/${params.courseSlug}/${params.topicSlug}/${firstIncomplete.id}`}
              className="mt-5 inline-block rounded-md bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--primary-dark)]"
            >
              {doneIds.length === 0 ? "Start Topic →" : allDone ? "Review Subtopics →" : "Continue Learning →"}
            </Link>
          </div>

          <div className="glass-card rounded-2xl p-6 text-center">
            <h2 className="text-lg font-semibold text-[var(--text-hi)]">Ready to test your knowledge?</h2>
            <p className="mt-1 text-sm text-[var(--text-mid)]">
              {allDone
                ? `Score 80%+ on the ${topic.quiz.length}-question assignment to earn this topic's badge and unlock the next.`
                : "Finish every subtopic above first."}
            </p>
            {allDone ? (
              <Link
                href={`/courses/${params.courseSlug}/${params.topicSlug}/quiz`}
                className="mt-5 inline-block rounded-md bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--primary-dark)]"
              >
                Take the Assignment →
              </Link>
            ) : (
              <span className="mt-5 inline-block rounded-md bg-[var(--surface-2)] px-6 py-3 text-sm font-semibold text-[var(--text-lo)]">
                Locked
              </span>
            )}
          </div>

          <div className="flex items-center justify-between text-sm">
            {prevTopic ? (
              <Link
                href={`/courses/${params.courseSlug}/${prevTopic.slug}`}
                className="text-[var(--text-mid)] hover:text-[var(--primary)]"
              >
                ← {prevTopic.title}
              </Link>
            ) : (
              <span />
            )}
            {nextTopic ? (
              <Link
                href={`/courses/${params.courseSlug}/${nextTopic.slug}`}
                className="text-[var(--text-mid)] hover:text-[var(--primary)]"
              >
                {nextTopic.title} →
              </Link>
            ) : (
              <span />
            )}
          </div>
        </div>
      </TopicAccessGate>
    );
  }

  if (legacyCourse && !legacyTopic) notFound();
  if (!cmsChecked) return null;
  if (!cmsCourse || !cmsTopic) notFound();

  const doneIds = progress[moduleSlug!]?.lessonsCompleted ?? [];
  const highestUnlocked = user ? Math.min(doneIds.length, cmsSubtopics.length - 1) : 0;
  const allDone = cmsSubtopics.length > 0 && doneIds.length >= cmsSubtopics.length;
  const isCertified = !!progress[moduleSlug!]?.completedAt;
  const totalEstMinutes = cmsSubtopics.reduce((sum, s) => sum + s.estMinutes, 0);
  const firstIncompleteId =
    cmsSubtopics.find((s) => !doneIds.includes(s.id))?.id ?? cmsSubtopics[cmsSubtopics.length - 1]?.id;

  return (
    <div className="space-y-8">
      <div className="glass-card glow-border rounded-2xl p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-4xl">📘</span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--primary)]">
                Topic {cmsTopic.sequence_order + 1} of {cmsTopicCount} · {cmsTopic.difficulty}
              </p>
              <h1 className="text-2xl font-bold text-[var(--text-hi)] sm:text-3xl">{cmsTopic.title}</h1>
            </div>
          </div>

          {user ? (
            <div className="flex flex-col items-end gap-1">
              <button
                onClick={handleEnroll}
                disabled={enrolling || enrolled}
                className={`rounded-md px-4 py-2 text-sm font-semibold shadow-sm transition ${
                  enrolled
                    ? "cursor-default bg-[var(--success-soft)] text-[var(--success)]"
                    : "bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)]"
                }`}
              >
                {enrolled ? "Enrolled ✓" : enrolling ? "Enrolling…" : "Enroll in Topic"}
              </button>
              {enrollError && (
                <p className="max-w-xs text-right text-xs text-[var(--error)]">⚠️ {enrollError}</p>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="rounded-md border border-[var(--border-strong)] bg-[var(--surface-2)] px-4 py-2 text-sm font-semibold text-[var(--text-hi)] transition hover:bg-[var(--surface-3)]"
            >
              Sign in to enroll
            </Link>
          )}
        </div>

        <div className="mt-5 flex flex-wrap gap-3 text-xs text-[var(--text-lo)]">
          <span className="badge-pill">{cmsSubtopics.length} subtopics</span>
          <span className="badge-pill">{totalEstMinutes} min</span>
          <span className="badge-pill">{cmsQuizQuestionCount}-question assignment</span>
          {isCertified && <span className="badge-pill">🏆 Certified</span>}
        </div>
        {!enrolled && user && (
          <p className="mt-4 rounded-lg border border-[var(--primary)]/20 bg-[var(--primary)]/[0.05] px-4 py-3 text-xs text-[var(--text-mid)]">
            💡 You must enroll before you can open any subtopic below or take the assignment.
          </p>
        )}
      </div>

      <div className="glass-card rounded-2xl p-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-[var(--primary)]">
          Subtopics
        </h2>
        <div className="space-y-2">
          {cmsSubtopics.map((s, i) => {
            const done = doneIds.includes(s.id);
            const locked = ready && (i > highestUnlocked || !enrolled);
            const row = (
              <div
                className={`flex items-center justify-between rounded-lg border px-4 py-3 transition ${
                  locked
                    ? "border-[var(--border)] bg-[var(--surface-2)] opacity-60"
                    : "border-[var(--border-strong)] bg-[var(--surface)] hover:bg-[var(--surface-2)]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      done
                        ? "bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] text-white"
                        : locked
                        ? "bg-[var(--surface-3)] text-[var(--text-lo)]"
                        : "border border-[var(--primary)] text-[var(--primary)]"
                    }`}
                  >
                    {done ? "✓" : locked ? "🔒" : i + 1}
                  </span>
                  <span className="text-sm font-medium text-[var(--text-hi)]">{s.title}</span>
                </div>
                <span className="text-xs text-[var(--text-lo)]">{s.estMinutes} min</span>
              </div>
            );
            return locked ? (
              <div key={s.id}>{row}</div>
            ) : (
              <Link key={s.id} href={`/courses/${params.courseSlug}/${params.topicSlug}/${s.id}`}>
                {row}
              </Link>
            );
          })}
          {cmsSubtopics.length === 0 && (
            <p className="rounded-lg border border-dashed border-[var(--border-strong)] px-4 py-6 text-center text-sm text-[var(--text-lo)]">
              No subtopics published yet.
            </p>
          )}
        </div>

        {enrolled && firstIncompleteId && (
          <Link
            href={`/courses/${params.courseSlug}/${params.topicSlug}/${firstIncompleteId}`}
            className="mt-5 inline-block rounded-md bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--primary-dark)]"
          >
            {doneIds.length === 0 ? "Start Topic →" : allDone ? "Review Subtopics →" : "Continue Learning →"}
          </Link>
        )}
      </div>

      <div className="glass-card rounded-2xl p-6 text-center">
        <h2 className="text-lg font-semibold text-[var(--text-hi)]">Ready to test your knowledge?</h2>
        <p className="mt-1 text-sm text-[var(--text-mid)]">
          {allDone
            ? `Score 80%+ on the ${cmsQuizQuestionCount}-question assignment to earn this topic's badge and unlock the next.`
            : "Finish every subtopic above first."}
        </p>
        {allDone && cmsQuizQuestionCount > 0 ? (
          <Link
            href={`/courses/${params.courseSlug}/${params.topicSlug}/quiz`}
            className="mt-5 inline-block rounded-md bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--primary-dark)]"
          >
            Take the Assignment →
          </Link>
        ) : (
          <span className="mt-5 inline-block rounded-md bg-[var(--surface-2)] px-6 py-3 text-sm font-semibold text-[var(--text-lo)]">
            Locked
          </span>
        )}
      </div>
    </div>
  );
}
