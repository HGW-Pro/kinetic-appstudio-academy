export type LabStep = {
  title: string;
  detail: string;
};

export type Lab = {
  slug: string;
  title: string;
  tag: string;
  summary: string;
  /** Optional CMS curriculum placement; standalone /labs routes remain valid. */
  relatedCourseSlug?: string;
  relatedTopicSlug?: string;
  objective: string;
  prerequisites: string[];
  steps: LabStep[];
  acceptanceCriteria: string[];
  notes: string[];
};

export const labs: Lab[] = [
  {
    slug: "lab-baq-customer-combo",
    title: "Configure a BAQ-based customer combo",
    tag: "data-binding",
    summary: "Order Entry Detail page, zCustomer01 BAQ, filtered by a State textbox.",
    relatedCourseSlug: "kinetic-application-studio",
    relatedTopicSlug: "dataviews-widgets-panels",
    objective:
      "Add a ComboBox to Order Entry's Detail page that lists customers from the zCustomer01 BAQ, with an additional State column and a live textbox filter — reinforcing everything from the Components & Layout and DataViews modules.",
    prerequisites: [
      "Complete 'Components, Layout & Reusable Building Blocks'",
      "Complete 'DataViews, Widgets & Sliding Panels in Practice'",
      "Customize Privileges enabled on your account",
    ],
    steps: [
      {
        title: "Open Order Entry in Application Studio",
        detail: "Launch Order Entry, select a record, then press Ctrl+Alt+D and create a new layer named LabBAQCombo.",
      },
      {
        title: "Add the layout scaffolding",
        detail: "On the Details page, drag a PanelCard to the top of the layout and add a 2Column container inside it. Rename the panel card title to 'Combo Box Examples'.",
      },
      {
        title: "Drop in the ComboBox and TextBox",
        detail: "From Toolbox → Components, drag a ComboBox and a TextBox into the 2Column container.",
      },
      {
        title: "Wire the ComboBox to the BAQ",
        detail: "Select the ComboBox, open Properties, and set it up as a BAQ Combo pointing at zCustomer01. Add State as an additional display column.",
      },
      {
        title: "Add the live filter",
        detail: "Bind the TextBox to a filter parameter on the BAQ so typing a state code narrows the combo's results in real time.",
      },
      {
        title: "Save, publish, and test",
        detail: "Save the layer, Preview, type a state code into the filter textbox, and confirm the combo list narrows correctly.",
      },
    ],
    acceptanceCriteria: [
      "ComboBox displays customers sourced from the zCustomer01 BAQ, not a hardcoded list.",
      "The combo shows an additional State column alongside the customer name.",
      "Typing a state code into the filter textbox narrows the combo results without a page reload.",
      "The layer is saved, published, and reproducible by re-opening Application Studio.",
    ],
    notes: [
      "Review 'Setting up a BAQ Combo' in the DataViews module before starting if you get stuck on the filter binding.",
      "This exact pattern — BAQ Combo + textbox filter — shows up constantly in real Kinetic customization work, so it's worth mastering.",
    ],
  },
];

export function getLab(slug: string) {
  return labs.find((l) => l.slug === slug);
}

export function getLabsForTopic(courseSlug: string, topicSlug: string) {
  return labs.filter(
    (lab) => lab.relatedCourseSlug === courseSlug && lab.relatedTopicSlug === topicSlug
  );
}
