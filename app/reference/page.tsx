import Link from "next/link";
import UILandmarks from "../../components/UILandmarks";

export default function ReferencePage() {
  return (
    <div className="space-y-10">
      <div>
        <span className="badge-pill">🖼️ From the Official Guide</span>
        <h1 className="mt-4 text-3xl font-bold text-[var(--text-hi)]">UI Reference Guide</h1>
        <p className="mt-2 max-w-2xl text-sm text-[var(--text-mid)]">
          Every screen, panel, and button below is transcribed directly from real Application
          Studio screenshots in the Kinetic AppStudio user guides — so you know exactly where to
          click before you ever open the tool.
        </p>
      </div>

      <Section title="1. Application Studio Anatomy">
        <UILandmarks
          title="What each part of the Application Studio screen does"
          landmarks={[
            { label: "Application Map", description: "Left rail icon — default view showing the page hierarchy as a map." },
            { label: "Layout Designer", description: "Left rail icon — drag-and-drop page building." },
            { label: "Data Rule Designer", description: "Left rail icon — create conditions & actions." },
            { label: "Event Designer", description: "Left rail icon — wire up triggered logic." },
            { label: "Data View Designer", description: "Left rail icon — manage the app's data views." },
            { label: "Publish History", description: "Left rail icon — log of every publish, with user + timestamp." },
            { label: "Application Studio Help", description: "Left rail icon (bottom, '?') — opens contextual help articles." },
            { label: "Page Caption", description: "Large heading (e.g. 'Sales Orders') showing the current page's display name." },
            { label: "Tabs", description: "Strip across the top — every open page/rule/event/view gets its own tab." },
            { label: "Layer Name", description: "Blue text under the Application Name (e.g. 'MyNewLayer') — click to open Layer Selection." },
            { label: "Application Name", description: "e.g. 'Erp.UI.SalesOrderEntry' — the full prefixed app ID." },
            { label: "Preview / Save icons", description: "Top-right toolbar — Preview runs the layer live; the disk icon saves it as a draft." },
            { label: "Overflow Menu (⋮)", description: "Top-right — Publish, Close All Tabs, and other layer-level actions." },
            { label: "Device Type", description: "Laptop icon dropdown — switch the canvas between Any Device / Phone / Tablet." },
            { label: "Components / User Defined / Widgets", description: "Toolbox tabs on the right — base controls, your custom components, and widgets." },
            { label: "Search", description: "Filters the Toolbox list as you type a component name." },
            { label: "Canvas", description: "The center design surface where you drop and arrange components." },
            { label: "Problems Panel", description: "Bottom bar — shows validation errors/warnings; drag its top edge up to expand." },
          ]}
        />
      </Section>

      <Section title="2. Launching Application Studio From Any Screen">
        <p className="text-sm text-[var(--text-mid)]">
          From any Kinetic screen's Overflow menu (⋮), scroll to the bottom — <strong className="text-[var(--text-hi)]">Application Studio</strong>{" "}
          sits below Settings, Debug Tool, Translation Utility, and Personalization. This is the
          same entry point as pressing <strong className="text-[var(--text-hi)]">Ctrl+Alt+D</strong>.
        </p>
      </Section>

      <Section title="3. Right-Click Context Menus You'll Use Constantly">
        <UILandmarks
          title="Copy / Delete behavior differs by entity type"
          landmarks={[
            { label: "Rules list", description: "Right-click any rule (e.g. 'Addison_Discount') → Copy or Delete. System rules can only be copied, never deleted." },
            { label: "Events tree", description: "Right-click an event under Component → Control (e.g. 'OnClick_CreditCardSaleAction') → Copy or Delete." },
            { label: "Views list", description: "Right-click a data view (e.g. 'OrderDtl') → Delete only — custom views can be removed, but not copied this way." },
          ]}
        />
      </Section>

      <Section title="4. The Trigger Panel">
        <p className="text-sm text-[var(--text-mid)]">
          Every triggered event exposes three fields: <strong className="text-[var(--text-hi)]">Type</strong> (Control),{" "}
          <strong className="text-[var(--text-hi)]">Hook</strong> (On Click), and{" "}
          <strong className="text-[var(--text-hi)]">Target</strong> (the Action ID, e.g. 'CreditCardSaleAction'). This is
          the exact trio you fill in whenever you wire a button to an event.
        </p>
      </Section>

      <Section title="5. Publish History Table">
        <p className="text-sm text-[var(--text-mid)]">
          Columns are always <strong className="text-[var(--text-hi)]">User</strong>,{" "}
          <strong className="text-[var(--text-hi)]">Published Date/Time</strong>, and{" "}
          <strong className="text-[var(--text-hi)]">Description</strong> — a running audit log every time
          a layer is published, so you can always see who shipped what and when.
        </p>
      </Section>

      <Section title="6. Multi-Tab Editing">
        <p className="text-sm text-[var(--text-mid)]">
          You can have Application Map, a page, an event, a rule, and Publish History all open as
          separate tabs simultaneously (e.g. 'Application Map | NewView-3 | AfterClearUI |
          CloseStatus | NewEvent-1 | Publish History'). Each tab validates independently when you Save.
        </p>
      </Section>

      <Section title="7. Reading the Problems Panel">
        <p className="text-sm text-[var(--text-mid)]">
          System events show a <strong className="text-[var(--text-hi)]">Locked</strong> badge (like 'GetNew') — you can view
          their flow but not edit it directly. Common validation errors you'll see verbatim in the
          Problems panel: <em>"All shapes should be connected by lines"</em> and{" "}
          <em>"There should be only 1 or 2 connectors from a condition action."</em>
        </p>
      </Section>

      <Section title="8. Layer Selection Panel">
        <UILandmarks
          title="Fields and links inside Layer Selection"
          landmarks={[
            { label: "Save Layer / Change Layer", description: "Top links — save your current work, or switch to a different existing layer." },
            { label: "Layer Name & CGCCode", description: "Layer Name is mandatory; CGCCode (Country Group Code) is for localization solutions and usually left blank." },
            { label: "Device Type dropdown", description: "Any Device (default), Phone, or Tablet — a Phone/Tablet layer always needs an Any Device parent." },
            { label: "Create Layer", description: "Top-right link on the layer list screen — starts a brand-new layer." },
            { label: "Parent Layer checkbox", description: "Shown when creating a child (Phone/Tablet) layer — ties it to its Any Device parent." },
            { label: "Merge Layers", description: "Combine multiple layers into one; drag to reorder — last layer in the list wins on conflicts." },
          ]}
        />
      </Section>

      <Section title="9. Real Walkthrough: Customer Entry, Start to Finish">
        <p className="mb-4 text-sm text-[var(--text-mid)]">
          This sequence — straight from the guide's Customer Entry example — ties together almost
          everything in the Application Map &amp; Page Architecture module:
        </p>
        <ol className="space-y-3">
          <WalkStep n={1} text="Application Map shows the Customer landing page node with edit/panel/add icons; selecting it renders the searchable grid on the right, with the search box bound to LandingPage.CustID." />
          <WalkStep n={2} text="The grid itself is a metafx-panel-card-grid component — its Grid Model properties show ID = grdLandingPage and Ep Binding = LandingPage." />
          <WalkStep n={3} text="Selecting a customer (e.g. ADDISON) navigates to the Details tab, which exposes Activity and Details child pages." />
          <WalkStep n={4} text="The Details tab's own properties show exactly how a Tab links to a Page: Id, Title, EpBinding, a Selected checkbox, and a Page dropdown pointing at 'Details'." />
          <WalkStep n={5} text="Drilling into Details reveals a nested tree: Customer Detail → Billing → Price Lists, Discount Price Lists, Alternate Bill To, GL Control, Credit → Global Credit." />
          <WalkStep n={6} text="The full Customer Detail panel is a 4-column layout (Customer, Territory, Contact Info, Status groups) — and its Advanced properties show Enable FullScreen checked, which is exactly what promotes a PanelCard into a Virtual Page." />
          <WalkStep n={7} text="Scrolling further reveals a second container (Additional Detail, ACH Payments, E-Invoice, Bank Statement) with its own 'Full Screen' button — this is the primary vs. additional container split covered in the Components module." />
          <WalkStep n={8} text="At runtime, clicking Full Screen expands to show every field with live data (address, territory, EORI, etc.) and a Back button to collapse again." />
          <WalkStep n={9} text="The 'Change ID' button on this page has Action Data properties: ID = Customer.ChgIDButton, Description = Change ID, EpBinding = Customer.ChgIDButton." />
          <WalkStep n={10} text="Clicking it fires the (Locked, system) event 'OnClick_Control_Customer.ChgIDButton' — whose flow is exactly: Control:Customer.ChgIDButton onClick → row-update → slider-open. This is the same 3-step recipe taught in the Sliding Panels lesson, now confirmed straight from a real system event." />
          <WalkStep n={11} text="That opens the 'Change Customer ID' sliding panel with a New Customer ID field and OK/Cancel buttons — a live Sliding Panel in action." />
          <WalkStep n={12} text="Finally, in the actual Kinetic runtime (not App Studio), end users see this exact Customer ADDISON Details page with Get Territory and Change ID buttons live in production — proving every App Studio edit flows straight through to what employees use every day." />
        </ol>
      </Section>

      <div className="text-center">
        <Link href="/modules" className="text-sm font-medium text-[var(--primary)] hover:underline">
          ← Back to Training Modules
        </Link>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass-card rounded-2xl p-6">
      <h2 className="mb-3 text-lg font-semibold text-[var(--text-hi)]">{title}</h2>
      {children}
    </div>
  );
}

function WalkStep({ n, text }: { n: number; text: string }) {
  return (
    <li className="flex gap-4 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-4">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--primary)] text-xs font-bold text-white">
        {n}
      </span>
      <p className="text-sm text-[var(--text-mid)]">{text}</p>
    </li>
  );
}
