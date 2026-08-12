"use client";

import { useState, useTransition } from "react";
import {
  deleteCourseAction,
  deleteTopicAction,
  deleteSubtopicAction,
  deleteQuizAction,
} from "../../lib/admin/delete-actions";

export interface CourseTree {
  id: string;
  title: string;
  slug: string;
  isPublished: boolean;
  topics: {
    id: string;
    title: string;
    slug: string;
    subtopics: {
      id: string;
      title: string;
      quizId: string | null;
    }[];
  }[];
}

function DeleteButton({
  label,
  confirmText,
  onDelete,
}: {
  label: string;
  confirmText: string;
  onDelete: () => Promise<{ error: string | null }>;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleClick() {
    if (!window.confirm(confirmText)) return;
    setError(null);
    startTransition(async () => {
      const result = await onDelete();
      if (result.error) setError(result.error);
    });
  }

  return (
    <span className="inline-flex items-center gap-2">
      <button
        onClick={handleClick}
        disabled={pending}
        className="rounded-md border border-[var(--error)]/40 bg-[var(--error)]/10 px-2.5 py-1 text-xs font-semibold text-[var(--error)] transition hover:bg-[var(--error)]/20 disabled:opacity-50"
      >
        {pending ? "Deleting…" : label}
      </button>
      {error && <span className="text-xs text-[var(--error)]">⚠️ {error}</span>}
    </span>
  );
}

export default function DangerZoneClient({ courses }: { courses: CourseTree[] }) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  function toggle(id: string) {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  if (courses.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-[var(--border-strong)] px-4 py-6 text-center text-sm text-[var(--text-lo)]">
        No courses found.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {courses.map((course) => (
        <div key={course.id} className="glass-card rounded-xl p-5">
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => toggle(course.id)}
              className="flex items-center gap-2 text-left"
            >
              <span className="text-xs text-[var(--text-lo)]">{expanded[course.id] ? "▾" : "▸"}</span>
              <span className="text-sm font-semibold text-[var(--text-hi)]">{course.title}</span>
              <span className="text-xs text-[var(--text-lo)]">
                ({course.topics.length} topic{course.topics.length === 1 ? "" : "s"})
              </span>
              {!course.isPublished && (
                <span className="rounded-full bg-[var(--surface-2)] px-2 py-0.5 text-[10px] uppercase text-[var(--text-lo)]">
                  Draft
                </span>
              )}
            </button>
            <DeleteButton
              label="Delete Course"
              confirmText={`Delete "${course.title}" and all ${course.topics.length} topic(s), their subtopics, and quizzes? This cannot be undone.`}
              onDelete={() => deleteCourseAction(course.id)}
            />
          </div>

          {expanded[course.id] && (
            <div className="mt-4 ml-5 space-y-3 border-l border-[var(--border-strong)] pl-5">
              {course.topics.length === 0 && (
                <p className="text-xs text-[var(--text-lo)]">No topics.</p>
              )}
              {course.topics.map((topic) => (
                <div key={topic.id}>
                  <div className="flex items-center justify-between gap-3">
                    <button
                      onClick={() => toggle(topic.id)}
                      className="flex items-center gap-2 text-left"
                    >
                      <span className="text-xs text-[var(--text-lo)]">{expanded[topic.id] ? "▾" : "▸"}</span>
                      <span className="text-sm font-medium text-[var(--text-hi)]">{topic.title}</span>
                      <span className="text-xs text-[var(--text-lo)]">
                        ({topic.subtopics.length} subtopic{topic.subtopics.length === 1 ? "" : "s"})
                      </span>
                    </button>
                    <DeleteButton
                      label="Delete Topic"
                      confirmText={`Delete topic "${topic.title}" and all ${topic.subtopics.length} subtopic(s) and their quizzes? This cannot be undone.`}
                      onDelete={() => deleteTopicAction(topic.id)}
                    />
                  </div>

                  {expanded[topic.id] && (
                    <div className="mt-2 ml-5 space-y-2 border-l border-[var(--border)] pl-5">
                      {topic.subtopics.length === 0 && (
                        <p className="text-xs text-[var(--text-lo)]">No subtopics.</p>
                      )}
                      {topic.subtopics.map((subtopic) => (
                        <div key={subtopic.id} className="flex items-center justify-between gap-3">
                          <span className="text-sm text-[var(--text-mid)]">
                            {subtopic.title}
                            {subtopic.quizId && (
                              <span className="ml-2 text-xs text-[var(--text-lo)]">has quiz</span>
                            )}
                          </span>
                          <span className="flex items-center gap-2">
                            {subtopic.quizId && (
                              <DeleteButton
                                label="Delete Quiz"
                                confirmText={`Delete the quiz attached to "${subtopic.title}"? This cannot be undone.`}
                                onDelete={() => deleteQuizAction(subtopic.quizId as string)}
                              />
                            )}
                            <DeleteButton
                              label="Delete Subtopic"
                              confirmText={`Delete subtopic "${subtopic.title}"${
                                subtopic.quizId ? " and its quiz" : ""
                              }? This cannot be undone.`}
                              onDelete={() => deleteSubtopicAction(subtopic.id)}
                            />
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
