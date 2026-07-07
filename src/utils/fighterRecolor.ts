/**
 * athlete Recolor — applies customization colors to sprite zones at runtime.
 *
 * The sprites in /public/athletes/ are transparent PNGs. For each evolution
 * stage there are four zone masks in /public/athletes/masks/ (skin, hair,
 * gloves, shoes) generated offline from the sprite art, plus a manifest
 * (fighterZoneManifest.json) with each zone's luminance range.
 *
 * Recoloring is a luminance-normalized gradient map: each masked pixel's
 * luminance is normalized within its zone's range, then mapped onto a
 * shadow -> target -> highlight ramp anchored at the zone's mean luminance,
 * so the zone's average color lands on the chosen swatch while shading is
 * preserved.
 */
import manifest from '@/data/fighterZoneManifest.json';
import {
  SKIN_TONES, HAIR_COLORS, GLOVE_COLORS, SHOE_COLORS, TOP_COLORS,
  type FighterCustomization,
} from '@/data/fighterSprites';

type Zone = 'skin' | 'hair' | 'gloves' | 'shoes' | 'top';

interface ZoneInfo { lumLo: number; lumHi: number; lumMid: number; px: number }

const ZONES: Zone[] = ['skin', 'hair', 'gloves', 'shoes', 'top'];

const SPRITE_SIZE = 512;

/**
 * Sprite/manifest key for a stage + body type. Female variants live under
 * a "female-" prefix (female-prospect.png, masks/female-prospect-skin.png).
 */
export function spriteKey(stageId: string, custom?: FighterCustomization | null): string {
  return custom?.bodyType === 'female' ? `female-${stageId}` : stageId;
}

/** Resolve the hex color chosen for each zone from a customization. */
function zoneColors(custom: FighterCustomization): Record<Zone, string> {
  return {
    skin: SKIN_TONES[custom.skinTone]?.hex ?? SKIN_TONES[1].hex,
    hair: HAIR_COLORS[custom.hairColor]?.hex ?? HAIR_COLORS[1].hex,
    gloves: GLOVE_COLORS[custom.gloveColor]?.hex ?? GLOVE_COLORS[0].hex,
    shoes: SHOE_COLORS[custom.shoeColor]?.hex ?? SHOE_COLORS[0].hex,
    top: TOP_COLORS[custom.topColor]?.hex ?? TOP_COLORS[0].hex,
  };
}

export function recolorCacheKey(stageId: string, custom: FighterCustomization): string {
  return `${spriteKey(stageId, custom)}:${custom.skinTone}.${custom.hairColor}.${custom.gloveColor}.${custom.shoeColor}.${custom.topColor}`;
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load ${src}`));
    img.src = src;
  });
}

function imageToPixels(img: HTMLImageElement): Uint8ClampedArray {
  const canvas = document.createElement('canvas');
  canvas.width = SPRITE_SIZE;
  canvas.height = SPRITE_SIZE;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, 0, 0, SPRITE_SIZE, SPRITE_SIZE);
  return ctx.getImageData(0, 0, SPRITE_SIZE, SPRITE_SIZE).data;
}

/** Shadow -> target -> highlight ramp, anchored at the zone's mean luminance. */
function ramp(t: number, target: [number, number, number], mid: number): [number, number, number] {
  const m = Math.min(Math.max(mid, 0.15), 0.85);
  const out: [number, number, number] = [0, 0, 0];
  for (let i = 0; i < 3; i++) {
    const shadow = target[i] * 0.25;
    const light = target[i] + (255 - target[i]) * 0.65;
    out[i] = t < m
      ? shadow + (target[i] - shadow) * (t / m)
      : target[i] + (light - target[i]) * ((t - m) / (1 - m));
  }
  return out;
}

const cache = new Map<string, Promise<string | null>>();

/**
 * Returns a data URL of the stage sprite recolored with the given
 * customization, or null if recoloring isn't possible (missing masks,
 * canvas unavailable). Results are cached per stage + color combo.
 */
export function getRecoloredSprite(
  stageId: string,
  custom: FighterCustomization,
): Promise<string | null> {
  if (typeof document === 'undefined') return Promise.resolve(null);
  const key = recolorCacheKey(stageId, custom);
  const hit = cache.get(key);
  if (hit) return hit;

  const promise = (async (): Promise<string | null> => {
    const assetKey = spriteKey(stageId, custom);
    const stageManifest = (manifest as Record<string, Record<string, ZoneInfo>>)[assetKey];
    if (!stageManifest) return null;

    const base = await loadImage(`/athletes/${assetKey}.png`);
    const canvas = document.createElement('canvas');
    canvas.width = SPRITE_SIZE;
    canvas.height = SPRITE_SIZE;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.drawImage(base, 0, 0, SPRITE_SIZE, SPRITE_SIZE);
    const imageData = ctx.getImageData(0, 0, SPRITE_SIZE, SPRITE_SIZE);
    const px = imageData.data;

    const colors = zoneColors(custom);
    const activeZones = ZONES.filter(z => stageManifest[z] && stageManifest[z].px > 0);
    const maskPixels = await Promise.all(
      activeZones.map(z => loadImage(`/athletes/masks/${assetKey}-${z}.png`).then(imageToPixels)),
    );

    for (let zi = 0; zi < activeZones.length; zi++) {
      const zone = activeZones[zi];
      const { lumLo, lumHi, lumMid } = stageManifest[zone];
      const range = Math.max(lumHi - lumLo, 0.001);
      const target = hexToRgb(colors[zone]);
      const mask = maskPixels[zi];
      for (let i = 0; i < px.length; i += 4) {
        if (mask[i] < 128 || px[i + 3] < 8) continue;
        const lum = (0.2126 * px[i] + 0.7152 * px[i + 1] + 0.0722 * px[i + 2]) / 255;
        const t = Math.min(Math.max((lum - lumLo) / range, 0), 1);
        const [r, g, b] = ramp(t, target, lumMid);
        px[i] = r; px[i + 1] = g; px[i + 2] = b;
      }
    }

    ctx.putImageData(imageData, 0, 0);
    return canvas.toDataURL('image/png');
  })().catch(() => null);

  cache.set(key, promise);
  return promise;
}
