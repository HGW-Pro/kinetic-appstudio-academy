"use client";

import type { QuizQuestionSchema } from "../../lib/admin/types";

function emptyQuestion(): QuizQuestionSchema {
  return { question: "", options: ["", ""], correctIndex: 0, explanation: "" };
}

export default function QuizQuestionEditor({
  value,
  onChange,
}: {
  value: QuizQuestionSchema[];
  onChange: (questions: QuizQuestionSchema[]) => void;
}) {
  function update(i: number, q: QuizQuestionSchema) {
    const next = [...value];
    next[i] = q;
    onChange(next);
  }
  function remove(i: number) {
    onChange(value.filter((_, j) => j !== i));
  }

  return (
    <div className="space-y-4">
      {value.map((q, qi) => (
        <div key={qi} className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Question {qi + 1}
            </span>
            <button type="button" onClick={() => remove(qi)} className="text-xs text-red-500 hover:text-red-700">
              Remove question
            </button>
          </div>

          <textarea
            value={q.question}
            onChange={(e) => update(qi, { ...q, question: e.target.value })}
            rows={2}
            placeholder="Question text"
            className="mb-3 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
          />

          <div className="space-y-2">
            {q.options.map((opt, oi) => (
              <div key={oi} className="flex items-center gap-2">
                <input
                  type="radio"
                  name={`correct-${qi}`}
                  checked={q.correctIndex === oi}
                  onChange={() => update(qi, { ...q, correctIndex: oi })}
                  title="Mark as correct answer"
                />
                <input
                  value={opt}
                  onChange={(e) => {
                    const options = [...q.options];
                    options[oi] = e.target.value;
                    update(qi, { ...q, options });
                  }}
                  placeholder={`Option ${oi + 1}`}
                  className="flex-1 rounded-md border border-slate-300 px-3 py-1.5 text-sm focus:border-slate-500 focus:outline-none"
                />
                {q.options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => {
                      const options = q.options.filter((_, j) => j !== oi);
                      const correctIndex =
                        q.correctIndex === oi ? 0 : q.correctIndex > oi ? q.correctIndex - 1 : q.correctIndex;
                      update(qi, { ...q, options, correctIndex });
                    }}
                    className="text-xs text-red-400 hover:text-red-600"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            {q.options.length < 6 && (
              <button
                type="button"
                onClick={() => update(qi, { ...q, options: [...q.options, ""] })}
                className="text-xs font-semibold text-slate-500 hover:text-slate-700"
              >
                + Add option
              </button>
            )}
          </div>

          <p className="mt-1 text-[11px] text-slate-400">
            The radio button marks the correct answer. Options are shuffled automatically for
            students every time the quiz loads and again on every retake — order here doesn't matter.
          </p>

          <textarea
            value={q.explanation}
            onChange={(e) => update(qi, { ...q, explanation: e.target.value })}
            rows={2}
            placeholder="Explanation shown after answering"
            className="mt-3 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
          />
        </div>
      ))}

      <button
        type="button"
        onClick={() => onChange([...value, emptyQuestion()])}
        className="rounded-md border border-dashed border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-500 hover:border-slate-400 hover:text-slate-700"
      >
        + Add question
      </button>
    </div>
  );
}
