import type { BulkImportPayload } from "./types";

// The exact JSON structure BulkImportForm validates pasted data against.
// This is also what gets downloaded as template.json.
//
// NOTE: SlideText.body is now an ORDERED array of nodes — either
// { type: "paragraph", text } or { type: "image", src, alt, caption? } —
// instead of a flat body[] string array plus a separate images[] array.
// This lets an image be placed after a specific paragraph instead of
// always being grouped at the end.
export const BULK_IMPORT_TEMPLATE: BulkImportPayload & { $schemaNotes: Record<string, string> } = {
  $schemaNotes: {
    course: "One course per import. slug must be lowercase-kebab-case and unique.",
    "topics[].slug": "Must be lowercase-kebab-case and unique within the course.",
    "subtopics[].content_json":
      "Ordered array of content blocks rendered top-to-bottom. Each block's `type` must be exactly 'SlideText', 'VisualMockup', or 'FlowDiagram'.",
    "subtopics[].quiz":
      "Optional. If present, questions_json must have 2-6 options per question and correctIndex must point at a valid option. Option order is shuffled automatically on save and again per student attempt — author them in any order.",
    SlideText:
      "body is an ORDERED array of nodes: { type: 'paragraph', text } or { type: 'image', src, alt, caption? }. Place an image node between two paragraph nodes to position it exactly where it should appear. Use **double asterisks** in paragraph text for bold.",
    VisualMockup: "mockupType must be one of: browser | form | menu | dialog. elements[].kind must be one of: input | button | text | panel.",
    FlowDiagram: "steps is an ordered array of { label, description? } rendered as a horizontal/vertical flow.",
  },
  course: {
    title: "Example Course Title",
    slug: "example-course-title",
    description: "One or two sentence summary shown on the course catalog card.",
    image_url: "https://<project>.supabase.co/storage/v1/object/public/course-assets/uploads/example.png",
    sequence_order: 0,
  },
  topics: [
    {
      title: "Example Topic",
      slug: "example-topic",
      sequence_order: 0,
      subtopics: [
        {
          title: "Example Subtopic",
          sequence_order: 0,
          content_json: [
            {
              type: "SlideText",
              heading: "Optional heading shown above the content",
              body: [
                { type: "paragraph", text: "First paragraph. Use **bold** for key terms." },
                {
                  type: "image",
                  src: "https://<project>.supabase.co/storage/v1/object/public/course-assets/uploads/example.png",
                  alt: "Descriptive alt text for accessibility",
                  caption: "Optional caption — this image appears right here, between the two paragraphs.",
                },
                { type: "paragraph", text: "Second paragraph continues the explanation, after the image." },
              ],
              proTip: "Optional single-sentence tip shown in a highlighted callout box.",
            },
            {
              type: "VisualMockup",
              mockupType: "form",
              title: "Example Form Mockup",
              elements: [
                { label: "Username", kind: "input" },
                { label: "Submit", kind: "button" },
              ],
            },
            {
              type: "FlowDiagram",
              steps: [
                { label: "Step 1", description: "Optional description of this step." },
                { label: "Step 2" },
              ],
            },
          ],
          quiz: {
            questions_json: [
              {
                question: "Example question text?",
                options: ["Option A", "Option B", "Option C", "Option D"],
                correctIndex: 2,
                explanation: "One-sentence explanation of why the correct option is correct.",
              },
            ],
          },
        },
      ],
    },
  ],
};
