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
  value: ContentBlock[];
  onChange: (blocks: ContentBlock[]) => void;
}) {
  function updateBlock(i: number, block: ContentBlock) {
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
      {value.map((block, i) => (
        <div key={i} className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              {block.type}
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
          {block.type === "SlideText" && <SlideTextEditor block={block} onChange={(b) => updateBlock(i, b)} />}
          {block.type === "VisualMockup" && <VisualMockupEditor block={block} onChange={(b) => updateBlock(i, b)} />}
          {block.type === "FlowDiagram" && <FlowDiagramEditor block={block} onChange={(b) => updateBlock(i, b)} />}
        </div>
      ))}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onChange([...value, newSlideText()])}
          className="rounded-md border border-dashed border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-500 hover:border-slate-400 hover:text-slate-700"
        >
          + Text block
        </button>
        <button
          type="button"
          onClick={() => onChange([...value, newVisualMockup()])}
          className="rounded-md border border-dashed border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-500 hover:border-slate-400 hover:text-slate-700"
        >
          + Visual mockup
        </button>
        <button
          type="button"
          onClick={() => onChange([...value, newFlowDiagram()])}
          className="rounded-md border border-dashed border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-500 hover:border-slate-400 hover:text-slate-700"
        >
          + Flow diagram
        </button>
      </div>
    </div>
  );
}
