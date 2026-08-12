"use client";

type KineticShellProps = {
  onCustomize: () => void;
  studioOpen: boolean;
};

export default function KineticShell({ onCustomize, studioOpen }: KineticShellProps) {
  const nav = ["Home", "Customers", "Orders", "Parts"];
  return (
    <section className="overflow-hidden border border-slate-300 bg-white shadow-sm" aria-labelledby="kinetic-training-title">
      <header className="flex min-h-12 items-center justify-between bg-slate-800 px-4 text-white">
        <div><p className="text-xs uppercase tracking-[0.12em] text-slate-300">Training environment</p><h2 id="kinetic-training-title" className="text-sm font-semibold">Kinetic</h2></div>
        <button type="button" onClick={onCustomize} className="min-h-9 border border-white/35 px-3 text-sm font-semibold hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">{studioOpen ? "Return to Studio" : "Customize"}</button>
      </header>
      <div className="grid min-h-64 grid-cols-[9rem_minmax(0,1fr)]">
        <nav aria-label="Simulated Kinetic navigation" className="border-r border-slate-200 bg-slate-50 p-3">{nav.map((item) => <button key={item} type="button" className={`block min-h-9 w-full px-2 text-left text-sm ${item === "Customers" ? "bg-slate-200 font-semibold text-slate-900" : "text-slate-600 hover:bg-slate-100"}`}>{item}</button>)}</nav>
        <div className="p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Customer</p>
          <div className="mt-4 grid max-w-lg gap-3">
            {[["Customer ID", "10001"], ["Name", "ABC Company"], ["State", "Indiana"], ["Status", "Active"]].map(([label, value]) => <label key={label} className="grid grid-cols-[7rem_minmax(0,1fr)] items-center gap-3 text-sm text-slate-700"><span>{label}</span><span className="min-h-9 border border-slate-300 bg-slate-50 px-3 py-2 text-slate-600">{value}</span></label>)}
          </div>
        </div>
      </div>
    </section>
  );
}
