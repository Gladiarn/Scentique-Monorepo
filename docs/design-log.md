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
