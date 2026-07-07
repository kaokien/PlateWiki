'use client';

// ForestGarden — canvas pixel-art plant layer for the Virtual Gym viewport.
// Renders two stacked canvases: a back layer behind the walking avatar and a
// front layer in front of it (foreground plants the character walks behind).
// Everything is drawn at half CSS resolution and upscaled with
// image-rendering: pixelated so the plants share the chunky pixel density of
// the character sprites and forest background.

import React, { useEffect, useRef } from 'react';
import {
  PALETTE,
  SPECIES,
  spriteForPlant,
  stageForGrowth,
  TUFT_A,
  TUFT_B,
  ROCK,
  STUMP,
  type Sprite,
} from '@/lib/forestSprites';
import type { PlantPlot } from '@/lib/gardenState';

// Canvas internal resolution = CSS pixels / RENDER_SCALE.
const RENDER_SCALE = 2;
const FRAME_MS = 120;

type Layer = 'back' | 'front';

// x/y are % of the viewport (y = base of the plant); px = art-pixel size in
// internal canvas units. Order matches DEFAULT_PLOTS in gardenState.ts.
const PLOT_LAYOUT: { x: number; y: number; px: number; layer: Layer }[] = [
  { x: 9, y: 72, px: 4, layer: 'back' },   // pine
  { x: 91, y: 72, px: 4, layer: 'back' },  // apple tree
  { x: 22, y: 56, px: 2, layer: 'back' },  // flower
  { x: 78, y: 57, px: 2, layer: 'back' },  // berry bush
  { x: 16, y: 98, px: 4, layer: 'front' }, // herb patch
  { x: 84, y: 97, px: 4, layer: 'front' }, // mushrooms
];

const DECOR: { sprite: Sprite; x: number; y: number; px: number; layer: Layer }[] = [
  { sprite: ROCK, x: 60, y: 57, px: 2, layer: 'back' },
  { sprite: STUMP, x: 30, y: 60, px: 2, layer: 'back' },
  { sprite: TUFT_A, x: 42, y: 61, px: 2, layer: 'back' },
  { sprite: TUFT_B, x: 52, y: 74, px: 2, layer: 'back' },
  { sprite: TUFT_A, x: 68, y: 68, px: 2, layer: 'back' },
  { sprite: TUFT_B, x: 14, y: 80, px: 2, layer: 'back' },
  { sprite: TUFT_A, x: 88, y: 82, px: 2, layer: 'back' },
  { sprite: TUFT_B, x: 36, y: 96, px: 3, layer: 'front' },
  { sprite: TUFT_A, x: 65, y: 98, px: 3, layer: 'front' },
];

const spriteCache = new Map<string, HTMLCanvasElement>();

function rasterize(sprite: Sprite, px: number, outline = true): HTMLCanvasElement {
  const key = `${sprite.join('|')}@${px}${outline ? 'o' : ''}`;
  const cached = spriteCache.get(key);
  if (cached) return cached;

  const w = sprite[0].length;
  const h = sprite.length;
  // Extra 1-art-pixel margin so the outline isn't clipped.
  const canvas = document.createElement('canvas');
  canvas.width = (w + 2) * px;
  canvas.height = (h + 2) * px;
  const ctx = canvas.getContext('2d')!;

  const filled = (row: number, col: number) =>
    row >= 0 && row < h && col >= 0 && col < w && !!PALETTE[sprite[row][col]];

  if (outline) {
    // Dark outline around every filled pixel — separates plants from the
    // busy forest background, standard pixel-art readability trick.
    ctx.fillStyle = PALETTE.O;
    for (let row = -1; row <= h; row++) {
      for (let col = -1; col <= w; col++) {
        if (filled(row, col)) continue;
        if (
          filled(row - 1, col) || filled(row + 1, col) ||
          filled(row, col - 1) || filled(row, col + 1)
        ) {
          ctx.fillRect((col + 1) * px, (row + 1) * px, px, px);
        }
      }
    }
  }

  for (let row = 0; row < h; row++) {
    for (let col = 0; col < w; col++) {
      const color = PALETTE[sprite[row][col]];
      if (!color) continue;
      ctx.fillStyle = color;
      ctx.fillRect((col + 1) * px, (row + 1) * px, px, px);
    }
  }
  spriteCache.set(key, canvas);
  return canvas;
}

interface DrawItem {
  sprite: Sprite;
  x: number; // % of viewport, sprite base center
  y: number;
  px: number;
  sways: boolean;
  phase: number;
  shadow: boolean;
  outline: boolean;
}

function drawItem(ctx: CanvasRenderingContext2D, item: DrawItem, time: number, w: number, h: number) {
  const raster = rasterize(item.sprite, item.px, item.outline);
  const cx = Math.round((item.x / 100) * w);
  const baseY = Math.round((item.y / 100) * h);
  const drawX = cx - Math.round(raster.width / 2);
  // The raster has a 1-art-pixel outline margin; anchor the sprite content's
  // bottom row (not the margin) to baseY.
  const drawY = baseY - raster.height + item.px;

  if (item.shadow) {
    ctx.fillStyle = 'rgba(10, 18, 12, 0.35)';
    const sw = Math.round(raster.width * 0.7);
    ctx.fillRect(cx - Math.round(sw / 2), baseY - item.px, sw, item.px);
    ctx.fillRect(cx - Math.round(sw / 3), baseY, Math.round(sw * 0.66), item.px);
  }

  if (!item.sways) {
    ctx.drawImage(raster, drawX, drawY);
    return;
  }

  // Wind sway: the top ~60% of the sprite shifts one art pixel left/right
  // while the base stays planted.
  const wave = Math.sin(time / 900 + item.phase);
  const dx = wave > 0.45 ? item.px : wave < -0.45 ? -item.px : 0;
  const splitRow = Math.floor(item.sprite.length * 0.6) * item.px;
  ctx.drawImage(raster, 0, 0, raster.width, splitRow, drawX + dx, drawY, raster.width, splitRow);
  ctx.drawImage(
    raster,
    0, splitRow, raster.width, raster.height - splitRow,
    drawX, drawY + splitRow, raster.width, raster.height - splitRow,
  );
}

interface ForestGardenProps {
  plots: PlantPlot[];
  withered: boolean;
}

export default function ForestGarden({ plots, withered }: ForestGardenProps) {
  const backRef = useRef<HTMLCanvasElement>(null);
  const frontRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({ plots, withered });
  stateRef.current = { plots, withered };

  useEffect(() => {
    const wrap = wrapRef.current;
    const back = backRef.current;
    const front = frontRef.current;
    if (!wrap || !back || !front) return;

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      const w = Math.max(1, Math.floor(rect.width / RENDER_SCALE));
      const h = Math.max(1, Math.floor(rect.height / RENDER_SCALE));
      back.width = w;
      back.height = h;
      front.width = w;
      front.height = h;
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(wrap);

    let raf = 0;
    let lastFrame = 0;

    const render = (time: number) => {
      raf = requestAnimationFrame(render);
      if (time - lastFrame < FRAME_MS) return;
      lastFrame = time;

      const { plots: currentPlots, withered: isWithered } = stateRef.current;
      const items: (DrawItem & { layer: Layer })[] = [];

      DECOR.forEach((d, i) => {
        const isTuft = d.sprite === TUFT_A || d.sprite === TUFT_B;
        items.push({
          sprite: d.sprite, x: d.x, y: d.y, px: d.px,
          sways: false, phase: i, shadow: false, layer: d.layer,
          outline: !isTuft,
        });
      });

      currentPlots.forEach((plot, i) => {
        const layout = PLOT_LAYOUT[i];
        if (!layout || !SPECIES[plot.species]) return;
        const sprite = spriteForPlant(plot.species, plot.growth, isWithered);
        const stage = stageForGrowth(plot.growth);
        items.push({
          sprite, x: layout.x, y: layout.y, px: layout.px,
          sways: !isWithered && stage >= 2 && sprite.length > 6,
          phase: i * 1.7,
          shadow: stage >= 2,
          layer: layout.layer,
          outline: true,
        });
      });

      // Painter's order within each layer: lower on screen draws last.
      items.sort((a, b) => a.y - b.y);

      for (const [canvas, layer] of [[back, 'back'], [front, 'front']] as const) {
        const ctx = canvas.getContext('2d');
        if (!ctx) continue;
        ctx.imageSmoothingEnabled = false;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (const item of items) {
          if (item.layer !== layer) continue;
          drawItem(ctx, item, time, canvas.width, canvas.height);
        }
      }
    };

    raf = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={wrapRef} className="forest-garden-wrap">
      <canvas ref={backRef} className="forest-layer forest-layer--back" />
      <canvas ref={frontRef} className="forest-layer forest-layer--front" />
    </div>
  );
}

// Small one-shot pixel sprite renderer for standalone decals (e.g. the spawned
// food item), so transient objects match the garden's art style.
export function PixelSpriteIcon({
  sprite,
  px = 3,
  className,
  style,
}: {
  sprite: Sprite;
  px?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const raster = rasterize(sprite, 1);
    canvas.width = raster.width;
    canvas.height = raster.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(raster, 0, 0);
  }, [sprite]);

  return (
    <canvas
      ref={ref}
      className={className}
      style={{
        width: (sprite[0].length + 2) * px,
        height: (sprite.length + 2) * px,
        imageRendering: 'pixelated',
        ...style,
      }}
    />
  );
}
