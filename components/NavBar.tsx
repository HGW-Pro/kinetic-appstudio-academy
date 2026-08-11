"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";
import SoundToggle from "./SoundToggle";

const links = [
  { href: "/", label: "Course Catalog" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/courses/kinetic-application-studio", label: "Kinetic App Studio" },
  { href: "/labs", label: "Hands-On Labs" },
];

export default function NavBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut, loading } = useAuth();

  return (
    <header className="sticky-header">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--primary)] text-base font-bold text-white shadow-sm">
            K
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-[var(--text-hi)]">
              Kinetic AppStudio
            </p>
            <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-lo)]">
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
                className={`rounded-md px-3.5 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-[var(--surface-2)] text-[var(--primary)]"
                    : "text-[var(--text-mid)] hover:bg-[var(--surface-2)] hover:text-[var(--text-hi)]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <SoundToggle />
          {!loading && user ? (
            <button
              onClick={async () => {
                await signOut();
                router.push("/");
              }}
              className="hidden rounded-md border border-[var(--border-strong)] bg-[var(--surface-2)] px-3.5 py-2 text-sm font-medium text-[var(--text-hi)] transition hover:bg-[var(--surface-3)] sm:inline-block"
            >
              Sign Out
            </button>
          ) : !loading ? (
            <Link
              href="/login"
              className="hidden rounded-md border border-[var(--border-strong)] bg-[var(--surface-2)] px-3.5 py-2 text-sm font-medium text-[var(--text-hi)] transition hover:bg-[var(--surface-3)] sm:inline-block"
            >
              Sign In
            </Link>
          ) : null}
          <Link
            href="/courses/kinetic-application-studio"
            className="rounded-md bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--primary-dark)] sm:hidden"
          >
            Start
          </Link>
        </div>
      </div>
    </header>
  );
}
