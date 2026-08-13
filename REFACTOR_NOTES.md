# Kinetic Academy — Phase 1 Refactor Notes

## Scope and guardrails

Phase 1 establishes the CMS as the primary student-facing curriculum source and introduces a reusable authenticated academy shell. It does not change Supabase schema or data, authentication, admin behaviors, quiz scoring/lockout logic, or `lib/progress.ts` business logic.

## Route and curriculum-source map

| Area | Current source | Phase 1 decision |
| --- | --- | --- |
| `/` | `getCmsCoursesWithStats()` in `lib/cms/queries.ts` | Already CMS-backed; leave the marketing/catalog home unchanged. |
| `/dashboard` | `CmsDashboardClient` querying `courses`, `topics`, and `subtopics` | Already CMS-backed; place inside the academy shell without redesigning dashboard content. |
| `/courses/[courseSlug]` | Legacy-first conditional: `lib/courses.ts` is checked before a client-side CMS query | Switch the decision order to CMS-first, retaining the legacy branch only as a compatibility fallback when no published CMS course exists. |
| `/courses/[courseSlug]/[topicSlug]` and lesson routes | CMS tables through `CmsTopicAccordion` / `CmsSubtopicReader` | Keep CMS-backed route and place it inside the academy shell. |
| `/courses/[courseSlug]/[topicSlug]/quiz` | Legacy-first conditional with CMS fallback | Switch the decision order to CMS-first while preserving existing quiz engine/progress behavior and legacy fallback. |
| `/courses` | No index page exists | Add a CMS-only catalog route as the shell’s canonical Courses destination. |
| `/modules/**` | `lib/allModules.ts` → `lib/curriculum.ts` plus `lib/progress.ts` | Preserve unchanged as a temporary legacy compatibility surface; do not promote it in new navigation. |
| `/labs/**` | `lib/labs.ts` | Preserve unchanged; place inside the academy shell only. |
| `/admin/**` | Direct server Supabase queries and admin actions | Preserve existing admin layout, access checks, and actions. |

## Existing duplication and dependencies

- `lib/curriculum.ts` contains the legacy `Module`, lesson, and quiz model; `lib/allModules.ts` prepends `epicorBasicsModule`; `lib/courses.ts` wraps those modules into legacy courses.
- Legacy student routes under `app/modules/**` directly import `lib/allModules.ts`. `ModuleAccessGate`, `TopicAccessGate`, `DashboardClient`, `LessonList`, `FlowDiagram`, and `QuizEngine` retain legacy type/data dependencies.
- The CMS model is `courses → topics → subtopics → quizzes`. Student CMS read helpers live in `lib/cms/queries.ts`; CMS student components currently query via `lib/supabaseClient.ts`.
- `lib/admin/migrate-legacy.ts` and recovery/admin UI deliberately reference legacy curriculum as one-time import/recovery sources. These references remain necessary until a later, separately verified removal phase.
- `lib/progress.ts` persists legacy-compatible `module_slug` keys. CMS student components already use the compatibility key format `cms:${courseSlug}:${topicSlug}`; Phase 1 must not alter those writes or existing rows.

## Phase 1 implementation plan

1. Add isolated `components/academy/*` shell primitives (header, sidebar, mobile navigation, breadcrumbs, and non-functional search affordance) using existing CSS variables and no new dependencies.
2. Add nested layouts for `/dashboard`, `/courses`, and `/labs`; use a root client chrome boundary so legacy/public/admin pages retain their main/footer treatment while academy routes use the dedicated academy shell.
3. Add `/courses` as the canonical CMS catalog and make existing `/courses/[courseSlug]` and topic quiz lookup CMS-first, with legacy rendering retained only as a safety fallback.
4. Run install, production build, and a short `/dashboard` development-server smoke check before committing.

## Deferred to later phases

- Dashboard, learning-path, course/topic, lesson, search, glossary, and challenge UX redesign.
- Content schema/renderer expansion, learning modes, labs-in-curriculum linkage, simulator work, skills, recommendations, analytics, and AI tutor UI.
- Legacy route redirects/removal and any progress-key migration, which require a verified content and user-progress migration plan.

## Risks / follow-up points

- There is no `/learning-path`, `/challenges`, `/glossary`, or dedicated `/progress` route yet. The Phase 1 shell will label unavailable destinations as coming soon rather than send learners to broken routes.
- The typed `CourseRecord`, `TopicRecord`, and `SubtopicRecord` definitions omit several columns already used by client queries (for example `difficulty` and `est_minutes`). The current code uses local shapes/casts around those values; align generated/database types in a later focused type-safety pass.
- CMS reading is split between server helpers (`lib/cms/queries.ts`) and client-side Supabase calls. Phase 1 does not rewrite those requests because doing so could affect caching, RLS assumptions, and current progress behavior.
