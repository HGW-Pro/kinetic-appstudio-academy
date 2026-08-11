import Link from "next/link";
import { courses } from "../lib/courses";

export default function HomePage() {
  return (
    <div className="space-y-12">
      <section className="hero-band relative overflow-hidden rounded-2xl px-6 py-14 text-center text-white sm:px-12">
        <span className="mx-auto mb-6 flex w-fit items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide">
          🎓 Internal Training Catalog
        </span>
        <h1 className="mx-auto max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
          Epicor Training Catalog
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base text-white/85 sm:text-lg">
          Pick a course below. Every course is a strict, sequential path — topics and their
          subtopics unlock one at a time as you complete and pass each assignment.
        </p>
      </section>

      <section>
        <h2 className="mb-6 text-2xl font-semibold text-[var(--text-hi)]">Available Courses</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {courses.map((course) => {
            const comingSoon = course.status === "coming-soon";
            const totalSubtopics = course.topics.reduce((n, t) => n + t.lessons.length, 0);
            const totalMinutes = course.topics.reduce((n, t) => n + t.estMinutes, 0);

            const card = (
              <div
                className={`glass-card flex h-full flex-col justify-between rounded-2xl p-7 transition ${
                  comingSoon ? "opacity-60" : "hover:-translate-y-1 hover:shadow-lg"
                }`}
              >
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-[var(--primary)] text-2xl text-white">
                      {course.icon}
                    </span>
                    <span className="badge-pill">{comingSoon ? "Coming Soon" : "Available"}</span>
                  </div>
                  <h3 className="text-xl font-bold text-[var(--text-hi)]">{course.title}</h3>
                  <p className="mt-2 text-sm text-[var(--text-mid)]">{course.tagline}</p>
                </div>
                <div className="mt-6 flex items-center justify-between text-xs text-[var(--text-lo)]">
                  <span>{course.topics.length} topics</span>
                  <span>{totalSubtopics} subtopics</span>
                  <span>{totalMinutes}m total</span>
                </div>
              </div>
            );

            return comingSoon ? (
              <div key={course.slug}>{card}</div>
            ) : (
              <Link key={course.slug} href={`/courses/${course.slug}`}>
                {card}
              </Link>
            );
          })}
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
