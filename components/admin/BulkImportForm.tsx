"use client";

import { useState } from "react";
import { bulkImportCourses } from "../../lib/admin/actions";
import { validateMultiCourseBulkImportPayload, ValidationError } from "../../lib/admin/types";
import { BULK_IMPORT_TEMPLATE } from "../../lib/admin/template";
import { useToast } from "./ToastProvider";

export default function BulkImportForm() {
  const [raw, setRaw] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [courseCount, setCourseCount] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{
    imported: { title: string; id: string }[];
    errors: { title: string; error: string }[];
  } | null>(null);
  const { show } = useToast();

  function downloadTemplate() {
    const blob = new Blob([JSON.stringify(BULK_IMPORT_TEMPLATE, null, 2)], { type: "application/json" });
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
    setCourseCount(null);
    setResult(null);
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
      const payload = validateMultiCourseBulkImportPayload(parsed);
      setCourseCount(payload.courses.length);
      show(`Structure is valid — ${payload.courses.length} course(s) ready to import.`, "success");
    } catch (err) {
      setValidationError(err instanceof ValidationError ? err.message : "Unknown validation error.");
    }
  }

  async function handleImport() {
    if (courseCount === null) {
      setValidationError("Validate the JSON before importing.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await bulkImportCourses(raw);
      if (!res.ok) {
        show(res.error ?? "Import failed.", "error");
        if (res.data) setResult(res.data);
        return;
      }
      setResult(res.data ?? null);
      show(`Imported ${res.data?.imported.length ?? 0} course(s).`, "success");
      setRaw("");
      setCourseCount(null);
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
            Paste JSON for one or many courses (each with topics, subtopics, and quizzes). Images can be
            referenced by filename alone if already uploaded to the course-assets bucket. Each course
            imports independently — one mistake won't block the rest.
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
          setCourseCount(null);
          setValidationError(null);
        }}
        rows={14}
        placeholder='Paste JSON matching template.json here — either { "courses": [ {course, topics}, ... ] } for multiple, or a single { "course": {...}, "topics": [...] }'
        className="w-full rounded-md border border-slate-300 bg-slate-50 p-3 font-mono text-xs text-slate-800 focus:border-slate-500 focus:outline-none"
      />

      {validationError && (
        <div className="whitespace-pre-wrap rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          ⚠️ {validationError}
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
          onClick={handleValidate}
          disabled={submitting}
          className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
        >
          Validate
        </button>
        <button
          type="button"
          onClick={handleImport}
          disabled={courseCount === null || submitting}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-40"
        >
          {submitting ? "Importing…" : `Import ${courseCount ?? ""} Course${courseCount === 1 ? "" : "s"}`.trim()}
        </button>
      </div>

      {result && (
        <div className="space-y-2">
          {result.imported.length > 0 && (
            <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-800">
              ✅ Imported {result.imported.length}: {result.imported.map((c) => c.title).join(", ")}
            </div>
          )}
          {result.errors.length > 0 && (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
              <p className="font-semibold">Failed ({result.errors.length}):</p>
              <ul className="mt-1 list-disc space-y-0.5 pl-4">
                {result.errors.map((e, i) => (
                  <li key={i}>
                    <strong>{e.title || "(untitled)"}</strong>: {e.error}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
