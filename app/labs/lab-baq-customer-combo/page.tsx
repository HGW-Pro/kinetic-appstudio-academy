import Link from "next/link";

interface LabAssignment {
  id: string;
  title: string;
  context: string;
  trackId: string;
}

const lab: LabAssignment = {
  id: "lab-baq-customer-combo",
  title: "Configure BAQ-based customer combo",
  context:
    "Order Entry Detail page, zCustomer01 BAQ, filtered by State textbox.",
  trackId: "data-binding",
};

const labSteps = [
  {
    id: 1,
    title: "Open the target page",
    description:
      "Navigate to the Order Entry Detail page in Kinetic Application Studio and confirm you are editing the correct layer.",
    focus: "Components & Layout",
  },
  {
    id: 2,
    title: "Review the BAQ",
    description:
      "Open the zCustomer01 BAQ and verify fields, including State. Confirm it returns only the columns you need for the combo.",
    focus: "Data Binding",
  },
  {
    id: 3,
    title: "Create the combo control",
    description:
      "Add a new combo control to the page, choose BAQ-based combo, and point it to zCustomer01.",
    focus: "Data Binding",
  },
  {
    id: 4,
    title: "Filter by State textbox",
    description:
      "Bind the combo's BAQ parameter to the State textbox so the combo filters customers by the entered state.",
    focus: "Events & Data Rules",
  },
  {
    id: 5,
    title: "Test and debug",
    description:
      "Use the Debug Tool to inspect bindings and confirm the combo updates when the State changes.",
    focus: "Debugging & Tools",
  },
];

const acceptanceCriteria = [
  "Customer combo shows only customers for the state entered in the textbox.",
  "BAQ execution is efficient and returns only required fields.",
  "Page layout remains clean and consistent with existing design.",
];

export default function LabPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-50">
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-500" />
            <div className="flex flex-col">
              <span className="text-sm font-semibold tracking-wide">
                Kinetic Studio Academy
              </span>
              <span className="text-xs text-slate-400">Lab workspace</span>
            </div>
          </div>
          <Link
            href="/"
            className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs text-slate-300 hover:border-indigo-400 hover:text-indigo-200"
          >
            Back to dashboard
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">
        <section className="mb-8 space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Lab • Data Binding
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">
            {lab.title}
          </h1>
          <p className="max-w-xl text-sm text-slate-400">{lab.context}</p>
        </section>

        <section className="mb-8 grid gap-6 md:grid-cols-[1.6fr,1.2fr]">
          <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-sm shadow-slate-900/40">
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              Step-by-step guide
            </h2>
            <ol className="space-y-3 text-sm text-slate-200">
              {labSteps.map((step) => (
                <li
                  key={step.id}
                  className="rounded-xl border border-slate-800 bg-slate-900/80 p-3"
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-[11px] font-semibold text-slate-500">
                        Step {step.id}
                      </span>
                      <h3 className="text-sm font-medium text-slate-100">
                        {step.title}
                      </h3>
                    </div>
                    <span className="text-[11px] rounded-full bg-slate-800 px-2 py-0.5 text-slate-300">
                      {step.focus}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-400">{step.description}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-sm shadow-slate-900/40">
              <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                Acceptance criteria
              </h2>
              <ul className="mt-2 space-y-2 text-xs text-slate-300">
                {acceptanceCriteria.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-[3px] h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-xs text-slate-300 shadow-sm shadow-slate-900/40">
              <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                Lab notes
              </h2>
              <p className="mt-2">
                Use this lab to practice real-world Kinetic AppStudio patterns: BAQ-based
                combos, parameter binding from textboxes, and debugging data flows with
                the Debug Tool.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
