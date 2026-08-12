"use client";

import { useState } from "react";
import { bulkImportTrainingV2 } from "../../lib/training-import";
import { BULK_IMPORT_TEMPLATE } from "../../lib/admin/template";
import { validateTrainingDocumentDetailed, type TrainingValidationIssue } from "../../lib/training-schema";
import { useToast } from "./ToastProvider";

export default function BulkImportForm() {
  const [raw, setRaw] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [issues, setIssues] = useState<TrainingValidationIssue[]>([]);
  const [courseCount, setCourseCount] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ imported?: { title: string }[]; errors?: { title: string; error: string }[] } | null>(null);
  const { show } = useToast();

  function downloadTemplate() {
    const blob = new Blob([JSON.stringify(BULK_IMPORT_TEMPLATE, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "template-v2.json";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    show("template-v2.json downloaded.", "success");
  }

  function validate() {
    setValidationError(null);
    setIssues([]);
    setCourseCount(null);
    setResult(null);

    // Full Zod-backed validation: checks the top-level schemaVersion/courses
    // shape AND deep-validates every InteractiveUI block nested inside
    // courses[].topics[].subtopics[].content[] (kind/uiKind/mode enums,
    // required ids, guidedSteps targetId references, etc.) -- collecting
    // every issue found rather than stopping at the first one.
    const outcome = validateTrainingDocumentDetailed(raw);
    if (!outcome.valid) {
      setIssues(outcome.issues);
      setValidationError(`${outcome.issues.length} validation issue(s) found — fix before importing.`);
      show(
        `Validation failed: ${outcome.issues[0].path} — ${outcome.issues[0].message}` +
          (outcome.issues.length > 1 ? ` (+${outcome.issues.length - 1} more)` : ""),
        "error"
      );
      return;
    }

    setCourseCount(outcome.courseCount);
    show(`${outcome.courseCount} course(s) ready for v2 import.`, "success");
  }

  async function submit() {
    if (courseCount === null) {
      setValidationError("Validate the JSON before importing.");
      return;
    }
    setSubmitting(true);
    const response = await bulkImportTrainingV2(raw);
    setSubmitting(false);
    if (!response.ok) {
      setValidationError(response.error ?? "Import failed.");
      show(response.error ?? "Import failed.", "error");
      return;
    }
    setResult(response.data as { imported?: { title: string }[]; errors?: { title: string; error: string }[] });
    show("Training content imported.", "success");
  }

  return (
    <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-slate-900">Bulk AI Import</h3>
          <p className="mt-1 text-sm text-slate-500">
            Version 2.0 supports InteractiveUI guided practice blocks. Legacy JSON without
            schemaVersion remains valid.
          </p>
        </div>
        <button
          type="button"
          onClick={downloadTemplate}
          className="shrink-0 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          ⬇ Download template-v2.json
        </button>
      </div>
      <textarea
        value={raw}
        onChange={(e) => {
          setRaw(e.target.value);
          setCourseCount(null);
          setValidationError(null);
          setIssues([]);
        }}
        rows={14}
        placeholder="Paste template-v2 JSON here"
        className="w-full rounded-md border border-slate-300 bg-slate-50 p-3 font-mono text-xs text-slate-800 focus:border-slate-500 focus:outline-none"
      />
      {validationError && (
        <div className="space-y-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          <p className="font-semibold">⚠️ {validationError}</p>
          {issues.length > 0 && (
            <ul className="max-h-48 space-y-1 overflow-y-auto pl-1">
              {issues.map((issue, i) => (
                <li key={i} className="border-l-2 border-red-300 pl-2">
                  <span className="font-mono font-semibold">{issue.path}</span>
                  {issue.approxLine !== null && (
                    <span className="ml-1 text-red-500">(~line {issue.approxLine})</span>
                  )}
                  <span className="block text-red-700">{issue.message}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      {courseCount !== null && !validationError && (
        <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
          ✅ Structure validated — {courseCount} course(s) ready to import.
        </div>
      )}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={validate}
          disabled={submitting}
          className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
        >
          Validate
        </button>
        <button
          type="button"
          onClick={submit}
          disabled={courseCount === null || submitting}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
        >
          {submitting ? "Importing…" : "Import Training"}
        </button>
      </div>
      {result && (
        <div className="text-xs text-emerald-800">
          ✅ Imported: {(result.imported ?? []).map((x) => x.title).join(", ") || "completed"}
          {(result.errors ?? []).length > 0 && (
            <span className="text-red-700"> · Errors: {(result.errors ?? []).map((x) => x.title).join(", ")}</span>
          )}
        </div>
      )}
    </div>
  );
}
