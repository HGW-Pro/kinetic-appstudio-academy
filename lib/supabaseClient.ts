import { createBrowserClient } from "@supabase/ssr";

// Shared Supabase client used throughout the app (AuthProvider, LessonList,
// TopicPage, QuizEngine, etc. all import `supabase` from this file).
//
// This now uses @supabase/ssr's createBrowserClient instead of plain
// @supabase/supabase-js createClient. The API surface is identical (same
// .auth, .from(), .storage, .rpc() methods) so no other file needs to
// change — but the session is now persisted in cookies instead of
// localStorage. That's required so server-side code (Server Components,
// Server Actions, middleware — used by the /admin dashboard) can actually
// see who's signed in. Previously, signing in only wrote to localStorage,
// which the server can never read, so requireAdmin() always saw "no
// session" and bounced back to /login no matter what.
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
