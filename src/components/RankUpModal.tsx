'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useFighterProfile } from '@/context/FighterProfileContext';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import PixelFighter from '@/components/PixelFighter';
import { useFighterCustomization } from '@/hooks/useFighterCustomization';
import './RankUpModal.css';

/**
 * RankUpModal — full-screen celebration when the user ranks up.
 * Shows pixel athlete evolution: old sprite → new sprite.
 * Auto-dismisses after 6s or on click.
 */
export default function RankUpModal() {
  const { rankUpEvent, clearRankUpEvent } = useFighterProfile();
  const { customization } = useFighterCustomization();
  const modalRef = useFocusTrap(!!rankUpEvent, clearRankUpEvent);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; delay: number; color: string }>>([]);
  const [showNewFighter, setShowNewFighter] = useState(false);

  useEffect(() => {
    if (!rankUpEvent) return;

    // Generate confetti particles
    const colors = ['#ffd700', '#ff3333', '#00e5ff', '#a855f7', '#22c55e', '#f59e0b'];
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 0.8,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    setParticles(newParticles);

    // Delay the new athlete reveal for dramatic effect
    const evolveTimer = setTimeout(() => setShowNewFighter(true), 800);
    const dismissTimer = setTimeout(clearRankUpEvent, 6000);
    return () => {
      clearTimeout(evolveTimer);
      clearTimeout(dismissTimer);
    };
  }, [rankUpEvent, clearRankUpEvent]);

  // Reset new athlete state when event clears
  useEffect(() => {
    if (!rankUpEvent) setShowNewFighter(false);
  }, [rankUpEvent]);

  if (!rankUpEvent) return null;

  const { oldRank, newRank } = rankUpEvent;

  return (
    <div className="rankup-backdrop" onClick={clearRankUpEvent} role="dialog" aria-modal="true" aria-labelledby="rankup-modal-title">
      <div className="rankup-confetti" aria-hidden="true">
        {particles.map(p => (
          <div
            key={p.id}
            className="rankup-particle"
            style={{
              left: `${p.x}%`,
              animationDelay: `${p.delay}s`,
              backgroundColor: p.color,
            }}
          />
        ))}
      </div>

      <div ref={modalRef} className="rankup-modal" onClick={e => e.stopPropagation()}>
        {/* athlete Evolution */}
        <div className="rankup-evolution">
          <div className={`rankup-athlete rankup-athlete--old ${showNewFighter ? 'rankup-athlete--fade-out' : ''}`}>
            <PixelFighter rankName={oldRank.name} size="lg" animation="none" customization={customization} />
          </div>
          <div className="rankup-evolve-flash" aria-hidden="true" />
          <div className={`rankup-athlete rankup-athlete--new ${showNewFighter ? 'rankup-athlete--fade-in' : ''}`}>
            <PixelFighter rankName={newRank.name} size="lg" animation={showNewFighter ? 'idle' : 'none'} customization={customization} />
          </div>
        </div>

        <h2 className="rankup-title" id="rankup-modal-title">EVOLUTION!</h2>
        <p className="rankup-subtitle">
          <span style={{ color: oldRank.color }}>{oldRank.name}</span>
          {' → '}
          <span style={{ color: newRank.color, fontWeight: 800 }}>{newRank.name}</span>
        </p>

        <Link
          href="/athlete"
          className="rankup-cta"
          onClick={clearRankUpEvent}
        >
          See Your Avatar
        </Link>

        <button className="rankup-dismiss" onClick={clearRankUpEvent}>
          Keep Harvesting
        </button>
      </div>
    </div>
  );
}
