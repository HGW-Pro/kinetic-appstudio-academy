import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "../../../lib/supabase/server";
import DangerZoneClient, { type CourseTree } from "../../../components/admin/DangerZoneClient";

export const dynamic = "force-dynamic";

export default async function DangerZonePage() {
  const supabase = createSupabaseServerClient();

  const { data: userData } = await supabase.auth.getUser();
  const user = userData?.user;
  if (!user) redirect("/login");

  const { data: employee } = await supabase
    .from("employees")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  if (!employee || employee.role !== "admin") redirect("/");

  const { data: courses } = await supabase
    .from("courses")
    .select("id, title, slug, is_published")
    .order("sequence_order", { ascending: true });

  const courseIds = (courses ?? []).map((c) => c.id);
  const { data: topics } = courseIds.length
    ? await supabase
        .from("topics")
        .select("id, course_id, title, slug, sequence_order")
        .in("course_id", courseIds)
        .order("sequence_order", { ascending: true })
    : { data: [] as { id: string; course_id: string; title: string; slug: string; sequence_order: number }[] };

  const topicIds = (topics ?? []).map((t) => t.id);
  const { data: subtopics } = topicIds.length
    ? await supabase
        .from("subtopics")
        .select("id, topic_id, title, sequence_order")
        .in("topic_id", topicIds)
        .order("sequence_order", { ascending: true })
    : { data: [] as { id: string; topic_id: string; title: string; sequence_order: number }[] };

  const subtopicIds = (subtopics ?? []).map((s) => s.id);
  const { data: quizzes } = subtopicIds.length
    ? await supabase.from("quizzes").select("id, subtopic_id").in("subtopic_id", subtopicIds)
    : { data: [] as { id: string; subtopic_id: string }[] };

  const quizBySubtopic = new Map((quizzes ?? []).map((q) => [q.subtopic_id, q.id]));

  const tree: CourseTree[] = (courses ?? []).map((c) => ({
    id: c.id,
    title: c.title,
    slug: c.slug,
    isPublished: c.is_published,
    topics: (topics ?? [])
      .filter((t) => t.course_id === c.id)
      .map((t) => ({
        id: t.id,
        title: t.title,
        slug: t.slug,
        subtopics: (subtopics ?? [])
          .filter((s) => s.topic_id === t.id)
          .map((s) => ({
            id: s.id,
            title: s.title,
            quizId: quizBySubtopic.get(s.id) ?? null,
          })),
      })),
  }));

  return (
    <div className="space-y-6 p-8">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-hi)]">Danger Zone</h1>
        <p className="mt-1 text-sm text-[var(--text-mid)]">
          Delete courses, topics, subtopics, and quizzes. Deleting a course removes every topic,
          subtopic, and quiz beneath it. This cannot be undone.
        </p>
      </div>
      <DangerZoneClient courses={tree} />
    </div>
  );
}
