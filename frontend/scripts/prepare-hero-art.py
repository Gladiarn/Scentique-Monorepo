"""Builds the landing-hero artwork from the supplied traced SVGs in public/perfumes/.

For each scene it (1) drops the flat full-frame background rectangle, so the silk backdrop photo shows
through, and (2) replaces the broken, floating stopper fragments the tracer produced with a clean
vector cap. Originals are never modified. Usage: python3 scripts/prepare-hero-art.py
"""
import re

SRC = "public/perfumes/"
OUT = "public/images/hero/"

# name -> (source file, region that holds the broken cap fragments, cap geometry)
SCENES = {
    "l-ambre-sauvage.svg": dict(
        src="LAMBRE-SAUVAGE.svg",
        region=(750, 920, 104, 166),
        cap=dict(x=762, y=117, w=147, h=60, rx=9),
        neck=dict(x=806, y=175, w=58, h=10),
    ),
    "l-ambre-eternel.svg": dict(
        src="L'AMBRE ÉTERNEL.svg",
        region=(635, 855, 115, 190),
        cap=dict(x=642, y=119, w=208, h=68, rx=12),
        neck=dict(x=699, y=185, w=84, h=26),
    ),
}

PATH = re.compile(r'<path d="([^"]*)" fill="(#[0-9A-Fa-f]{6})" transform="translate\(([-\d.]+),([-\d.]+)\)"/>\n?')


def bbox(d, tx, ty):
    nums = list(map(float, re.findall(r"-?\d+\.?\d*", d)))
    xs, ys = nums[0::2], nums[1::2]
    return min(xs) + float(tx), max(xs) + float(tx), min(ys) + float(ty), max(ys) + float(ty)


def is_grey(fill):
    r, g, b = (int(fill[i:i + 2], 16) for i in (1, 3, 5))
    return r - b <= 10  # neutral or blue-tinted: the stopper fragments, never the warm collar


def cap_svg(scene, uid):
    c, n = scene["cap"], scene["neck"]
    return f"""<defs>
<linearGradient id="cap-{uid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5a5d67"/><stop offset="0.18" stop-color="#3b3d45"/><stop offset="1" stop-color="#16171b"/></linearGradient>
<linearGradient id="capside-{uid}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0.16"/><stop offset="0.12" stop-color="#fff" stop-opacity="0"/><stop offset="0.88" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.35"/></linearGradient>
<linearGradient id="neck-{uid}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#5b4529"/><stop offset="0.35" stop-color="#b8935c"/><stop offset="1" stop-color="#5b4529"/></linearGradient>
</defs>
<rect x="{n['x']}" y="{n['y']}" width="{n['w']}" height="{n['h']}" fill="url(#neck-{uid})"/>
<rect x="{c['x']}" y="{c['y']}" width="{c['w']}" height="{c['h']}" rx="{c['rx']}" fill="url(#cap-{uid})"/>
<rect x="{c['x']}" y="{c['y']}" width="{c['w']}" height="{c['h']}" rx="{c['rx']}" fill="url(#capside-{uid})"/>
<rect x="{c['x'] + c['rx']}" y="{c['y'] + 3}" width="{c['w'] - 2 * c['rx']}" height="2" rx="1" fill="#c9ccd6" opacity="0.5"/>
"""


for out_name, scene in SCENES.items():
    s = open(SRC + scene["src"], encoding="utf-8").read()
    s = re.sub(r'<path d="M0 0 C[^"]*" fill="#[0-9A-Fa-f]{6}" transform="translate\(0,0\)"/>\n?', "", s, count=1)  # flat background
    xa, xb, ya, yb = scene["region"]
    removed = 0

    def drop(m):
        global removed
        d, fill, tx, ty = m.groups()
        x0, x1, y0, y1 = bbox(d, tx, ty)
        if is_grey(fill) and x0 >= xa and x1 <= xb and y0 >= ya and y1 <= yb:
            removed += 1
            return ""
        return m.group(0)

    s = PATH.sub(drop, s)
    s = s.replace("</svg>", cap_svg(scene, out_name.split(".")[0]) + "</svg>")
    open(OUT + out_name, "w", encoding="utf-8").write(s)
    print(out_name, "removed", removed, "broken cap fragments")
