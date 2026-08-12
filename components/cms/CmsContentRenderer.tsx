"use client";

import { useState } from "react";
import type { ContentBlock, QuizQuestionSchema } from "../../lib/admin/types";
import { normalizeContentBlocks } from "../../lib/admin/types";
import { validateInteractiveUIBlock } from "../../lib/training-schema";
import InteractiveUI from "../InteractiveUI";
import QuizEngine from "../QuizEngine";
import LessonSection, { type LearningMode } from "../learning/LessonSection";

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
type RawBlock = { type?: unknown; mode?: unknown; questions?: unknown };

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
  const declared = explicitMode(raw.mode);
  if (declared) return declared;
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

function renderBlock(raw: unknown, normalized: ContentBlock, index: number, quizContext?: QuizContext) {
  const rawBlock = (raw && typeof raw === "object" ? raw : {}) as RawBlock;
  if (rawBlock.type === "InteractiveUI") {
    try { return <InteractiveUI key={index} block={validateInteractiveUIBlock(raw, `content[${index}]`)} />; }
    catch { return <div key={index} className="rounded-lg border border-[var(--error)]/30 bg-[var(--error-soft)] p-4 text-sm text-[var(--error)]">Interactive practice configuration is invalid.</div>; }
  }
  if (rawBlock.type === "Quiz") {
    const questions = Array.isArray(rawBlock.questions) ? rawBlock.questions.filter(isQuizQuestion) : [];
    if (!quizContext || questions.length === 0) return <div key={index} className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-4 text-sm text-[var(--text-mid)]">This knowledge check is not available yet.</div>;
    return <QuizEngine key={index} moduleSlug={quizContext.moduleSlug} moduleTitle={quizContext.moduleTitle} questions={questions.map((question, questionIndex) => ({ ...question, id: `content-quiz-${index}-${questionIndex}` }))} nextHref={quizContext.nextHref} />;
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
