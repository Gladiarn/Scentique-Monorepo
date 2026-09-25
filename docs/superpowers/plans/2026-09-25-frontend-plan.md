# Scentique Frontend Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. This is the master frontend plan. Phases 1 and 2 are fully task-level below. Phase 3 (landing) is defined as a repeatable per-section cycle. Phases 4 to 9 are listed with deliverables and acceptance criteria, and each gets its own step-level plan (superpowers:writing-plans) right before it starts, so decisions from earlier phases and design changes you request are reflected.

**Goal:** Build the complete Scentique storefront and admin UI on mock data, backend-ready by construction, in a cohesive dark-luxury design system.

**Architecture:** Next.js App Router in `frontend/` inside a pnpm + Turborepo monorepo. Feature-based folders, a shared design-token layer, and a repository layer (`data/`) so mock data can be swapped for the Express API in one file.

**Tech Stack:** Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui primitives restyled to the brand, Zustand, React Hook Form + Zod, Vitest + Testing Library, Playwright.

**Spec:** `docs/superpowers/specs/2026-09-25-scentique-design.md`

## Global Constraints

- **Design direction (binding, from the owner): modern, minimalist, luxury. Cards are glass.** See "Design principles" below. Every page and section is checked against it before it is shown.
- Brand name only in `frontend/src/config/site.ts`.
- Display font never Inter, Roboto or Arial; also avoid Cormorant, Playfair, Fraunces, Newsreader.
- Palette tokens from the spec; hex values live only in `styles/tokens.css`, never in components.
- No hardcoded backend-type data in components; all through `data/` repositories.
- Loading, error and empty states implemented for every data-bound view.
- Placeholder images via `<ProductImage>`; logo via `<Logo>` (both swappable in one place).
- `prefers-reduced-motion` respected; WCAG AA contrast; visible focus; verified at 375, 768, 1024, 1440 px.
- Money is integer cents; formatted only in `lib/format.ts`.
- Work on `staging`. One feature branch per phase, merged into `staging` after review.

## Review Focus

- Filters with zero results show an empty state and a "clear filters" action.
- Out-of-stock variant disables add to cart and explains why.
- Quiz with answers matching nothing still returns 2 to 3 recommendations.
- Cart survives refresh; a storage-version mismatch resets cleanly.
- Empty cart at `/checkout` redirects to `/cart` with a message.
- Very long product names and 200-item lists do not break layout.
- Wavy background renders a static frame under reduced motion and never blocks text contrast.
- Keyboard-only use of filters, variant selector and quiz works end to end.

## Design principles (binding)

Set by the owner on 2026-09-26. They apply to every remaining page (shop, product, quiz, cart, checkout, account, admin) as much as to the landing page.

1. **Modern, minimalist, luxury.** Restraint over decoration. Generous negative space. Nothing is added that does not earn its place. If a section feels big, it is too big: shrink it before adding anything.
2. **Cards are glass.** Every card surface (info cards, panels, tiles that hold text, forms, dropdowns; not banners, which are waves plus text) is the `GlassPanel` treatment: translucent fill, hairline border, faint top sheen, and the single glass blur `--blur-glass: 5px` (`backdrop-blur-glass`). It should read as clear glass, never as a heavy blur. No other blur strength is allowed (`glass.test.ts` enforces it). Opaque filled cards (`bg-surface`, `bg-raised`) are not used for cards.
3. **Compact by default.** Decorative sections (banners, waves) stay short: tonal waves with the text sitting directly on them, no card around it. Headlines outside the hero use the section scale (about 39 to 49 px), not the display size. The closing section is about 430 px tall on desktop; keep new banners that small.
3a. **One button style for the main action on photography and waves:** the glass pill (`Button variant="glass"`): outlined, translucent, uppercase, arrow icon. The hero and the closing section use the same variant so they cannot drift apart.
4. **Photography leads.** Real product and ingredient photographs, cropped with care; art direction comes from the images, not from effects.
5. **One accent.** Champagne gold is used sparingly (actions, one highlighted phrase per heading). No gold lines or borders as decoration.
6. **Tonal, warm palette.** Browns and bone; scent-family tints only as small marks or washes.
7. **Accessible luxury.** AA contrast, visible focus, 44px targets, reduced motion respected.

Check for every new section before showing it: Is it as small as it can be? Are the cards glass? Is there any decoration that does not carry meaning?

---

## Working agreement: design one section at a time

The landing page is designed **first**, and the design is settled **section by section, top to bottom**, so you can change direction as we go. For every section the loop is:

1. **Propose** the section in a few lines: intent, layout sketch, copy, and the design choices.
2. **Build** only that section, on real mock data, with all states.
3. **Show** it: dev server running, desktop and mobile screenshots.
4. **You decide**: approve, or ask for changes. We iterate on that section only.
5. **Lock**: on approval, commit that section by itself (`feat(landing): hero section`) and log the decisions in `docs/design-log.md`.
6. Only then start the next section. A later section may prompt a small change to an approved one; that is a new commit, not a rewrite.

Consequences for the plan:
- Section components are isolated (`features/landing/sections/*`), so redesigning one never touches another.
- Design tokens may grow while the landing page is built; tokens are extended, not forked.
- The impeccable detector runs after each section; the full impeccable finish review runs once when the whole landing page is approved.

---

## Phase overview

| Phase | Deliverable | Detail level here |
|---|---|---|
| 0 | Design direction: `PRODUCT.md`, direction contract, type specimen | tasks |
| 1 | Monorepo and Next.js scaffold, tooling | tasks |
| 2 | Tokens, core primitives, brand components, data layer for the landing | tasks |
| 3 | **Landing page, section by section** | cycle + section list |
| 4 | Shop (filters, sort) and product detail | acceptance criteria |
| 5 | Scent quiz | acceptance criteria |
| 6 | Cart and checkout | acceptance criteria |
| 7 | Customer account | acceptance criteria |
| 8 | Admin: dashboard, orders pipeline, product form | acceptance criteria |
| 9 | Polish: accessibility, performance, e2e, `DESIGN.md` | acceptance criteria |

---

## Phase 0: Design direction

### Task 0.1: Product context and direction

**Files:**
- Create: `PRODUCT.md`, `docs/design-log.md`
- Create later (phase 3): surface brief for the landing page with the direction contract

- [ ] **Step 1: Invoke `impeccable` and run its `init` interview** with the user (audience, brand voice, what the landing page must make a visitor believe, what would feel wrong). Write `PRODUCT.md`.
- [ ] **Step 2: Record the pinned direction.** The user's reference image and palette pin the world (dark, warm, luxurious, editorial, product-led). No concept roll is needed; the brief wins. Note this in `PRODUCT.md`.
- [ ] **Step 3: Start `docs/design-log.md`** with the date, the pinned palette from the spec, and the placeholder logo decision.
- [ ] **Step 4: Commit** `docs: add product context and design log`.

### Task 0.2: Type specimen decision

Done in Phase 2 Task 2.2, because it needs the running app. Listed here so the decision is not forgotten: display faces Gilda Display, Bodoni Moda, Zodiak; body faces Hanken Grotesk, Albert Sans.

---

## Phase 1: Monorepo and Next.js scaffold

### Task 1.1: Workspace root

**Files:**
- Create: `package.json`, `pnpm-workspace.yaml`, `turbo.json`
- Create: `packages/config/{package.json,tsconfig.base.json,eslint.config.mjs}`, `packages/shared/{package.json,tsconfig.json,src/index.ts}`
- Create: `backend/README.md` (placeholder noting phase 2)

**Interfaces:**
- Produces: workspace names `@scentique/config`, `@scentique/shared`, `@scentique/frontend`; root scripts `dev`, `build`, `lint`, `typecheck`, `test`.

- [ ] **Step 1: Write the workspace files.**

`pnpm-workspace.yaml`:
```yaml
packages:
  - frontend
  - backend
  - packages/*
```

`package.json`:
```json
{
  "name": "scentique",
  "private": true,
  "packageManager": "pnpm@10.0.0",
  "engines": { "node": ">=22" },
  "scripts": {
    "dev": "turbo run dev --filter=@scentique/frontend",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "typecheck": "turbo run typecheck",
    "test": "turbo run test"
  },
  "devDependencies": { "turbo": "^2" }
}
```

`turbo.json`:
```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "dev": { "cache": false, "persistent": true },
    "build": { "dependsOn": ["^build"], "outputs": [".next/**", "dist/**"] },
    "lint": {},
    "typecheck": { "dependsOn": ["^build"] },
    "test": {}
  }
}
```

- [ ] **Step 2: Create `packages/shared`** with `name: "@scentique/shared"`, `main: "src/index.ts"`, and `src/index.ts` exporting `export {};` (types are added in Phase 2).
- [ ] **Step 3: Install and verify.** Run `pnpm install`. Expected: workspaces resolved, no errors. Run `pnpm turbo run typecheck`. Expected: passes with no tasks failing.
- [ ] **Step 4: Commit** `chore: scaffold pnpm + turborepo workspace`.

### Task 1.2: Next.js app

**Files:**
- Create: `frontend/` via the generator
- Modify: `frontend/package.json` (name `@scentique/frontend`, add `typecheck` and `test` scripts, depend on `@scentique/shared`)

- [ ] **Step 1: Generate.** Run:
```bash
pnpm dlx create-next-app@latest frontend --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --use-pnpm --yes
```
Expected: `frontend/src/app` exists and the app installs.
- [ ] **Step 2: Add scripts.** In `frontend/package.json`: `"typecheck": "tsc --noEmit"`, `"test": "vitest run"`; add `"@scentique/shared": "workspace:*"`.
- [ ] **Step 3: Run it.** `pnpm dev`, open `http://localhost:3000`. Expected: default page loads.
- [ ] **Step 4: Commit** `chore(frontend): scaffold next.js app`.

### Task 1.3: Test tooling

**Files:**
- Create: `frontend/vitest.config.ts`, `frontend/src/test/setup.ts`, `frontend/src/lib/format.test.ts`, `frontend/playwright.config.ts`

- [ ] **Step 1: Install.** `pnpm --filter @scentique/frontend add -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @playwright/test`
- [ ] **Step 2: Write the failing test** for money formatting, `frontend/src/lib/format.test.ts`:
```ts
import { describe, expect, it } from "vitest";
import { formatMoney } from "./format";

describe("formatMoney", () => {
  it("formats integer cents as USD", () => {
    expect(formatMoney(12800)).toBe("$128.00");
  });
  it("handles zero", () => {
    expect(formatMoney(0)).toBe("$0.00");
  });
});
```
- [ ] **Step 3: Run and see it fail.** `pnpm --filter @scentique/frontend test`. Expected: FAIL, `formatMoney` not defined.
- [ ] **Step 4: Implement** `frontend/src/lib/format.ts`:
```ts
const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export function formatMoney(cents: number): string {
  return usd.format(cents / 100);
}
```
- [ ] **Step 5: Run and see it pass.** Same command. Expected: PASS.
- [ ] **Step 6: Commit** `chore(frontend): add vitest and playwright, money formatter`.

---

## Phase 2: Tokens, primitives, brand components, landing data

### Task 2.1: Design tokens

**Files:**
- Create: `frontend/src/styles/tokens.css`
- Modify: `frontend/src/app/globals.css`, `frontend/tailwind` theme mapping (per the installed Tailwind version's config style)

**Interfaces:**
- Produces: CSS variables `--color-bg`, `--color-surface`, `--color-raised`, `--color-border`, `--color-text`, `--color-muted`, `--color-accent`, `--color-woody`, `--color-floral`, `--color-citrus`, `--color-oud`, `--color-success`, `--color-warning`, `--color-error`; spacing on a 4px scale; radius scale; type scale variables; Tailwind utilities mapped to them.

- [ ] **Step 1:** Write `tokens.css` with the spec's hex values under `:root`. Only this file contains hex.
- [ ] **Step 2:** Map tokens into the Tailwind theme so components use `bg-surface`, `text-muted`, `text-accent`, and so on.
- [ ] **Step 3:** Set `body` to `--color-bg` / `--color-text`; add a global visible focus ring using `--color-accent`; add a `prefers-reduced-motion` reset.
- [ ] **Step 4: Verify.** Run `pnpm dev`; the page shows espresso background and bone text.
- [ ] **Step 5: Commit** `feat(frontend): design tokens`.

### Task 2.2: Type specimen and font decision

**Files:**
- Create: `frontend/src/app/design/page.tsx`, `frontend/src/lib/fonts.ts`

- [ ] **Step 1:** Load the shortlist with `next/font` into CSS variables (`--font-display-a/b/c`, `--font-body-a/b`).
- [ ] **Step 2:** Build `/design` showing headline, subhead, body, price, label and button text for each candidate in real Scentique copy, on espresso.
- [ ] **Step 3: Show the user; the user picks** display and body faces.
- [ ] **Step 4:** Reduce `fonts.ts` to the chosen pair, exposed as `--font-display` and `--font-body`. Remove the other candidates.
- [ ] **Step 5:** Log the choice in `docs/design-log.md`. Commit `feat(frontend): choose typography`.

### Task 2.3: Core primitives

**Files:**
- Create: `frontend/src/components/ui/{button,input,badge,card,container}.tsx` (add others as later phases need them)
- Create: `frontend/src/components/ui/button.test.tsx`
- Modify: `frontend/src/app/design/page.tsx` (add a primitives gallery)

Scope note: only primitives the landing page needs now. Select, checkbox, dialog, table and the rest arrive in the phase that first uses them, so nothing is built speculatively.

- [ ] **Step 1: Write the failing test** for `Button`: renders its label, is focusable, forwards `disabled`, and renders as a link when `href` is given.
- [ ] **Step 2:** Run it; expect FAIL.
- [ ] **Step 3:** Implement variants `primary` (champagne fill, espresso text), `secondary` (hairline outline), `ghost`; sizes `md`, `lg`; minimum 44px height.
- [ ] **Step 4:** Run; expect PASS. Add the primitives to the `/design` gallery.
- [ ] **Step 5: Commit** `feat(frontend): core ui primitives`.

### Task 2.4: Brand components

**Files:**
- Create: `frontend/src/components/brand/{logo.tsx,product-image.tsx,scent-family-mark.tsx,wavy-background.tsx}`, `frontend/src/config/site.ts`
- Create: `frontend/src/components/brand/wavy-background.test.tsx`

- [ ] **Step 1:** `config/site.ts` exports `siteConfig = { name: "Scentique", tagline: ..., nav: [...] }`.
- [ ] **Step 2:** `Logo` renders a text wordmark from `siteConfig.name`; a single file to replace with the real logo later.
- [ ] **Step 3:** `ProductImage` takes `{ slug, family, alt }` and renders a tonal placeholder (family-tinted wash plus bottle silhouette SVG) using `next/image` sizing rules and a fixed aspect ratio to prevent layout shift. When `src` is provided it renders the real image instead.
- [ ] **Step 4: Write the failing test** for `WavyBackground`: under `prefers-reduced-motion: reduce` it renders a static element and starts no animation frame loop.
- [ ] **Step 5:** Implement `WavyBackground` as a client canvas with simplex-noise waves in scent-family tints, slow drift, paused when off-screen (`IntersectionObserver`) and static under reduced motion.
- [ ] **Step 6:** Run tests; expect PASS. Commit `feat(frontend): brand components`.

### Task 2.5: Domain types and landing data layer

**Files:**
- Create: `packages/shared/src/{product.ts,collection.ts,testimonial.ts,index.ts}`
- Create: `frontend/src/data/repositories/{product.ts,collection.ts,testimonial.ts}` (interfaces)
- Create: `frontend/src/data/mock/{fixtures/*.ts,simulate.ts,product.ts,collection.ts,testimonial.ts}`
- Create: `frontend/src/data/api/{product.ts,collection.ts,testimonial.ts}` (stubs that throw "not implemented")
- Create: `frontend/src/data/index.ts`, `frontend/src/data/mock/product.test.ts`

**Interfaces:**
- Produces: `ProductRepository { findAll(filters?): Promise<Product[]>; findBySlug(slug): Promise<Product | null>; findFeatured(): Promise<Product[]> }`, `CollectionRepository { findAll(): Promise<Collection[]> }`, `TestimonialRepository { findAll(): Promise<Testimonial[]> }`, exported singletons `productRepository`, `collectionRepository`, `testimonialRepository` from `data/index.ts`.

- [ ] **Step 1: Write failing tests** for the mock product repository: `findFeatured` returns only featured products; `findBySlug("unknown")` resolves `null`; `findAll({ family: "oud" })` returns only oud products; results arrive asynchronously.
- [ ] **Step 2:** Run; expect FAIL.
- [ ] **Step 3:** Define types in `packages/shared` per the spec's domain model. Every `media` entry is `{ src?: string; alt: string; promptBrief: string }`, so each placeholder carries the description used to generate its real image. Write realistic fixtures: about 24 scents across the four families with notes, variants and stock (some out of stock), 4 collections, 6 testimonials of varied length. All fixture copy is synthetic and labelled so in a header comment.
- [ ] **Step 4:** Implement `simulate.ts` (`simulateLatency()` 150 to 600 ms, `maybeFail()` with a configurable rate, default 0) and the mock repositories.
- [ ] **Step 5:** `data/index.ts` binds mock or API by `NEXT_PUBLIC_USE_MOCKS` (default `true`). This is the only file that names implementations.
- [ ] **Step 6:** Run tests; expect PASS. Commit `feat: domain types and mock data layer`.

---

## Phase 3: Landing page, one section at a time

Route: `frontend/src/app/(storefront)/page.tsx` composes section components from `frontend/src/features/landing/sections/`. Each section reads only through repository hooks and has loading, error and empty states.

Sections, in build order (top to bottom). Each runs the full section loop from the working agreement, and **nothing later starts until the previous is approved**:

| # | Section | Intent | Data |
|---|---|---|---|
| 3.1 | Site header and announcement bar | Brand, navigation, cart entry; sticky behaviour | `siteConfig`, cart count |
| 3.2 | **Hero** | Signature scent, product-led, wavy background, one clear action | `findFeatured()` |
| 3.3 | Brand story / about | Who Scentique is, why it exists; editorial, negative space | static copy |
| 3.4 | Featured collections | Browse by scent family / collection | `collectionRepository` |
| 3.5 | Best sellers / new arrivals | Product tiles with real add-to-cart entry points | `findAll()` |
| 3.6 | Craft and ingredients | What goes into the scents; proof over claims | static copy |
| 3.7 | Testimonials | Real-feeling reviews with varied lengths | `testimonialRepository` |
| 3.8 | Scent quiz teaser | Lead into the quiz | static |
| 3.9 | Footer with closing call to action | Wavy background moment three; links, newsletter form | `siteConfig` |

The section order may change if you ask. Add or drop sections as the design evolves; the loop stays the same.

### Section cycle (repeat for each section)

**Files (per section):**
- Create: `frontend/src/features/landing/sections/<section>.tsx`
- Create: `frontend/src/features/landing/sections/<section>.test.tsx`
- Modify: `frontend/src/app/(storefront)/page.tsx` (add the section)
- Modify: `docs/design-log.md`

- [ ] **Step 1: Propose.** Post intent, ASCII layout sketch, copy draft and the type and colour choices in a short message. Wait for the user's go-ahead or edits.
- [ ] **Step 2: Write the failing test** for behaviour: it renders loading, then data, then handles empty and error states (using a repository stub that returns `[]` and one that rejects).
- [ ] **Step 3:** Run; expect FAIL.
- [ ] **Step 4: Build the section** to the approved proposal, mobile-first, using tokens and primitives only. Invoke `frontend-design` and `impeccable` guidance for craft; extend tokens if genuinely needed.
- [ ] **Step 5:** Run tests; expect PASS. Run `impeccable detect --json` on the changed files and fix mechanical findings.
- [ ] **Step 6: Show the user.** Start `pnpm dev`, capture desktop (1440) and mobile (390) screenshots, and present them.
- [ ] **Step 7: Iterate** on the user's feedback for this section only, until approved.
- [ ] **Step 8: Lock.** Append the decisions to `docs/design-log.md` and add an entry for every image the section uses to `docs/image-briefs.md` (path, ratio, prompt, alt text) so the real images can be generated later. Commit `feat(landing): <section> section`.

### Task 3.10: Landing finish

- [ ] **Step 1:** Run the full page at 375, 768, 1024, 1440. Fix layout defects in one batch.
- [ ] **Step 2:** Run `web-design-guidelines` review on `features/landing/**` and `app/(storefront)/page.tsx`; fix findings.
- [ ] **Step 3:** Run the ui-ux-pro-max pre-delivery checklist (contrast, focus, reduced motion, cursor and hover states, responsive widths).
- [ ] **Step 4:** Spawn the impeccable finish reviewer with the direction contract and screenshots; apply its fixes.
- [ ] **Step 5:** Run `superpowers:verification-before-completion`: tests, typecheck, lint and build all pass. Commit and merge the landing branch into `staging`.

---

## Phases 4 to 9: scope and acceptance

Each phase gets its own step-level plan when it starts. **Every page here follows the same section-by-section loop** as the landing page: propose, build, show, iterate, lock.

### Phase 4: Shop and product detail
- Routes: `/shop`, `/product/[slug]`. Features: `catalog`, `product`.
- Shop: filter by scent family, gender, price range; sort (featured, price low/high, newest); filters reflected in the URL; zero-result empty state; loading skeleton grid.
- Product: image gallery, size and concentration selector with live price and stock, notes pyramid (top, heart, base), add to cart, related scents.
- Adds primitives: select, checkbox, slider, tabs, skeleton.
- Acceptance: filters and sort work with keyboard; URL restores state; out-of-stock behaviour per Review Focus; tests for filter logic and variant selection.

### Phase 5: Scent quiz
- Route `/quiz`. Feature `quiz`.
- 4 questions, progress indicator, back navigation, keyboard operable, result shows 2 to 3 recommendations with the wavy background moment.
- Recommendation logic is a pure, unit-tested function over answers and products.
- Acceptance: any answer combination returns 2 to 3 products; refresh mid-quiz keeps progress.

### Phase 6: Cart and checkout
- Routes `/cart`, `/checkout`, `/checkout/confirmation`. Features `cart`, `checkout`.
- Zustand cart store persisted with a version key; quantity controls; line totals via `formatMoney`.
- Checkout: contact, shipping address, delivery method, payment step (mock), order summary, validation with React Hook Form + Zod, confirmation page.
- Order creation goes through `OrderRepository` (mock now).
- Acceptance: empty-cart redirect; validation errors are near fields; totals correct in tests; e2e Playwright test from shop to confirmation.

### Phase 7: Customer account
- Routes under `/account`. Feature `account`.
- Order history list and detail; saved addresses with add, edit, delete; mock sign-in gate.
- Acceptance: empty states for no orders and no addresses; address form validation.

### Phase 8: Admin
- Routes under `/admin`. Features `admin/{dashboard,orders,products}`. Admin shell layout with side navigation, denser type and spacing from the same tokens.
- Dashboard: revenue chart (scent-family colours as series, follow the `dataviz` skill), top products, low-stock alerts with icon and label.
- Orders: table with search, filter, status pipeline view (pending, paid, packed, shipped, delivered), status change action.
- Products: list and a form to add a scent with variants (repeatable rows), notes pyramid input, family and gender, image placeholders.
- Adds primitives: table, dialog, tabs, toast.
- Acceptance: table handles 200 rows; product form validates and can add or remove variants; keyboard navigable.

### Phase 9: Polish
- Accessibility audit, performance pass (Lighthouse, image sizing, bundle check), Playwright suite for browse-to-checkout, quiz, admin product create.
- Impeccable finish review across the site; generate `DESIGN.md` from the built system.
- Replace placeholder logo and imagery when supplied (single-file swaps).
- Acceptance: all tests green; no critical audit findings; `pnpm build` succeeds.

## Self-review against the spec

- Spec coverage: all 9 screens are covered by phases 3 to 8; design system by phase 2; data layer by phase 2; testing and process gates by every phase and phase 9.
- No placeholders in phases 1 to 3; phases 4 to 9 are intentionally scoped to acceptance criteria and each receives a step-level plan at its start.
- Interface names used consistently: `productRepository`, `collectionRepository`, `testimonialRepository`, `formatMoney`, `siteConfig`.
