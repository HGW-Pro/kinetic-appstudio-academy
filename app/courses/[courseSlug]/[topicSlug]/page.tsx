import CmsTopicAccordion from "../../../../components/cms/CmsTopicAccordion";

export const dynamic = "force-dynamic";

export default function TopicPage({ params }: { params: { courseSlug: string; topicSlug: string } }) {
  return <CmsTopicAccordion courseSlug={params.courseSlug} topicSlug={params.topicSlug} />;
}
