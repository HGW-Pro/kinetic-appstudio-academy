import Link from "next/link";
import { createSupabaseServerClient } from "../../../lib/supabase/server";
import type { CourseRecord } from "../../../lib/admin/types";
import CourseForm from "../../../components/admin/CourseForm";
import BulkImportForm from "../../../components/admin/BulkImportForm";
import MigrationButton from "../../../components/admin/MigrationButton";

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
          Create courses manually, or bulk-import one or many full courses (topics, subtopics, quizzes)
          from AI-generated JSON below.
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
                className="flex items-center gap-4 rounded-lg border border-slate-200 bg-white p-3 text-sm shadow-sm transition hover:border-slate-400"
              >
                {c.image_url ? (
                  <img
                    src={c.image_url}
                    alt={c.title}
                    className="h-14 w-14 shrink-0 rounded-md object-cover"
                  />
                ) : (
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md bg-slate-100 text-lg text-slate-300">
                    🖼️
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-slate-900">{c.title}</p>
                  <p className="text-xs text-slate-500">/{c.slug}</p>
                  {c.description ? (
                    <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">{c.description}</p>
                  ) : (
                    <p className="mt-0.5 text-xs italic text-slate-300">No description yet</p>
                  )}
                </div>
                <span className="shrink-0 text-slate-400">→</span>
              </Link>
            ))}
            {(!courses || courses.length === 0) && !error && (
              <p className="rounded-lg border border-dashed border-slate-300 px-4 py-6 text-center text-sm text-slate-400">
                No courses yet. Create one on the right, run the one-time migration below, or use
                Bulk Import.
              </p>
            )}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">New Course</h2>
          <CourseForm />
        </section>
      </div>

      {(!courses || courses.length === 0) && (
        <section>
          <MigrationButton />
        </section>
      )}

      <section>
        <BulkImportForm />
      </section>
    </div>
  );
}
