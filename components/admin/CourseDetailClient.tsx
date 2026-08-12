"use client";

import { useState } from "react";
import type { TopicRecord, SubtopicRecord, QuizRecord } from "../../lib/admin/types";
import TopicForm from "./TopicForm";
import SubtopicEditor from "./SubtopicEditor";

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
  const [expandedTopicId, setExpandedTopicId] = useState<string | null>(topics[0]?.id ?? null);
  const [addingSubtopicFor, setAddingSubtopicFor] = useState<string | null>(null);
  const [addingTopic, setAddingTopic] = useState(false);

  const quizBySubtopicId = new Map(quizzes.map((q) => [q.subtopic_id, q]));

  return (
    <div className="space-y-4">
      {topics.map((topic) => {
        const topicSubtopics = subtopics.filter((s) => s.topic_id === topic.id);
        const isExpanded = expandedTopicId === topic.id;
        return (
          <div key={topic.id} className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <button
              type="button"
              onClick={() => setExpandedTopicId(isExpanded ? null : topic.id)}
              className="flex w-full items-center justify-between px-4 py-3 text-left"
            >
              <div>
                <p className="font-semibold text-slate-900">{topic.title}</p>
                <p className="text-xs text-slate-500">
                  /{topic.slug} · {topicSubtopics.length} subtopic{topicSubtopics.length === 1 ? "" : "s"}
                </p>
              </div>
              <span className={`text-slate-400 transition ${isExpanded ? "rotate-90" : ""}`}>›</span>
            </button>

            {isExpanded && (
              <div className="space-y-4 border-t border-slate-200 p-4">
                <TopicForm courseId={courseId} topic={topic} />

                <div className="space-y-3 pl-2">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Subtopics</h3>
                  {topicSubtopics.map((sub) => (
                    <SubtopicEditor
                      key={sub.id}
                      topicId={topic.id}
                      courseId={courseId}
                      subtopic={sub}
                      quiz={quizBySubtopicId.get(sub.id)}
                    />
                  ))}

                  {addingSubtopicFor === topic.id ? (
                    <SubtopicEditor
                      topicId={topic.id}
                      courseId={courseId}
                      onDone={() => setAddingSubtopicFor(null)}
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
        <TopicForm courseId={courseId} onDone={() => setAddingTopic(false)} />
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
