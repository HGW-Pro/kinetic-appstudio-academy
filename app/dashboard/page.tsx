import CmsDashboardClient from "../../components/CmsDashboardClient";
import { getLearningPathData } from "../../lib/cms/queries";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const courses = await getLearningPathData();
  return <CmsDashboardClient courses={courses} />;
}
