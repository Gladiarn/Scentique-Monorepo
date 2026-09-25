"""Builds the landing-hero artwork from the supplied traced SVGs in public/perfumes/.

For each scene it (1) drops the flat full-frame background rectangle, so the silk backdrop photo shows
through, The bottle caps are left exactly as traced (the owner prefers them). Originals are never modified. Usage: python3 scripts/prepare-hero-art.py
"""
import re

SRC = "public/perfumes/"
OUT = "public/images/hero/"

SCENES = {
    "l-ambre-sauvage.svg": "LAMBRE-SAUVAGE.svg",
    "l-ambre-eternel.svg": "L'AMBRE ÉTERNEL.svg",
}

for out_name, src in SCENES.items():
    s = open(SRC + src, encoding="utf-8").read()
    s = re.sub(r'<path d="M0 0 C[^"]*" fill="#[0-9A-Fa-f]{6}" transform="translate\(0,0\)"/>\n?', "", s, count=1)  # flat background
    open(OUT + out_name, "w", encoding="utf-8").write(s)
    print(out_name, "background removed; cap left as traced")
