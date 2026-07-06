#!/usr/bin/env python3
"""Generate per-zone recolor masks (skin/hair/gloves/shoes) for each fighter
sprite, from the background-removed PNGs in ./cut.

Approach: color rules (HSV ranges) constrained to hand-tuned spatial boxes.
Outputs grayscale mask PNGs + manifest JSON with per-zone luminance ranges
for runtime normalization. Overlay previews written to ./check for visual QA.
"""
import json, colorsys
import numpy as np
from PIL import Image

CUT = 'cut'
OUT = 'masks'
CHECK = 'check'

def hsv(rgb):
    r = rgb[..., 0] / 255.0
    g = rgb[..., 1] / 255.0
    b = rgb[..., 2] / 255.0
    mx = np.max(rgb / 255.0, axis=-1)
    mn = np.min(rgb / 255.0, axis=-1)
    diff = mx - mn + 1e-9
    h = np.zeros_like(mx)
    m = (mx == r); h[m] = (60 * ((g - b) / diff) % 360)[m]
    m = (mx == g); h[m] = (60 * ((b - r) / diff) + 120)[m]
    m = (mx == b); h[m] = (60 * ((r - g) / diff) + 240)[m]
    s = np.where(mx > 0, diff / (mx + 1e-9), 0)
    return h, s, mx

def box_mask(shape, boxes):
    # boxes are authored in 1024-space; scale to the actual sprite size
    m = np.zeros(shape, dtype=bool)
    scale = shape[1] / 1024.0
    for (x0, y0, x1, y1) in boxes:
        m[int(y0*scale):int(y1*scale), int(x0*scale):int(x1*scale)] = True
    return m

# color rules -----------------------------------------------------------
def rule_skin(h, s, v):
    return (h > 8) & (h < 40) & (s > 0.18) & (s < 0.72) & (v > 0.30)

def rule_red(h, s, v):
    # strict: gloves/boots are highly saturated true red; skin shading and
    # jaw highlights sit below this saturation and off this hue
    return (((h < 14) | (h > 340)) & (s > 0.63) & (v > 0.28))

def rule_gold(h, s, v):
    return (h > 28) & (h < 62) & (s > 0.35) & (v > 0.40)

def rule_glow(h, s, v):
    # pale gold glow around glowing gloves
    return (h > 25) & (h < 70) & (s > 0.12) & (v > 0.55)

def rule_dark(h, s, v):
    return v < 0.40

def rule_light_neutral(h, s, v):
    return (s < 0.30) & (v > 0.55)

def rule_skin_tight(h, s, v):
    return (h > 8) & (h < 34) & (s > 0.22) & (s < 0.62) & (v > 0.30) & (v < 0.93)

def rule_brown_dark(h, s, v):
    # hair: dark or brown
    return (v < 0.65)

RULES = {
    'skin': rule_skin, 'red': rule_red, 'gold': rule_gold,
    'dark': rule_dark, 'light': rule_light_neutral, 'brown': rule_brown_dark,
    'skin_tight': rule_skin_tight,
    'glow': rule_glow,
}

# per-sprite config: zone -> (rule names OR'd, boxes in 1024-space) -------
# boxes: (x0, y0, x1, y1)
CONFIG = {
    'prospect': {
        'hair':   (['brown'], [(430, 80, 650, 265)]),
        'gloves': (['light'], [(468, 298, 558, 392), (598, 268, 684, 382)]),
        'shoes':  (['dark'],  [(280, 830, 395, 950), (560, 788, 705, 940)]),
        'skin':   (['skin'],  [(0, 0, 1024, 1024)]),
    },
    'contender': {
        'hair':   (['brown'], [(470, 90, 670, 235)]),
        'gloves': (['red'],   [(545, 258, 660, 385), (638, 262, 768, 452)]),
        'shoes':  (['dark', 'red'], [(225, 800, 345, 955), (610, 790, 765, 950)]),
        'skin':   (['skin'],  [(0, 0, 1024, 1024)]),
    },
    'gatekeeper': {
        'hair':   (['brown'], []),  # headgear covers hair
        'gloves': (['red'],   [(130, 250, 300, 420), (520, 320, 700, 480)]),
        'shoes':  (['dark', 'red'], [(340, 785, 565, 955), (770, 795, 940, 935)]),
        'skin':   (['skin'],  [(0, 0, 1024, 1024)]),
    },
    'rising-star': {
        'hair':   (['brown'], [(450, 140, 610, 265)]),
        'gloves': (['gold', 'glow'], [(210, 60, 400, 260), (650, 60, 840, 260)]),
        'shoes':  (['dark', 'gold'], [(250, 815, 430, 1000), (585, 810, 750, 990)]),
        'skin':   (['skin'],  [(0, 0, 1024, 1024)]),
    },
    'champion': {
        'hair':   (['brown'], [(480, 130, 650, 245)]),
        'gloves': (['red'],   [(260, 10, 450, 200), (640, 370, 820, 540)]),
        'shoes':  (['dark', 'red'], [(235, 795, 405, 990), (635, 770, 810, 975)]),
        'skin':   (['skin'],  [(0, 0, 1024, 805)]),
    },
    'hall-of-famer': {
        'hair':   (['brown'], [(500, 168, 655, 232)]),
        'gloves': (['gold'],  [(410, 230, 590, 420), (670, 220, 850, 410)]),
        'shoes':  (['dark', 'gold'], [(235, 795, 425, 990), (615, 790, 785, 985)]),
        'skin':   (['skin_tight'],  [(0, 0, 1024, 790)]),
    },
}

ZONE_COLORS = {  # overlay QA colors
    'skin': (0, 255, 0), 'hair': (0, 128, 255),
    'gloves': (255, 0, 255), 'shoes': (0, 255, 255),
}

def clean_mask(m, min_px=140):
    """Remove connected components smaller than min_px — stray pixels the
    color rules caught outside the intended region (mat shadows, skin
    highlights). Legit zone regions are thousands of pixels."""
    from collections import deque
    h, w = m.shape
    seen = np.zeros((h, w), dtype=bool)
    out = m.copy()
    ys, xs = np.nonzero(m)
    for y0, x0 in zip(ys, xs):
        if seen[y0, x0]:
            continue
        q = deque([(y0, x0)])
        seen[y0, x0] = True
        pts = []
        while q:
            y, x = q.popleft()
            pts.append((y, x))
            for ny, nx in ((y-1,x),(y+1,x),(y,x-1),(y,x+1)):
                if 0 <= ny < h and 0 <= nx < w and m[ny, nx] and not seen[ny, nx]:
                    seen[ny, nx] = True
                    q.append((ny, nx))
        if len(pts) < min_px:
            for y, x in pts:
                out[y, x] = False
    return out

def main():
    import os
    os.makedirs(OUT, exist_ok=True)
    manifest = {}
    for name, zones in CONFIG.items():
        im = Image.open(f'{CUT}/{name}.png').convert('RGBA')
        arr = np.asarray(im)
        rgb = arr[..., :3].astype(np.float64)
        alpha = arr[..., 3]
        opaque = alpha > 128
        h, s, v = hsv(rgb)
        lum = (0.2126 * rgb[..., 0] + 0.7152 * rgb[..., 1] + 0.0722 * rgb[..., 2]) / 255.0

        # order matters: specific zones claim pixels first, skin gets the rest
        claimed = np.zeros(opaque.shape, dtype=bool)
        masks = {}
        for zone in ['hair', 'gloves', 'shoes', 'skin']:
            rules, boxes = zones[zone]
            if not boxes:
                masks[zone] = np.zeros(opaque.shape, dtype=bool)
                continue
            colorm = np.zeros(opaque.shape, dtype=bool)
            for rname in rules:
                colorm |= RULES[rname](h, s, v)
            m = colorm & box_mask(opaque.shape, boxes) & opaque & ~claimed
            if zone in ('gloves', 'shoes'):
                m = clean_mask(m, min_px=max(20, int(140 * (opaque.shape[1] / 1024.0) ** 2)))
            claimed |= m
            masks[zone] = m

        manifest[name] = {}
        base = (rgb * 0.25).astype(np.uint8)  # dimmed for overlay
        overlay = np.dstack([base, np.where(opaque, 255, 0).astype(np.uint8)])
        for zone, m in masks.items():
            Image.fromarray(np.where(m, 255, 0).astype(np.uint8)).save(f'{OUT}/{name}-{zone}.png')
            if m.any():
                zl = lum[m]
                lo = float(np.percentile(zl, 4))
                hi = float(np.percentile(zl, 96))
                # mean of the normalized luminance — anchors the runtime
                # recolor ramp so the zone's average lands on the target color
                t = np.clip((zl - lo) / max(hi - lo, 1e-3), 0, 1)
                manifest[name][zone] = {
                    'lumLo': round(lo, 3),
                    'lumHi': round(hi, 3),
                    'lumMid': round(float(t.mean()), 3),
                    'px': int(m.sum()),
                }
                c = ZONE_COLORS[zone]
                for i in range(3):
                    overlay[..., i][m] = int(base[..., i][m].mean() * 0.3) + int(c[i] * 0.7)
            else:
                manifest[name][zone] = {'lumLo': 0, 'lumHi': 1, 'lumMid': 0.5, 'px': 0}
        Image.fromarray(overlay).convert('RGB').save(f'{CHECK}/zones-{name}.png')
        print(name, {z: manifest[name][z]['px'] for z in masks})
    with open(f'{OUT}/manifest.json', 'w') as f:
        json.dump(manifest, f, indent=2)

if __name__ == '__main__':
    main()
