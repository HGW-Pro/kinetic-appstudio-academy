"use client";

import { useState } from "react";
import type { TopicRecord, SubtopicRecord, QuizRecord } from "../../lib/admin/types";
import TopicForm from "./TopicForm";
import SubtopicEditor from "./SubtopicEditor";

function SubtopicRow({
  subtopic,
  onToggle,
}: {
  subtopic: SubtopicRecord;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-left text-sm transition hover:border-slate-400"
    >
      <span className="font-medium text-slate-800">{subtopic.title}</span>
      <span className="text-slate-400 transition">›</span>
    </button>
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
            <button
              type="button"
              onClick={() => toggleTopic(topic.id)}
              className="flex w-full items-center justify-between px-4 py-3 text-left"
            >
              <div>
                <p className="font-semibold text-slate-900">{topic.title}</p>
                <p className="text-xs text-slate-500">
                  /{topic.slug} · {topicSubtopics.length} subtopic{topicSubtopics.length === 1 ? "" : "s"}
                </p>
              </div>
              <span className={`text-slate-400 transition ${isTopicOpen ? "rotate-90" : ""}`}>›</span>
            </button>

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
                      <SubtopicRow key={sub.id} subtopic={sub} onToggle={() => setOpenSubtopicId(sub.id)} />
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
