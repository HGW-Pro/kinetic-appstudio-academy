"use client";

import { usePathname } from "next/navigation";
import NavBar from "./NavBar";

function isAcademyRoute(pathname: string | null) {
  return ["/dashboard", "/courses", "/labs"].some(
    (route) => pathname === route || pathname?.startsWith(`${route}/`)
  );
}

export default function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (isAcademyRoute(pathname)) {
    return <>{children}</>;
  }

  return (
    <>
      <NavBar />
      <main className="mx-auto max-w-6xl px-4 pb-24 pt-8 sm:px-6 lg:px-8">{children}</main>
      <footer className="border-t border-[var(--border)] py-8">
        <p className="mx-auto max-w-6xl px-4 text-center text-xs text-[var(--text-lo)] sm:px-6 lg:px-8">
          Kinetic AppStudio Academy · Built for engineers who ship real Epicor customizations.
        </p>
      </footer>
    </>
  );
}
