import { createBrowserClient } from "@supabase/ssr";

// Browser-side Supabase client for Client Components (e.g. ImageUploader,
// which needs to stream a File directly to Storage from the browser rather
// than proxying binary data through a Server Action).
export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
