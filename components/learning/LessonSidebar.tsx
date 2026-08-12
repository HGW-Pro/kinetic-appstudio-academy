import Link from "next/link";

type Lesson = { id: string; title: string; estMinutes: number };

type LessonSidebarProps = {
  courseTitle: string;
  courseSlug: string;
  topicTitle: string;
  topicSlug: string;
  lessons: Lesson[];
  currentLessonId: string;
  completedIds: string[];
  allowLesson: (index: number) => boolean;
};

function statusFor(index: number, id: string, currentLessonId: string, completedIds: string[], unlocked: boolean) {
  if (completedIds.includes(id)) return { icon: "✓", label: "Completed", className: "bg-[var(--success-soft)] text-[var(--success)]" };
  if (id === currentLessonId) return { icon: "●", label: "Current lesson", className: "bg-[var(--primary)]/[0.1] text-[var(--primary)]" };
  if (!unlocked) return { icon: "🔒", label: "Locked", className: "bg-[var(--surface-2)] text-[var(--text-lo)]" };
  return { icon: "○", label: "Upcoming", className: "bg-[var(--surface-2)] text-[var(--text-mid)]" };
}

export default function LessonSidebar(props: LessonSidebarProps) {
  const { courseTitle, courseSlug, topicTitle, topicSlug, lessons, currentLessonId, completedIds, allowLesson } = props;
  return (
    <aside className="border-b border-[var(--border)] bg-[var(--surface)] lg:sticky lg:top-16 lg:max-h-[calc(100vh-4rem)] lg:w-72 lg:shrink-0 lg:self-start lg:overflow-y-auto lg:border-b-0 lg:border-r">
      <div className="p-4 sm:p-5">
        <Link href={`/courses/${courseSlug}`} className="text-xs font-semibold uppercase tracking-[0.13em] text-[var(--primary)] hover:underline">
          Course
        </Link>
        <p className="mt-1 text-sm font-semibold text-[var(--text-hi)]">{courseTitle}</p>
        <Link href={`/courses/${courseSlug}/${topicSlug}`} className="mt-4 block text-sm font-semibold text-[var(--text-hi)] hover:text-[var(--primary)] hover:underline">
          {topicTitle}
        </Link>
        <ol className="mt-3 space-y-1" aria-label="Lessons in this topic">
          {lessons.map((lesson, index) => {
            const unlocked = allowLesson(index);
            const status = statusFor(index, lesson.id, currentLessonId, completedIds, unlocked);
            const current = lesson.id === currentLessonId;
            const row = (
              <span className={`flex min-h-11 items-center gap-3 rounded-md px-2.5 py-2 text-left text-sm ${current ? "bg-[var(--primary)]/[0.08] font-semibold text-[var(--primary)]" : "text-[var(--text-mid)]"}`}>
                <span aria-label={status.label} title={status.label} className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${status.className}`}>
                  {status.icon}
                </span>
                <span className="min-w-0 flex-1 truncate">{lesson.title}</span>
                <span className="shrink-0 text-xs font-medium text-[var(--text-lo)]">{lesson.estMinutes}m</span>
              </span>
            );
            return <li key={lesson.id}>{unlocked ? <Link href={`/courses/${courseSlug}/${topicSlug}/${lesson.id}`} aria-current={current ? "page" : undefined}>{row}</Link> : row}</li>;
          })}
        </ol>
      </div>
    </aside>
  );
}
