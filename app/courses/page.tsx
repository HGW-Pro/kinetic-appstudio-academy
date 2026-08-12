import Link from "next/link";
import { getCmsCoursesWithStats } from "../../lib/cms/queries";

export const dynamic = "force-dynamic";

export default async function CoursesPage() {
  const courses = await getCmsCoursesWithStats();

  return (
    <div className="space-y-8">
      <section className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--primary)]">Curriculum</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[var(--text-hi)]">Courses</h1>
        <p className="mt-3 text-sm leading-6 text-[var(--text-mid)]">
          Follow the Kinetic Application Studio curriculum from foundations through practical, publish-ready work.
        </p>
      </section>

      {courses.length > 0 ? (
        <section aria-label="Published courses" className="grid gap-4 xl:grid-cols-2">
          {courses.map((course) => (
            <Link
              key={course.id}
              href={`/courses/${course.slug}`}
              className="group rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_1px_3px_rgba(16,24,40,0.05)] transition hover:-translate-y-0.5 hover:border-[var(--primary)]/30 hover:shadow-md"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[var(--primary)]/[0.09] text-[var(--primary)]">
                  {course.image_url ? <img src={course.image_url} alt="" className="h-full w-full object-cover" /> : <span className="text-lg">K</span>}
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg font-semibold text-[var(--text-hi)] transition group-hover:text-[var(--primary)]">{course.title}</h2>
                  {course.description && <p className="mt-1.5 line-clamp-2 text-sm leading-6 text-[var(--text-mid)]">{course.description}</p>}
                </div>
                <span aria-hidden="true" className="pt-1 text-[var(--text-lo)] transition group-hover:translate-x-0.5 group-hover:text-[var(--primary)]">→</span>
              </div>
              <div className="mt-5 flex flex-wrap gap-x-4 gap-y-1 border-t border-[var(--border)] pt-4 text-xs text-[var(--text-lo)]">
                <span>{course.topicCount} topics</span>
                <span>{course.subtopicCount} lessons</span>
                <span>{course.quizQuestionCount} knowledge-check questions</span>
              </div>
            </Link>
          ))}
        </section>
      ) : (
        <section className="rounded-xl border border-dashed border-[var(--border-strong)] bg-[var(--surface)] px-6 py-12 text-center">
          <h2 className="text-lg font-semibold text-[var(--text-hi)]">Courses are being prepared</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--text-mid)]">
            Published academy courses will appear here as soon as they are ready for learners.
          </p>
        </section>
      )}
    </div>
  );
}
