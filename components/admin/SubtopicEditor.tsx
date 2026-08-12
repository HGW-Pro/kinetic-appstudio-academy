"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  createSubtopic,
  updateSubtopic,
  deleteSubtopic,
  upsertQuiz,
} from "../../lib/admin/actions";
import type { SubtopicRecord, QuizRecord, ContentBlock, QuizQuestionSchema } from "../../lib/admin/types";
import { normalizeContentBlocks } from "../../lib/admin/types";
import ContentBlockEditor from "./ContentBlockEditor";
import QuizQuestionEditor from "./QuizQuestionEditor";
import { useToast } from "./ToastProvider";

const DEFAULT_CONTENT: ContentBlock[] = [{ type: "SlideText", body: [{ type: "paragraph", text: "" }] }];
const DEFAULT_QUIZ: QuizQuestionSchema[] = [];

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
  const [title, setTitle] = useState(subtopic?.title ?? "");
  const [sequenceOrder, setSequenceOrder] = useState(subtopic?.sequence_order ?? 0);
  // Normalize on load: subtopics migrated/imported before the body schema
  // was ordered SlideNode[] may still have plain string[] bodies (or a
  // legacy sibling `images[]`) sitting in the database. Without this,
  // those subtopics render as completely empty in the editor.
  const [blocks, setBlocks] = useState<ContentBlock[]>(
    subtopic ? normalizeContentBlocks(subtopic.content_json) : DEFAULT_CONTENT
  );
  const [questions, setQuestions] = useState<QuizQuestionSchema[]>(quiz?.questions_json ?? DEFAULT_QUIZ);
  const [showRawJson, setShowRawJson] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [quizError, setQuizError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [savingQuiz, setSavingQuiz] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();
  const { show } = useToast();
  const isEdit = !!subtopic;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);
    if (!title.trim()) {
      setFormError("Title is required.");
      return;
    }
    if (blocks.length === 0) {
      setFormError("Add at least one content block.");
      return;
    }
    setSubmitting(true);
    const formData = new FormData();
    formData.set("title", title);
    formData.set("sequence_order", String(sequenceOrder));
    formData.set("content_json", JSON.stringify(blocks));

    const result = isEdit
      ? await updateSubtopic(subtopic!.id, topicId, courseId, formData)
      : await createSubtopic(topicId, courseId, formData);
    setSubmitting(false);

    if (!result.ok) {
      show(result.error ?? "Something went wrong.", "error");
      setFormError(result.error ?? null);
      return;
    }
    show(
      isEdit
        ? "Subtopic updated. This also fixes the display permanently if it was showing empty before."
        : "Subtopic created.",
      "success"
    );
    router.refresh();
    onDone?.();
  }

  async function handleSaveQuiz() {
    if (!subtopic) {
      show("Save the subtopic before adding a quiz.", "error");
      return;
    }
    if (questions.length === 0) {
      setQuizError("Add at least one question.");
      return;
    }
    for (const q of questions) {
      if (!q.question.trim()) {
        setQuizError("Every question needs question text.");
        return;
      }
      if (q.options.some((o) => !o.trim())) {
        setQuizError("Every option needs text — remove empty options.");
        return;
      }
      if (!q.explanation.trim()) {
        setQuizError("Every question needs an explanation.");
        return;
      }
    }
    setQuizError(null);
    setSavingQuiz(true);
    const formData = new FormData();
    formData.set("questions_json", JSON.stringify(questions));
    const result = await upsertQuiz(subtopic.id, courseId, formData);
    setSavingQuiz(false);
    if (!result.ok) {
      show(result.error ?? "Quiz save failed.", "error");
      setQuizError(result.error ?? null);
      return;
    }
    show("Quiz saved. Answer order will be shuffled for every student automatically.", "success");
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

  return (
    <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">Order</label>
            <input
              type="number"
              value={sequenceOrder}
              onChange={(e) => setSequenceOrder(Number(e.target.value))}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Content</label>
            <button
              type="button"
              onClick={() => setShowRawJson((s) => !s)}
              className="text-[11px] font-semibold text-slate-400 hover:text-slate-600"
            >
              {showRawJson ? "Hide" : "View"} raw JSON
            </button>
          </div>
          <ContentBlockEditor value={blocks} onChange={setBlocks} />
          {showRawJson && (
            <pre className="mt-3 max-h-64 overflow-auto rounded-md border border-slate-200 bg-slate-900 p-3 text-[11px] text-slate-100">
              {JSON.stringify(blocks, null, 2)}
            </pre>
          )}
        </div>

        {formError && <p className="text-xs text-red-600">⚠️ {formError}</p>}

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
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Quiz
          </label>
          <QuizQuestionEditor value={questions} onChange={setQuestions} />
          {quizError && <p className="mt-2 text-xs text-red-600">⚠️ {quizError}</p>}
          <button
            type="button"
            onClick={handleSaveQuiz}
            disabled={savingQuiz}
            className="mt-3 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
          >
            {savingQuiz ? "Saving…" : "Save Quiz"}
          </button>
        </div>
      )}
    </div>
  );
}
