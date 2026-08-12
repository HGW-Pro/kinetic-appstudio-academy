import GlossaryClient from "../../components/academy/GlossaryClient";
import { getPublicGlossaryTerms } from "../../lib/cms/glossary";

export const dynamic = "force-dynamic";

export default async function GlossaryPage() {
  const terms = await getPublicGlossaryTerms();
  return <GlossaryClient terms={terms} />;
}
