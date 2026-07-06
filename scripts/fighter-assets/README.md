# Fighter sprite asset pipeline

The pixel fighter sprites in `/public/fighters/` are transparent PNGs derived
from the original AI-generated art (which was JPEG data with baked-in
backgrounds). The color customization system recolors them at runtime using
per-zone masks in `/public/fighters/masks/` plus luminance data in
`src/data/fighterZoneManifest.json`.

These scripts regenerate those assets. You only need them if the source art
changes. Requires Python 3 with Pillow and numpy.

## Pipeline

1. **`remove_bg.py <src_dir> <out_dir>`** — removes baked-in backgrounds via
   edge-connected flood fill against a border-sampled color palette. Sprites
   with fake checkerboard backgrounds (contender, hall-of-famer) and the
   hall-of-famer's translucent glow needed special-case handling — see the
   session that produced them; the general script covers flat backgrounds.

2. **`gen_masks.py`** — run from a directory containing `cut/` (the
   background-removed sprites). Generates the four zone masks
   (skin/hair/gloves/shoes) per stage using HSV color rules constrained to
   hand-tuned bounding boxes (`CONFIG` in the script), plus
   `masks/manifest.json` with each zone's luminance range (`lumLo`, `lumHi`,
   `lumMid`) used by the runtime gradient-map recolor in
   `src/utils/fighterRecolor.ts`. QA overlays are written to `check/` —
   always eyeball them after touching the rules or boxes.

3. **`gen_female.py`** — run after gen_masks from the same directory.
   Derives female variants (`female-<stage>.png`) from the male sprites:
   paints an athletic top over the chest (luminance-preserving, saved as
   the recolorable `top` zone mask) and draws a ponytail from the sprite's
   own hair palette (OR'd into the hair mask). Per-stage regions live in
   `CONFIG`. These are programmatic v1 sprites — to upgrade, generate
   female art with the same AI tool as the originals, save as
   `cut/female-<stage>.png` sources, and rerun the mask pipeline instead.

4. Downscale everything to 512×512 with nearest-neighbor, then copy:
   - sprites → `public/fighters/*.png`
   - masks → `public/fighters/masks/*.png`
   - manifest → `src/data/fighterZoneManifest.json`

## Runtime recolor model

Each masked pixel's luminance is normalized within its zone's `[lumLo, lumHi]`
range, then mapped onto a shadow → target → highlight ramp anchored at
`lumMid` (the zone's mean), so a zone's average color lands exactly on the
chosen swatch while the original shading survives.
