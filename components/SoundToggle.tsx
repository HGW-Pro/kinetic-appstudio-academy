"use client";

import { useEffect, useState } from "react";
import { isSoundOn, toggleSound } from "../lib/sounds";

export default function SoundToggle() {
  const [on, setOn] = useState(true);

  useEffect(() => {
    setOn(isSoundOn());
  }, []);

  return (
    <button
      onClick={() => setOn(toggleSound())}
      title={on ? "Mute sound effects" : "Unmute sound effects"}
      aria-label={on ? "Mute sound effects" : "Unmute sound effects"}
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-[var(--border-strong)] bg-[var(--surface-2)] text-sm transition hover:bg-[var(--surface-3)]"
    >
      {on ? "🔊" : "🔇"}
    </button>
  );
}
