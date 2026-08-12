import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getPublicCourse,
  getPublicTopics,
  getPublicTopic,
  getPublicSubtopics,
  getPublicQuizzesForSubtopics,
  cmsModuleSlug,
} from "../../../../lib/cms/queries";
import CmsAccessGate from "../../../../components/cms/CmsAccessGate";
import LibraryTopicClient from "../../../../components/cms/LibraryTopicClient";

export const revalidate = 0;

export default async function LibraryTopicPage({
  params,
}: {
  params: { courseSlug: string; topicSlug: string };
}) {
  const course = await getPublicCourse(params.courseSlug);
  if (!course) notFound();
  const topics = await getPublicTopics(course.id);
  const topic = await getPublicTopic(course.id, params.topicSlug);
  if (!topic) notFound();

  const subtopics = await getPublicSubtopics(topic.id);
  const quizzesBySubtopic = await getPublicQuizzesForSubtopics(subtopics.map((s) => s.id));
  const hasQuiz = subtopics.some((s) => quizzesBySubtopic[s.id]);
  const moduleSlug = cmsModuleSlug(course.slug, topic.slug);

  return (
    <CmsAccessGate
      courseSlug={course.slug}
      courseTitle={course.title}
      topics={topics}
      topicSlug={topic.slug}
      requireEnrollment={false}
    >
      <div className="mx-auto max-w-3xl space-y-6 px-6 py-10">
        <div>
          <Link href={`/library/${course.slug}`} className="text-sm text-[var(--text-lo)] hover:text-[var(--primary)]">
            ← {course.title}
          </Link>
          <h1 className="mt-1 text-2xl font-bold text-[var(--text-hi)]">{topic.title}</h1>
        </div>

        <LibraryTopicClient
          courseSlug={course.slug}
          courseTitle={course.title}
          topicSlug={topic.slug}
          moduleSlug={moduleSlug}
          subtopics={subtopics}
          hasQuiz={hasQuiz}
        />
      </div>
    </CmsAccessGate>
  );
}
