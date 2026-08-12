// Versioned schema and runtime validator for AI-authored training JSON.
// schemaVersion is intentionally optional: legacy JSON that omits it remains
// valid and is interpreted as the original compatible structure.

export const TRAINING_SCHEMA_VERSION = "2.0" as const;

export type InteractiveElementKind =
  | "input"
  | "textarea"
  | "select"
  | "toggle"
  | "button"
  | "text"
  | "badge"
  | "callout"
  | "entity-card"
  | "condition-row"
  | "data-table";

export type InteractiveUiKind = "baq-designer" | "form" | "data-grid" | "generic";
export type InteractiveMode = "guided" | "free";

export interface InteractiveElement {
  id: string;
  kind: InteractiveElementKind;
  label?: string;
  placeholder?: string;
  value?: string;
  options?: string[];
  text?: string;
  variant?: "default" | "primary" | "success" | "warning" | "danger";
  rows?: { [key: string]: string | number | boolean | null }[];
  columns?: string[];
}

export interface InteractiveSection {
  id: string;
  title?: string;
  description?: string;
  columns?: 1 | 2 | 3;
  elements: InteractiveElement[];
}

export interface GuidedStep {
  id: string;
  targetId: string;
  title: string;
  instruction: string;
}

export interface InteractiveUIBlock {
  type: "InteractiveUI";
  uiKind: InteractiveUiKind;
  mode: InteractiveMode;
  guidedSteps?: GuidedStep[];
  sections: InteractiveSection[];
}

export interface ParagraphNode { type: "paragraph"; text: string }
export interface ImageNode { type: "image"; src: string; alt: string; caption?: string }
export type SlideNode = ParagraphNode | ImageNode;
export interface SlideTextBlock { type: "SlideText"; heading?: string; body: SlideNode[]; proTip?: string }
export interface VisualMockupBlock {
  type: "VisualMockup";
  mockupType: "browser" | "form" | "menu" | "dialog";
  title: string;
  elements: { label: string; kind: "input" | "button" | "text" | "panel" }[];
}
export interface FlowDiagramBlock { type: "FlowDiagram"; steps: { label: string; description?: string }[] }
export type TrainingContentBlock = SlideTextBlock | VisualMockupBlock | FlowDiagramBlock | InteractiveUIBlock;

export class TrainingSchemaError extends Error {
  constructor(public readonly path: string, message: string) {
    super(`${path}: ${message}`);
    this.name = "TrainingSchemaError";
  }
}

const elementKinds: InteractiveElementKind[] = [
  "input", "textarea", "select", "toggle", "button", "text", "badge", "callout", "entity-card", "condition-row", "data-table",
];
const uiKinds: InteractiveUiKind[] = ["baq-designer", "form", "data-grid", "generic"];

function object(value: unknown, path: string): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) throw new TrainingSchemaError(path, "must be an object");
  return value as Record<string, unknown>;
}
function string(value: unknown, path: string, required = true): string | undefined {
  if (value === undefined && !required) return undefined;
  if (typeof value !== "string" || !value.trim()) throw new TrainingSchemaError(path, "must be a non-empty string");
  return value;
}
function array(value: unknown, path: string): unknown[] {
  if (!Array.isArray(value)) throw new TrainingSchemaError(path, "must be an array");
  return value;
}
function integer(value: unknown, path: string): number {
  if (typeof value !== "number" || !Number.isInteger(value)) throw new TrainingSchemaError(path, "must be an integer");
  return value;
}

export function validateInteractiveUIBlock(raw: unknown, path = "InteractiveUI"): InteractiveUIBlock {
  const block = object(raw, path);
  if (block.type !== "InteractiveUI") throw new TrainingSchemaError(`${path}.type`, "must be InteractiveUI");
  if (!uiKinds.includes(block.uiKind as InteractiveUiKind)) {
    throw new TrainingSchemaError(`${path}.uiKind`, `must be one of ${uiKinds.join(", ")}`);
  }
  if (block.mode !== "guided" && block.mode !== "free") {
    throw new TrainingSchemaError(`${path}.mode`, "must be guided or free");
  }

  const sections = array(block.sections, `${path}.sections`).map((rawSection, sectionIndex) => {
    const section = object(rawSection, `${path}.sections[${sectionIndex}]`);
    const columns = section.columns === undefined ? 1 : integer(section.columns, `${path}.sections[${sectionIndex}].columns`);
    if (![1, 2, 3].includes(columns)) throw new TrainingSchemaError(`${path}.sections[${sectionIndex}].columns`, "must be 1, 2, or 3");
    const elements = array(section.elements, `${path}.sections[${sectionIndex}].elements`).map((rawElement, elementIndex) => {
      const element = object(rawElement, `${path}.sections[${sectionIndex}].elements[${elementIndex}]`);
      const id = string(element.id, `${path}.sections[${sectionIndex}].elements[${elementIndex}].id`)!;
      if (!elementKinds.includes(element.kind as InteractiveElementKind)) {
        throw new TrainingSchemaError(`${path}.sections[${sectionIndex}].elements[${elementIndex}].kind`, `must be one of ${elementKinds.join(", ")}`);
      }
      if (element.options !== undefined) {
        array(element.options, `${path}.sections[${sectionIndex}].elements[${elementIndex}].options`).forEach((option, i) =>
          string(option, `${path}.sections[${sectionIndex}].elements[${elementIndex}].options[${i}]`)
        );
      }
      return {
        id,
        kind: element.kind as InteractiveElementKind,
        label: string(element.label, `${path}.sections[${sectionIndex}].elements[${elementIndex}].label`, false),
        placeholder: string(element.placeholder, `${path}.sections[${sectionIndex}].elements[${elementIndex}].placeholder`, false),
        value: string(element.value, `${path}.sections[${sectionIndex}].elements[${elementIndex}].value`, false),
        options: element.options as string[] | undefined,
        text: string(element.text, `${path}.sections[${sectionIndex}].elements[${elementIndex}].text`, false),
        variant: element.variant as InteractiveElement["variant"],
        rows: element.rows as InteractiveElement["rows"],
        columns: element.columns as string[] | undefined,
      };
    });
    if (!elements.length) throw new TrainingSchemaError(`${path}.sections[${sectionIndex}].elements`, "must have at least one element");
    return {
      id: string(section.id, `${path}.sections[${sectionIndex}].id`)!,
      title: string(section.title, `${path}.sections[${sectionIndex}].title`, false),
      description: string(section.description, `${path}.sections[${sectionIndex}].description`, false),
      columns: columns as 1 | 2 | 3,
      elements,
    };
  });
  if (!sections.length) throw new TrainingSchemaError(`${path}.sections`, "must have at least one section");

  const elementIds = new Set(sections.flatMap((section) => section.elements.map((element) => element.id)));
  const guidedSteps = block.guidedSteps === undefined ? [] : array(block.guidedSteps, `${path}.guidedSteps`).map((rawStep, i) => {
    const step = object(rawStep, `${path}.guidedSteps[${i}]`);
    const targetId = string(step.targetId, `${path}.guidedSteps[${i}].targetId`)!;
    if (!elementIds.has(targetId)) throw new TrainingSchemaError(`${path}.guidedSteps[${i}].targetId`, "must reference an existing element id");
    return {
      id: string(step.id, `${path}.guidedSteps[${i}].id`)!,
      targetId,
      title: string(step.title, `${path}.guidedSteps[${i}].title`)!,
      instruction: string(step.instruction, `${path}.guidedSteps[${i}].instruction`)!,
    };
  });
  if (block.mode === "guided" && !guidedSteps.length) {
    throw new TrainingSchemaError(`${path}.guidedSteps`, "must contain at least one step when mode is guided");
  }

  return { type: "InteractiveUI", uiKind: block.uiKind as InteractiveUiKind, mode: block.mode, guidedSteps, sections };
}

export function validateTrainingBlock(raw: unknown, path: string): TrainingContentBlock {
  const block = object(raw, path);
  if (block.type === "InteractiveUI") return validateInteractiveUIBlock(raw, path);
  if (block.type === "SlideText" || block.type === "FlowDiagram" || block.type === "VisualMockup") return raw as TrainingContentBlock;
  throw new TrainingSchemaError(`${path}.type`, "must be SlideText, FlowDiagram, VisualMockup, or InteractiveUI");
}

export function validateTrainingDocument(raw: unknown): { schemaVersion?: string; courses: unknown[] } {
  const document = object(raw, "root");
  if (document.schemaVersion !== undefined && document.schemaVersion !== "2.0") {
    throw new TrainingSchemaError("schemaVersion", "must be 2.0 when provided");
  }
  return { schemaVersion: document.schemaVersion as string | undefined, courses: array(document.courses, "courses") };
}
