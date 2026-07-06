# Female fighter sprite generation brief

The current `female-<stage>.png` sprites are programmatic edits of the male
art (a top painted over the torso) and don't read as female. This brief is
for regenerating them properly with an image-generation model. Follow it
exactly — the specs make the output drop-in compatible with the existing
ingestion pipeline (`remove_bg.py` → `gen_masks.py`) and the runtime
recolor system.

## Hard requirements (every image)

- **Square, 1024×1024** (will be downscaled to 512).
- **Full body, single character, centered**, feet visible, nothing cropped.
- **Flat solid background in one uniform color** (plain light gray `#e8e8e8`
  works well). NO gradients, NO checkerboard "transparency" pattern, NO
  drop shadows outside the character. The background is removed by
  edge-connected flood fill — anything non-flat leaks into the sprite.
- **Style**: 16-bit / SNES-era arcade fighting-game pixel art, chunky visible
  pixels, dark outlines, saturated colors — must sit next to the existing
  male sprites in `/public/fighters/` without looking like a different game.
- **Distinctly female**: feminine face, athletic-but-not-bodybuilder build,
  and a clearly female hairstyle (high ponytail or braid recommended — it
  also makes the hair zone easy to isolate).
- **Zone separability** (the runtime recolors these regions independently —
  each needs a distinct color family in the source art):
  - skin (one consistent tone)
  - hair (NOT the same hue as gloves or outfit)
  - gloves / hand wraps
  - shoes / boots
  - sports top (this zone exists only on female sprites)
  - Example safe palette: brown hair, red gloves, white shoes, teal top.
    Avoid: red hair + red gloves, black shoes + black shorts blending.

## Per-stage prompts

Each stage mirrors the male sprite's costume tier, pose, and energy.
Suggested base prompt, then per-stage details:

> "16-bit SNES arcade fighting game pixel art sprite, full body female
> boxer, centered on a flat solid light-gray background, chunky pixels,
> dark outlines, saturated colors, {STAGE DETAILS}"

1. **prospect** — beginner teen, slim build, white sports top, red shorts,
   white hand wraps (no gloves), white sneakers, brown ponytail, nervous
   but determined guard-up stance.
2. **contender** — fit amateur, gray sports top, black shorts, red boxing
   gloves, black boots with red laces, dark ponytail, compact boxing
   stance on a gray training mat (keep the mat SMALL and flat-colored).
3. **gatekeeper** — seasoned club fighter, red headgear, red gloves,
   red-and-black shorts, black sports top, mid-punch action pose with a
   small white impact star at the fist.
4. **rising-star** — confident athlete, golden gloves raised overhead in
   victory pose, black-and-gold shorts and top, gold-trimmed boots,
   "VICTORY" waistband, hair in a high bun.
5. **champion** — champion wearing an open purple robe over a black sports
   top, huge championship belt at the waist, red gloves, red boots,
   standing in a small spotlight pool (flat ellipse, one color).
6. **hall-of-famer** — legendary golden-armored outfit with a crown and
   cape, gold gloves, glowing gold aura (keep the aura TIGHT to the body,
   hard-edged pixels, no soft translucency — soft glows break background
   removal), regal power stance.

## After generating

1. Save as `female-prospect.png` … `female-hall-of-famer.png`.
2. Drop them in a folder and tell Claude Code — ingestion from there is:
   `remove_bg.py` (background removal) → downscale to 512 →
   `gen_masks.py` with female-tuned zone boxes (Claude adjusts the CONFIG
   spatial boxes + HSV rules per sprite and QA-checks the `check/`
   overlays) → manifest merge → done. The customizer toggle, recolor
   system, and per-zone shop colors all pick the new art up automatically.
