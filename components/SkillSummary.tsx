export type SkillLevel = {
  skill: string;
  level: "Not started" | "Practiced" | "Verified" | string;
};

export function SkillSummary({ skills }: { skills: SkillLevel[] }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-xs">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-slate-800">
            <th className="py-2 text-[11px] font-semibold text-slate-300">
              Skill
            </th>
            <th className="py-2 text-[11px] font-semibold text-slate-300">
              Level
            </th>
          </tr>
        </thead>
        <tbody>
          {skills.map((s) => (
            <tr key={s.skill} className="border-b border-slate-900">
              <td className="py-2 text-[11px] text-slate-200">{s.skill}</td>
              <td className="py-2 text-[11px] text-slate-400">{s.level}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
