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
