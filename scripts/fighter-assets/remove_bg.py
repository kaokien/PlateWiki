#!/usr/bin/env python3
"""Remove baked-in backgrounds from AI-generated fighter sprites.

Strategy: sample border pixels to build a background palette (handles flat
colors AND fake checkerboard patterns), then BFS from all edge pixels,
expanding into any pixel within tolerance of a palette color. Only the
edge-connected background component is removed, so light/gray details
inside the character survive.
"""
import sys
from collections import deque
from PIL import Image
import numpy as np

def build_border_palette(rgb, k=6):
    """Cluster border-ring pixels into up to k palette colors."""
    h, w, _ = rgb.shape
    ring = np.concatenate([
        rgb[0:8, :, :].reshape(-1, 3),
        rgb[-8:, :, :].reshape(-1, 3),
        rgb[:, 0:8, :].reshape(-1, 3),
        rgb[:, -8:, :].reshape(-1, 3),
    ]).astype(np.float64)
    # simple k-means
    rng = np.random.default_rng(42)
    centers = ring[rng.choice(len(ring), size=k, replace=False)]
    for _ in range(12):
        d = np.linalg.norm(ring[:, None, :] - centers[None, :, :], axis=2)
        labels = d.argmin(axis=1)
        for i in range(k):
            pts = ring[labels == i]
            if len(pts):
                centers[i] = pts.mean(axis=0)
    # keep clusters holding >2% of border pixels
    keep = []
    for i in range(k):
        frac = (labels == i).mean()
        if frac > 0.02:
            keep.append(centers[i])
    return np.array(keep)

def remove_background(path, out_path, tol=28.0, extra_palette=None):
    img = Image.open(path).convert('RGB')
    rgb = np.asarray(img).astype(np.int16)
    h, w, _ = rgb.shape

    palette = build_border_palette(rgb)
    if extra_palette is not None:
        palette = np.concatenate([palette, np.array(extra_palette, dtype=np.float64)])

    # distance of each pixel to nearest palette color
    dmin = np.full((h, w), 1e9)
    for c in palette:
        d = np.sqrt(((rgb - c.reshape(1, 1, 3)) ** 2).sum(axis=2))
        dmin = np.minimum(dmin, d)
    is_bg_color = dmin < tol

    # BFS from edges through bg-colored pixels
    visited = np.zeros((h, w), dtype=bool)
    q = deque()
    for x in range(w):
        for y in (0, h - 1):
            if is_bg_color[y, x] and not visited[y, x]:
                visited[y, x] = True
                q.append((y, x))
    for y in range(h):
        for x in (0, w - 1):
            if is_bg_color[y, x] and not visited[y, x]:
                visited[y, x] = True
                q.append((y, x))
    while q:
        y, x = q.popleft()
        for ny, nx in ((y-1,x),(y+1,x),(y,x-1),(y,x+1)):
            if 0 <= ny < h and 0 <= nx < w and not visited[ny, nx] and is_bg_color[ny, nx]:
                visited[ny, nx] = True
                q.append((ny, nx))

    alpha = np.where(visited, 0, 255).astype(np.uint8)

    out = np.dstack([rgb.astype(np.uint8), alpha])
    Image.fromarray(out, 'RGBA').save(out_path)
    removed = visited.mean()
    print(f"{path} -> {out_path}: removed {removed:.1%} of pixels, palette={len(palette)}")

if __name__ == '__main__':
    import os
    src_dir = sys.argv[1]
    out_dir = sys.argv[2]
    os.makedirs(out_dir, exist_ok=True)
    # process every png in the source dir (male set, female set, or both)
    names = sorted(f[:-4] for f in os.listdir(src_dir) if f.endswith('.png'))
    for n in names:
        remove_background(f"{src_dir}/{n}.png", f"{out_dir}/{n}.png")
