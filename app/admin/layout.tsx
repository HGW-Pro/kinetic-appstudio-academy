import Link from "next/link";
import { requireAdmin } from "../../lib/admin/guard";
import { ToastProvider } from "../../components/admin/ToastProvider";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // This server-side check protects every route in the admin section.
  const admin = await requireAdmin();

  return (
    <ToastProvider>
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
