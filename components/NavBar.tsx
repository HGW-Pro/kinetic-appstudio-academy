"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/modules", label: "Training Modules" },
  { href: "/labs", label: "Hands-On Labs" },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <header className="sticky-header">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)] text-lg font-bold text-white shadow-lg shadow-[var(--accent)]/20">
            K
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold tracking-wide text-[var(--text-hi)]">
              Kinetic AppStudio
            </p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-lo)]">
              Academy
            </p>
          </div>
        </Link>
        <nav className="hidden items-center gap-1 sm:flex">
          {links.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname?.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-white/10 text-[var(--text-hi)]"
                    : "text-[var(--text-mid)] hover:bg-white/5 hover:text-[var(--text-hi)]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <Link
          href="/modules"
          className="rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] px-4 py-2 text-sm font-semibold text-white shadow-md shadow-[var(--accent)]/30 transition hover:opacity-90 sm:hidden"
        >
          Start
        </Link>
      </div>
    </header>
  );
}
