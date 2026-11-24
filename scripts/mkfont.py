"""Builds the B2W2 text web font from a font sheet.

Usage: python scripts/mkfont.py font-sheet.png public/assets/fonts/b2w2-text
(one sheet pixel = 64 font units, so the font is pixel-exact at 16px)
"""
import sys
from PIL import Image
from fontTools.fontBuilder import FontBuilder
from fontTools.pens.ttGlyphPen import TTGlyphPen

src, out = sys.argv[1], sys.argv[2]
f = Image.open(src)
W, H = f.size
px = f.load()
U = 64
MAIN = 1  # palette index of the glyph body (2 is the drop shadow, recreated in CSS)

ROWS = [
    ('ABCDEFGHIJKLMNOPQRSTUVWXYZ', (9, 19), None),
    ('abcdefghijklmnopqrstuvwxyz', (32, 44), None),
    ('0123456789', (54, 64), None),
    (',.:;!?“”‘’()…·~#%+-*/=', (77, 91), None),
    ('@○□△◇♠♥♦♣★♪', (119, 129), None),
    ('♂♀', (139, 148), 232),
]

def segments(y0, y1, xstart=0):
    cols = [x for x in range(xstart, W) if any(px[x, y] in (1, 2) for y in range(y0, y1 + 1))]
    segs, s, p = [], cols[0], cols[0]
    for x in cols[1:]:
        if x > p + 3:
            segs.append((s, p)); s = x
        p = x
    segs.append((s, p))
    return segs

glyphs = {}  # char -> (set of (x,y) pixels relative to left, baseline row), width
for chars, (y0, y1), xstart in ROWS:
    segs = segments(y0, y1, xstart or 0)[: len(chars)]
    assert len(segs) == len(chars), (chars, len(segs))
    # baseline for the row = bottom main-ink row of a reference glyph
    ref = {'A': 0, 'a': 0, '0': 0, ',': 4, '@': 0, '♂': 0}[chars[0]]
    rs, re_ = segs[ref]
    base = max(y for x in range(rs, re_ + 1) for y in range(y0, y1 + 1) if px[x, y] == MAIN)
    for ch, (s, e) in zip(chars, segs):
        pts = {(x - s, base - y) for x in range(s, e + 1) for y in range(y0, y1 + 1) if px[x, y] == MAIN}
        w = max(x for x, _ in pts) + 1
        glyphs[ch] = (pts, w)

# é = e + acute
e_pts, e_w = glyphs['e']
top = max(y for _, y in e_pts)
glyphs['é'] = (e_pts | {(3, top + 2), (4, top + 3)}, e_w)

def art(rows):  # rows top->bottom, last row sits on the baseline
    n = len(rows)
    pts = {(x, n - 1 - i) for i, r in enumerate(rows) for x, ch in enumerate(r) if ch == '#'}
    return pts, max(len(r) for r in rows)
glyphs['▶'] = art(['#....', '##...', '###..', '####.', '#####', '####.', '###..', '##...', '#....'])
glyphs['◀'] = art(['....#', '...##', '..###', '.####', '#####', '.####', '..###', '...##', '....#'])
_p, _w = art(['#######', '.#####.', '..###..', '...#...'])
glyphs['▼'] = ({(x, y + 2) for x, y in _p}, _w)
_p, _w = art(['#...#', '.#.#.', '..#..', '.#.#.', '#...#'])
glyphs['✕'] = ({(x, y + 1) for x, y in _p}, _w)
glyphs['×'] = glyphs['✕']
glyphs['&'] = art(['.##...', '#..#..', '#..#..', '.##...', '.#..#.', '#.#.#.', '#..#..', '#..##.', '.##..#'])
glyphs['—'] = ({(x, 4) for x in range(8)}, 8)
glyphs['–'] = ({(x, 4) for x in range(5)}, 5)
glyphs['|'] = ({(0, y) for y in range(-2, 10)}, 1)
glyphs["'"] = glyphs['’']
glyphs['"'] = glyphs['”']

order = ['.notdef', 'space'] + [f'u{ord(c):04X}' for c in glyphs]
cmap = {32: 'space'} | {ord(c): f'u{ord(c):04X}' for c in glyphs}
fb = FontBuilder(1024, isTTF=True)
fb.setupGlyphOrder(order)
fb.setupCharacterMap(cmap)

def draw(pts):
    pen = TTGlyphPen(None)
    for y in sorted({y for _, y in pts}):
        xs = sorted(x for x, yy in pts if yy == y)
        run = [xs[0], xs[0]]
        for x in xs[1:] + [None]:
            if x is not None and x == run[1] + 1:
                run[1] = x; continue
            x0, x1 = run[0] * U, (run[1] + 1) * U
            y0, y1 = y * U, (y + 1) * U
            pen.moveTo((x0, y0)); pen.lineTo((x0, y1)); pen.lineTo((x1, y1)); pen.lineTo((x1, y0)); pen.closePath()
            if x is not None: run = [x, x]
    return pen.glyph()

empty = TTGlyphPen(None).glyph()
gl = {'.notdef': empty, 'space': empty}
metrics = {'.notdef': (5 * U, 0), 'space': (5 * U, 0)}
for c, (pts, w) in glyphs.items():
    n = f'u{ord(c):04X}'
    gl[n] = draw(pts)
    metrics[n] = ((w + 1) * U, 0)
fb.setupGlyf(gl)
fb.setupHorizontalMetrics(metrics)
fb.setupHorizontalHeader(ascent=12 * U, descent=-4 * U)
fb.setupNameTable({'familyName': 'B2W2 Text', 'styleName': 'Regular'})
fb.setupOS2(sTypoAscender=12 * U, sTypoDescender=-4 * U, sTypoLineGap=0, usWinAscent=12 * U, usWinDescent=4 * U)
fb.setupPost()
fb.save(out + '.ttf')
fb.font.flavor = 'woff2'
fb.save(out + '.woff2')
print(len(glyphs), 'glyphs')
