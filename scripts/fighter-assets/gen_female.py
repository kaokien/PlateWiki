#!/usr/bin/env python3
"""Generate female fighter variants from the male sprites.

Technique (programmatic v1 — replace with AI-generated art when available):
- Athletic top: warm-toned (skin) pixels inside a per-stage chest region are
  converted to fabric with a luminance-preserving gradient map, so muscle
  shading becomes fabric folds. The painted pixels are saved as an exact
  'top' zone mask, giving female fighters a recolorable top.
- Ponytail: a chunky tapered tail rooted at the back of the head, drawn from
  the sprite's own hair palette, only over transparent background so the
  body occludes it naturally. Tail pixels are OR'd into the hair mask so
  hair recoloring applies.
- Other zone masks are derived from the male masks (gloves/shoes unchanged,
  skin minus the painted top).

Run from a directory containing cut/ (transparent sprites) and masks/
(male masks + manifest.json). Outputs female-<stage>.png sprites into cut/
and female-<stage>-<zone>.png masks + updated manifest into masks/.
"""
import json, math
import numpy as np
from PIL import Image

CUT = 'cut'
MASKS = 'masks'
STAGES = ['prospect', 'contender', 'gatekeeper', 'rising-star', 'champion', 'hall-of-famer']

TOP_COLOR = (58, 60, 74)  # charcoal base; recolorable at runtime via 'top' zone

# per-stage config, coords in 1024-space:
#   top_box: chest region to convert; neck: ellipse (cx, cy, rx, ry) to scoop
#   excl: extra boxes to keep as skin; paint: False = reuse existing garment
#   tail: dict(root=0..1 within hair bbox, len=multiplier) or None
#   tail_root_y: explicit root row (1024-space) when there is no hair mask
CONFIG = {
    'prospect': {
        'paint': False,  # already wears a tank — it becomes the 'top' zone
        'top_box': (415, 270, 590, 470),
        'tail': {'root': 0.45, 'len': 2.2},
    },
    'contender': {
        'paint': True,
        'top_box': (408, 262, 648, 415),
        'neck': (553, 250, 46, 44),
        'excl': [(608, 285, 700, 400)],
        'tail': {'root': 0.42, 'len': 2.2},
    },
    'gatekeeper': {
        'paint': True,
        'top_box': (545, 300, 718, 485),
        'neck': (600, 298, 52, 44),
        'tail': {'root': 0.5, 'len': 2.0},
        # headgear hides hair; tail emerges behind the neck below it
        'tail_root_y': 275,
        'tail_root_x': 505,
        'tail_palette': ((60, 40, 28), (110, 78, 52), (160, 120, 84)),
    },
    'rising-star': {
        'paint': True,
        'top_box': (420, 300, 620, 440),
        'neck': (520, 295, 42, 38),
        'tail': {'root': 0.55, 'len': 3.0},
    },
    'champion': {
        'paint': True,
        'top_box': (460, 260, 640, 420),
        'neck': (560, 255, 42, 38),
        'tail': {'root': 0.5, 'len': 2.2},
    },
    'hall-of-famer': {
        'paint': True,
        'top_box': (475, 320, 600, 435),
        'neck': (545, 320, 38, 34),
        'tail': {'root': 0.5, 'len': 2.0},
        'alpha_thresh': 200,  # allow the tail to draw over the translucent glow
    },
}

def gradient_map(l, target):
    target = np.array(target, dtype=np.float64)
    shadow = target * 0.30
    light = target + (255 - target) * 0.45
    t = np.clip((l - 0.05) / 0.55, 0, 1)[:, None]
    return shadow + (light - shadow) * t

def load_mask(path, shape):
    try:
        return np.asarray(Image.open(path).convert('L')) > 128
    except FileNotFoundError:
        return np.zeros(shape, dtype=bool)

def build_female(stage):
    cfg = CONFIG[stage]
    arr = np.asarray(Image.open(f'{CUT}/{stage}.png').convert('RGBA')).astype(np.float64)
    H, W = arr.shape[:2]
    S = W / 1024.0
    out = arr.copy()
    lum = (0.2126*arr[...,0] + 0.7152*arr[...,1] + 0.0722*arr[...,2]) / 255.0
    alpha_thresh = cfg.get('alpha_thresh', 128)
    opaque = arr[...,3] > alpha_thresh
    warm = arr[...,0] >= arr[...,2]

    def box(x0, y0, x1, y1):
        m = np.zeros((H, W), dtype=bool)
        m[int(y0*S):int(y1*S), int(x0*S):int(x1*S)] = True
        return m

    def ellipse(cx, cy, rx, ry):
        yy, xx = np.mgrid[0:H, 0:W]
        return ((xx - cx*S)/(rx*S))**2 + ((yy - cy*S)/(ry*S))**2 <= 1

    gloves_m = load_mask(f'{MASKS}/{stage}-gloves.png', (H, W))
    shoes_m = load_mask(f'{MASKS}/{stage}-shoes.png', (H, W))
    skin_m = load_mask(f'{MASKS}/{stage}-skin.png', (H, W))
    hair_m = load_mask(f'{MASKS}/{stage}-hair.png', (H, W))

    # ── top ──
    if cfg['paint']:
        top_mask = box(*cfg['top_box']) & (arr[...,3] > 128) & warm & ~gloves_m
        if 'neck' in cfg:
            top_mask &= ~ellipse(*cfg['neck'])
        for b in cfg.get('excl', []):
            top_mask &= ~box(*b)
        out[...,:3][top_mask] = gradient_map(lum[top_mask], TOP_COLOR)
    else:
        # reuse the painted garment (prospect's tank): light neutral pixels
        mx = arr[...,:3].max(axis=2)/255.0
        mn = arr[...,:3].min(axis=2)/255.0
        sat = np.where(mx > 0, (mx - mn)/np.maximum(mx, 1e-6), 0)
        top_mask = box(*cfg['top_box']) & (arr[...,3] > 128) & (sat < 0.30) & (mx > 0.55) & ~gloves_m

    # ── ponytail ──
    tail_mask = np.zeros((H, W), dtype=bool)
    if cfg.get('tail'):
        if hair_m.any():
            ys, xs = np.nonzero(hair_m)
            hy0, hy1 = ys.min(), ys.max()
            hx0 = xs.min()
            hair_px = arr[hair_m][:, :3]
            hl = lum[hair_m]
            dark = np.clip(hair_px[hl < np.percentile(hl, 20)].mean(axis=0) * 0.8, 0, 255)
            base = hair_px[(hl >= np.percentile(hl, 30)) & (hl < np.percentile(hl, 70))].mean(axis=0)
            lite = np.clip(hair_px[hl >= np.percentile(hl, 80)].mean(axis=0) * 1.2 + 15, 0, 255)
            tail_top = int(hy0 + (hy1 - hy0) * cfg['tail']['root'])
            hair_h = hy1 - hy0
            root_x = hx0 + int(14 * S)
        else:
            dark, base, lite = (np.array(c, dtype=np.float64) for c in cfg['tail_palette'])
            tail_top = int(cfg['tail_root_y'] * S)
            hair_h = int(70 * S)
            root_x = int(cfg['tail_root_x'] * S)
        tail_len = int(hair_h * cfg['tail']['len'])
        BLOCK = max(2, int(3 * S * 2))
        canvas = np.zeros((H, W), dtype=np.uint8)
        for i in range(tail_len):
            y = tail_top + i
            if y >= H:
                break
            t = i / tail_len
            width = max(3, int(32 * S * (1.0 - 0.6 * t**1.4)))
            drift = int(16 * S * t)
            x_right = root_x - drift
            for dx in range(width):
                xx = x_right - dx
                if 0 <= xx < W:
                    edge = dx < 2 or dx >= width - 2 or i > tail_len - 5
                    shade = 1 if edge else (3 if width//5 < dx < width//2 - 1 else 2)
                    canvas[y, xx] = shade
        small = canvas[::BLOCK, ::BLOCK]
        canvas = np.kron(small, np.ones((BLOCK, BLOCK), dtype=np.uint8))[:H, :W]
        tail_mask = (canvas > 0) & ~opaque
        for code, col in ((1, dark), (2, base), (3, lite)):
            m = tail_mask & (canvas == code)
            out[...,:3][m] = col
            out[...,3][m] = 255
        # hair-tie accent at the root
        for y in range(tail_top, min(tail_top + 2 * BLOCK, H)):
            for x in np.nonzero(tail_mask[y])[0]:
                out[y, x, :3] = (170, 40, 40)

    # ── write sprite + masks ──
    Image.fromarray(out.astype(np.uint8)).save(f'{CUT}/female-{stage}.png')
    female_masks = {
        'skin': skin_m & ~top_mask,
        'hair': hair_m | tail_mask,
        'gloves': gloves_m,
        'shoes': shoes_m,
        'top': top_mask,
    }
    out_lum = (0.2126*out[...,0] + 0.7152*out[...,1] + 0.0722*out[...,2]) / 255.0
    entry = {}
    for zone, m in female_masks.items():
        Image.fromarray(np.where(m, 255, 0).astype(np.uint8)).convert('1').save(
            f'{MASKS}/female-{stage}-{zone}.png', optimize=True)
        if m.any():
            zl = out_lum[m]
            lo = float(np.percentile(zl, 4))
            hi = float(np.percentile(zl, 96))
            t = np.clip((zl - lo) / max(hi - lo, 1e-3), 0, 1)
            entry[zone] = {'lumLo': round(lo, 3), 'lumHi': round(hi, 3),
                           'lumMid': round(float(t.mean()), 3), 'px': int(m.sum())}
        else:
            entry[zone] = {'lumLo': 0, 'lumHi': 1, 'lumMid': 0.5, 'px': 0}
    print(f'female-{stage}', {z: e['px'] for z, e in entry.items()})
    return entry

def main():
    manifest = json.load(open(f'{MASKS}/manifest.json'))
    for stage in STAGES:
        manifest[f'female-{stage}'] = build_female(stage)
    json.dump(manifest, open(f'{MASKS}/manifest.json', 'w'), indent=2)

if __name__ == '__main__':
    main()
