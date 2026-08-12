// Pure, side-effect-free helpers shared between server-only data fetchers
// (lib/cms/queries.ts) and client components (components/cms/*). Kept in
// a separate file with NO `import "server-only"` at the top, because that
// directive poisons the entire module for client bundling -- any "use
// client" component that imports anything from a server-only file fails
// to build, even if it only needs a plain string-formatting function.

export function cmsModuleSlug(courseSlug: string, topicSlug: string): string {
  return `cms:${courseSlug}:${topicSlug}`;
}
