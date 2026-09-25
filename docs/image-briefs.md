# Image briefs

Every placeholder image in the build has an entry here. Copy the **prompt** into an image generator (or brief a photographer), save the result at the listed **path**, and it replaces the placeholder. Entries are added as each section is built. Nothing here is a real product photograph.

## Global style rules (apply to every prompt)

- Dark, warm, moody luxury still life. Deep espresso-brown backgrounds, soft directional light, subtle film grain.
- Warm highlights (amber, champagne gold); avoid pure white and cool blue tones.
- Generous negative space so text can sit over the image; product occupies about 40 to 60 percent of the frame.
- No visible logos, brand names or text on the bottle unless stated; leave label areas blank so the Scentique mark can be added.
- Real glass, real materials, natural shadows. No plastic-looking 3D render, no neon, no purple gradients.
- Deliver at least 2400 px on the long edge, sRGB, WebP or high-quality JPEG.

## Aspect ratios (only three formats, on purpose)

| Ratio | Size to generate | Used for |
|---|---|---|
| **16:9** landscape | 2560 x 1440 | Desktop hero, wide banners (story, closing call to action) |
| **4:5** portrait | 2000 x 2500 | Every product shot, collection tile, and the mobile hero |
| **1:1** square | not generated | Cart and search thumbnails are cropped from the 4:5 centre by code |

Avoid 4:3 and 9:16 (9:16 only if you later make a video or reel). Fewer formats means the whole catalogue looks like one shoot.

Composition rules:
- **Hero 16:9:** bottle in the right-centre (about 60 to 70 percent across), the left 45 percent calm and dark for the headline, the top 15 percent low detail because the header sits over it.
- **4:5 product shots:** bottle centred with at least 12 percent margin on every side, so the square thumbnail crop never cuts the cap.
- **Same lighting direction and background tone across the set.**

## Files supplied by the owner (current state)

Original photos live in `frontend/public/perfumes/` and are never modified. The site uses web-ready copies in `frontend/public/images/products/`.

| Original | Scent | Site file |
|---|---|---|
| `AMBRE FUMÉ.jpg` | Ambre Fumé | `products/ambre-fume.webp` (2x upscaled) |
| `BOIS FUMÉ PRÉCIEUX.jpg` | Bois Fumé Précieux | `products/bois-fume-precieux.webp` (2x upscaled); also traced to `hero/bois-fume-precieux-painted.svg` for the landing hero (`scripts/trace-perfume-art.py`) |
| `BOIS FUME PRECIEUX.jpg` | Bois Fumé Précieux, second bottle ("Aurélia Noire") | `products/bois-fume-precieux-2.webp` (gallery photo) |
| `lambre sauvage.jpg` | L'Ambre Sauvage | `products/l-ambre-sauvage.webp` |
| `AURA NOCTURNE.jpg` | L'Ambre Éternel | `products/l-ambre-eternel.webp` |
| `NOCTURNE ABSOLU.jpg` | Nocturne Absolu | `products/nocturne-absolu.webp` |
| `MYSTIQUE-BOIS.jpg` | Mystique Bois | `products/mystique-bois.webp` |

The earlier SVG traces of Sauvage and Éternel and the `Original/` folder are no longer used by the site. Cards show real photographs only (guarded by `media-integrity.test.ts`).

## Format for entries

```
### <id>: <what it is>
- Path: frontend/public/images/<file>
- Ratio: <w:h>, minimum size
- Used in: <section or page>
- Prompt: <full generation prompt>
- Alt text: <what a screen reader hears>
```

## Entries

### hero-desktop: signature scent hero
- Path: frontend/public/images/hero-desktop.webp
- Ratio: 16:9, 2560 x 1440
- Used in: landing hero
- Prompt: Cinematic dark luxury still life of a square amber-glass perfume flacon with a heavy dark marble-and-gold stopper, resting on a rough stone plinth, dark folded silk draped behind, cream orchids and vanilla pods at the lower right, warm directional amber light from the upper left, deep espresso-brown shadows, subtle film grain. Bottle sits right of centre, left 45 percent of the frame is soft dark silk with no detail, top 15 percent low detail. Label area blank. No text, no logos.
- Alt text: Ember Oud perfume bottle on a stone plinth among orchids and vanilla pods

### hero-mobile: signature scent hero, portrait
- Path: frontend/public/images/hero-mobile.webp
- Ratio: 4:5, 2000 x 2500
- Used in: landing hero on phones
- Prompt: Same scene and lighting as hero-desktop, recomposed for portrait: bottle centred in the lower two thirds, dark silk above with no detail for the header and headline.
- Alt text: Ember Oud perfume bottle on a stone plinth among orchids and vanilla pods

### collection-woody / collection-floral / collection-citrus / collection-oud
- Path: frontend/public/images/collection-<family>.webp
- Ratio: 4:5, 2000 x 2500 each
- Used in: landing collections, shop menu
- Prompt (per family): A perfume bottle centred with generous margin on a dark warm surface, soft directional amber light, film grain. Woody: smoked-glass bottle on a raw cedar plank with wood shavings. Floral: blush-tinted bottle beside dark roses and iris on velvet. Citrus: clear bottle with halved blood orange and green leaves on dark slate. Oud: dark amber bottle beside chunks of oud wood and resin on black stone. No text on the bottle.
- Alt text: <Family> collection bottle beside <its ingredient>

### product-<slug> (8 scents: ember-oud, bitter-orange-hour, night-iris, cedar-room, lemon-ash, petal-smoke, vetiver-rain, amber-nocturne)
- Path: frontend/public/images/product-<slug>.webp
- Ratio: 4:5, 2000 x 2500 each (plus two extra 4:5 shots per scent for the product page gallery later: an ingredient scene and a close-up of the cap)
- Used in: best sellers, shop, product page, cart
- Prompt: the per-product `promptBrief` in `frontend/src/data/mock/fixtures/products.ts`, on a deep espresso-brown surface, soft directional amber light, subtle film grain, bottle centred with 12 percent margin, label area blank.
- Alt text: <Name> perfume bottle

(More entries are added as further sections are built.)
