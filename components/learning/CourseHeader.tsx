import type { ReactNode } from "react";

type CourseHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string | null;
  metadata?: ReactNode;
  action?: ReactNode;
};

export default function CourseHeader({ eyebrow, title, description, metadata, action }: CourseHeaderProps) {
  return (
    <header className="border-b border-[var(--border)] pb-7 sm:pb-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          {eyebrow && <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--primary)]">{eyebrow}</p>}
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-[var(--text-hi)] sm:text-3xl">{title}</h1>
          {description && <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--text-mid)]">{description}</p>}
          {metadata && <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs font-medium text-[var(--text-mid)]">{metadata}</div>}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </header>
  );
}
