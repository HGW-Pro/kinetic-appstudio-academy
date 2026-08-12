import Link from "next/link";
import ProgressRing from "./ProgressRing";
import type { LearningPathCourseProgress } from "./learningPathTypes";

const statusCopy = {
  completed: { label: "Completed", mark: "✓", className: "bg-[var(--success-soft)] text-[var(--success)]" },
  current: { label: "In progress", mark: "●", className: "bg-[var(--primary)]/[0.1] text-[var(--primary)]" },
  upcoming: { label: "Upcoming", mark: "○", className: "bg-[var(--surface-2)] text-[var(--text-mid)]" },
  locked: { label: "Locked", mark: "🔒", className: "bg-[var(--surface-2)] text-[var(--text-lo)]" },
} as const;

type LearningPathNodeProps = {
  item: LearningPathCourseProgress;
  sequence: number;
  compact?: boolean;
};

export default function LearningPathNode({ item, sequence, compact = false }: LearningPathNodeProps) {
  const { course, status, completion, totalLessons, prerequisiteTitle } = item;
  const state = statusCopy[status];
  const canOpen = status !== "locked";
  const body = (
    <div
      className={`group relative flex gap-4 ${compact ? "py-2" : "py-5"} ${
        canOpen ? "transition hover:bg-[var(--surface-2)]/60" : ""
      }`}
    >
      <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--border-strong)] bg-[var(--surface)] text-xs font-bold text-[var(--primary)]">
        {String(sequence).padStart(2, "0")}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <h3 className={`font-semibold ${canOpen ? "group-hover:text-[var(--primary)]" : ""} text-[var(--text-hi)]`}>
            {course.title}
          </h3>
          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${state.className}`}>
            <span aria-hidden="true">{state.mark}</span>{state.label}
          </span>
        </div>
        {!compact && course.description && (
          <p className="mt-1.5 max-w-3xl text-sm leading-6 text-[var(--text-mid)]">{course.description}</p>
        )}
        {!compact && (
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--text-lo)]">
            <span>{course.topicCount} {course.topicCount === 1 ? "topic" : "topics"}</span>
            <span>{totalLessons} {totalLessons === 1 ? "lesson" : "lessons"}</span>
            {course.estMinutes !== null && <span>~{course.estMinutes} min</span>}
            {course.difficulty && <span>{course.difficulty}</span>}
            {status === "locked" && prerequisiteTitle && <span>Complete {prerequisiteTitle} to unlock</span>}
            {status === "locked" && !prerequisiteTitle && <span>Complete the earlier course to unlock</span>}
          </div>
        )}
        {compact && (
          <p className="mt-1 text-xs text-[var(--text-lo)]">
            {status === "locked" ? "Locked" : `${completion}% complete`}
          </p>
        )}
      </div>
      {!compact && <ProgressRing value={completion} label={`${course.title} completion`} size={62} />}
      {compact && <span aria-hidden="true" className="self-center text-[var(--text-lo)]">{canOpen ? "→" : ""}</span>}
    </div>
  );

  if (!canOpen) return <article className="cursor-default" aria-label={`${course.title}, locked. Preview only.`}>{body}</article>;

  return (
    <Link href={`/courses/${course.slug}`} className="block rounded-lg px-3 -mx-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]">
      {body}
    </Link>
  );
}
