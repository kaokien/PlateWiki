'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { getStageForRank, getStageIndex, type FighterCustomization } from '@/data/fighterSprites';
import { useFighterCustomization } from '@/hooks/useFighterCustomization';
import './PixelFighter.css';

// Client-side only rendering to prevent Next.js SSR crashes
const PixelFighterCanvas = dynamic(() => import('./PixelFighterCanvas'), { ssr: false });

interface PixelFighterProps {
  /** Current rank name from RANK_TIERS */
  rankName: string;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Show background scene */
  showScene?: boolean;
  /** Animation state */
  animation?: 'idle' | 'training' | 'evolving' | 'none';
  /** Show stage label below athlete */
  showLabel?: boolean;
  /** Optional className */
  className?: string;
  /** Click handler */
  onClick?: () => void;
  /** Color customization — when set, the sprite is recolored to match */
  customization?: FighterCustomization | null;
}

export default function PixelFighter({
  rankName,
  size = 'md',
  showScene = false,
  animation = 'idle',
  showLabel = false,
  className = '',
  onClick,
  customization = null,
}: PixelFighterProps) {
  const stage = getStageForRank(rankName);
  const stageIdx = getStageIndex(rankName);
  const [isLoaded, setIsLoaded] = useState(false);

  // Dimension mapping for placeholder preloading
  const spriteSize = size === 'sm' ? 48 : size === 'md' ? 96 : size === 'lg' ? 160 : 240;

  // Preload sprite image (acts as load-state gate)
  useEffect(() => {
    setIsLoaded(false);
    const img = new Image();
    img.onload = () => setIsLoaded(true);
    img.onerror = () => setIsLoaded(true); // fallback to render even if error

    let folderStage = 'stage3';
    if (rankName === 'Prospect' || rankName === 'Contender') folderStage = 'stage1';
    else if (rankName === 'Gatekeeper' || rankName === 'Rising Star') folderStage = 'stage2';
    
    const gender = customization?.bodyType === 'female' ? 'female_' : '';
    img.src = `/athletes/${folderStage}_${gender}idle.png`;
  }, [rankName, customization?.bodyType]);

  const containerClasses = [
    'pixel-athlete',
    `pixel-athlete--${size}`,
    `pixel-athlete--${animation}`,
    isLoaded ? 'pixel-athlete--loaded' : '',
    onClick ? 'pixel-athlete--clickable' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div
      className={containerClasses}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); } : undefined}
      data-rank={stage.id}
      data-stage={stageIdx}
    >
      {showScene && (
        <div className="pixel-fighter__scene" aria-hidden="true">
          <div className="pixel-fighter__scene-glow" />
        </div>
      )}
      <div className="pixel-fighter__sprite-wrap" style={{ width: spriteSize, height: spriteSize }}>
        {isLoaded && (
          <PixelFighterCanvas
            rankName={rankName}
            size={size}
            animation={animation}
            customization={customization}
          />
        )}
      </div>

      {/* Rank glow ring */}
      {(size === 'lg' || size === 'xl') && (
        <div className="pixel-fighter__glow-ring" aria-hidden="true" />
      )}

      {showLabel && (
        <div className="pixel-fighter__label">
          <span className="pixel-fighter__stage-name">{stage.stageName}</span>
          <span className="pixel-fighter__rank-name">{stage.rankName}</span>
        </div>
      )}
    </div>
  );
}

/** Mini variant for nav bar — just the sprite, no scene */
export function PixelFighterMini({ rankName, onClick }: { rankName: string; onClick?: () => void }) {
  const { customization } = useFighterCustomization();
  return (
    <PixelFighter
      rankName={rankName}
      size="sm"
      animation="idle"
      showScene={false}
      showLabel={false}
      onClick={onClick}
      className="pixel-athlete--mini"
      customization={customization}
    />
  );
}
