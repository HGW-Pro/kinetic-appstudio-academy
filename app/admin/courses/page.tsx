import Link from "next/link";
import { createSupabaseServerClient } from "../../../lib/supabase/server";
import type { CourseRecord } from "../../../lib/admin/types";
import CourseForm from "../../../components/admin/CourseForm";
import BulkImportForm from "../../../components/admin/BulkImportForm";

export const dynamic = "force-dynamic";

export default async function AdminCoursesPage() {
  const supabase = createSupabaseServerClient();
  const { data: courses, error } = await supabase
    .from("courses")
    .select("*")
    .order("sequence_order", { ascending: true })
    .returns<CourseRecord[]>();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Courses</h1>
        <p className="mt-1 text-sm text-slate-500">
          Create courses manually, or bulk-import a full course (topics, subtopics, quizzes) from
          AI-generated JSON below.
        </p>
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Failed to load courses: {error.message}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Existing Courses ({courses?.length ?? 0})
          </h2>
          <div className="space-y-2">
            {(courses ?? []).map((c) => (
              <Link
                key={c.id}
                href={`/admin/courses/${c.id}`}
                className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm transition hover:border-slate-400"
              >
                <div>
                  <p className="font-semibold text-slate-900">{c.title}</p>
                  <p className="text-xs text-slate-500">/{c.slug}</p>
                </div>
                <span className="text-slate-400">→</span>
              </Link>
            ))}
            {(!courses || courses.length === 0) && !error && (
              <p className="rounded-lg border border-dashed border-slate-300 px-4 py-6 text-center text-sm text-slate-400">
                No courses yet. Create one on the right, or use Bulk Import below.
              </p>
            )}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">New Course</h2>
          <CourseForm />
        </section>
      </div>

      <section>
        <BulkImportForm />
      </section>
    </div>
  );
}
