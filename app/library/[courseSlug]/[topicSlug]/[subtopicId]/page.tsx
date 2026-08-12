import { notFound } from "next/navigation";
import {
  getPublicCourse,
  getPublicTopics,
  getPublicTopic,
  getPublicSubtopics,
  getPublicSubtopic,
  getPublicQuizzesForSubtopics,
  cmsModuleSlug,
} from "../../../../../lib/cms/queries";
import CmsAccessGate from "../../../../../components/cms/CmsAccessGate";
import LibrarySubtopicClient from "../../../../../components/cms/LibrarySubtopicClient";

export const revalidate = 0;

export default async function LibrarySubtopicPage({
  params,
}: {
  params: { courseSlug: string; topicSlug: string; subtopicId: string };
}) {
  const course = await getPublicCourse(params.courseSlug);
  if (!course) notFound();
  const topics = await getPublicTopics(course.id);
  const topic = await getPublicTopic(course.id, params.topicSlug);
  if (!topic) notFound();

  const subtopics = await getPublicSubtopics(topic.id);
  const subtopic = await getPublicSubtopic(params.subtopicId);
  if (!subtopic || subtopic.topic_id !== topic.id) notFound();

  const quizzesBySubtopic = await getPublicQuizzesForSubtopics(subtopics.map((s) => s.id));
  const hasQuizHere = !!quizzesBySubtopic[subtopic.id];
  const idx = subtopics.findIndex((s) => s.id === subtopic.id);
  const nextSubtopic = subtopics[idx + 1];
  const moduleSlug = cmsModuleSlug(course.slug, topic.slug);

  return (
    <CmsAccessGate courseSlug={course.slug} courseTitle={course.title} topics={topics} topicSlug={topic.slug}>
      <LibrarySubtopicClient
        courseSlug={course.slug}
        topicSlug={topic.slug}
        moduleSlug={moduleSlug}
        subtopic={subtopic}
        subtopicIndex={idx}
        totalSubtopics={subtopics.length}
        nextSubtopicId={nextSubtopic?.id ?? null}
        hasQuizHere={hasQuizHere}
      />
    </CmsAccessGate>
  );
}
