// Shared TypeScript types + runtime validators for the Admin CMS.
// These mirror the Postgres schema in supabase/migrations exactly.

export type ContentBlockType = "SlideText" | "VisualMockup" | "FlowDiagram";

// SlideText.body is an ORDERED array of nodes rather than a flat string[]
// with a separate images[] array, so an image can be placed after a
// specific paragraph instead of always being grouped at the end.
export interface ParagraphNode {
  type: "paragraph";
  text: string;
}
export interface ImageNode {
  type: "image";
  src: string;
  alt: string;
  caption?: string;
}
export type SlideNode = ParagraphNode | ImageNode;

export interface SlideTextBlock {
  type: "SlideText";
  heading?: string;
  body: SlideNode[];
  proTip?: string;
}

export interface VisualMockupBlock {
  type: "VisualMockup";
  mockupType: "browser" | "form" | "menu" | "dialog";
  title: string;
  elements: { label: string; kind: "input" | "button" | "text" | "panel" }[];
}

export interface FlowDiagramBlock {
  type: "FlowDiagram";
  steps: { label: string; description?: string }[];
}

export type ContentBlock = SlideTextBlock | VisualMockupBlock | FlowDiagramBlock;

export interface QuizQuestionSchema {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface CourseRecord {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  sequence_order: number;
  created_at: string;
  updated_at: string;
}

export interface TopicRecord {
  id: string;
  course_id: string;
  title: string;
  slug: string;
  sequence_order: number;
  created_at: string;
  updated_at: string;
}

export interface SubtopicRecord {
  id: string;
  topic_id: string;
  title: string;
  sequence_order: number;
  content_json: ContentBlock[];
  created_at: string;
  updated_at: string;
}

export interface QuizRecord {
  id: string;
  subtopic_id: string;
  questions_json: QuizQuestionSchema[];
  created_at: string;
  updated_at: string;
}

// ---------- Bulk import payload shape (single course) ----------

export interface BulkImportSubtopic {
  title: string;
  sequence_order?: number;
  content_json: ContentBlock[];
  quiz?: { questions_json: QuizQuestionSchema[] };
}

export interface BulkImportTopic {
  title: string;
  slug: string;
  sequence_order?: number;
  subtopics: BulkImportSubtopic[];
}

export interface BulkImportPayload {
  course: {
    title: string;
    slug: string;
    description?: string;
    image_url?: string;
    sequence_order?: number;
  };
  topics: BulkImportTopic[];
}

// ---------- Validation ----------

export class ValidationError extends Error {
  public readonly path: string;
  constructor(path: string, message: string) {
    super(`${path}: ${message}`);
    this.path = path;
    this.name = "ValidationError";
  }
}

const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

function assertString(value: unknown, path: string, opts: { minLen?: number } = {}): string {
  if (typeof value !== "string") throw new ValidationError(path, "must be a string");
  const trimmed = value.trim();
  if (opts.minLen && trimmed.length < opts.minLen) {
    throw new ValidationError(path, `must be at least ${opts.minLen} character(s)`);
  }
  return value;
}

function assertSlug(value: unknown, path: string): string {
  const s = assertString(value, path, { minLen: 1 });
  if (!SLUG_RE.test(s)) {
    throw new ValidationError(path, "must be a lowercase-kebab-case slug (e.g. 'my-topic-1')");
  }
  return s;
}

function assertNumber(value: unknown, path: string): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new ValidationError(path, "must be a finite number");
  }
  return value;
}

function assertArray(value: unknown, path: string): unknown[] {
  if (!Array.isArray(value)) throw new ValidationError(path, "must be an array");
  return value;
}

function validateSlideNode(node: unknown, path: string): SlideNode {
  if (typeof node !== "object" || node === null) {
    throw new ValidationError(path, "must be an object");
  }
  const n = node as Record<string, unknown>;
  if (n.type === "paragraph") {
    return { type: "paragraph", text: assertString(n.text, `${path}.text`, { minLen: 1 }) };
  }
  if (n.type === "image") {
    return {
      type: "image",
      src: assertString(n.src, `${path}.src`, { minLen: 1 }),
      alt: assertString(n.alt, `${path}.alt`, { minLen: 1 }),
      caption: n.caption !== undefined ? assertString(n.caption, `${path}.caption`) : undefined,
    };
  }
  throw new ValidationError(`${path}.type`, "must be 'paragraph' or 'image'");
}

export function validateContentBlock(block: unknown, path: string): ContentBlock {
  if (typeof block !== "object" || block === null) {
    throw new ValidationError(path, "must be an object");
  }
  const b = block as Record<string, unknown>;
  const type = b.type;

  if (type === "SlideText") {
    const bodyRaw = assertArray(b.body, `${path}.body`);
    if (bodyRaw.length === 0) throw new ValidationError(`${path}.body`, "must have at least one node");
    const body = bodyRaw.map((n, i) => validateSlideNode(n, `${path}.body[${i}]`));
    return {
      type: "SlideText",
      heading: b.heading !== undefined ? assertString(b.heading, `${path}.heading`) : undefined,
      body,
      proTip: b.proTip !== undefined ? assertString(b.proTip, `${path}.proTip`) : undefined,
    };
  }

  if (type === "VisualMockup") {
    const mockupType = assertString(b.mockupType, `${path}.mockupType`, { minLen: 1 });
    if (!["browser", "form", "menu", "dialog"].includes(mockupType)) {
      throw new ValidationError(`${path}.mockupType`, "must be one of browser|form|menu|dialog");
    }
    const elements = assertArray(b.elements, `${path}.elements`).map((el, i) => {
      if (typeof el !== "object" || el === null) {
        throw new ValidationError(`${path}.elements[${i}]`, "must be an object");
      }
      const e = el as Record<string, unknown>;
      const kind = assertString(e.kind, `${path}.elements[${i}].kind`, { minLen: 1 });
      if (!["input", "button", "text", "panel"].includes(kind)) {
        throw new ValidationError(`${path}.elements[${i}].kind`, "must be one of input|button|text|panel");
      }
      return { label: assertString(e.label, `${path}.elements[${i}].label`, { minLen: 1 }), kind: kind as any };
    });
    return {
      type: "VisualMockup",
      mockupType: mockupType as VisualMockupBlock["mockupType"],
      title: assertString(b.title, `${path}.title`, { minLen: 1 }),
      elements,
    };
  }

  if (type === "FlowDiagram") {
    const steps = assertArray(b.steps, `${path}.steps`).map((s, i) => {
      if (typeof s !== "object" || s === null) {
        throw new ValidationError(`${path}.steps[${i}]`, "must be an object");
      }
      const st = s as Record<string, unknown>;
      return {
        label: assertString(st.label, `${path}.steps[${i}].label`, { minLen: 1 }),
        description: st.description !== undefined ? assertString(st.description, `${path}.steps[${i}].description`) : undefined,
      };
    });
    if (steps.length === 0) throw new ValidationError(`${path}.steps`, "must have at least one step");
    return { type: "FlowDiagram", steps };
  }

  throw new ValidationError(`${path}.type`, "must be one of SlideText|VisualMockup|FlowDiagram");
}

export function validateQuizQuestion(q: unknown, path: string): QuizQuestionSchema {
  if (typeof q !== "object" || q === null) throw new ValidationError(path, "must be an object");
  const qq = q as Record<string, unknown>;
  const options = assertArray(qq.options, `${path}.options`).map((o, i) =>
    assertString(o, `${path}.options[${i}]`, { minLen: 1 })
  );
  if (options.length < 2 || options.length > 6) {
    throw new ValidationError(`${path}.options`, "must have between 2 and 6 options");
  }
  const correctIndex = assertNumber(qq.correctIndex, `${path}.correctIndex`);
  if (!Number.isInteger(correctIndex) || correctIndex < 0 || correctIndex >= options.length) {
    throw new ValidationError(`${path}.correctIndex`, "must be a valid index into options");
  }
  return {
    question: assertString(qq.question, `${path}.question`, { minLen: 1 }),
    options,
    correctIndex,
    explanation: assertString(qq.explanation, `${path}.explanation`, { minLen: 1 }),
  };
}

export function validateBulkImportPayload(raw: unknown): BulkImportPayload {
  if (typeof raw !== "object" || raw === null) {
    throw new ValidationError("root", "payload must be a JSON object");
  }
  const r = raw as Record<string, unknown>;

  if (typeof r.course !== "object" || r.course === null) {
    throw new ValidationError("course", "is required and must be an object");
  }
  const c = r.course as Record<string, unknown>;
  const course: BulkImportPayload["course"] = {
    title: assertString(c.title, "course.title", { minLen: 1 }),
    slug: assertSlug(c.slug, "course.slug"),
    description: c.description !== undefined ? assertString(c.description, "course.description") : undefined,
    image_url: c.image_url !== undefined ? assertString(c.image_url, "course.image_url") : undefined,
    sequence_order: c.sequence_order !== undefined ? assertNumber(c.sequence_order, "course.sequence_order") : undefined,
  };

  const topicsRaw = assertArray(r.topics ?? [], "topics");
  if (topicsRaw.length === 0) {
    throw new ValidationError("topics", "must contain at least one topic");
  }

  const topics: BulkImportTopic[] = topicsRaw.map((t, ti) => {
    if (typeof t !== "object" || t === null) throw new ValidationError(`topics[${ti}]`, "must be an object");
    const tt = t as Record<string, unknown>;
    const subtopicsRaw = assertArray(tt.subtopics ?? [], `topics[${ti}].subtopics`);
    if (subtopicsRaw.length === 0) {
      throw new ValidationError(`topics[${ti}].subtopics`, "must contain at least one subtopic");
    }
    const subtopics: BulkImportSubtopic[] = subtopicsRaw.map((s, si) => {
      if (typeof s !== "object" || s === null) {
        throw new ValidationError(`topics[${ti}].subtopics[${si}]`, "must be an object");
      }
      const ss = s as Record<string, unknown>;
      const contentRaw = assertArray(ss.content_json ?? [], `topics[${ti}].subtopics[${si}].content_json`);
      if (contentRaw.length === 0) {
        throw new ValidationError(
          `topics[${ti}].subtopics[${si}].content_json`,
          "must contain at least one content block"
        );
      }
      const content_json = contentRaw.map((block, bi) =>
        validateContentBlock(block, `topics[${ti}].subtopics[${si}].content_json[${bi}]`)
      );

      let quiz: BulkImportSubtopic["quiz"];
      if (ss.quiz !== undefined) {
        if (typeof ss.quiz !== "object" || ss.quiz === null) {
          throw new ValidationError(`topics[${ti}].subtopics[${si}].quiz`, "must be an object");
        }
        const qz = ss.quiz as Record<string, unknown>;
        const questionsRaw = assertArray(
          qz.questions_json ?? [],
          `topics[${ti}].subtopics[${si}].quiz.questions_json`
        );
        quiz = {
          questions_json: questionsRaw.map((q, qi) =>
            validateQuizQuestion(q, `topics[${ti}].subtopics[${si}].quiz.questions_json[${qi}]`)
          ),
        };
      }

      return {
        title: assertString(ss.title, `topics[${ti}].subtopics[${si}].title`, { minLen: 1 }),
        sequence_order:
          ss.sequence_order !== undefined
            ? assertNumber(ss.sequence_order, `topics[${ti}].subtopics[${si}].sequence_order`)
            : undefined,
        content_json,
        quiz,
      };
    });

    return {
      title: assertString(tt.title, `topics[${ti}].title`, { minLen: 1 }),
      slug: assertSlug(tt.slug, `topics[${ti}].slug`),
      sequence_order: tt.sequence_order !== undefined ? assertNumber(tt.sequence_order, `topics[${ti}].sequence_order`) : undefined,
      subtopics,
    };
  });

  return { course, topics };
}

// ---------- Shuffle helpers ----------
function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function shuffleQuizQuestion(q: QuizQuestionSchema): QuizQuestionSchema {
  const order = shuffle(q.options.map((_, i) => i));
  const options = order.map((i) => q.options[i]);
  const correctIndex = order.indexOf(q.correctIndex);
  return { ...q, options, correctIndex };
}

export function shuffleQuestions(questions: QuizQuestionSchema[]): QuizQuestionSchema[] {
  return questions.map(shuffleQuizQuestion);
}

export function shuffleBulkImportPayload(payload: BulkImportPayload): BulkImportPayload {
  return {
    ...payload,
    topics: payload.topics.map((t) => ({
      ...t,
      subtopics: t.subtopics.map((s) => ({
        ...s,
        quiz: s.quiz ? { questions_json: shuffleQuestions(s.quiz.questions_json) } : undefined,
      })),
    })),
  };
}

// ---------- Multi-course bulk import ----------

export interface MultiCourseBulkImportPayload {
  courses: BulkImportPayload[];
}

function validateBulkImportPayloadPrefixed(raw: unknown, prefix: string): BulkImportPayload {
  try {
    return validateBulkImportPayload(raw);
  } catch (err) {
    if (err instanceof ValidationError) {
      throw new ValidationError(`${prefix}.${err.path}`, err.message.split(": ").slice(1).join(": ") || err.message);
    }
    throw err;
  }
}

export function validateMultiCourseBulkImportPayload(raw: unknown): MultiCourseBulkImportPayload {
  if (typeof raw !== "object" || raw === null) {
    throw new ValidationError("root", "payload must be a JSON object");
  }
  const r = raw as Record<string, unknown>;

  if (r.course !== undefined && r.courses === undefined) {
    return { courses: [validateBulkImportPayload(raw)] };
  }

  const coursesRaw = assertArray(r.courses, "courses");
  if (coursesRaw.length === 0) {
    throw new ValidationError("courses", "must contain at least one course");
  }
  return { courses: coursesRaw.map((c, i) => validateBulkImportPayloadPrefixed(c, `courses[${i}]`)) };
}

export function resolveImageSrc(src: string, supabaseUrl: string): string {
  if (/^https?:\/\//i.test(src)) return src;
  const base = supabaseUrl.replace(/\/+$/, "");
  const cleanPath = src.replace(/^\/+/, "");
  return `${base}/storage/v1/object/public/course-assets/${cleanPath}`;
}

export function resolveImagesInPayload(payload: BulkImportPayload, supabaseUrl: string): BulkImportPayload {
  return {
    ...payload,
    course: {
      ...payload.course,
      image_url: payload.course.image_url ? resolveImageSrc(payload.course.image_url, supabaseUrl) : undefined,
    },
    topics: payload.topics.map((t) => ({
      ...t,
      subtopics: t.subtopics.map((s) => ({
        ...s,
        content_json: s.content_json.map((block) => {
          if (block.type !== "SlideText") return block;
          return {
            ...block,
            body: block.body.map((node) =>
              node.type === "image" ? { ...node, src: resolveImageSrc(node.src, supabaseUrl) } : node
            ),
          };
        }),
      })),
    })),
  };
}

export function resolveImagesInMultiPayload(
  payload: MultiCourseBulkImportPayload,
  supabaseUrl: string
): MultiCourseBulkImportPayload {
  return { courses: payload.courses.map((c) => resolveImagesInPayload(c, supabaseUrl)) };
}

// ---------- Backward-compatible normalization ----------
// Subtopics migrated before the SlideText.body schema changed from a flat
// string[] to an ordered SlideNode[] still have old-shape data sitting in
// the database (content_json body items are plain strings, not
// {type:"paragraph"|"image"} objects). Without this, the admin editor's
// SlideTextEditor sees `node.type` as undefined on every item, fails to
// match "paragraph", falls through to rendering it as a broken image block
// with empty fields — which is exactly why previously-migrated subtopics
// appeared completely empty in the editor. This normalizes on load so old
// records display correctly; saving through the editor afterward persists
// them in the current correct shape, self-healing the record permanently.
export function normalizeContentBlocks(blocks: unknown): ContentBlock[] {
  if (!Array.isArray(blocks)) return [];
  return blocks.map((block): ContentBlock => {
    if (typeof block !== "object" || block === null) {
      return { type: "SlideText", body: [{ type: "paragraph", text: "" }] };
    }
    const b = block as Record<string, unknown>;

    if (b.type === "SlideText") {
      const rawBody = Array.isArray(b.body) ? b.body : [];
      const body: SlideNode[] = rawBody.map((item): SlideNode => {
        if (typeof item === "string") {
          return { type: "paragraph", text: item };
        }
        if (typeof item === "object" && item !== null) {
          const n = item as Record<string, unknown>;
          if (n.type === "image" && typeof n.src === "string") {
            return {
              type: "image",
              src: n.src,
              alt: typeof n.alt === "string" ? n.alt : "",
              caption: typeof n.caption === "string" ? n.caption : undefined,
            };
          }
          if (typeof n.text === "string") {
            return { type: "paragraph", text: n.text };
          }
        }
        return { type: "paragraph", text: "" };
      });
      const legacyImages = Array.isArray((b as any).images) ? (b as any).images : [];
      for (const img of legacyImages) {
        if (typeof img === "object" && img !== null) {
          const im = img as Record<string, unknown>;
          const src = im.src ?? im.url ?? im.imageUrl;
          if (typeof src === "string" && src.trim()) {
            body.push({
              type: "image",
              src,
              alt: typeof im.alt === "string" ? im.alt : "Image",
              caption: typeof im.caption === "string" ? im.caption : undefined,
            });
          }
        }
      }
      if (body.length === 0) body.push({ type: "paragraph", text: "" });
      return {
        type: "SlideText",
        heading: typeof b.heading === "string" ? b.heading : undefined,
        body,
        proTip: typeof b.proTip === "string" ? b.proTip : undefined,
      };
    }

    if (b.type === "VisualMockup") {
      return {
        type: "VisualMockup",
        mockupType: (["browser", "form", "menu", "dialog"].includes(b.mockupType as string)
          ? b.mockupType
          : "form") as VisualMockupBlock["mockupType"],
        title: typeof b.title === "string" ? b.title : "",
        elements: Array.isArray(b.elements)
          ? (b.elements as unknown[]).map((el) => {
              const e = (typeof el === "object" && el !== null ? el : {}) as Record<string, unknown>;
              return {
                label: typeof e.label === "string" ? e.label : "",
                kind: (["input", "button", "text", "panel"].includes(e.kind as string) ? e.kind : "input") as any,
              };
            })
          : [],
      };
    }

    if (b.type === "FlowDiagram") {
      return {
        type: "FlowDiagram",
        steps: Array.isArray(b.steps)
          ? (b.steps as unknown[]).map((s) => {
              const st = (typeof s === "object" && s !== null ? s : {}) as Record<string, unknown>;
              return {
                label: typeof st.label === "string" ? st.label : "",
                description: typeof st.description === "string" ? st.description : undefined,
              };
            })
          : [],
      };
    }

    return { type: "SlideText", body: [{ type: "paragraph", text: "" }] };
  });
}
