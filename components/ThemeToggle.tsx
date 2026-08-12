"use client";

import { useEffect, useState } from "react";

type ThemeName = "academy" | "kinetic-light" | "kinetic-dark";

const themes: { id: ThemeName; label: string }[] = [
  { id: "academy", label: "Academy Standard" },
  { id: "kinetic-light", label: "Kinetic Default" },
  { id: "kinetic-dark", label: "Kinetic Dark" },
];

const STORAGE_KEY = "kinetic-academy-theme";
const KINETIC_LIGHT: Record<string, string> = {
  "--primary": "#0078d4", "--primary-dark": "#005a9e", "--primary-light": "#3a96dd",
  "--surface": "#ffffff", "--surface-2": "#f3f5f7", "--surface-3": "#e5e9ed",
  "--text-hi": "#1f2933", "--text-mid": "#4b5563", "--text-lo": "#6b7280",
  "--border": "#d9dee3", "--border-strong": "#b8c1ca", "--success": "#107c10",
  "--success-soft": "#dff6dd", "--error": "#c50f1f", "--error-soft": "#fde7e9",
};
const KINETIC_DARK: Record<string, string> = {
  "--primary": "#4ea8de", "--primary-dark": "#2584bc", "--primary-light": "#78bdea",
  "--surface": "#1e252b", "--surface-2": "#283239", "--surface-3": "#354149",
  "--text-hi": "#f4f7f8", "--text-mid": "#c5cdd2", "--text-lo": "#96a3ab",
  "--border": "#3d4951", "--border-strong": "#52616b", "--success": "#6ccb5f",
  "--success-soft": "#1e3a24", "--error": "#ff8b94", "--error-soft": "#47242a",
};

function applyTheme(theme: ThemeName) {
  const root = document.documentElement;
  root.dataset.theme = theme;
  const values = theme === "kinetic-light" ? KINETIC_LIGHT : theme === "kinetic-dark" ? KINETIC_DARK : null;
  for (const key of Object.keys({ ...KINETIC_LIGHT, ...KINETIC_DARK })) {
    if (values) root.style.setProperty(key, values[key]);
    else root.style.removeProperty(key);
  }
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeName>("academy");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY) as ThemeName | null;
    if (saved && themes.some((entry) => entry.id === saved)) {
      setTheme(saved);
      applyTheme(saved);
    }
  }, []);

  function changeTheme(nextTheme: ThemeName) {
    setTheme(nextTheme);
    applyTheme(nextTheme);
    window.localStorage.setItem(STORAGE_KEY, nextTheme);
  }

  return (
    <label className="hidden items-center gap-2 sm:flex">
      <span className="sr-only">Application theme</span>
      <select
        value={theme}
        onChange={(event) => changeTheme(event.target.value as ThemeName)}
        className="max-w-[9.5rem] rounded-md border border-[var(--border-strong)] bg-[var(--surface-2)] px-2 py-2 text-xs font-medium text-[var(--text-hi)] outline-none transition hover:bg-[var(--surface-3)] focus:border-[var(--primary)]"
        aria-label="Application theme"
      >
        {themes.map((entry) => (
          <option key={entry.id} value={entry.id}>{entry.label}</option>
        ))}
      </select>
    </label>
  );
}
