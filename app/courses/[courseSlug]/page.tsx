"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCourse } from "../../../lib/courses";
import { useAuth } from "../../../components/AuthProvider";
import { supabase } from "../../../lib/supabaseClient";
import { cmsModuleSlug } from "../../../lib/cms/shared";
import {
  loadLocalProgress,
  loadRemoteProgress,
  type ProgressState,
} from "../../../lib/progress";

interface CmsCourseRow {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  image_url: string | null;
}

interface CmsTopicWithStats {
  id: string;
  title: string;
  slug: string;
  difficulty: string;
  estMinutes: number;
  subtopicCount: number;
  quizQuestionCount: number;
}

// Raw shape returned by the single nested/embedded Supabase query below --
// PostgREST resolves the whole course -> topics -> subtopics -> quizzes
// tree server-side in one round trip instead of four sequential ones.
interface NestedQuizRow {
  questions_json: unknown;
}
interface NestedSubtopicRow {
  id: string;
  quizzes: NestedQuizRow[] | NestedQuizRow | null;
}
interface NestedTopicRow {
  id: string;
  title: string;
  slug: string;
  sequence_order: number;
  difficulty: string | null;
  est_minutes: number | null;
  subtopics: NestedSubtopicRow[] | null;
}
interface NestedCourseRow {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  topics: NestedTopicRow[] | null;
}

function countQuizQuestions(quizzes: NestedQuizRow[] | NestedQuizRow | null): number {
  const rows = Array.isArray(quizzes) ? quizzes : quizzes ? [quizzes] : [];
  return rows.reduce((sum, q) => sum + (Array.isArray(q.questions_json) ? q.questions_json.length : 0), 0);
}

export default function CoursePage({ params }: { params: { courseSlug: string } }) {
  const legacyCourse = getCourse(params.courseSlug);

  const { user, loading: authLoading } = useAuth();
  const [progress, setProgress] = useState<ProgressState>({});
  const [ready, setReady] = useState(false);

  const [cmsChecked, setCmsChecked] = useState(false);
  const [cmsCourse, setCmsCourse] = useState<CmsCourseRow | null>(null);
  const [cmsTopics, setCmsTopics] = useState<CmsTopicWithStats[]>([]);

  // Progress load and CMS data load are independent -- both effects fire
  // on mount and run concurrently already (neither awaits the other).
  useEffect(() => {
    if (authLoading) return;
    (async () => {
      const p = user ? await loadRemoteProgress(user.id) : loadLocalProgress();
      setProgress(p);
      setReady(true);
    })();
  }, [user, authLoading]);

  useEffect(() => {
    (async () => {
      // Single nested/embedded query: PostgREST resolves course, topics,
      // subtopics, and quizzes in one HTTP round trip via foreign-table
      // embedding, instead of four sequential awaited queries where each
      // one needs IDs produced by the previous one (a genuine dependency
      // chain that Promise.all cannot parallelize away -- collapsing the
      // round trips themselves is the only real fix).
      const { data: course } = await supabase
        .from("courses")
        .select(
          `id, title, slug, description, image_url,
           topics (
             id, title, slug, sequence_order, difficulty, est_minutes,
             subtopics ( id, quizzes ( questions_json ) )
           )`
        )
        .eq("slug", params.courseSlug)
        .eq("is_published", true)
        .order("sequence_order", { foreignTable: "topics", ascending: true })
        .maybeSingle<NestedCourseRow>();

      if (!course) {
        setCmsChecked(true);
        return;
      }
      setCmsCourse({
        id: course.id,
        title: course.title,
        slug: course.slug,
        description: course.description,
        image_url: course.image_url,
      });

      const enriched: CmsTopicWithStats[] = (course.topics ?? []).map((t) => {
        const subtopics = t.subtopics ?? [];
        const subtopicCount = subtopics.length;
        const quizQuestionCount = subtopics.reduce((sum, s) => sum + countQuizQuestions(s.quizzes), 0);
        return {
          id: t.id,
          title: t.title,
          slug: t.slug,
          difficulty: t.difficulty && t.difficulty.trim() ? t.difficulty : "Standard",
          estMinutes: t.est_minutes && t.est_minutes > 0 ? t.est_minutes : Math.max(subtopicCount * 5, 5),
          subtopicCount,
          quizQuestionCount,
        };
      });
      setCmsTopics(enriched);
      setCmsChecked(true);
    })();
  }, [params.courseSlug]);

  // Published CMS content is the canonical student-facing curriculum. The
  // legacy course branch remains only as a safe compatibility fallback for
  // an as-yet-unmigrated legacy slug.
  if (cmsChecked && !cmsCourse && legacyCourse) {
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

  const highestUnlocked = (() => {
    if (!user) return 0;
    let idx = 0;
    for (let i = 0; i < cmsTopics.length; i++) {
      const key = cmsModuleSlug(cmsCourse.slug, cmsTopics[i].slug);
      if (progress[key]?.completedAt) {
        idx = i + 1;
      } else {
        break;
      }
    }
    return Math.min(idx, cmsTopics.length - 1);
  })();

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

      <div className="space-y-4">
        {cmsTopics.map((t, idx) => {
          const moduleKey = cmsModuleSlug(cmsCourse.slug, t.slug);
          const isCertified = !!progress[moduleKey]?.completedAt;
          const isLocked = ready && (!user ? idx > 0 : idx > highestUnlocked);
          const card = (
            <div
              className={`group glass-card flex flex-col gap-4 rounded-xl p-6 transition sm:flex-row sm:items-center sm:justify-between ${
                isLocked ? "opacity-60" : "hover:-translate-y-0.5 hover:shadow-md"
              }`}
            >
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[var(--surface-2)] text-2xl">
                  {isLocked ? "🔒" : "📘"}
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[var(--primary)]">
                    Topic {idx + 1} · {t.difficulty.toUpperCase()}
                    {isCertified ? " · 🏆 CERTIFIED" : ""}
                  </p>
                  <h2 className="mt-1 text-lg font-semibold text-[var(--text-hi)] group-hover:text-[var(--primary)]">
                    {t.title}
                  </h2>
                  {isLocked && (
                    <p className="mt-1 text-xs text-[var(--text-lo)]">
                      {user ? "Complete the previous topic to unlock" : "Sign in to unlock"}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-4 pl-16 text-xs text-[var(--text-lo)] sm:pl-0 sm:text-right">
                <div>
                  <p className="text-sm font-semibold text-[var(--text-hi)]">{t.subtopicCount}</p>
                  <p>subtopics</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--text-hi)]">{t.estMinutes}m</p>
                  <p>duration</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--text-hi)]">{t.quizQuestionCount}</p>
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
            <div key={t.id} className="cursor-not-allowed">
              {card}
            </div>
          ) : (
            <Link key={t.id} href={`/courses/${params.courseSlug}/${t.slug}`}>
              {card}
            </Link>
          );
        })}
        {cmsTopics.length === 0 && (
          <p className="rounded-lg border border-dashed border-[var(--border-strong)] px-4 py-6 text-center text-sm text-[var(--text-lo)]">
            No topics published yet.
          </p>
        )}
      </div>
    </div>
  );
}
