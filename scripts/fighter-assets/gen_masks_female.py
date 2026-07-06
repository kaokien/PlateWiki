#!/usr/bin/env python3
"""Generate per-zone recolor masks for the FEMALE fighter sprites.

Reuses the machinery from gen_masks.py (HSV rules, box scaling, component
cleanup) with female-specific zone boxes authored against the generated art
in female_512/ (boxes in 1024-space, auto-scaled). Female sprites add a
'top' zone (sports top) on top of the male zone set.

Run from scripts/fighter-assets/:  python3 gen_masks_female.py
Outputs: female_masks/female-<stage>-<zone>.png + manifest.json,
QA overlays in female_check/.
"""
import json
import numpy as np
from PIL import Image

from gen_masks import hsv, box_mask, clean_mask, RULES, ZONE_COLORS

CUT = 'female_512'
OUT = 'female_masks'
CHECK = 'female_check'


def rule_gray(h, s, v):
    # mid-gray garment (contender top): desaturated, mid-value
    return (s < 0.28) & (v > 0.34) & (v < 0.88)


RULES = dict(RULES, gray=rule_gray)
ZONE_COLORS = dict(ZONE_COLORS, top=(255, 160, 0))

# zone -> (rule names OR'd, boxes in 1024-space); claim order below
CONFIG = {
    'female-prospect': {
        'hair':   (['brown'], [(375, 130, 620, 330)]),
        'gloves': (['light'], [(462, 308, 558, 404), (592, 285, 672, 395)]),
        'shoes':  (['light'], [(315, 795, 425, 930), (555, 775, 705, 925)]),
        # tank is white with red trim — include both so the top recolors as
        # one garment (gloves claim their white pixels first)
        'top':    (['light', 'red'], [(420, 270, 605, 485)]),
        'skin':   (['skin'],  [(0, 0, 1024, 1024)]),
    },
    'female-contender': {
        'hair':   (['dark'],  [(415, 120, 620, 285)]),
        'gloves': (['red'],   [(430, 245, 720, 435)]),
        'shoes':  (['dark', 'red'], [(290, 755, 435, 915), (575, 750, 710, 905)]),
        'top':    (['gray'],  [(430, 270, 605, 470)]),
        'skin':   (['skin'],  [(0, 0, 1024, 1024)]),
    },
    'female-gatekeeper': {
        # hair box stops above the headgear band — the broad 'brown' rule
        # would otherwise claim dark-red headgear pixels
        'hair':   (['brown'], [(430, 105, 590, 172)]),
        'gloves': (['red'],   [(395, 290, 520, 430), (760, 270, 900, 400)]),
        # 'dark' only: white laces/soles stay white (mat inside the boxes is
        # light and must not be claimed)
        'shoes':  (['dark'],  [(255, 760, 405, 900), (605, 750, 735, 895)]),
        'top':    (['dark'],  [(455, 330, 620, 470)]),
        'skin':   (['skin'],  [(0, 0, 1024, 1024)]),
    },
    'female-rising-star': {
        'hair':   (['dark'],  [(415, 140, 600, 270)]),
        'gloves': (['gold', 'glow'], [(280, 55, 420, 220), (600, 55, 740, 220)]),
        'shoes':  (['dark', 'gold'], [(320, 820, 450, 990), (570, 820, 700, 990)]),
        'top':    (['dark'],  [(430, 320, 620, 490)]),
        'skin':   (['skin'],  [(0, 0, 1024, 1024)]),
    },
    'female-champion': {
        'hair':   (['dark'],  [(430, 85, 600, 310)]),
        'gloves': (['red'],   [(300, 455, 450, 610), (585, 455, 730, 610)]),
        'shoes':  (['red', 'dark'], [(340, 770, 480, 960), (565, 770, 710, 960)]),
        'top':    (['dark'],  [(430, 290, 590, 375)]),
        'skin':   (['skin'],  [(0, 0, 1024, 790)]),
    },
    'female-hall-of-famer': {
        'hair':   (['dark'],  [(415, 175, 610, 280)]),
        'gloves': (['gold'],  [(620, 215, 770, 360)]),
        # boot boxes start below the knee — the gold rule overlaps tan skin
        # hues, so shin pixels inside a taller box get claimed as shoes
        'shoes':  (['gold', 'dark'], [(285, 745, 415, 935), (610, 740, 735, 935)]),
        'top':    (['gold'],  [(430, 300, 620, 500)]),
        'skin':   (['skin_tight'], [(0, 0, 1024, 760)]),
    },
}

# specific zones claim pixels first; skin takes the remainder
CLAIM_ORDER = ['hair', 'gloves', 'shoes', 'top', 'skin']


def main():
    import os
    os.makedirs(OUT, exist_ok=True)
    os.makedirs(CHECK, exist_ok=True)
    manifest = {}
    for name, zones in CONFIG.items():
        im = Image.open(f'{CUT}/{name}.png').convert('RGBA')
        arr = np.asarray(im)
        rgb = arr[..., :3].astype(np.float64)
        alpha = arr[..., 3]
        opaque = alpha > 128
        h, s, v = hsv(rgb)
        lum = (0.2126 * rgb[..., 0] + 0.7152 * rgb[..., 1] + 0.0722 * rgb[..., 2]) / 255.0

        claimed = np.zeros(opaque.shape, dtype=bool)
        masks = {}
        for zone in CLAIM_ORDER:
            rules, boxes = zones[zone]
            if not boxes:
                masks[zone] = np.zeros(opaque.shape, dtype=bool)
                continue
            colorm = np.zeros(opaque.shape, dtype=bool)
            for rname in rules:
                colorm |= RULES[rname](h, s, v)
            m = colorm & box_mask(opaque.shape, boxes) & opaque & ~claimed
            if zone in ('gloves', 'shoes', 'top'):
                m = clean_mask(m, min_px=max(20, int(140 * (opaque.shape[1] / 1024.0) ** 2)))
            claimed |= m
            masks[zone] = m

        manifest[name] = {}
        base = (rgb * 0.25).astype(np.uint8)
        overlay = np.dstack([base, np.where(opaque, 255, 0).astype(np.uint8)])
        for zone, m in masks.items():
            Image.fromarray(np.where(m, 255, 0).astype(np.uint8)).save(f'{OUT}/{name}-{zone}.png')
            if m.any():
                zl = lum[m]
                lo = float(np.percentile(zl, 4))
                hi = float(np.percentile(zl, 96))
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
