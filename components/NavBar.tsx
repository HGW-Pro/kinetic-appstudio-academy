"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";
import { useIsAdmin } from "./useIsAdmin";

const links = [
  { href: "/", label: "Courses" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/labs", label: "Hands-On Labs" },
];

// ---------------------------------------------------------------------------
// Theme toggle: "Academy Standard" | "Kinetic Default (Light)" | "Kinetic Dark"
//
// Implemented entirely as a scoped <style> block rendered by this
// component plus a `data-theme` attribute on <html>, rather than editing
// app/globals.css or app/layout.tsx directly (their current contents were
// not available to read this session, and blindly rewriting either risks
// silently breaking the site's existing default look). "Academy Standard"
// sets no data-theme attribute at all, so none of these override rules
// match and every page renders with its current, untouched :root
// variables -- zero risk to the existing default theme.
//
// Kinetic Light/Dark override the same CSS custom properties already used
// throughout the app (--primary, --surface, --text-hi, etc.), so every
// existing component that references var(--...) repaints automatically
// with no per-component changes needed.
// ---------------------------------------------------------------------------

type ThemeId = "academy" | "kinetic-light" | "kinetic-dark";

const THEME_STORAGE_KEY = "kinetic-theme";

const THEME_SEQUENCE: { id: ThemeId; label: string; icon: string }[] = [
  { id: "academy", label: "Academy Standard", icon: "🎓" },
  { id: "kinetic-light", label: "Kinetic Default (Light)", icon: "☀️" },
  { id: "kinetic-dark", label: "Kinetic Dark", icon: "🌙" },
];

const THEME_OVERRIDE_CSS = `
html[data-theme="kinetic-light"] {
  --primary: #0f6cbd;
  --primary-dark: #0b5394;
  --primary-light: #4a9eda;
  --surface: #ffffff;
  --surface-2: #f3f6fa;
  --surface-3: #e6ebf1;
  --border: #dde3ea;
  --border-strong: #c7d0db;
  --text-hi: #1a1f29;
  --text-mid: #4b5563;
  --text-lo: #8792a2;
  --success: #0f9d58;
  --success-soft: #e6f4ea;
  --error: #d93025;
  --error-soft: #fce8e6;
}
html[data-theme="kinetic-dark"] {
  --primary: #4dabf5;
  --primary-dark: #2f8fd6;
  --primary-light: #8ec9f7;
  --surface: #12161f;
  --surface-2: #1a1f2b;
  --surface-3: #232936;
  --border: #2a3040;
  --border-strong: #3a4254;
  --text-hi: #f3f5f8;
  --text-mid: #c3c9d4;
  --text-lo: #7c8494;
  --success: #4ade80;
  --success-soft: rgba(74, 222, 128, 0.12);
  --error: #f87171;
  --error-soft: rgba(248, 113, 113, 0.12);
  color-scheme: dark;
}
`;

function useThemeToggle() {
  const [theme, setTheme] = useState<ThemeId>("academy");
  const [hydrated, setHydrated] = useState(false);

  // Restored from localStorage on mount. There's an unavoidable one-frame
  // flash of "Academy Standard" before this runs, since applying it
  // earlier (e.g. a blocking inline script in <head>) would require
  // editing app/layout.tsx, which isn't safely reachable this session.
  useEffect(() => {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY) as ThemeId | null;
    if (stored && THEME_SEQUENCE.some((t) => t.id === stored)) {
      setTheme(stored);
      if (stored !== "academy") document.documentElement.setAttribute("data-theme", stored);
    }
    setHydrated(true);
  }, []);

  function cycleTheme() {
    const currentIndex = THEME_SEQUENCE.findIndex((t) => t.id === theme);
    const next = THEME_SEQUENCE[(currentIndex + 1) % THEME_SEQUENCE.length];
    setTheme(next.id);
    window.localStorage.setItem(THEME_STORAGE_KEY, next.id);
    if (next.id === "academy") {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.setAttribute("data-theme", next.id);
    }
  }

  return { theme, hydrated, cycleTheme };
}

function ThemeToggleButton({ className }: { className?: string }) {
  const { theme, hydrated, cycleTheme } = useThemeToggle();
  const current = THEME_SEQUENCE.find((t) => t.id === theme) ?? THEME_SEQUENCE[0];

  return (
    <button
      type="button"
      onClick={cycleTheme}
      title="Cycle theme: Academy Standard → Kinetic Default (Light) → Kinetic Dark"
      className={
        className ??
        "rounded-md border border-[var(--border-strong)] bg-[var(--surface-2)] px-3.5 py-2 text-sm font-medium text-[var(--text-hi)] transition hover:bg-[var(--surface-3)]"
      }
    >
      <span aria-hidden="true">{current.icon}</span>
      <span className="ml-1.5">{hydrated ? current.label : "Academy Standard"}</span>
    </button>
  );
}

export default function NavBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut, loading } = useAuth();
  // Fails closed to `false` until the employees.role check resolves, so
  // there's no flash of the Admin Panel link before it's confirmed --
  // it simply appears once the check completes for an actual admin.
  const isAdmin = useIsAdmin(user?.id);
  const [mobileOpen, setMobileOpen] = useState(false);

  function closeMobile() {
    setMobileOpen(false);
  }

  return (
    <header className="sticky-header">
      {/* eslint-disable-next-line react/no-danger */}
      <style dangerouslySetInnerHTML={{ __html: THEME_OVERRIDE_CSS }} />
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
          {!loading && isAdmin && (
            <Link
              href="/admin/courses"
              className={`rounded-md border border-[var(--primary)]/30 px-3.5 py-2 text-sm font-semibold transition ${
                pathname?.startsWith("/admin")
                  ? "bg-[var(--primary)]/15 text-[var(--primary)]"
                  : "bg-[var(--primary)]/[0.06] text-[var(--primary)] hover:bg-[var(--primary)]/[0.12]"
              }`}
            >
              ⚙ Admin Panel
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggleButton className="hidden rounded-md border border-[var(--border-strong)] bg-[var(--surface-2)] px-3 py-2 text-xs font-medium text-[var(--text-hi)] transition hover:bg-[var(--surface-3)] sm:inline-flex sm:items-center" />

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
            {!loading && isAdmin && (
              <Link
                href="/admin/courses"
                onClick={closeMobile}
                className={`rounded-md px-3.5 py-2.5 text-sm font-semibold transition ${
                  pathname?.startsWith("/admin")
                    ? "bg-[var(--primary)]/15 text-[var(--primary)]"
                    : "text-[var(--primary)] hover:bg-[var(--primary)]/[0.08]"
                }`}
              >
                ⚙ Admin Panel
              </Link>
            )}
            <div className="mt-2 border-t border-[var(--border)] pt-2">
              <ThemeToggleButton className="mb-2 flex w-full items-center justify-center rounded-md border border-[var(--border-strong)] bg-[var(--surface-2)] px-3.5 py-2.5 text-sm font-medium text-[var(--text-hi)] transition hover:bg-[var(--surface-3)]" />
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
