"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  createSubtopic,
  updateSubtopic,
  deleteSubtopic,
  upsertQuiz,
} from "../../lib/admin/actions";
import type { SubtopicRecord, QuizRecord } from "../../lib/admin/types";
import ImageUploader from "./ImageUploader";
import { useToast } from "./ToastProvider";

const DEFAULT_CONTENT = JSON.stringify(
  [{ type: "SlideText", body: ["First paragraph."] }],
  null,
  2
);
const DEFAULT_QUIZ = JSON.stringify(
  [{ question: "Example question?", options: ["A", "B"], correctIndex: 0, explanation: "Because A." }],
  null,
  2
);

export default function SubtopicEditor({
  topicId,
  courseId,
  subtopic,
  quiz,
  onDone,
}: {
  topicId: string;
  courseId: string;
  subtopic?: SubtopicRecord;
  quiz?: QuizRecord;
  onDone?: () => void;
}) {
  const [contentJson, setContentJson] = useState(
    subtopic ? JSON.stringify(subtopic.content_json, null, 2) : DEFAULT_CONTENT
  );
  const [questionsJson, setQuestionsJson] = useState(
    quiz ? JSON.stringify(quiz.questions_json, null, 2) : DEFAULT_QUIZ
  );
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [quizError, setQuizError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [savingQuiz, setSavingQuiz] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [lastUploadedUrl, setLastUploadedUrl] = useState<string | null>(null);
  const router = useRouter();
  const { show } = useToast();
  const isEdit = !!subtopic;

  function validateJsonLocally(text: string): string | null {
    try {
      const parsed = JSON.parse(text);
      if (!Array.isArray(parsed) || parsed.length === 0) return "Must be a non-empty JSON array.";
      return null;
    } catch (err) {
      return `Invalid JSON: ${(err as Error).message}`;
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const localError = validateJsonLocally(contentJson);
    if (localError) {
      setJsonError(localError);
      return;
    }
    setJsonError(null);
    setSubmitting(true);
    const formData = new FormData(e.currentTarget);
    formData.set("content_json", contentJson);

    const result = isEdit
      ? await updateSubtopic(subtopic!.id, topicId, courseId, formData)
      : await createSubtopic(topicId, courseId, formData);
    setSubmitting(false);

    if (!result.ok) {
      show(result.error ?? "Something went wrong.", "error");
      setJsonError(result.error ?? null);
      return;
    }
    show(isEdit ? "Subtopic updated." : "Subtopic created.", "success");
    router.refresh();
    onDone?.();
  }

  async function handleSaveQuiz() {
    if (!subtopic) {
      show("Save the subtopic before adding a quiz.", "error");
      return;
    }
    const localError = validateJsonLocally(questionsJson);
    if (localError) {
      setQuizError(localError);
      return;
    }
    setQuizError(null);
    setSavingQuiz(true);
    const formData = new FormData();
    formData.set("questions_json", questionsJson);
    const result = await upsertQuiz(subtopic.id, courseId, formData);
    setSavingQuiz(false);
    if (!result.ok) {
      show(result.error ?? "Quiz save failed.", "error");
      setQuizError(result.error ?? null);
      return;
    }
    show("Quiz saved.", "success");
    router.refresh();
  }

  async function handleDelete() {
    if (!subtopic) return;
    if (!confirm(`Delete subtopic "${subtopic.title}" and its quiz? This cannot be undone.`)) return;
    setDeleting(true);
    const result = await deleteSubtopic(subtopic.id, courseId);
    setDeleting(false);
    if (!result.ok) {
      show(result.error ?? "Delete failed.", "error");
      return;
    }
    show("Subtopic deleted.", "success");
    router.refresh();
  }

  function insertImageSnippet(url: string) {
    setLastUploadedUrl(url);
    show("Image URL ready — paste it into an images[] block below.", "info");
  }

  return (
    <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-4">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">Title</label>
            <input
              name="title"
              defaultValue={subtopic?.title}
              required
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">Order</label>
            <input
              type="number"
              name="sequence_order"
              defaultValue={subtopic?.sequence_order ?? 0}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
            />
          </div>
        </div>

        <ImageUploader label="Upload an image to reference in content_json" pathPrefix="subtopics" onUploaded={insertImageSnippet} />
        {lastUploadedUrl && (
          <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
            Last uploaded URL:{" "}
            <code className="break-all rounded bg-slate-200 px-1 py-0.5">{lastUploadedUrl}</code>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
            content_json (array of SlideText / VisualMockup / FlowDiagram blocks)
          </label>
          <textarea
            value={contentJson}
            onChange={(e) => {
              setContentJson(e.target.value);
              setJsonError(null);
            }}
            rows={12}
            className="mt-1 w-full rounded-md border border-slate-300 bg-slate-50 p-3 font-mono text-xs text-slate-800 focus:border-slate-500 focus:outline-none"
          />
          {jsonError && <p className="mt-1 text-xs text-red-600">⚠️ {jsonError}</p>}
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-md bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-700 disabled:opacity-50"
          >
            {submitting ? "Saving…" : isEdit ? "Save Subtopic" : "Add Subtopic"}
          </button>
          {isEdit && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="rounded-md border border-red-300 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
            >
              {deleting ? "Deleting…" : "Delete"}
            </button>
          )}
        </div>
      </form>

      {isEdit && (
        <div className="border-t border-slate-200 pt-4">
          <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Quiz — questions_json (2-6 options per question)
          </label>
          <textarea
            value={questionsJson}
            onChange={(e) => {
              setQuestionsJson(e.target.value);
              setQuizError(null);
            }}
            rows={8}
            className="mt-1 w-full rounded-md border border-slate-300 bg-slate-50 p-3 font-mono text-xs text-slate-800 focus:border-slate-500 focus:outline-none"
          />
          {quizError && <p className="mt-1 text-xs text-red-600">⚠️ {quizError}</p>}
          <button
            type="button"
            onClick={handleSaveQuiz}
            disabled={savingQuiz}
            className="mt-2 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
          >
            {savingQuiz ? "Saving…" : "Save Quiz"}
          </button>
        </div>
      )}
    </div>
  );
}
