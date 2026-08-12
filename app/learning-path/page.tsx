import LearningPathPageClient from "../../components/academy/LearningPathPageClient";
import { getLearningPathData } from "../../lib/cms/queries";

export const dynamic = "force-dynamic";

export default async function LearningPathPage() {
  const courses = await getLearningPathData();
  return <LearningPathPageClient courses={courses} />;
}
