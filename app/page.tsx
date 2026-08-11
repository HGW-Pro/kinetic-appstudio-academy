import Link from "next/link";
import { courses } from "../lib/courses";

export default function HomePage() {
  return (
    <div className="space-y-12">
      <section className="hero-band relative overflow-hidden rounded-2xl px-6 py-16 text-center text-white sm:px-12">
        <span className="mx-auto mb-6 flex w-fit items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide">
          🎓 Employee Training Catalog
        </span>
        <h1 className="mx-auto max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
          Internal Certification Courses
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base text-white/85 sm:text-lg">
          Every course below is fully sequential: complete each Topic's subtopics in order to
          unlock the next, and pass a Topic's assignment to move on. No skipping ahead.
        </p>
      </section>

      <section>
        <h2 className="mb-6 text-2xl font-semibold text-[var(--text-hi)]">Available Courses</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {courses.map((course) => {
            const totalSubtopics = course.topics.reduce((n, t) => n + t.lessons.length, 0);
            const totalQuizQs = course.topics.reduce((n, t) => n + t.quiz.length, 0);
            return (
              <Link
                key={course.slug}
                href={`/courses/${course.slug}`}
                className="group glass-card glow-border flex flex-col justify-between rounded-2xl p-8 transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div>
                  <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-[var(--primary)] text-2xl text-white">
                    {course.icon}
                  </span>
                  <h3 className="mt-4 text-xl font-bold text-[var(--text-hi)] group-hover:text-[var(--primary)]">
                    {course.title}
                  </h3>
                  <p className="mt-2 text-sm text-[var(--text-mid)]">{course.tagline}</p>
                </div>
                <div className="mt-6 flex items-center justify-between text-xs text-[var(--text-lo)]">
                  <span>{course.topics.length} topics</span>
                  <span>{totalSubtopics} subtopics</span>
                  <span>{totalQuizQs} quiz Qs</span>
                  <span className="text-[var(--primary)] transition group-hover:translate-x-1">→</span>
                </div>
              </Link>
            );
          })}

          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[var(--border-strong)] p-8 text-center opacity-70">
            <span className="text-3xl">➕</span>
            <p className="mt-3 text-sm font-semibold text-[var(--text-hi)]">More courses coming soon</p>
            <p className="mt-1 text-xs text-[var(--text-mid)]">
              e.g. "BAQ to Updatable BAQ" — new courses plug into this same catalog.
            </p>
          </div>
        </div>
      </section>

      <section className="glass-card rounded-3xl p-8 text-center">
        <h2 className="text-2xl font-semibold text-[var(--text-hi)]">
          Ready to prove it? Try a real lab.
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-[var(--text-mid)]">
          Every course pairs with a hands-on lab in the Labs section, so you build actual
          Kinetic configurations — not just answer trivia.
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
