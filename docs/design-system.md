# PortfolioOS — Design System

The reusable foundation every future page builds on. Sprint 02 delivers the
system; **no portfolio sections use it yet** (Hero, Navbar, Projects, … are
later sprints).

Design direction: premium, calm, clean, minimal, modern — inspired by the craft
of Apple, Linear, Vercel and GitHub, without copying any of them.

---

## 1. Design Tokens

All tokens live in `frontend/src/app/globals.css`. **Never hard-code values in
components** — always consume a token or a Tailwind utility generated from one.

### Colors

Semantic, theme-aware tokens defined as CSS variables for `:root` (light) and
`.dark`, then mapped into Tailwind via `@theme inline`:

| Token | Use |
| --- | --- |
| `--background` / `--foreground` | Page surface / text |
| `--card` / `--popover` | Elevated surfaces |
| `--primary` / `--primary-foreground` | Primary actions |
| `--secondary` / `--muted` / `--accent` | Low-emphasis surfaces |
| `--destructive` | Errors and destructive actions |
| `--success` | Positive/available states (badges, indicators) |
| `--border` / `--input` / `--ring` | Borders, inputs, focus rings |
| `--chart-*` | Data-viz series |

Usage: `bg-background`, `text-muted-foreground`, `border-border`,
`bg-primary text-primary-foreground`, `focus-visible:ring-ring`.

### Spacing

Tailwind's default scale, one base unit of `0.25rem` (4px):
`px-1` (4) · `px-2` (8) · `px-3` (12) · `px-4` (16) · `px-6` (24) · `px-8` (32) ·
`px-12` (48) · `px-16` (64) · `px-20` (80). Layout rhythm uses the Section
spacing tokens below.

### Radius

`--radius: 0.625rem` is the base; utilities derive from it:
`rounded-sm/md/lg/xl/2xl/3xl/4xl`. Cards and dialogs use `rounded-lg`.

### Shadows

Theme-aware elevation (stronger in dark mode):

| Utility | Purpose |
| --- | --- |
| `shadow-sm` | Subtle elevation (inputs, badges) |
| `shadow` / `shadow-md` | Raised elements (cards) |
| `shadow-lg` | Floating panels |
| `shadow-xl` | Modals, toasts |

### Motion (CSS)

| Token | Value |
| --- | --- |
| `--duration-fast / base / slow / slower` | 120 / 200 / 320 / 500 ms |
| `--ease-out-quart` | `cubic-bezier(0.25, 1, 0.5, 1)` |
| `--ease-out-expo` | `cubic-bezier(0.16, 1, 0.3, 1)` — default entrance |
| `--ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` |

Animations: `animate-fade-in`, `animate-fade-out`, `animate-slide-up`,
`animate-slide-down`, `animate-scale-in`, `animate-scale-out`,
`animate-spin-slow`, `animate-shimmer`.

### Z-index

Semantic scale: `z-base` (0) → `z-elevated` (10) → `z-header` (20) →
`z-dropdown` (30) → `z-overlay` (40) → `z-modal` (50) → `z-toast` (60) →
`z-cursor` (90) → `z-skip-link` (100). Use the semantic tokens, not raw
numbers. The opening overlay sits at `z-overlay`; the fixed header at
`z-header` reveals beneath it during the opening cross-fade.

### Container widths

`max-w-page` (72rem / 1152px) is the primary content width. The standard
container scale (`max-w-sm … max-w-2xl`) also applies.

### Breakpoints (mobile-first)

| Prefix | Min width |
| --- | --- |
| (none) | 0 |
| `sm` | 640px |
| `md` | 768px |
| `lg` | 1024px |
| `xl` | 1280px |
| `2xl` | 1536px |

### Typography

Geist (Sans + Mono) via `next/font`. The scale generates utilities:

| Tier | Utility | Size | Line height | Tracking |
| --- | --- | --- | --- | --- |
| Display | `text-display` | 3rem | 1.05 | -0.02em |
| Heading | `text-heading` | 2rem | 1.1 | -0.015em |
| Title | `text-title` | 1.25rem | 1.35 | — |
| Body | `text-body` | 1rem | 1.6 | — |
| Caption | `text-caption` | 0.875rem | 1.5 | — |
| Muted | `text-caption text-muted-foreground` | 0.875rem | 1.5 | — |

Semantic weights: Display/Heading/Title use `font-semibold` (600), Body uses
`font-normal` (400), Caption/Muted `font-normal`. Fonts are wired via
`--font-sans` / `--font-mono` / `--font-heading`.

---

## 2. Theme System

- **Provider:** `next-themes` wrapped in `src/components/shared/theme-provider.tsx`,
  mounted in `src/app/layout.tsx` with `attribute="class"`,
  `defaultTheme="system"`, `enableSystem`.
- **Persistence:** next-themes stores the choice in `localStorage` and applies
  the `.dark` class to `<html>`.
- **Detection:** `enableSystem` resolves the OS preference.
- **Tokens:** `.dark` variable block in `globals.css`.
- **Future switcher:** `src/lib/theme.ts` exports `themeOptions`
  (`light`/`dark`/`system`) with Lucide `Sun`/`Moon`/`Monitor` icons and
  `DEFAULT_THEME`. The toggle UI is **not** built in Sprint 02.

## 3. Cursor System

`src/components/shared/cursor.tsx`, mounted once in the root layout.

- Rounded **dot + ring**; the ring eases toward the dot (spring physics).
- States: **default**, **hover** (links/buttons), **clickable** (`data-cursor="clickable"`),
  **text** (inputs/textarea/contenteditable), **loading** (`data-cursor="loading"`).
- Opt into a state with `data-cursor="hover|clickable|text|loading|none"`.
- Auto-disabled on **touch** devices (`(pointer: fine)` check) and when
  **reduced motion** is requested — the native cursor is used instead.
- Hides the native cursor only after mounting successfully (via the
  `cursor-custom` class on `<html>`).

## 4. Motion Utilities

`src/lib/motion.ts` exports shared curves (`EASE`), durations (`DURATION`) and
framer-motion `Variants`: `fade`, `fadeInUp`, `scaleIn`, `stagger()`,
`reveal`, `pageTransition`. These mirror the CSS tokens so JS and CSS motion
stay in sync. **Nothing animates on pages yet.**

## 5. Component Guidelines

- **Primitives** live in `src/components/ui` (shadcn-generated plus custom
  `Spinner`). Add new ones with `npx shadcn add <name>`.
- **Compositions** live in `src/components/shared` — layout (`Container`,
  `Section`, `PageWrapper`), theme (`ThemeProvider`), cursor, and state
  components (`EmptyState`, `LoadingState`, `ErrorState`).
- **State components** cover the three async states: `LoadingState`
  (`role="status"`), `EmptyState`, `ErrorState` (`role="alert"` + optional
  retry).
- **Accessibility:** semantic HTML, ARIA roles on state components, focus-visible
  rings on everything, and a global reduced-motion collapse. Use `sr-only` for
  labels that only assistive tech should read.

## 6. Folder Structure

```txt
frontend/src/
  app/                   routes, layout, metadata
  components/
    ui/                  shadcn primitives + Spinner
    shared/              Container, Section, PageWrapper, ThemeProvider,
                         Cursor, SkipLink, EmptyState, LoadingState, ErrorState
  features/
    landing/             landing experience slice
      components/        opening-experience, navbar, hero, theme-toggle,
                         infrastructure-playground
      hooks/             use-active-section
      lib/               opening (opening/nav-reveal coordinator)
  lib/                   utils, site config, motion, theme, profile
```

## 7. Landing Experience (Sprint 03)

A feature slice at `src/features/landing/`, composed in `src/app/page.tsx`:

- **Profile data** lives only in `src/lib/profile.ts` — **no personal
  information is hardcoded in UI components.** A future Studio CMS replaces
  this module.
- **Opening experience** runs on the first visit of a session (sessionStorage
  gate) or a hard reload. Sequence: background → soft center glow
  (`animate-glow`) → thin line (`animate-line-in`) → cross-fade into the hero,
  while the navigation reveals at `z-header` beneath the `z-overlay` screen.
  Skipped entirely under reduced motion; never loops.
- **Navigation** is fixed at `z-header`: transparent over the hero, then
  `bg-background/80 backdrop-blur-md` after 8px of scroll. Active section
  underline is driven by `useActiveSection` (IntersectionObserver over a
  viewport middle band). Anchored links scroll smoothly (`scroll-behavior:
  smooth` + `scroll-padding-top: 5rem` on `html`). Mobile collapses to an
  animated drawer (backdrop + sheet), with `Escape` to close and body scroll
  locked while open.
- **Theme toggle** flips the resolved theme through `next-themes` and animates
  the Sun/Moon swap. It mounts after hydration to avoid a theme flash.
- **Hero** uses a 12-column grid: 7 cols text / 5 cols playground (55/45),
  stacking vertically on mobile. CTAs reuse the `Button` primitive via Base
  UI's `render` prop (`<Button render={<a href="…" />}>`).
- **Infrastructure Playground** is a lazy-loaded, aspect-ratio placeholder
  (reserved for Sprint 04); lazy chunk via `next/dynamic` with a `Skeleton`
  fallback. Non-critical components are the ones lazy-loaded.
- **Reduced motion** is honored globally via `MotionConfig reducedMotion="user"`
  in the root layout, in addition to the CSS collapse.

## 8. Infrastructure Playground (Sprint 04)

An interactive, data-driven SVG diagram at
`features/landing/components/infrastructure-diagram.tsx`.

- **Data layer** (`features/landing/data/infrastructure-data.ts`): every
  node's title, purpose, technology, icon, hover effect, and CMS visibility
  are defined here. Components contain zero node information — a future
  Studio CMS replaces this file with a database source.
- **Layout engine** (`features/landing/lib/infrastructure-layout.ts`): pure
  functions that compute node positions and edge routes for two responsive
  modes (wide serpentine / narrow vertical) without any React. Container
  width drives the mode via a CSS `@container` query with a400px breakpoint;
  the two SVG views are both rendered and toggled with `display:none/block`.
- **Opening sequence**: runs once when the diagram scrolls into view
  (IntersectionObserver, `once: true`). Nodes reveal sequentially with
  `animation-delay: calc(index × 720ms)` and edge connectors draw via
  `stroke-dasharray`/`stroke-dashoffset` with `pathLength=1`. Flow dots
  travel along edges using `offset-path`. All timing is CSS-driven; the
  component only toggles a single `is-opening` class on the container.
- **Hover effects** (10 unique): each node declares a `NodeEffect` string
  (`hover-glow`, `commit-pulse`, `pipeline-lights`, `container-expand`,
  `glow-pulse`, `pods-pulse`, `api-request`, `db-readwrite`,
  `component-highlight`, `soft-glow`). The `NodeEffectLayer` renders the
  SVG shapes; `.infra-node:hover` and `.infra-node:focus-visible` trigger
  the CSS animations. Zero JS re-renders on hover — the animation
  declarations are resolved at paint time.
- **Tooltips**: reuse the existing `Tooltip` component via Base UI's
  `render` prop, passing an SVG `<g>` as the trigger. The tooltip content
  (`infrastructure-node-tooltip.tsx`) shows title, purpose, technology, and
  why the node exists. Tooltips are portaled to the body.
- **Accessibility**: each node is `tabIndex={0}` with `aria-label`,
  `role="group"`, and `data-cursor="hover"` for the custom cursor.
  `prefers-reduced-motion` skips the opening and freezes hover animations
  via the existing global collapse. A visible arrow marker
  (`<marker>`) communicates flow direction.
