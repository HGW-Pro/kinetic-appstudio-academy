"use client";

import { useState } from "react";
import type { Lesson } from "../lib/curriculum";
import { playSound } from "../lib/sounds";
import FlowDiagramView from "./FlowDiagram";
import VisualMockup from "./VisualMockup";
import ImageGallery, { type LessonImage } from "./ImageGallery";

function renderInline(text: string) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : <span key={i}>{part}</span>
  );
}

/**
 * Breaks a subtopic's content into discrete interactive steps instead of one
 * long scroll of text. The user must click "Continue" through each paragraph
 * step, then engage with any visual (mockup / flow diagram / images) on a
 * dedicated final step, before the "Mark Complete" action becomes available.
 */
export default function SubtopicStepper({
  lesson,
  onComplete,
  isLastSubtopic,
}: {
  lesson: Lesson;
  onComplete: () => void;
  isLastSubtopic: boolean;
}) {
  const lessonImages = (lesson as unknown as { images?: LessonImage[] }).images;
  const hasVisual = !!(lesson.mockup || lesson.flow || (lessonImages && lessonImages.length > 0));
  const textSteps = lesson.body.length;
  const totalSteps = textSteps + (hasVisual ? 1 : 0) + 1; // + visual step (optional) + final proTip/complete step
  const [stepIndex, setStepIndex] = useState(0);
  const [visualAcknowledged, setVisualAcknowledged] = useState(!hasVisual);

  const onVisualStep = hasVisual && stepIndex === textSteps;
  const onFinalStep = stepIndex === totalSteps - 1;

  function next() {
    playSound("click");
    setStepIndex((i) => Math.min(i + 1, totalSteps - 1));
  }

  function acknowledgeVisual() {
    playSound("click");
    setVisualAcknowledged(true);
    next();
  }

  return (
    <div className="space-y-5">
      {/* Step progress dots */}
      <div className="flex items-center justify-center gap-1.5">
        {Array.from({ length: totalSteps }, (_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all ${
              i === stepIndex
                ? "w-6 bg-[var(--primary)]"
                : i < stepIndex
                ? "w-1.5 bg-[var(--primary-light)]"
                : "w-1.5 bg-[var(--surface-3)]"
            }`}
          />
        ))}
      </div>

      <div className="glass-card glow-border min-h-[220px] rounded-2xl p-8">
        {stepIndex < textSteps && (
          <div key={stepIndex} className="lesson-reveal">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[var(--primary)]">
              Step {stepIndex + 1} of {totalSteps}
            </p>
            <p className="prose-lesson text-base leading-relaxed text-[var(--text-mid)]">
              {renderInline(lesson.body[stepIndex])}
            </p>
            <button
              onClick={next}
              className="mt-6 rounded-md bg-[var(--primary)] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:scale-[1.03] hover:bg-[var(--primary-dark)]"
            >
              Continue →
            </button>
          </div>
        )}

        {onVisualStep && (
          <div className="lesson-reveal">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[var(--primary)]">
              Step {stepIndex + 1} of {totalSteps} · See it in the UI
            </p>
            {lessonImages && lessonImages.length > 0 && <ImageGallery images={lessonImages} />}
            {lesson.mockup && <VisualMockup mockup={lesson.mockup} />}
            {lesson.flow && <FlowDiagramView flow={lesson.flow} />}
            <button
              onClick={acknowledgeVisual}
              className="mt-4 rounded-md bg-[var(--primary)] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:scale-[1.03] hover:bg-[var(--primary-dark)]"
            >
              Got it, continue →
            </button>
          </div>
        )}

        {onFinalStep && (
          <div className="lesson-reveal text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[var(--primary)]">
              Step {stepIndex + 1} of {totalSteps} · Wrap-up
            </p>
            {lesson.proTip && (
              <div className="mb-5 rounded-lg border border-[var(--primary)]/20 bg-[var(--primary)]/[0.05] px-4 py-3 text-left text-sm text-[var(--text-mid)]">
                <span className="mr-2 font-semibold text-[var(--primary)]">💡 Pro tip:</span>
                {lesson.proTip}
              </div>
            )}
            <div className="text-4xl">✅</div>
            <p className="mt-2 text-sm text-[var(--text-mid)]">
              You've covered every part of this subtopic.
            </p>
            <button
              onClick={onComplete}
              disabled={!visualAcknowledged}
              className="mt-5 rounded-md bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:scale-[1.03] hover:bg-[var(--primary-dark)]"
            >
              {isLastSubtopic ? "Complete Topic →" : "Mark Complete & Continue →"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
