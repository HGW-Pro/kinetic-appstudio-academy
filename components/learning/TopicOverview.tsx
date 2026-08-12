import Link from "next/link";
import type { ReactNode } from "react";
import CourseHeader from "./CourseHeader";
import LessonProgress from "./LessonProgress";

type TopicLesson = { id: string; title: string; estMinutes: number };

type TopicAssessment = { questionCount: number; unlocked: boolean; passed: boolean; href: string };

type TopicOverviewProps = {
  courseSlug: string;
  courseTitle: string;
  topicSlug: string;
  title: string;
  description: string;
  difficulty: string;
  estMinutes: number;
  prerequisiteName?: string | null;
  objectives: string[];
  lessons: TopicLesson[];
  completedIds: string[];
  isSignedIn: boolean;
  isEnrolled: boolean;
  isCertified: boolean;
  onContinue: () => void;
  isContinuing: boolean;
  continueLabel?: string;
  assessment?: TopicAssessment | null;
  challenge?: ReactNode;
  practicalMilestone?: ReactNode;
};

export default function TopicOverview(props: TopicOverviewProps) {
  const { courseSlug, courseTitle, topicSlug, title, description, difficulty, estMinutes, prerequisiteName, objectives, lessons, completedIds, isSignedIn, isEnrolled, isCertified, onContinue, isContinuing, continueLabel, assessment, challenge, practicalMilestone } = props;
  const completedCount = lessons.filter((lesson) => completedIds.includes(lesson.id)).length;
  const progress = lessons.length ? Math.round((completedCount / lessons.length) * 100) : 0;
  const hasNextStep = lessons.length > 0 || Boolean(assessment);
  const canOpen = (index: number) => isSignedIn && isEnrolled && index <= Math.min(completedIds.length, lessons.length - 1);

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <CourseHeader
        eyebrow={`${courseTitle} · Topic`}
        title={title}
        description={description}
        metadata={<><span>{difficulty}</span><span>{estMinutes} min</span><span>{prerequisiteName ? `Prerequisite: ${prerequisiteName}` : "Prerequisite: None"}</span>{isCertified && <span className="text-[var(--success)]">✓ Certified</span>}</>}
      />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <section aria-labelledby="learning-objectives-heading">
          <h2 id="learning-objectives-heading" className="text-lg font-semibold text-[var(--text-hi)]">What you&apos;ll learn</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2" role="list">
            {objectives.map((objective, index) => <li key={`${objective}-${index}`} className="flex gap-3 text-sm leading-6 text-[var(--text-mid)]"><span aria-hidden="true" className="mt-1 text-[var(--primary)]">✓</span><span>{objective}</span></li>)}
          </ul>
        </section>
        <section aria-label="Topic progress" className="border-l-2 border-[var(--primary)] pl-5">
          <LessonProgress completed={completedCount} total={lessons.length} label="Topic progress" />
          <p className="mt-3 text-sm text-[var(--text-mid)]">{completedCount} of {lessons.length} lessons completed</p>
        </section>
      </div>

      <section aria-labelledby="lessons-heading" className="border-t border-[var(--border)] pt-7">
        <div className="flex items-end justify-between gap-4"><div><h2 id="lessons-heading" className="text-lg font-semibold text-[var(--text-hi)]">Lessons</h2><p className="mt-1 text-sm text-[var(--text-mid)]">A focused path through this topic.</p></div><span className="text-sm font-semibold text-[var(--primary)]">{progress}% complete</span></div>
        <ol className="mt-4 divide-y divide-[var(--border)] border-y border-[var(--border)]">
          {lessons.map((lesson, index) => {
            const isDone = completedIds.includes(lesson.id);
            const isCurrent = !isDone && index === Math.min(completedIds.length, Math.max(lessons.length - 1, 0));
            const isLocked = !isSignedIn || !isEnrolled || index > Math.min(completedIds.length, lessons.length - 1);
            const icon = isDone ? "✓" : isLocked ? "🔒" : isCurrent ? "●" : "○";
            const label = isDone ? "Completed" : isLocked ? "Locked" : isCurrent ? "Current lesson" : "Upcoming";
            const row = <span className={`flex min-h-14 items-center gap-4 px-1 py-3 ${isLocked ? "text-[var(--text-lo)]" : "text-[var(--text-hi)]"}`}><span aria-label={label} title={label} className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold ${isDone ? "bg-[var(--success-soft)] text-[var(--success)]" : isCurrent ? "bg-[var(--primary)]/[0.1] text-[var(--primary)]" : "bg-[var(--surface-2)] text-[var(--text-lo)]"}`}>{icon}</span><span className="min-w-0 flex-1 text-sm font-semibold">{lesson.title}</span><span className="text-xs font-medium text-[var(--text-lo)]">{lesson.estMinutes} min</span></span>;
            return <li key={lesson.id}>{canOpen(index) ? <Link href={`/courses/${courseSlug}/${topicSlug}/${lesson.id}`} className="block hover:bg-[var(--surface-2)]">{row}</Link> : row}</li>;
          })}
        </ol>
      </section>

      {assessment && assessment.questionCount > 0 && (
        <section aria-label="Topic assessment" className="border border-[var(--border)] bg-[var(--surface)] px-5 py-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <span aria-hidden="true" className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-base ${assessment.passed ? "bg-[var(--success-soft)] text-[var(--success)]" : assessment.unlocked ? "bg-[var(--primary)]/[0.1] text-[var(--primary)]" : "bg-[var(--surface-2)] text-[var(--text-lo)]"}`}>{assessment.passed ? "✓" : assessment.unlocked ? "📝" : "🔒"}</span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.13em] text-[var(--primary)]">Topic assessment</p>
                <h2 className="mt-1 text-lg font-semibold text-[var(--text-hi)]">{assessment.passed ? "Assessment passed" : "Check your knowledge"}</h2>
                <p className="mt-1 text-sm text-[var(--text-mid)]">{assessment.questionCount} questions · Instant feedback · 80% required to pass</p>
              </div>
            </div>
            {isSignedIn && assessment.unlocked ? (
              <Link href={assessment.href} className="inline-flex min-h-10 items-center justify-center rounded-md bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[var(--primary-dark)]">
                {assessment.passed ? "Retake assessment →" : "Take the assessment →"}
              </Link>
            ) : (
              <span className="text-sm text-[var(--text-lo)]">{isSignedIn ? "Complete all lessons to unlock" : "Sign in and complete all lessons to unlock"}</span>
            )}
          </div>
        </section>
      )}

      {practicalMilestone && <section className="border-l-4 border-[var(--primary)] bg-[var(--primary)]/[0.05] px-5 py-5" aria-label="Practical lab">{practicalMilestone}</section>}

      {challenge && <section className="border-l-4 border-[var(--accent)] bg-[var(--accent-soft)] px-5 py-4" aria-label="Practical challenge">{challenge}</section>}

      <div className="flex justify-end border-t border-[var(--border)] pt-6">
        {isSignedIn ? <button type="button" onClick={onContinue} disabled={isContinuing || !hasNextStep} className="inline-flex min-h-11 items-center justify-center rounded-md bg-[var(--primary)] px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[var(--primary-dark)] disabled:cursor-wait disabled:opacity-70">{isContinuing ? "Preparing…" : continueLabel ?? "Continue Learning →"}</button> : <Link href="/login" className="inline-flex min-h-11 items-center justify-center rounded-md bg-[var(--primary)] px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[var(--primary-dark)]">Continue Learning →</Link>}
      </div>
    </div>
  );
}
