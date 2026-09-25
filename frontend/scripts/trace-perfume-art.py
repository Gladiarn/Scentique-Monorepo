"""Makes the painterly SVG hero art from an original product PHOTO, keeping the curtain backdrop and the bottle stopper.

Same tool as the owner's supplied SVGs (visioncortex VTracer). The settings are tuned so the low-contrast curtain
folds survive: a high colour precision and a small layer difference. Tracing a photo with a near-black backdrop at
default settings flattens it to plain black, which also erases dark parts of the bottle.

Setup:  python3 -m venv v && v/bin/pip install vtracer
Usage:  v/bin/python scripts/trace-perfume-art.py "public/perfumes/AMBRE FUMÉ.jpg" public/images/hero/ambre-fume-painted.svg
Output is ~3 MB per image before gzip. Not part of the build.
"""
import sys
import vtracer

src, out = sys.argv[1], sys.argv[2]
vtracer.convert_image_to_svg_py(
    src, out,
    colormode="color", hierarchical="stacked", mode="spline",
    corner_threshold=60, length_threshold=4.0, max_iterations=10, splice_threshold=45,
    color_precision=8, layer_difference=7, filter_speckle=7, path_precision=1,
)
print("wrote", out)
