import CmsSubtopicReader from "../../../../../components/cms/CmsSubtopicReader";

export const dynamic = "force-dynamic";

export default function SubtopicPage({ params }: { params: { courseSlug: string; topicSlug: string; subtopicId: string } }) {
  return <CmsSubtopicReader courseSlug={params.courseSlug} topicSlug={params.topicSlug} subtopicId={params.subtopicId} />;
}
