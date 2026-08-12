type LessonProgressProps = {
  completed: number;
  total: number;
  label?: string;
  compact?: boolean;
};

export default function LessonProgress({ completed, total, label = "Lesson progress", compact = false }: LessonProgressProps) {
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
  return (
    <div className={compact ? "min-w-[8rem]" : "w-full"}>
      {!compact && (
        <div className="mb-2 flex items-center justify-between gap-4 text-sm">
          <span className="font-semibold text-[var(--text-hi)]">{label}</span>
          <span className="font-semibold tabular-nums text-[var(--primary)]">{percent}%</span>
        </div>
      )}
      <div className="progress-track h-2" role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}>
        <div className="progress-fill" style={{ width: `${percent}%` }} />
      </div>
      {compact && <p className="mt-1 text-right text-xs font-semibold tabular-nums text-[var(--primary)]">{percent}%</p>}
    </div>
  );
}
