"use client";

import type {
  SimulatorChallengeDefinition,
  SimulatorComponentKind,
  SimulatorEventAction,
  SimulatorEventTrigger,
  SimulatorEventValue,
} from "../../lib/training-schema";

export type { SimulatorChallengeDefinition, SimulatorComponentKind };

export type CanvasComponent = {
  id: string;
  type: SimulatorComponentKind;
  label: string;
  binding: string;
  required: boolean;
  event?: SimulatorEventConfig;
};

export type SimulatorEventConfig = {
  trigger: SimulatorEventTrigger;
  action: SimulatorEventAction;
  field: string;
  value: SimulatorEventValue;
};

export const toolboxComponents: { type: SimulatorComponentKind; description: string }[] = [
  { type: "TextBox", description: "Single-line text input" },
  { type: "NumericBox", description: "Number input" },
  { type: "ComboBox", description: "Selection list" },
  { type: "CheckBox", description: "Boolean toggle" },
  { type: "DateTime", description: "Date and time field" },
  { type: "Grid", description: "Tabular data region" },
  { type: "Button", description: "Action button" },
];

export const defaultComponentProperties: Record<SimulatorComponentKind, Omit<CanvasComponent, "id" | "type">> = {
  TextBox: { label: "New TextBox", binding: "", required: false },
  NumericBox: { label: "New NumericBox", binding: "", required: false },
  ComboBox: { label: "New ComboBox", binding: "", required: false },
  CheckBox: { label: "New CheckBox", binding: "", required: false },
  DateTime: { label: "New Date", binding: "", required: false },
  Grid: { label: "New Grid", binding: "", required: false },
  Button: { label: "New Button", binding: "", required: false },
};
