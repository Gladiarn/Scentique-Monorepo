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

## 2026-09-25: Cap fixed at the root; hero layout for narrower desktops

- **Cause of the "cropped" cap:** the traced SVG never drew the black stopper. It was the flat black background showing through, with grey highlight fragments on top. Removing the background for the curtain removed the stopper body too. `scripts/prepare-hero-art.py` now restores a solid stopper body and stem in the removed background's colour, underneath the original traced highlights.
- **Hero at about 1100 px wide:** the headline was crossing the bottle. Below 1280 px the glass card is hidden, the headline is narrower, and the scent name becomes a link at the bottom left. The glass card shows from 1280 px up.

## 2026-09-25: Stopper and shadows: stop removing the background

- **What went wrong:** the traced art's background rectangle is the same colour as the stopper body and the ground shadows, so any attempt to remove the background also removed them. Redrawing the stopper (twice) looked wrong.
- **Decision:** the painterly art is used exactly as supplied, with its own dark background. In the hero its outer edges are feathered into the silk curtain with a CSS radial mask (`ART_MASK` in `hero-slider.tsx`), so the stopper, the shadows and the original look stay intact while the curtain shows around them. `scripts/prepare-hero-art.py` was deleted.

## 2026-09-25: Painterly hero art re-made from the original photos

- **Why:** the supplied Sauvage/Éternel SVGs are traces that flattened the curtain to black and never drew the stopper (it was the black background). Every attempt to cut that background out lost the stopper and the shadows.
- **Decision:** re-trace the ORIGINAL photos with the same tool (VTracer), tuned to keep the curtain folds, the smoke and the stopper (`frontend/scripts/trace-perfume-art.py`). Done for Ambre Fumé and Bois Fumé Précieux (the originals we have). The Sauvage and Éternel SVGs are used as supplied with feathered edges until their original photos are provided.
- **Hero order:** Ambre Fumé, Bois Fumé Précieux, L'Ambre Sauvage, L'Ambre Éternel. The real photos remain on shop tiles.

## 2026-09-25: Hero is one static image: Bois Fumé Précieux

- **Decision (user):** Bois Fumé Précieux (the painted photo trace) is the landing hero. The slider is removed: no arrows, swipe, keyboard control or changing background.
- **Card:** frosted glass card with the scent name, concentration, its real photo as the thumbnail, tagline, price and Explore. Below 1280 px it becomes a slim glass bar at the bottom.
- **Config:** the featured scent is `siteConfig.heroProductSlug`. If it is missing, the hero falls back to the first featured scent, so it is never empty.
- **Removed:** slider, next-thumbnail button, edge feathering, and the Ambre Fumé painted trace. The trace recipe stays in `scripts/trace-perfume-art.py`. The Sauvage and Éternel SVGs remain in the data for shop tiles.

## 2026-09-26: Cards use the untouched original art for L'Ambre Sauvage and L'Ambre Éternel

- **Decision (user):** outside the landing hero, cards (Four families, Best sellers, and later shop and product pages) must use the original supplied images for these two scents, not any processed version.
- **How:** byte-for-byte copies of the supplied originals live at `frontend/public/images/products/l-ambre-{sauvage,eternel}.svg` under new file names that nothing else touches (a new URL also defeats stale browser caches). A test (`original-art.test.ts`) fails if these differ from `public/perfumes/Original/*.svg` or if a card points anywhere else. The old copies in `public/images/hero/` were removed.

## 2026-09-26: Real photos for every card; new perfumes

- **Supplied:** real photos of L'Ambre Sauvage and L'Ambre Éternel (the latter is `AURA NOCTURNE.jpg`, its label reads "L'Ambre Éternel"), two new scents (Nocturne Absolu, Mystique Bois), and a second Bois Fumé Précieux bottle.
- **Decision (user):** do not use the `Original` folder. Cards use real photographs everywhere; the traced SVG copies were removed. Best sellers now shows Ambre Fumé (featured), Bois Fumé Précieux, Nocturne Absolu and Mystique Bois; the Floral card uses the real Sauvage photo.
- **Catalog:** 7 real scents plus 4 placeholders without photos. Nocturne Absolu (oud) and Mystique Bois (woody) notes, taglines and prices are placeholders derived from what is visible in the photos.

## 2026-09-26: Category photos for Four families; Best sellers static via the repository

- **Categories:** the four family tiles use the supplied ingredient still-lifes (wood, florals, citrus, oud), so every tile has a real photograph and there are no placeholders. Small tiles (Oud, Citrus) show the name only, so text is not laid over busy detail.
- **Best sellers (user decision):** static for now; the real ranking comes with the backend. The UI asks `productRepository.findBestSellers(limit)`; the mock returns a fixed ranked list (`fixtures/best-sellers.ts`), the API version will rank by sales. Swapping is one method, no UI change.
- **glad-frontend audit:** no component imports mock or API classes; each data section is wrapped in a `SectionBoundary` (error with retry) plus a Suspense skeleton (loading) plus an empty state; `NEXT_PUBLIC_MOCK_FAILURE_RATE=1` forces the error states.

## 2026-09-26: Closing waves in tonal browns

- **Decision (user):** waves use different browns instead of oxblood and gold. The front wave matches the page background, and each wave behind it is a lighter brown (more `--color-woody` mixed into the page colour). The sky above is the lightest brown.
- **Where to adjust:** the `brown(percent)` values in `components/brand/wave-backdrop.tsx`. Tests check that the front wave is the page colour, that lightness increases toward the back, and that no oxblood or gold is used.

## 2026-09-26: Waves on both edges (no line); one glass blur

- **Closing section:** the waves are mirrored onto the top edge so the dark testimonials blend into the brown sky (the outermost wave on each edge is the page colour). A gilt hairline was tried and removed at the owner's request: it read as a border. The heading has more top room so it does not sit on the wave edges.
- **Glass (user):** one consistent, light glass. `--blur-glass: 10px` in `tokens.css`, used as `backdrop-blur-glass` everywhere (hero card, chips, buttons, header, dropdown, About captions, mobile bar). Previously there were three strengths (4, 12 and 24 px). `glass.test.ts` fails if any other backdrop blur strength is added.

## 2026-09-26: Closing section made compact; shared glass pill button

- **Decision (user):** the closing "Not sure where to start?" section is waves plus text only, no glass card. It was too tall: it is now about 430 px on desktop (from about 720), with the current text sizes (heading 39 to 49 px).
- **Consistency (user):** "Find your scent" is the same button as the hero's "Discover collection". It is now one shared variant, `Button variant="glass"`, and computed styles were verified identical (radius, uppercase, letter-spacing, 10px blur, height, border).
- **No lines:** the footer's top border was removed and the wave zones bleed 1px past the section edges so no hairline shows where the waves meet the sections above and below.
- **Cards are glass:** the quiz card in Four families and the process card in About are glass panels. The direction is recorded as binding "Design principles" in the frontend plan and the spec.
