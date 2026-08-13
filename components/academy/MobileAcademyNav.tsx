"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

const links = [
  { href: "/dashboard", label: "Home", icon: "⌂" },
  { href: "/learning-path", label: "Path", icon: "⌁" },
  { href: "/courses", label: "Courses", icon: "▤" },
  { href: "/challenges", label: "Challenges", icon: "⊞" },
];

function LogOutIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 5H5v14h5" />
      <path d="M13 8l4 4-4 4M17 12H9" />
    </svg>
  );
}

export default function MobileAcademyNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <nav aria-label="Academy mobile navigation" className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--border)] bg-[var(--surface)]/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1 shadow-[0_-4px_16px_rgba(16,24,40,0.06)] backdrop-blur lg:hidden">
      <div className="mx-auto grid max-w-md grid-cols-5">
        {links.map((link) => {
          const active = pathname === link.href || (link.href !== "/dashboard" && pathname?.startsWith(`${link.href}/`));
          return (
            <Link key={link.label} href={link.href} className={`flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-md text-[10px] font-semibold transition ${active ? "text-[var(--primary)]" : "text-[var(--text-lo)] hover:bg-[var(--surface-2)]"}`}>
              <span aria-hidden="true" className="text-base leading-none">{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          );
        })}
        <button
          type="button"
          onClick={handleSignOut}
          className="group flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-md text-[10px] font-semibold text-[var(--text-mid)] transition hover:bg-[var(--surface-2)] hover:text-[var(--text-hi)]"
        >
          <span className="text-[var(--text-lo)] transition group-hover:text-[var(--primary)]">
            <LogOutIcon />
          </span>
          <span>Sign Out</span>
        </button>
      </div>
    </nav>
  );
}
