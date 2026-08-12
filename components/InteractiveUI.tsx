"use client";

import { useState } from "react";
import type { InteractiveElement, InteractiveUIBlock, TrainingInteraction } from "../lib/training-schema";
import HintSystem from "./learning/HintSystem";

type Feedback = { kind: "correct" | "incorrect"; message: string } | null;

function elementClass(active: boolean) {
  return `rounded-lg border p-3 transition ${
    active
      ? "border-[var(--primary)] bg-[var(--primary)]/[0.07] ring-2 ring-[var(--primary)]/25"
      : "border-[var(--border-strong)] bg-[var(--surface)]"
  }`;
}

function solutionFor(interaction: TrainingInteraction | undefined) {
  if (!interaction) return undefined;
  if (interaction.type === "click") return interaction.expectedAction;
  if (interaction.type === "input") {
    if (interaction.validation.type === "non-empty") return "Enter a value in the highlighted field.";
    return `Use a value that ${interaction.validation.type === "includes" ? "contains" : "matches"} “${interaction.validation.value}”.`;
  }
  if (interaction.type === "select") return `Select “${interaction.expectedValue}”.`;
  return `Complete these actions in order: ${interaction.steps.join(" → ")}.`;
}

function passesInputValidation(value: string, interaction: Extract<TrainingInteraction, { type: "input" }>) {
  const rule = interaction.validation;
  if (rule.type === "non-empty") return value.trim().length > 0;
  if (rule.type === "equals") return value.trim() === rule.value;
  if (rule.type === "includes") return value.toLowerCase().includes(rule.value.toLowerCase());
  try {
    return new RegExp(rule.value, rule.flags).test(value);
  } catch {
    return false;
  }
}

export default function InteractiveUI({ block }: { block: InteractiveUIBlock }) {
  const [values, setValues] = useState<Record<string, string | boolean>>({});
  const [stepIndex, setStepIndex] = useState(0);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [stepComplete, setStepComplete] = useState(false);
  const [sequenceIndex, setSequenceIndex] = useState(0);
  const step = block.mode === "guided" ? block.guidedSteps?.[stepIndex] : undefined;
  const interaction = step?.interaction;
  const activeTargetId = interaction?.type === "sequence"
    ? interaction.steps[sequenceIndex]
    : interaction?.target ?? step?.targetId;

  const gridClass = (columns: number) =>
    columns === 3 ? "grid grid-cols-1 gap-3 md:grid-cols-3" : columns === 2 ? "grid grid-cols-1 gap-3 md:grid-cols-2" : "grid grid-cols-1 gap-3";

  const displayValue = (element: InteractiveElement) => values[element.id] ?? element.value ?? "";

  function resetStep(nextIndex: number) {
    setStepIndex(nextIndex);
    setFeedback(null);
    setStepComplete(false);
    setSequenceIndex(0);
  }

  function giveFeedback(correct: boolean, correctMessage: string, incorrectMessage = "Try again. Follow the highlighted instruction.") {
    setFeedback({ kind: correct ? "correct" : "incorrect", message: correct ? correctMessage : incorrectMessage });
    if (correct) setStepComplete(true);
  }

  function recordAction(targetId: string, action: "click" | "input" | "select", value?: string) {
    if (!interaction || stepComplete) return;

    if (interaction.type === "sequence") {
      const expectedTarget = interaction.steps[sequenceIndex];
      if (targetId !== expectedTarget) {
        giveFeedback(false, "", `Try again. Complete “${expectedTarget}” before this action.`);
        return;
      }
      const isFinalAction = sequenceIndex === interaction.steps.length - 1;
      if (isFinalAction) {
        giveFeedback(true, "Correct. You completed the required sequence.");
      } else {
        setSequenceIndex((index) => index + 1);
        setFeedback({ kind: "correct", message: `Correct. Next, complete “${interaction.steps[sequenceIndex + 1]}”.` });
      }
      return;
    }

    if (interaction.target !== targetId) return;
    if (interaction.type === "click") {
      giveFeedback(action === "click", "Correct. That action advances the configuration.");
      return;
    }
    if (interaction.type === "select") {
      giveFeedback(
        action === "select" && value === interaction.expectedValue,
        "Correct. That is the expected selection.",
        `Try again. Choose the value that matches this step.`
      );
      return;
    }
    if (interaction.type === "input" && action === "input") {
      giveFeedback(
        passesInputValidation(value ?? "", interaction),
        "Correct. The value meets the configuration rule.",
        "Try again. Check the expected value and format before continuing."
      );
    }
  }

  function renderElement(element: InteractiveElement) {
    const active = activeTargetId === element.id;
    const common = { id: element.id, className: elementClass(active) };

    if (element.kind === "input" || element.kind === "textarea") {
      const Control = element.kind === "textarea" ? "textarea" : "input";
      return (
        <label key={element.id} {...common} className={`${elementClass(active)} block`}>
          {element.label && <span className="mb-1 block text-xs font-semibold text-[var(--text-mid)]">{element.label}</span>}
          <Control
            value={String(displayValue(element))}
            placeholder={element.placeholder}
            rows={element.kind === "textarea" ? 4 : undefined}
            onChange={(event) => setValues((current) => ({ ...current, [element.id]: event.target.value }))}
            onBlur={(event) => recordAction(element.id, "input", event.target.value)}
            className="w-full rounded-md border border-[var(--border-strong)] bg-[var(--surface-2)] px-3 py-2 text-sm text-[var(--text-hi)] outline-none focus:border-[var(--primary)]"
          />
        </label>
      );
    }

    if (element.kind === "select") {
      return (
        <label key={element.id} {...common} className={`${elementClass(active)} block`}>
          {element.label && <span className="mb-1 block text-xs font-semibold text-[var(--text-mid)]">{element.label}</span>}
          <select
            value={String(displayValue(element))}
            onChange={(event) => {
              setValues((current) => ({ ...current, [element.id]: event.target.value }));
              recordAction(element.id, "select", event.target.value);
            }}
            className="w-full rounded-md border border-[var(--border-strong)] bg-[var(--surface-2)] px-3 py-2 text-sm text-[var(--text-hi)] outline-none focus:border-[var(--primary)]"
          >
            <option value="">Select…</option>
            {(element.options ?? []).map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
        </label>
      );
    }

    if (element.kind === "toggle") {
      const checked = Boolean(values[element.id] ?? false);
      return (
        <button
          key={element.id}
          type="button"
          {...common}
          onClick={() => {
            setValues((current) => ({ ...current, [element.id]: !checked }));
            recordAction(element.id, "click");
          }}
          className={`${elementClass(active)} flex w-full items-center justify-between text-left`}
        >
          <span className="text-sm font-medium text-[var(--text-hi)]">{element.label ?? "Toggle"}</span>
          <span className={`h-6 w-11 rounded-full p-1 transition ${checked ? "bg-[var(--primary)]" : "bg-[var(--surface-3)]"}`}>
            <span className={`block h-4 w-4 rounded-full bg-white transition ${checked ? "translate-x-5" : ""}`} />
          </span>
        </button>
      );
    }

    if (element.kind === "button") {
      return (
        <button
          key={element.id}
          type="button"
          {...common}
          onClick={() => {
            setValues((current) => ({ ...current, [element.id]: "clicked" }));
            recordAction(element.id, "click");
          }}
          className={`${elementClass(active)} w-full bg-[var(--primary)] text-sm font-semibold text-white hover:bg-[var(--primary-dark)]`}
        >
          {element.label ?? element.text ?? "Action"}
        </button>
      );
    }

    if (element.kind === "badge") {
      return <div key={element.id} {...common} className={`${elementClass(active)} inline-flex items-center justify-center text-xs font-semibold text-[var(--primary)]`}>{element.text ?? element.label}</div>;
    }
    if (element.kind === "callout") {
      return <div key={element.id} {...common} className={`${elementClass(active)} text-sm text-[var(--text-mid)]`}>{element.text ?? element.label}</div>;
    }
    if (element.kind === "entity-card" || element.kind === "condition-row") {
      return <div key={element.id} {...common} className={`${elementClass(active)} text-sm`}><p className="font-semibold text-[var(--text-hi)]">{element.label}</p>{element.text && <p className="mt-1 text-xs text-[var(--text-mid)]">{element.text}</p>}</div>;
    }
    if (element.kind === "data-table") {
      const columns = element.columns ?? [];
      return (
        <div key={element.id} {...common} className={`${elementClass(active)} overflow-x-auto`}>
          {element.label && <p className="mb-2 text-sm font-semibold text-[var(--text-hi)]">{element.label}</p>}
          <table className="w-full text-left text-xs">
            <thead><tr>{columns.map((column) => <th key={column} className="border-b border-[var(--border)] px-2 py-2 text-[var(--text-lo)]">{column}</th>)}</tr></thead>
            <tbody>{(element.rows ?? []).map((row, index) => <tr key={index}>{columns.map((column) => <td key={column} className="border-b border-[var(--border)] px-2 py-2 text-[var(--text-mid)]">{String(row[column] ?? "")}</td>)}</tr>)}</tbody>
          </table>
        </div>
      );
    }
    return <div key={element.id} {...common} className={`${elementClass(active)} text-sm text-[var(--text-mid)]`}>{element.text ?? element.label}</div>;
  }

  const hasSteps = Boolean(block.mode === "guided" && block.guidedSteps?.length);
  const isLastStep = stepIndex === (block.guidedSteps?.length ?? 1) - 1;
  const canAdvance = !interaction || stepComplete;

  return (
    <section className="my-5 rounded-xl border border-[var(--primary)]/30 bg-[var(--surface)] p-5 shadow-sm">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border)] pb-3">
        <div>
          <span className="rounded-full bg-[var(--primary)]/[0.1] px-2.5 py-1 text-xs font-semibold text-[var(--primary)]">Interactive Practice</span>
          <p className="mt-2 text-xs text-[var(--text-lo)]">Simplified Training View — changes here are local to this lesson and never affect Epicor.</p>
        </div>
        <span className="badge-pill">{block.uiKind.replace(/-/g, " ")}</span>
      </div>

      {hasSteps && step && (
        <div className="mb-5 rounded-lg border border-[var(--primary)]/20 bg-[var(--primary)]/[0.05] p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--primary)]">Step {stepIndex + 1} of {block.guidedSteps!.length}</p>
          <h3 className="mt-1 text-sm font-semibold text-[var(--text-hi)]">{step.title}</h3>
          <p className="mt-1 text-sm text-[var(--text-mid)]">{step.instruction}</p>
          {feedback && (
            <div className={`mt-3 border-l-2 px-3 py-2 text-sm ${feedback.kind === "correct" ? "border-[var(--success)] bg-[var(--success-soft)] text-[var(--success)]" : "border-[var(--error)] bg-[var(--error-soft)] text-[var(--error)]"}`} role="status" aria-live="polite">
              <span className="font-semibold">{feedback.kind === "correct" ? "Correct." : "Try again."}</span> {feedback.message.replace(/^(Correct\.|Try again\.)\s*/, "")}
            </div>
          )}
          {stepComplete && step.whyCorrect && <p className="mt-3 text-sm leading-6 text-[var(--text-mid)]"><span className="font-semibold text-[var(--text-hi)]">Why it&apos;s correct:</span> {step.whyCorrect}</p>}
          {stepComplete && (step.nextStep || !isLastStep) && <p className="mt-2 text-sm text-[var(--text-mid)]"><span className="font-semibold text-[var(--text-hi)]">What to do next:</span> {step.nextStep ?? "Continue to the next guided step."}</p>}
          {interaction && <HintSystem hints={step.hint ? [step.hint] : []} solution={solutionFor(interaction)} />}
        </div>
      )}

      <div className="space-y-5">
        {block.sections.map((section) => (
          <div key={section.id}>
            {(section.title || section.description) && <div className="mb-2"><h3 className="text-sm font-semibold text-[var(--text-hi)]">{section.title}</h3>{section.description && <p className="text-xs text-[var(--text-lo)]">{section.description}</p>}</div>}
            <div className={gridClass(section.columns ?? 1)}>{section.elements.map(renderElement)}</div>
          </div>
        ))}
      </div>

      {hasSteps && (
        <div className="mt-6 flex items-center justify-between border-t border-[var(--border)] pt-4">
          <button type="button" disabled={stepIndex === 0} onClick={() => resetStep(Math.max(0, stepIndex - 1))} className="rounded-md border border-[var(--border-strong)] px-4 py-2 text-sm font-semibold text-[var(--text-hi)] disabled:opacity-40">← Previous</button>
          <button type="button" disabled={isLastStep || !canAdvance} onClick={() => resetStep(Math.min(block.guidedSteps!.length - 1, stepIndex + 1))} className="rounded-md bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-40">Next →</button>
        </div>
      )}
    </section>
  );
}
