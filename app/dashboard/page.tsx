import { TrackCard } from "../../components/TrackCard";
import { NextAssignmentCard } from "../../components/NextAssignmentCard";
import { ActivityFeed } from "../../components/ActivityFeed";
import { SkillSummary } from "../../components/SkillSummary";

const mockTracks = [
  {
    id: "components-layout",
    name: "Components & Layout",
    description:
      "Learn PanelCards, grids, containers, and Flex layout as used in Kinetic Application Studio.",
    completion: 0.4,
    skills: ["PanelCard", "PanelCardGrid", "Columns", "FlexLayout"],
  },
  {
    id: "data-binding",
    name: "Data Binding",
    description:
      "EpBinding, data lookups, patches, and variables for pages and controls.",
    completion: 0.1,
    skills: ["EpBinding", "Patches", "Variables"],
  },
  {
    id: "events-data-rules",
    name: "Events & Data Rules",
    description:
      "Behavior hooks, system events like DataClear, and runtime rules.",
    completion: 0,
    skills: ["OnClick", "DataClear", "Data rules"],
  },
  {
    id: "debug-tools",
    name: "Debugging & Tools",
    description:
      "Debug Tool, browser DevTools, epDebug commands, and keyboard shortcuts.",
    completion: 0,
    skills: ["DebugTool", "epDebug.views"],
  },
];

const nextAssignment = {
  id: "lab-baq-customer-combo",
  title: "Configure BAQ-based customer combo",
  context:
    "Order Entry Detail page, zCustomer01 BAQ, filtered by State textbox.",
  trackId: "data-binding",
};

const mockActivity = [
  {
    id: "act1",
    type: "lab" as const,
    title: "Virtual PanelCard FullScreen practice",
    track: "Components & Layout",
    date: "2026-08-10",
  },
  {
    id: "act2",
    type: "quiz" as const,
    title: "EpBinding basics quiz",
    track: "Data Binding",
    date: "2026-08-09",
  },
];

const skillSummary = [
  { skill: "EpBinding basics", level: "Practiced" },
  {
    skill: "Combobox types (static, BAQ, BO, reusable)",
    level: "Not started",
  },
  { skill: "Debug Tool & AutoLoad", level: "Not started" },
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-50">
      <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500 shadow-sm shadow-indigo-500/50">
              <span className="text-xs font-bold tracking-tight">KA</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold tracking-wide">
                Kinetic Studio Academy
              </span>
              <span className="text-xs text-slate-400">
                Premium training for Epicor Kinetic Application Studio
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs text-slate-300 shadow-sm hover:border-indigo-400 hover:text-indigo-200">
              Dark
            </button>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-xs font-semibold text-slate-200">
              HW
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <section className="mb-8 flex items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Dashboard
            </p>
            <h1 className="text-3xl font-semibold tracking-tight">
              Welcome back to Kinetic Studio Academy
            </h1>
            <p className="max-w-xl text-sm text-slate-400">
              Track your progress across tracks, pick up your next assignment, and
              review your recent activity and skills — all in one place.
            </p>
          </div>
          <div className="hidden text-xs text-slate-400 md:flex md:flex-col md:items-end md:gap-1">
            <span className="rounded-full bg-slate-900 px-3 py-1 text-[11px] font-medium text-slate-300">
              Early access • Kinetic AppStudio 2023.x
            </span>
          </div>
        </section>

        <div className="grid gap-8 lg:grid-cols-[2.1fr,1.4fr]">
          <div className="space-y-8">
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Your learning tracks
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Core areas of Kinetic AppStudio you are working through.
                  </p>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {mockTracks.map((track) => (
                  <TrackCard key={track.id} track={track} />
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Next assignment
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Designed to move you one step closer to production-ready AppStudio skills.
                  </p>
                </div>
              </div>
              <NextAssignmentCard assignment={nextAssignment} />
            </section>
          </div>

          <div className="space-y-8">
            <section className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-sm shadow-slate-900/40">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                  Recent activity
                </h2>
                <span className="text-[11px] text-slate-500">Last 7 days</span>
              </div>
              <ActivityFeed items={mockActivity} />
            </section>
            <section className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-sm shadow-slate-900/40">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                  Skill summary
                </h2>
                <span className="text-[11px] text-slate-500">EpBinding, combos, debug tools</span>
              </div>
              <SkillSummary skills={skillSummary} />
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
