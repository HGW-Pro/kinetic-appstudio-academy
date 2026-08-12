"use client";

import type { CanvasComponent } from "./types";

type CanvasProps = {
  components: CanvasComponent[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

function ComponentPreview({ component }: { component: CanvasComponent }) {
  if (component.type === "CheckBox") {
    return <span className="flex items-center gap-2 text-xs text-[var(--text-mid)]"><span className="h-4 w-4 border border-[var(--border-strong)] bg-white" aria-hidden="true" />Checkbox</span>;
  }
  if (component.type === "ComboBox") {
    return <span className="flex h-8 items-center justify-between border border-[var(--border-strong)] bg-white px-2 text-xs text-[var(--text-lo)]">Select… <span aria-hidden="true">⌄</span></span>;
  }
  if (component.type === "Button") {
    return <span className="inline-flex min-h-8 items-center bg-[var(--primary)] px-3 text-xs font-semibold text-white">Button</span>;
  }
  if (component.type === "Grid") {
    return <span className="grid h-12 grid-cols-3 gap-px border border-[var(--border-strong)] bg-[var(--border-strong)] p-px"><span className="bg-white" /><span className="bg-white" /><span className="bg-white" /><span className="bg-white" /><span className="bg-white" /><span className="bg-white" /></span>;
  }
  return <span className="block h-8 border border-[var(--border-strong)] bg-white px-2 py-2 text-xs text-[var(--text-lo)]">{component.type === "DateTime" ? "MM/DD/YYYY" : component.type === "NumericBox" ? "0" : "Enter value"}</span>;
}

export default function Canvas({ components, selectedId, onSelect }: CanvasProps) {
  return (
    <section className="min-w-0 border border-[var(--border)] bg-[var(--surface-2)] p-3" aria-labelledby="simulator-canvas-title">
      <div className="flex items-baseline justify-between gap-3 border-b border-[var(--border)] pb-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-lo)]">Canvas</p>
          <h3 id="simulator-canvas-title" className="mt-1 text-sm font-semibold text-[var(--text-hi)]">Customer Entry Panel</h3>
        </div>
        <span className="text-xs text-[var(--text-lo)]">{components.length} control{components.length === 1 ? "" : "s"}</span>
      </div>
      <div className="mt-3 min-h-[24rem] bg-white p-4 shadow-sm" aria-label="Build canvas">
        {components.length === 0 ? (
          <div className="flex min-h-[19rem] items-center justify-center border border-dashed border-[var(--border-strong)] p-6 text-center">
            <p className="max-w-xs text-sm leading-6 text-[var(--text-mid)]">Choose a component in the toolbox to place it here. Each component can then be selected and configured.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {components.map((component) => {
              const selected = component.id === selectedId;
              return (
                <button
                  key={component.id}
                  type="button"
                  onClick={() => onSelect(component.id)}
                  className={`block w-full border p-3 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)] ${selected ? "border-[var(--primary)] bg-[var(--primary)]/[0.05] ring-1 ring-[var(--primary)]/20" : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-strong)]"}`}
                  aria-pressed={selected}
                  aria-label={`Select ${component.label}, ${component.type}`}
                >
                  <span className="flex items-center justify-between gap-3">
                    <span>
                      <span className="block text-sm font-semibold text-[var(--text-hi)]">{component.label}{component.required && <span className="ml-1 text-[var(--accent)]" aria-label="required">*</span>}</span>
                      <span className="mt-0.5 block text-xs text-[var(--text-lo)]">{component.type}{component.binding ? ` · ${component.binding}` : ""}{component.event ? ` · ${component.event.trigger} → ${component.event.action}` : ""}</span>
                    </span>
                    <span className="w-32 shrink-0">{ComponentPreview({ component })}</span>
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
