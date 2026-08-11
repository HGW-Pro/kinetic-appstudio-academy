"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { getCourse, getTopic } from "../../../../lib/courses";
import SubtopicViewer from "../../../../components/SubtopicViewer";
import TopicAccessGate from "../../../../components/TopicAccessGate";

export default function TopicDetailPage({
  params,
}: {
  params: { courseSlug: string; topicSlug: string };
}) {
  const course = getCourse(params.courseSlug);
  const topic = getTopic(params.courseSlug, params.topicSlug);
  if (!course || !topic) notFound();

  const idx = course.topics.findIndex((t) => t.slug === topic.slug);
  const prev = course.topics[idx - 1];
  const next = course.topics[idx + 1];

  return (
    <TopicAccessGate courseSlug={course.slug} topicSlug={topic.slug}>
      <div className="space-y-10">
        <div>
          <Link
            href={`/courses/${course.slug}`}
            className="text-sm font-medium text-[var(--primary)] hover:underline"
          >
            ← {course.title}
          </Link>
        </div>

        <div className="glass-card glow-border rounded-2xl p-8">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{topic.icon}</span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--primary)]">
                Main Topic {idx + 1} of {course.topics.length} · {topic.difficulty}
              </p>
              <h1 className="text-2xl font-bold text-[var(--text-hi)] sm:text-3xl">{topic.title}</h1>
            </div>
          </div>
          <p className="mt-4 max-w-2xl text-sm text-[var(--text-mid)]">{topic.tagline}</p>
          <div className="mt-5 flex flex-wrap gap-3 text-xs text-[var(--text-lo)]">
            <span className="badge-pill">{topic.lessons.length} subtopics</span>
            <span className="badge-pill">{topic.estMinutes} min</span>
            <span className="badge-pill">{topic.quiz.length}-question assignment</span>
          </div>
        </div>

        <SubtopicViewer courseSlug={course.slug} topicSlug={topic.slug} lessons={topic.lessons} />

        <div className="glass-card rounded-2xl p-6 text-center">
          <h2 className="text-lg font-semibold text-[var(--text-hi)]">
            Ready to test your knowledge?
          </h2>
          <p className="mt-1 text-sm text-[var(--text-mid)]">
            Score 80% or higher on the {topic.quiz.length}-question assignment to earn this topic's
            badge and unlock the next one.
          </p>
          <Link
            href={`/courses/${course.slug}/${topic.slug}/quiz`}
            className="mt-5 inline-block rounded-md bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--primary-dark)]"
          >
            Take the Assignment →
          </Link>
        </div>

        <div className="flex items-center justify-between text-sm">
          {prev ? (
            <Link
              href={`/courses/${course.slug}/${prev.slug}`}
              className="text-[var(--text-mid)] hover:text-[var(--primary)]"
            >
              ← {prev.title}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              href={`/courses/${course.slug}/${next.slug}`}
              className="text-[var(--text-mid)] hover:text-[var(--primary)]"
            >
              {next.title} →
            </Link>
          ) : (
            <span />
          )}
        </div>
      </div>
    </TopicAccessGate>
  );
}
