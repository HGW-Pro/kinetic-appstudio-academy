export type Track = {
  id: string;
  name: string;
  description: string;
  completion: number;
  skills: string[];
};

export function TrackCard({ track }: { track: Track }) {
  const pct = Math.round(track.completion * 100);

  return (
    <div className="group rounded-xl border border-slate-800 bg-slate-900/60 p-4 shadow-md shadow-slate-950/40 transition hover:border-indigo-500 hover:bg-slate-900">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold">{track.name}</h3>
          <p className="mt-1 text-xs text-slate-400">{track.description}</p>
        </div>
        <span className="rounded-full bg-slate-800 px-2 py-1 text-[10px] text-slate-300">
          {pct}% complete
        </span>
      </div>

      <div className="mt-3">
        <div className="h-1.5 w-full rounded-full bg-slate-800">
          <div
            className="h-1.5 rounded-full bg-indigo-500 transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1">
        {track.skills.map((s) => (
          <span
            key={s}
            className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300"
          >
            {s}
          </span>
        ))}
      </div>

      <button className="mt-4 w-full rounded-lg bg-indigo-500 px-3 py-2 text-xs font-semibold text-white shadow hover:bg-indigo-400">
        Continue track
      </button>
    </div>
  );
}
