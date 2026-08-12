"use client";

import { useState } from "react";
import type { ContentBlock, SlideNode } from "../../lib/admin/types";
import ImageUploader from "./ImageUploader";

function newSlideText(): ContentBlock {
  return { type: "SlideText", body: [{ type: "paragraph", text: "" }] };
}
function newVisualMockup(): ContentBlock {
  return { type: "VisualMockup", mockupType: "form", title: "", elements: [] };
}
function newFlowDiagram(): ContentBlock {
  return { type: "FlowDiagram", steps: [{ label: "" }] };
}
const templates: Record<string, () => Record<string, unknown>> = {
  Callout: () => ({ type: "Callout", title: "Key point", body: "", tone: "info" }),
  ProTip: () => ({ type: "ProTip", title: "Pro tip", body: "" }),
  Warning: () => ({ type: "Warning", title: "Watch out", body: "" }),
  StepSequence: () => ({ type: "StepSequence", title: "Steps", steps: [{ title: "", detail: "" }] }),
  Comparison: () => ({ type: "Comparison", title: "Compare", columns: [{ title: "Option A", items: [""] }, { title: "Option B", items: [""] }] }),
  WhyThisMatters: () => ({ type: "WhyThisMatters", body: "", items: [""] }),
  UsedLater: () => ({ type: "UsedLater", title: "Used later in", items: [""] }),
  PracticeExercise: () => ({ type: "PracticeExercise", title: "Practice", objective: "", instructions: [""], hints: [""], solution: "" }),
  "Debugging Challenge": () => ({ type: "DebuggingChallenge", title: "Debug this customization", scenario: "", question: "What is wrong?", options: ["", ""], correctIndex: 0, rootCause: "", nextStep: "" }),
  "Simulator Challenge": () => ({ type: "SimulatorChallenge", id: "simulator-challenge-id", title: "Build a Kinetic experience", intro: "", businessRequirement: "", requiredComponents: [{ component: "TextBox", label: "Customer ID", binding: "Customer.CustID", required: true }], hints: [""], solution: "" }),
};

function moveItem<T>(arr: T[], from: number, to: number): T[] {
  if (to < 0 || to >= arr.length) return arr;
  const copy = [...arr];
  const [item] = copy.splice(from, 1);
  copy.splice(to, 0, item);
  return copy;
}

// Inline "insertion slot" shown between body nodes, letting an admin drop
// a new paragraph or image at an exact position — e.g. "after this
// paragraph" — instead of images always being appended at the end.
function InsertSlot({ onInsertParagraph, onInsertImage }: { onInsertParagraph: () => void; onInsertImage: (url: string) => void }) {
  const [showUploader, setShowUploader] = useState(false);
  return (
    <div className="group relative flex items-center gap-2 py-1">
      <div className="h-px flex-1 bg-slate-200 opacity-0 transition group-hover:opacity-100" />
      <div className="flex gap-1 opacity-0 transition group-hover:opacity-100">
        <button
          type="button"
          onClick={onInsertParagraph}
          className="rounded border border-slate-300 bg-white px-2 py-0.5 text-[11px] font-semibold text-slate-600 hover:bg-slate-50"
        >
          + Text here
        </button>
        <button
          type="button"
          onClick={() => setShowUploader((s) => !s)}
          className="rounded border border-slate-300 bg-white px-2 py-0.5 text-[11px] font-semibold text-slate-600 hover:bg-slate-50"
        >
          + Image here
        </button>
      </div>
      <div className="h-px flex-1 bg-slate-200 opacity-0 transition group-hover:opacity-100" />
      {showUploader && (
        <div className="absolute left-0 top-full z-10 mt-1 w-72 rounded-lg border border-slate-300 bg-white p-3 shadow-lg">
          <ImageUploader
            label="Upload image to insert at this position"
            pathPrefix="subtopics"
            onUploaded={(url) => {
              onInsertImage(url);
              setShowUploader(false);
            }}
          />
          <button
            type="button"
            onClick={() => setShowUploader(false)}
            className="mt-2 text-xs text-slate-400 hover:text-slate-600"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

function SlideTextEditor({
  block,
  onChange,
}: {
  block: Extract<ContentBlock, { type: "SlideText" }>;
  onChange: (b: ContentBlock) => void;
}) {
  function setBody(body: SlideNode[]) {
    onChange({ ...block, body });
  }
  function insertAt(index: number, node: SlideNode) {
    const body = [...block.body];
    body.splice(index, 0, node);
    setBody(body);
  }
  function updateNode(index: number, node: SlideNode) {
    const body = [...block.body];
    body[index] = node;
    setBody(body);
  }
  function removeNode(index: number) {
    setBody(block.body.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-3">
      <input
        value={block.heading ?? ""}
        onChange={(e) => onChange({ ...block, heading: e.target.value })}
        placeholder="Heading (optional)"
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold focus:border-slate-500 focus:outline-none"
      />

      <InsertSlot
        onInsertParagraph={() => insertAt(0, { type: "paragraph", text: "" })}
        onInsertImage={(url) => insertAt(0, { type: "image", src: url, alt: "" })}
      />

      {block.body.map((node, i) => (
        <div key={i}>
          {node.type === "paragraph" ? (
            <div className="flex items-start gap-2">
              <textarea
                value={node.text}
                onChange={(e) => updateNode(i, { type: "paragraph", text: e.target.value })}
                rows={3}
                placeholder="Paragraph text — use **bold** for emphasis"
                className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => removeNode(i)}
                className="mt-1 shrink-0 text-xs text-red-500 hover:text-red-700"
                title="Remove paragraph"
              >
                ✕
              </button>
            </div>
          ) : (
            <div className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
              <img src={node.src} alt={node.alt || "preview"} className="h-16 w-16 shrink-0 rounded object-cover" />
              <div className="flex-1 space-y-2">
                <input
                  value={node.alt}
                  onChange={(e) => updateNode(i, { ...node, alt: e.target.value })}
                  placeholder="Alt text (required, describes the image)"
                  className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-xs focus:border-slate-500 focus:outline-none"
                />
                <input
                  value={node.caption ?? ""}
                  onChange={(e) => updateNode(i, { ...node, caption: e.target.value })}
                  placeholder="Caption (optional)"
                  className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-xs focus:border-slate-500 focus:outline-none"
                />
              </div>
              <button
                type="button"
                onClick={() => removeNode(i)}
                className="shrink-0 text-xs text-red-500 hover:text-red-700"
                title="Remove image"
              >
                ✕
              </button>
            </div>
          )}
          <InsertSlot
            onInsertParagraph={() => insertAt(i + 1, { type: "paragraph", text: "" })}
            onInsertImage={(url) => insertAt(i + 1, { type: "image", src: url, alt: "" })}
          />
        </div>
      ))}

      <textarea
        value={block.proTip ?? ""}
        onChange={(e) => onChange({ ...block, proTip: e.target.value || undefined })}
        rows={2}
        placeholder="Pro tip (optional, shown in a highlighted callout)"
        className="w-full rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm focus:border-amber-400 focus:outline-none"
      />
    </div>
  );
}

function VisualMockupEditor({
  block,
  onChange,
}: {
  block: Extract<ContentBlock, { type: "VisualMockup" }>;
  onChange: (b: ContentBlock) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          value={block.title}
          onChange={(e) => onChange({ ...block, title: e.target.value })}
          placeholder="Mockup title"
          className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
        />
        <select
          value={block.mockupType}
          onChange={(e) => onChange({ ...block, mockupType: e.target.value as any })}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
        >
          <option value="browser">browser</option>
          <option value="form">form</option>
          <option value="menu">menu</option>
          <option value="dialog">dialog</option>
        </select>
      </div>
      {block.elements.map((el, i) => (
        <div key={i} className="flex gap-2">
          <input
            value={el.label}
            onChange={(e) => {
              const elements = [...block.elements];
              elements[i] = { ...el, label: e.target.value };
              onChange({ ...block, elements });
            }}
            placeholder="Element label"
            className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
          />
          <select
            value={el.kind}
            onChange={(e) => {
              const elements = [...block.elements];
              elements[i] = { ...el, kind: e.target.value as any };
              onChange({ ...block, elements });
            }}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
          >
            <option value="input">input</option>
            <option value="button">button</option>
            <option value="text">text</option>
            <option value="panel">panel</option>
          </select>
          <button
            type="button"
            onClick={() => onChange({ ...block, elements: block.elements.filter((_, j) => j !== i) })}
            className="text-xs text-red-500 hover:text-red-700"
          >
            ✕
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange({ ...block, elements: [...block.elements, { label: "", kind: "input" }] })}
        className="text-xs font-semibold text-slate-500 hover:text-slate-700"
      >
        + Add element
      </button>
    </div>
  );
}

function FlowDiagramEditor({
  block,
  onChange,
}: {
  block: Extract<ContentBlock, { type: "FlowDiagram" }>;
  onChange: (b: ContentBlock) => void;
}) {
  return (
    <div className="space-y-2">
      {block.steps.map((step, i) => (
        <div key={i} className="flex gap-2">
          <span className="mt-2 text-xs font-semibold text-slate-400">{i + 1}.</span>
          <input
            value={step.label}
            onChange={(e) => {
              const steps = [...block.steps];
              steps[i] = { ...step, label: e.target.value };
              onChange({ ...block, steps });
            }}
            placeholder="Step label"
            className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
          />
          <input
            value={step.description ?? ""}
            onChange={(e) => {
              const steps = [...block.steps];
              steps[i] = { ...step, description: e.target.value || undefined };
              onChange({ ...block, steps });
            }}
            placeholder="Description (optional)"
            className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => onChange({ ...block, steps: block.steps.filter((_, j) => j !== i) })}
            className="text-xs text-red-500 hover:text-red-700"
          >
            ✕
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange({ ...block, steps: [...block.steps, { label: "" }] })}
        className="text-xs font-semibold text-slate-500 hover:text-slate-700"
      >
        + Add step
      </button>
    </div>
  );
}

export default function ContentBlockEditor({
  value,
  onChange,
}: {
  value: unknown[];
  onChange: (blocks: unknown[]) => void;
}) {
  const [newType, setNewType] = useState("SlideText");
  function updateBlock(i: number, block: unknown) {
    const blocks = [...value];
    blocks[i] = block;
    onChange(blocks);
  }
  function removeBlock(i: number) {
    onChange(value.filter((_, j) => j !== i));
  }
  function move(i: number, dir: -1 | 1) {
    onChange(moveItem(value, i, i + dir));
  }

  return (
    <div className="space-y-4">
      {value.map((block, i) => {
        const legacy = block as ContentBlock;
        const isLegacy = legacy?.type === "SlideText" || legacy?.type === "VisualMockup" || legacy?.type === "FlowDiagram";
        return (
        <div key={i} className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              {typeof block === "object" && block !== null && typeof (block as { type?: unknown }).type === "string" ? (block as { type: string }).type : "Unknown"}
            </span>
            <div className="flex gap-2 text-xs text-slate-400">
              <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="hover:text-slate-700 disabled:opacity-30">
                ↑
              </button>
              <button
                type="button"
                onClick={() => move(i, 1)}
                disabled={i === value.length - 1}
                className="hover:text-slate-700 disabled:opacity-30"
              >
                ↓
              </button>
              <button type="button" onClick={() => removeBlock(i)} className="text-red-500 hover:text-red-700">
                Remove block
              </button>
            </div>
          </div>
          {legacy.type === "SlideText" && <SlideTextEditor block={legacy} onChange={(b) => updateBlock(i, b)} />}
          {legacy.type === "VisualMockup" && <VisualMockupEditor block={legacy} onChange={(b) => updateBlock(i, b)} />}
          {legacy.type === "FlowDiagram" && <FlowDiagramEditor block={legacy} onChange={(b) => updateBlock(i, b)} />}
          {!isLegacy && <ExperienceEditor block={block} onChange={(next) => updateBlock(i, next)} />}
        </div>
        );
      })}

      <div className="flex flex-wrap gap-2">
        <select value={newType} onChange={(event) => setNewType(event.target.value)} className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600">
          <option value="SlideText">Text block</option><option value="VisualMockup">Visual mockup</option><option value="FlowDiagram">Flow diagram</option>
          {Object.keys(templates).map((type) => <option key={type} value={type}>{type}</option>)}
        </select>
        <button type="button" onClick={() => {
          const block = newType === "SlideText" ? newSlideText() : newType === "VisualMockup" ? newVisualMockup() : newType === "FlowDiagram" ? newFlowDiagram() : templates[newType]();
          onChange([...value, block]);
        }} className="rounded-md border border-dashed border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-500 hover:border-slate-400 hover:text-slate-700">
          + Add selected block
        </button>
      </div>
    </div>
  );
}

function ExperienceEditor({ block, onChange }: { block: unknown; onChange: (next: unknown) => void }) {
  if (!block || typeof block !== "object") return <TemplateEditor block={block} onChange={onChange} />;
  const value = block as Record<string, unknown>;
  const type = typeof value.type === "string" ? value.type : "";
  const simpleCallout = type === "Callout" || type === "ProTip" || type === "Warning";
  if (simpleCallout) {
    return <div className="space-y-3">
      <input value={typeof value.title === "string" ? value.title : ""} onChange={(event) => onChange({ ...value, title: event.target.value })} placeholder="Title (optional)" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none" />
      <textarea value={typeof value.body === "string" ? value.body : ""} onChange={(event) => onChange({ ...value, body: event.target.value })} rows={3} placeholder="Message" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none" />
      {type === "Callout" && <select value={typeof value.tone === "string" ? value.tone : "info"} onChange={(event) => onChange({ ...value, tone: event.target.value })} className="rounded-md border border-slate-300 px-3 py-2 text-sm"><option value="info">Info</option><option value="success">Success</option><option value="neutral">Neutral</option></select>}
    </div>;
  }
  if (type === "WhyThisMatters" || type === "UsedLater") {
    const items = Array.isArray(value.items) ? value.items.filter((item): item is string => typeof item === "string") : [];
    return <div className="space-y-3">
      {type === "UsedLater" && <input value={typeof value.title === "string" ? value.title : ""} onChange={(event) => onChange({ ...value, title: event.target.value })} placeholder="Section title" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />}
      {type === "WhyThisMatters" && <textarea value={typeof value.body === "string" ? value.body : ""} onChange={(event) => onChange({ ...value, body: event.target.value })} rows={3} placeholder="Why this matters" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />}
      <textarea value={items.join("\n")} onChange={(event) => onChange({ ...value, items: event.target.value.split("\n").map((item) => item.trim()).filter(Boolean) })} rows={3} placeholder="One item per line" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
    </div>;
  }
  return <TemplateEditor block={block} onChange={onChange} />;
}

function TemplateEditor({ block, onChange }: { block: unknown; onChange: (next: unknown) => void }) {
  const [raw, setRaw] = useState(JSON.stringify(block, null, 2));
  const [error, setError] = useState<string | null>(null);
  return (
    <div className="space-y-2">
      <p className="text-xs leading-5 text-slate-500">This advanced learning block starts from a guided template. Edit its fields here; it will be validated when the lesson is saved.</p>
      <textarea value={raw} onChange={(event) => { const next = event.target.value; setRaw(next); try { onChange(JSON.parse(next)); setError(null); } catch { setError("Keep this template valid JSON while editing."); } }} rows={12} spellCheck={false} className="w-full rounded-md border border-slate-300 bg-slate-900 p-3 font-mono text-xs text-slate-100 focus:border-slate-500 focus:outline-none" />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
