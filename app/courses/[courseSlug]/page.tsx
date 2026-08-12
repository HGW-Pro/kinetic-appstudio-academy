"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCourse } from "../../../lib/courses";
import { useAuth } from "../../../components/AuthProvider";
import { supabase } from "../../../lib/supabaseClient";
import {
  loadLocalProgress,
  loadRemoteProgress,
  type ProgressState,
} from "../../../lib/progress";

interface CmsTopicRow {
  id: string;
  title: string;
  slug: string;
  sequence_order: number;
}
interface CmsCourseRow {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  image_url: string | null;
}

export default function CoursePage({ params }: { params: { courseSlug: string } }) {
  const legacyCourse = getCourse(params.courseSlug);

  const { user, loading: authLoading } = useAuth();
  const [progress, setProgress] = useState<ProgressState>({});
  const [ready, setReady] = useState(false);

  const [cmsChecked, setCmsChecked] = useState(false);
  const [cmsCourse, setCmsCourse] = useState<CmsCourseRow | null>(null);
  const [cmsTopics, setCmsTopics] = useState<CmsTopicRow[]>([]);

  useEffect(() => {
    if (authLoading) return;
    (async () => {
      const p = user ? await loadRemoteProgress(user.id) : loadLocalProgress();
      setProgress(p);
      setReady(true);
    })();
  }, [user, authLoading]);

  useEffect(() => {
    if (legacyCourse) return;
    (async () => {
      const { data: course } = await supabase
        .from("courses")
        .select("id, title, slug, description, image_url")
        .eq("slug", params.courseSlug)
        .eq("is_published", true)
        .maybeSingle();
      if (course) {
        setCmsCourse(course);
        const { data: topics } = await supabase
          .from("topics")
          .select("id, title, slug, sequence_order")
          .eq("course_id", course.id)
          .order("sequence_order", { ascending: true });
        setCmsTopics(topics ?? []);
      }
      setCmsChecked(true);
    })();
  }, [legacyCourse, params.courseSlug]);

  if (legacyCourse) {
    const course = legacyCourse;
    const highestUnlocked = (() => {
      if (!user) return 0;
      let idx = 0;
      for (let i = 0; i < course.topics.length; i++) {
        if (progress[course.topics[i].slug]?.completedAt) {
          idx = i + 1;
        } else {
          break;
        }
      }
      return Math.min(idx, course.topics.length - 1);
    })();

    return (
      <div className="space-y-8">
        <div>
          <span className="badge-pill">{course.icon} Course</span>
          <h1 className="mt-4 text-3xl font-bold text-[var(--text-hi)]">{course.title}</h1>
          <p className="mt-2 max-w-2xl text-sm text-[var(--text-mid)]">{course.tagline}</p>
          <p className="mt-1 text-xs text-[var(--text-lo)]">
            Topics unlock strictly in order — complete a topic's assignment to move to the next.
          </p>
        </div>

        <div className="space-y-4">
          {course.topics.map((t, idx) => {
            const isCertified = !!progress[t.slug]?.completedAt;
            const isLocked = ready && (!user ? idx > 0 : idx > highestUnlocked);
            const card = (
              <div
                className={`group glass-card flex flex-col gap-4 rounded-xl p-6 transition sm:flex-row sm:items-center sm:justify-between ${
                  isLocked ? "opacity-60" : "hover:-translate-y-0.5 hover:shadow-md"
                }`}
              >
                <div className="flex items-start gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[var(--surface-2)] text-2xl">
                    {isLocked ? "🔒" : t.icon}
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-[var(--primary)]">
                      Topic {idx + 1} · {t.difficulty}
                      {isCertified ? " · 🏆 Certified" : ""}
                    </p>
                    <h2 className="mt-1 text-lg font-semibold text-[var(--text-hi)] group-hover:text-[var(--primary)]">
                      {t.title}
                    </h2>
                    <p className="mt-1 text-sm text-[var(--text-mid)]">{t.tagline}</p>
                    {isLocked && (
                      <p className="mt-1 text-xs text-[var(--text-lo)]">
                        {user ? "Complete the previous topic to unlock" : "Sign in to unlock"}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-4 pl-16 text-xs text-[var(--text-lo)] sm:pl-0 sm:text-right">
                  <div>
                    <p className="text-sm font-semibold text-[var(--text-hi)]">{t.lessons.length}</p>
                    <p>subtopics</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--text-hi)]">{t.estMinutes}m</p>
                    <p>duration</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--text-hi)]">{t.quiz.length}</p>
                    <p>quiz Qs</p>
                  </div>
                  {!isLocked && (
                    <span className="text-lg text-[var(--text-lo)] transition group-hover:translate-x-1 group-hover:text-[var(--primary)]">
                      →
                    </span>
                  )}
                </div>
              </div>
            );
            return isLocked ? (
              <div key={t.slug} className="cursor-not-allowed">
                {card}
              </div>
            ) : (
              <Link key={t.slug} href={`/courses/${params.courseSlug}/${t.slug}`}>
                {card}
              </Link>
            );
          })}
        </div>
      </div>
    );
  }

  if (!cmsChecked) return null;
  if (!cmsCourse) notFound();

  return (
    <div className="space-y-8">
      <div>
        <span className="badge-pill">📚 Course</span>
        <h1 className="mt-4 text-3xl font-bold text-[var(--text-hi)]">{cmsCourse.title}</h1>
        {cmsCourse.description && (
          <p className="mt-2 max-w-2xl text-sm text-[var(--text-mid)]">{cmsCourse.description}</p>
        )}
        <p className="mt-1 text-xs text-[var(--text-lo)]">
          Topics unlock strictly in order — complete a topic's assignment to move to the next.
        </p>
      </div>

      <div className="space-y-2">
        {cmsTopics.map((t, i) => (
          <Link
            key={t.id}
            href={`/courses/${params.courseSlug}/${t.slug}`}
            className="glass-card flex items-center justify-between rounded-lg p-4 transition hover:border-[var(--primary)]"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--primary)] text-xs font-bold text-[var(--primary)]">
                {i + 1}
              </span>
              <span className="text-sm font-semibold text-[var(--text-hi)]">{t.title}</span>
            </div>
            <span className="text-[var(--text-lo)]">→</span>
          </Link>
        ))}
        {cmsTopics.length === 0 && (
          <p className="rounded-lg border border-dashed border-[var(--border-strong)] px-4 py-6 text-center text-sm text-[var(--text-lo)]">
            No topics published yet.
          </p>
        )}
      </div>
    </div>
  );
}
