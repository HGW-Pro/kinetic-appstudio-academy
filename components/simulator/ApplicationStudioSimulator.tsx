"use client";

import type { CanvasComponent, SimulatorComponentKind } from "./types";
import Toolbox from "./Toolbox";
import Canvas from "./Canvas";
import PropertyPanel from "./PropertyPanel";

type ApplicationStudioSimulatorProps = {
  components: CanvasComponent[];
  selectedId: string | null;
  onAdd: (type: SimulatorComponentKind) => void;
  onSelect: (id: string) => void;
  onChange: (id: string, patch: Partial<CanvasComponent>) => void;
};

export default function ApplicationStudioSimulator(props: ApplicationStudioSimulatorProps) {
  const selected = props.components.find((component) => component.id === props.selectedId) ?? null;
  return (
    <section className="overflow-x-auto border border-[var(--border-strong)] bg-[var(--surface-3)] p-3" aria-labelledby="application-studio-title">
      <div className="mb-3 flex items-baseline justify-between gap-4">
        <div><p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--primary)]">Application Studio training</p><h2 id="application-studio-title" className="mt-1 text-lg font-semibold text-[var(--text-hi)]">Build the panel</h2></div>
        <span className="text-xs text-[var(--text-lo)]">Keyboard friendly</span>
      </div>
      <div className="grid min-w-[48rem] gap-3 lg:grid-cols-[11rem_minmax(20rem,1fr)_14rem]">
        <Toolbox onAdd={props.onAdd} />
        <Canvas components={props.components} selectedId={props.selectedId} onSelect={props.onSelect} />
        <PropertyPanel component={selected} onChange={props.onChange} />
      </div>
    </section>
  );
}
