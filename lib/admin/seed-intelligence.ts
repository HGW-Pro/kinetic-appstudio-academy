"use server";

import { revalidatePath } from "next/cache";
import { assertAdminOrThrow } from "./guard";
import { createSupabaseServerClient } from "../supabase/server";
import type { ActionResult } from "./actions";

type SkillSeed = { slug: string; name: string; description: string; sequence_order: number };
type GlossarySeed = {
  slug: string;
  term: string;
  definition: string;
  simple_explanation: string;
  used_in: string;
  related_topic_slugs: string[];
};

export const DEFAULT_SKILLS: SkillSeed[] = [
  { slug: "epicor-foundations", name: "Epicor Foundations", description: "Core Epicor and Kinetic concepts, access, navigation, and business context.", sequence_order: 1 },
  { slug: "kinetic-navigation", name: "Kinetic Navigation", description: "Navigating Kinetic applications, menus, pages, and developer entry points.", sequence_order: 2 },
  { slug: "application-studio", name: "Application Studio", description: "Using Application Studio to inspect, configure, test, and manage Kinetic applications.", sequence_order: 3 },
  { slug: "ui-components", name: "UI Components", description: "Choosing, configuring, and composing Kinetic UI components.", sequence_order: 4 },
  { slug: "events", name: "Events", description: "Using event-driven behavior to respond to user and application activity.", sequence_order: 5 },
  { slug: "widgets", name: "Widgets", description: "Building data-entry and display experiences with Kinetic widgets.", sequence_order: 6 },
  { slug: "dataviews", name: "DataViews", description: "Modeling, loading, filtering, and binding client-side DataViews.", sequence_order: 7 },
  { slug: "conditions", name: "Conditions", description: "Expressing declarative conditions, data rules, and branching UI logic.", sequence_order: 8 },
  { slug: "layers", name: "Layers", description: "Creating and maintaining upgrade-friendly Application Studio layers.", sequence_order: 9 },
  { slug: "publishing", name: "Publishing", description: "Testing, upgrading, and publishing Kinetic customizations safely.", sequence_order: 10 },
  { slug: "functions", name: "Functions", description: "Using reusable Epicor Functions and server-side logic from Kinetic.", sequence_order: 11 },
  { slug: "debugging", name: "Debugging", description: "Diagnosing configuration, data, event, and publishing problems.", sequence_order: 12 },
];

export const DEFAULT_GLOSSARY_TERMS: GlossarySeed[] = [
  { slug: "baq", term: "BAQ", definition: "Business Activity Query: Epicor's reusable query definition for selecting, shaping, and exposing ERP data.", simple_explanation: "A BAQ is a saved data query you can reuse in Kinetic instead of writing a one-off report or integration query.", used_in: "BAQ Designer, dashboards, reports, DataViews, searches, integrations, and BAQ-backed controls.", related_topic_slugs: ["baq-foundations-first-query", "baq-tables-relationships-joins", "baq-dataviews-grids-runtime-filtering"] },
  { slug: "bpm", term: "BPM", definition: "Business Process Management: Epicor's server-side framework for applying logic before, during, or after business-object processing.", simple_explanation: "A BPM automates or checks ERP business processes when data is being processed.", used_in: "Method directives, data directives, validation, notifications, and update processing.", related_topic_slugs: ["advanced-ubaq-bpm-processing", "functions-server-logic"] },
  { slug: "dataview", term: "DataView", definition: "A client-side tabular data model that Kinetic components can bind to, filter, update, and use as an event context.", simple_explanation: "A DataView is the named set of rows and columns your Kinetic screen works with.", used_in: "Application Studio bindings, grids, ComboBoxes, events, conditions, and BAQ results.", related_topic_slugs: ["dataviews-widgets-panels", "baq-dataviews-grids-runtime-filtering", "baq-combos-app-studio-events"] },
  { slug: "ud-field", term: "UD Field", definition: "A user-defined field added to an Epicor business table to store organization-specific information without altering standard product fields.", simple_explanation: "A UD Field is a custom data field your organization adds for information Epicor does not provide out of the box.", used_in: "User-defined tables and forms, BPMs, BAQs, DataViews, and Application Studio bindings.", related_topic_slugs: ["components-and-layout", "baq-dataviews-grids-runtime-filtering"] },
  { slug: "layer", term: "Layer", definition: "An Application Studio configuration layer that applies changes over a base Kinetic application while keeping the base definition intact.", simple_explanation: "A layer is your safe customization overlay; it lets you change a screen without editing the standard app.", used_in: "Application Studio customization, upgrade review, publishing, and governance.", related_topic_slugs: ["app-studio-fundamentals", "layers-publishing-sdk"] },
  { slug: "customization", term: "Customization", definition: "A deliberate change to an Epicor experience or process to meet organization-specific needs, commonly delivered through Application Studio layers, BPMs, or functions.", simple_explanation: "A customization changes Kinetic to fit how your organization works.", used_in: "Application Studio, layers, BPMs, functions, security, testing, and release management.", related_topic_slugs: ["app-studio-fundamentals", "layers-publishing-sdk"] },
  { slug: "widget", term: "Widget", definition: "A configurable Kinetic UI component used to display information, collect input, or trigger actions.", simple_explanation: "A widget is a building block on a Kinetic screen, such as a text box, grid, button, or ComboBox.", used_in: "Application Studio layouts, forms, dashboards, grids, and data-entry experiences.", related_topic_slugs: ["components-and-layout", "component-reference-library", "dataviews-widgets-panels"] },
  { slug: "event", term: "Event", definition: "A configured response to a Kinetic lifecycle or user interaction, such as a screen opening, a value changing, or a button being clicked.", simple_explanation: "An event tells Kinetic what to do when something happens.", used_in: "Application Studio event editor, widget behavior, DataView changes, functions, and integration calls.", related_topic_slugs: ["data-rules-and-events", "baq-combos-app-studio-events"] },
  { slug: "directive", term: "Directive", definition: "A BPM rule that runs at a defined point in business-object method processing or when a data change occurs.", simple_explanation: "A directive is the rule inside a BPM that decides when and how server-side logic runs.", used_in: "Method directives, data directives, validation, automation, and updateable BAQ processing.", related_topic_slugs: ["advanced-ubaq-bpm-processing", "updatable-baq-fundamentals"] },
  { slug: "function", term: "Function", definition: "A reusable Epicor server-side unit of logic, organized in a Function Library and callable from Kinetic, BPMs, REST, and other clients.", simple_explanation: "A Function packages useful backend work so multiple apps and processes can call it.", used_in: "Epicor Functions Maintenance, Application Studio events, BPMs, REST API v2, and integrations.", related_topic_slugs: ["functions-server-logic", "baq-rest-integration"] },
  { slug: "rest", term: "REST", definition: "A web API style that exposes resources and operations through HTTP requests; Kinetic REST API v2 provides programmatic access to Epicor services and functions.", simple_explanation: "REST is the web-based way an application sends requests to Epicor services.", used_in: "Kinetic REST API v2, integrations, Application Studio service calls, BAQs, and functions.", related_topic_slugs: ["baq-rest-integration", "functions-server-logic"] },
  { slug: "erp-baq", term: "ERP BAQ", definition: "An Application Studio event action that executes an Epicor BAQ and places its result set into a DataView for use by the client application.", simple_explanation: "ERP BAQ is how an App Studio event runs a saved BAQ and brings its results onto the screen.", used_in: "Application Studio event actions, DataViews, BAQ-backed combos, grids, and runtime filtering.", related_topic_slugs: ["dataviews-widgets-panels", "baq-dataviews-grids-runtime-filtering", "baq-combos-app-studio-events"] },
  { slug: "application-map", term: "Application Map", definition: "The Application Studio structure that represents an application's pages, tabs, panels, relationships, and navigation hierarchy.", simple_explanation: "The Application Map is the outline of how a Kinetic app is organized.", used_in: "Application Studio design mode, page architecture, layout, navigation, and layer configuration.", related_topic_slugs: ["application-map-and-pages", "components-and-layout"] },
];

function actionError(error: unknown): ActionResult {
  if (error instanceof Error) {
    if (error.message === "UNAUTHENTICATED") return { ok: false, error: "You must be signed in." };
    if (error.message === "NOT_AUTHORIZED") return { ok: false, error: "Admin access required." };
    return { ok: false, error: error.message };
  }
  return { ok: false, error: "An unexpected error occurred." };
}

export async function seedDefaultSkills(): Promise<ActionResult<{ count: number }>> {
  try {
    await assertAdminOrThrow();
    const supabase = createSupabaseServerClient();
    const { error } = await supabase.from("skills").upsert(DEFAULT_SKILLS, { onConflict: "slug" });
    if (error) return { ok: false, error: error.message };
    revalidatePath("/dashboard");
    revalidatePath("/progress");
    revalidatePath("/admin/courses");
    return { ok: true, data: { count: DEFAULT_SKILLS.length } };
  } catch (error) {
    return actionError(error);
  }
}

export async function seedDefaultGlossary(): Promise<ActionResult<{ count: number }>> {
  try {
    await assertAdminOrThrow();
    const supabase = createSupabaseServerClient();
    const { error } = await supabase.from("glossary_terms").upsert(DEFAULT_GLOSSARY_TERMS, { onConflict: "slug" });
    if (error) return { ok: false, error: error.message };
    revalidatePath("/glossary");
    revalidatePath("/admin/courses");
    return { ok: true, data: { count: DEFAULT_GLOSSARY_TERMS.length } };
  } catch (error) {
    return actionError(error);
  }
}
