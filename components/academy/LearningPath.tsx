import { getLearningPathProgress } from "./learningPathState";
import LearningPathNode from "./LearningPathNode";
import type { LearningPathCourse } from "./learningPathTypes";
import type { ProgressState } from "../../lib/progress";

type LearningPathProps = {
  courses: LearningPathCourse[];
  progress: ProgressState;
  compact?: boolean;
};

export default function LearningPath({ courses, progress, compact = false }: LearningPathProps) {
  const items = getLearningPathProgress(courses, progress);

  if (items.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-[var(--border-strong)] px-4 py-6 text-sm text-[var(--text-mid)]">
        The learning path will appear when published courses are available.
      </p>
    );
  }

  const displayed = compact ? items.slice(0, 5) : items;
  return (
    <ol className={`relative ${compact ? "divide-y divide-[var(--border)]" : "divide-y divide-[var(--border)] border-l border-[var(--border)] pl-5"}`}>
      {displayed.map((item, index) => (
        <li key={item.course.id} className="relative">
          {!compact && <span aria-hidden="true" className="absolute -left-[29px] top-8 h-3 w-3 rounded-full border-2 border-[var(--surface)] bg-[var(--primary)]" />}
          <LearningPathNode item={item} sequence={index + 1} compact={compact} />
        </li>
      ))}
    </ol>
  );
}
