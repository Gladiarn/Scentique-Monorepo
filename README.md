<div align="center">

<img src="frontend/public/brand/scentique-lockup.svg" alt="Scentique" width="220" />

### Small-batch perfumes, made with rare ingredients.

A full-stack e-commerce storefront and admin CRM for an indie fragrance house — built to demonstrate
production-grade engineering, not just a UI mockup.

[![CI](https://github.com/Gladiarn/Scentique-Monorepo/actions/workflows/ci.yml/badge.svg)](https://github.com/Gladiarn/Scentique-Monorepo/actions/workflows/ci.yml)
![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38BDF8?logo=tailwindcss&logoColor=white)
![pnpm](https://img.shields.io/badge/pnpm-workspace-F69220?logo=pnpm&logoColor=white)
[![License: MIT](https://img.shields.io/badge/license-MIT-c9a46a)](LICENSE)

[Report a bug](../../issues) · [Request a feature](../../issues)

<br />

<img src="docs/screenshots/landing-hero.jpg" alt="Scentique landing page hero" width="100%" />

</div>

<br />

## About Scentique

Scentique is an independent perfume house built on one idea: make fewer scents than you could, and make
them properly. Every fragrance starts with a single rare raw material — a resin, a root, a bark — that the
house wants to show off, and the rest of the blend is built around it until nothing is left to take away.

Batches are small on purpose: blended by hand in twelve-litre lots, rested for six weeks until the blend
settles, then bottled and checked individually. The catalogue is organised into four scent families —
**Woody**, **Floral**, **Citrus**, and **Oud** — rather than dozens of near-identical SKUs, so every bottle
earns its place on the shelf.

This repository is the software behind that idea: a storefront for browsing, comparing notes, and
checking out, plus an admin console for running the business day to day.

> **Note on this project:** Scentique is a concept brand created to give this build a real product to
> serve — a believable catalogue, a customer journey with actual stakes, and an admin surface with real
> operational needs. The engineering (architecture, testing, deployment) is real; the brand, copy, and
> catalogue are original creative work made for this project.

## Who it's for

- **Fragrance enthusiasts** who read notes pyramids, compare concentrations, and want the sourcing story
  behind what they're buying.
- **Gift buyers and newcomers** who don't know where to start — served by scent-family browsing and a
  short quiz that narrows the catalogue to two or three suggestions.
- **The Scentique team**, who need to run orders, watch stock and revenue, and add new scents without
  fighting the tools.

## Features

**Storefront**
- Landing, shop, and product pages with a real repository layer (no data hardcoded into components)
- Browse by scent family, filter by gender and price, read full notes pyramids (top / heart / base)
- "Find your scent" quiz — a few short questions, two or three recommendations back
- Cart, checkout, and order history
- Loading, empty, and error states are real states, not happy-path-only demos

**Admin CRM** *(in progress — see [Roadmap](#roadmap))*
- Revenue, top products, and low-stock dashboards
- Order pipeline: pending → paid → packed → shipped → delivered
- Product CRUD with variants, pricing, and stock

**Engineering**
- Repository pattern: the frontend runs entirely on mock data today; swapping to the live API is a
  one-file change
- Shared, versioned types and Zod schemas between frontend and backend
- Unit, component, and end-to-end test coverage
- CI on every pull request: lint, typecheck, test, build

## Tech stack

| Layer | Stack |
|---|---|
| Monorepo | pnpm workspaces + Turborepo |
| Frontend | Next.js 16 (App Router), TypeScript, Tailwind CSS 4, Zustand, React Hook Form, Zod |
| Backend | Express, TypeScript, Prisma, PostgreSQL *(in progress)* |
| Payments / Auth | Stripe (test mode), JWT *(planned)* |
| Testing | Vitest, Testing Library, Playwright |
| Tooling | ESLint, TypeScript strict mode, GitHub Actions |
| Deployment | Vercel (frontend and backend), pooled Postgres (Neon/Supabase) |

## Architecture

```
Scentique-Monorepo/
├── frontend/          Next.js storefront (App Router)
│   └── src/
│       ├── app/           routes, layouts, error/not-found boundaries
│       ├── features/      page-level feature composition (landing, quiz, ...)
│       ├── components/    shared UI (brand, layout, ui primitives)
│       ├── data/           repositories + mock/API implementations
│       └── lib/            formatting, tokens, small utilities
├── backend/           Express API (scaffolded, implementation starts after M1)
├── packages/
│   ├── shared/        types and Zod schemas shared by both apps
│   └── config/         shared tsconfig / eslint / prettier
└── docs/               specs, plans, design log
```

The frontend never imports mock data directly into a component. Every screen reads through a
**repository interface** (`ProductRepository`, `CollectionRepository`, ...); a mock implementation backs
it today, and an API implementation backs it once the Express service is live — the swap touches one file.

## Getting started

**Requirements:** Node.js ≥ 22, pnpm.

```bash
# install workspace dependencies
pnpm install

# run the storefront in development
pnpm dev

# type-check, lint, and test every workspace
pnpm typecheck
pnpm lint
pnpm test

# production build
pnpm build
```

The dev server runs at `http://localhost:3000`. The frontend ships fully functional on mock data — no
backend or database setup is required to run it locally.

## Testing

```bash
pnpm test          # unit + component tests (Vitest, Testing Library)
pnpm --filter @scentique/frontend exec playwright test   # end-to-end
```

Every pull request into `staging` or `main` runs lint, typecheck, unit tests, and a production build via
GitHub Actions before it can merge.

## Roadmap

| Milestone | Scope | Status |
|---|---|---|
| M0 — Repo foundation | Monorepo, tooling, CI, branch strategy | ✅ Done |
| M1 — Frontend | All storefront screens on mock data | ✅ Done |
| M2 — Backend | Express API, Prisma schema, auth, orders, Stripe test mode | 🔧 In progress |
| M3 — Integration | Frontend bound to the live API, e2e against a real backend | ⏳ Planned |
| M4 — Launch prep | Real photography, SEO, analytics, monitoring | ⏳ Planned |

## License

Licensed under the [MIT License](LICENSE) — © 2026 Ianne Carl Bulilan. Free to use, modify, and build on,
with attribution.

## Contact

**Ianne Carl Bulilan** ([Gladiarn](https://github.com/Gladiarn)) — Full-Stack Developer

[![Email](https://img.shields.io/badge/Email-bulilaniannecarl%40gmail.com-c9a46a)](mailto:bulilaniannecarl@gmail.com)
[![Portfolio](https://img.shields.io/badge/Portfolio-ianne--portfolio.vercel.app-black)](https://ianne-portfolio.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Gladiarn-181717?logo=github&logoColor=white)](https://github.com/Gladiarn)

📞 +63 918 317 2574
