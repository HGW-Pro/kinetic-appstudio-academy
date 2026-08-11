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
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-500" />
            <span className="text-sm font-semibold tracking-wide">
              Kinetic Studio Academy
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button className="rounded-full bg-slate-800 px-3 py-1 text-xs">
              Dark
            </button>
            <div className="h-8 w-8 rounded-full bg-slate-700" />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Dashboard</h1>
            <p className="mt-1 text-sm text-slate-400">
              Track your progress and continue learning Kinetic Application Studio.
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
          <div className="space-y-6">
            <section>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                  Your learning tracks
                </h2>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {mockTracks.map((track) => (
                  <TrackCard key={track.id} track={track} />
                ))}
              </div>
            </section>

            <section>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                  Next assignment
                </h2>
              </div>
              <NextAssignmentCard assignment={nextAssignment} />
            </section>
          </div>

          <div className="space-y-6">
            <section>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
                Recent activity
              </h2>
              <ActivityFeed items={mockActivity} />
            </section>
            <section>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
                Skill summary
              </h2>
              <SkillSummary skills={skillSummary} />
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
