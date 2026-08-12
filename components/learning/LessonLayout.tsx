import type { ReactNode } from "react";
import Link from "next/link";
import CompletionFooter from "./CompletionFooter";
import LessonProgress from "./LessonProgress";
import LessonSidebar from "./LessonSidebar";
import KineticTutor from "./KineticTutor";

type Lesson = { id: string; title: string; estMinutes: number };

type LessonLayoutProps = {
  courseTitle: string;
  courseSlug: string;
  topicTitle: string;
  topicSlug: string;
  topicEstMinutes: number;
  prerequisiteName?: string | null;
  lessons: Lesson[];
  currentLessonId: string;
  completedIds: string[];
  isSignedIn: boolean;
  isSaving: boolean;
  onComplete: () => void;
  error?: string | null;
  children: ReactNode;
};

export default function LessonLayout(props: LessonLayoutProps) {
  const { courseTitle, courseSlug, topicTitle, topicSlug, topicEstMinutes, prerequisiteName, lessons, currentLessonId, completedIds, isSignedIn, isSaving, onComplete, error, children } = props;
  const currentIndex = lessons.findIndex((lesson) => lesson.id === currentLessonId);
  const currentLesson = lessons[currentIndex];
  const previous = currentIndex > 0 ? lessons[currentIndex - 1] : undefined;
  const next = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : undefined;
  const isDone = completedIds.includes(currentLessonId);
  const completedCount = lessons.filter((lesson) => completedIds.includes(lesson.id)).length;
  const allowLesson = (index: number) => index <= Math.min(completedIds.length, lessons.length - 1) || lessons[index]?.id === currentLessonId;
  const lessonPosition = `${currentIndex + 1} / ${lessons.length}`;
  const topicProgress = lessons.length ? Math.round((completedCount / lessons.length) * 100) : 0;

  return (
    <div className="overflow-hidden border border-[var(--border)] bg-[var(--surface)] shadow-sm lg:grid lg:grid-cols-[18rem_minmax(0,1fr)]">
      <LessonSidebar courseTitle={courseTitle} courseSlug={courseSlug} topicTitle={topicTitle} topicSlug={topicSlug} lessons={lessons} currentLessonId={currentLessonId} completedIds={completedIds} allowLesson={allowLesson} />
      <div className="min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border)] bg-[var(--surface-2)] px-5 py-4 sm:px-8">
          <div>
            <Link href={`/courses/${courseSlug}/${topicSlug}`} className="text-xs font-semibold uppercase tracking-[0.13em] text-[var(--primary)] hover:underline">{topicTitle}</Link>
            <p className="mt-1 text-sm font-medium text-[var(--text-mid)]">Lesson {lessonPosition} · {currentLesson?.estMinutes ?? 5} min</p>
          </div>
          <div className="flex items-center gap-5">
            <span className="text-sm font-semibold tabular-nums text-[var(--text-hi)]">{lessonPosition}</span>
            <LessonProgress completed={completedCount} total={lessons.length} label="Topic progress" compact />
          </div>
        </div>
        <article className="mx-auto w-full max-w-4xl px-5 py-8 sm:px-8 sm:py-10">
          <header className="border-b border-[var(--border)] pb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.13em] text-[var(--primary)]">Focused lesson</p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-[var(--text-hi)] sm:text-3xl">{currentLesson?.title}</h1>
            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs font-medium text-[var(--text-mid)]">
              <span>{topicEstMinutes} min topic</span>
              {prerequisiteName && <span>Prerequisite: {prerequisiteName}</span>}
              <span className={isDone ? "text-[var(--success)]" : "text-[var(--text-lo)]"}>{isDone ? "Completed" : `In progress · ${topicProgress}%`}</span>
            </div>
          </header>
          {error && <p role="alert" className="mt-6 rounded-lg border border-[var(--error)]/30 bg-[var(--error-soft)] px-4 py-3 text-sm text-[var(--error)]">{error}</p>}
          <div className="mt-8">{children}</div>
          <KineticTutor className="mt-8" lessonTitle={currentLesson?.title ?? "this lesson"} topicTitle={topicTitle} />
          <CompletionFooter previousHref={previous ? `/courses/${courseSlug}/${topicSlug}/${previous.id}` : undefined} nextHref={next && isDone ? `/courses/${courseSlug}/${topicSlug}/${next.id}` : undefined} topicHref={`/courses/${courseSlug}/${topicSlug}`} isDone={isDone} isSignedIn={isSignedIn} isSaving={isSaving} onComplete={onComplete} isFinalLesson={!next} />
        </article>
      </div>
    </div>
  );
}
