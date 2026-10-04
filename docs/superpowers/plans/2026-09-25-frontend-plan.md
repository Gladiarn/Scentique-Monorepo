# Scentique Frontend Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. This is the master frontend plan. Phases 1 and 2 are fully task-level below. Phase 3 (landing) is defined as a repeatable per-section cycle. Phases 4 to 9 are listed with deliverables and acceptance criteria, and each gets its own step-level plan (superpowers:writing-plans) right before it starts, so decisions from earlier phases and design changes you request are reflected.

**Goal:** Build the complete Scentique storefront and admin UI on mock data, backend-ready by construction, in a cohesive dark-luxury design system.

**Architecture:** Next.js App Router in `frontend/` inside a pnpm + Turborepo monorepo. Feature-based folders, a shared design-token layer, and a repository layer (`data/`) so mock data can be swapped for the Express API in one file.

**Tech Stack:** Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui primitives restyled to the brand, Zustand, React Hook Form + Zod, Vitest + Testing Library, Playwright.

**Spec:** `docs/superpowers/specs/2026-09-25-scentique-design.md`

## Status (updated 2026-09-30, end of session 2)

**Where we are:** phases 0, 1 and 2 are done. Phase 3 (landing page) is almost ready: structurally and visually complete, tested, deployed, and live. **What's left before it's approved as the design reference is content, not design** — the placeholder copy (brand story, taglines, notes, testimonials) needs to be replaced with the real information now captured in the repo root `README.md` and `PRODUCT.md`, which are the source of truth for who Scentique is. Once that pass is done plus the remaining polish checklist below, the landing page is approved and every other page follows its pattern (see "Design reference: the landing page").

**Infrastructure (new this session):** the repo is pushed to GitHub (`main` is the default branch, `staging` for integration), CI runs on PRs into either. The frontend is deployed on Vercel as project `scentique` under the `gladiarns-projects` scope (Root Directory `frontend`, monorepo-aware), with a reusable 404 page. `README.md` (professional, with the brand story and tech overview) and `LICENSE` (MIT) are in place at the repo root.

**Built so far**

| Area | State |
|---|---|
| Monorepo, Next.js 16, Vitest, Playwright config, CI workflow | Done. CI has never run on GitHub. |
| Design system | Done: tokens (`styles/tokens.css`), fonts Prata (headlines), Bodoni Moda italic (accent phrases via `Em`), Hanken Grotesk (body); plain glass with one 10px blur token; `Button` variants including the glass pill; `GlassPanel`; hairline icons. |
| Brand | Done: vector logo (mark, wordmark, lockup, favicons, traced from the owner's JPEG), `ProductImage` (placeholder or real photo, crop positions), `WaveBackdrop` (tonal brown waves), `Logo`. |
| Data layer | Done: shared types; repositories for products (`findAll`, `findBySlug`, `findFeatured`, `findHeroFeatured`, `findBestSellers`), collections and testimonials; mock implementations with latency and `NEXT_PUBLIC_MOCK_FAILURE_RATE`; API stubs. Every landing section reads through it. |
| Catalog | 7 real scents with real photographs (Ambre Fumé, Bois Fumé Précieux with 2 photos, L'Ambre Sauvage, L'Ambre Éternel, Nocturne Absolu, Mystique Bois) plus 4 placeholders without photos. Four category photographs. |
| Landing page, first pass | Header (floating, shrinks and swaps to the wordmark on scroll), hero (painted Bois Fumé on the silk backdrop, scent card with note tiers), About bento, Four families bento, Best sellers bento, Testimonials (old three-column layout), closing waves, footer. |

**Landing revision: the next session starts here** (before Phase 4)

- [ ] **Homepage remodel (owner decision, 2026-09-30).** The owner wants to rebuild the homepage again for a more genuinely luxurious, glassy feel — explicitly **not** generic "AI slop" (templated bento grids, safe default spacing, the same card pattern repeated section after section). Use the `frontend-design` / `impeccable` skills properly for this pass, not a rough approximation: go through brainstorming for the direction before touching code, since this is a redesign of an already-shipped surface. Ground it in what actually exists today — glass cards, the drift/wave motif, the champagne-on-espresso palette, Prata/Bodoni Moda/Hanken Grotesk — rather than inventing new material. Note: the previous attempt at reworking the About section this session was rejected ("bring back the old one") for not fitting the vibe — take that as a concrete signal of what to avoid, not just a generic warning.
  - Progress 2026-10-04: **About remodeled** to an editorial layout (one large silk-backdrop statement frame, asymmetric ingredient photography beside a glass process panel, no bento grid). Still to remodel: Four families (collections) and Best sellers, which remain bento grids; then Testimonials and Closing reviewed against the same direction.
- [x] **Insert real content.** Verified 2026-10-04: hero, About, and collections copy already match the brand story in `README.md` and `PRODUCT.md`; testimonials are explicitly labelled as placeholders, as `PRODUCT.md` requires. Future copy changes should come from those two files.
- [x] Custom scrollbar themed to the brand palette (tonal thumb, gold on hover) instead of the OS default.
- [ ] Testimonials section redesigned to the same pattern (bento or glass cards), with real-feeling content.
- [ ] Footer reviewed against the principles (glass, minimal).
- [ ] Nav dropdown and mobile menu brought onto plain glass.
- [ ] Spacing rhythm and section heights reviewed top to bottom; anything still too big is shrunk.
- [ ] Accent italic usage reviewed (currently one phrase in every section heading; keep or reduce).
- [ ] Hero background is a 2.7 MB traced SVG: decide whether to trade detail for size, and check load time.
- [ ] Mobile pass on every section (375, 390, 768), including the hero card replacement bar.
- [ ] Accessibility and best-practice review: `web-design-guidelines`, the impeccable detector, ui-ux-pro-max pre-delivery checklist, then the impeccable finish review.
- [ ] Owner approves the landing page. It is then frozen as the design reference.

**Needs input from the owner**

- Photos for the 4 placeholder scents (Bitter Orange Hour, Night Iris, Lemon Ash, Petal Smoke), or remove them.
- Notes, taglines and prices for the new scents are placeholders derived from the photos. Testimonials and brand copy are placeholders.
- The `public/perfumes/Original/` folder and the two SVG traces (Sauvage, Éternel) are no longer used and can be deleted.
- A vector original of the logo (the current one is traced from a low-resolution JPEG).

**How to resume**

- `pnpm install`, then `pnpm dev` (frontend on http://localhost:3000). Tests: `pnpm test`. Checks: `pnpm typecheck`, `pnpm lint`.
- Screenshots and overflow checks: `node frontend/scripts/screenshot.mjs <path> <name> --full` and `node frontend/scripts/check-overflow.mjs /`. Always check with normal motion (not "reduce motion").
- Known quirk: after editing Tailwind classes the dev server can serve a stale stylesheet (missing utilities, collapsed sections). Restart `pnpm dev`. Do not run `pnpm build` while the dev server is running.
- Decisions and their reasons are in `docs/design-log.md`. Image sources and how each site image was made are in `docs/image-briefs.md` and `docs/brand-assets.md`. The execution ledger is in `.superpowers/sdd/` (git-ignored).

---

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
2. **Cards are glass.** Every card surface (info cards, panels, tiles that hold text, forms, dropdowns; not banners, which are waves plus text) is the `GlassPanel` treatment: translucent fill, hairline border, faint top sheen, and the single glass blur `--blur-glass: 10px` (`backdrop-blur-glass`). It should read as clear glass, never as a heavy blur. No other blur strength is allowed (`glass.test.ts` enforces it). Opaque filled cards (`bg-surface`, `bg-raised`) are not used for cards.
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

| Phase | Deliverable | Status |
|---|---|---|
| 0 | Design direction: `PRODUCT.md`, direction contract, type specimen | Done |
| 1 | Monorepo and Next.js scaffold, tooling | Done |
| 2 | Tokens, core primitives, brand components, data layer | Done |
| 3 | **Landing page, section by section** | First pass built; **revision round pending** (see Status) |
| 4 | Shop (filters, sort) and product detail | Not started. Starts after the landing page is approved. |
| 5 | Scent quiz | Not started |
| 6 | Cart and checkout | Not started |
| 7 | Customer account | Not started |
| 8 | Admin: dashboard, orders pipeline, product form | Not started |
| 9 | Polish: accessibility, performance, e2e, `DESIGN.md` | Not started |

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

The landing page as built in the first pass (top to bottom). Files are in `frontend/src/features/landing/` and `frontend/src/components/layout/`. Each section still gets a revision check before the landing page is approved (see Status).

| # | Section | What it is now | Data (through repositories) | State |
|---|---|---|---|---|
| 3.1 | Header | Fixed and floating over the hero; tall with the lockup at the top, slim with the wordmark once scrolled; hover/keyboard dropdowns; mobile menu; hairline icons; no border | `siteConfig.nav` | Built, revise: dropdown and mobile menu to plain glass |
| 3.2 | Hero | Painted Bois Fumé Précieux on the silk backdrop, headline with one gold italic phrase, glass pill button, family chips, scent card (photo, note tiers, price, arrow) | `findHeroFeatured()` | Built, revise: 2.7 MB SVG weight, mobile check |
| 3.3 | About (bento) | Curtain statement tile, real ingredient close-ups cropped from the photos, glass process card | static copy and photos | Built, revise: spacing |
| 3.4 | Four families (bento) | Large, tall and small tiles using the four category photographs, glass quiz card | `collectionRepository.findAll()` | Built |
| 3.5 | Best sellers (bento) | Featured scent with note tiers on plain glass, two small tiles, one wide tile | `findBestSellers(4)` (static list until the backend has sales data) | Built |
| 3.6 | Testimonials | Three columns with dividers, placeholder reviews | `testimonialRepository.findAll()` | **Redesign: still the old layout** |
| 3.7 | Closing | Tonal brown waves on both edges, text directly on them, glass pill button; about 430 px tall | static | Built |
| 3.8 | Footer | Lockup, link columns, copyright row; no top border | `siteConfig` | Revise |

Data sections are wrapped in a `SectionBoundary` (error with retry) and a Suspense skeleton, and each handles its empty state.

The section order may change if the owner asks. The loop stays the same.

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

### Task 3.10: Landing finish (PENDING: this is the revision round)

Nothing below has been done yet. Do the revision checklist in Status first, then this task, then get the owner's approval.

- [ ] **Step 1:** Run the full page at 375, 768, 1024, 1440. Fix layout defects in one batch.
- [ ] **Step 2:** Run `web-design-guidelines` review on `features/landing/**` and `app/(storefront)/page.tsx`; fix findings.
- [ ] **Step 3:** Run the ui-ux-pro-max pre-delivery checklist (contrast, focus, reduced motion, cursor and hover states, responsive widths).
- [ ] **Step 4:** Spawn the impeccable finish reviewer with the direction contract and screenshots; apply its fixes.
- [ ] **Step 5:** Run `superpowers:verification-before-completion`: tests, typecheck, lint and build all pass. Commit and merge the landing branch into `staging`.

---

## Design reference: the landing page

**Rule (from the owner, 2026-09-26):** the landing page is finished and revised first. After it is approved, **every other page follows its design pattern** so the whole site reads as one system. Nothing in Phases 4 to 9 invents a new visual pattern; it reuses these.

| Pattern | Where it lives | How other pages use it |
|---|---|---|
| Tokens: palette, type scale, radii, glass blur | `styles/tokens.css` | The only source of colour and sizes. No hex in components. |
| Fonts: Prata headlines, Bodoni Moda italic accent, Hanken Grotesk body | `lib/fonts.ts`, `Em` | Page titles use Prata at the section scale; one gold italic phrase at most per heading. |
| Plain glass card | `components/ui/glass-panel.tsx` | Every card: filter panels, order summary, forms, account cards, admin cards. No fill, sheen, shadow or extra blur. |
| Glass pill button | `Button variant="glass"` | The main action over photography (shop hero, quiz start, checkout on images). Other actions use `primary`, `secondary`, `ghost`. |
| Bento layout | `sections/collections.tsx`, `story.tsx`, `best-sellers.tsx` | Mixed tile sizes on shop landing states, account overview, admin dashboard. |
| Scent card (photo, name, note tiers, price, arrow) | `hero.tsx`, best-sellers featured tile | Basis for the product card on the shop grid and the product page summary. |
| Photography: `ProductImage`, media roles (`hero` and `photo`), crop positions | `components/brand/product-image.tsx`, `lib/media.ts` | Product cards use `photo`; only the landing hero uses `hero` art. Real photographs everywhere. |
| Section states: skeleton, error boundary with retry, empty state | `section-skeleton.tsx`, `section-boundary.tsx` | Every data-bound page region. |
| Data through repositories | `data/` | Every page reads through an interface. Adding a page means adding repository methods, never importing mocks. |
| Waves banner (tonal browns, compact) | `wave-backdrop.tsx`, `closing.tsx` | Only for closing or empty-state banners; keep the same size and no lines. |
| Header and footer | `components/layout/` | Shared by every storefront page (admin has its own shell built from the same parts). |
| Motion | `animate-hero-rise`, wave drift, hover eases | Sparing; respects reduced motion. |

Admin (Phase 8) uses the same tokens, fonts and glass cards with a denser, calmer layout.

---

## Phases 4 to 9: scope and acceptance

**Status 2026-10-05: all storefront, account, admin and information pages are built.** Remaining outside the pages: the homepage testimonials and nav-dropdown glass checklist items, real staff and customer sign-in (needs the backend), and the visual review of every page, which has not been done in a browser.

**These start only after the landing page is approved, and every page reuses the landing page's design pattern above.** Each still runs the propose, build, show, iterate, lock loop. Each phase's own step-level plan states which landing patterns it reuses.

Each phase gets its own step-level plan when it starts. **Every page here follows the same section-by-section loop** as the landing page: propose, build, show, iterate, lock.

### Phase 4: Shop and product detail

**Status 2026-10-04: built, not yet committed.** `/shop` (family, gender, price and sort filters in the URL, empty state, loading skeleton) and `/product/[slug]` (photos, size and concentration selector with live price and stock, notes, related scents). Logic is unit-tested (catalog query and variant resolution). Add to cart is rendered but not wired: it arrives with the cart in Phase 6. Primitives select, checkbox, tabs and dialog are not built yet, as the controls used are native elements.

- Design: reuse the scent card for the product grid, plain glass for the filter panel, the glass pill for primary actions, the shared header and footer, and Best sellers' bento rhythm for featured rows.
- Routes: `/shop`, `/product/[slug]`. Features: `catalog`, `product`.
- Shop: filter by scent family, gender, price range; sort (featured, price low/high, newest); filters reflected in the URL; zero-result empty state; loading skeleton grid.
- Product: image gallery, size and concentration selector with live price and stock, notes pyramid (top, heart, base), add to cart, related scents.
- Adds primitives: select, checkbox, slider, tabs, skeleton.
- Acceptance: filters and sort work with keyboard; URL restores state; out-of-stock behaviour per Review Focus; tests for filter logic and variant selection.

### Phase 5: Scent quiz

**Status 2026-10-04: built.** `/quiz` asks four questions (notes, occasion, who it is for, strength). Answers live in the URL, so refresh and back navigation keep progress, and each option is a plain link, so it's keyboard-operable without client JavaScript. The result shows two or three scents on the tonal wave backdrop. Recommendation logic is a pure function with tests, including a check that every answer combination returns two or three scents.
- Route `/quiz`. Feature `quiz`.
- 4 questions, progress indicator, back navigation, keyboard operable, result shows 2 to 3 recommendations with the wavy background moment.
- Recommendation logic is a pure, unit-tested function over answers and products.
- Acceptance: any answer combination returns 2 to 3 products; refresh mid-quiz keeps progress.

### Phase 6: Cart and checkout

**Status 2026-10-04: built.** Zustand cart persisted under a versioned key, wired to Add to cart and the header bag count. `/cart` (quantity limited to stock, totals, free shipping over $150). `/checkout` (React Hook Form and Zod, validation next to each field, test-mode card, empty-cart explanation). `/checkout/confirmation`. Orders go through `OrderRepository` (mock). The Playwright browse-to-confirmation test is not written, since UI testing was waived for this phase.
- Routes `/cart`, `/checkout`, `/checkout/confirmation`. Features `cart`, `checkout`.
- Zustand cart store persisted with a version key; quantity controls; line totals via `formatMoney`.
- Checkout: contact, shipping address, delivery method, payment step (mock), order summary, validation with React Hook Form + Zod, confirmation page.
- Order creation goes through `OrderRepository` (mock now).
- Acceptance: empty-cart redirect; validation errors are near fields; totals correct in tests; e2e Playwright test from shop to confirmation.

### Phase 7: Customer account

**Status 2026-10-04: built.** `/account` with a demo sign-in (email only, no password), then Overview, Orders (list and detail with the status pipeline, and an ownership check so one account cannot open another's order) and Addresses (add, edit, delete, validated, with empty states). Customer and address access goes through `CustomerRepository` (mock). Order lookup by email was added to `OrderRepository`.
- Routes under `/account`. Feature `account`.
- Order history list and detail; saved addresses with add, edit, delete; mock sign-in gate.
- Acceptance: empty states for no orders and no addresses; address form validation.

### Phase 8: Admin

**Status 2026-10-04: built.** `/admin` with a side-nav shell marked "sample data": a dashboard (revenue by scent family in the family colours, with text values; top products; low stock with text labels, not colour alone), an orders table (search, status tabs with counts, one-click advance through the pipeline, 200 seeded sample orders), and a products page (list, plus an add-scent form with repeatable size and price rows, validation, and a duplicate size and concentration check). Admin has no sign-in gate yet; that is the next decision. Tables and tabs use native elements, and status feedback is inline rather than a toast, so the dialog and toast primitives are not built.
- Routes under `/admin`. Features `admin/{dashboard,orders,products}`. Admin shell layout with side navigation, denser type and spacing from the same tokens.
- Dashboard: revenue chart (scent-family colours as series, follow the `dataviz` skill), top products, low-stock alerts with icon and label.
- Orders: table with search, filter, status pipeline view (pending, paid, packed, shipped, delivered), status change action.
- Products: list and a form to add a scent with variants (repeatable rows), notes pyramid input, family and gender, image placeholders.
- Adds primitives: table, dialog, tabs, toast.
- Acceptance: table handles 200 rows; product form validates and can add or remove variants; keyboard navigable.

### Phase 9: Polish

**Status 2026-10-04: partly done.** Done: `pnpm build` passes with all 18 routes; typecheck, lint and 177 tests pass; `DESIGN.md` written at the repo root from the built tokens and components; the admin console is behind a demo access code (client-side only, so not security until the backend has real staff sign-in). Not done: the Playwright end-to-end suite (waived for this build); visual mobile and accessibility audits (need a browser, also waived); the landing remodels for Four families and Best sellers are done (editorial rows, no grids) but await the owner's visual review.
- Accessibility audit, performance pass (Lighthouse, image sizing, bundle check), Playwright suite for browse-to-checkout, quiz, admin product create.
- Impeccable finish review across the site; generate `DESIGN.md` from the built system.
- Replace placeholder logo and imagery when supplied (single-file swaps).
- Acceptance: all tests green; no critical audit findings; `pnpm build` succeeds.

## Self-review against the spec

- Spec coverage: all 9 screens are covered by phases 3 to 8; design system by phase 2; data layer by phase 2; testing and process gates by every phase and phase 9.
- No placeholders in phases 1 to 3; phases 4 to 9 are intentionally scoped to acceptance criteria and each receives a step-level plan at its start.
- Interface names used consistently: `productRepository`, `collectionRepository`, `testimonialRepository`, `formatMoney`, `siteConfig`.
