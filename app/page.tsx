import Link from "next/link";
import { courses, totalSubtopics, totalCourseMinutes } from "../lib/courses";

export default function HomePage() {
  const mainCourse = courses.find((c) => !c.comingSoon) ?? courses[0];

  return (
    <div className="space-y-16">
      <section className="hero-band relative overflow-hidden rounded-2xl px-6 py-16 text-center text-white sm:px-12">
        <span className="mx-auto mb-6 flex w-fit items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide">
          🎓 Internal Certification Courses
        </span>
        <h1 className="mx-auto max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
          Kinetic Academy Course Catalog
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base text-white/85 sm:text-lg">
          Every course follows the same strict structure — Course → Main Topic → Subtopic — and
          unlocks one step at a time as you pass each assignment.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/courses"
            className="rounded-md bg-white px-6 py-3 text-sm font-semibold text-[var(--primary-dark)] shadow-sm transition hover:bg-white/90"
          >
            Browse Courses →
          </Link>
          <Link
            href="/dashboard"
            className="rounded-md border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
          >
            View My Progress
          </Link>
        </div>
        <div className="mx-auto mt-10 grid max-w-2xl grid-cols-3 gap-4 text-left">
          <Stat value={`${courses.filter((c) => !c.comingSoon).length}`} label="Live Courses" />
          <Stat value={`${totalCourseMinutes(mainCourse)}m`} label="Est. Time" />
          <Stat value={`${totalSubtopics(mainCourse)}`} label="Subtopics" />
        </div>
      </section>

      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-[var(--text-hi)]">Available Courses</h2>
          <p className="mt-1 text-sm text-[var(--text-mid)]">
            More courses (like BAQ to Updatable BAQ) will appear here as they're added — the
            catalog is built to grow.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {courses.map((course) => {
            const card = (
              <div
                className={`glass-card flex h-full flex-col justify-between rounded-2xl p-6 transition ${
                  course.comingSoon ? "opacity-60" : "hover:-translate-y-1 hover:shadow-lg"
                }`}
              >
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-3xl">{course.icon}</span>
                    {course.comingSoon ? (
                      <span className="badge-pill">Coming Soon</span>
                    ) : (
                      <span className="badge-pill">{course.topics.length} main topics</span>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-[var(--text-hi)]">{course.title}</h3>
                  <p className="mt-2 text-sm text-[var(--text-mid)]">{course.description}</p>
                </div>
                {!course.comingSoon && (
                  <div className="mt-5 flex items-center justify-between text-xs text-[var(--text-lo)]">
                    <span>{totalSubtopics(course)} subtopics</span>
                    <span>{totalCourseMinutes(course)} min</span>
                    <span className="text-[var(--primary)]">Start →</span>
                  </div>
                )}
              </div>
            );
            return course.comingSoon ? (
              <div key={course.slug} className="cursor-not-allowed">
                {card}
              </div>
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
          Every training track pairs with a hands-on lab in the Labs section, so you build actual
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

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-center">
      <p className="text-xl font-bold text-white">{value}</p>
      <p className="text-[11px] uppercase tracking-wide text-white/70">{label}</p>
    </div>
  );
}
