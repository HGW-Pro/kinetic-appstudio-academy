// The exact JSON structure BulkImportForm validates pasted data against.
// This is downloaded as template.json -- designed to be self-explanatory
// enough to hand directly to an AI model as "generate JSON matching this
// exact structure" and get back something that imports cleanly.
//
// HIERARCHY (as currently structured in this academy):
//   Course (e.g. "Kinetic Application Studio")
//     -> Topic / "Module" (e.g. "Application Studio Fundamentals") -- the
//        words "topic" and "module" refer to the same thing in this schema.
//        Multiple topics/modules can and normally do live under ONE course.
//     -> Subtopic (a single lesson screen within a topic)
//        -> optional Quiz (one quiz per subtopic)
//
// IMPORTANT -- WHAT BULK IMPORT DOES AND DOESN'T DO RIGHT NOW:
//   Every course object in courses[] below ALWAYS creates a brand-new
//   top-level course row. There is currently no way to bulk-import new
//   topics/modules INTO an existing course (like adding another module
//   under the existing "Kinetic Application Studio" course) via this
//   JSON importer -- that capability needs a small database function
//   this session didn't have access to add yet.
//
//   To add a new topic/module to an EXISTING course today, use the
//   admin UI instead: open that course in /admin/courses, click
//   "+ Add Topic", and add its subtopics one at a time (or paste
//   content_json for a single subtopic using the friendly editor).
//   Bulk import remains the right tool for creating an entirely NEW
//   course with all its topics/subtopics/quizzes in one paste.
//
// KEY POINTS FOR WHOEVER (OR WHATEVER AI) IS GENERATING THIS JSON:
//
// 1. MULTIPLE COURSES AT ONCE: wrap everything in a top-level "courses"
//    array. Each entry is one full NEW course (its own topics/subtopics/
//    quizzes). Each course imports independently -- if one has a
//    mistake, the others still succeed and you'll get back a per-course
//    report. (A single course object without the "courses" wrapper also
//    still works, for convenience.)
//
// 2. IMAGES BY FILENAME: for any "src" (in a SlideText image node) or
//    course "image_url", you do NOT need a full URL. Just use the
//    filename you uploaded to the course-assets storage bucket, e.g.
//    "LoginScreen.png" or "kinetic/HomePage.png" if it's in a subfolder.
//    It will automatically be resolved to the full public storage URL at
//    import time. A full https:// URL also still works if you already
//    have one.
//
// 3. FLOW DIAGRAMS: use this for any step-by-step / sequential process
//    (e.g. "Create -> Save Draft -> Publish", or "Login -> Home ->
//    Select Company"). Each step is just a short label plus an optional
//    one-sentence description. Use 3-6 steps.
//
// 4. VISUAL MOCKUPS: use this for a simplified schematic of a UI screen
//    WITHOUT needing a real screenshot. For anything that needs to look
//    exactly like the real Kinetic UI, use a real screenshot via a
//    SlideText image node instead.
//
// 5. QUIZ ANSWER ORDER DOESN'T MATTER: correctIndex just has to point at
//    the right option -- order is shuffled automatically at save time and
//    again per student attempt.

export const BULK_IMPORT_TEMPLATE = {
  $schemaNotes: {
    "top-level": "Either { courses: [ ...one or more NEW course objects... ] }, or a single { course, topics } object (no wrapper) for just one NEW course. This always creates new course(s) -- see the note above about adding topics to an EXISTING course via the UI instead.",
    "course.slug / topics[].slug": "Must be lowercase-kebab-case (e.g. 'my-topic-1') and unique -- course slugs unique overall, topic slugs unique within their course.",
    "topics[] a.k.a. modules[]": "Each course normally contains several topics/modules, e.g. Kinetic Application Studio contains 'Application Studio Fundamentals', 'Data Rules & Events', etc. as separate topic entries in this array.",
    "images (course.image_url, and any SlideText body image node's src)":
      "Either a bare filename/path already uploaded to the course-assets storage bucket (e.g. 'LoginScreen.png'), or a full https:// URL.",
    "SlideText.body":
      "ORDERED array of nodes: { type: 'paragraph', text } or { type: 'image', src, alt, caption? }. Put an image node between two paragraph nodes to position it exactly where it should appear. Use **double asterisks** for bold.",
    VisualMockup: "A simplified schematic UI illustration. mockupType: browser | form | menu | dialog. elements[].kind: input | button | text | panel.",
    FlowDiagram: "A sequential step diagram. steps is ordered; each step is { label (2-5 words), description? (one sentence) }. Use 3-6 steps.",
    "quiz.questions_json": "2-6 options per question. correctIndex points at the correct option -- order doesn't matter, it's shuffled automatically.",
  },

  courses: [
    {
      course: {
        title: "Example Course Title",
        slug: "example-course-title",
        description: "One or two sentence summary shown on the course catalog card.",
        image_url: "example-course-cover.png",
        sequence_order: 0,
      },
      topics: [
        {
          title: "Example Topic / Module",
          slug: "example-topic",
          sequence_order: 0,
          subtopics: [
            {
              title: "Example Subtopic With All Block Types",
              sequence_order: 0,
              content_json: [
                {
                  type: "SlideText",
                  heading: "Optional heading shown above the content",
                  body: [
                    { type: "paragraph", text: "First paragraph. Use **bold** for key terms." },
                    {
                      type: "image",
                      src: "example-screenshot.png",
                      alt: "Descriptive alt text for accessibility",
                      caption: "This image appears right here, between the two paragraphs.",
                    },
                    { type: "paragraph", text: "Second paragraph continues the explanation, after the image." },
                  ],
                  proTip: "Optional single-sentence tip shown in a highlighted callout box.",
                },
                {
                  type: "FlowDiagram",
                  steps: [
                    { label: "Create", description: "A new record starts in Draft status." },
                    { label: "Save Draft", description: "Work-in-progress, not yet visible to others." },
                    { label: "Publish", description: "Live and visible to end users." },
                  ],
                },
                {
                  type: "VisualMockup",
                  mockupType: "form",
                  title: "Simplified Login Form",
                  elements: [
                    { label: "Username", kind: "input" },
                    { label: "Password", kind: "input" },
                    { label: "Log In", kind: "button" },
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
        {
          title: "A Second Topic / Module In The Same Course",
          slug: "second-topic-module",
          sequence_order: 1,
          subtopics: [
            {
              title: "Its First Subtopic",
              sequence_order: 0,
              content_json: [{ type: "SlideText", body: [{ type: "paragraph", text: "Minimal valid subtopic." }] }],
            },
          ],
        },
      ],
    },
  ],
};
