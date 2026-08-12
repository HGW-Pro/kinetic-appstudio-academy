"use client";

import type { CanvasComponent, SimulatorEventConfig } from "./types";

type PropertyPanelProps = {
  component: CanvasComponent | null;
  onChange: (id: string, patch: Partial<CanvasComponent>) => void;
};

const inputClass = "mt-1 min-h-10 w-full border border-[var(--border-strong)] bg-[var(--surface)] px-3 text-sm text-[var(--text-hi)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]";

export default function PropertyPanel({ component, onChange }: PropertyPanelProps) {
  if (!component) {
    return <aside className="border border-[var(--border)] bg-[var(--surface)] p-4" aria-label="Property panel"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-lo)]">Properties</p><p className="mt-3 text-sm leading-6 text-[var(--text-mid)]">Select a canvas component to edit its label, binding, required state, or event.</p></aside>;
  }
  const event = component.event ?? { trigger: "Click" as const, action: "Row Update" as const, field: "", value: "Today" };
  const setEvent = (patch: Partial<SimulatorEventConfig>) => onChange(component.id, { event: { ...event, ...patch } });
  return (
    <aside className="border border-[var(--border)] bg-[var(--surface)] p-4" aria-label={`Properties for ${component.label}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-lo)]">Properties</p>
      <h3 className="mt-1 text-sm font-semibold text-[var(--text-hi)]">{component.type}</h3>
      <div className="mt-4 space-y-3">
        <label className="block text-xs font-semibold text-[var(--text-mid)]">Label<input value={component.label} onChange={(event) => onChange(component.id, { label: event.target.value })} className={inputClass} /></label>
        <label className="block text-xs font-semibold text-[var(--text-mid)]">Binding<input value={component.binding} onChange={(event) => onChange(component.id, { binding: event.target.value })} placeholder="e.g. Customer.CustID" className={inputClass} /></label>
        <label className="flex min-h-11 items-center gap-2 text-sm text-[var(--text-mid)]"><input type="checkbox" checked={component.required} onChange={(event) => onChange(component.id, { required: event.target.checked })} className="h-4 w-4 accent-[var(--primary)]" />Required field</label>
      </div>
      <fieldset className="mt-5 border-t border-[var(--border)] pt-4">
        <legend className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-lo)]">Event configuration</legend>
        <p className="mt-1 text-xs leading-5 text-[var(--text-mid)]">Attach a simple event to this component.</p>
        <div className="mt-3 space-y-3">
          <label className="block text-xs font-semibold text-[var(--text-mid)]">Event<select value={event.trigger} onChange={(e) => setEvent({ trigger: e.target.value as SimulatorEventConfig["trigger"] })} className={inputClass}><option value="Click">Click</option><option value="New">New</option></select></label>
          <label className="block text-xs font-semibold text-[var(--text-mid)]">Action<select value={event.action} onChange={(e) => setEvent({ action: e.target.value as SimulatorEventConfig["action"] })} className={inputClass}><option value="Row Update">Row Update</option></select></label>
          <label className="block text-xs font-semibold text-[var(--text-mid)]">Field<input value={event.field} onChange={(e) => setEvent({ field: e.target.value })} placeholder="e.g. OrderDate" className={inputClass} /></label>
          <label className="block text-xs font-semibold text-[var(--text-mid)]">Set value<select value={event.value} onChange={(e) => setEvent({ value: e.target.value })} className={inputClass}><option value="Today">Today</option></select></label>
          <button type="button" onClick={() => onChange(component.id, { event })} className="min-h-10 w-full bg-[var(--primary)] px-3 text-sm font-semibold text-white hover:bg-[var(--primary-dark)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]">Attach event</button>
        </div>
      </fieldset>
    </aside>
  );
}
