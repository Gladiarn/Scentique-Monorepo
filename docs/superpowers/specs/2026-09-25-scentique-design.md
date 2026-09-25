# Scentique — Design Spec

Status: draft for review · Date: 2026-09-25 · Repo: `Gladiarn/Scentique-Monorepo` · Working branch: `staging`

## 1. Purpose and success criteria

Scentique is a portfolio-grade e-commerce project: a niche indie perfume and cologne storefront with an admin CRM. It must look and behave like a professional DTC brand site (Skylar, D.S. & Durga), not a template.

Success means:
- A visitor can browse, filter, read a product page, take the scent quiz, fill a cart and complete a checkout flow.
- A customer can view order history and saved addresses.
- An admin can see revenue, top products and low stock, manage an order pipeline, and add a scent with variants and a notes pyramid.
- The frontend runs fully on mock data first. Connecting the Express backend later changes **one file** (the repository binding), not the UI.
- The repo is organised so a new engineer can find any feature in under a minute.

Non-goals (for now): real payments, real email, real inventory sync, multi-currency, internationalisation, CMS.

## 2. Decisions already made

| Decision | Choice |
|---|---|
| Brand name | Scentique (single constant in `frontend/src/config/site.ts`) |
| Logo | Placeholder wordmark component; user supplies the real one |
| Repo shape | Monorepo: `frontend/` (Next.js), `backend/` (Express), `packages/*` |
| Tooling | pnpm workspaces + Turborepo |
| Build order | Frontend first on mock data, then backend + database |
| Backend | Node.js + Express (TypeScript) |
| Images | Placeholders now; user provides photography later |
| Visual base | Dark, warm, luxurious, from the user's reference image; own identity |
| Special effect | Custom `WavyBackground` (Vercel/Aceternity-style canvas waves), not the `capsule-render` service |

## 3. Repository layout

```
Scentique/
├─ frontend/                     Next.js App Router, TypeScript, Tailwind
├─ backend/                      Express + TypeScript (scaffolded empty until phase 2)
├─ packages/
│  ├─ shared/                    domain types + Zod schemas used by both apps
│  └─ config/                    shared tsconfig, eslint, prettier
├─ docs/superpowers/{specs,plans}/
├─ turbo.json  pnpm-workspace.yaml  package.json  .gitignore
```

Rules: apps never import from each other; both may import from `packages/shared`. Any type that crosses the network is defined once in `shared`.

## 4. Frontend architecture

```
frontend/src/
├─ app/                          routes only; thin files that compose features
│  ├─ (storefront)/              landing, shop, product/[slug], quiz
│  ├─ (checkout)/                cart, checkout, checkout/confirmation
│  ├─ (account)/account/         overview, orders, addresses
│  └─ admin/                     dashboard, orders, products, products/new
├─ features/                     one folder per domain: components/, hooks/, lib/
│  ├─ catalog/  product/  quiz/  cart/  checkout/  account/
│  └─ admin/{dashboard,orders,products}/
├─ components/
│  ├─ ui/                        primitives: button, input, select, checkbox, dialog, table, badge…
│  ├─ layout/                    site header, footer, admin shell, page container
│  └─ brand/                     Logo (placeholder), WavyBackground, ProductImage, ScentFamilyMark
├─ data/
│  ├─ repositories/              interfaces only (ProductRepository, OrderRepository…)
│  ├─ mock/                      fixtures + latency/failure simulation
│  ├─ api/                       real fetch implementations (stubs until backend)
│  └─ index.ts                   the ONE place mock vs api is bound (env flag)
├─ config/site.ts                brand name, nav, currency
├─ styles/                       tokens.css, globals.css
└─ lib/                          utils, formatters
```

Data rules (glad-frontend):
- Components and hooks depend on repository **interfaces**, never on mock or API classes.
- Mock repositories add 150–600 ms latency and an optional failure rate.
- Every data-bound view implements loading, error and empty states.
- Fixtures are realistic: about 24 scents, varied name lengths, some out of stock, some with one variant, a family with no matches.

Client state: cart in Zustand (persisted to localStorage, versioned key). Server data via repository hooks. Forms via React Hook Form + Zod schemas from `packages/shared`.

## 5. Domain model (in `packages/shared`)

- `Product`: id, slug, name, tagline, description, family (`woody | floral | citrus | oud`), gender (`feminine | masculine | unisex`), notes `{ top[], heart[], base[] }`, variants[], media[], featured, createdAt.
- `Variant`: id, sku, size (ml), concentration (`eau_de_toilette | eau_de_parfum | extrait`), priceCents, stock.
- `CartItem`: productId, variantId, quantity. Prices are looked up, never trusted from the client.
- `Order`: id, number, customer, items (snapshot of name, size, price), status (`pending | paid | packed | shipped | delivered | cancelled`), totals, shipping address, timestamps.
- `Address`, `Customer`, `QuizQuestion`, `QuizAnswer`, `Recommendation`.
- Money is integer cents, formatted only at render time.

## 6. Design system

One system across storefront and admin: same tokens, type scale, spacing and component style.

**Colour (proposed, to be tuned by eye and AA-checked in phase 2)**

| Role | Name | Hex |
|---|---|---|
| Background | Espresso | `#14100C` |
| Surface | Umber | `#1E1712` |
| Raised | Cocoa | `#2B2119` |
| Border | Hairline | `#3A2E24` |
| Text | Bone | `#EFE6D6` |
| Muted text | Taupe | `#A3937E` |
| Accent | Champagne | `#C9A46A` |
| Woody | Cedar | `#9A6B43` |
| Floral | Dusty rose | `#C4838F` |
| Citrus | Zest | `#BDBE5C` |
| Oud | Oxblood | `#8E3A45` |
| Success / Warning / Error | Sage / Burnt amber / Brick | `#7FA07A` / `#D98E48` / `#C4574F` |

Gold is the action colour only. The four scent-family tints carry product identity (chips, tile washes, notes pyramid, admin chart series) as low-opacity washes, with full strength reserved for small marks. Warning colour is never the sole signal; it always pairs with an icon and label.

**Type.** Display face chosen by eye on a `/design` specimen page from the shortlist Gilda Display, Bodoni Moda, Zodiak. Body face from Hanken Grotesk, Albert Sans. Not Inter, Roboto, Arial, Cormorant, Playfair, Fraunces or Newsreader. Fonts are exposed as CSS variables so the choice is a one-line swap. Modular scale, body at least 16px, line length under 80 characters, serif display with more leading than sans.

**Layout.** 4px base grid; one radius family; hairline borders rather than heavy shadows; generous negative space on storefront, denser tables on admin. The storefront hero is product-led with the wavy background behind it.

**Motion.** One orchestrated hero moment, `WavyBackground` in three places only (hero, quiz result, footer call to action), and motion that answers user actions. Everything respects `prefers-reduced-motion`.

**Quality floor.** WCAG AA contrast, visible keyboard focus, 44px touch targets, layouts verified at 375, 768, 1024 and 1440 px, `next/image` with explicit dimensions, `loading.tsx` for route loading.

## 7. Screens

Storefront: landing (hero with signature scent, story, collections, testimonials); shop (filter by family, gender, price; sort); product detail (gallery, size and concentration selector, notes pyramid, add to cart); scent quiz (4 questions, 2–3 recommendations); cart and checkout; customer account (order history, saved addresses).

Admin: dashboard (revenue chart, top products, low-stock alerts); orders table with status pipeline view; product form (variants and notes pyramid).

## 8. Backend (designed now, built later)

Express + TypeScript, feature modules mirroring the frontend (`catalog`, `cart`, `orders`, `auth`, `customers`, `admin`), each with router, controller, service, repository. Postgres with Prisma. Zod validation using `packages/shared`. JWT auth with `customer` and `admin` roles. Stripe for payments. Central error handler, request logging, rate limiting, OpenAPI docs. Full plan comes after the frontend is complete.

## 9. Process and quality gates

- Impeccable `init` interview produces `PRODUCT.md` before any UI code; a direction contract is written per surface; `DESIGN.md` is produced at the end.
- Per page: impeccable detector, `web-design-guidelines` review, ui-ux-pro-max pre-delivery checklist.
- Tests: Vitest + Testing Library for units and components; Playwright for the key flows (browse to checkout, quiz, admin product create).
- Branching: work on `staging`; features on short-lived branches merged into `staging`; `main` receives reviewed releases.

## 10. Open items

- Final logo and photography (user).
- Final display and body fonts and palette tuning (phase 2, by eye).
- Payment and email providers (backend plan).
