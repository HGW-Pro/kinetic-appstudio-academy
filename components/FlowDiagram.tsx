"use client";

import { useEffect, useRef, useState } from "react";
import type { FlowDiagram } from "../lib/curriculum";

export default function FlowDiagramView({ flow }: { flow: FlowDiagram }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="my-5 overflow-hidden rounded-xl border border-[var(--primary)]/20 bg-[var(--primary)]/[0.035] p-5"
    >
      <p className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[var(--primary)]">
        <span className="text-base">🔀</span> {flow.title}
      </p>
      <div className="flex flex-col items-stretch gap-0 sm:flex-row sm:items-center sm:gap-0">
        {flow.steps.map((step, i) => (
          <div key={i} className="flex flex-1 items-center gap-0 sm:flex-row">
            <div
              className={`flow-node w-full rounded-lg border px-4 py-3 text-center shadow-sm transition-all duration-500 ${
                visible ? "flow-node-in" : "opacity-0 translate-y-2"
              }`}
              style={{ transitionDelay: `${i * 160}ms` }}
            >
              <p className="text-xs font-bold text-[var(--text-hi)]">{step.label}</p>
              {step.detail && (
                <p className="mt-1 text-[10px] leading-snug text-[var(--text-lo)]">{step.detail}</p>
              )}
            </div>
            {i < flow.steps.length - 1 && (
              <div
                className={`flow-arrow shrink-0 transition-opacity duration-500 ${
                  visible ? "opacity-100" : "opacity-0"
                }`}
                style={{ transitionDelay: `${i * 160 + 80}ms` }}
              >
                <svg className="hidden h-6 w-10 sm:block" viewBox="0 0 40 24" fill="none">
                  <path
                    d="M2 12H34M34 12L26 5M34 12L26 19"
                    stroke="url(#flowGrad)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={visible ? "flow-dash" : ""}
                  />
                  <defs>
                    <linearGradient id="flowGrad" x1="0" y1="0" x2="40" y2="0">
                      <stop stopColor="var(--primary)" />
                      <stop offset="1" stopColor="var(--primary-light)" />
                    </linearGradient>
                  </defs>
                </svg>
                <svg className="mx-auto block h-8 w-6 sm:hidden" viewBox="0 0 24 32" fill="none">
                  <path
                    d="M12 2V26M12 26L5 18M12 26L19 18"
                    stroke="url(#flowGradV)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <defs>
                    <linearGradient id="flowGradV" x1="0" y1="0" x2="0" y2="32">
                      <stop stopColor="var(--primary)" />
                      <stop offset="1" stopColor="var(--primary-light)" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            )}
          </div>
        ))}
        {flow.loop && (
          <p className="mt-2 text-center text-[10px] italic text-[var(--text-lo)] sm:hidden">
            ↩ loops back to step 1
          </p>
        )}
      </div>
    </div>
  );
}
