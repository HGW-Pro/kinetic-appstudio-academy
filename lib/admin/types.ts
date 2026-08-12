// Shared TypeScript types + runtime validators for the Admin CMS.
// These mirror the Postgres schema in supabase/migrations exactly.

export type ContentBlockType = "SlideText" | "VisualMockup" | "FlowDiagram";

export interface SlideTextBlock {
  type: "SlideText";
  heading?: string;
  body: string[]; // paragraphs; **bold** inline markup supported by the student UI
  proTip?: string;
  images?: { src: string; alt: string; caption?: string }[];
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
  options: string[]; // 2-6 options
  correctIndex: number; // index into options
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

// ---------- Bulk import payload shape ----------

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

export function validateContentBlock(block: unknown, path: string): ContentBlock {
  if (typeof block !== "object" || block === null) {
    throw new ValidationError(path, "must be an object");
  }
  const b = block as Record<string, unknown>;
  const type = b.type;

  if (type === "SlideText") {
    const body = assertArray(b.body, `${path}.body`).map((p, i) =>
      assertString(p, `${path}.body[${i}]`)
    );
    if (body.length === 0) throw new ValidationError(`${path}.body`, "must have at least one paragraph");
    let images: SlideTextBlock["images"];
    if (b.images !== undefined) {
      images = assertArray(b.images, `${path}.images`).map((img, i) => {
        if (typeof img !== "object" || img === null) {
          throw new ValidationError(`${path}.images[${i}]`, "must be an object");
        }
        const im = img as Record<string, unknown>;
        return {
          src: assertString(im.src, `${path}.images[${i}].src`, { minLen: 1 }),
          alt: assertString(im.alt, `${path}.images[${i}].alt`, { minLen: 1 }),
          caption: im.caption !== undefined ? assertString(im.caption, `${path}.images[${i}].caption`) : undefined,
        };
      });
    }
    return {
      type: "SlideText",
      heading: b.heading !== undefined ? assertString(b.heading, `${path}.heading`) : undefined,
      body,
      proTip: b.proTip !== undefined ? assertString(b.proTip, `${path}.proTip`) : undefined,
      images,
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
