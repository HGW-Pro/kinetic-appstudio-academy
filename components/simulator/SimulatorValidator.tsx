"use client";

import type { SimulatorChallengeDefinition } from "./types";
import type { CanvasComponent } from "./types";

export type ValidationResult = {
  label: string;
  complete: boolean;
};

export function validateSimulatorChallenge(challenge: SimulatorChallengeDefinition, components: CanvasComponent[]): ValidationResult[] {
  const componentResults = challenge.requiredComponents.map((requirement) => {
    const matched = components.some((component) =>
      component.type === requirement.component &&
      component.label.trim().toLocaleLowerCase() === requirement.label.trim().toLocaleLowerCase() &&
      (requirement.binding === undefined || component.binding.trim().toLocaleLowerCase() === requirement.binding.trim().toLocaleLowerCase()) &&
      (requirement.required === undefined || component.required === requirement.required)
    );
    return { label: requirement.checklistLabel ?? `${requirement.label} ${requirement.component} added`, complete: matched };
  });
  if (!challenge.requiredEvent) return componentResults;
  const requirement = challenge.requiredEvent;
  const source = components.find((component) => component.label.trim().toLocaleLowerCase() === requirement.componentLabel.trim().toLocaleLowerCase());
  const event = source?.event;
  const complete = Boolean(event && event.trigger === requirement.trigger && event.action === requirement.action && event.field.trim().toLocaleLowerCase() === requirement.field.trim().toLocaleLowerCase() && event.value.trim().toLocaleLowerCase() === requirement.value.trim().toLocaleLowerCase());
  return [...componentResults, { label: requirement.checklistLabel ?? `${requirement.componentLabel} event configures ${requirement.field} = ${requirement.value}`, complete }];
}

export default function SimulatorValidator({ results }: { results: ValidationResult[] }) {
  return (
    <section className="border border-[var(--border)] bg-[var(--surface)] p-4" aria-labelledby="challenge-checklist-title">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-lo)]">Live validation</p>
      <h2 id="challenge-checklist-title" className="mt-1 text-base font-semibold text-[var(--text-hi)]">Build checklist</h2>
      <ul className="mt-3 space-y-2" aria-live="polite">
        {results.map((result) => <li key={result.label} className={`flex items-start gap-2 text-sm ${result.complete ? "text-[var(--success)]" : "text-[var(--text-mid)]"}`}><span aria-hidden="true" className="mt-0.5 font-bold">{result.complete ? "✓" : "✗"}</span><span>{result.label}</span></li>)}
      </ul>
    </section>
  );
}
