import type { SkillProgressItem } from "./learningPathTypes";

type SkillProgressProps = {
  items: SkillProgressItem[];
  source: "skills" | "course-proxy" | "empty";
  compact?: boolean;
};

export default function SkillProgress({ items, source, compact = false }: SkillProgressProps) {
  if (source === "empty") {
    return (
      <section aria-labelledby="skills-heading">
        <h2 id="skills-heading" className="text-lg font-semibold text-[var(--text-hi)]">Your skills</h2>
        <p className="mt-2 text-sm leading-6 text-[var(--text-mid)]">
          Skill tracking will appear here when skill definitions and progress are available.
        </p>
      </section>
    );
  }

  return (
    <section aria-labelledby="skills-heading">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 id="skills-heading" className="text-lg font-semibold text-[var(--text-hi)]">Your skills</h2>
        {source === "skills" && (
          <p className="text-xs text-[var(--text-lo)]">Based on completed tagged lessons and assessments</p>
        )}
        {source === "course-proxy" && (
          <p className="text-xs text-[var(--text-lo)]">Course progress until skill tracking is configured</p>
        )}
      </div>
      <div className={`mt-4 ${compact ? "space-y-3" : "space-y-4"}`}>
        {items.map((item) => (
          <div key={item.id}>
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="font-medium text-[var(--text-hi)]">{item.name}</span>
              <span className="tabular-nums text-[var(--text-lo)]">{item.percentage}%</span>
            </div>
            <div
              className="progress-track mt-2 h-2"
              role="progressbar"
              aria-label={`${item.name} progress`}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={item.percentage}
            >
              <div className="progress-fill h-full" style={{ width: `${item.percentage}%` }} />
            </div>
            {source === "skills" && item.taggedUnitCount === 0 && (
              <p className="mt-1 text-xs text-[var(--text-lo)]">No curriculum lessons are tagged with this skill yet.</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
