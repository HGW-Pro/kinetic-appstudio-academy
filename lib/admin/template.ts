// The exact JSON structure BulkImportForm validates pasted data against.
// This is downloaded as template.json — designed to be self-explanatory
// enough to hand directly to an AI model as "generate JSON matching this
// exact structure" and get back something that imports cleanly.
//
// KEY POINTS FOR WHOEVER (OR WHATEVER AI) IS GENERATING THIS JSON:
//
// 1. MULTIPLE COURSES AT ONCE: wrap everything in a top-level "courses"
//    array. Each entry is one full course (its own topics/subtopics/
//    quizzes). You can paste one giant JSON with 10 courses in it and
//    they'll each be imported independently — if one has a mistake, the
//    others still succeed and you'll get back a per-course report.
//    (A single course object without the "courses" wrapper also still
//    works, for convenience.)
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
//    one-sentence description. Steps render left-to-right (or stacked on
//    mobile) as connected boxes. Keep labels to 2-5 words; put the detail
//    in "description". Use 3-6 steps — more than that gets visually
//    cramped.
//
// 4. VISUAL MOCKUPS: use this to show a simplified schematic of a UI
//    screen (a login form, a menu, a dialog) WITHOUT needing a real
//    screenshot. mockupType picks the frame style; elements is the list
//    of things inside it in top-to-bottom order. This is a lightweight
//    illustration, not a pixel-accurate mockup — for anything that needs
//    to look exactly like the real Kinetic UI, use a real screenshot via
//    a SlideText image node instead, and save VisualMockup for
//    conceptual/simplified illustrations.
//
// 5. QUIZ ANSWER ORDER DOESN'T MATTER: put the correct answer anywhere in
//    the options array (correctIndex just has to point at it correctly).
//    The system automatically shuffles option order both when you save
//    and again for every student attempt, so there's no need to
//    deliberately randomize position yourself.

export const BULK_IMPORT_TEMPLATE = {
  $schemaNotes: {
    "top-level": "Either { courses: [ ...one or more course objects... ] } to import many courses at once, or a single { course, topics } object (no wrapper) for just one.",
    "course.slug / topics[].slug": "Must be lowercase-kebab-case (e.g. 'my-topic-1') and unique — course slugs unique overall, topic slugs unique within their course.",
    "images (course.image_url, and any SlideText body image node's src)":
      "Either a bare filename/path already uploaded to the course-assets storage bucket (e.g. 'LoginScreen.png'), or a full https:// URL. Bare filenames are auto-resolved to the bucket's public URL at import time.",
    "SlideText.body":
      "ORDERED array of nodes: { type: 'paragraph', text } or { type: 'image', src, alt, caption? }. Put an image node between two paragraph nodes to position it exactly where it should appear in the lesson. Use **double asterisks** in paragraph text for bold.",
    VisualMockup: "A simplified schematic UI illustration (not a real screenshot). mockupType: browser | form | menu | dialog. elements[].kind: input | button | text | panel. Use for conceptual illustrations only.",
    FlowDiagram: "A sequential step diagram (e.g. a workflow or process). steps is ordered; each step is { label (2-5 words), description? (one sentence) }. Use 3-6 steps.",
    "quiz.questions_json": "2-6 options per question. correctIndex points at the correct option — order doesn't matter, it's shuffled automatically at save time and again per student attempt.",
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
          title: "Example Topic",
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
      ],
    },
    {
      course: {
        title: "A Second Example Course (shows multi-course import)",
        slug: "second-example-course",
        description: "Any number of course objects can go in the courses[] array — each imports independently.",
        sequence_order: 1,
      },
      topics: [
        {
          title: "Its First Topic",
          slug: "its-first-topic",
          sequence_order: 0,
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
