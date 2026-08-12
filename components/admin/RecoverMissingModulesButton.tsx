"use client";

import { useState } from "react";
import { importMissingModulesIntoCourse } from "../../lib/admin/actions";
import { useToast } from "./ToastProvider";

export default function RecoverMissingModulesButton({ courseSlug }: { courseSlug: string }) {
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<{ imported: string[]; skipped: string[]; warnings: string[] } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { show } = useToast();

  async function handleRun() {
    if (
      !confirm(
        `Scan lib/allModules.ts for any legacy modules not yet in this course, and import ONLY the missing ones as new topics here? Modules that already exist as topics will be skipped, not duplicated.`
      )
    ) {
      return;
    }
    setRunning(true);
    setError(null);
    setResult(null);
    try {
      const res = await importMissingModulesIntoCourse(courseSlug);
      if (!res.ok) {
        setError(res.error ?? "Recovery failed.");
        show(res.error ?? "Recovery failed.", "error");
        return;
      }
      setResult(res.data ?? null);
      show(`Imported ${res.data?.imported.length ?? 0} missing module(s).`, "success");
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="space-y-2 rounded-lg border border-amber-200 bg-amber-50 p-4">
      <p className="text-xs text-amber-800">
        If a legacy module (e.g. from lib/allModules.ts) is missing from this course's topic list, this
        scans for it and adds only what's missing — nothing existing is touched or duplicated.
      </p>
      <button
        type="button"
        onClick={handleRun}
        disabled={running}
        className="rounded-md bg-amber-900 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-amber-800 disabled:opacity-50"
      >
        {running ? "Scanning…" : "Recover Missing Modules"}
      </button>
      {error && <p className="text-xs text-red-700">⚠️ {error}</p>}
      {result && (
        <div className="space-y-1 text-xs text-amber-900">
          {result.imported.length > 0 && <p>✅ Imported: {result.imported.join(", ")}</p>}
          {result.skipped.length > 0 && <p>⏭ Already present: {result.skipped.join("; ")}</p>}
          {result.warnings.length > 0 && (
            <ul className="list-disc pl-4">
              {result.warnings.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
