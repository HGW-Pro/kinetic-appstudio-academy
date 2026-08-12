"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import type { ContentBlock, QuizQuestionSchema } from "../../lib/admin/types";
import { normalizeContentBlocks } from "../../lib/admin/types";
import { validateInteractiveUIBlock, validateTrainingBlock, type DebuggingChallengeBlock, type TrainingContentBlock } from "../../lib/training-schema";
import InteractiveUI from "../InteractiveUI";
import QuizEngine from "../QuizEngine";
import ChallengePanel from "../learning/ChallengePanel";
import LessonSection, { type LearningMode } from "../learning/LessonSection";
import PracticeExercise from "../learning/PracticeExercise";

const KineticSimulator = dynamic(() => import("../simulator/KineticSimulator"), {
  ssr: false,
  loading: () => <div className="border border-[var(--border)] bg-[var(--surface-2)] p-4 text-sm text-[var(--text-mid)]">Loading the Kinetic simulator…</div>,
});

function renderBold(text: string) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) => i % 2 === 1 ? <strong key={i}>{part}</strong> : <span key={i}>{part}</span>);
}

function SlideTextRenderer({ block }: { block: Extract<ContentBlock, { type: "SlideText" }> }) {
  const [lightbox, setLightbox] = useState<{ src: string; alt: string; caption?: string } | null>(null);
  return <div className="space-y-4">
    {block.heading && <h2 className="text-lg font-semibold text-[var(--text-hi)]">{block.heading}</h2>}
    {block.body.map((node, i) => node.type === "paragraph" ? <p key={i} className="text-sm leading-7 text-[var(--text-mid)]">{renderBold(node.text)}</p> : <button key={i} type="button" onClick={() => setLightbox(node)} className="block overflow-hidden rounded-lg border border-[var(--border)] hover:border-[var(--primary)]"><img src={node.src} alt={node.alt} className="max-h-80 w-full object-contain bg-[var(--surface-2)]" />{node.caption && <span className="block bg-[var(--surface-2)] px-3 py-1.5 text-left text-xs text-[var(--text-lo)]">{node.caption}</span>}</button>)}
    {block.proTip && <div className="rounded-lg border border-[var(--primary)]/20 bg-[var(--primary)]/[0.05] px-4 py-3 text-sm text-[var(--text-mid)]"><span className="mr-2 font-semibold text-[var(--primary)]">Pro tip:</span>{block.proTip}</div>}
    {lightbox && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm" onClick={() => setLightbox(null)} role="dialog" aria-modal="true" aria-label="Expanded lesson image"><button type="button" onClick={() => setLightbox(null)} className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-xl text-white hover:bg-white/20" aria-label="Close image">✕</button><div className="flex max-h-[85vh] max-w-[90vw] flex-col items-center" onClick={(event) => event.stopPropagation()}><img src={lightbox.src} alt={lightbox.alt} className="max-h-[75vh] max-w-full rounded-lg object-contain shadow-2xl" />{lightbox.caption && <p className="mt-3 max-w-xl text-center text-sm text-white/80">{lightbox.caption}</p>}</div></div>}
  </div>;
}

function VisualMockupRenderer({ block }: { block: Extract<ContentBlock, { type: "VisualMockup" }> }) {
  const frame = block.mockupType === "dialog" ? "rounded-xl border-2 border-slate-300 shadow-lg" : "rounded-lg border border-slate-300";
  return <div className="my-2">{block.title && <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--text-lo)]">{block.title}</p>}<div className={`overflow-hidden bg-white ${frame}`}>{block.mockupType === "browser" && <div className="flex gap-1.5 border-b border-slate-200 bg-slate-100 px-3 py-2"><span className="h-2.5 w-2.5 rounded-full bg-red-400" /><span className="h-2.5 w-2.5 rounded-full bg-yellow-400" /><span className="h-2.5 w-2.5 rounded-full bg-green-400" /></div>}<div className="space-y-2 p-4">{block.elements.map((element, i) => element.kind === "button" ? <div key={i} className="inline-block rounded-md bg-[var(--primary)] px-3 py-1.5 text-xs font-semibold text-white">{element.label}</div> : element.kind === "input" ? <div key={i}><label className="block text-xs text-slate-500">{element.label}</label><div className="mt-0.5 h-7 w-full rounded border border-slate-300 bg-slate-50" /></div> : element.kind === "panel" ? <div key={i} className="rounded border border-dashed border-slate-300 bg-slate-50 px-3 py-4 text-center text-xs text-slate-500">{element.label}</div> : <p key={i} className="text-xs text-slate-600">{element.label}</p>)}</div></div></div>;
}

function FlowDiagramRenderer({ block }: { block: Extract<ContentBlock, { type: "FlowDiagram" }> }) {
  return <div className="my-2 flex flex-wrap items-stretch gap-2">{block.steps.map((step, i) => <div key={i} className="flex items-center gap-2"><div className="min-w-[120px] rounded-lg border border-[var(--primary)]/30 bg-[var(--primary)]/[0.05] px-3 py-2 text-center"><p className="text-xs font-semibold text-[var(--primary)]">{step.label}</p>{step.description && <p className="mt-0.5 text-xs text-[var(--text-lo)]">{step.description}</p>}</div>{i < block.steps.length - 1 && <span className="shrink-0 text-[var(--text-lo)]">→</span>}</div>)}</div>;
}

type QuizContext = { moduleSlug: string; moduleTitle: string; nextHref?: string };
type RawBlock = { type?: unknown; mode?: unknown; learningMode?: unknown; questions?: unknown };

function explicitMode(value: unknown): LearningMode | null {
  if (typeof value !== "string") return null;
  const normalized = value.trim().toLowerCase();
  if (normalized === "learn") return "Learn";
  if (normalized === "see") return "See";
  if (normalized === "explore") return "Explore";
  if (normalized === "practice") return "Practice";
  if (normalized === "challenge") return "Challenge";
  if (normalized === "knowledge check" || normalized === "knowledge-check" || normalized === "assessment") return "Knowledge Check";
  return null;
}

function inferMode(raw: RawBlock): LearningMode {
  const declared = explicitMode(raw.learningMode) ?? explicitMode(raw.mode);
  if (declared) return declared;
  if (raw.type === "DebuggingChallenge" || raw.type === "SimulatorChallenge") return "Challenge";
  if (raw.type === "PracticeExercise") return "Practice";
  if (raw.type === "InteractiveUI") return "Explore";
  if (raw.type === "Quiz") return "Knowledge Check";
  if (raw.type === "VisualMockup" || raw.type === "FlowDiagram") return "See";
  return "Learn";
}

function isQuizQuestion(value: unknown): value is QuizQuestionSchema {
  if (!value || typeof value !== "object") return false;
  const question = value as Record<string, unknown>;
  return typeof question.question === "string" && Array.isArray(question.options) && typeof question.correctIndex === "number" && typeof question.explanation === "string";
}

function DebuggingChallenge({ block }: { block: DebuggingChallengeBlock }) {
  const [selected, setSelected] = useState<number | null>(null);
  const answered = selected !== null;
  const correct = selected === block.correctIndex;

  return (
    <ChallengePanel title={block.title ?? "Debug this customization"} scenario={block.scenario}>
      {block.flow && block.flow.length > 0 && <FlowDiagramRenderer block={{ type: "FlowDiagram", steps: block.flow }} />}
      <fieldset className="mt-5">
        <legend className="text-base font-semibold text-[var(--text-hi)]">{block.question ?? "What is wrong?"}</legend>
        <div className="mt-3 space-y-2">
          {block.options.map((option, optionIndex) => {
            const isSelected = selected === optionIndex;
            const style = answered && optionIndex === block.correctIndex
              ? "border-[var(--success)]/50 bg-[var(--success-soft)] text-[var(--success)]"
              : answered && isSelected
                ? "border-[var(--error)]/50 bg-[var(--error-soft)] text-[var(--error)]"
                : "border-[var(--border)] bg-[var(--surface)] text-[var(--text-mid)] hover:border-[var(--primary)]";
            return <button key={`${option}-${optionIndex}`} type="button" disabled={answered} onClick={() => setSelected(optionIndex)} className={`w-full border px-4 py-3 text-left text-sm transition disabled:cursor-default ${style}`}>{option}</button>;
          })}
        </div>
      </fieldset>
      {answered && (
        <div className={`mt-4 border-l-2 px-4 py-3 text-sm leading-6 ${correct ? "border-[var(--success)] bg-[var(--success-soft)]" : "border-[var(--error)] bg-[var(--error-soft)]"}`} role="status">
          <p className={`font-semibold ${correct ? "text-[var(--success)]" : "text-[var(--error)]"}`}>{correct ? "Correct." : "Not quite."}</p>
          <p className="mt-1 text-[var(--text-mid)]"><span className="font-semibold text-[var(--text-hi)]">Root cause:</span> {block.rootCause}</p>
          {block.nextStep && <p className="mt-1 text-[var(--text-mid)]"><span className="font-semibold text-[var(--text-hi)]">What to do next:</span> {block.nextStep}</p>}
        </div>
      )}
    </ChallengePanel>
  );
}

function ExperienceBlockRenderer({ block }: { block: Exclude<TrainingContentBlock, { type: "InteractiveUI" | "SlideText" | "VisualMockup" | "FlowDiagram" | "SimulatorChallenge" }> }) {
  if (block.type === "Callout") {
    const tones = { info: "border-[var(--primary)]/30 bg-[var(--primary)]/[0.05]", success: "border-[var(--success)]/30 bg-[var(--success-soft)]", neutral: "border-[var(--border)] bg-[var(--surface-2)]" };
    return <aside className={`border-l-4 px-4 py-3 text-sm leading-6 text-[var(--text-mid)] ${tones[block.tone ?? "info"]}`}><p className="font-semibold text-[var(--text-hi)]">{block.title ?? "Key point"}</p><p className="mt-1">{block.body}</p></aside>;
  }
  if (block.type === "ProTip") return <aside className="border-l-4 border-[var(--primary)] bg-[var(--primary)]/[0.05] px-4 py-3 text-sm leading-6 text-[var(--text-mid)]"><p className="font-semibold text-[var(--primary)]">{block.title ?? "Pro tip"}</p><p className="mt-1">{block.body}</p></aside>;
  if (block.type === "Warning") return <aside className="border-l-4 border-[var(--accent)] bg-[var(--accent-soft)] px-4 py-3 text-sm leading-6 text-[var(--text-mid)]"><p className="font-semibold text-[var(--accent)]">{block.title ?? "Watch out"}</p><p className="mt-1">{block.body}</p></aside>;
  if (block.type === "WhyThisMatters") return <aside className="border border-[var(--primary)]/25 bg-[var(--primary)]/[0.04] p-5"><p className="text-xs font-semibold uppercase tracking-[0.13em] text-[var(--primary)]">Why this matters</p><p className="mt-2 text-sm leading-6 text-[var(--text-mid)]">{block.body}</p>{block.items && block.items.length > 0 && <ul className="mt-3 space-y-2 text-sm text-[var(--text-mid)]">{block.items.map((item, index) => <li key={`${item}-${index}`} className="flex gap-2"><span className="text-[var(--primary)]">•</span><span>{item}</span></li>)}</ul>}</aside>;
  if (block.type === "UsedLater") return <aside className="border-l-4 border-[var(--success)] bg-[var(--success-soft)] px-5 py-4"><p className="text-xs font-semibold uppercase tracking-[0.13em] text-[var(--success)]">{block.title ?? "Used later in"}</p><ul className="mt-3 space-y-2 text-sm text-[var(--text-mid)]">{block.items.map((item, index) => <li key={`${item}-${index}`} className="flex gap-2"><span className="font-semibold text-[var(--success)]">→</span><span>{item}</span></li>)}</ul></aside>;
  if (block.type === "StepSequence") return <section><h3 className="text-base font-semibold text-[var(--text-hi)]">{block.title ?? "Steps"}</h3><ol className="mt-4 space-y-3">{block.steps.map((step, index) => <li key={`${step.title}-${index}`} className="flex gap-3 border-l-2 border-[var(--primary)]/25 pl-4"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--primary)] text-xs font-semibold text-white">{index + 1}</span><span><span className="block text-sm font-semibold text-[var(--text-hi)]">{step.title}</span>{step.detail && <span className="mt-0.5 block text-sm leading-6 text-[var(--text-mid)]">{step.detail}</span>}</span></li>)}</ol></section>;
  if (block.type === "Comparison") return <section><h3 className="text-base font-semibold text-[var(--text-hi)]">{block.title ?? "Compare the options"}</h3><div className="mt-4 grid gap-px overflow-hidden border border-[var(--border)] bg-[var(--border)] sm:grid-cols-2">{block.columns.map((column, index) => <div key={`${column.title}-${index}`} className="bg-[var(--surface)] p-4"><h4 className="text-sm font-semibold text-[var(--text-hi)]">{column.title}</h4><ul className="mt-3 space-y-2 text-sm text-[var(--text-mid)]">{column.items.map((item, itemIndex) => <li key={`${item}-${itemIndex}`} className="flex gap-2"><span className="text-[var(--primary)]">•</span><span>{item}</span></li>)}</ul></div>)}</div></section>;
  if (block.type === "PracticeExercise") return <PracticeExercise title={block.title} objective={block.objective} instructions={block.instructions} hints={block.hints} solution={block.solution} />;
  return <DebuggingChallenge block={block} />;
}

function renderBlock(raw: unknown, normalized: ContentBlock, index: number, quizContext?: QuizContext) {
  const rawBlock = (raw && typeof raw === "object" ? raw : {}) as RawBlock;
  if (rawBlock.type === "InteractiveUI") {
    try { return <InteractiveUI key={index} block={validateInteractiveUIBlock(raw, `content[${index}]`)} />; }
    catch { return <div key={index} className="rounded-lg border border-[var(--error)]/30 bg-[var(--error-soft)] p-4 text-sm text-[var(--error)]">Interactive practice configuration is invalid.</div>; }
  }
  if (rawBlock.type === "Quiz") {
    const questions = Array.isArray(rawBlock.questions) ? rawBlock.questions.filter(isQuizQuestion) : [];
    if (!quizContext || questions.length === 0) return <div key={index} className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-4 text-sm text-[var(--text-mid)]">This knowledge check is not available yet.</div>;
    return <QuizEngine key={index} moduleSlug={quizContext.moduleSlug} moduleTitle={quizContext.moduleTitle} label="Knowledge Check" questions={questions.map((question, questionIndex) => ({ ...question, id: `content-quiz-${index}-${questionIndex}` }))} nextHref={quizContext.nextHref} />;
  }
  if (rawBlock.type === "SimulatorChallenge") {
    try {
      const block = validateTrainingBlock(raw, `content[${index}]`);
      if (block.type === "SimulatorChallenge") return <KineticSimulator key={index} challenge={block} />;
    } catch {
      return <div key={index} className="rounded-lg border border-[var(--error)]/30 bg-[var(--error-soft)] p-4 text-sm text-[var(--error)]">This simulator challenge configuration is invalid.</div>;
    }
  }
  if (["Callout", "ProTip", "Warning", "StepSequence", "Comparison", "WhyThisMatters", "UsedLater", "PracticeExercise", "DebuggingChallenge"].includes(String(rawBlock.type))) {
    try {
      const block = validateTrainingBlock(raw, `content[${index}]`);
      if (block.type !== "InteractiveUI" && block.type !== "SlideText" && block.type !== "VisualMockup" && block.type !== "FlowDiagram" && block.type !== "SimulatorChallenge") return <ExperienceBlockRenderer key={index} block={block} />;
    } catch {
      return <div key={index} className="rounded-lg border border-[var(--error)]/30 bg-[var(--error-soft)] p-4 text-sm text-[var(--error)]">This learning block configuration is invalid.</div>;
    }
  }
  return <div key={index}>{normalized.type === "SlideText" && <SlideTextRenderer block={normalized} />}{normalized.type === "VisualMockup" && <VisualMockupRenderer block={normalized} />}{normalized.type === "FlowDiagram" && <FlowDiagramRenderer block={normalized} />}</div>;
}

// Mode metadata remains optional. Existing JSON is normalized exactly as before,
// while an author may later add `mode` without any schema migration.
export default function CmsContentRenderer({ blocks, quizContext }: { blocks: unknown[]; quizContext?: QuizContext }) {
  const normalized = normalizeContentBlocks(blocks);
  const groups: { mode: LearningMode; entries: { raw: unknown; block: ContentBlock; index: number }[] }[] = [];
  normalized.forEach((block, index) => {
    const raw = blocks[index];
    const mode = inferMode((raw && typeof raw === "object" ? raw : {}) as RawBlock);
    const current = groups[groups.length - 1];
    const entry = { raw, block, index };
    if (current?.mode === mode) current.entries.push(entry);
    else groups.push({ mode, entries: [entry] });
  });
  return <div className="space-y-8">{groups.map((group, groupIndex) => <LessonSection key={`${group.mode}-${groupIndex}`} mode={group.mode}><div className="space-y-6">{group.entries.map((entry) => renderBlock(entry.raw, entry.block, entry.index, quizContext))}</div></LessonSection>)}</div>;
}
