# PortfolioOS · Frontend

Next.js 15 (App Router) application with React 19, TypeScript, Tailwind CSS v4,
shadcn/ui, Framer Motion, and Lucide.

## Scripts

```bash
npm run dev           # development server (http://localhost:3000)
npm run lint          # ESLint
npm run typecheck     # tsc --noEmit
npm run build         # production build (standalone output)
npm run start         # serve a production build
npm run format        # Prettier (write)
npm run format:check  # Prettier (check)
```

## Structure

```txt
src/
  app/           App Router routes, layout, metadata, static routes
  components/
    ui/          primitives (shadcn + Spinner, added via `npx shadcn add ...`)
    shared/      layout (Container/Section/PageWrapper), cursor, theme, states
  features/      feature slices — one folder per portfolio section (Sprint 03+)
  lib/           utils, site config, motion variants, theme options
```

Design tokens, typography scale, and component guidelines live in
[`../docs/design-system.md`](../docs/design-system.md). See
[`../README.md`](../README.md) for the full project setup and
[`../docs/architecture.md`](../docs/architecture.md) for architecture notes.
