# Scentique Full-Stack Roadmap

> **For agentic workers:** This is the top-level roadmap. Each phase below gets its own detailed, task-level plan (superpowers:writing-plans) immediately before it is executed. Execute those with superpowers:subagent-driven-development or superpowers:executing-plans.

**Goal:** Ship Scentique, a perfume storefront plus admin CRM, as a monorepo: frontend on mock data first, then the Express backend and database, then integration.

**Architecture:** pnpm + Turborepo monorepo. `frontend/` (Next.js) talks to data only through repository interfaces. `backend/` (Express + Prisma + Postgres) implements the same contract using types and Zod schemas from `packages/shared`.

**Tech Stack:** Next.js (App Router), TypeScript, Tailwind, Zustand, React Hook Form, Zod, Vitest, Playwright, Express, Prisma, Postgres, Stripe, JWT.

**Spec:** `docs/superpowers/specs/2026-09-25-scentique-design.md`

## Global Constraints

- Brand name lives only in `frontend/src/config/site.ts`.
- Display font is never Inter, Roboto or Arial (also avoid Cormorant, Playfair, Fraunces, Newsreader).
- No backend-originated data hardcoded in components; everything flows through repositories.
- Money is integer cents everywhere.
- Types crossing the network are defined once in `packages/shared`.
- Placeholder images until the user supplies photography.
- Work on `staging`; use short-lived feature branches.

## Review Focus

- Empty cart reaching checkout redirects or explains, never renders a blank form.
- Filters returning zero products show an empty state with a way to clear filters.
- Selecting an out-of-stock variant disables add to cart and says why.
- Quiz answers that match nothing still return a sensible recommendation.
- Refreshing the page keeps the cart; a schema-version mismatch resets it cleanly.
- Long product names and 200-item lists do not break layouts.
- Prices are never taken from the client at order time (backend phase).

---

## Status (updated 2026-09-26)

| Milestone | State |
|---|---|
| M0 Repo foundation | Done: pnpm and Turborepo workspace, `packages/shared`, `packages/config`, `frontend/`, empty `backend/`, CI workflow (not yet run on GitHub). Work is on `feat/landing-header`; only the first docs commit is on GitHub. |
| M1 Frontend | In progress. Phases 0 to 2 done. Phase 3 (landing page) built as a first pass; a revision round is next, then the landing page becomes the design reference for Phases 4 to 9. See the frontend plan's Status section. |
| M2 Backend | Not started (starts after the frontend is accepted). |
| M3, M4 | Not started. |

**API contract the frontend has defined so far** (input for the M2 plan). The frontend reads only through these repository methods; `ApiProductRepository`, `ApiCollectionRepository` and `ApiTestimonialRepository` are stubs that must implement them.

| Repository method | Meaning | Suggested endpoint |
|---|---|---|
| `products.findAll(filters?)` | Catalog; filters: family, gender, max price | `GET /products` |
| `products.findBySlug(slug)` | One product, or null | `GET /products/:slug` |
| `products.findFeatured()` | Products flagged featured | `GET /products?featured=true` |
| `products.findHeroFeatured()` | The single item featured in the landing hero, or null; set by an admin | `GET /products/hero-featured` |
| `products.findBestSellers(limit)` | Top sellers, best first, ranked from real sales (the mock uses a fixed list) | `GET /products/best-sellers?limit=4` |
| `collections.findAll()` | The four scent-family collections with their photograph | `GET /collections` |
| `testimonials.findAll()` | Customer reviews | `GET /testimonials` |

Data the API must return per product (see `packages/shared`): slug, name, tagline, description, family, gender, notes (top, heart, base), variants (size, concentration, price in cents, stock), and media entries `{ src, alt, role: "hero" | "photo", objectPosition, objectPositionDesktop }`. Admin needs a way to set the hero-featured item and upload several photos per product (the second photo is used by the hero card). Money is integer cents.

Still to define when their pages are built: cart and orders, customers and addresses, admin metrics (revenue, top products, low stock), order status transitions.

---

## Milestones

| # | Milestone | Output | Depends on |
|---|---|---|---|
| M0 | Repo foundation | Monorepo scaffold, tooling, CI, `staging` branch | none |
| M1 | Frontend (mock data) | All 9 screens, design system, tests | M0 |
| M2 | Backend | Express API, Prisma schema, auth, orders, Stripe test mode | M0, shared types from M1 |
| M3 | Integration | Frontend bound to API, e2e against real backend | M1, M2 |
| M4 | Launch prep | Real photography and logo, SEO, analytics, deploy, monitoring | M3 |

M2 may overlap the tail of M1 once the shared types are stable, but you have chosen frontend first, so M2 starts after M1 is accepted.

## M0 — Repo foundation
- Root `package.json`, `pnpm-workspace.yaml`, `turbo.json`, `.gitignore` (done).
- `packages/config` (tsconfig, eslint, prettier) and `packages/shared` (empty exports).
- GitHub Actions: install, lint, typecheck, test, build on pull requests to `staging` and `main`.
- Branch rules: `staging` for integration, `main` for releases.

## M1 — Frontend
Detailed in `docs/superpowers/plans/2026-09-25-frontend-plan.md`.

## M2 — Backend (outline; detailed plan written after M1)
1. Express scaffold: TypeScript, `src/{modules,middleware,config,lib}`, env validation, logger, error handler, health route.
2. Database: Prisma schema from the shared domain model, migrations, seed script that mirrors the frontend fixtures.
3. Modules, each with router, controller, service, repository, tests:
   - `catalog`: list, filter, sort, get by slug.
   - `auth`: register, login, refresh, roles.
   - `cart` (optional server cart) and `orders`: create, list, status transitions.
   - `customers`: profile and addresses.
   - `admin`: revenue, top products, low stock, product CRUD, order status updates.
4. Payments: Stripe Payment Intents (test mode), webhook for paid and failed.
5. Cross-cutting: Zod validation from `packages/shared`, rate limiting, helmet, CORS, pagination, OpenAPI docs.
6. Tests: unit for services, supertest integration against a test database.
Skills for the detailed plan: `backend-patterns`, `tdd`, `superpowers:test-driven-development`.

## M3 — Integration
- Implement `frontend/src/data/api/*` repositories against the real API.
- Flip the binding env flag; run Playwright suite against the running backend.
- Fix contract mismatches in `packages/shared` first, then both apps.

## M4 — Launch prep
- Real images and logo, image optimisation, metadata and Open Graph, sitemap, analytics.
- Deployment (frontend on Vercel; backend host to be chosen), environment management, error monitoring.
- Final accessibility and performance audit.

## Execution order and gates

1. M0, then M1 phase by phase; each phase ends with tests green, the impeccable detector clean, and a review against `web-design-guidelines`.
2. User acceptance of M1 before starting M2.
3. Use `superpowers:verification-before-completion` before claiming any phase done.
