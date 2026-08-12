import { TRAINING_SCHEMA_VERSION } from "../training-schema";

// Downloaded by the admin Bulk Import page as template-v2.json. It is a
// complete v2 example, including InteractiveUI, while schemaVersion remains
// optional in validation so all legacy JSON continues to import unchanged.
export const BULK_IMPORT_TEMPLATE = {
  schemaVersion: TRAINING_SCHEMA_VERSION,
  courses: [
    {
      course: {
        title: "Example Course",
        slug: "example-course",
        description: "AI-authored course description.",
        image_url: "example-cover.png",
        sequence_order: 1,
        is_published: true,
      },
      topics: [
        {
          title: "Interactive BAQ Basics",
          slug: "interactive-baq-basics",
          sequence_order: 1,
          subtopics: [
            {
              title: "Build a Query",
              sequence_order: 1,
              content_json: [
                {
                  type: "SlideText",
                  heading: "Prepare the query",
                  body: [{ type: "paragraph", text: "Use the simulation below to practice the workflow." }],
                },
                {
                  type: "InteractiveUI",
                  uiKind: "baq-designer",
                  mode: "guided",
                  guidedSteps: [
                    { id: "step-1", targetId: "query-name", title: "Name the query", instruction: "Enter a descriptive query name." },
                    { id: "step-2", targetId: "add-table", title: "Add a table", instruction: "Use the button to add the first table." },
                  ],
                  sections: [
                    {
                      id: "query-details",
                      title: "Query Details",
                      description: "This is a simplified training view, not the live Epicor designer.",
                      columns: 2,
                      elements: [
                        { id: "query-name", kind: "input", label: "Query Name", placeholder: "CustomerOpenOrders" },
                        { id: "shared", kind: "toggle", label: "Shared Query" },
                        { id: "add-table", kind: "button", label: "Add Table" },
                        { id: "tip", kind: "callout", text: "Start with one table, then add relationships deliberately." },
                      ],
                    },
                    {
                      id: "results",
                      title: "Preview",
                      columns: 1,
                      elements: [
                        {
                          id: "preview-table",
                          kind: "data-table",
                          label: "Preview Results",
                          columns: ["Customer", "Order", "Status"],
                          rows: [{ Customer: "ACME", Order: "10001", Status: "Open" }],
                        },
                      ],
                    },
                  ],
                },
              ],
              quiz: {
                questions_json: [
                  { question: "What should you do first?", options: ["Add every table", "Name the query", "Publish immediately"], correctIndex: 1, explanation: "Naming the query makes it easier to manage and reuse." },
                ],
              },
            },
          ],
        },
      ],
    },
  ],
};
