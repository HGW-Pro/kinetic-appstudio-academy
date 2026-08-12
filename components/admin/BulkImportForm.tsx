"use client";

import { useState } from "react";
import { bulkImportCourse } from "../../lib/admin/actions";
import { validateBulkImportPayload, ValidationError } from "../../lib/admin/types";
import { BULK_IMPORT_TEMPLATE } from "../../lib/admin/template";
import { useToast } from "./ToastProvider";

export default function BulkImportForm() {
  const [raw, setRaw] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [validated, setValidated] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { show } = useToast();

  function downloadTemplate() {
    const blob = new Blob([JSON.stringify(BULK_IMPORT_TEMPLATE, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "template.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    show("template.json downloaded.", "success");
  }

  function handleValidate() {
    setValidationError(null);
    setValidated(false);
    if (!raw.trim()) {
      setValidationError("Paste JSON data first.");
      return;
    }
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch (err) {
      setValidationError(`Not valid JSON: ${(err as Error).message}`);
      return;
    }
    try {
      validateBulkImportPayload(parsed);
      setValidated(true);
      show("Structure is valid. Ready to import.", "success");
    } catch (err) {
      if (err instanceof ValidationError) {
        setValidationError(err.message);
      } else {
        setValidationError("Unknown validation error.");
      }
    }
  }

  async function handleImport() {
    if (!validated) {
      setValidationError("Validate the JSON before importing.");
      return;
    }
    setSubmitting(true);
    try {
      const result = await bulkImportCourse(raw);
      if (!result.ok) {
        show(result.error ?? "Import failed.", "error");
        setValidationError(result.error ?? "Import failed.");
        return;
      }
      show("Course imported successfully.", "success");
      setRaw("");
      setValidated(false);
      setValidationError(null);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-slate-900">Bulk AI Import</h3>
          <p className="mt-1 text-sm text-slate-500">
            Paste a JSON payload matching the required schema to create a full course (topics,
            subtopics, and quizzes) in one atomic transaction.
          </p>
        </div>
        <button
          type="button"
          onClick={downloadTemplate}
          className="shrink-0 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          ⬇ Download template.json
        </button>
      </div>

      <textarea
        value={raw}
        onChange={(e) => {
          setRaw(e.target.value);
          setValidated(false);
          setValidationError(null);
        }}
        rows={14}
        placeholder='Paste JSON matching template.json here, e.g. { "course": { "title": "...", "slug": "..." }, "topics": [ ... ] }'
        className="w-full rounded-md border border-slate-300 bg-slate-50 p-3 font-mono text-xs text-slate-800 focus:border-slate-500 focus:outline-none"
      />

      {validationError && (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          ⚠️ {validationError}
        </div>
      )}
      {validated && !validationError && (
        <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
          ✅ Structure validated against the schema. Ready to import.
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleValidate}
          disabled={submitting}
          className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
        >
          Validate
        </button>
        <button
          type="button"
          onClick={handleImport}
          disabled={!validated || submitting}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-40"
        >
          {submitting ? "Importing…" : "Import Course"}
        </button>
      </div>
    </div>
  );
}
