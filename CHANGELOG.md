# Changelog

All notable changes to PortfolioOS are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Changed

- **Authentication:** replaced Google OAuth with passphrase login. Studio now
  authenticates the single administrator against `STUDIO_ADMIN_SECRET` with a
  server-side, timing-safe HMAC comparison, issuing the same signed httpOnly
  session cookie (`STUDIO_SESSION_SECRET`). Login is a minimal passphrase form
  (`/studio/login` → `/api/auth/login`); failures return the generic
  "Invalid passphrase." with per-IP rate limiting (10 attempts / 15 min) and a
  constant response delay. The Google client ID / client secret / email
  allowlist environment variables and the OAuth routes are removed.

## [0.0.8] — 2026-07-31

### Added

- **About Me section:** data-driven `AboutSection` on the landing page,
  immediately after the Projects grid. Heading, short introduction, meta chips
  (location, availability, experience level), Professional Summary, Current
  Focus, Education, Interests, and Fun Facts cards — every field renders only
  when non-empty.
- **New feature slice:** `features/about/` (components/, hooks/, index.ts)
  following the existing feature-slice architecture, with a `useProfile()` hook
  as the future CMS seam.
- **Profile data layer:** `src/lib/profile.ts` extended with `bio`, `summary`,
  `experienceLevel`, `currentFocus`, `education`, `interests`, and `funFacts`
  (all intentionally empty until the owner supplies values). Personal data
  stays centralized — components hardcode labels only.

### Changed

- Landing page now composes `Hero → ProjectsSection → AboutSection`; the
  navbar's active-section tracking (`#about`) picks up the new section.

### Docs

- `PROJECT_STATE.md` bumped to v0.0.8 ("About Section Complete" / milestone
  "Public Portfolio Pages").

## [0.0.7] — 2026-07-31

### Added

- **Project gallery:** reusable `Gallery` component — a responsive `next/image`
  grid opening the design-system Dialog as a lightbox with wrap-around
  Prev/Next, arrow-key + Home/End navigation, and Escape-to-close. Renders
  nothing until a project's `gallery` array is populated.
- **Architecture section:** per-project `architectureTitle` and ordered,
  text-only `architectureFlow` rendered as a numbered list (no diagrams).
- **Engineering Decisions:** expandable Cards per project
  (`engineeringDecisions[]` — title, reason, tradeoff, lessons) using the
  native disclosure pattern.
- **Documentation links:** Documentation, Architecture Document, and API
  Reference buttons — each rendered only when its URL exists (`docs`
  restructured to `{ documentation, architecture, apiReference }`).
- **Related Projects:** up to three visible projects sharing the most
  technology with the current one, reusing `ProjectCard`.
- **Project meta fields:** data-driven `difficulty` and `estimatedDuration`,
  hidden in the detail hero until populated.
- **Card navigation:** `ProjectCard` links to `/projects/[slug]` via a
  stretched-link overlay (action buttons stay clickable above it).

### Changed

- Consolidated the standalone Documentation button from the detail Links
  section into the new Documentation section.

### Docs

- `PROJECT_STATE.md` bumped to v0.0.7 ("Projects Module Complete" /
  milestone "Public Portfolio Pages").

## [0.0.6] — 2026-07-31

### Added

- **Project detail page:** `/projects/[slug]` — fully data-driven, statically
  generated via `generateStaticParams`. Returns `notFound()` for missing or
  non-public slugs. Per-project `<title>` and `<meta description>` via
  `generateMetadata`.
- **Detail data layer:** `projects.ts` extended with `longDescription`,
  `problem`, `solution`, `features`, `architecture`, `challenges`,
  `learnings`, `timeline`, `docs`, and `gallery` fields — CMS-ready.
- **Detail page sections:** back button, title, status badge, short
  description, hero cover, Overview, Problem, Solution, Features, Technology
  Stack, Architecture, Challenges, Key Learnings, External Links.
- **Scroll reveals:** each content section uses `fadeInUp` + `whileInView`
  from the Sprint 02 motion utilities for subtle entrance animation.
- **External links:** GitHub, Live Demo, and Documentation — only rendered
  when the URL exists; no disabled states.
- **Docs:** `PROJECT_STATE.md` bumped to v0.0.6 ("Project Detail Complete").

## [0.0.5] — 2026-07-31

### Added

- **Projects grid:** `ProjectsSection` — section title, short description,
  and a responsive grid (1/2/2/3 columns) driven entirely by project data.
- **Data layer:** `features/projects/data/projects.ts` — CMS-ready project
  definitions (id, title, shortDescription, techStack, status, coverImage,
  featured, github, demo, visibility, slug) with a public-visibility filter.
- **ProjectCard:** reusable card with cover, description, technology chips,
  status badge, and GitHub / Live Demo buttons — empty links hide their
  button (no disabled states).
- **Hover behavior:** cards lift, ring-highlight, and zoom their cover
  subtly; reduced-motion aware.
- **Reveal animation:** cards stagger in on scroll using the Sprint 02
  motion utilities.
- **Covers:** theme-agnostic SVG assets in `public/projects/`, lazy-loaded
  via `next/image`.
- **Docs:** `PROJECT_STATE.md` bumped to v0.0.5 ("Projects Grid Complete").

## [0.0.4] — 2026-07-31

### Added

- **Infrastructure Playground**: interactive SVG diagram of the deployment
  pipeline with 10 data-driven nodes, opening sequence, 10 distinct hover
  effects, and a responsive two-mode layout.
- **Data layer**: `data/infrastructure-data.ts` — CMS-ready node definitions
  (title, purpose, technology, why, icon, effect, visibility).
- **Layout engine**: `lib/infrastructure-layout.ts` — pure geometry for wide
  (serpentine) and narrow (stacked) modes, direction-aware edge routing.
- **Opening sequence**: IntersectionObserver-triggered, once-only, reduced-motion
  aware; CSS-staggered node reveal + edge draw-in + flow dots.
- **Hover effects**: 10 CSS-driven effects keyed off `.infra-node:hover` and
  `:focus-visible` — zero JS re-renders.
- **Tooltip reuse**: nodes use the existing Tooltip component via Base UI's
  `render` prop with an SVG `<g>` trigger.
- **Responsive toggle**: CSS `@container` query at the diagram container.
- **Skip link fix**: `sr-only` class now correctly hidden by default.

## [0.0.3] — 2026-07-31

## [0.0.3] — 2026-07-31

### Added

- **Profile data:** centralized `src/lib/profile.ts` (name, role, tagline,
  availability, location, resume URL) — future Studio CMS will replace it.
- **Landing feature slice:** `src/features/landing/` with opening experience,
  navigation, hero, and Infrastructure Playground placeholder.
- **Opening experience:** first-visit overlay (glow → line → fade) that
  reveals the hero and navigation; reduced-motion aware, never loops.
- **Navigation:** transparent→blur on scroll, active-section underline, smooth
  scrolling, animated mobile drawer.
- **Theme toggle:** Sun/Moon interaction built on the Sprint 02 theme system
  with an animated icon swap.
- **Hero:** 55/45 layout, profile-driven, reusing the design-system Button.
- **Infrastructure Playground:** responsive static placeholder (reserved for
  Sprint 04), lazy-loaded as its own chunk.
- **Tokens:** `--color-success`, `--z-header`; smooth scroll and
  `scroll-padding-top` for anchored navigation.
- **Accessibility:** skip link, global reduced-motion via `MotionConfig`.

## [0.0.2] — 2026-07-31

### Added

- **Design system:** centralized tokens (colors, spacing, radius, shadows,
  motion, z-index, containers, breakpoints, typography) in `globals.css`.
- **Theme infrastructure:** dark/light/system with persistence + OS detection;
  Sun/Moon/System icon set ready for a future switcher.
- **Typography:** Geist scale — display, heading, title, body, caption, muted.
- **Global layout:** `Container`, `Section`, `PageWrapper`.
- **UI primitives:** Spinner; state compositions `EmptyState`, `LoadingState`,
  `ErrorState`.
- **Custom cursor:** rounded dot + ring (default/hover/clickable/text/loading),
  touch-aware and reduced-motion aware.
- **Motion utilities:** fade, slide, scale, stagger, reveal, page transition.
- **Accessibility:** focus-visible rings, reduced-motion collapse, ARIA roles.
- **Docs:** `docs/design-system.md`.

## [0.0.1] — 2026-07-31

### Added

- **Frontend:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS v4,
  shadcn/ui (base library, neutral theme), Framer Motion, Lucide React.
- **Theme:** dark/light support via next-themes and CSS variables.
- **Backend:** FastAPI with clean-architecture packages and a health endpoint
  `GET /api/health` returning `{"status":"healthy"}`.
- **Docker:** frontend and backend images, `docker-compose.yml`.
- **CI:** GitHub Actions pipeline (lint, type check, tests, build).
- **Docs:** README, architecture notes, contribution guide, project state.

_Compare links are added once the repository is published._
