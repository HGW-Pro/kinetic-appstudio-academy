import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublicCourse, getPublicTopics } from "../../../lib/cms/queries";

export const revalidate = 0;

export default async function LibraryCoursePage({ params }: { params: { courseSlug: string } }) {
  const course = await getPublicCourse(params.courseSlug);
  if (!course) notFound();
  const topics = await getPublicTopics(course.id);

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-6 py-10">
      <div>
        <Link href="/library" className="text-sm text-[var(--text-lo)] hover:text-[var(--primary)]">
          ← All courses
        </Link>
        <h1 className="mt-1 text-2xl font-bold text-[var(--text-hi)]">{course.title}</h1>
        {course.description && <p className="mt-1 text-sm text-[var(--text-mid)]">{course.description}</p>}
      </div>

      <div className="space-y-2">
        {topics.map((t, i) => (
          <Link
            key={t.id}
            href={`/library/${course.slug}/${t.slug}`}
            className="glass-card flex items-center justify-between rounded-lg p-4 transition hover:border-[var(--primary)]"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--primary)] text-xs font-bold text-[var(--primary)]">
                {i + 1}
              </span>
              <span className="text-sm font-semibold text-[var(--text-hi)]">{t.title}</span>
            </div>
            <span className="text-[var(--text-lo)]">→</span>
          </Link>
        ))}
        {topics.length === 0 && (
          <p className="rounded-lg border border-dashed border-[var(--border-strong)] px-4 py-6 text-center text-sm text-[var(--text-lo)]">
            No topics published yet.
          </p>
        )}
      </div>
    </div>
  );
}
