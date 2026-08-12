import { notFound } from "next/navigation";
import {
  getPublicCourse,
  getPublicTopics,
  getPublicTopic,
  getPublicSubtopic,
  getPublicQuizForSubtopic,
  cmsModuleSlug,
} from "../../../../../../lib/cms/queries";
import CmsAccessGate from "../../../../../../components/cms/CmsAccessGate";
import QuizEngine from "../../../../../../components/QuizEngine";

export const revalidate = 0;

export default async function LibraryQuizPage({
  params,
}: {
  params: { courseSlug: string; topicSlug: string; subtopicId: string };
}) {
  const course = await getPublicCourse(params.courseSlug);
  if (!course) notFound();
  const topics = await getPublicTopics(course.id);
  const topic = await getPublicTopic(course.id, params.topicSlug);
  if (!topic) notFound();

  const subtopic = await getPublicSubtopic(params.subtopicId);
  if (!subtopic || subtopic.topic_id !== topic.id) notFound();

  const quiz = await getPublicQuizForSubtopic(subtopic.id);
  if (!quiz || quiz.questions_json.length === 0) notFound();

  const moduleSlug = cmsModuleSlug(course.slug, topic.slug);

  return (
    <CmsAccessGate courseSlug={course.slug} courseTitle={course.title} topics={topics} topicSlug={topic.slug}>
      <div className="px-6 py-10">
        <QuizEngine
          moduleSlug={moduleSlug}
          moduleTitle={`${topic.title} — ${subtopic.title}`}
          questions={quiz.questions_json}
          nextHref={`/library/${course.slug}/${topic.slug}`}
        />
      </div>
    </CmsAccessGate>
  );
}
