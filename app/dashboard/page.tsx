import DashboardClient from "../../components/DashboardClient";
import { modules } from "../../lib/allModules";

export default function DashboardPage() {
  return <DashboardClient modules={modules} />;
}
