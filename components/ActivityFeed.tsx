export type ActivityItem = {
  id: string;
  type: "lab" | "quiz";
  title: string;
  track: string;
  date: string;
};

export function ActivityFeed({
  items,
}: {
  items: ActivityItem[];
}) {
  return (
    <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
      {items.length === 0 && (
        <p className="text-xs text-slate-400">No recent activity yet.</p>
      )}
      {items.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between rounded-lg bg-slate-900 px-3 py-2 text-xs"
        >
          <div>
            <p className="font-medium text-slate-100">{item.title}</p>
            <p className="text-[11px] text-slate-400">
              {item.type === "lab" ? "Lab" : "Quiz"} · {item.track}
            </p>
          </div>
          <span className="text-[11px] text-slate-500">{item.date}</span>
        </div>
      ))}
    </div>
  );
}
