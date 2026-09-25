# Brand assets

## Provenance

- **Source:** `frontend/public/Logo/Scentique-Logo.jpg` (944x1117), supplied by the project owner. It has a fake transparency checkerboard baked into the pixels.
- **Also supplied:** `Scentique-Logo.svg`, an automatic trace of that JPEG that also traced the checkerboard (4,649 paths, 1 MB, letters C, E, Q, U filled solid). Not usable, left untouched.
- **Derived vectors:** `frontend/public/brand/scentique-{mark,wordmark,tagline,lockup}.svg`. Made by isolating the gold artwork by colour, upscaling 4x, and tracing with potrace (`frontend/scripts/trace-logo.py`). Gold `#BA9762`, tagline `#A3937E`.
- **Favicons:** `frontend/src/app/icon.svg`, `icon.png`, `apple-icon.png`, generated from the mark on the espresso background.

## Known limitation

The source is low resolution, so the traced outlines keep a slight hand-drawn irregularity. It is invisible at navbar, footer and favicon sizes and only shows above roughly 500 px wide.

## Replacing with the designer's originals

Overwrite the four SVGs in `public/brand/` (keep the file names) and regenerate the favicons. Only `components/brand/logo.tsx` references them.
