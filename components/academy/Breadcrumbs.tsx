"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const firstSegmentLabel: Record<string, string> = {
  dashboard: "Home",
  "learning-path": "Learning Path",
  courses: "Courses",
  challenges: "Challenges",
  labs: "Labs",
};

export default function Breadcrumbs() {
  const pathname = usePathname();
  const segments = (pathname ?? "").split("/").filter(Boolean);
  if (segments.length <= 1) return null;

  const items = segments.map((segment, index) => {
    const href = `/${segments.slice(0, index + 1).join("/")}`;
    const label =
      index === 0
        ? firstSegmentLabel[segment] ?? "Academy"
        : index === 1
          ? "Course"
          : index === 2
            ? "Topic"
            : index === 3
              ? "Lesson"
              : "Page";
    return { href, label };
  });

  return (
    <nav aria-label="Breadcrumb" className="hidden border-b border-[var(--border)] bg-[var(--bg)] px-5 py-2.5 text-xs text-[var(--text-lo)] sm:block lg:px-8">
      <ol className="flex items-center gap-2">
        {items.map((item, index) => (
          <li key={item.href} className="flex items-center gap-2">
            {index > 0 && <span aria-hidden="true">/</span>}
            {index === items.length - 1 ? (
              <span aria-current="page" className="font-medium text-[var(--text-mid)]">{item.label}</span>
            ) : (
              <Link href={item.href} className="hover:text-[var(--primary)]">{item.label}</Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
