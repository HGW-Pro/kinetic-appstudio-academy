export type Assignment = {
  id: string;
  title: string;
  context: string;
  trackId: string;
};

export function NextAssignmentCard({
  assignment,
}: {
  assignment: Assignment;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 shadow-md shadow-slate-950/40">
      <h3 className="text-sm font-semibold">{assignment.title}</h3>
      <p className="mt-1 text-xs text-slate-400">{assignment.context}</p>
      <p className="mt-2 text-[11px] text-slate-500">
        Track: <span className="font-semibold text-slate-200">{assignment.trackId}</span>
      </p>
      <button className="mt-4 rounded-lg bg-emerald-500 px-3 py-2 text-xs font-semibold text-white shadow hover:bg-emerald-400">
        Start lab
      </button>
    </div>
  );
}
