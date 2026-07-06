'use client';

import React, { useState, useEffect } from 'react';
import { getStageForRank, type FighterCustomization } from '@/data/fighterSprites';
import { getRecoloredSprite, recolorCacheKey, spriteKey } from '@/utils/fighterRecolor';
import './PixelFighterCanvas.css';

interface PixelFighterCanvasProps {
  rankName: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animation?: 'idle' | 'training' | 'evolving' | 'none';
  customization?: FighterCustomization | null;
}

const DIMS: Record<string, number> = { sm: 48, md: 96, lg: 160, xl: 240 };

/** Returns a recolored sprite data URL, or null while loading / when unavailable. */
function useRecoloredSprite(stageId: string, customization?: FighterCustomization | null): string | null {
  const [url, setUrl] = useState<string | null>(null);
  const key = customization ? recolorCacheKey(stageId, customization) : null;

  useEffect(() => {
    if (!customization || !key) {
      setUrl(null);
      return;
    }
    let cancelled = false;
    getRecoloredSprite(stageId, customization).then(result => {
      if (!cancelled) setUrl(result);
    });
    return () => { cancelled = true; };
    // key encodes every color choice, so it's the only dependency that matters
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stageId, key]);

  return url;
}

export default function PixelFighterCanvas({
  rankName,
  size = 'md',
  animation = 'idle',
  customization,
}: PixelFighterCanvasProps) {
  const stage = getStageForRank(rankName);

  // Resolve transmog style override (equipped gear can restyle to another stage's look)
  const styleOverride = customization?.equippedGear?.style;
  const stageId = styleOverride || stage.id;

  const recoloredSrc = useRecoloredSprite(stageId, customization);
  // body-type-correct base sprite while the recolor loads (or if it fails)
  const baseSrc = `/fighters/${spriteKey(stageId, customization)}.png`;
  const canvasSize = DIMS[size] || 96;

  return (
    <div
      className={`pixel-fighter-canvas pixel-fighter-canvas--${size} pixel-fighter-canvas--${animation}`}
      style={{ width: canvasSize, height: canvasSize }}
    >
      <img
        src={recoloredSrc || baseSrc}
        alt={`${stage.stageName} fighter`}
        width={canvasSize}
        height={canvasSize}
        className="pixel-fighter-canvas__img"
        draggable={false}
      />
    </div>
  );
}
