import Link from "next/link";
import { getPublicCourses } from "../../lib/cms/queries";

export const revalidate = 0;

export default async function LibraryIndexPage() {
  const courses = await getPublicCourses();

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-6 py-10">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-hi)]">Course Library</h1>
        <p className="mt-1 text-sm text-[var(--text-mid)]">
          Courses managed through the admin CMS.
        </p>
      </div>

      {courses.length === 0 ? (
        <p className="rounded-xl border border-dashed border-[var(--border-strong)] px-6 py-10 text-center text-sm text-[var(--text-lo)]">
          No courses published yet.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {courses.map((c) => (
            <Link
              key={c.id}
              href={`/library/${c.slug}`}
              className="glass-card flex gap-4 rounded-xl p-4 transition hover:border-[var(--primary)]"
            >
              {c.image_url ? (
                <img src={c.image_url} alt={c.title} className="h-20 w-20 shrink-0 rounded-lg object-cover" />
              ) : (
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-[var(--surface-2)] text-2xl">
                  📚
                </div>
              )}
              <div className="min-w-0">
                <p className="font-semibold text-[var(--text-hi)]">{c.title}</p>
                {c.description && (
                  <p className="mt-1 line-clamp-2 text-xs text-[var(--text-mid)]">{c.description}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
