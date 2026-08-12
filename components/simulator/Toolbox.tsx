"use client";

import type { SimulatorComponentKind } from "./types";
import { toolboxComponents } from "./types";

type ToolboxProps = {
  onAdd: (type: SimulatorComponentKind) => void;
};

export default function Toolbox({ onAdd }: ToolboxProps) {
  return (
    <aside className="border border-[var(--border)] bg-[var(--surface)] p-3" aria-label="Application Studio toolbox">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-lo)]">Toolbox</p>
      <p className="mt-1 text-xs leading-5 text-[var(--text-mid)]">Choose a control to add it to the canvas.</p>
      <div className="mt-3 grid gap-2">
        {toolboxComponents.map((item) => (
          <button
            key={item.type}
            type="button"
            onClick={() => onAdd(item.type)}
            className="min-h-11 border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-left text-sm font-semibold text-[var(--text-hi)] transition hover:border-[var(--primary)] hover:bg-[var(--primary)]/[0.04] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]"
            aria-label={`Add ${item.type} to canvas`}
          >
            <span className="block">{item.type}</span>
            <span className="mt-0.5 block text-xs font-normal text-[var(--text-lo)]">{item.description}</span>
          </button>
        ))}
      </div>
    </aside>
  );
}
