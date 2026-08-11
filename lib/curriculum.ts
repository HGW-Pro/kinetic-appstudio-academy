export type FlowStep = {
  label: string;
  detail?: string;
};

export type FlowDiagram = {
  title: string;
  steps: FlowStep[];
  loop?: boolean;
};

export type MockupRow = {
  label: string;
  note?: string;
  highlight?: boolean;
};

export type Mockup = {
  title: string;
  subtitle?: string;
  rows: MockupRow[];
};

export type Lesson = {
  id: string;
  title: string;
  minutes: number;
  body: string[];
  proTip?: string;
  version?: "2023.1" | "2023.2" | "both";
  flow?: FlowDiagram;
  mockup?: Mockup;
};

export type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export type Module = {
  slug: string;
  title: string;
  tagline: string;
  icon: string;
  estMinutes: number;
  difficulty: "Foundational" | "Intermediate" | "Advanced";
  lessons: Lesson[];
  quiz: QuizQuestion[];
};

export const modules: Module[] = [
  {
    slug: "app-studio-fundamentals",
    title: "Application Studio Fundamentals",
    tagline: "Launch, layers, and the core building blocks of Kinetic customization",
    icon: "🧭",
    estMinutes: 35,
    difficulty: "Foundational",
    lessons: [
      {
        id: "welcome",
        title: "What Is Application Studio?",
        minutes: 6,
        body: [
          "Application Studio is Epicor Kinetic's low-code/no-code design environment for power users, business analysts, and developers to tailor ERP applications to real business needs — without touching source code.",
          "Configurations you build here live in **layers** that sit on top of the base application. Layers survive upgrades far better than classic customizations because Kinetic re-applies them intelligently instead of patching compiled forms.",
          "Don't confuse a **layer** (a company-wide customization) with a **personalization** (a single user's private tweak). Layers can later be promoted from a personalization, so a great personal fix can become a company standard.",
          "To use Application Studio at all, your user account needs the Customize Privileges checkbox enabled in User Account Security Maintenance."
        ],
        proTip: "Press Ctrl+Alt+D from inside almost any Kinetic screen to jump straight into Application Studio for that screen.",
        version: "both",
        flow: {
          title: "Personalization → Layer promotion path",
          steps: [
            { label: "User Personalization", detail: "One user tweaks their own screen" },
            { label: "Promote to Layer", detail: "Admin merges personalization into a layer" },
            { label: "Company-wide Customization", detail: "Everyone benefits from the fix" }
          ]
        }
      },
      {
        id: "launching",
        title: "Two Ways to Launch Application Studio",
        minutes: 5,
        body: [
          "**Method 1 — From an open application:** Open the screen you want to modify, then use the Overflow menu → Application Studio, or the shortcut Ctrl+Alt+D.",
          "**Method 2 — From the Application Studio Homepage:** System Management → Kinetic Application Management → Application Studio. This grid lists every base and layered application in your system, with filters for type and last-update date.",
          "When you land in Application Studio you're always on a fresh, unsaved layer. You must create a new layer or load an existing one before you can preview, save, or publish anything."
        ],
        version: "both"
      },
      {
        id: "layers-lifecycle",
        title: "The Layer Lifecycle: Create → Save (Draft) → Publish",
        minutes: 8,
        body: [
          "Creating a layer requires a mandatory **Layer Name** and **Description**. You also choose which company (or ALL companies) the layer applies to.",
          "Every save is stored as a **Draft**. Drafts are invisible to end users. Only a **Publish** action makes a layer selectable in Menu Maintenance so real users can see the change — and every publish is timestamped in the Publish History log.",
          "If a user opens a published layer, edits it, and saves, the edit becomes a new unpublished draft again. You must re-publish to push the change live.",
          "You can stack multiple layers on one application. Order matters: the **last** layer selected wins any conflicts, but non-conflicting changes from every layer all apply together."
        ],
        proTip: "Think of layer order like CSS specificity — last one loaded overrides earlier ones only where they actually collide.",
        version: "both",
        flow: {
          title: "The layer lifecycle",
          steps: [
            { label: "Create Layer", detail: "Name + Description + Company" },
            { label: "Edit in Designers", detail: "Application Map, Layout, Rules, Events, DataViews" },
            { label: "Save (Draft)", detail: "Invisible to end users" },
            { label: "Publish", detail: "Selectable in Menu Maintenance" },
            { label: "Live for Users", detail: "Logged in Publish History" }
          ]
        }
      },
      {
        id: "designers",
        title: "The Four App Designers",
        minutes: 6,
        body: [
          "**Application Map** — the default view; shows the page hierarchy as a navigable tree/map. Add, rename, or delete pages here.",
          "**Layout** — drag components from the Toolbox (textboxes, grids, buttons, checkboxes...) onto the canvas to build a page.",
          "**Data Rules** — define conditions and actions that control how fields behave (highlight, disable, hide) without any code.",
          "**Events** — wire up triggered logic: button clicks, page loads, REST calls, message boxes, and more.",
          "**DataViews** — the data plumbing layer; each view maps to one underlying data table and can define parent/child relationships, filters, and tools like Add/Delete."
        ],
        version: "both"
      },
      {
        id: "mobile-and-debug",
        title: "Mobile Layers & Built-in Debugging",
        minutes: 6,
        body: [
          "Kinetic apps are responsive by default, but you can create dedicated **Phone** or **Tablet** child layers under an Any Device parent layer for a purpose-built mobile experience — only one Phone and one Tablet layer per parent.",
          "The **Debug Tool** (Ctrl+Shift+D) shows the live call log and dataview contents while you run or preview an app — flip on Auto-Load while previewing in Application Studio to see your layout edits reflected instantly.",
          "Browser DevTools add another level: Ctrl+Alt+8 toggles dataview event logging, Ctrl+Alt+I loads component objects for inspection, and Ctrl+Alt+V dumps all dataviews. Kinetic 2023.2 adds **EO Browser debugging** for the Smart Client via a sysconfig flag."
        ],
        version: "both"
      },
      {
        id: "shortcuts-and-save-as",
        title: "Shortcuts & Moving Layers Between Companies",
        minutes: 6,
        body: [
          "**Setting Up Shortcuts**: on any page's header properties, scroll to the epActions list — every action on that page can get a custom keyboard shortcut (e.g., Ctrl+Alt+S for Search). Once saved and published, that shortcut becomes the default for everyone using the layer, though users can still override it via personalization.",
          "**The Save As option**: when creating a layer, you pick a Company Name (defaults to ALL, but can be scoped to one company). If you built and tested a layer in a sandbox/test company, use **Save As** to copy that same layer into a production company — without rebuilding it from scratch.",
          "Combine both: build and test in a sandbox company with a fast shortcut for your most-used action, verify everything works, then Save As into production once you're confident."
        ],
        version: "both"
      }
    ],
    quiz: [
      {
        id: "q1",
        question: "What must be enabled on a user account before they can use Application Studio?",
        options: ["Dashboard Developer rights only", "Customize Privileges checkbox in User Account Security Maintenance", "SDK license key", "Administrator role"],
        correctIndex: 1,
        explanation: "Customize Privileges must be checked in User Account Security Maintenance to unlock Application Studio."
      },
      {
        id: "q2",
        question: "What is the key difference between a personalization and a layer/customization?",
        options: [
          "Personalizations are faster to load",
          "A personalization is user-specific; a layer/customization is available to everyone in the company",
          "Layers can only be created by Epicor support",
          "There is no functional difference"
        ],
        correctIndex: 1,
        explanation: "Personalizations save to one user's account only. Layers (customizations) can be shared across the whole company via Menu Maintenance."
      },
      {
        id: "q3",
        question: "After saving a layer, what status does it have until you explicitly publish it?",
        options: ["Draft", "Locked", "Archived", "Production"],
        correctIndex: 0,
        explanation: "Saves always create a Draft. Only Publish makes the layer selectable in Menu Maintenance for other users."
      },
      {
        id: "q4",
        question: "When two layers conflict on the same component, which one wins?",
        options: ["The first layer selected", "The layer with the shortest name", "The last layer selected/applied", "They cancel out and nothing displays"],
        correctIndex: 2,
        explanation: "The last layer in the selected order has precedence and overrides conflicting changes from earlier layers."
      },
      {
        id: "q5",
        question: "Which designer would you use to define that a discount field turns red when it exceeds 8%?",
        options: ["Application Map", "Layout", "Data Rules", "DataViews"],
        correctIndex: 2,
        explanation: "Data Rules define conditions (discount > 8) and actions (highlight/disable/etc.) without writing code."
      }
    ]
  },
  {
    slug: "application-map-and-pages",
    title: "Application Map & Page Architecture",
    tagline: "Landing pages, tabs, virtual pages, and sliding panels",
    icon: "🗺️",
    estMinutes: 40,
    difficulty: "Foundational",
    lessons: [
      {
        id: "landing-page",
        title: "The Landing Page & Application Dataset",
        minutes: 7,
        body: [
          "The **Landing Page** defines what a user sees the instant an application launches — typically a searchable grid (PanelCardGrid) bound to a dynamic 'LandingPage' dataview populated via GetRows.",
          "Every application has one root **Dataset** (e.g., Customer) that everything downstream binds to. A small patch icon appears next to a property whenever a Business Process Management (BPM) patch is affecting it.",
          "Key landing page properties: Name, Caption, PageType (Apps/Process/Report/Dashboard/Shared), UseFullWidth, and EpBinding — the glue that ties a UI control to a specific application view."
        ],
        version: "both"
      },
      {
        id: "tabs-and-pages",
        title: "Tabs vs. Pages vs. Virtual Pages",
        minutes: 9,
        body: [
          "A **Tab** is a navigation entry point tied to a Tab Page; selecting one drives what shows in the Navigation Tree below it (e.g., Details vs. Activity).",
          "A **Page** (usually PageType = TabPage) is where real layout components live — panels, grids, fields. Its EpBinding links it to a specific record context, and PageCaption can even show dynamic values like `Customer.CustID`.",
          "**Virtual Pages** are just PanelCard or PanelCardGrid components with Full Screen visualization enabled. At runtime a Full Screen button expands them to show extra containers of detail while hiding the rest of the page — great for dense data without leaving the screen."
        ],
        proTip: "Deleting a Virtual Page from the Application Map simply clears the EnableFullScreen flag on its panel — nothing destructive happens to your data.",
        version: "both",
        flow: {
          title: "Application Map hierarchy",
          steps: [
            { label: "Landing Page", detail: "Searchable grid, entry point" },
            { label: "Tab", detail: "Navigation entry, e.g. Details / Activity" },
            { label: "Page", detail: "Real layout: panels, grids, fields" },
            { label: "Virtual Page", detail: "Full-screen expanded detail view" }
          ]
        }
      },
      {
        id: "sliding-panels",
        title: "Sliding Panels: Contextual Overlays Done Right",
        minutes: 8,
        body: [
          "Sliding Panels glide in from the right edge of the screen to show contextual info, confirmations, or Info/Warning/Success/Error dialogs — triggered by an event such as a button click.",
          "Configurable properties include HideCloseIcon, ShowTitle, ShowButtons, and CollapseOnOutsideClick. You can add custom Buttons and Overflow Actions directly on the panel.",
          "**Reusable Sliding Panels** (SDK required) are entire mini-applications that any parent app can open via an app-open action, pass parameters into (ValueIn with `ParamName: DataView.Column` syntax), and receive results back from via OnOk/OnCancel handlers."
        ],
        version: "both"
      },
      {
        id: "flex-layout",
        title: "FlexLayout: Responsive Panel Widths",
        minutes: 8,
        body: [
          "FlexLayout is active by default on the main application page. It exposes a Minimum Width dropdown on panel cards, panel grid cards, and group boxes so you can precisely control how components share horizontal space.",
          "Example: set three panel cards to Minimum Width = 33 each and they'll line up side by side instead of stacking vertically. The same trick works one level deeper on GroupBoxes nested inside a panel card.",
          "This is the single most useful tool for turning a cramped, boring, vertically-stacked form into a clean, wide-screen-friendly dashboard-style layout."
        ],
        version: "both"
      },
      {
        id: "new-pages-tabs",
        title: "Creating New Pages & Tabs",
        minutes: 8,
        body: [
          "To add a page: select the parent node in the Application Map tree, choose Add, then set Name / Caption / PageType. Drop in components, save the layer, and Preview to confirm.",
          "To surface it as a Tab: add the page under the target Tab node, then edit the parent's TabStrip component properties → Data → add a new tab entry whose Id/Title matches the page's Name/TabID exactly, and set Page to your new page.",
          "Mismatched Name/TabID values are one of the most common beginner mistakes — Application Studio's Problems panel will flag validation errors if they don't line up."
        ],
        version: "both",
        flow: {
          title: "Wiring a new tab end-to-end",
          steps: [
            { label: "Add Page", detail: "Under target parent node" },
            { label: "Set Name / TabID", detail: "Must match exactly" },
            { label: "Add Components", detail: "Panels, fields, grids" },
            { label: "Edit TabStrip", detail: "Add tab entry pointing to page" },
            { label: "Save + Preview", detail: "Validate & confirm" }
          ]
        }
      },
      {
        id: "baq-reports-and-wizard",
        title: "BAQ Reports & the Basic Application Wizard",
        minutes: 9,
        body: [
          "**BAQ Reports** wrap a Business Activity Query into a submission form + printable output. You modify the submission form's layout in Application Studio just like any other app, and separately update the underlying **Report Definition** (the actual print layout/RDL) to change what appears on the printed output.",
          "The **Basic Application Wizard** (launched from the Application Studio Homepage) builds a complete single-page or parent/child application without touching the Layout designer by hand: you pick a Parent DataView, its Grid, and its Form Card, then optionally repeat for a Child DataView/Grid/Form Card.",
          "After finishing, the wizard shows a **Validation Process** summary. Common validation errors include: Invalid Parent-Child Relationship (the child view isn't actually linked to the parent), Invalid DataView Filter Mappings, and Invalid Grid View Option Filter — all fixable directly back in Application Studio without restarting the wizard."
        ],
        proTip: "Use the Basic Application Wizard for straightforward CRUD screens — it's dramatically faster than hand-building the Application Map, and you can still refine the result afterward like any normal layer.",
        version: "both"
      },
      {
        id: "landing-page-tricks",
        title: "Simple Landing Page Modifications & Skip Landing Page",
        minutes: 7,
        body: [
          "**Quick Filters** add one-click filter buttons above a landing page grid (e.g., 'Open Orders Only') — configured as View Options tied to a static filter expression, so users don't have to build a filter manually every time.",
          "**Job Status Checkboxes** are a common landing-page pattern: add checkboxes bound to status columns, then add a Data Rule that filters the grid based on which boxes are checked — letting users toggle between 'Open,' 'Closed,' 'On Hold,' etc. without a full search form.",
          "**Skip Landing Page** lets an application jump straight to a specific record's Details page instead of showing the searchable grid first — useful for menu items meant to always open the same fixed record (like a single company-wide settings screen)."
        ],
        version: "both"
      }
    ],
    quiz: [
      {
        id: "q1",
        question: "What defines what a user sees immediately when an application launches?",
        options: ["The Tab Page", "The Landing Page", "The Virtual Page", "The Sliding Panel"],
        correctIndex: 1,
        explanation: "The Landing Page is the entry point, usually a searchable grid bound to a dynamic dataview."
      },
      {
        id: "q2",
        question: "A Virtual Page is technically which type of component with a special property enabled?",
        options: [
          "A TabStrip with Multi-select enabled",
          "A PanelCard or PanelCardGrid with Enable Full Screen enabled",
          "A GroupBox with Orientation set to horizontal",
          "A Button with Behavior set to Navigate"
        ],
        correctIndex: 1,
        explanation: "Virtual Pages are just PanelCard/PanelCardGrid components with the Advanced 'Enable Full Screen' property turned on."
      },
      {
        id: "q3",
        question: "Which direction do Sliding Panels enter the screen from?",
        options: ["Top", "Bottom", "Left", "Right"],
        correctIndex: 3,
        explanation: "Sliding Panels slide out from the right side of the application."
      },
      {
        id: "q4",
        question: "What does setting Minimum Width to 33 on three panel cards using FlexLayout achieve?",
        options: [
          "It hides two of the three cards",
          "It stacks the cards vertically",
          "It arranges the three cards side by side",
          "It disables the cards"
        ],
        correctIndex: 2,
        explanation: "FlexLayout with matching Minimum Width percentages arranges panel cards in a row instead of stacking."
      },
      {
        id: "q5",
        question: "When wiring a new Page into a TabStrip, what must match exactly to avoid validation errors?",
        options: [
          "The page's Name/TabID and the TabStrip entry's Id/Title",
          "The page's color scheme and the TabStrip's background",
          "The page's dataset and the company code",
          "Nothing needs to match, Kinetic auto-links them"
        ],
        correctIndex: 0,
        explanation: "The Page Name/TabID must match the TabStrip's Id/Title entry, or Application Studio will raise a validation error."
      }
    ]
  },
  {
    slug: "components-and-layout",
    title: "Components, Layout & Reusable Building Blocks",
    tagline: "Toolbox controls, nesting rules, and SDK reusable components",
    icon: "🧩",
    estMinutes: 30,
    difficulty: "Intermediate",
    lessons: [
      {
        id: "component-model",
        title: "The Component Containment Model",
        minutes: 7,
        body: [
          "Kinetic components fall into three tiers: **Host containers** (PanelCard, PanelCardGrid, PanelCardGantt) hold everything else and can be dropped directly on a page.",
          "**Organizer components** (1Column, 2Column, Container, GroupBox) provide the second level of nesting — they must live inside a host container but can hold lower-level controls.",
          "**Leaf controls** (Button, TextBox, ComboBox, CheckBox, DatePicker, Grid, etc.) are the actual data-entry and display elements — they cannot float free on a page; they must sit inside an organizer or host.",
          "Kinetic 2023.2 formalized **nested components**: you can drop organizer components inside other organizers to build complex side-by-side arrangements of 6, 7, or more controls in a single row."
        ],
        version: "both",
        flow: {
          title: "Component containment tiers",
          steps: [
            { label: "Host Container", detail: "PanelCard / PanelCardGrid / PanelCardGantt" },
            { label: "Organizer", detail: "1Column / 2Column / GroupBox / Container" },
            { label: "Leaf Control", detail: "Button / TextBox / ComboBox / Grid" }
          ]
        }
      },
      {
        id: "required-props",
        title: "Required Properties & Design Mode",
        minutes: 6,
        body: [
          "Required properties live in the Basic group and are marked with an asterisk. The most important is **Id** — always rename generic auto-IDs (like NewRule-1) to something meaningful, because you'll reference these IDs constantly inside Events and Data Rules.",
          "In Application Studio's Design Mode, components are intentionally inert — you can't type into a textbox or pick a date, because no real data is loaded. Always use **Preview** to test actual runtime behavior.",
          "The State group hoses Hidden, Disabled, ReadOnly, Personalizable and Customizable flags. Turning off Personalizable locks a field from end-user personalization while keeping it fully visible; turning off Customizable locks it from being touched by other layers entirely."
        ],
        proTip: "Clearing 'Personalizable' is the correct way to protect a compliance-critical field from being hidden by end users, without breaking the layout for everyone else.",
        version: "both"
      },
      {
        id: "full-screen",
        title: "Full-Screen Views for Dense Data",
        minutes: 6,
        body: [
          "PanelCardGrid gets Enable Full Screen by default — an automatic secondary view appears for grid rows that don't fit the summary card.",
          "For a PanelCard, you must enable Full Screen manually. Once enabled, a second container box appears: keep your must-see fields in the primary container, and push secondary detail fields into the second container which is only shown after clicking Full Screen.",
          "At runtime, full-screen views also appear as separate nodes in the navigation tree, so users can deep-link directly to the expanded view."
        ],
        version: "2023.2"
      },
      {
        id: "reusable-components",
        title: "Building Reusable Components (SDK)",
        minutes: 6,
        body: [
          "With an SDK license, the Custom Component Editor lets you build UI snippets once — panel cards, buttons, combos, whatever — and reuse them across every application you customize.",
          "Workflow: Application Studio Homepage → Components tab → New → design in the editor → Save & Publish → the component now appears under Toolbox → User Defined in every layer.",
          "Custom components can host any base control except widgets or other custom components (no infinite nesting of user-defined components)."
        ],
        version: "both",
        flow: {
          title: "Building a reusable component",
          steps: [
            { label: "Components Tab", detail: "Application Studio Homepage" },
            { label: "New Component", detail: "Enter component ID" },
            { label: "Design in Editor", detail: "Drag controls, set properties" },
            { label: "Save & Publish", detail: "Available under Toolbox → User Defined" },
            { label: "Reuse Everywhere", detail: "Drop into any layer" }
          ]
        }
      },
      {
        id: "orphans",
        title: "Fixing Orphaned Components After Upgrades",
        minutes: 5,
        body: [
          "When a base application's container layout changes (a card gets removed) but a child layer still has a component bound inside that now-missing container, the component becomes **orphaned** — it silently disappears from the layout.",
          "Kinetic 2023.2 surfaces this clearly: a warning banner appears, and an 'Orphan Components' card lists every stranded control at the bottom of the affected page so you can drag it to a new home or delete it outright.",
          "Always re-test every customization layer after a major version upgrade — even a 'fully converted' layer needs manual verification."
        ],
        version: "2023.2"
      }
    ],
    quiz: [
      {
        id: "q1",
        question: "Which of these can be dropped directly onto an empty page?",
        options: ["Button", "TextBox", "PanelCard", "ComboBox"],
        correctIndex: 2,
        explanation: "PanelCard (and PanelCardGrid/PanelCardGantt) are host containers that can sit directly on a page; leaf controls must go inside one."
      },
      {
        id: "q2",
        question: "Why should you rename a component's default auto-generated Id?",
        options: [
          "It improves rendering performance",
          "It's required for the component to be visible",
          "You'll reference this Id constantly in Events and Data Rules, so a meaningful name saves confusion",
          "IDs longer than 5 characters break the layout engine"
        ],
        correctIndex: 2,
        explanation: "Meaningful IDs make it far easier to wire up Events and Data Rules correctly later."
      },
      {
        id: "q3",
        question: "What happens if you clear the 'Personalizable' checkbox on a field?",
        options: [
          "The field is deleted from the layout",
          "End users can no longer hide/show it via personalization, but it stays visible in the layout",
          "The field becomes editable by everyone",
          "It converts the field into a system field"
        ],
        correctIndex: 1,
        explanation: "Clearing Personalizable locks the field against end-user personalization changes while leaving it in the layout."
      },
      {
        id: "q4",
        question: "What causes a component to become 'orphaned' after an upgrade?",
        options: [
          "The user loses customization rights",
          "Its parent container is removed from a layer/base app but the component still exists on another layer",
          "The dataview it's bound to is renamed",
          "The layer was never published"
        ],
        correctIndex: 1,
        explanation: "Orphaning happens when a container (card, group box, etc.) is removed but a component from another layer still expects to live inside it."
      },
      {
        id: "q5",
        question: "What can a custom (SDK) reusable component NOT contain?",
        options: ["Buttons", "Grids", "Widgets or other custom components", "Text boxes"],
        correctIndex: 2,
        explanation: "Custom components can host standard base controls but not widgets or other user-defined custom components."
      }
    ]
  },
  {
    slug: "data-rules-and-events",
    title: "Data Rules & Events",
    tagline: "No-code business logic: conditions, actions, and workflows",
    icon: "⚙️",
    estMinutes: 35,
    difficulty: "Intermediate",
    lessons: [
      {
        id: "rules-basics",
        title: "Anatomy of a Data Rule",
        minutes: 8,
        body: [
          "Every rule needs a Header (Name + Description), a Row Rule Criteria (Condition or No Condition), and one or more Actions.",
          "Example: Condition = OrderDtl.DiscountPercent > 8 → Action = SettingStyle → Highlight the Discount and UnitPrice fields, and Disable OrderQty. Zero code, fully declarative.",
          "Highlight colors follow a status convention: Red = Error, Orange = Warning, Green = Ok, Blue = Highlight — keep this consistent so users learn to read your app at a glance.",
          "System rules ship with the base app and can be copied but never edited or deleted. User-created rules can be freely copied, edited, disabled, or deleted."
        ],
        version: "both",
        flow: {
          title: "Condition → Action rule flow",
          steps: [
            { label: "Header", detail: "Name + Description" },
            { label: "Condition", detail: "OrderDtl.DiscountPercent > 8" },
            { label: "Action", detail: "SettingStyle → Highlight" },
            { label: "Publish Rule", detail: "Now enforced across the app" }
          ]
        }
      },
      {
        id: "cross-dataview",
        title: "Cross-DataView Rules",
        minutes: 6,
        body: [
          "A Cross-DataView Rule lets a condition on one dataview trigger an action on a *different* dataview — e.g., a discount threshold on OrderHed makes a field ReadOnly on OrderDtl.",
          "This is a 2023.2 capability that removes the need for a workaround event just to bridge two related views.",
          "Function-based row rule criteria (VB.NET functions) are deprecated for new rules due to performance and security concerns — existing ones still run, but rebuild new logic using Conditions."
        ],
        proTip: "Avoid functions in row rules going forward — Application Studio will flag a performance warning if you try to reuse one.",
        version: "2023.2"
      },
      {
        id: "events-basics",
        title: "Events: Triggers, Actions & Workflow",
        minutes: 8,
        body: [
          "An Event is one action or a chained sequence of actions: navigate, update a field, show a message, call a REST endpoint — triggered by something in the UI (a click, a row change) or invoked from another event.",
          "Triggered events have a Trigger definition: Type (Control/Data/Event), Hook (OnClick/Before/After/Override), and Target (which component or system event to hook).",
          "You cannot edit a base-layer system event directly, but you CAN create your own event with a Before or After hook pointed at that system event's ID — your logic runs alongside it without ever touching Epicor's original workflow."
        ],
        version: "both",
        flow: {
          title: "Event trigger → workflow chain",
          steps: [
            { label: "Trigger", detail: "Type + Hook + Target" },
            { label: "Action 1", detail: "e.g. row-update" },
            { label: "Action 2", detail: "e.g. message box" },
            { label: "Action N", detail: "Chained via event-next" }
          ]
        }
      },
      {
        id: "event-override",
        title: "Overriding System Events (2023.2)",
        minutes: 7,
        body: [
          "Beyond Before/After hooks, 2023.2 introduces the **Override** hook type: your custom event runs INSTEAD of the targeted system event.",
          "Classic use case: replace the stock 'record created' toast with your own branded message by overriding AfterGetNew with a custom event containing an erp-message-handler action set to a Toast/Info level with your own text.",
          "Use overrides sparingly — you're now fully responsible for anything the original system event used to do."
        ],
        version: "2023.2"
      },
      {
        id: "allow-interaction",
        title: "Allow Interaction During Events",
        minutes: 6,
        body: [
          "By default, the application pauses/locks while an event workflow executes. Enabling **Allow interaction during events** (available at the layer level and per-trigger) lets users keep working while a longer process runs in the background.",
          "This is ideal for slow REST calls or reports so users aren't stuck staring at a frozen screen — but be careful: if your workflow assumes the user hasn't changed context, allowing interaction can introduce race conditions."
        ],
        version: "2023.2"
      },
      {
        id: "erp-baq-operations",
        title: "ERP-BAQ Event Action: Five Operation Modes",
        minutes: 8,
        body: [
          "The **erp-baq** event action can add, update, and validate data straight against a BAQ-backed table, configured via its **BAQ Update Options** node and an Operations dropdown with five modes.",
          "**getNew** adds a new row to the BAQ table for users to fill in. **update** saves changes to a single row by default — select **SendAllRows** to save every changed row at once, and **RollbackDataOnError** to prevent partial saves when something fails.",
          "**fieldUpdate** notifies the server that one field changed so related fields can recalculate (e.g., changing Part Number triggers Unit of Measure and Description to update) — typically hooked to a column-changed event. **fieldValidate** checks a field's value against a rule before the change commits (e.g., enforcing Part Type = 'M' for manufactured-only entry) — also hooked to a column-changing event. **Custom Action** links the BAQ action straight to any other custom action you've defined, optionally sending all matched rows."
        ],
        version: "both",
        flow: {
          title: "erp-baq operation modes",
          steps: [
            { label: "getNew", detail: "Adds a new row" },
            { label: "update", detail: "Saves 1 or all changed rows" },
            { label: "fieldUpdate", detail: "Recalculates related fields" },
            { label: "fieldValidate", detail: "Checks value before commit" },
            { label: "Custom Action", detail: "Runs any other custom action" }
          ]
        }
      },
      {
        id: "function-criteria-disabling-events",
        title: "Function Criteria & Disabling Events (2023.2)",
        minutes: 5,
        body: [
          "Existing Data Rules that use **Function** row-rule criteria (VB.NET functions) continue to run in 2023.2, but you can no longer select Function as the criteria type for brand-new rules — Application Studio now steers everyone toward Conditions for performance and security reasons. If you switch an existing rule's criteria away from Function, you can't switch it back.",
          "2023.2 also lets you **disable** a specific event outright without deleting it — handy when a custom event misbehaves after an upgrade but you want to keep its configuration around to fix later rather than losing the work. Re-enable it from the same overflow menu once you've resolved the issue."
        ],
        version: "2023.2"
      }
    ],
    quiz: [
      {
        id: "q1",
        question: "In the highlight color convention, what does Orange represent?",
        options: ["Error", "Warning", "Ok", "Highlight"],
        correctIndex: 1,
        explanation: "Orange = Warning, Red = Error, Green = Ok, Blue = Highlight."
      },
      {
        id: "q2",
        question: "Can you edit a system rule that ships with the base application?",
        options: [
          "Yes, directly and freely",
          "No — you can only copy it and edit the copy",
          "Only if you have the SDK license",
          "Only during a version upgrade window"
        ],
        correctIndex: 1,
        explanation: "System rules can be copied but never edited or deleted directly."
      },
      {
        id: "q3",
        question: "What does a Cross-DataView Rule allow you to do?",
        options: [
          "Delete records across companies",
          "Trigger an action on one dataview based on a condition evaluated on a different dataview",
          "Merge two dataviews into one",
          "Convert a classic dataview to Kinetic automatically"
        ],
        correctIndex: 1,
        explanation: "Cross-DataView Rules let a condition on Dataview A drive an action on Dataview B."
      },
      {
        id: "q4",
        question: "Which 2023.2 event hook type replaces a system event's behavior entirely?",
        options: ["Before", "After", "Override", "OnClick"],
        correctIndex: 2,
        explanation: "The Override hook runs your custom event INSTEAD of the targeted system event."
      },
      {
        id: "q5",
        question: "What risk does 'Allow interaction during events' introduce?",
        options: [
          "It disables all data rules",
          "It can cause race conditions if the user changes context mid-workflow",
          "It permanently locks the record",
          "It prevents publishing the layer"
        ],
        correctIndex: 1,
        explanation: "Letting users interact while an event runs can create race conditions if your workflow assumed a static context."
      }
    ]
  },
  {
    slug: "dataviews-widgets-panels",
    title: "DataViews, Widgets & Sliding Panels in Practice",
    tagline: "Wiring data sources, dashboards, and quick-access UI",
    icon: "📊",
    estMinutes: 35,
    difficulty: "Intermediate",
    lessons: [
      {
        id: "system-dataviews",
        title: "System DataViews You'll Use Constantly",
        minutes: 8,
        body: [
          "**TransView** exposes KeyFields, actionResult, searchResult, Constant, CallContextBpmData/CallContextClientData, sysTools, and matches — the plumbing every custom view can tap into.",
          "**Constant** holds dozens of ready-made system values: CompanyID, CurrentUserID, Today, Tomorrow, FirstDayOfMonth, PlantID, and more — use these instead of hardcoding values in filters or bindings.",
          "**matches** is the temporary dataview created automatically whenever a dataview-condition action selects a subset of rows — perfect for looping a row-update action across every matching record in one event."
        ],
        version: "both"
      },
      {
        id: "custom-dataviews",
        title: "Defining a New DataView",
        minutes: 8,
        body: [
          "Creating a view means: map it to a data source, define parent/child relationships if needed, set static filters, add columns (including calculated/additional columns not present on the server dataset), and configure context menus per column.",
          "Static filters use the format `DataView.Column = 'Value'` (comma-separate multiple criteria) — handy when two views share one underlying server table but need to show different subsets, like splitting Credit Memo payments by IsCreditPayment true/false.",
          "You can load data into a view four ways: GridProviderModel, a service method dataset, a BAQ Results dataset (via the ERP-BAQ event action), or a Function's response parameter of tableset type."
        ],
        version: "both",
        flow: {
          title: "Defining a new DataView",
          steps: [
            { label: "Map Data Source", detail: "Table / service dataset" },
            { label: "Parent/Child Relations", detail: "If applicable" },
            { label: "Static Filters", detail: "DataView.Column = 'Value'" },
            { label: "Add Columns", detail: "Including calculated columns" },
            { label: "Load Data", detail: "GridProvider / Service / BAQ / Function" }
          ]
        }
      },
      {
        id: "widgets-dashboards",
        title: "Widgets & Kinetic Dashboards",
        minutes: 8,
        body: [
          "Widgets add rich visualizations: Data Discovery Cards, Data Discovery Charts, and Website Widgets (embed any HTTPS page, with EpBinding values injected via curly braces, e.g. a Google Maps URL keyed off `ShipHead.ShipToAddressFormatted`).",
          "Classic dashboards must be copied and generated as a Kinetic UX application (Tools → Deploy Dashboard) before you can style them in Application Studio — then add them to the main menu through Menu Maintenance.",
          "Once generated, a Kinetic dashboard is just another application layer — resize panels, rename captions, add view options to grids, exactly like any other screen."
        ],
        version: "both"
      },
      {
        id: "sliding-panel-lab",
        title: "Wiring a Sliding Panel End-to-End",
        minutes: 7,
        body: [
          "1) Add an action button to a panel card's Action Menu (enable it, then add an ActionData entry with an Id like ToolShowMap).",
          "2) Create an Event with a Control/OnClick trigger targeting that Action Id.",
          "3) Drop a slider-open action into the event workflow and set its Page parameter to your sliding panel's ID.",
          "4) Save, then Preview — clicking the button should slide the panel out from the right immediately.",
          "This exact recipe — button → event → slider-open action — is reused everywhere in Kinetic. A real example from Customer Entry: the 'Change ID' button has ActionData Id = Customer.ChgIDButton, and its (Locked, system) event flow is exactly Control:Customer.ChgIDButton onClick → row-update → slider-open, opening the 'Change Customer ID' panel."
        ],
        version: "both",
        flow: {
          title: "Button → Event → Sliding Panel",
          steps: [
            { label: "Add Action Button", detail: "ActionData Id: ToolShowMap" },
            { label: "Create Event", detail: "Control / OnClick trigger" },
            { label: "slider-open Action", detail: "Set Page parameter" },
            { label: "Save + Preview", detail: "Panel slides in from the right" }
          ]
        }
      },
      {
        id: "solution-workbench",
        title: "Import/Export via Solution Workbench (2023.2)",
        minutes: 4,
        body: [
          "2023.2 formalizes exporting and importing layers through Solution Workbench, including exporting layers with parent/child relationships intact — critical for promoting a tested configuration from a sandbox to a production company cleanly."
        ],
        version: "2023.2"
      }
    ],
    quiz: [
      {
        id: "q1",
        question: "Which system dataview would you use to reference 'CurrentUserID' or 'Today' without hardcoding values?",
        options: ["TransView", "Constant", "matches", "sysTools"],
        correctIndex: 1,
        explanation: "The Constant dataview exposes ready-made system values like CompanyID, CurrentUserID, and Today."
      },
      {
        id: "q2",
        question: "What is the correct format for a static filter on a dataview?",
        options: [
          "DataView->Column==Value",
          "DataView.Column = 'Value' (comma-separated for multiple criteria)",
          "Column:Value;DataView",
          "SELECT Column FROM DataView WHERE Value"
        ],
        correctIndex: 1,
        explanation: "Static filters use DataView.Column = 'Value' syntax, with commas separating multiple criteria."
      },
      {
        id: "q3",
        question: "Which widget lets you embed a fully external HTTPS page with dynamic data injected via curly braces?",
        options: ["Data Discovery Card", "Data Discovery Chart", "Website Widget", "PDF Viewer"],
        correctIndex: 2,
        explanation: "The Website Widget embeds an external URL and supports {DataView.Column} injection."
      },
      {
        id: "q4",
        question: "Before you can style a classic dashboard in Application Studio, what must you do first?",
        options: [
          "Delete the classic dashboard",
          "Generate it as a Kinetic UX application via Deploy Dashboard",
          "Convert it to a BAQ Report",
          "Nothing, classic dashboards open directly in Application Studio"
        ],
        correctIndex: 1,
        explanation: "You must copy and Deploy Dashboard to generate a Kinetic UX version before Application Studio can style it."
      },
      {
        id: "q5",
        question: "What is the correct 3-step recipe for a button-triggered sliding panel?",
        options: [
          "Button → Data Rule → Publish",
          "Action button → Event (OnClick) → slider-open action targeting the panel's Page ID",
          "GroupBox → Widget → DataView",
          "Layer → Merge Layers → Preview"
        ],
        correctIndex: 1,
        explanation: "Add an action button, hook an OnClick event, and use a slider-open action pointing at the sliding panel's Page property."
      }
    ]
  },
  {
    slug: "layers-publishing-sdk",
    title: "Layers, Publishing, Governance & the SDK",
    tagline: "Homepage management, upgrades, security, and building new apps",
    icon: "🚀",
    estMinutes: 30,
    difficulty: "Advanced",
    lessons: [
      {
        id: "homepage-mgmt",
        title: "Application Studio Homepage: Mission Control",
        minutes: 7,
        body: [
          "The Homepage grid lists every base and layered application with sort, group-by, and filter tools. Use it to find, upgrade, and publish layers in bulk instead of one at a time.",
          "**Dashboard Developer** rights let you modify base dashboards; **Customize Privileges** rights let you create new layers/alternate versions of existing apps. An SDK license unlocks creating brand-new applications from templates (Apps, Configurator, Dashboard, Process, Report, Shared).",
          "2023.2 adds a clear visual indicator distinguishing system apps (ticked) from custom apps (no indicator) directly in the Homepage grid — much faster triage across a large system."
        ],
        version: "both"
      },
      {
        id: "upgrades-publish",
        title: "Bulk Upgrading & Publishing Layers",
        minutes: 6,
        body: [
          "Select multiple layers via checkboxes, then Overflow menu → Upgrade Selected Layers. The system automatically upgrades the base application and every dependent layer, skipping anything already current.",
          "Watch the Status column: Upgrade Success vs. Upgrade Failed (with an Error column explaining why) — use the Debug Tool or browser DevTools to chase down failures.",
          "Publishing works the same way: select unpublished (HasDraft) layers, then Publish Selected Layers in one batch instead of clicking through each app individually."
        ],
        version: "both",
        flow: {
          title: "Bulk upgrade → publish pipeline",
          steps: [
            { label: "Select Layers", detail: "Checkbox in Homepage grid" },
            { label: "Upgrade Selected", detail: "Base app + dependents upgraded" },
            { label: "Check Status", detail: "Success vs Failed + Error column" },
            { label: "Publish Selected", detail: "Batch publish HasDraft layers" }
          ]
        }
      },
      {
        id: "conversion",
        title: "Classic-to-Kinetic Conversion Logic",
        minutes: 6,
        body: [
          "Program 180 auto-converts Classic customization layers into Kinetic layers during an upgrade — but only for Customization-type layers by default (you can target specific layers with a CustomizationConversionSettings XML file and a mandatory Key1 tag).",
          "It reliably converts simple UI components, combo boxes, foreign-key dataviews, sub-table dataviews, and wizard-generated data rules. It cannot convert custom actions/conditions in Data Rules or client-side logic based on custom code — that logic must be rebuilt using Functions and BPM directives on the server.",
          "Always verify converted layers in the Configuration Upgrade Dashboard: Pass (verify only), Warning (needs edits), or Error (needs a full rework)."
        ],
        version: "both",
        flow: {
          title: "Conversion verification funnel",
          steps: [
            { label: "Program 180 Runs", detail: "During upgrade" },
            { label: "Pass", detail: "Verify only" },
            { label: "Warning", detail: "Needs manual edits" },
            { label: "Error", detail: "Needs full rework" }
          ]
        }
      },
      {
        id: "governance",
        title: "Governance: Finding Active Customizations & Cleaning Up",
        minutes: 6,
        body: [
          "Build a cross-company BAQ against the Ice.Menu table filtering Arguments LIKE '%-c%' to discover every custom menu item actively running across your entire organization — essential before a major upgrade project.",
          "2023.2 lets non-SDK users with Customization rights delete unused custom base apps and their layers directly from the Homepage grid overflow menu — no more orphaned junk piling up over the years.",
          "Deleting a parent base app cascades to delete its child layers too, so always confirm scope before you click delete."
        ],
        version: "2023.2"
      },
      {
        id: "ud-forms-sdk",
        title: "User-Defined Forms & the Kinetic SDK",
        minutes: 5,
        body: [
          "With the SDK, the **UD Service Designer** lets you create brand-new user-defined services/tables, add fields, and deploy them as full Kinetic screens with their own base events — genuinely building new functionality, not just customizing existing screens.",
          "Typical flow: define UD codes → add a UD field to a core table (e.g., Part) → regenerate the data model → surface the new field in the UI via a ComboBox or panel → deploy the layer.",
          "This is the deepest level of App Studio work — pair it with Functions and BPM Directives for validation and cross-system integration logic, exactly the kind of stack you already work with in Epicor."
        ],
        version: "both",
        flow: {
          title: "Building a new UD screen",
          steps: [
            { label: "Define UD Codes", detail: "Custom subtypes/values" },
            { label: "Add UD Field", detail: "e.g. onto Part table" },
            { label: "Regenerate Data Model", detail: "Field becomes queryable" },
            { label: "Surface in UI", detail: "ComboBox / panel in App Studio" },
            { label: "Deploy Layer", detail: "Publish & test" }
          ]
        }
      },
      {
        id: "ud-codes-part-advisor",
        title: "Real Scenario: UD Codes & the Part Advisor",
        minutes: 8,
        body: [
          "This real scenario from the guide extends Part Maintenance with a 'Soap Type' subtype system entirely through UD tooling: first, define **User-Defined (UD) Codes** for each Part subtype using the UD Code maintenance screen — these become the selectable values in your new field.",
          "Add a **UD field** to the Part table, then **regenerate the data model** so the field becomes queryable across BAQs, BPM, and Application Studio. Add a **ComboBox** bound to that field, populated from your new UD codes, directly onto Part Maintenance's layout.",
          "Finally, wire up the *experience*: an event launches a website based on which subtype is selected, a button gets disabled for subtypes where that action doesn't apply, and a Data Rule highlights fields relevant to the selected subtype — then a matching **PanelCardGrid** bound to a BAQ surfaces additional part info on a companion screen (Part Advisor). Deploy both the modified Part Maintenance and Part Advisor as a linked pair via Menu Maintenance."
        ],
        proTip: "This UD Codes → UD Field → regenerate model → ComboBox pattern is the standard recipe any time you need a brand-new categorization system without touching the core schema.",
        version: "both"
      }
    ],
    quiz: [
      {
        id: "q1",
        question: "What license unlocks creating brand-new applications from scratch in Application Studio?",
        options: ["Dashboard Developer rights", "Customize Privileges", "SDK license", "Administrator role"],
        correctIndex: 2,
        explanation: "The SDK license unlocks the 'Add New' application templates (Apps, Configurator, Dashboard, Process, Report, Shared)."
      },
      {
        id: "q2",
        question: "What must you provide to limit the Classic-to-Kinetic conversion program to specific applications?",
        options: [
          "A CustomizationConversionSettings XML file with at least a Key1 tag",
          "A CSV export from Menu Maintenance",
          "A BPM directive",
          "There is no way to limit scope"
        ],
        correctIndex: 0,
        explanation: "An XML settings file with a mandatory Key1 tag lets you target specific applications/layers for conversion."
      },
      {
        id: "q3",
        question: "In the Configuration Upgrade Dashboard, what does a 'Warning' status mean for a converted layer?",
        options: [
          "It converted perfectly, no action needed",
          "It partially converted and requires editing in Application Studio",
          "It failed completely and must be rebuilt from scratch",
          "It was skipped entirely"
        ],
        correctIndex: 1,
        explanation: "Warning means partial conversion — you need to finish the job manually in Application Studio."
      },
      {
        id: "q4",
        question: "What happens when you delete a parent base application that has child layers?",
        options: [
          "Only the parent is removed; children remain",
          "Nothing, deletion is blocked automatically",
          "The child layers cascade-delete along with the parent",
          "Child layers are promoted to become the new parent"
        ],
        correctIndex: 2,
        explanation: "Deleting a parent base app cascades and deletes its associated child layers too."
      },
      {
        id: "q5",
        question: "Which tool would you use to create an entirely new user-defined table/service with its own screens?",
        options: ["Data Rules Designer", "UD Service Designer (SDK)", "Application Map", "BAQ Designer"],
        correctIndex: 1,
        explanation: "The UD Service Designer (SDK) is used to create new user-defined services, tables, and deploy full Kinetic screens for them."
      }
    ]
  },
  {
    slug: "functions-server-logic",
    title: "Functions & Server-Side Logic",
    tagline: "API Keys, Function Libraries, and a real end-to-end Counter Sales walkthrough",
    icon: "🧬",
    estMinutes: 45,
    difficulty: "Advanced",
    lessons: [
      {
        id: "functions-overview",
        title: "What Are Kinetic Functions?",
        minutes: 7,
        body: [
          "**Functions** let you call into server-side logic or database tables — similar to BPM directives — but as a reusable, independently deployable unit. A Function is defined inside a **Library**, which is the single unit of deployment for one or more Functions.",
          "Because Functions are server-side, you can reuse the same Function across any client (desktop, browser, mobile) and even call it from a BPM directive. Functions are also exposed directly in the **Kinetic REST API v.2** — Kinetic applications already talk to the server via REST calls to v.2 endpoints, so Application Studio events can call your Function the exact same way.",
          "Two security groups control who can work with Functions: **Functions Administrator** (can publish/unpublish libraries) and **Functions Developer** (can create Widget Functions). Your account needs at least one of these to build or use Functions."
        ],
        version: "both",
        flow: {
          title: "Function anatomy",
          steps: [
            { label: "Library", detail: "Deployment unit, references services" },
            { label: "Function", detail: "Defined inside a library" },
            { label: "Signature", detail: "Request + Response parameters" },
            { label: "REST API v.2", detail: "Callable from any client or BPM" }
          ]
        }
      },
      {
        id: "api-key-and-library",
        title: "Creating an API Key & Function Library",
        minutes: 9,
        body: [
          "Kinetic REST API v.2 requires an **API Key** on every service method call. Create one in **API Key Maintenance** (System Setup → Security Maintenance → API Key Maintenance) — give it a Key ID and Name, then save. The key value displays only once immediately after creation, so copy it right away; if you lose it, you must create a new key.",
          "Next, create a **Function Library** in Epicor Functions Maintenance (System Management → Business Process Management → Epicor Functions Maintenance) → New → Add Library. Give it a Library ID and Description, then go to **References/Services** and add every service your Functions inside this library will call (e.g., the Customer service for a 'create customer' Function).",
          "On the **Security** sheet, add every company that should be authorized to call this library via REST — a Function can only be called from an authorized company."
        ],
        proTip: "The API Key value is shown exactly once. Save it to a secrets file or vault immediately — Kinetic will never display it again.",
        version: "both"
      },
      {
        id: "widget-function-design",
        title: "Designing a Widget Function",
        minutes: 10,
        body: [
          "A **Widget Function** is created directly inside the library (New → Add Widget Function). Give it a Function ID and Description, then define its **Signature**: Request Parameters (inputs, e.g. id/name/email/notes, all typed like System.String) and Response Parameters (outputs, e.g. newID).",
          "Open the **Function Designer** to build the workflow: drag an **InvokeBOMethod** widget from the Callers panel (e.g., GetNewCustomer), bind its dataset parameter to a new variable, then chain **SetField** widgets to populate fields from your request parameters (e.g., set Customer.Name from the incoming `name` parameter using the C# expression editor).",
          "Finish the chain with another InvokeBOMethod for business logic (e.g., GetCustomerTerritory) and a final **Update** call to persist the record — then map the resulting ID field to your Function's response parameter."
        ],
        version: "both",
        flow: {
          title: "Function Designer workflow",
          steps: [
            { label: "InvokeBOMethod", detail: "e.g. GetNewCustomer" },
            { label: "SetField ×N", detail: "Populate fields from request params" },
            { label: "InvokeBOMethod", detail: "Business logic, e.g. GetTerritory" },
            { label: "InvokeBOMethod: Update", detail: "Persist the record" },
            { label: "Map Response", detail: "Field → response parameter" }
          ]
        }
      },
      {
        id: "calling-function-from-event",
        title: "Calling a Function from an Event",
        minutes: 9,
        body: [
          "In the Event Designer, drag the **erp-function** action onto your workflow. Under Advanced, enter your **API Key**, select the **ERP Functions Library**, then the specific **Service Operation** (your Function's ID).",
          "Expand **Method Parameters** — the system reads your Function's signature automatically and lists every request parameter for you to map, either to a fixed value or a dataview column (e.g., `OrderHed.NewCustID`).",
          "Simple response parameters automatically populate the system **actionResult** dataview — so after the call, you can reference `actionResult.newID` in a following action (like a row-update) with zero extra wiring. For an **OnSuccess** branch, expand Behavior and add that option to only run further logic if the Function call succeeded."
        ],
        proTip: "Simple (non-tableset) Function response parameters land automatically in the actionResult system dataview — you rarely need to configure additional response mapping.",
        version: "both"
      },
      {
        id: "counter-sales-walkthrough",
        title: "Real Walkthrough: Making Counter Sales Easier",
        minutes: 10,
        body: [
          "This is a real, complete scenario from the official guide that ties everything together: a simplified Order Entry layer called **Counter Sale**, with a **New Customer** button that opens a sliding panel, calls a Function to create the customer on the fly, and auto-marks every order from this menu as a counter sale.",
          "**1) Layer + Menu**: Create a layer on Sales Order Entry, hide unnecessary fields on the Details page, save/publish it, then deploy it as a brand-new menu item (Menu Maintenance → New submenu, Program = Erp.UI.SalesOrderEntry, Customization = your layer).",
          "**2) Auto-mark Counter Sale orders**: A **BPM post-processing directive** on GetNewOrderHed checks if CallContext.Character01 = 'CounterSale', and if so sets OrderHed.CounterSale = true. A layer event (hooked to the system 'BeforeGetNew' event) sets that Character01 context value before the record is created.",
          "**3) New Customer button + sliding panel**: Add a button that opens a Sliding Panel with ID/Name/Email/Comments fields, each bound to temporary client-side bindings (e.g., `OrderHed.NewCustID`).",
          "**4) Wire the Function call**: An OnClick event on the panel's OK button calls your `NewCustomer` Function, maps its response (`actionResult.newID`) into the order's Customer field, triggers a `SysUpdate` event to save, then closes the panel with `slider-close`.",
          "The end result: clicking New Order → New Customer → filling the panel → OK creates a real customer record via server-side Function logic, auto-populates the order, and marks it as a counter sale — entirely built with events, a Function, and one BPM directive, zero custom code deployment."
        ],
        version: "both",
        flow: {
          title: "Counter Sales end-to-end",
          steps: [
            { label: "Layer + New Menu", detail: "Simplified Order Entry UI" },
            { label: "BPM Directive", detail: "Auto-mark CounterSale = true" },
            { label: "New Customer Button", detail: "Opens sliding panel" },
            { label: "Function Call (OK click)", detail: "Creates customer, returns ID" },
            { label: "row-update + Save", detail: "Populate Customer field, SysUpdate" }
          ]
        }
      }
    ],
    quiz: [
      {
        id: "q1",
        question: "What is the single unit of deployment for one or more Functions?",
        options: ["A BPM Directive", "A Library", "A Widget", "An Event"],
        correctIndex: 1,
        explanation: "Functions are created and deployed inside a Library — the single deployment unit."
      },
      {
        id: "q2",
        question: "What must every Kinetic REST API v.2 service method call include?",
        options: ["A BPM context variable", "An API Key", "A sliding panel ID", "A DataView filter"],
        correctIndex: 1,
        explanation: "REST API v.2 requires an API Key to be passed with every service method call."
      },
      {
        id: "q3",
        question: "Where do simple (non-tableset) Function response parameters automatically land after an erp-function call?",
        options: ["The TransView dataview", "The actionResult system dataview", "A new custom dataview", "They must be manually mapped every time"],
        correctIndex: 1,
        explanation: "Simple response parameters populate the actionResult system dataview automatically."
      },
      {
        id: "q4",
        question: "In the Counter Sales walkthrough, what mechanism auto-marks new orders as Counter Sale?",
        options: [
          "A Data Rule with a highlight action",
          "A BPM post-processing directive checking a call context field",
          "A hardcoded default in the DataView",
          "The Function itself sets the flag directly"
        ],
        correctIndex: 1,
        explanation: "A BPM post-processing directive on GetNewOrderHed checks CallContext.Character01 and sets OrderHed.CounterSale accordingly."
      },
      {
        id: "q5",
        question: "Which two security groups govern working with Functions?",
        options: [
          "Customize Privileges and Dashboard Developer",
          "Functions Administrator and Functions Developer",
          "SDK License and API Administrator",
          "BPM Administrator and Event Developer"
        ],
        correctIndex: 1,
        explanation: "Functions Administrator can publish/unpublish libraries; Functions Developer can create Widget Functions."
      }
    ]
  },
  {
    slug: "component-reference-library",
    title: "Component Reference Library",
    tagline: "The specialized controls beyond the basics — combos, pickers, ERP fields, and rich content",
    icon: "🧰",
    estMinutes: 35,
    difficulty: "Intermediate",
    lessons: [
      {
        id: "combo-deep-dive",
        title: "ComboBox Deep Dive: Five Ways to Populate a Dropdown",
        minutes: 8,
        body: [
          "**Static List Combo** — hardcode a fixed set of options directly on the component; use for values that never change (e.g., Yes/No/Maybe).",
          "**BAQ Combo** — bind to a Business Activity Query; the combo runs the BAQ and lists matching rows. Great for filtered lookups like 'customers in a selected state.'",
          "**BO Combo (default GetList / custom method)** — call a Business Object's built-in GetList method, or point at a fully custom service method for full control over the returned rows.",
          "**Reusable Combo** — configure ComboId, SvcPath (e.g., `Ice.BO.UD05Svc`), ServiceMethod (`GetRows`), and TableName to bind a dropdown straight to a UD table without writing a BAQ — this is the exact pattern used for listing UD05 Service Codes on Order Entry.",
          "**DataView Combo / Combo in a Grid** — bind to values already loaded in another dataview, or embed a combo directly as a grid cell for inline editing."
        ],
        proTip: "For UD-table-backed dropdowns (like custom service codes), Reusable Combo is almost always faster to set up than writing a dedicated BAQ.",
        version: "both"
      },
      {
        id: "pickers-and-datetime",
        title: "Pickers & Date/Time Controls",
        minutes: 6,
        body: [
          "**DatePicker** and **TimePicker** bind to date/numeric columns respectively. TimePicker has handy Advanced options: Now Button, Cancel Button, Use24HourClock, and **TimeStoredAsDateTime** — which links the time value to a companion DatePicker so both edit the same underlying database column.",
          "**IsDecimal** on TimePicker stores time as decimal hours (e.g., 18.256 = 6:15pm) instead of seconds-since-midnight — used by scheduling boards for more precise math. **RoundToMinutes** trims seconds from the display.",
          "**FilePickerClient** and **FilePickerServer** let users attach files from their local machine vs. a server-side folder respectively — paired with **FileServerFolder** to define where server-side files live."
        ],
        version: "both"
      },
      {
        id: "erp-financial-components",
        title: "Financial & ERP-Specific Components",
        minutes: 7,
        body: [
          "**GLAccountEditor**, **GLControlPanel**, and **GLMultibookAccountEditor** are purpose-built for General Ledger account entry — they understand GL account segment structure and multi-book accounting out of the box, so you never rebuild that logic yourself.",
          "**FiscalYearSuffix** renders the correct fiscal year suffix format for your company's calendar. **PartRevDescription** shows a part's revision + description together, exactly as seen throughout Part Maintenance. **QuantityUOM** pairs a quantity field with its unit-of-measure selector as a single control.",
          "**CurrencyBox** and **CurrencySelector** handle currency-formatted numeric entry and currency code selection — use them instead of a plain NumericBox anywhere money is involved so formatting stays consistent system-wide."
        ],
        version: "both"
      },
      {
        id: "rich-content-components",
        title: "Rich Content & Visualization Components",
        minutes: 7,
        body: [
          "**PDFViewer** renders a PDF inline in the page — handy for showing an attached document without leaving the screen. **RichTextEditor** gives users a WYSIWYG editor for formatted notes/descriptions instead of a plain TextArea.",
          "**RelationshipMap** visualizes hierarchical or networked relationships (e.g., BOM structures) as an interactive diagram. **Scheduler** renders a calendar/timeline view for resource or job scheduling. **MultiviewCalendar** shows multiple calendar views side by side.",
          "**PictureBox** displays an image bound to a data column (e.g., a part photo) — commonly paired with FilePickerClient so users can upload a new image directly into the same field."
        ],
        version: "both"
      },
      {
        id: "selection-and-search",
        title: "Selection & Search Components",
        minutes: 7,
        body: [
          "**SelectionList** lets users multi-select from a custom list — the setup requires three steps: create a dataview for the list source, configure an event to populate that view, then configure the SelectionList itself to read from it.",
          "**SearchChipSelector** shows selected items as removable 'chips' with a search box to add more — a modern pattern for multi-value fields like tags or categories.",
          "**LinkComboBox** renders combo options as clickable links instead of a dropdown. **ListBox** shows a scrollable list without the dropdown behavior. **MultilevelMenu** builds nested/cascading menu structures. **Tag** shows a colored status label — OK/Warning/Stop/Global/None — the same visual language used throughout Kinetic for status indicators."
        ],
        proTip: "Reach for Tag whenever you want a quick, consistent-looking status pill — it already matches Kinetic's built-in color conventions.",
        version: "both"
      }
    ],
    quiz: [
      {
        id: "q1",
        question: "Which ComboBox setup would you use to list rows from a UD05 table without writing a BAQ?",
        options: ["Static List Combo", "BAQ Combo", "Reusable Combo (SvcPath/ServiceMethod/TableName)", "DataView Combo"],
        correctIndex: 2,
        explanation: "Reusable Combo binds directly to a service/method/table (e.g., Ice.BO.UD05Svc + GetRows + UD05) without a BAQ."
      },
      {
        id: "q2",
        question: "What does the TimeStoredAsDateTime property on TimePicker do?",
        options: [
          "Converts time to decimal hours",
          "Links the time value to a companion DatePicker's date column",
          "Rounds the time to the nearest minute",
          "Adds a Now button"
        ],
        correctIndex: 1,
        explanation: "TimeStoredAsDateTime binds the time value to the same column as a paired DatePicker, so editing one preserves the other."
      },
      {
        id: "q3",
        question: "Which component is purpose-built for General Ledger account segment entry?",
        options: ["CurrencyBox", "GLAccountEditor", "QuantityUOM", "NumericBox"],
        correctIndex: 1,
        explanation: "GLAccountEditor understands GL account segment structure out of the box."
      },
      {
        id: "q4",
        question: "What are the three setup steps for a SelectionList component?",
        options: [
          "Add a button, add an event, publish the layer",
          "Create a dataview for the list source, configure an event to populate it, configure the SelectionList to read from it",
          "Create a BAQ, add a combo, bind a grid",
          "Enable FullScreen, add a container, bind columns"
        ],
        correctIndex: 1,
        explanation: "SelectionList requires a source dataview, a populating event, and the SelectionList's own read configuration."
      },
      {
        id: "q5",
        question: "Which component displays a colored status label using the OK/Warning/Stop/Global/None convention?",
        options: ["Shape", "Tag", "PictureBox", "RelationshipMap"],
        correctIndex: 1,
        explanation: "Tag renders Kinetic's standard colored status pill using that same five-value convention."
      }
    ]
  }
];

export function getModule(slug: string) {
  return modules.find((m) => m.slug === slug);
}

export function totalQuizQuestions() {
  return modules.reduce((sum, m) => sum + m.quiz.length, 0);
}
