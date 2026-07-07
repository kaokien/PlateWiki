'use client';

import React, { useRef, useEffect, useState } from 'react';
import {
  SKIN_TONES,
  HAIR_COLORS,
  GLOVE_COLORS,
  SHOE_COLORS,
  TOP_COLORS,
  type FighterCustomization
} from '@/data/fighterSprites';
import { playLevelUpSound } from '@/utils/retroSound';
import './PixelFighterCanvas.css';

interface PixelFighterCanvasProps {
  rankName: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animation?: 'idle' | 'training' | 'evolving' | 'none';
  customization?: FighterCustomization | null;
}

const DIMS: Record<string, number> = { sm: 48, md: 96, lg: 160, xl: 240 };

function getGrowthStage(rankName: string): 'stage1' | 'stage2' | 'stage3' {
  if (rankName === 'Prospect' || rankName === 'Contender') return 'stage1';
  if (rankName === 'Gatekeeper' || rankName === 'Rising Star') return 'stage2';
  return 'stage3'; // Champion & Hall of Famer
}

// Module-level spritesheet cache: each sheet is fetched and decoded once, then
// reused across all canvases and animation transitions. Prevents the blank
// flash caused by creating a fresh Image() on every anim/gear change.
const sheetCache = new Map<string, HTMLImageElement>();

function loadSheet(src: string): Promise<HTMLImageElement> {
  const cached = sheetCache.get(src);
  if (cached) {
    if (cached.complete) return Promise.resolve(cached);
    return new Promise((resolve) => {
      cached.addEventListener('load', () => resolve(cached), { once: true });
      cached.addEventListener('error', () => resolve(cached), { once: true });
    });
  }
  const img = new Image();
  sheetCache.set(src, img);
  return new Promise((resolve) => {
    img.onload = () => resolve(img);
    img.onerror = () => resolve(img);
    img.src = src;
  });
}

export default function PixelFighterCanvas({
  rankName,
  size = 'md',
  animation = 'idle',
  customization,
}: PixelFighterCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // Dynamic state to temporarily play 'eating' animation when triggered by event
  const [activeAnim, setActiveAnim] = useState<'idle' | 'eating' | 'levelup' | 'none'>('idle');
  const [frameIndex, setFrameIndex] = useState(0);
  // Bumped each time a new set of sheets finishes loading; triggers a redraw.
  const [sheetVersion, setSheetVersion] = useState(0);

  // References to loaded Image objects
  const charImageRef = useRef<HTMLImageElement | null>(null);
  const hatImageRef = useRef<HTMLImageElement | null>(null);
  const shieldImageRef = useRef<HTMLImageElement | null>(null);

  const stage = getGrowthStage(rankName);
  const canvasSize = DIMS[size] || 96;

  // 1. Map component animations to sprite sheet actions
  const resolveAnim = (anim: string): 'idle' | 'eating' | 'levelup' | 'none' => {
    if (anim === 'training') return 'eating';
    if (anim === 'evolving') return 'levelup';
    if (anim === 'none') return 'none';
    return 'idle';
  };

  // Listen to the custom event for meal logging to play the 'eating' animation for 5 seconds
  useEffect(() => {
    const resolved = resolveAnim(animation);
    setActiveAnim(resolved);
  }, [animation]);

  useEffect(() => {
    const handleMealLogged = () => {
      setActiveAnim('eating');
      const timer = setTimeout(() => {
        setActiveAnim(resolveAnim(animation));
      }, 5000);
      return () => clearTimeout(timer);
    };
    
    window.addEventListener('platewiki:meal-logged', handleMealLogged);
    return () => window.removeEventListener('platewiki:meal-logged', handleMealLogged);
  }, [animation]);

  // Retro fanfare SFX whenever the level-up animation starts
  useEffect(() => {
    if (activeAnim === 'levelup') {
      playLevelUpSound();
    }
  }, [activeAnim]);

  // 2. Resolve spritesheet URLs for the current stage / anim / gear
  const gender = customization?.bodyType === 'female' ? 'female_' : '';
  const animName = activeAnim === 'none' ? 'idle' : activeAnim;
  const charSrc = `/athletes/${stage}_${gender}${animName}.png?v=4`;

  const headgearGear = customization?.equippedGear?.headgear;
  const glovesGear = customization?.equippedGear?.gloves;

  const hasHeadgearGear = headgearGear === 'apple-hat' || headgearGear === 'mushroom-cap' || headgearGear === 'headgear-red';
  const hasGlovesGear = glovesGear === 'broccoli-shield' || glovesGear === 'banana-sword' || glovesGear === 'carrot-sword' || glovesGear === 'watermelon-shield' || glovesGear === 'gloves-red';

  const hatPrefix = headgearGear === 'mushroom-cap' ? 'mushroom-cap' :
                    headgearGear === 'headgear-red' ? 'headgear-red' : 'apple_hat';
  const shieldPrefix = glovesGear === 'banana-sword' ? 'banana-sword' :
                       glovesGear === 'carrot-sword' ? 'carrot-sword' :
                       glovesGear === 'watermelon-shield' ? 'watermelon-shield' : 'broccoli_shield';

  const hatSrc = hasHeadgearGear ? `/athletes/${hatPrefix}_${stage}_${gender}${animName}.png?v=4` : null;
  const shieldSrc = hasGlovesGear ? `/athletes/${shieldPrefix}_${stage}_${gender}${animName}.png?v=4` : null;

  // Load sheets (cached), then swap all refs atomically once everything is
  // ready. The previous sheets keep rendering until then, so transitions never
  // flash a blank canvas.
  useEffect(() => {
    let cancelled = false;

    Promise.all([
      loadSheet(charSrc),
      hatSrc ? loadSheet(hatSrc) : Promise.resolve(null),
      shieldSrc ? loadSheet(shieldSrc) : Promise.resolve(null),
    ]).then(([charImg, hatImg, shieldImg]) => {
      if (cancelled) return;
      charImageRef.current = charImg;
      hatImageRef.current = hatImg;
      shieldImageRef.current = shieldImg;
      setSheetVersion((v) => v + 1);
    });

    return () => { cancelled = true; };
  }, [charSrc, hatSrc, shieldSrc]);

  // 3. Animation frame loops
  useEffect(() => {
    // Always restart from frame 0 — carrying an index over from a longer
    // animation (idle: 10 frames) into a shorter one (eating: 8 frames) would
    // sample past the sheet edge and draw nothing.
    setFrameIndex(0);
    if (activeAnim === 'none') {
      return;
    }

    const maxFrames = activeAnim === 'eating' ? 8 : 10;
    const intervalTime = 120; // 120ms per frame (~8.3 FPS)
    
    const timer = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % maxFrames);
    }, intervalTime);

    return () => clearInterval(timer);
  }, [activeAnim]);

  // 4. Render loop on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Never wipe the canvas without a complete sheet to draw — keep showing
    // the previous frame instead of flashing blank.
    const charImage = charImageRef.current;
    if (!charImage || !charImage.complete || charImage.naturalWidth === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 1. Create offscreen buffer canvas to prevent flickering/flashing
    const offscreen = document.createElement('canvas');
    offscreen.width = canvasSize;
    offscreen.height = canvasSize;
    const offCtx = offscreen.getContext('2d');
    if (!offCtx) return;

    offCtx.imageSmoothingEnabled = false;

    const frameSize = 256;
    // Clamp to the sheet's actual frame count in case the frame index is
    // briefly ahead of a freshly swapped shorter sheet.
    const framesInSheet = Math.max(1, Math.floor(charImage.naturalWidth / frameSize));
    const sx = (frameIndex % framesInSheet) * frameSize;

    // 2. Draw Character base layer to offscreen buffer
    offCtx.drawImage(
      charImage,
      sx, 0, frameSize, frameSize,
      0, 0, canvasSize, canvasSize
    );

    // 3. Apply dynamic palette swap recoloring on the offscreen buffer
    if (customization) {
      try {
        const imgData = offCtx.getImageData(0, 0, canvasSize, canvasSize);
        const data = imgData.data;

        // Convert HEX to RGB
        const hexToRgb = (hex: string) => {
          const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
          return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
          } : { r: 0, g: 0, b: 0 };
        };

        const clamp = (val: number) => Math.max(0, Math.min(255, val));

        // Customizer target swatches
        const skinRgb = hexToRgb(SKIN_TONES[customization.skinTone]?.hex || SKIN_TONES[1].hex);
        const hairRgb = hexToRgb(HAIR_COLORS[customization.hairColor]?.hex || HAIR_COLORS[1].hex);
        const topRgb = hexToRgb(TOP_COLORS[customization.topColor]?.hex || TOP_COLORS[0].hex);
        const gloveRgb = hexToRgb(GLOVE_COLORS[customization.gloveColor]?.hex || GLOVE_COLORS[0].hex);
        const shoeRgb = hexToRgb(SHOE_COLORS[customization.shoeColor]?.hex || SHOE_COLORS[0].hex);

        // Base anchor points in the generated spritesheet
        const baseSkin = { r: 212, g: 165, b: 116 };
        const baseHair = { r: 92, g: 51, b: 23 };
        const baseTop = { r: 46, g: 59, b: 51 };
        const baseGlove = { r: 217, g: 125, b: 84 };
        const baseShoe = { r: 17, g: 22, b: 19 };

        const skinDiff = { r: skinRgb.r - baseSkin.r, g: skinRgb.g - baseSkin.g, b: skinRgb.b - baseSkin.b };
        const hairDiff = { r: hairRgb.r - baseHair.r, g: hairRgb.g - baseHair.g, b: hairRgb.b - baseHair.b };
        const topDiff = { r: topRgb.r - baseTop.r, g: topRgb.g - baseTop.g, b: topRgb.b - baseTop.b };
        const gloveDiff = { r: gloveRgb.r - baseGlove.r, g: gloveRgb.g - baseGlove.g, b: gloveRgb.b - baseGlove.b };
        const shoeDiff = { r: shoeRgb.r - baseShoe.r, g: shoeRgb.g - baseShoe.g, b: shoeRgb.b - baseShoe.b };

        for (let i = 0; i < data.length; i += 4) {
          const a = data[i + 3];
          if (a === 0) continue;

          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          // 1. Skin detection: high R, R > G > B, Red-Green offset between 15 and 55 to avoid gloves
          const isSkin = r > 115 && g > 75 && b > 55 && r > g && g > b && (r - g) >= 15 && (r - g) <= 55 && (g - b) > 5 && (g - b) < 50;
          if (isSkin) {
            data[i]     = clamp(r + skinDiff.r);
            data[i + 1] = clamp(g + skinDiff.g);
            data[i + 2] = clamp(b + skinDiff.b);
            continue;
          }

          // 2. Gloves detection: highly dominant red/orange, (R - G) >= 70
          const isGlove = r > 150 && g < 130 && b < 100 && (r - g) >= 70;
          if (isGlove) {
            data[i]     = clamp(r + gloveDiff.r);
            data[i + 1] = clamp(g + gloveDiff.g);
            data[i + 2] = clamp(b + gloveDiff.b);
            continue;
          }

          // 3. Hair detection: distance to base brown hair
          const distHair = Math.sqrt((r - baseHair.r) ** 2 + (g - baseHair.g) ** 2 + (b - baseHair.b) ** 2);
          if (distHair < 25) {
            data[i]     = clamp(r + hairDiff.r);
            data[i + 1] = clamp(g + hairDiff.g);
            data[i + 2] = clamp(b + hairDiff.b);
            continue;
          }

          // 4. Top / Shirt detection: distance to base Moss Slate green
          const distTop = Math.sqrt((r - baseTop.r) ** 2 + (g - baseTop.g) ** 2 + (b - baseTop.b) ** 2);
          if (distTop < 25) {
            data[i]     = clamp(r + topDiff.r);
            data[i + 1] = clamp(g + topDiff.g);
            data[i + 2] = clamp(b + topDiff.b);
            continue;
          }

          // 5. Shoes detection: distance to base Soil Black
          const distShoe = Math.sqrt((r - baseShoe.r) ** 2 + (g - baseShoe.g) ** 2 + (b - baseShoe.b) ** 2);
          if (distShoe < 15) {
            data[i]     = clamp(r + shoeDiff.r);
            data[i + 1] = clamp(g + shoeDiff.g);
            data[i + 2] = clamp(b + shoeDiff.b);
            continue;
          }
        }
        offCtx.putImageData(imgData, 0, 0);
      } catch (err) {
        console.warn("Recoloring offscreen failed:", err);
      }
    }

    // 4. Draw headgear overlay layer to offscreen buffer
    if (hatImageRef.current && hatImageRef.current.complete && hatImageRef.current.naturalWidth > 0) {
      offCtx.drawImage(
        hatImageRef.current,
        sx, 0, frameSize, frameSize,
        0, 0, canvasSize, canvasSize
      );
    }

    // 5. Draw gloves/weapon overlay layer to offscreen buffer
    if (shieldImageRef.current && shieldImageRef.current.complete && shieldImageRef.current.naturalWidth > 0) {
      offCtx.drawImage(
        shieldImageRef.current,
        sx, 0, frameSize, frameSize,
        0, 0, canvasSize, canvasSize
      );
    }

    // 6. Copy the finalized offscreen buffer to the visible canvas atomically
    ctx.clearRect(0, 0, canvasSize, canvasSize);
    ctx.drawImage(offscreen, 0, 0);
  }, [frameIndex, sheetVersion, canvasSize, customization]);

  return (
    <div 
      className={`pixel-athlete-canvas pixel-athlete-canvas--${size}`}
      style={{ width: canvasSize, height: canvasSize }}
    >
      <canvas
        ref={canvasRef}
        width={canvasSize}
        height={canvasSize}
        style={{ display: 'block', imageRendering: 'pixelated' }}
      />
    </div>
  );
}
