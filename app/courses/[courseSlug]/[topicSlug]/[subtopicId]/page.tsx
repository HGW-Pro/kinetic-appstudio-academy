"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { getCourse, getTopic } from "../../../../../lib/courses";
import TopicAccessGate from "../../../../../components/TopicAccessGate";
import { useAuth } from "../../../../../components/AuthProvider";
import { supabase } from "../../../../../lib/supabaseClient";
import { cmsModuleSlug } from "../../../../../lib/cms/shared";
import { loadLocalProgress, loadRemoteProgress, markLessonComplete } from "../../../../../lib/progress";
import { playSound } from "../../../../../lib/sounds";
import FlowDiagramView from "../../../../../components/FlowDiagram";
import VisualMockup from "../../../../../components/VisualMockup";
import ImageGallery, { type LessonImage } from "../../../../../components/ImageGallery";
import { normalizeContentBlocks, type ContentBlock } from "../../../../../lib/admin/types";
import CmsContentRenderer from "../../../../../components/cms/CmsContentRenderer";

function renderBody(text: string) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : <span key={i}>{part}</span>
  );
}

interface CmsSubtopicFull {
  id: string;
  title: string;
  content_json: ContentBlock[];
}

export default function SubtopicPage({
  params,
}: {
  params: { courseSlug: string; topicSlug: string; subtopicId: string };
}) {
  const legacyCourse = getCourse(params.courseSlug);
  const legacyTopic = legacyCourse ? getTopic(params.courseSlug, params.topicSlug) : null;
  const legacyLessonIdx = legacyTopic
    ? legacyTopic.lessons.findIndex((l) => l.id === params.subtopicId)
    : -1;
  const legacyLesson = legacyLessonIdx >= 0 ? legacyTopic!.lessons[legacyLessonIdx] : null;

  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [progressChecked, setProgressChecked] = useState(false);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [locked, setLocked] = useState(false);
  const [revealCount, setRevealCount] = useState(1);
  const [reviewedExtras, setReviewedExtras] = useState(false);
  const [saving, setSaving] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  const [cmsChecked, setCmsChecked] = useState(false);
  const [cmsCourseSlug, setCmsCourseSlug] = useState<string | null>(null);
  const [cmsTopicSlug, setCmsTopicSlug] = useState<string | null>(null);
  const [cmsSubtopicIds, setCmsSubtopicIds] = useState<string[]>([]);
  const [cmsSubtopic, setCmsSubtopic] = useState<CmsSubtopicFull | null>(null);
  const [cmsHasQuizHere, setCmsHasQuizHere] = useState(false);

  const isLegacy = !!(legacyCourse && legacyTopic && legacyLesson);
  const moduleSlug = isLegacy ? legacyTopic!.slug : cmsCourseSlug && cmsTopicSlug ? cmsModuleSlug(cmsCourseSlug, cmsTopicSlug) : null;

  useEffect(() => {
    if (authLoading || !moduleSlug || !isLegacy) return;
    (async () => {
      const progress = user ? await loadRemoteProgress(user.id) : loadLocalProgress();
      const done = progress[moduleSlug]?.lessonsCompleted ?? [];
      setCompletedIds(done);
      setLocked(legacyLessonIdx > Math.min(done.length, legacyTopic!.lessons.length - 1));
      setProgressChecked(true);
    })();
    setRevealCount(1);
    setReviewedExtras(false);
    setSyncError(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading, moduleSlug, legacyLessonIdx, isLegacy]);

  useEffect(() => {
    if (isLegacy) return;
    (async () => {
      const { data: course } = await supabase
        .from("courses")
        .select("id, slug")
        .eq("slug", params.courseSlug)
        .eq("is_published", true)
        .maybeSingle();
      if (!course) {
        setCmsChecked(true);
        return;
      }
      const { data: topic } = await supabase
        .from("topics")
        .select("id, slug")
        .eq("course_id", course.id)
        .eq("slug", params.topicSlug)
        .maybeSingle();
      if (!topic) {
        setCmsChecked(true);
        return;
      }
      setCmsCourseSlug(course.slug);
      setCmsTopicSlug(topic.slug);

      const { data: subtopics } = await supabase
        .from("subtopics")
        .select("id, title, content_json, sequence_order")
        .eq("topic_id", topic.id)
        .order("sequence_order", { ascending: true });
      const ids = (subtopics ?? []).map((s) => s.id);
      setCmsSubtopicIds(ids);

      const found = (subtopics ?? []).find((s) => s.id === params.subtopicId);
      if (found) {
        setCmsSubtopic({ id: found.id, title: found.title, content_json: found.content_json });
        const { data: quiz } = await supabase
          .from("quizzes")
          .select("id")
          .eq("subtopic_id", found.id)
          .maybeSingle();
        setCmsHasQuizHere(!!quiz);
      }

      const mSlug = cmsModuleSlug(course.slug, topic.slug);
      const progress = user ? await loadRemoteProgress(user.id) : loadLocalProgress();
      setCompletedIds(progress[mSlug]?.lessonsCompleted ?? []);
      const idx = ids.indexOf(params.subtopicId);
      setLocked(idx > Math.min((progress[mSlug]?.lessonsCompleted ?? []).length, ids.length - 1));
      setProgressChecked(true);
      setCmsChecked(true);
    })();
  }, [isLegacy, params.courseSlug, params.topicSlug, params.subtopicId, user]);

  function handleReveal() {
    playSound("click");
    if (legacyLesson) setRevealCount((c) => Math.min(c + 1, legacyLesson.body.length));
  }

  function handleReviewExtras() {
    playSound("click");
    setReviewedExtras(true);
  }

  async function handleComplete() {
    if (!user || !moduleSlug) return;
    setSaving(true);
    setSyncError(null);

    if (isLegacy) {
      const { state, remoteWrite } = markLessonComplete(moduleSlug, legacyLesson!.id, user.id);
      setCompletedIds(state[moduleSlug]?.lessonsCompleted ?? []);
      if (remoteWrite) {
        const { error } = await remoteWrite;
        if (error) {
          setSaving(false);
          setSyncError("Saved on this device, but couldn't sync to your account: " + error + " — you can still continue.");
          return;
        }
      }
      setSaving(false);
      const nextLesson = legacyTopic!.lessons[legacyLessonIdx + 1];
      playSound(nextLesson ? "unlock" : "complete");
      if (nextLesson) {
        router.push(`/courses/${params.courseSlug}/${params.topicSlug}/${nextLesson.id}`);
      } else {
        router.push(`/courses/${params.courseSlug}/${params.topicSlug}/quiz`);
      }
      return;
    }

    const { remoteWrite } = markLessonComplete(moduleSlug, params.subtopicId, user.id);
    if (remoteWrite) {
      const { error } = await remoteWrite;
      if (error) {
        setSaving(false);
        setSyncError("Saved on this device, but couldn't sync to your account: " + error + " — you can still continue.");
        return;
      }
    }
    setSaving(false);
    const idx = cmsSubtopicIds.indexOf(params.subtopicId);
    const nextId = cmsSubtopicIds[idx + 1];
    playSound(nextId ? "unlock" : "complete");
    if (nextId) {
      router.push(`/courses/${params.courseSlug}/${params.topicSlug}/${nextId}`);
    } else {
      router.push(`/courses/${params.courseSlug}/${params.topicSlug}/quiz`);
    }
  }

  if (isLegacy) {
    const course = legacyCourse!;
    const topic = legacyTopic!;
    const lesson = legacyLesson!;
    const lessonIdx = legacyLessonIdx;

    const lessonImages = (lesson as unknown as { images?: LessonImage[] }).images;
    const hasExtras = !!(lesson.mockup || lesson.flow || (lessonImages && lessonImages.length));
    const allParasRevealed = revealCount >= lesson.body.length;
    const canComplete = allParasRevealed && (!hasExtras || reviewedExtras);
    const isDone = completedIds.includes(lesson.id);

    const prevLesson = topic.lessons[lessonIdx - 1];
    const nextLesson = topic.lessons[lessonIdx + 1];

    return (
      <TopicAccessGate courseSlug={params.courseSlug} topics={course.topics} topicSlug={params.topicSlug}>
        {!progressChecked ? null : locked ? (
          <div className="glass-card glow-border mx-auto max-w-lg rounded-2xl p-10 text-center">
            <div className="text-5xl">🔒</div>
            <h1 className="mt-4 text-xl font-bold text-[var(--text-hi)]">This subtopic is locked</h1>
            <p className="mt-2 text-sm text-[var(--text-mid)]">
              Complete the previous subtopics in "{topic.title}" first.
            </p>
            <Link
              href={`/courses/${params.courseSlug}/${params.topicSlug}`}
              className="mt-6 inline-block rounded-md bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--primary-dark)]"
            >
              ← Back to Topic
            </Link>
          </div>
        ) : (
          <div className="mx-auto max-w-2xl space-y-6">
            <div className="flex items-center justify-center gap-1.5">
              {topic.lessons.map((l, i) => (
                <span
                  key={l.id}
                  className={`h-1.5 max-w-10 flex-1 rounded-full ${
                    i < lessonIdx || completedIds.includes(l.id)
                      ? "bg-[var(--primary)]"
                      : i === lessonIdx
                      ? "bg-[var(--primary-light)]"
                      : "bg-[var(--surface-3)]"
                  }`}
                />
              ))}
            </div>
            <p className="text-center text-xs text-[var(--text-lo)]">
              Subtopic {lessonIdx + 1} of {topic.lessons.length} · {topic.title}
            </p>

            {syncError && (
              <div className="rounded-lg border border-[var(--error)]/30 bg-[var(--error-soft)] px-4 py-3 text-sm text-[var(--error)]">
                ⚠️ {syncError}
              </div>
            )}

            <div className="glass-card glow-border rounded-2xl p-8">
              <div className="flex items-center justify-between gap-3">
                <h1 className="text-xl font-bold text-[var(--text-hi)] sm:text-2xl">{lesson.title}</h1>
                <span className="badge-pill shrink-0">{lesson.minutes} min</span>
              </div>

              <div className="prose-lesson mt-6 space-y-4">
                {lesson.body.slice(0, revealCount).map((p, idx) => (
                  <p key={idx} className="lesson-line">
                    {renderBody(p)}
                  </p>
                ))}
              </div>

              {!allParasRevealed && (
                <button
                  onClick={handleReveal}
                  className="mt-5 w-full rounded-md border border-[var(--border-strong)] bg-[var(--surface-2)] px-5 py-3 text-sm font-semibold text-[var(--text-hi)] transition hover:bg-[var(--surface-3)]"
                >
                  Continue Reading → ({revealCount}/{lesson.body.length})
                </button>
              )}

              {allParasRevealed && hasExtras && (
                <div className="mt-2">
                  {lessonImages && lessonImages.length > 0 && <ImageGallery images={lessonImages} />}
                  {lesson.mockup && <VisualMockup mockup={lesson.mockup} />}
                  {lesson.flow && <FlowDiagramView flow={lesson.flow} />}
                  {lesson.proTip && (
                    <div className="mt-4 rounded-lg border border-[var(--primary)]/20 bg-[var(--primary)]/[0.05] px-4 py-3 text-sm text-[var(--text-mid)]">
                      <span className="mr-2 font-semibold text-[var(--primary)]">💡 Pro tip:</span>
                      {lesson.proTip}
                    </div>
                  )}
                  {!reviewedExtras && (
                    <button
                      onClick={handleReviewExtras}
                      className="mt-4 w-full rounded-md border border-[var(--primary)] bg-[var(--primary)]/10 px-5 py-3 text-sm font-semibold text-[var(--primary)] transition hover:bg-[var(--primary)]/15"
                    >
                      👆 I've reviewed this — Continue
                    </button>
                  )}
                </div>
              )}

              {allParasRevealed && !hasExtras && lesson.proTip && (
                <div className="mt-4 rounded-lg border border-[var(--primary)]/20 bg-[var(--primary)]/[0.05] px-4 py-3 text-sm text-[var(--text-mid)]">
                  <span className="mr-2 font-semibold text-[var(--primary)]">💡 Pro tip:</span>
                  {lesson.proTip}
                </div>
              )}

              <div className="mt-8 flex items-center justify-between border-t border-[var(--border)] pt-6">
                {prevLesson ? (
                  <Link
                    href={`/courses/${params.courseSlug}/${params.topicSlug}/${prevLesson.id}`}
                    className="rounded-md border border-[var(--border-strong)] bg-[var(--surface-2)] px-5 py-2.5 text-sm font-semibold text-[var(--text-hi)] transition hover:bg-[var(--surface-3)]"
                  >
                    ← Previous
                  </Link>
                ) : (
                  <span />
                )}

                {isDone ? (
                  <span className="rounded-md bg-[var(--surface-2)] px-5 py-2.5 text-sm font-semibold text-[var(--text-lo)]">
                    Completed ✓
                  </span>
                ) : user ? (
                  <button
                    onClick={handleComplete}
                    disabled={!canComplete || saving}
                    className={`rounded-md px-6 py-2.5 text-sm font-semibold shadow-sm transition ${
                      canComplete && !saving
                        ? "bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)]"
                        : "cursor-not-allowed bg-[var(--surface-3)] text-[var(--text-lo)]"
                    }`}
                  >
                    {saving ? "Saving…" : nextLesson ? "Complete & Continue →" : "Complete Topic →"}
                  </button>
                ) : (
                  <Link
                    href="/login"
                    className="rounded-md bg-[var(--primary)] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--primary-dark)]"
                  >
                    Sign in to continue →
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </TopicAccessGate>
    );
  }

  if (!cmsChecked) return null;
  if (!cmsSubtopic) notFound();

  const blocks = normalizeContentBlocks(cmsSubtopic.content_json);
  const isDone = completedIds.includes(cmsSubtopic.id);
  const idx = cmsSubtopicIds.indexOf(cmsSubtopic.id);
  const totalSubtopics = cmsSubtopicIds.length;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-center gap-1.5">
        {Array.from({ length: totalSubtopics }).map((_, i) => (
          <span
            key={i}
            className={`h-1.5 max-w-10 flex-1 rounded-full ${
              i <= idx ? "bg-[var(--primary)]" : "bg-[var(--surface-3)]"
            }`}
          />
        ))}
      </div>
      <p className="text-center text-xs text-[var(--text-lo)]">
        Subtopic {idx + 1} of {totalSubtopics}
      </p>

      {syncError && (
        <div className="rounded-lg border border-[var(--error)]/30 bg-[var(--error-soft)] px-4 py-3 text-sm text-[var(--error)]">
          ⚠️ {syncError}
        </div>
      )}

      <div className="glass-card glow-border rounded-2xl p-8">
        <h1 className="text-xl font-bold text-[var(--text-hi)] sm:text-2xl">{cmsSubtopic.title}</h1>
        <div className="mt-6">
          <CmsContentRenderer blocks={blocks} />
        </div>

        <div className="mt-8 flex items-center justify-between border-t border-[var(--border)] pt-6">
          <Link
            href={`/courses/${params.courseSlug}/${params.topicSlug}`}
            className="rounded-md border border-[var(--border-strong)] bg-[var(--surface-2)] px-5 py-2.5 text-sm font-semibold text-[var(--text-hi)] transition hover:bg-[var(--surface-3)]"
          >
            ← Back
          </Link>
          {isDone ? (
            <span className="rounded-md bg-[var(--surface-2)] px-5 py-2.5 text-sm font-semibold text-[var(--text-lo)]">
              Completed ✓
            </span>
          ) : user ? (
            <button
              onClick={handleComplete}
              disabled={saving}
              className="rounded-md bg-[var(--primary)] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--primary-dark)] disabled:opacity-60"
            >
              {saving ? "Saving…" : idx + 1 < totalSubtopics ? "Complete & Continue →" : "Complete Topic →"}
            </button>
          ) : (
            <Link
              href="/login"
              className="rounded-md bg-[var(--primary)] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--primary-dark)]"
            >
              Sign in to continue →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
