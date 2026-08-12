"use client";

import { useState } from "react";
import { bulkImportTrainingV2 } from "../../lib/training-import";
import { BULK_IMPORT_TEMPLATE } from "../../lib/admin/template";
import { useToast } from "./ToastProvider";

export default function BulkImportForm() {
  const [raw, setRaw] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
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
    setValidationError(null); setCourseCount(null); setResult(null);
    try {
      const parsed = JSON.parse(raw) as { schemaVersion?: string; courses?: unknown[] };
      if (parsed.schemaVersion !== undefined && parsed.schemaVersion !== "2.0") throw new Error("schemaVersion must be 2.0 when provided");
      if (!Array.isArray(parsed.courses) || !parsed.courses.length) throw new Error("courses must be a non-empty array");
      setCourseCount(parsed.courses.length);
      show(`${parsed.courses.length} course(s) ready for v2 import.`, "success");
    } catch (error) { setValidationError(error instanceof Error ? error.message : "Invalid JSON"); }
  }

  async function submit() {
    if (courseCount === null) { setValidationError("Validate the JSON before importing."); return; }
    setSubmitting(true);
    const response = await bulkImportTrainingV2(raw);
    setSubmitting(false);
    if (!response.ok) { setValidationError(response.error ?? "Import failed."); show(response.error ?? "Import failed.", "error"); return; }
    setResult(response.data as { imported?: { title: string }[]; errors?: { title: string; error: string }[] });
    show("Training content imported.", "success");
  }

  return <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
    <div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="text-base font-semibold text-slate-900">Bulk AI Import</h3><p className="mt-1 text-sm text-slate-500">Version 2.0 supports InteractiveUI guided practice blocks. Legacy JSON without schemaVersion remains valid.</p></div><button type="button" onClick={downloadTemplate} className="shrink-0 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">⬇ Download template-v2.json</button></div>
    <textarea value={raw} onChange={(e) => { setRaw(e.target.value); setCourseCount(null); setValidationError(null); }} rows={14} placeholder='Paste template-v2 JSON here' className="w-full rounded-md border border-slate-300 bg-slate-50 p-3 font-mono text-xs text-slate-800 focus:border-slate-500 focus:outline-none" />
    {validationError && <div className="whitespace-pre-wrap rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">⚠️ {validationError}</div>}
    {courseCount !== null && !validationError && <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">✅ Structure validated — {courseCount} course(s) ready to import.</div>}
    <div className="flex gap-3"><button type="button" onClick={validate} disabled={submitting} className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700">Validate</button><button type="button" onClick={submit} disabled={courseCount === null || submitting} className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-40">{submitting ? "Importing…" : "Import Training"}</button></div>
    {result && <div className="text-xs text-emerald-800">✅ Imported: {(result.imported ?? []).map((x) => x.title).join(", ") || "completed"}{(result.errors ?? []).length > 0 && <span className="text-red-700"> · Errors: {(result.errors ?? []).map((x) => x.title).join(", ")}</span>}</div>}
  </div>;
}
