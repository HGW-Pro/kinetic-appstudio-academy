import Link from "next/link";
import { courses, totalSubtopics, totalCourseMinutes } from "../../lib/courses";

export default function CourseCatalogPage() {
  return (
    <div className="space-y-8">
      <div>
        <span className="badge-pill">📚 Course Catalog</span>
        <h1 className="mt-4 text-3xl font-bold text-[var(--text-hi)]">Courses</h1>
        <p className="mt-2 max-w-2xl text-sm text-[var(--text-mid)]">
          Each course is a strict Course → Main Topic → Subtopic hierarchy. Complete subtopics in
          order to unlock the next one — no skipping ahead.
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
                    <span className="badge-pill">{course.topics.length} topics</span>
                  )}
                </div>
                <h2 className="text-lg font-semibold text-[var(--text-hi)]">{course.title}</h2>
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
    </div>
  );
}
