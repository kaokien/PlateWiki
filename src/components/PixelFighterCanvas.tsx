'use client';

import React, { useRef, useEffect, useState } from 'react';
import type { FighterCustomization } from '@/data/fighterSprites';
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
  const [imagesLoaded, setImagesLoaded] = useState(false);

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
    
    window.addEventListener('foodwiki:meal-logged', handleMealLogged);
    return () => window.removeEventListener('foodwiki:meal-logged', handleMealLogged);
  }, [animation]);

  // 2. Load spritesheets when stage or animation changes
  useEffect(() => {
    setImagesLoaded(false);
    
    const charImg = new Image();
    const hatImg = new Image();
    const shieldImg = new Image();

    charImageRef.current = charImg;
    hatImageRef.current = null;
    shieldImageRef.current = null;

    const gender = customization?.bodyType === 'female' ? 'female_' : '';
    const animName = activeAnim === 'none' ? 'idle' : activeAnim;
    charImg.src = `/fighters/${stage}_${gender}${animName}.png`;

    // Determine equippable items
    const hasAppleHat = customization?.equippedGear?.headgear === 'apple-hat' || customization?.equippedGear?.headgear === 'headgear-red';
    const hasBroccoliShield = customization?.equippedGear?.gloves === 'broccoli-shield' || customization?.equippedGear?.gloves === 'gloves-red';

    if (hasAppleHat) {
      hatImg.src = `/fighters/apple_hat_${stage}_${gender}${animName}.png`;
      hatImageRef.current = hatImg;
    }
    if (hasBroccoliShield) {
      shieldImg.src = `/fighters/broccoli_shield_${stage}_${gender}${animName}.png`;
      shieldImageRef.current = shieldImg;
    }

    const promises = [
      new Promise((resolve) => { charImg.onload = resolve; charImg.onerror = resolve; })
    ];

    if (hasAppleHat) {
      promises.push(new Promise((resolve) => { hatImg.onload = resolve; hatImg.onerror = resolve; }));
    }
    if (hasBroccoliShield) {
      promises.push(new Promise((resolve) => { shieldImg.onload = resolve; shieldImg.onerror = resolve; }));
    }

    Promise.all(promises).then(() => {
      setImagesLoaded(true);
    });
  }, [stage, activeAnim, customization?.equippedGear, customization?.bodyType]);

  // 3. Animation frame loops
  useEffect(() => {
    if (activeAnim === 'none') {
      setFrameIndex(0);
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
    if (!canvas || !imagesLoaded) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvasSize, canvasSize);
    
    // Lock pixel crispness
    ctx.imageSmoothingEnabled = false;

    const frameSize = 256;
    const sx = frameIndex * frameSize;

    // Draw Character base layer
    if (charImageRef.current && charImageRef.current.complete) {
      ctx.drawImage(
        charImageRef.current,
        sx, 0, frameSize, frameSize,      // Source Crop
        0, 0, canvasSize, canvasSize       // Destination Canvas Bounds
      );
    }

    // Draw Apple Hat overlay layer
    if (hatImageRef.current && hatImageRef.current.complete) {
      ctx.drawImage(
        hatImageRef.current,
        sx, 0, frameSize, frameSize,
        0, 0, canvasSize, canvasSize
      );
    }

    // Draw Broccoli Shield overlay layer
    if (shieldImageRef.current && shieldImageRef.current.complete) {
      ctx.drawImage(
        shieldImageRef.current,
        sx, 0, frameSize, frameSize,
        0, 0, canvasSize, canvasSize
      );
    }
  }, [frameIndex, imagesLoaded, canvasSize]);

  return (
    <div 
      className={`pixel-fighter-canvas pixel-fighter-canvas--${size}`}
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
