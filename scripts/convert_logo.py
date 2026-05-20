"""Render the firm logo (Adobe Illustrator source) into the web assets
used by the site. Run from the repo root: python3 scripts/convert_logo.py
Outputs go to public/assets/."""
import io

import fitz  # pymupdf
from PIL import Image

SRC = "brand/logo-source.ai"
NAVY = (11, 61, 110)
WHITE = (255, 255, 255)

doc = fitz.open(SRC)
page = doc[0]
pix = page.get_pixmap(matrix=fitz.Matrix(6.0, 6.0), alpha=True)
img = Image.open(io.BytesIO(pix.tobytes("png"))).convert("RGBA")
doc.close()

# Knock out the near-white background.
px = img.load()
w, h = img.size
for y in range(h):
    for x in range(w):
        r, g, b, a = px[x, y]
        if r > 244 and g > 244 and b > 244:
            px[x, y] = (r, g, b, 0)

img = img.crop(img.getbbox())
w, h = img.size


def recolor(src, rgb):
    out = src.copy()
    p = out.load()
    for y in range(out.size[1]):
        for x in range(out.size[0]):
            p[x, y] = (rgb[0], rgb[1], rgb[2], p[x, y][3])
    return out


# Full lockup (column mark + wordmark), white for dark backgrounds.
recolor(img, WHITE).save("public/assets/logo-mft-white.png")

# Find the empty horizontal band separating the column mark from the
# "DESPACHO DE ABOGADOS" wordmark, then isolate the mark.
px = img.load()
mark_bottom, seen, run = h, False, 0
for y in range(h):
    filled = any(px[x, y][3] > 20 for x in range(w))
    if filled:
        seen, run = True, 0
    elif seen:
        run += 1
        if run >= 8:
            mark_bottom = y - run + 1
            break

mark = img.crop((0, 0, w, mark_bottom))
mark = mark.crop(mark.getbbox())
mark.save("public/assets/logo-mark.png")
recolor(mark, WHITE).save("public/assets/logo-mark-white.png")

# Favicon: padded square canvas.
side = max(mark.size)
pad = int(side * 0.12)
canvas = Image.new("RGBA", (side + 2 * pad, side + 2 * pad), (0, 0, 0, 0))
canvas.paste(
    mark,
    ((canvas.size[0] - mark.size[0]) // 2, (canvas.size[1] - mark.size[1]) // 2),
    mark,
)
canvas.resize((256, 256), Image.LANCZOS).save("public/assets/favicon.png")

print("logo assets generated")
