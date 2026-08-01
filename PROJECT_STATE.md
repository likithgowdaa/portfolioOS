# PROJECT_STATE

Single source of truth for where the project is and what comes next.

## Version

**v2.4.0**

## Status

**Production Ready**

## Current Milestone

**Populate Portfolio Data**

## Completed

### v2.4.0 — Supabase Storage for Media

- **Storage swap:** Studio media uploads (profile photo, project covers/gallery, resume PDF, and every image/file field) moved from the local filesystem (`public/uploads`, served via `/uploads/[name]`) to a public **Supabase Storage bucket** (`media`). The upload API, Studio UI, public rendering, and CMS persistence are unchanged in shape — only where files live differs.
- **Storage layer** (`src/lib/media/storage.ts`, server-only): `ensureBucket` (public bucket, 10 MB cap, created on first upload), `uploadFile` (unique uuid+ext name, returns the public Storage URL), `listFiles`, `deleteFile`, `getPublicUrl`.
- **Media API:** `/api/studio/media` (GET/POST) and `/api/studio/media/[name]` (DELETE) route through Storage with the same auth guard, allowlist (PNG/JPG/WEBP/SVG/PDF), and 10 MB limit as before — no `fs` reads or writes remain. Uploads return the full public URL, which the CMS saves exactly like any other content.
- **Legacy compatibility:** `/uploads/[name]` now 308-redirects to the object's public Storage URL (no filesystem). It exists only to keep previously-saved `/uploads/…` references working; new uploads store full Storage URLs and never hit it.
- **Backfill** (`npm run seed:media`, `frontend/scripts/seed-media.mjs`): uploads legacy `public/uploads/*` files into the bucket additively (safe to re-run), mirroring `seed:cms`. After it succeeds, `public/uploads` is only a migration source and can be deleted.
- **Environment:** no new variables — Storage uses the existing `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`. Works identically locally and on Vercel (read-only filesystem).
- **Validation:** typecheck, lint, Prettier, and the production build pass without any Supabase config (CI parity).

### v2.3.0 — Supabase CMS Store

- **Persistence swap:** the CMS content store moved from the local JSON file (`data/cms/store.json`) to Supabase. `src/lib/cms/store.ts` now reads/writes 8 tables (profile, resume, contact, footer, seo as single rows; projects, journey, certifications as one row per item) through a server-side `service_role` client (`src/lib/supabase/server.ts`). The store API, Studio UI, public UI, draft/publish/status lifecycle, ordering, and CRUD behavior are unchanged — no redesign, only the persistence backend.
- **Schema + RLS** (`supabase/schema.sql`): `cms_status` enum (draft/published/hidden/archived), JSONB `data`/`draft`, `sort_order` for collections. RLS enabled everywhere: `anon` can SELECT *published* rows only; all writes are revoked from `anon`/`authenticated`; `service_role` (server-only) does the writes.
- **Seed** (`npm run seed:cms`, `frontend/scripts/seed-cms.mjs`): imports the existing `store.json` into Supabase additively (inserts missing rows only — safe to re-run). Migration steps live in `supabase/migration.md`.
- **Graceful fallback:** with Supabase unconfigured/unreachable, reads degrade to the default store — the public site and CI build keep working with no env vars or network.
- **Environment:** `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` wired into `frontend/.env`, root `.env`/`.env.example`, and the frontend container in `docker-compose.yml`. Media uploads were migrated to Supabase Storage in v2.4.0.
- **Validation:** typecheck, lint, and the production build pass without any Supabase config (CI parity).

### v2.2.0 — Passphrase Authentication (auth replacement)

- **Auth replacement:** Google OAuth removed entirely. Studio now logs in with a single passphrase (`STUDIO_ADMIN_SECRET`) compared server-side with a timing-safe HMAC comparison — no Google client ID / client secret / email allowlist, no OAuth redirect, no identity provider.
- **Session reuse:** the existing signed httpOnly session cookie (HMAC-SHA256, `STUDIO_SESSION_SECRET`, 30-day TTL, `secure` in production, `sameSite: lax`) is issued unchanged; logout, session read, and the protected dashboard layout are untouched.
- **Login flow:** `/studio/login` is a minimal passphrase form (Access Passphrase → Enter Studio) posting to `/api/auth/login`. Failures — wrong passphrase, missing secret, or a rate-limited IP — all return the generic "Invalid passphrase."; per-IP rate limiting (10 attempts / 15 min, in-process) and a constant response delay damp brute force without external services.
- **Dead code removed:** `/api/auth/google`, `/api/auth/callback`, the Google OAuth state / token / allowlist helpers, and the `googleusercontent` image remote pattern in `next.config.ts`.
- **Validation:** typecheck, lint, and the production build pass; the full flow (login, session persistence, protected routes, logout, invalid passphrase) was runtime-tested with curl.

### Sprint 09 — Studio CMS (v2.1.0)

- **CMS core** (`src/lib/cms/`): typed entity model (`CmsEntity`), server-only JSON store (`data/cms/store.json`, created on first Studio write, git-ignored; replaced by a Supabase store in v2.3.0), fallback defaults for every entity, and `getPublicContent()` — the public assembly that applies visibility + draft resolution so the public site renders only what is published.
- **CMS API routes** (`/api/studio/content/*`, auth-guarded): CRUD per entity, publish, per-item status (draft / published / hidden / archived), reorder, and delete. Media API (`/api/studio/media`) handles upload (PNG/JPG/WEBP/SVG/PDF, ≤10 MB), list, and delete. Uploaded files are served via `/uploads/[name]` — a route handler that reads `public/uploads` from disk, because `next start` only serves public files that existed at build time.
- **Schema-driven form system** (`features/studio/form/`): one `EntityForm` renders every editor from a schema — 13 field types (text, textarea, markdown, number, date, select, boolean, tags, url, file, image, images, repeatable) with dot-path support for nested objects and an image picker backed by the media library.
- **Entity schemas** (`features/studio/schemas/`): all 8 entities — profile, resume, contact, footer, seo (single) and projects, journey, certifications (collections) — each with labeled sections, helpers, and blank defaults.
- **Editors + publish workflow** (`features/studio/editors/`): single-entity editor and collection editor (list, create, reorder, per-item visibility). Edit → Save Draft → Preview → Publish; publishing is never automatic — `PublishDialog` confirms, shows progress, then "Portfolio Updated". The `SaveBar` is now live (registered save/discard actions). `PreviewPane` renders draft content in the public card language.
- **Studio editor pages**: Profile, Resume, Contact, Footer, SEO, Projects, Journey, and Certifications all open real editors. The sidebar gained Footer and SEO. The dashboard reads the same published content the public site renders.
- **Public site CMS integration**: landing page, root layout metadata (`generateMetadata`), structured data, sitemap, robots, and `/projects/[slug]` all read `getPublicContent()`. Sections are prop-driven and hide themselves when empty (no placeholders); the home page is dynamic so publishes reflect immediately. Project detail pages render on demand. The old per-feature data-access hooks were removed.
- **Validation**: typecheck, lint, Prettier, and `next build` all pass; the full flow was runtime-tested against the production server — auth-guarded content API (401 unauthenticated), draft save, publish, collection create/reorder/delete, media upload/serve/delete, and immediate reflection on the public site.

### Sprint 08 — Studio Foundation (v2.0.0)

- **Private route**: `/studio` exists only by direct URL — no link and no login button anywhere in the public portfolio (verified: absent from the nav and from the sitemap). The public site is unchanged.
- **Authentication**: passphrase login (`STUDIO_ADMIN_SECRET`, timing-safe HMAC comparison, no identity provider) with signed httpOnly session cookies (HMAC-SHA256, `STUDIO_SESSION_SECRET`), per-IP rate limiting, and a protected dashboard layout that redirects unauthenticated visitors to `/studio/login`. Routes: `/api/auth/login`, `/api/auth/logout`, `/api/auth/session`. Logout is a plain form POST (no client JS).
- **Shell**: `features/studio/` slice — sidebar (Dashboard, Profile, Projects, Journey, Certifications, Resume, Contact, Settings, plus Resources and Analytics as disabled "Soon" items), top bar (theme toggle, logged-in user, logout), and a mobile off-canvas drawer. The active page is highlighted via `aria-current`.
- **Dashboard**: stat cards (Projects, Journey, Certifications, Resume, Profile, Contact — derived from the same data the public site renders) plus Last Updated / Last Published / Portfolio Status / Theme.
- **Save workflow**: `SaveStateProvider` + `SaveBar` (Save Draft / Discard Changes, no autosave). Dormant until future editors mark changes dirty.
- **Publishing model**: `PublishStatus` (draft / published / hidden / archived) + `StatusBadge`; publishing is never automatic.
- **Preview foundation**: the publish-status model and editor→shell seams are in place for the future Edit → Preview → Publish flow; preview rendering is a documented refinement.
- **Theme integration**: `ThemeToggle` moved to `components/shared` and used by both public Navbar and Studio top bar. `ThemeProvider` wraps the root layout with `disableTransitionOnChange` so theme flips respect the global CSS motion collapse.
- **Performance**: dead modules removed; client/server boundaries unchanged — client components remain limited to those needing motion or interactivity.
- **SEO**: metadata, robots, sitemap, structured data, and Open Graph reviewed — no genuine issues; nothing invented.

### Sprint 07 — Final Engineering Cleanup (v1.0.1)

- **Availability deduplication**: merged `availability` + `availabilityStatus` into a single `availability` string (empty = hidden). Updated `src/lib/profile.ts`, About section, Hero badge, and Contact card. The Hero availability badge, About "Currently" line, and Contact "Availability" row now share one source of truth — no drift possible.
- **Hero + Navbar resume gates**: Resume CTA (primary button) and Navbar "Resume" link only render when `resumeAvailable && resumeUrl.length > 0`. No broken buttons; the section is entirely absent when no asset exists.
- **Navigation section IDs**: added `resume`, `contact`, `journey`, `certifications` to `NAV_SECTION_IDS` and corresponding `id` attributes on every landing section (`<section id="…">`). The Navbar smooth-scrolls via these anchors; every section is reachable.
- **Dead code removal**: removed empty `src/lib/resume.ts`, the `ProfileCard` wrapper, and inlined its content into `AboutSection`. No unused exports, no redundant re-exports.

### Sprint 06 — Footer + SEO + Production Readiness (Task 6.6)

- **Footer feature** (`features/footer/`): a server component (no client bundle). Renders "© {year} {name}. All rights reserved.", optional GitHub / LinkedIn / Email links (each hidden when empty — currently all empty, so only the copyright + built-with line show), and the "Built with Next.js, FastAPI and ❤️" line. Stacks centered on mobile, rows on desktop. No unnecessary links.
- **SEO metadata** (`src/app/layout.tsx`): title, description, and keywords now built from real profile data (name + role, tagline, location) with graceful fallbacks to `siteConfig`; canonical, authors / creator / publisher, Open Graph (website type, site name, title, description, url) and Twitter card metadata added. No invented content — OG/Twitter images are omitted until a real asset exists.
- **Structured data**: JSON-LD `Person` (name, jobTitle, url, email, address, sameAs) + `WebSite` injected in the root layout, built only from available profile values — email and social links are omitted while empty.
- **Sitemap** (`src/app/sitemap.ts`): now lists the home page plus every public project detail page (from `getPublicSlugs()`). `robots.ts` reviewed — already correct (allow all + sitemap reference), unchanged.
- **Manifest**: no web manifest exists in the repo, so the spec's "if already exists" condition did not apply; none was created.
- **Accessibility review**: verified the skip link, `h1`/`h2`/`h3` hierarchy on both public pages, focus-visible states, semantic elements, ARIA labels, and keyboard behavior (Escape-dismissible nav drawer, `aria-expanded`, `aria-current`, `aria-controls`). No issues discovered — nothing needed fixing.
- **Responsive review**: verified every section across mobile / tablet / desktop (responsive grids, timeline, nav drawer, footer stacking). No layout inconsistencies found.
- **Performance review**: the footer is server-rendered, metadata and JSON-LD are server-side, and the sitemap reuses existing data — no new client components, no duplicated styling.
- **Integration**: `<FooterSection />` added to the landing page immediately after `<ContactSection />`, outside `<main>`. Project detail pages keep their existing layout per scope — a site-wide footer can be added later if desired.

### Sprint 06 — Contact Section (Task 6.5)

- **Profile data** (`src/lib/profile.ts`): centralized profile extended with `email`, `github`, `linkedin`, and `availabilityStatus`; `location` was already present. No values are invented — the new fields are empty until real contact details are supplied (location keeps its existing real value).
- **New feature slice** `features/contact/` (components/, hooks/, index.ts) following the feature-slice architecture. `useContact()` reads the contact fields from the centralized profile — the seam where the future Studio CMS will fetch them.
- **ContactSection**: "Contact" heading, short intro, and a single data-driven card. The card renders only the rows that have data — Email (`mailto:` link), GitHub and LinkedIn (external links opening in a new tab, `rel="noreferrer"`), Location and Availability (plain text). A single primary **Let's Connect** button appears only when an email exists and opens the default mail client via `mailto:` — no contact form, no backend. The card is clean, accessible, and hides gracefully when empty.
- **Integration**: `ContactSection` added to the landing page after Resume. Hero "Let's Connect" button removed (duplicated the Contact CTA). Navbar no longer links to a non-existent contact anchor.

### Sprint 06 — Resume Section (Task 6.4)

- **Profile data** extended with `resumeAvailable`, `resumeTitle`, `resumeDescription`, `resumeUrl`, `resumeLastUpdated`, `resumeFileSize`. All empty/false by default — no invented values.
- **New feature slice** `features/resume/` (components/, hooks/, index.ts).
- **ResumeSection**: when `resumeAvailable && resumeUrl.length > 0` renders a card with title, description, meta (last updated / file size), and **View** (opens in new tab) + **Download** (download attribute) buttons. When unavailable, the section renders nothing — no "coming soon" placeholder, no empty card.
- **Hero + Navbar resume links**: only render when `resumeAvailable` is true. No broken links.

### Sprint 06 — Certifications Section (Task 6.3)

- **Certifications data** (`features/certifications/data/certifications.ts`): new `certifications` array with typed entries (title, issuer, issue/expiry dates, skills, status, credential URL, highlight flag). Replaces the hard-coded certs inside the Journey timeline.
- **New feature slice** `features/certifications/` (components/, hooks/, index.ts).
- **CertificationsSection**: responsive grid (1/2/3 columns) of data-driven cards. Each card shows badge icon, title, issuer, dates, status badge (Active/Expired), skills, and a **Verify Credential** button (external link to the credential URL). Highlighted certs get a stronger ring. Empty state renders nothing.
- **Journey timeline**: certification entries removed; certifications now live in their own dedicated section with richer metadata.

### Sprint 06 — Journey Timeline (Task 6.2)

- **Journey data** (`features/journey/data/journey.ts`): refined entries (education, experience, milestones). Removed certification entries (moved to dedicated Certifications section).
- **New feature slice** `features/journey/` (components/, hooks/, index.ts).
- **JourneySection**: alternating desktop timeline (date left/right of card), tablet date beside connector, mobile date inside card. Cards render every field only when non-empty: date, category badge, status badge (Completed/Current/Planned), title, subtitle, description, technologies (badges), links (buttons with external icon). Reveal animation via `stagger(0.08)` from `framer-motion`.
- **Integration**: added to landing page between About and Certifications.

### Sprint 06 — About Section (Task 6.1)

- **Profile data** (`src/lib/profile.ts`): centralized profile with identity (name, role, tagline, location), about content (bio, summary, headline, philosophy, quote, experienceLevel, currentFocus, education), personality (interests, funFacts), and availability. All real values, no placeholders.
- **AboutSection**: heading, bio, summary, and a 2-column grid (desktop) of "Headline + Philosophy + Quote" + "Education + Experience + Current Focus + Interests + Fun Facts". Every field renders only when non-empty — the layout reflows automatically. Availability badge (green pill) appears at the top when set. No hard-coded content — 100% data-driven.

### Sprint 05 — Project Detail Experience (Task 5.3)

- **Project detail page** (`/projects/[slug]`): full project content — hero (cover image, title, status, timeline, difficulty, duration, tech stack, GitHub/demo links), long description, Problem / Solution / Architecture (with flow steps), Features, Engineering Decisions (collapsible cards), Challenges / Learnings, Gallery (lightbox), Related Projects (cards linking to siblings). All from CMS data.
- **Gallery**: lightbox with keyboard navigation (arrows, Escape), swipe support, caption area.
- **Engineering Decisions**: collapsible cards with title, context, decision, trade-offs — real engineering depth.
- **Related Projects**: auto-filtered from the same collection (excludes self, picks up to 3).
- **Performance**: server-rendered, no client JS except the gallery lightbox.

### Sprint 05 — Project Detail Page (Task 5.2)

- **Dynamic route** `/projects/[slug]` with `generateStaticParams` from the CMS. 404s for unknown slugs.
- **Project data layer** (`features/projects/data/projects.ts`): 6 real projects (Cloud CI/CD Pipeline, Kubernetes Observability Stack, Multi-Cloud IAM Automation, Serverless API Gateway, PostgreSQL Disaster Recovery, Homelab Kubernetes Cluster) — each with cover, gallery, tech stack, status, timeline, difficulty, duration, short/long description, problem, solution, architecture, flow, features, challenges, learnings, GitHub/demo links.
- **ProjectCard**: cover, title, short description, status badge, tech stack, links. Clicking navigates to detail page.

### Sprint 05 — Projects Grid (Task 5.1)

- **ProjectsSection**: responsive grid (1/2/3 columns) of `ProjectCard`s from the data layer.
- **Integration**: added to landing page after Hero.

### Sprint 04 — Infrastructure Playground

- **Interactive SVG diagram** of the deployment pipeline (Developer → GitHub → GitHub Actions → Docker Build → Container Registry → Kubernetes Cluster → FastAPI Backend → Supabase → Next.js Frontend → Users). Nodes are clickable with tooltips and hover effects. Serpentine (desktop) / vertical (mobile) layouts via CSS container queries — no JS reflow. Opening sequence runs once on scroll-into-view. Hover effects are pure CSS (no re-renders). Respects `prefers-reduced-motion`.

### Sprint 03 — Landing Experience

- **Navbar**: fixed, glass-morphism, logo + links, mobile drawer, scroll-aware shadow, theme toggle.
- **Hero**: headline, role, tagline, primary CTA (scroll to projects), secondary CTA (resume — gated by availability).
- **OpeningExperience**: black overlay → center glow → horizontal line → fade into hero → reveal nav. Runs once per session (or hard reload), skipped under reduced motion, no flash for returning visitors.
- **Theme system**: `next-themes` with class-based switching (`.dark`), CSS variables in `globals.css`, `ThemeProvider` in root layout, `ThemeToggle` in Navbar (lazy-mounted to avoid hydration mismatch).
- **Custom cursor**: dot + ring, fine-pointer only, reduced-motion aware, `data-cursor` opt-in for elements.

### Sprint 02 — Design System & Core UI Foundation

- **Design tokens** in `globals.css`: colors (semantic aliases), spacing, radii, shadows, typography tiers (`text-display`…`text-caption`), z-index scale (`z-base`…`z-skip-link`), durations/easings (`--duration-*`, `--ease-*`).
- **Typography**: Geist Sans / Geist Mono (next/font). Tiered scale with `font-semibold` headings, `text-muted-foreground` for secondary text.
- **shadcn/ui**: Button, Card, Badge, Input, Textarea, Dialog, Separator, Skeleton, Spinner, Tooltip, Sonner (toast) primitives.
- **Motion tokens**: `DURATION` / `EASE` in `lib/motion.ts` mirroring CSS; `fade`, `fadeInUp`, `scaleIn`, `stagger`, `reveal` variants.
- **Reduced motion**: global CSS collapse + `MotionConfig reducedMotion="user"` in layout.

### Sprint 01 — Engineering Foundation

- **Monorepo**: `frontend/` (Next.js 15), `backend/` (FastAPI), shared Docker/CI/docs.
- **Frontend scaffolded** with Next.js 15 (App Router), React 19, TypeScript.
- **Tooling configured**: ESLint, Prettier, Tailwind CSS v4, shadcn/ui, Framer Motion, Lucide.
- **Dark/light theme support** prepared (next-themes + CSS variables).
- **Scalable folder structure** (App Router, `components/ui`, `components/shared`, `features/`, `lib/`).
- **Backend scaffolded** with FastAPI and clean-architecture packages.
- **Health endpoint** `GET /api/health` returning `{"status":"healthy"}`, with tests.
- **Docker**: frontend and backend images + `docker-compose.yml` (`docker compose up`).
- **Environment template** (`.env.example`) — minimal, commented, no secrets.
- **GitHub Actions CI**: install → lint → type check → build on every push.
- **Documentation**: README, CHANGELOG, CONTRIBUTING, architecture notes.

## Current Sprint

### Sprint 10

- **10.1 Populate Portfolio Data** — the CMS is ready; populate real profile, projects, journey, certifications, resume, contact, footer, and SEO content via `/studio`.

Next: add Analytics and Resources, and grow Preview into a pixel-perfect public-site render. The CMS content store moved to Supabase in v2.3.0 and media uploads to Supabase Storage in v2.4.0 — no local filesystem persistence remains.

## Notes

- **Deployment (v2.2.0 — production ready):** set `NEXT_PUBLIC_SITE_URL` to the real production URL — metadata, OG, canonical, sitemap, and robots all derive from it. Host the frontend (any Next.js host) and backend (FastAPI, `docker compose up`), point DNS, and load real content — profile bio/summary/funFacts, journey entries, certifications, the resume asset + availability flag, and contact email/socials — via the Studio CMS (`/studio`). Set `STUDIO_ADMIN_SECRET` (the access passphrase) and `STUDIO_SESSION_SECRET` (session signing) to unlock Studio.
- **Not built (by design):** Analytics, Resources, and backend features. The Studio foundation, passphrase authentication (v2.0.0), and the Studio CMS with full editing + publish workflow (v2.1.0) are complete. v2.1.1 adds animation polish, accessibility hardening, code cleanup, and production hardening; v2.2.0 replaces Google OAuth with passphrase login; v2.3.0 moves the CMS store to Supabase; v2.4.0 moves media uploads to Supabase Storage.
- **Studio auth is fail-closed:** passphrase login requires `STUDIO_ADMIN_SECRET` (the access passphrase) and `STUDIO_SESSION_SECRET` (session signing); without them, authentication is refused. The passphrase is compared server-side with a timing-safe comparison — it is never stored and never sent to the client. All values are documented in the root `.env.example`.
- **Contact fields** in `src/lib/profile.ts` are intentionally empty — `email`, `github`, and `linkedin` await real values (fill them in the Studio CMS → Contact); `location` and `availability` are populated. The Contact section disappears entirely while no contact data exists — no placeholder. The "Let's Connect" button appears only once an email is set. `availability` is the single source of truth shared by Hero, About, and Contact.
- **Resume data** in `src/lib/profile.ts` is intentionally unavailable — `resumeAvailable` is `false` and the display fields are empty until a real `frontend/public/resume.pdf` is added (along with its details, via the Studio CMS → Resume). Until then the Resume section disappears entirely — no placeholder, and the Hero / Navbar resume links are hidden.
- `bio`, `summary`, `experienceLevel`, `currentFocus`, `education`, `headline`, `philosophy`, `quote`, `interests`, `funFacts` in `src/lib/profile.ts` are intentionally empty — the About section disappears entirely while these are empty. Real values will be supplied by the owner (or the future CMS). The About section renders only what the CMS provides — no filler.

### v2.1.1 Release Notes

- **Animation polish:** Theme transition now uses a dedicated `--duration-theme: 450ms` token and animates only paint properties (`color`, `background-color`, `border-color`, `box-shadow`, `fill`, `stroke`). Theme toggle icon animation updated to 450ms matching the spec. Opening experience (~2.35s) runs once per session, skipped under `prefers-reduced-motion`. Infrastructure Playground opening sequence runs once on scroll-into-view; infinite hover animations (ring pulse, box expand, glow pulse, pod pulse, request travel, db read/write) are correctly gated to `:hover`/`:focus-visible` only.
- **Accessibility hardening:** Skip link target (`#content`) verified on all pages. Heading hierarchy (`h1` → `h2` → `h3`) correct across all sections. Focus-visible states on all interactive elements (20+ instances). ARIA labels on 49+ buttons/links. `prefers-reduced-motion` respected globally via CSS collapse + Framer Motion `reducedMotion="user"` in root layout. Semantic HTML5 structure maintained.
- **SEO validation:** `generateMetadata()` builds title, description, keywords, OG, Twitter, canonical, robots, JSON-LD (`Person` + `WebSite`) from CMS content with profile fallbacks. Sitemap includes home + all published project slugs. Robots disallows `/studio`. No broken metadata.
- **Security hardening:** Media upload restricted to PNG/JPG/WEBP/SVG/PDF ≤10MB, stored as UUID+ext, served via safe route handler with `SAFE_NAME` regex validation. Delete endpoint validates same regex. All Studio routes guarded by HMAC-SHA256 signed httpOnly cookie with `secure`, `sameSite: lax`, 30-day TTL. Passphrase login uses a timing-safe HMAC comparison with per-IP rate limiting (10 failures / 15 min, in-process) and a constant response delay; failures return only a generic "Invalid passphrase." No public exposure of Studio APIs.
- **Code cleanup:** Removed unused `sonner.tsx` (toast library not used). Fixed unused `EntitySchema` import in `collection-editor.tsx`. No `console.log`/`debug`/`TODO`/`FIXME` in source. No hydration warnings. No layout shifts. Client/server boundaries respected — only components needing interactivity are client components.
- **Performance:** Single dynamic import (InfrastructurePlayground) keeps hero fast. All shadcn/ui components in use (no dead code). CSS transitions use design tokens. Motion variants reuse `DURATION`/`EASE` constants shared with CSS. No infinite animations outside the infrastructure playground hover states.