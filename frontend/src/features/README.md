# Features — feature-slice convention

This directory holds the portfolio feature slices. It exists in Sprint 01 to
establish the architecture; **no features are implemented yet** (Hero, Navbar,
Projects, Studio, Resources, etc. are scheduled for later sprints).

Each feature is an independent slice:

```txt
src/features/<feature>/
  components/   feature-specific components
  hooks/        feature-specific hooks
  data/         API calls and data fetching for this slice
  index.ts      public entrypoint — the only allowed external import
```

Rules:

- Features consume primitives from `src/components/ui` and helpers from
  `src/lib`. They never import each other's internals.
- Cross-feature reusable UI goes in `src/components/shared`.
- A feature's `index.ts` is its public API; everything else is private.
