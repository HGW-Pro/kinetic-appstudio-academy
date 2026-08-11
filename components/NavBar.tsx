"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";

const links = [
  { href: "/", label: "Courses" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/courses/kinetic-application-studio", label: "Kinetic App Studio" },
  { href: "/labs", label: "Hands-On Labs" },
];

export default function NavBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut, loading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  function closeMobile() {
    setMobileOpen(false);
  }

  return (
    <header className="sticky-header">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5" onClick={closeMobile}>
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

          {/* Mobile hamburger — only shown below sm breakpoint */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-[var(--border-strong)] bg-[var(--surface-2)] text-[var(--text-hi)] transition hover:bg-[var(--surface-3)] sm:hidden"
          >
            {mobileOpen ? (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M2 2L16 16M16 2L2 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M2 4.5H16M2 9H16M2 13.5H16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile dropdown panel */}
      {mobileOpen && (
        <div className="border-t border-[var(--border)] bg-[var(--surface)] px-4 py-3 sm:hidden">
          <nav className="flex flex-col gap-1">
            {links.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname?.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMobile}
                  className={`rounded-md px-3.5 py-2.5 text-sm font-medium transition ${
                    active
                      ? "bg-[var(--surface-2)] text-[var(--primary)]"
                      : "text-[var(--text-mid)] hover:bg-[var(--surface-2)] hover:text-[var(--text-hi)]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="mt-2 border-t border-[var(--border)] pt-2">
              {!loading && user ? (
                <button
                  onClick={async () => {
                    await signOut();
                    closeMobile();
                    router.push("/");
                  }}
                  className="w-full rounded-md border border-[var(--border-strong)] bg-[var(--surface-2)] px-3.5 py-2.5 text-left text-sm font-medium text-[var(--text-hi)] transition hover:bg-[var(--surface-3)]"
                >
                  Sign Out
                </button>
              ) : !loading ? (
                <Link
                  href="/login"
                  onClick={closeMobile}
                  className="block w-full rounded-md bg-[var(--primary)] px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--primary-dark)]"
                >
                  Sign In
                </Link>
              ) : null}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
