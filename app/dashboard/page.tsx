import DashboardClient from "../../components/DashboardClient";
import { modules } from "../../lib/curriculum";

export default function DashboardPage() {
  return <DashboardClient modules={modules} />;
}
