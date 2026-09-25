# Regenerates public/brand/*.svg from the supplied logo JPEG. Needs: python3 -m venv v && v/bin/pip install potracer numpy pillow
# Not part of the build. Prefer replacing the SVGs with the designer's original vector files.
import numpy as np, potrace
from PIL import Image, ImageFilter

SRC = "/home/ianne/Scentique/frontend/public/Logo/Scentique-Logo.jpg"
OUT = "/home/ianne/Scentique/frontend/public/brand/"
S = 4  # upscale factor before tracing
GOLD, TAG = "#BA9762", "#A3937E"

im = np.asarray(Image.open(SRC).convert("RGB")).astype(np.float32)
H, W = im.shape[:2]
lum = im.mean(axis=2)
gold_cov = np.clip((im[..., 0] - im[..., 2]) / 88.0, 0, 1)
tag_cov = np.clip((135.0 - lum) / (135.0 - 94.0), 0, 1)

def bitmap(cov, y0, y1, x0=0, x1=None):
    x1 = x1 or W
    sub = Image.fromarray((cov[y0:y1, x0:x1] * 255).astype(np.uint8), "L")
    sub = sub.resize((sub.width * S, sub.height * S), Image.BICUBIC).filter(ImageFilter.GaussianBlur(1.6))
    return np.asarray(sub) > 127

def trace(mask, turd=90):
    plist = potrace.Bitmap(np.logical_not(mask)).trace(turdsize=turd, alphamax=1.0, opticurve=True, opttolerance=0.35)
    d = []
    for c in plist:
        s = c.start_point
        d.append(f"M{s.x:.1f} {s.y:.1f}")
        for seg in c.segments:
            if seg.is_corner:
                d.append(f"L{seg.c.x:.1f} {seg.c.y:.1f}L{seg.end_point.x:.1f} {seg.end_point.y:.1f}")
            else:
                d.append(f"C{seg.c1.x:.1f} {seg.c1.y:.1f} {seg.c2.x:.1f} {seg.c2.y:.1f} {seg.end_point.x:.1f} {seg.end_point.y:.1f}")
        d.append("Z")
    return "".join(d)

def bbox(mask, pad=8 * S):
    ys, xs = np.where(mask)
    return max(0, xs.min() - pad), max(0, ys.min() - pad), min(mask.shape[1], xs.max() + pad), min(mask.shape[0], ys.max() + pad)

parts = {}
for name, cov, y0, y1, fill in (("mark", gold_cov, 315, 594, GOLD), ("wordmark", gold_cov, 632, 752, GOLD), ("tagline", tag_cov, 760, 792, TAG)):
    m = bitmap(cov, y0, y1)
    x0, ya, x1, yb = bbox(m)
    m = m[ya:yb, x0:x1]
    parts[name] = (trace(m), m.shape[1], m.shape[0], fill)
    print(name, "viewbox", m.shape[1], "x", m.shape[0], "path chars", len(parts[name][0]))

def svg(paths, w, h, extra=""):
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w // S}" height="{h // S}">{extra}{paths}</svg>\n'

for name, (d, w, h, fill) in parts.items():
    open(f"{OUT}scentique-{name}.svg", "w").write(svg(f'<path fill="{fill}" fill-rule="evenodd" d="{d}"/>', w, h))

# lockup: mark over wordmark over tagline, centered
gap1, gap2 = 34 * S, 22 * S
cw = max(p[1] for p in parts.values())
ch = parts["mark"][2] + gap1 + parts["wordmark"][2] + gap2 + parts["tagline"][2]
y = 0
groups = []
for name, gap in (("mark", gap1), ("wordmark", gap2), ("tagline", 0)):
    d, w, h, fill = parts[name]
    groups.append(f'<g transform="translate({(cw - w) // 2} {y})"><path fill="{fill}" fill-rule="evenodd" d="{d}"/></g>')
    y += h + gap
open(f"{OUT}scentique-lockup.svg", "w").write(svg("".join(groups), cw, ch))
print("lockup", cw, "x", ch)
