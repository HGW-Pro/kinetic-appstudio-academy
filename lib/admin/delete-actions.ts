"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "../supabase/server";

// Defense in depth: the DB already enforces is_admin(auth.uid()) via RLS on
// every DELETE for courses/topics/subtopics/quizzes, so a non-admin caller
// gets rejected by Postgres even if this check were ever bypassed. This
// check exists purely to fail fast with a clean error message instead of a
// raw Postgres RLS error bubbling up to the UI.
async function assertAdmin() {
  const supabase = createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();
  const user = userData?.user;
  if (!user) throw new Error("You must be signed in.");

  const { data: employee, error } = await supabase
    .from("employees")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (error || !employee || employee.role !== "admin") {
    throw new Error("Admin access required.");
  }
  return supabase;
}

export interface DeleteResult {
  error: string | null;
}

// Deletes a course. FK is ON DELETE CASCADE down through topics ->
// subtopics -> quizzes, so this single delete removes the entire course
// tree in one atomic statement.
export async function deleteCourseAction(courseId: string): Promise<DeleteResult> {
  try {
    const supabase = await assertAdmin();
    const { error } = await supabase.from("courses").delete().eq("id", courseId);
    if (error) return { error: error.message };
    revalidatePath("/admin/courses");
    revalidatePath("/admin/danger-zone");
    revalidatePath("/courses");
    return { error: null };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Delete failed." };
  }
}

// Deletes a topic. Cascades to its subtopics and their quizzes. courseId is
// used only to revalidate the specific /admin/courses/[courseId] detail
// page so the topic list updates instantly without a hard refresh.
export async function deleteTopicAction(topicId: string, courseId: string): Promise<DeleteResult> {
  try {
    const supabase = await assertAdmin();
    const { error } = await supabase.from("topics").delete().eq("id", topicId);
    if (error) return { error: error.message };
    revalidatePath(`/admin/courses/${courseId}`);
    revalidatePath("/admin/courses");
    revalidatePath("/admin/danger-zone");
    revalidatePath("/courses");
    return { error: null };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Delete failed." };
  }
}

// Deletes a subtopic. Cascades to its linked quiz (subtopic_id is a unique
// FK on quizzes, so at most one quiz row is removed). courseId is used only
// to revalidate the specific course detail page.
export async function deleteSubtopicAction(subtopicId: string, courseId: string): Promise<DeleteResult> {
  try {
    const supabase = await assertAdmin();
    const { error } = await supabase.from("subtopics").delete().eq("id", subtopicId);
    if (error) return { error: error.message };
    revalidatePath(`/admin/courses/${courseId}`);
    revalidatePath("/admin/courses");
    revalidatePath("/admin/danger-zone");
    revalidatePath("/courses");
    return { error: null };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Delete failed." };
  }
}

// Deletes a single quiz without touching its parent subtopic -- useful for
// clearing a bad quiz so it can be re-authored from scratch.
export async function deleteQuizAction(quizId: string): Promise<DeleteResult> {
  try {
    const supabase = await assertAdmin();
    const { error } = await supabase.from("quizzes").delete().eq("id", quizId);
    if (error) return { error: error.message };
    revalidatePath("/admin/courses");
    revalidatePath("/admin/danger-zone");
    revalidatePath("/courses");
    return { error: null };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Delete failed." };
  }
}
