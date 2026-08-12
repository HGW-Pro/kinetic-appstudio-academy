"use client";

import { useState } from "react";
import { migrateLegacyCurriculum } from "../../lib/admin/migrate-legacy";
import { useToast } from "./ToastProvider";

export default function MigrationButton() {
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<{ importedCourses: string[]; warnings: string[] } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { show } = useToast();

  async function handleRun() {
    if (
      !confirm(
        "Import all existing curriculum content (from lib/allModules.ts and lib/courses.ts) into the CMS database? This only adds new courses — it won't modify your live student-facing pages."
      )
    ) {
      return;
    }
    setRunning(true);
    setError(null);
    setResult(null);
    try {
      const res = await migrateLegacyCurriculum();
      if (!res.ok) {
        setError(res.error ?? "Migration failed.");
        show(res.error ?? "Migration failed.", "error");
        if (res.data) setResult(res.data);
        return;
      }
      setResult(res.data ?? null);
      show(`Imported ${res.data?.importedCourses.length ?? 0} course(s).`, "success");
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="space-y-3 rounded-xl border border-amber-200 bg-amber-50 p-6">
      <div>
        <h3 className="text-base font-semibold text-amber-900">One-Time: Import Existing Curriculum</h3>
        <p className="mt-1 text-sm text-amber-800">
          Reads your current lib/allModules.ts and lib/courses.ts content and copies it into this CMS
          as real courses/topics/subtopics/quizzes, so you can manage it here going forward. Safe to run
          more than once — re-running will error on duplicate slugs rather than create duplicates.
        </p>
      </div>
      <button
        type="button"
        onClick={handleRun}
        disabled={running}
        className="rounded-md bg-amber-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-800 disabled:opacity-50"
      >
        {running ? "Importing…" : "Run Migration"}
      </button>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          ⚠️ {error}
        </div>
      )}

      {result && (
        <div className="space-y-2">
          <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-800">
            ✅ Imported {result.importedCourses.length} course(s):{" "}
            {result.importedCourses.join(", ") || "(none)"}
          </div>
          {result.warnings.length > 0 && (
            <div className="rounded-md border border-amber-300 bg-white px-3 py-2 text-xs text-amber-800">
              <p className="font-semibold">Warnings ({result.warnings.length}):</p>
              <ul className="mt-1 list-disc space-y-0.5 pl-4">
                {result.warnings.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
