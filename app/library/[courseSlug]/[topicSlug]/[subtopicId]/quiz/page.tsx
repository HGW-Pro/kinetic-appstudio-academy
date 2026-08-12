import { notFound } from "next/navigation";
import {
  getPublicCourse,
  getPublicTopics,
  getPublicTopic,
  getPublicSubtopic,
  getPublicQuizForSubtopic,
} from "../../../../../../lib/cms/queries";
import { cmsModuleSlug } from "../../../../../../lib/cms/shared";
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

  // QuizEngine (built for the legacy hardcoded curriculum) expects each
  // question to carry a stable `id`. The CMS's QuizQuestionSchema has no
  // such field, so synthesize a positional one here at the boundary
  // rather than changing either QuizEngine's existing contract or the
  // CMS schema — this keeps both sides untouched.
  const questionsWithId = quiz.questions_json.map((q, i) => ({ ...q, id: `q${i}` }));

  return (
    <CmsAccessGate courseSlug={course.slug} courseTitle={course.title} topics={topics} topicSlug={topic.slug}>
      <div className="px-6 py-10">
        <QuizEngine
          moduleSlug={moduleSlug}
          moduleTitle={`${topic.title} — ${subtopic.title}`}
          questions={questionsWithId}
          nextHref={`/library/${course.slug}/${topic.slug}`}
        />
      </div>
    </CmsAccessGate>
  );
}
