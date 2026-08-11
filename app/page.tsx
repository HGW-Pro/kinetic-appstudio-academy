import Link from "next/link";
import { courses, totalLessonsInCourse, totalQuizQuestionsInCourse } from "../lib/courses";

export default function CourseCatalogPage() {
  return (
    <div className="space-y-10">
      <section className="hero-band relative overflow-hidden rounded-2xl px-6 py-14 text-center text-white sm:px-12">
        <span className="mx-auto mb-6 flex w-fit items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide">
          🎓 Internal Training Catalog
        </span>
        <h1 className="mx-auto max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
          Epicor Kinetic Training Catalog
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base text-white/85 sm:text-lg">
          Pick a course below. Every course is strictly sequential — Main Topics unlock one at a
          time, and each Main Topic breaks down into interactive Subtopics you click through
          rather than read as a wall of text.
        </p>
      </section>

      <section>
        <h2 className="mb-5 text-2xl font-semibold text-[var(--text-hi)]">Available Courses</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {courses.map((course) => {
            const totalLessons = totalLessonsInCourse(course);
            const totalQuiz = totalQuizQuestionsInCourse(course);
            const isEmpty = course.topics.length === 0;
            return (
              <div key={course.slug} className="glass-card glow-border flex flex-col rounded-2xl p-7">
                <div className="flex items-center gap-4">
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[var(--primary)] text-2xl text-white">
                    {course.icon}
                  </span>
                  <div>
                    <span className="badge-pill">Course</span>
                    <h3 className="mt-1 text-lg font-bold text-[var(--text-hi)]">{course.title}</h3>
                  </div>
                </div>
                <p className="mt-4 flex-1 text-sm text-[var(--text-mid)]">{course.tagline}</p>
                <div className="mt-5 flex flex-wrap gap-3 text-xs text-[var(--text-lo)]">
                  <span className="badge-pill">{course.topics.length} main topics</span>
                  <span className="badge-pill">{totalLessons} subtopics</span>
                  <span className="badge-pill">{totalQuiz} quiz Qs</span>
                </div>
                {isEmpty ? (
                  <span className="mt-6 inline-block rounded-md border border-[var(--border-strong)] bg-[var(--surface-2)] px-6 py-3 text-center text-sm font-semibold text-[var(--text-lo)]">
                    Coming Soon
                  </span>
                ) : (
                  <Link
                    href={`/courses/${course.slug}`}
                    className="mt-6 inline-block rounded-md bg-[var(--primary)] px-6 py-3 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--primary-dark)]"
                  >
                    View Course →
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className="glass-card rounded-3xl p-8 text-center">
        <h2 className="text-2xl font-semibold text-[var(--text-hi)]">
          Ready to prove it? Try a real lab.
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-[var(--text-mid)]">
          Every course pairs with hands-on labs so you build actual Kinetic configurations — not
          just answer trivia.
        </p>
        <Link
          href="/labs"
          className="mt-6 inline-block rounded-md border border-[var(--border-strong)] bg-[var(--surface-2)] px-6 py-3 text-sm font-semibold text-[var(--text-hi)] transition hover:bg-[var(--surface-3)]"
        >
          Explore Hands-On Labs →
        </Link>
      </section>
    </div>
  );
}
