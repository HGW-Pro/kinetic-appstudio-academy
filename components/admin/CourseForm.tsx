"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCourse, updateCourse } from "../../lib/admin/actions";
import type { CourseRecord } from "../../lib/admin/types";
import ImageUploader from "./ImageUploader";
import { useToast } from "./ToastProvider";

export default function CourseForm({ course }: { course?: CourseRecord }) {
  const [imageUrl, setImageUrl] = useState(course?.image_url ?? "");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const { show } = useToast();
  const isEdit = !!course;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData(e.currentTarget);
    formData.set("image_url", imageUrl);

    const result = isEdit ? await updateCourse(course!.id, formData) : await createCourse(formData);
    setSubmitting(false);

    if (!result.ok) {
      show(result.error ?? "Something went wrong.", "error");
      return;
    }
    show(isEdit ? "Course updated." : "Course created.", "success");
    if (!isEdit) {
      const newId = (result.data as { id: string } | undefined)?.id;
      if (newId) router.push(`/admin/courses/${newId}`);
    } else {
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">Title</label>
          <input
            name="title"
            defaultValue={course?.title}
            required
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Slug {!isEdit && <span className="normal-case text-slate-400">(auto-generated if blank)</span>}
          </label>
          <input
            name="slug"
            defaultValue={course?.slug}
            pattern="^[a-z0-9]+(-[a-z0-9]+)*$"
            title="lowercase-kebab-case"
            required={isEdit}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">Description</label>
        <textarea
          name="description"
          defaultValue={course?.description ?? ""}
          rows={3}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <ImageUploader label="Course cover image" pathPrefix="courses" onUploaded={setImageUrl} />
          {imageUrl && (
            <input type="hidden" name="image_url" value={imageUrl} readOnly />
          )}
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Or paste an image URL directly"
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-xs text-slate-600 focus:border-slate-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Sequence order
          </label>
          <input
            type="number"
            name="sequence_order"
            defaultValue={course?.sequence_order ?? 0}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-50"
      >
        {submitting ? "Saving…" : isEdit ? "Save Changes" : "Create Course"}
      </button>
    </form>
  );
}
