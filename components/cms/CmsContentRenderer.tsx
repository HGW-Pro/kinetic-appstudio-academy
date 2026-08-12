"use client";

import { useState } from "react";
import type { ContentBlock } from "../../lib/admin/types";

function renderBold(text: string) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : <span key={i}>{part}</span>
  );
}

function SlideTextRenderer({ block }: { block: Extract<ContentBlock, { type: "SlideText" }> }) {
  const [lightbox, setLightbox] = useState<{ src: string; alt: string; caption?: string } | null>(null);

  return (
    <div className="space-y-4">
      {block.heading && <h3 className="text-lg font-semibold text-[var(--text-hi)]">{block.heading}</h3>}
      {block.body.map((node, i) =>
        node.type === "paragraph" ? (
          <p key={i} className="text-sm leading-relaxed text-[var(--text-mid)]">
            {renderBold(node.text)}
          </p>
        ) : (
          <button
            key={i}
            type="button"
            onClick={() => setLightbox(node)}
            className="block overflow-hidden rounded-lg border border-[var(--border)] transition hover:border-[var(--primary)]"
          >
            <img src={node.src} alt={node.alt} className="max-h-80 w-full object-contain bg-[var(--surface-2)]" />
            {node.caption && (
              <span className="block bg-[var(--surface-2)] px-3 py-1.5 text-left text-xs text-[var(--text-lo)]">
                {node.caption}
              </span>
            )}
          </button>
        )
      )}
      {block.proTip && (
        <div className="rounded-lg border border-[var(--primary)]/20 bg-[var(--primary)]/[0.05] px-4 py-3 text-sm text-[var(--text-mid)]">
          <span className="mr-2 font-semibold text-[var(--primary)]">💡 Pro tip:</span>
          {block.proTip}
        </div>
      )}

      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={() => setLightbox(null)}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-xl text-white hover:bg-white/20"
          >
            ✕
          </button>
          <div className="flex max-h-[85vh] max-w-[90vw] flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <img src={lightbox.src} alt={lightbox.alt} className="max-h-[75vh] max-w-full rounded-lg object-contain shadow-2xl" />
            {lightbox.caption && <p className="mt-3 max-w-xl text-center text-sm text-white/80">{lightbox.caption}</p>}
          </div>
        </div>
      )}
    </div>
  );
}

function VisualMockupRenderer({ block }: { block: Extract<ContentBlock, { type: "VisualMockup" }> }) {
  const frameStyle =
    block.mockupType === "browser"
      ? "rounded-lg border border-slate-300"
      : block.mockupType === "dialog"
      ? "rounded-xl border-2 border-slate-300 shadow-lg"
      : block.mockupType === "menu"
      ? "rounded-md border border-slate-300"
      : "rounded-lg border border-slate-300";

  return (
    <div className="my-2">
      {block.title && <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--text-lo)]">{block.title}</p>}
      <div className={`overflow-hidden bg-white ${frameStyle}`}>
        {block.mockupType === "browser" && (
          <div className="flex items-center gap-1.5 border-b border-slate-200 bg-slate-100 px-3 py-2">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
          </div>
        )}
        <div className="space-y-2 p-4">
          {block.elements.map((el, i) =>
            el.kind === "button" ? (
              <div key={i} className="inline-block rounded-md bg-[var(--primary)] px-3 py-1.5 text-xs font-semibold text-white">
                {el.label}
              </div>
            ) : el.kind === "input" ? (
              <div key={i}>
                <label className="block text-[10px] text-slate-400">{el.label}</label>
                <div className="mt-0.5 h-7 w-full rounded border border-slate-300 bg-slate-50" />
              </div>
            ) : el.kind === "panel" ? (
              <div key={i} className="rounded border border-dashed border-slate-300 bg-slate-50 px-3 py-4 text-center text-[11px] text-slate-400">
                {el.label}
              </div>
            ) : (
              <p key={i} className="text-xs text-slate-600">
                {el.label}
              </p>
            )
          )}
        </div>
      </div>
    </div>
  );
}

function FlowDiagramRenderer({ block }: { block: Extract<ContentBlock, { type: "FlowDiagram" }> }) {
  return (
    <div className="my-2 flex flex-wrap items-stretch gap-2">
      {block.steps.map((step, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="min-w-[120px] rounded-lg border border-[var(--primary)]/30 bg-[var(--primary)]/[0.05] px-3 py-2 text-center">
            <p className="text-xs font-semibold text-[var(--primary)]">{step.label}</p>
            {step.description && <p className="mt-0.5 text-[11px] text-[var(--text-lo)]">{step.description}</p>}
          </div>
          {i < block.steps.length - 1 && <span className="shrink-0 text-[var(--text-lo)]">→</span>}
        </div>
      ))}
    </div>
  );
}

export default function CmsContentRenderer({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="space-y-6">
      {blocks.map((block, i) => (
        <div key={i}>
          {block.type === "SlideText" && <SlideTextRenderer block={block} />}
          {block.type === "VisualMockup" && <VisualMockupRenderer block={block} />}
          {block.type === "FlowDiagram" && <FlowDiagramRenderer block={block} />}
        </div>
      ))}
    </div>
  );
}
