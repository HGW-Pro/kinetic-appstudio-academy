import type { ReactNode } from "react";
import AcademyHeader from "./AcademyHeader";
import AcademySidebar from "./AcademySidebar";
import Breadcrumbs from "./Breadcrumbs";
import MobileAcademyNav from "./MobileAcademyNav";

export default function AcademyShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text-hi)]">
      <a href="#academy-content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-[var(--primary)] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white">
        Skip to content
      </a>
      <AcademyHeader />
      <div className="flex min-h-[calc(100vh-4rem)]">
        <AcademySidebar />
        <div className="min-w-0 flex-1">
          <Breadcrumbs />
          <main id="academy-content" className="mx-auto w-full max-w-7xl px-4 pb-24 pt-7 sm:px-6 lg:px-8 lg:pb-10">
            {children}
          </main>
        </div>
      </div>
      <MobileAcademyNav />
    </div>
  );
}
