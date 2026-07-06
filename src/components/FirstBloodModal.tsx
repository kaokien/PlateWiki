'use client';

import React, { useEffect, useState } from 'react';
import { Zap, X } from 'lucide-react';
import { RankIcon } from '@/components/RankIcons';
import { RANK_TIERS } from '@/utils/fighterProfile';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import './FirstBloodModal.css';

interface FirstBloodModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * One-time "First Blood" modal — fires the first time a user earns XP.
 * Hooks them into the gamification loop by showing their first achievement
 * and teasing the next rank (Contender).
 */
export default function FirstBloodModal({ isOpen, onClose }: FirstBloodModalProps) {
  const [visible, setVisible] = useState(false);
  const contender = RANK_TIERS.find(t => t.name === 'Contender') ?? RANK_TIERS[1];
  const modalRef = useFocusTrap(isOpen, onClose);

  useEffect(() => {
    if (isOpen) {
      // Small delay so the animation triggers after mount
      const timer = setTimeout(() => setVisible(true), 50);
      // Auto-dismiss after 6 seconds
      const autoDismiss = setTimeout(() => onClose(), 6000);
      return () => { clearTimeout(timer); clearTimeout(autoDismiss); };
    } else {
      setVisible(false);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={`fb-overlay ${visible ? 'fb-overlay--visible' : ''}`} onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="fb-modal-title">
      <div ref={modalRef} className={`fb-modal ${visible ? 'fb-modal--visible' : ''}`} onClick={e => e.stopPropagation()}>
        {/* Close button */}
        <button className="fb-close" onClick={onClose} aria-label="Close celebration modal">
          <X size={18} />
        </button>

        {/* Glow ring */}
        <div className="fb-glow" />

        {/* Icon */}
        <div className="fb-icon">
          <Zap size={32} className="fb-zap" />
        </div>

        {/* Title */}
        <h2 className="fb-title" id="fb-modal-title">First Sprout!</h2>

        {/* Message */}
        <p className="fb-message">
          You earned your first XP. The harvest starts now.
        </p>

        {/* Next rank tease */}
        <div className="fb-next-rank">
          <RankIcon rankName={contender.name} size={16} color={contender.color} />
          <span style={{ color: contender.color }}>
            Keep harvesting to reach {contender.name}
          </span>
        </div>

        {/* Particles */}
        <div className="fb-particles" aria-hidden="true">
          {Array.from({ length: 12 }).map((_, i) => (
            <span
              key={i}
              className="fb-particle"
              style={{
                '--delay': `${i * 0.08}s`,
                '--angle': `${i * 30}deg`,
                '--distance': `${60 + Math.random() * 40}px`,
              } as React.CSSProperties}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
