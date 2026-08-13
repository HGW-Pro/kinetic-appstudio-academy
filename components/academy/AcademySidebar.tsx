"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../AuthProvider";
import { useIsAdmin } from "../useIsAdmin";

type IconName = "home" | "path" | "courses" | "challenge" | "labs" | "glossary" | "progress" | "admin" | "logout";

const navigation: { label: string; href?: string; icon: IconName; comingSoon?: boolean }[] = [
  { label: "Home", href: "/dashboard", icon: "home" },
  { label: "Learning Path", href: "/learning-path", icon: "path" },
  { label: "Courses", href: "/courses", icon: "courses" },
  { label: "Challenges", href: "/challenges", icon: "challenge" },
  { label: "Labs", href: "/labs", icon: "labs" },
  { label: "Glossary", href: "/glossary", icon: "glossary" },
  { label: "Progress", href: "/progress", icon: "progress" },
];

function Icon({ name }: { name: IconName }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const paths: Record<IconName, React.ReactNode> = {
    home: <><path d="m3 11 9-8 9 8v10H3V11Z" {...common} /><path d="M9 21v-6h6v6" {...common} /></>,
    path: <><circle cx="6" cy="18" r="2" {...common} /><circle cx="18" cy="6" r="2" {...common} /><path d="M7.8 17.1c2.1-1.5 1-6.2 4.2-8.3 1.5-1 3.4-.7 4.2-1.1" {...common} /></>,
    courses: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v17.5H6.5A2.5 2.5 0 0 0 4 23V5.5Z" {...common} /><path d="M4 20.5A2.5 2.5 0 0 1 6.5 18H20" {...common} /></>,
    challenge: <><path d="M8 3h8l1 5 4 3-3 4 1 6H5l1-6-3-4 4-3 1-5Z" {...common} /><path d="M9 12h6M12 9v6" {...common} /></>,
    labs: <><path d="M9 3h6M10 3v6l-5 9a3 3 0 0 0 2.7 4.5h8.6A3 3 0 0 0 19 18l-5-9V3" {...common} /><path d="M7.5 17h9" {...common} /></>,
    glossary: <><path d="M5 4.5A2.5 2.5 0 0 1 7.5 2H20v17.5H7.5A2.5 2.5 0 0 0 5 22V4.5Z" {...common} /><path d="M9 7h7M9 11h7M9 15h4" {...common} /></>,
    progress: <><path d="M4 20V10M10 20V4M16 20v-7M22 20V7" {...common} /></>,
    admin: <><circle cx="12" cy="12" r="3" {...common} /><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.1 2.1-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.56v.08h-3v-.08A1.7 1.7 0 0 0 10.7 18.6a1.7 1.7 0 0 0-1.88.34l-.06.06-2.1-2.1.06-.06A1.7 1.7 0 0 0 7.06 15 1.7 1.7 0 0 0 5.5 14H5v-3h.08A1.7 1.7 0 0 0 6.64 10a1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.1-2.1.06.06a1.7 1.7 0 0 0 1.88.34A1.7 1.7 0 0 0 11.3 4.8v-.08h3v.08a1.7 1.7 0 0 0 1.03 1.56 1.7 1.7 0 0 0 1.88-.34l.06-.06 2.1 2.1-.06.06A1.7 1.7 0 0 0 19 10a1.7 1.7 0 0 0 1.56 1.03h.08v3h-.08A1.7 1.7 0 0 0 19.4 15Z" {...common} /></>,
    logout: <><path d="M10 5H5v14h5" {...common} /><path d="M13 8l4 4-4 4M17 12H9" {...common} /></>,
  };
  return <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">{paths[name]}</svg>;
}

function isActive(pathname: string | null, href: string) {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname?.startsWith(`${href}/`);
}

export default function AcademySidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const isAdmin = useIsAdmin(user?.id);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <aside className="hidden w-60 shrink-0 border-r border-[var(--border)] bg-[var(--surface)] lg:flex lg:flex-col">
      <div className="flex flex-1 flex-col px-3 py-5">
        <nav aria-label="Academy navigation" className="flex flex-col gap-1">
          <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--text-lo)]">Academy</p>
          {navigation.map((item) => {
            const className = `flex min-h-11 items-center gap-3 rounded-md px-3 text-sm font-medium transition ${
              item.href && isActive(pathname, item.href)
                ? "bg-[var(--primary)]/[0.09] text-[var(--primary)]"
                : "text-[var(--text-mid)] hover:bg-[var(--surface-2)] hover:text-[var(--text-hi)]"
            }`;
            if (!item.href) {
              return (
                <span key={item.label} aria-disabled="true" title="Available in a later phase" className={`${className} cursor-default opacity-55`}>
                  <Icon name={item.icon} />
                  <span>{item.label}</span>
                  {item.comingSoon && <span className="ml-auto text-[10px] font-medium text-[var(--text-lo)]">Soon</span>}
                </span>
              );
            }
            return <Link key={item.label} href={item.href} className={className}><Icon name={item.icon} /><span>{item.label}</span></Link>;
          })}
          <div className="mt-3 border-t border-[var(--border)] pt-3">
            {isAdmin ? (
              <Link href="/admin/courses" className="flex min-h-11 items-center gap-3 rounded-md px-3 text-sm font-semibold text-[var(--primary)] transition hover:bg-[var(--primary)]/[0.08]">
                <Icon name="admin" />
                <span>Admin</span>
              </Link>
            ) : (
              <span aria-disabled="true" className="flex min-h-11 items-center gap-3 rounded-md px-3 text-sm font-medium text-[var(--text-lo)] opacity-55">
                <Icon name="admin" />
                <span>Admin</span>
              </span>
            )}
          </div>
        </nav>

        <div className="mt-auto border-t border-[var(--border)] pt-3">
          <button
            type="button"
            onClick={handleSignOut}
            className="group flex min-h-11 w-full items-center gap-3 rounded-md px-3 text-left text-sm font-semibold text-[var(--text-mid)] transition hover:bg-[var(--surface-2)] hover:text-[var(--text-hi)]"
          >
            <span className="text-[var(--text-lo)] transition group-hover:text-[var(--primary)]">
              <Icon name="logout" />
            </span>
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
