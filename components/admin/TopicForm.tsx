"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createTopic, updateTopic, deleteTopic } from "../../lib/admin/actions";
import type { TopicRecord } from "../../lib/admin/types";
import { useToast } from "./ToastProvider";

export default function TopicForm({
  courseId,
  topic,
  topics = [],
  skills = [],
  onDone,
}: {
  courseId: string;
  topic?: TopicRecord;
  topics?: Pick<TopicRecord, "id" | "title">[];
  skills?: { slug: string; name: string }[];
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
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">Difficulty</label>
          <select name="difficulty" defaultValue={topic?.difficulty ?? ""} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none">
            <option value="">Not specified</option><option value="Beginner">Beginner</option><option value="Intermediate">Intermediate</option><option value="Advanced">Advanced</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">Estimated minutes</label>
          <input type="number" min={1} name="est_minutes" defaultValue={topic?.est_minutes ?? ""} placeholder="e.g. 45" className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none" />
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">Learning objectives</label>
        <textarea name="learning_objectives" defaultValue={(topic?.learning_objectives ?? []).join("\n")} rows={3} placeholder="One objective per line" className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none" />
      </div>
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">Skills</label>
        <SkillPicker skills={skills} selected={topic?.skills ?? []} />
      </div>
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">Prerequisite topic</label>
        <select name="prerequisite_topic_id" defaultValue={topic?.prerequisite_topic_id ?? ""} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none">
          <option value="">No prerequisite</option>
          {topics.filter((candidate) => candidate.id !== topic?.id).map((candidate) => <option key={candidate.id} value={candidate.id}>{candidate.title}</option>)}
        </select>
      </div>
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

export function SkillPicker({ skills, selected }: { skills: { slug: string; name: string }[]; selected: string[] }) {
  const [values, setValues] = useState(selected);
  if (skills.length === 0) return <p className="mt-1 text-xs text-slate-400">Seed default skills from the Courses admin page to assign them here.</p>;
  return (
    <div className="mt-2 grid gap-2 sm:grid-cols-2">
      {skills.map((skill) => {
        const checked = values.includes(skill.slug);
        return <label key={skill.slug} className="flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" checked={checked} onChange={() => setValues((current) => checked ? current.filter((item) => item !== skill.slug) : [...current, skill.slug])} />{skill.name}</label>;
      })}
      <input type="hidden" name="skills" value={JSON.stringify(values)} readOnly />
    </div>
  );
}
