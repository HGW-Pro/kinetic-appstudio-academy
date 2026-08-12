import { z } from "zod";

// Versioned schema and runtime validator for AI-authored training JSON.
// schemaVersion is intentionally optional: legacy JSON that omits it remains
// valid and is interpreted as the original compatible structure.
//
// Rewritten on top of Zod (previously hand-rolled type guards). Every
// exported type and function signature below is unchanged from the
// pre-Zod version -- this is a pure internal-implementation swap so
// lib/training-import.ts and any admin component importing from here
// keeps working without modification.

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

// ---------------------------------------------------------------------------
// Zod schemas (internal). Kept 1:1 with the field-level rules the original
// hand-rolled validator enforced: non-empty strings, columns in {1,2,3},
// at least one section/element, guidedSteps targetId must reference a real
// element id, and guided mode requires at least one guided step.
// ---------------------------------------------------------------------------

const nonEmptyString = z.string().trim().min(1, "must be a non-empty string");

const elementKinds = [
  "input", "textarea", "select", "toggle", "button", "text", "badge", "callout", "entity-card", "condition-row", "data-table",
] as const;
const uiKinds = ["baq-designer", "form", "data-grid", "generic"] as const;

const ElementKindSchema = z.enum(elementKinds, {
  errorMap: () => ({ message: `must be one of ${elementKinds.join(", ")}` }),
});
const UiKindSchema = z.enum(uiKinds, {
  errorMap: () => ({ message: `must be one of ${uiKinds.join(", ")}` }),
});
const ModeSchema = z.enum(["guided", "free"], {
  errorMap: () => ({ message: "must be guided or free" }),
});
const VariantSchema = z.enum(["default", "primary", "success", "warning", "danger"]).optional();

const InteractiveElementSchema = z.object({
  id: nonEmptyString,
  kind: ElementKindSchema,
  label: nonEmptyString.optional(),
  placeholder: nonEmptyString.optional(),
  value: nonEmptyString.optional(),
  options: z.array(nonEmptyString).optional(),
  text: nonEmptyString.optional(),
  variant: VariantSchema,
  rows: z.array(z.record(z.union([z.string(), z.number(), z.boolean(), z.null()]))).optional(),
  columns: z.array(z.string()).optional(),
});

const InteractiveSectionSchema = z.object({
  id: nonEmptyString,
  title: nonEmptyString.optional(),
  description: nonEmptyString.optional(),
  columns: z
    .union([z.literal(1), z.literal(2), z.literal(3)], {
      errorMap: () => ({ message: "must be 1, 2, or 3" }),
    })
    .optional()
    .default(1),
  elements: z.array(InteractiveElementSchema).min(1, "must have at least one element"),
});

const GuidedStepSchema = z.object({
  id: nonEmptyString,
  targetId: nonEmptyString,
  title: nonEmptyString,
  instruction: nonEmptyString,
});

const InteractiveUIBlockSchema = z
  .object({
    type: z.literal("InteractiveUI"),
    uiKind: UiKindSchema,
    mode: ModeSchema,
    guidedSteps: z.array(GuidedStepSchema).optional().default([]),
    sections: z.array(InteractiveSectionSchema).min(1, "must have at least one section"),
  })
  .superRefine((block, ctx) => {
    const elementIds = new Set(block.sections.flatMap((s) => s.elements.map((e) => e.id)));
    block.guidedSteps.forEach((step, i) => {
      if (!elementIds.has(step.targetId)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "must reference an existing element id",
          path: ["guidedSteps", i, "targetId"],
        });
      }
    });
    if (block.mode === "guided" && block.guidedSteps.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "must contain at least one step when mode is guided",
        path: ["guidedSteps"],
      });
    }
  });

const TrainingDocumentSchema = z.object({
  schemaVersion: z
    .literal("2.0", { errorMap: () => ({ message: "must be 2.0 when provided" }) })
    .optional(),
  courses: z.array(z.unknown()).min(1, "must be a non-empty array"),
});

// Formats a Zod issue path (mix of string keys and numeric array indices)
// into the same dotted/bracketed notation the original hand-rolled
// validator produced, e.g. "InteractiveUI.sections[0].elements[2].kind".
function formatPath(basePath: string, issuePath: (string | number)[]): string {
  let out = basePath;
  for (const segment of issuePath) {
    if (typeof segment === "number") {
      out += `[${segment}]`;
    } else {
      out += out ? `.${segment}` : segment;
    }
  }
  return out;
}

function throwFirstIssue(basePath: string, result: z.SafeParseReturnType<unknown, unknown>): never {
  if (result.success) throw new Error("throwFirstIssue called on a successful parse");
  const issue = result.error.issues[0];
  throw new TrainingSchemaError(formatPath(basePath, issue.path), issue.message);
}

export function validateInteractiveUIBlock(raw: unknown, path = "InteractiveUI"): InteractiveUIBlock {
  const result = InteractiveUIBlockSchema.safeParse(raw);
  if (!result.success) throwFirstIssue(path, result);
  return result.data as InteractiveUIBlock;
}

export function validateTrainingBlock(raw: unknown, path: string): TrainingContentBlock {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
    throw new TrainingSchemaError(path, "must be an object");
  }
  const block = raw as Record<string, unknown>;
  if (block.type === "InteractiveUI") return validateInteractiveUIBlock(raw, path);
  if (block.type === "SlideText" || block.type === "FlowDiagram" || block.type === "VisualMockup") {
    return raw as TrainingContentBlock;
  }
  throw new TrainingSchemaError(`${path}.type`, "must be SlideText, FlowDiagram, VisualMockup, or InteractiveUI");
}

export function validateTrainingDocument(raw: unknown): { schemaVersion?: string; courses: unknown[] } {
  const result = TrainingDocumentSchema.safeParse(raw);
  if (!result.success) throwFirstIssue("root", result);
  return result.data;
}

// ---------------------------------------------------------------------------
// Client-side helper for BulkImportForm: validates the full pasted document
// (schemaVersion + courses[].topics[].subtopics[].content[] InteractiveUI
// blocks) and returns EVERY issue found, each with a best-effort line
// number computed against the original raw JSON text.
//
// Line numbers are approximate, not from a full JSON AST position tracker:
// for each Zod issue path, we walk the raw text searching for each path
// segment in order (quoted key names for string segments; the nth "{"
// after the current position for numeric array-index segments) and take
// the line of wherever that search lands. This works well for typically
// formatted AI-generated JSON (one field per line) but can drift on
// unusually compact or reordered JSON -- flagged as "~line N" rather than
// asserted as exact, since JSON.parse itself discards source positions
// before validation ever runs.
// ---------------------------------------------------------------------------

export interface TrainingValidationIssue {
  path: string;
  message: string;
  approxLine: number | null;
}

function approxLineFor(raw: string, pathSegments: (string | number)[]): number | null {
  let cursor = 0;
  for (const segment of pathSegments) {
    if (typeof segment === "number") {
      let occurrences = 0;
      let idx = cursor;
      let found = -1;
      while (occurrences <= segment) {
        idx = raw.indexOf("{", idx);
        if (idx === -1) break;
        found = idx;
        occurrences++;
        idx += 1;
      }
      if (found === -1) return null;
      cursor = found;
    } else {
      const needle = `"${segment}"`;
      const idx = raw.indexOf(needle, cursor);
      if (idx === -1) return null;
      cursor = idx;
    }
  }
  return raw.slice(0, cursor).split("\n").length;
}

// Deep-validates every InteractiveUI content block nested anywhere inside
// courses[].topics[].subtopics[].content[], plus the top-level
// schemaVersion/courses shape, collecting ALL issues instead of throwing
// on the first one (unlike validateTrainingDocument/validateTrainingBlock,
// which intentionally fail-fast for the admin editors that call them
// one-object-at-a-time).
export function validateTrainingDocumentDetailed(rawText: string): {
  valid: boolean;
  courseCount: number;
  issues: TrainingValidationIssue[];
} {
  let parsed: unknown;
  try {
    parsed = JSON.parse(rawText);
  } catch (e) {
    return {
      valid: false,
      courseCount: 0,
      issues: [{ path: "root", message: e instanceof Error ? e.message : "Invalid JSON", approxLine: null }],
    };
  }

  const docResult = TrainingDocumentSchema.safeParse(parsed);
  if (!docResult.success) {
    return {
      valid: false,
      courseCount: 0,
      issues: docResult.error.issues.map((issue) => ({
        path: formatPath("root", issue.path),
        message: issue.message,
        approxLine: approxLineFor(rawText, issue.path),
      })),
    };
  }

  const issues: TrainingValidationIssue[] = [];
  const courses = docResult.data.courses as Record<string, unknown>[];

  courses.forEach((course, ci) => {
    const topics = Array.isArray(course.topics) ? (course.topics as Record<string, unknown>[]) : [];
    topics.forEach((topic, ti) => {
      const subtopics = Array.isArray(topic.subtopics) ? (topic.subtopics as Record<string, unknown>[]) : [];
      subtopics.forEach((subtopic, si) => {
        const content = Array.isArray(subtopic.content) ? (subtopic.content as unknown[]) : [];
        content.forEach((block, bi) => {
          const basePath = `courses[${ci}].topics[${ti}].subtopics[${si}].content[${bi}]`;
          const basePathSegments: (string | number)[] = [
            "courses", ci, "topics", ti, "subtopics", si, "content", bi,
          ];
          if (
            typeof block !== "object" ||
            block === null ||
            (block as Record<string, unknown>).type !== "InteractiveUI"
          ) {
            return;
          }
          const blockResult = InteractiveUIBlockSchema.safeParse(block);
          if (!blockResult.success) {
            for (const issue of blockResult.error.issues) {
              issues.push({
                path: formatPath(basePath, issue.path),
                message: issue.message,
                approxLine: approxLineFor(rawText, [...basePathSegments, ...issue.path]),
              });
            }
          }
        });
      });
    });
  });

  return { valid: issues.length === 0, courseCount: courses.length, issues };
}
