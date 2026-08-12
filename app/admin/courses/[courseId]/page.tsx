import { notFound } from "next/navigation";
import Link from "next/link";
import { createSupabaseServerClient } from "../../../../lib/supabase/server";
import type { CourseRecord, TopicRecord, SubtopicRecord, QuizRecord } from "../../../../lib/admin/types";
import CourseForm from "../../../../components/admin/CourseForm";
import CourseDetailClient from "../../../../components/admin/CourseDetailClient";
import RecoverMissingModulesButton from "../../../../components/admin/RecoverMissingModulesButton";

export const dynamic = "force-dynamic";

export default async function AdminCourseDetailPage({ params }: { params: { courseId: string } }) {
  const supabase = createSupabaseServerClient();

  const { data: course } = await supabase
    .from("courses")
    .select("*")
    .eq("id", params.courseId)
    .single<CourseRecord>();

  if (!course) notFound();

  const { data: topics } = await supabase
    .from("topics")
    .select("*")
    .eq("course_id", params.courseId)
    .order("sequence_order", { ascending: true })
    .returns<TopicRecord[]>();

  const topicIds = (topics ?? []).map((t) => t.id);

  const { data: subtopics } = topicIds.length
    ? await supabase
        .from("subtopics")
        .select("*")
        .in("topic_id", topicIds)
        .order("sequence_order", { ascending: true })
        .returns<SubtopicRecord[]>()
    : { data: [] as SubtopicRecord[] };

  const subtopicIds = (subtopics ?? []).map((s) => s.id);

  const { data: quizzes } = subtopicIds.length
    ? await supabase.from("quizzes").select("*").in("subtopic_id", subtopicIds).returns<QuizRecord[]>()
    : { data: [] as QuizRecord[] };

  return (
    <div className="space-y-8">
      <div>
        <Link href="/admin/courses" className="text-sm text-slate-500 hover:text-slate-800">
          ← All courses
        </Link>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">{course.title}</h1>
        <p className="text-sm text-slate-500">/{course.slug}</p>
      </div>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Course Details</h2>
        <CourseForm course={course} />
      </section>

      <section className="space-y-3">
        <RecoverMissingModulesButton courseSlug={course.slug} />
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Topics, Subtopics & Quizzes
        </h2>
        <CourseDetailClient
          courseId={course.id}
          topics={topics ?? []}
          subtopics={subtopics ?? []}
          quizzes={quizzes ?? []}
        />
      </section>
    </div>
  );
}
