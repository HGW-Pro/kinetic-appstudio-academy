import "server-only";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "../supabase/server";

export interface AdminSession {
  userId: string;
  email: string;
}

// Server-side authorization guard. Call this at the top of every admin
// Server Component / Server Action / Route Handler that must be restricted
// to admins. Redirects unauthenticated users to /login and unauthorized
// (non-admin) authenticated users to /dashboard with an error flag —
// never renders admin content or performs an admin mutation for either case.
export async function requireAdmin(): Promise<AdminSession> {
  const supabase = createSupabaseServerClient();

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    redirect("/login?next=/admin/courses");
  }

  const { data: employee, error: employeeError } = await supabase
    .from("employees")
    .select("role")
    .eq("id", userData.user!.id)
    .single();

  if (employeeError || !employee || employee.role !== "admin") {
    redirect("/dashboard?error=not_authorized");
  }

  return { userId: userData.user!.id, email: userData.user!.email ?? "" };
}

// Non-redirecting variant for Server Actions, where throwing/returning a
// typed error is more appropriate than a redirect (the client needs to
// display the failure, not be silently navigated away mid-form-submit).
export async function assertAdminOrThrow(): Promise<AdminSession> {
  const supabase = createSupabaseServerClient();

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    throw new Error("UNAUTHENTICATED");
  }

  const { data: employee, error: employeeError } = await supabase
    .from("employees")
    .select("role")
    .eq("id", userData.user.id)
    .single();

  if (employeeError || !employee || employee.role !== "admin") {
    throw new Error("NOT_AUTHORIZED");
  }

  return { userId: userData.user.id, email: userData.user.email ?? "" };
}
