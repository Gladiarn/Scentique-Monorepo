# Scentique design system

This document describes the system as built. The tokens in `frontend/src/styles/tokens.css` are the source of truth. Anything not listed here is not part of the system and should not be introduced without a reason recorded in `docs/design-log.md`.

## Direction

Dark, warm and editorial: a small fragrance house with a lot of negative space and real photography. Glass is used as a specific effect, a light blur of what sits behind a card, not as decoration. Ornament is limited to the tonal wave motif.

Rules the owner set and that the system follows:

- Glass is plain: a light blur, a hairline border, no fill, sheen or shadow.
- No decorative lines or dividers. Structure comes from spacing.
- Real photographs are used as supplied. Traced artwork is only used on the landing hero.
- Sections stay compact. Banners are waves and text, with no card.
- Same action, same style, everywhere.

## Colour

All colour comes from tokens. No hex values appear in components.

| Token | Value | Use |
|---|---|---|
| `--color-page` | `#14100c` Espresso | Background |
| `--color-surface` | `#1e1712` Umber | Tiles, placeholders |
| `--color-raised` | `#2b2119` Cocoa | Reserved for raised states |
| `--color-line` | `#3a2e24` Hairline | Glass borders, input borders |
| `--color-ink` | `#efe6d6` Bone | Primary text |
| `--color-muted` | `#a3937e` Taupe | Secondary text |
| `--color-accent` | `#c9a46a` Champagne | Actions, focus, the italic accent |
| `--color-woody` | `#9a6b43` Cedar | Woody family, wave tones |
| `--color-floral` | `#c4838f` Dusty rose | Floral family |
| `--color-citrus` | `#bdbe5c` Zest | Citrus family |
| `--color-oud` | `#8e3a45` Oxblood | Oud family |
| `--color-success`, `--color-warning`, `--color-danger` | `#7fa07a`, `#d98e48`, `#c4574f` | Status only |

Text contrast on the page background meets WCAG AA. Secondary text is the muted tone, never grey.

## Type

| Role | Face | Use |
|---|---|---|
| Display | Prata | Headings, product names, prices in the cart |
| Accent | Bodoni Moda italic (`Em`) | One gold italic phrase per heading at most |
| Body | Hanken Grotesk | Everything else |

Scale: `--text-xs` 0.75rem through `--text-4xl` 3.052rem, with `--text-display` capped at 6rem. Body text is never below 16px. Measure stays between 65 and 75 characters.

## Shape, depth and glass

- Radii: 10px for cards and tiles (`rounded-xl`), 4px for inputs (`rounded-md`), pills for small controls and captions (`rounded-pill`).
- Glass: `GlassPanel` and any caption over photography use `backdrop-blur-glass`, which is the single `--blur-glass` token (10px).
- Depth comes from the border and the blur. Shadows are not used.

## Components

| Component | File | Use |
|---|---|---|
| `Button` | `components/ui/button.tsx` | `primary` (solid gold), `secondary` (outline), `ghost` (text), `glass` (outlined translucent pill, the main action over photography) |
| `GlassPanel` | `components/ui/glass-panel.tsx` | Every card: filters, summaries, forms, account and admin panels |
| `Em` | `components/ui/em.tsx` | The italic accent phrase inside a heading |
| `Container` | `components/ui/container.tsx` | Page gutters and max width |
| `ProductImage` | `components/brand/product-image.tsx` | Real photography, or a tonal placeholder until it arrives |
| `WaveBackdrop` | `components/brand/wave-backdrop.tsx` | Closing and result banners only |
| `Skeleton` | `components/ui/skeleton.tsx` | Loading states |
| Scent card | `features/catalog/product-card.tsx` | Photograph, name, family dot, price |

Forms use native inputs with a visible border, an accent focus ring, and a red border with a message beside the field when invalid.

## Motion

- Entrances use `animate-hero-rise` (700 ms, exponential ease-out).
- Photographs scale slightly on hover, over 700 ms.
- The wave backdrop drifts slowly. The global reduced-motion rule stops all animation for users who ask for it.
- No motion is required to understand the interface.

## Accessibility

- Focus is always visible: a 2px champagne outline with an offset.
- Touch targets are at least 44px.
- Colour is never the only signal: low stock states use text, and the scent family dot has a name beside it.
- Filters, sort and quantity controls are native elements or labelled buttons.
- Decorative images and waves are `aria-hidden`.

## Scrollbars and selection

The scrollbar is thin and tonal: a `--color-line` thumb on the page colour, turning champagne on hover. Text selection uses champagne with dark text.

## Known gaps

- Four families and Best sellers were remodelled to editorial rows (2026-10-04) without a visual review. They are awaiting the owner's review.
- Admin and account data are mock data.
- The admin access code is a client-side demo gate, not security.
