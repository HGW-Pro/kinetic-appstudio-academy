"use client";

export type Landmark = {
  label: string;
  description: string;
};

export default function UILandmarks({
  title,
  landmarks,
}: {
  title: string;
  landmarks: Landmark[];
}) {
  return (
    <div className="my-5 rounded-xl border border-[var(--primary)]/20 bg-[var(--primary)]/[0.035] p-5">
      <p className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[var(--primary)]">
        <span className="text-base">🖱️</span> {title}
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {landmarks.map((lm, i) => (
          <div
            key={i}
            className="flex gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3"
          >
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--primary)] text-[10px] font-bold text-white">
              {i + 1}
            </span>
            <div>
              <p className="text-sm font-semibold text-[var(--text-hi)]">{lm.label}</p>
              <p className="mt-0.5 text-xs text-[var(--text-mid)]">{lm.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
