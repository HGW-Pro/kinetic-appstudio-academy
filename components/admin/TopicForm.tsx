"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createTopic, updateTopic, deleteTopic } from "../../lib/admin/actions";
import type { TopicRecord } from "../../lib/admin/types";
import { useToast } from "./ToastProvider";

export default function TopicForm({
  courseId,
  topic,
  onDone,
}: {
  courseId: string;
  topic?: TopicRecord;
  onDone?: () => void;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();
  const { show } = useToast();
  const isEdit = !!topic;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const result = isEdit
      ? await updateTopic(topic!.id, courseId, formData)
      : await createTopic(courseId, formData);
    setSubmitting(false);

    if (!result.ok) {
      show(result.error ?? "Something went wrong.", "error");
      return;
    }
    show(isEdit ? "Topic updated." : "Topic created.", "success");
    router.refresh();
    onDone?.();
  }

  async function handleDelete() {
    if (!topic) return;
    if (!confirm(`Delete topic "${topic.title}" and all of its subtopics/quizzes? This cannot be undone.`)) return;
    setDeleting(true);
    const result = await deleteTopic(topic.id, courseId);
    setDeleting(false);
    if (!result.ok) {
      show(result.error ?? "Delete failed.", "error");
      return;
    }
    show("Topic deleted.", "success");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">Title</label>
          <input
            name="title"
            defaultValue={topic?.title}
            required
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">Position</label>
          <input
            type="number"
            min={1}
            name="sequence_order"
            defaultValue={topic ? topic.sequence_order + 1 : 9999}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
          Slug {!isEdit && <span className="normal-case text-slate-400">(auto-generated if blank)</span>}
        </label>
        <input
          name="slug"
          defaultValue={topic?.slug}
          pattern="^[a-z0-9]+(-[a-z0-9]+)*$"
          required={isEdit}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
        />
      </div>
      <p className="text-[11px] text-slate-400">
        1 = first. Setting this shifts every other topic in this course to make room.
      </p>
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-700 disabled:opacity-50"
        >
          {submitting ? "Saving…" : isEdit ? "Save" : "Add Topic"}
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
  );
}
