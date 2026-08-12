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

// 2.1 adds composable learning-experience blocks and expected actions for
// guided interactions.  Documents declaring 2.0 (and documents with no
// version) remain valid so already-imported CMS JSON is unaffected.
export const TRAINING_SCHEMA_VERSION = "2.1" as const;

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
  /** Optional in 2.0-compatible content. New guided steps should provide it. */
  interaction?: TrainingInteraction;
  hint?: string;
  whyCorrect?: string;
  nextStep?: string;
}

export type InputValidationRule =
  | { type: "equals"; value: string }
  | { type: "includes"; value: string }
  | { type: "pattern"; value: string; flags?: string }
  | { type: "non-empty" };

export type TrainingInteraction =
  | { type: "click"; target: string; expectedAction: string }
  | { type: "input"; target: string; validation: InputValidationRule }
  | { type: "select"; target: string; expectedValue: string }
  | { type: "sequence"; steps: string[] };

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
export interface CalloutBlock { type: "Callout"; title?: string; body: string; tone?: "info" | "success" | "neutral" }
export interface ProTipBlock { type: "ProTip"; title?: string; body: string }
export interface WarningBlock { type: "Warning"; title?: string; body: string }
export interface StepSequenceBlock { type: "StepSequence"; title?: string; steps: { title: string; detail?: string }[] }
export interface ComparisonBlock {
  type: "Comparison";
  title?: string;
  columns: { title: string; items: string[] }[];
}
export interface WhyThisMattersBlock { type: "WhyThisMatters"; body: string; items?: string[] }
export interface UsedLaterBlock { type: "UsedLater"; items: string[]; title?: string }
export interface PracticeExerciseBlock {
  type: "PracticeExercise";
  title: string;
  objective?: string;
  instructions: string[];
  hints?: string[];
  solution?: string;
}
export interface DebuggingChallengeBlock {
  type: "DebuggingChallenge";
  title?: string;
  scenario: string;
  flow?: { label: string; description?: string }[];
  question?: string;
  options: string[];
  correctIndex: number;
  rootCause: string;
  nextStep?: string;
}
export type TrainingContentBlock =
  | SlideTextBlock
  | VisualMockupBlock
  | FlowDiagramBlock
  | InteractiveUIBlock
  | CalloutBlock
  | ProTipBlock
  | WarningBlock
  | StepSequenceBlock
  | ComparisonBlock
  | WhyThisMattersBlock
  | UsedLaterBlock
  | PracticeExerciseBlock
  | DebuggingChallengeBlock;

export class TrainingSchemaError extends Error {
  constructor(public readonly path: string, message: string) {
    super(`${path}: ${message}`);
    this.name = "TrainingSchemaError";
  }
}

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
  interaction: z
    .discriminatedUnion("type", [
      z.object({ type: z.literal("click"), target: nonEmptyString, expectedAction: nonEmptyString }),
      z.object({
        type: z.literal("input"),
        target: nonEmptyString,
        validation: z.discriminatedUnion("type", [
          z.object({ type: z.literal("equals"), value: nonEmptyString }),
          z.object({ type: z.literal("includes"), value: nonEmptyString }),
          z.object({ type: z.literal("pattern"), value: nonEmptyString, flags: z.string().optional() }),
          z.object({ type: z.literal("non-empty") }),
        ]),
      }),
      z.object({ type: z.literal("select"), target: nonEmptyString, expectedValue: nonEmptyString }),
      z.object({ type: z.literal("sequence"), steps: z.array(nonEmptyString).min(2, "must contain at least two actions") }),
    ])
    .optional(),
  hint: nonEmptyString.optional(),
  whyCorrect: nonEmptyString.optional(),
  nextStep: nonEmptyString.optional(),
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
      if (step.interaction?.type !== "sequence" && step.interaction && !elementIds.has(step.interaction.target)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "must reference an existing element id",
          path: ["guidedSteps", i, "interaction", "target"],
        });
      }
      if (step.interaction?.type !== "sequence" && step.interaction && step.interaction.target !== step.targetId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "must match targetId",
          path: ["guidedSteps", i, "interaction", "target"],
        });
      }
      if (step.interaction?.type === "sequence") {
        step.interaction.steps.forEach((target, sequenceIndex) => {
          if (!elementIds.has(target)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "must reference an existing element id",
              path: ["guidedSteps", i, "interaction", "steps", sequenceIndex],
            });
          }
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

const SlideNodeSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("paragraph"), text: nonEmptyString }),
  z.object({ type: z.literal("image"), src: nonEmptyString, alt: z.string(), caption: z.string().optional() }),
]);
const SlideTextBlockSchema = z.object({
  type: z.literal("SlideText"),
  heading: z.string().optional(),
  body: z.array(SlideNodeSchema).min(1, "must have at least one node"),
  proTip: z.string().optional(),
});
const VisualMockupBlockSchema = z.object({
  type: z.literal("VisualMockup"),
  mockupType: z.enum(["browser", "form", "menu", "dialog"]),
  title: nonEmptyString,
  elements: z.array(z.object({ label: nonEmptyString, kind: z.enum(["input", "button", "text", "panel"]) })),
});
const FlowStepSchema = z.object({ label: nonEmptyString, description: z.string().optional() });
const FlowDiagramBlockSchema = z.object({ type: z.literal("FlowDiagram"), steps: z.array(FlowStepSchema).min(1, "must have at least one step") });
const CalloutBlockSchema = z.object({
  type: z.literal("Callout"),
  title: z.string().optional(),
  body: nonEmptyString,
  tone: z.enum(["info", "success", "neutral"]).optional(),
});
const ProTipBlockSchema = z.object({ type: z.literal("ProTip"), title: z.string().optional(), body: nonEmptyString });
const WarningBlockSchema = z.object({ type: z.literal("Warning"), title: z.string().optional(), body: nonEmptyString });
const StepSequenceBlockSchema = z.object({
  type: z.literal("StepSequence"),
  title: z.string().optional(),
  steps: z.array(z.object({ title: nonEmptyString, detail: z.string().optional() })).min(1, "must have at least one step"),
});
const ComparisonBlockSchema = z.object({
  type: z.literal("Comparison"),
  title: z.string().optional(),
  columns: z.array(z.object({ title: nonEmptyString, items: z.array(nonEmptyString).min(1) })).min(2, "must compare at least two columns"),
});
const WhyThisMattersBlockSchema = z.object({
  type: z.literal("WhyThisMatters"),
  body: nonEmptyString,
  items: z.array(nonEmptyString).optional(),
});
const UsedLaterBlockSchema = z.object({
  type: z.literal("UsedLater"),
  title: z.string().optional(),
  items: z.array(nonEmptyString).min(1, "must contain at least one dependency"),
});
const PracticeExerciseBlockSchema = z.object({
  type: z.literal("PracticeExercise"),
  title: nonEmptyString,
  objective: z.string().optional(),
  instructions: z.array(nonEmptyString).min(1, "must have at least one instruction"),
  hints: z.array(nonEmptyString).optional(),
  solution: z.string().optional(),
});
const DebuggingChallengeBlockSchema = z.object({
  type: z.literal("DebuggingChallenge"),
  title: z.string().optional(),
  scenario: nonEmptyString,
  flow: z.array(FlowStepSchema).optional(),
  question: z.string().optional(),
  options: z.array(nonEmptyString).min(2, "must have at least two choices"),
  correctIndex: z.number().int().nonnegative(),
  rootCause: nonEmptyString,
  nextStep: z.string().optional(),
}).superRefine((block, ctx) => {
  if (block.correctIndex >= block.options.length) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "must be a valid index into options", path: ["correctIndex"] });
  }
});

const TrainingContentBlockSchema = z.union([
  SlideTextBlockSchema,
  VisualMockupBlockSchema,
  FlowDiagramBlockSchema,
  InteractiveUIBlockSchema,
  CalloutBlockSchema,
  ProTipBlockSchema,
  WarningBlockSchema,
  StepSequenceBlockSchema,
  ComparisonBlockSchema,
  WhyThisMattersBlockSchema,
  UsedLaterBlockSchema,
  PracticeExerciseBlockSchema,
  DebuggingChallengeBlockSchema,
]);

const TrainingDocumentSchema = z.object({
  schemaVersion: z
    .enum(["2.0", "2.1"], { errorMap: () => ({ message: "must be 2.0 or 2.1 when provided" }) })
    .optional(),
  courses: z.array(z.unknown()).min(1, "must be a non-empty array"),
});

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
  // Keep the original three block shapes permissive. Existing imports predate
  // the Zod validator and can contain legacy-compatible node variations that
  // the renderer already normalizes safely.
  const legacyType = (raw as Record<string, unknown>).type;
  if (legacyType === "SlideText" || legacyType === "VisualMockup" || legacyType === "FlowDiagram") {
    return raw as TrainingContentBlock;
  }
  const result = TrainingContentBlockSchema.safeParse(raw);
  if (!result.success) throwFirstIssue(path, result);
  return result.data as TrainingContentBlock;
}

export function validateTrainingDocument(raw: unknown): { schemaVersion?: string; courses: unknown[] } {
  const result = TrainingDocumentSchema.safeParse(raw);
  if (!result.success) throwFirstIssue("root", result);

  // Zod's inferred object output becomes optional-property shaped under this
  // project's TypeScript settings, despite the schema requiring courses.min(1).
  // Normalize to the long-standing public function contract after safeParse
  // has already proved the runtime shape.
  return {
    schemaVersion: result.data.schemaVersion,
    courses: result.data.courses as unknown[],
  };
}

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
  const courses = (docResult.data.courses ?? []) as Record<string, unknown>[];

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
          if (typeof block !== "object" || block === null) return;
          const blockType = (block as Record<string, unknown>).type;
          if (blockType === "SlideText" || blockType === "VisualMockup" || blockType === "FlowDiagram") return;
          const blockResult = TrainingContentBlockSchema.safeParse(block);
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
