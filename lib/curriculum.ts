export type Lesson = {
  id: string;
  title: string;
  minutes: number;
  body: string[]; // paragraphs / bullet groups rendered as rich text
  proTip?: string;
  version?: "2023.1" | "2023.2" | "both";
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
  icon: string; // emoji for zero-dependency premium feel
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
        version: "both"
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
        version: "both"
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
        version: "both"
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
        version: "both"
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
        version: "both"
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
        version: "both"
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
        version: "both"
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
        version: "both"
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
          "This exact recipe — button → event → slider-open action — is reused everywhere in Kinetic, from map lookups to confirmation dialogs."
        ],
        version: "both"
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
        version: "both"
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
        version: "both"
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
  }
];

export function getModule(slug: string) {
  return modules.find((m) => m.slug === slug);
}

export function totalQuizQuestions() {
  return modules.reduce((sum, m) => sum + m.quiz.length, 0);
}
