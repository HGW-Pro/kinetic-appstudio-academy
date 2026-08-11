import Link from "next/link";

interface LabAssignment {
  id: string;
  title: string;
  context: string;
  trackId: string;
}

const labs: LabAssignment[] = [
  {
    id: "lab-baq-customer-combo",
    title: "Configure BAQ-based customer combo",
    context:
      "Order Entry Detail page, zCustomer01 BAQ, filtered by State textbox.",
    trackId: "data-binding",
  },
];

export default function LabsIndexPage() {
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
              <span className="text-xs text-slate-400">Labs catalog</span>
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
        <section className="mb-6 space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Labs
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">Hands-on labs</h1>
          <p className="max-w-xl text-sm text-slate-400">
            Practice real Kinetic AppStudio scenarios, starting with BAQ-based combos
            and expanding into events, data rules, and debugging.
          </p>
        </section>

        <section className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-sm shadow-slate-900/40">
          <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
            Available labs
          </h2>
          <ul className="mt-2 space-y-2 text-sm text-slate-200">
            {labs.map((lab) => (
              <li
                key={lab.id}
                className="flex items-start justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900/80 p-3"
              >
                <div className="space-y-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-[11px] rounded-full bg-slate-800 px-2 py-0.5 text-slate-300">
                      {lab.trackId}
                    </span>
                    <h3 className="text-sm font-medium text-slate-100">
                      {lab.title}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400">{lab.context}</p>
                </div>
                <Link
                  href={`/labs/${lab.id}`}
                  className="mt-[2px] inline-flex items-center rounded-full border border-indigo-500 bg-indigo-500/10 px-3 py-1 text-[11px] font-medium text-indigo-200 hover:bg-indigo-500/20"
                >
                  Open lab
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
