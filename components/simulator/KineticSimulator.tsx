"use client";

import { useMemo, useState } from "react";
import type { CanvasComponent, SimulatorChallengeDefinition, SimulatorComponentKind } from "./types";
import { defaultComponentProperties } from "./types";
import ApplicationStudioSimulator from "./ApplicationStudioSimulator";
import HintSystem from "../learning/HintSystem";
import KineticShell from "./KineticShell";
import SimulatorFeedback from "./SimulatorFeedback";
import SimulatorValidator, { validateSimulatorChallenge } from "./SimulatorValidator";

export const customerEntryPanelChallenge: SimulatorChallengeDefinition = {
  id: "customer-entry-panel",
  title: "Build a Customer Entry Panel",
  intro: "Build a small customer-entry customization using the same control choices you would make in Application Studio.",
  businessRequirement: "When a user creates a new order, Order Date should automatically default to today.",
  requiredComponents: [
    { component: "TextBox", label: "Customer ID", binding: "Customer.CustID", required: true, checklistLabel: "Customer ID TextBox is configured" },
    { component: "ComboBox", label: "Customer Status", binding: "Customer.Status", checklistLabel: "Customer Status ComboBox is configured" },
    { component: "DateTime", label: "Order Date", binding: "Order.OrderDate", checklistLabel: "Order Date field is configured" },
    { component: "Button", label: "Save", checklistLabel: "Save button is configured" },
  ],
  requiredEvent: { componentLabel: "Order Date", trigger: "New", action: "Row Update", field: "OrderDate", value: "Today", checklistLabel: "Order Date New event sets OrderDate to Today" },
  hints: [
    "Start with the two customer fields. Their labels and bindings are checked exactly, and Customer ID is required.",
    "Use a DateTime control for Order Date. Select it after placement to configure a New → Row Update event.",
  ],
  solution: "The finished panel contains Customer ID (TextBox, Customer.CustID, required), Customer Status (ComboBox, Customer.Status), Order Date (DateTime, Order.OrderDate) with New → Row Update → OrderDate = Today, and a Save button.",
};

function makeId(type: SimulatorComponentKind, position: number) {
  return `${type.toLowerCase()}-${position + 1}-${Date.now()}`;
}

export default function KineticSimulator({ challenge = customerEntryPanelChallenge }: { challenge?: SimulatorChallengeDefinition }) {
  const [studioOpen, setStudioOpen] = useState(false);
  const [components, setComponents] = useState<CanvasComponent[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const results = useMemo(() => validateSimulatorChallenge(challenge, components), [challenge, components]);
  const complete = results.every((result) => result.complete);

  const addComponent = (type: SimulatorComponentKind) => {
    const component: CanvasComponent = { id: makeId(type, components.length), type, ...defaultComponentProperties[type] };
    setComponents((items) => [...items, component]);
    setSelectedId(component.id);
    setStudioOpen(true);
  };
  const updateComponent = (id: string, patch: Partial<CanvasComponent>) => setComponents((items) => items.map((component) => component.id === id ? { ...component, ...patch } : component));
  const loadSolution = () => {
    const solution: CanvasComponent[] = [
      { id: "solution-customer-id", type: "TextBox", label: "Customer ID", binding: "Customer.CustID", required: true },
      { id: "solution-customer-status", type: "ComboBox", label: "Customer Status", binding: "Customer.Status", required: false },
      { id: "solution-order-date", type: "DateTime", label: "Order Date", binding: "Order.OrderDate", required: false, event: { trigger: "New", action: "Row Update", field: "OrderDate", value: "Today" } },
      { id: "solution-save", type: "Button", label: "Save", binding: "", required: false },
    ];
    setComponents(solution);
    setSelectedId("solution-order-date");
    setStudioOpen(true);
  };

  return (
    <section className="my-2 space-y-5" aria-labelledby="simulator-challenge-title">
      <header className="border-b border-[var(--border)] pb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">Simulator challenge</p>
        <h2 id="simulator-challenge-title" className="mt-2 text-2xl font-semibold tracking-tight text-[var(--text-hi)]">{challenge.title}</h2>
        {challenge.intro && <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--text-mid)]">{challenge.intro}</p>}
        {challenge.businessRequirement && <aside className="mt-4 max-w-3xl border border-[var(--primary)]/25 bg-[var(--primary)]/[0.04] p-4"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--primary)]">Business requirement</p><p className="mt-1 text-sm leading-6 text-[var(--text-mid)]">{challenge.businessRequirement}</p></aside>}
      </header>
      <KineticShell onCustomize={() => setStudioOpen(true)} studioOpen={studioOpen} />
      {studioOpen && <ApplicationStudioSimulator components={components} selectedId={selectedId} onAdd={addComponent} onSelect={setSelectedId} onChange={updateComponent} />}
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-4">
          <SimulatorFeedback complete={complete} completedCount={results.filter((result) => result.complete).length} totalCount={results.length} />
          <HintSystem hints={challenge.hints} solution={challenge.solution} solutionLabel="Show solution" onShowSolution={loadSolution} />
        </div>
        <SimulatorValidator results={results} />
      </div>
    </section>
  );
}
