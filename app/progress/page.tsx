import ProgressPageClient from "../../components/academy/ProgressPageClient";
import { getLearningPathData } from "../../lib/cms/queries";

export const dynamic = "force-dynamic";

export default async function ProgressPage() {
  return <ProgressPageClient courses={await getLearningPathData()} />;
}
