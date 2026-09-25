# Design log

Decisions are appended as they are approved, newest last. Each entry: date, what was decided, why.

## 2026-09-25: Direction pinned

- **World:** dark, warm, luxurious, editorial, product-led. Pinned by the user's reference image; no concept roll needed.
- **Palette (proposed, to be tuned by eye in Phase 2):** Espresso `#14100C`, Umber `#1E1712`, Cocoa `#2B2119`, Hairline `#3A2E24`, Bone `#EFE6D6`, Taupe `#A3937E`, Champagne `#C9A46A`. Scent families: Cedar `#9A6B43` (woody), Dusty rose `#C4838F` (floral), Zest `#BDBE5C` (citrus), Oxblood `#8E3A45` (oud). Gold is the action colour only.
- **Type:** decided by eye on the `/design` specimen page. Shortlist: Gilda Display, Bodoni Moda, Zodiak (display); Hanken Grotesk, Albert Sans (body).
- **Logo:** placeholder wordmark component; user supplies the real logo.
- **Images:** placeholders with written briefs in `docs/image-briefs.md`; user generates or shoots the real ones.
- **Landing page workflow:** designed section by section, top to bottom, with user approval after each section.

## 2026-09-25: Palette, fonts and logo approved

- **Palette:** approved as proposed (Espresso, Umber, Cocoa, Hairline, Bone, Taupe, Champagne; scent tints Cedar, Dusty rose, Zest, Oud oxblood).
- **Type:** Gilda Display (headlines) + Hanken Grotesk (body). The other candidates were removed.
- **Logo:** supplied by the owner; extracted and traced to vectors in `public/brand/` (see `docs/brand-assets.md`). Navbar shows the name only; footer shows the full lockup; the icon is the favicon.
- **Landing page:** a full draft exists for colour preview only. Sections are now refined one at a time from the top, each approved before the next.

## 2026-09-25: Reference locked, header rebuilt

- **Reference:** a dark full-bleed luxury hero (Luxoria). The header floats over the photo, lockup at the left, centred nav with chevrons and an active dot, hairline icons, gold bag badge.
- **Header behaviour (user-specified):** at the top it is tall with the full lockup; on scroll it shrinks to a slim solid bar and the logo swaps to the wordmark only.
- **Icons:** one hairline set at 1.25 stroke to match the logo line weight.
- **Image ratios:** 16:9 for wide images, 4:5 for everything else (see docs/image-briefs.md).

## 2026-09-25: Hero slider with the supplied perfume photography

- **Look:** follows the reference: full-bleed photo, headline left, outlined pill call to action, family chips, frosted-glass card (translucent, blurred, hairline edge) at the right showing the current scent and a thumbnail of the next.
- **Slider:** left and right arrows (also arrow keys and touch swipe), no autoplay, so each scent can be judged for the hero. Slides are the featured scents from the data layer.
- **Supplied images:** Ambre Fumé and Bois Fumé Précieux are 1376x768 JPEGs (good). L'Ambre Éternel and L'Ambre Sauvage arrived as SVG auto-traces of photos: posterized, garbled labels, detached stopper. Kept in the slider for comparison only; the original photos are needed.
- **Resolution:** a photo cannot gain real detail from a format change. Upscaled 2x with a neural super-resolution model (EDSR) for the JPEGs; the real fix is regenerating at 2560 px or wider.
- **Mobile:** the wide photo fills the top 68% of the screen and the headline sits below in the fade; arrows sit on the photo.

## 2026-09-25: Painterly hero art on a silk backdrop; real photos stay for product pages

- **Hero look (user-approved):** the painterly traced artwork for L'Ambre Éternel and L'Ambre Sauvage, layered over a crumpled-silk backdrop (`public/images/hero/silk-backdrop.webp`, built from the silk in the Ambre Fumé photo with a warm studio glow and film grain). The flat traced background was dull; the silk restores the original scene's depth.
- **Stopper repair:** the tracer lost each bottle's cap (grey fragments floating above the collar). `frontend/scripts/prepare-hero-art.py` removes the fragments and draws a clean vector cap. It reads the untouched originals in `public/perfumes/`.
- **Photos vs artwork:** each product image is tagged `role: "hero"` (landing artwork) or `photo` (real photograph). The landing hero prefers hero artwork; shop and product pages prefer real photos (`lib/media.ts`). The original JPEGs stay untouched in `public/perfumes/`.
- **Still needed:** original photographs of L'Ambre Éternel and L'Ambre Sauvage. Until then their shop tiles reuse the painterly art.

## 2026-09-25: Typography, layout and section changes

- **Header:** border removed (no line in either state).
- **Display font:** Prata replaces Gilda Display for headlines and bold text. Compared by eye against the logo wordmark (Marcellus, Cinzel, Forum, Bodoni Moda, Prata, Gilda, Italiana, Cormorant SC); Prata is closest in weight and contrast and reads well in lowercase. Hanken Grotesk stays for body (the logo's tagline is a fine sans).
- **Hero:** plain dark background, L'Ambre Sauvage first, painterly art only (2 slides). Waves removed from the hero.
- **Waves:** self-hosted, capsule-render-style layered waving gradient (`WaveBackdrop`), used only in the closing "Not sure where to start?" section.
- **Curtain backdrop:** moved out of the hero into the About bento tile.
- **Bento layouts:** About (curtain statement tile, real ingredient close-ups cropped from the supplied photos, process tile), Four families (large, tall and small tiles plus a quiz tile), Best sellers (featured scent with notes pyramid, small tiles, wide tile). Layouts were changed on purpose to move away from the reference's centred hero / equal-card rows.
- **Crop per slide:** each painted bottle has its own mobile and desktop crop position so it lands between the headline and the glass card.

## 2026-09-25: Hero matches the reference; original cap restored

- **Hero:** full-bleed silk photo (`silk-backdrop.webp`) behind the painterly perfume, headline with one accent phrase in gold italic, frosted glass card, pill call to action, family chips. Waves stay only in the closing section. The silk is also used in the About bento tile.
- **Accent words:** `Em` component, Bodoni Moda Italic in the accent colour, one phrase per heading (hero, About, Four families, Best sellers, testimonials, closing).
- **Cap:** the owner prefers the original traced cap over the redrawn one. The repair was removed; `scripts/prepare-hero-art.py` now only strips the flat background.
- **Robustness:** the hero falls back to product photos if no scent has hero artwork, so it can never render empty (`buildHeroSlides`).
