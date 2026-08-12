import Link from "next/link";

export type UsedLaterTopic = { title: string; href: string };

export default function UsedLaterLinks({ topics }: { topics: UsedLaterTopic[] }) {
  if (topics.length === 0) return null;
  return (
    <aside className="mt-8 border-l-4 border-[var(--success)] bg-[var(--success-soft)] px-5 py-4" aria-labelledby="used-later-heading">
      <p id="used-later-heading" className="text-xs font-semibold uppercase tracking-[0.13em] text-[var(--success)]">Used later in</p>
      <p className="mt-2 text-sm leading-6 text-[var(--text-mid)]">The skills in this lesson reappear as the curriculum becomes more practical.</p>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
        {topics.map((topic) => <Link key={topic.href} href={topic.href} className="text-sm font-semibold text-[var(--success)] hover:underline">{topic.title} →</Link>)}
      </div>
    </aside>
  );
}
