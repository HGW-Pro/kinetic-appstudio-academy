"use client";

import { useState } from "react";
import type { TopicRecord, SubtopicRecord, QuizRecord } from "../../lib/admin/types";
import TopicForm from "./TopicForm";
import SubtopicEditor from "./SubtopicEditor";
import DeleteButton from "./DeleteButton";
import { deleteTopicAction, deleteSubtopicAction } from "../../lib/admin/delete-actions";

function SubtopicRow({
  subtopic,
  courseId,
  topicId,
  onToggle,
}: {
  subtopic: SubtopicRecord;
  courseId: string;
  topicId: string;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm transition hover:border-slate-400">
      <button
        type="button"
        onClick={onToggle}
        className="flex min-w-0 flex-1 items-center justify-between text-left"
      >
        <span className="truncate font-medium text-slate-800">{subtopic.title}</span>
        <span className="ml-2 shrink-0 text-slate-400 transition">›</span>
      </button>
      <DeleteButton
        label="Delete"
        confirmText={`Delete subtopic "${subtopic.title}"? This also removes its quiz, if any. This cannot be undone.`}
        action={deleteSubtopicAction.bind(null, subtopic.id, courseId)}
        className="shrink-0 rounded-md border border-red-200 bg-red-50 px-2 py-1 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
      />
    </div>
  );
}

export default function CourseDetailClient({
  courseId,
  topics,
  subtopics,
  quizzes,
}: {
  courseId: string;
  topics: TopicRecord[];
  subtopics: SubtopicRecord[];
  quizzes: QuizRecord[];
}) {
  const [openTopicId, setOpenTopicId] = useState<string | null>(null);
  const [openSubtopicId, setOpenSubtopicId] = useState<string | null>(null);
  const [addingSubtopicFor, setAddingSubtopicFor] = useState<string | null>(null);
  const [addingTopic, setAddingTopic] = useState(false);

  const quizBySubtopicId = new Map(quizzes.map((q) => [q.subtopic_id, q]));

  function toggleTopic(topicId: string) {
    setOpenTopicId((cur) => (cur === topicId ? null : topicId));
    setOpenSubtopicId(null);
    setAddingSubtopicFor(null);
  }

  return (
    <div className="space-y-2">
      {topics.map((topic) => {
        const topicSubtopics = subtopics.filter((s) => s.topic_id === topic.id);
        const isTopicOpen = openTopicId === topic.id;
        return (
          <div key={topic.id} className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center gap-2 px-4 py-3">
              <button
                type="button"
                onClick={() => toggleTopic(topic.id)}
                className="flex min-w-0 flex-1 items-center justify-between text-left"
              >
                <div className="min-w-0">
                  <p className="truncate font-semibold text-slate-900">{topic.title}</p>
                  <p className="text-xs text-slate-500">
                    /{topic.slug} · {topicSubtopics.length} subtopic{topicSubtopics.length === 1 ? "" : "s"}
                  </p>
                </div>
                <span className={`ml-2 shrink-0 text-slate-400 transition ${isTopicOpen ? "rotate-90" : ""}`}>
                  ›
                </span>
              </button>
              <DeleteButton
                label="Delete Topic"
                confirmText={`Delete topic "${topic.title}" and all ${topicSubtopics.length} subtopic(s) and their quizzes? This cannot be undone.`}
                action={deleteTopicAction.bind(null, topic.id, courseId)}
                className="shrink-0 rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
              />
            </div>

            {isTopicOpen && (
              <div className="space-y-4 border-t border-slate-200 p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Editing "{topic.title}"
                  </h3>
                  <button
                    type="button"
                    onClick={() => toggleTopic(topic.id)}
                    className="rounded-md border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                  >
                    ▲ Collapse
                  </button>
                </div>

                <TopicForm courseId={courseId} topic={topic} />

                <div className="space-y-2 pl-2">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Subtopics — click one to edit
                  </h3>

                  {topicSubtopics.map((sub) =>
                    openSubtopicId === sub.id ? (
                      <SubtopicEditor
                        key={sub.id}
                        topicId={topic.id}
                        courseId={courseId}
                        subtopic={sub}
                        quiz={quizBySubtopicId.get(sub.id)}
                        onDone={() => setOpenSubtopicId(null)}
                        onCancel={() => setOpenSubtopicId(null)}
                      />
                    ) : (
                      <SubtopicRow
                        key={sub.id}
                        subtopic={sub}
                        courseId={courseId}
                        topicId={topic.id}
                        onToggle={() => setOpenSubtopicId(sub.id)}
                      />
                    )
                  )}

                  {addingSubtopicFor === topic.id ? (
                    <SubtopicEditor
                      topicId={topic.id}
                      courseId={courseId}
                      onDone={() => setAddingSubtopicFor(null)}
                      onCancel={() => setAddingSubtopicFor(null)}
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => setAddingSubtopicFor(topic.id)}
                      className="rounded-md border border-dashed border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-500 transition hover:border-slate-400 hover:text-slate-700"
                    >
                      + Add Subtopic
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {addingTopic ? (
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">New Topic</span>
            <button
              type="button"
              onClick={() => setAddingTopic(false)}
              className="rounded-md border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              ✕ Close
            </button>
          </div>
          <TopicForm courseId={courseId} onDone={() => setAddingTopic(false)} />
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setAddingTopic(true)}
          className="w-full rounded-lg border border-dashed border-slate-300 px-4 py-3 text-sm font-semibold text-slate-500 transition hover:border-slate-400 hover:text-slate-700"
        >
          + Add Topic
        </button>
      )}
    </div>
  );
}
