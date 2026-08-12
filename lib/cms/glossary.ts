import "server-only";
import { createSupabaseServerClient } from "../supabase/server";

export type GlossaryTerm = {
  id: string;
  slug: string;
  term: string;
  definition: string;
  simple_explanation: string;
  used_in: string;
  related_topic_slugs: string[];
};

export type GlossaryTopicLink = {
  slug: string;
  title: string;
  href: string;
};

export type GlossaryTermWithLinks = GlossaryTerm & { relatedTopics: GlossaryTopicLink[] };

export async function getPublicGlossaryTerms(): Promise<GlossaryTermWithLinks[]> {
  const supabase = createSupabaseServerClient();
  const [termsResult, topicsResult] = await Promise.all([
    supabase.from("glossary_terms").select("id,slug,term,definition,simple_explanation,used_in,related_topic_slugs").order("term"),
    supabase.from("topics").select("slug,title,courses!inner(slug,is_published)"),
  ]);
  if (termsResult.error || !termsResult.data?.length) return [];

  const topicLinks = new Map<string, GlossaryTopicLink>();
  for (const row of topicsResult.data ?? []) {
    const courses = Array.isArray(row.courses) ? row.courses[0] : row.courses;
    if (courses?.is_published && courses.slug) {
      topicLinks.set(row.slug, { slug: row.slug, title: row.title, href: `/courses/${courses.slug}/${row.slug}` });
    }
  }

  return (termsResult.data as GlossaryTerm[]).map((term) => ({
    ...term,
    relatedTopics: (term.related_topic_slugs ?? []).map((slug) => topicLinks.get(slug)).filter((link): link is GlossaryTopicLink => Boolean(link)),
  }));
}
