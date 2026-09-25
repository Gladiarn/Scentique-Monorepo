"""Builds the landing-hero artwork from the supplied traced SVGs in public/perfumes/.

For each scene it (1) drops the flat full-frame background rectangle, so the silk backdrop photo shows
through, Originals are never modified. Usage: python3 scripts/prepare-hero-art.py
"""
import re

SRC = "public/perfumes/"
OUT = "public/images/hero/"

# The tracer never drew the black stopper: it was the flat black background showing through, with a few
# grey highlight fragments on top. Once the background is removed the stopper body disappears, so it is put
# back as solid shapes in the same colour as the removed background, underneath the traced highlights.
SCENES = {
    "l-ambre-sauvage.svg": dict(
        src="LAMBRE-SAUVAGE.svg",
        body=[(762, 112, 148, 51, 9), (806, 160, 41, 24, 0)],  # stopper slab, stem down to the collar
    ),
    "l-ambre-eternel.svg": dict(
        src="L'AMBRE ÉTERNEL.svg",
        body=[(640, 118, 211, 68, 12), (697, 180, 86, 34, 0)],
    ),
}

BG = re.compile(r'<path d="M0 0 C[^"]*" fill="(#[0-9A-Fa-f]{6})" transform="translate\(0,0\)"/>\n?')

for out_name, scene in SCENES.items():
    svg = open(SRC + scene["src"], encoding="utf-8").read()
    bg = BG.search(svg)
    fill = bg.group(1)
    svg = BG.sub("", svg, count=1)  # flat background
    shapes = "".join(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{fill}"/>' for x, y, w, h, rx in scene["body"])
    svg = re.sub(r"(<svg[^>]*>)", lambda m: m.group(1) + shapes, svg, count=1)  # under everything else
    open(OUT + out_name, "w", encoding="utf-8").write(svg)
    print(out_name, "background removed, stopper body restored in", fill)
