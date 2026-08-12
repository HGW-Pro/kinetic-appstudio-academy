import Link from "next/link";
import { requireAdmin } from "../../lib/admin/guard";
import { ToastProvider } from "../../components/admin/ToastProvider";
import NavBar from "../../components/NavBar";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Authoritative server-side check. Every request to any /admin/* route
  // renders this layout first, so this single call protects the entire
  // admin section.
  const admin = await requireAdmin();

  return (
    <ToastProvider>
      {/* Same site-wide navigation (incl. Sign Out / auth state) shown on
          every other page. Previously this layout only rendered its own
          compact admin sub-header below, so signing in/out and the rest
          of the site's navigation were invisible while inside /admin. */}
      <NavBar />
      <div className="min-h-screen bg-slate-100">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <div className="flex items-center gap-6">
              <Link href="/admin/courses" className="text-lg font-bold text-slate-900">
                Kinetic Academy · Admin
              </Link>
              <nav className="flex gap-4 text-sm font-medium text-slate-600">
                <Link href="/admin/courses" className="hover:text-slate-900">
                  Courses
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-500">
              <span>{admin.email}</span>
              <Link href="/dashboard" className="rounded-md border border-slate-300 px-3 py-1.5 hover:bg-slate-50">
                Back to app
              </Link>
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
      </div>
    </ToastProvider>
  );
}
