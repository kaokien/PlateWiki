'use client';

import React from 'react';
import { X, Lock, Zap, Dumbbell, BookOpen, Swords, Timer, Flame } from 'lucide-react';
import { RANK_TIERS, type FighterProfile } from '@/utils/fighterProfile';
import { FIGHTER_STAGES, getStageIndex, type FighterCustomization } from '@/data/fighterSprites';
import { RankIcon } from '@/components/RankIcons';
import PixelFighter from '@/components/PixelFighter';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import './StageViewerModal.css';

interface StageViewerModalProps {
  /** Index into FIGHTER_STAGES of the stage being viewed, or null when closed */
  stageIndex: number | null;
  onClose: () => void;
  /** The viewer's current rank name (decides locked/current/conquered) */
  currentRankName: string;
  profile: FighterProfile;
  streak: number;
  customization?: FighterCustomization | null;
}

export default function StageViewerModal({
  stageIndex,
  onClose,
  currentRankName,
  profile,
  streak,
  customization = null,
}: StageViewerModalProps) {
  const isOpen = stageIndex !== null;
  const modalRef = useFocusTrap(isOpen, onClose);

  if (stageIndex === null) return null;

  const stage = FIGHTER_STAGES[stageIndex];
  const tier = RANK_TIERS[stageIndex];
  if (!stage || !tier) return null;

  const currentIdx = getStageIndex(currentRankName);
  const isCurrent = stageIndex === currentIdx;
  const isUnlocked = stageIndex <= currentIdx;
  const xpNeeded = Math.max(0, tier.minXP - profile.xp);

  const stats = [
    { icon: Zap, label: 'Total XP', value: profile.xp.toLocaleString() },
    { icon: Dumbbell, label: 'Workouts', value: profile.workoutsCompleted },
    { icon: Swords, label: 'Techniques', value: profile.techniquesStudied.length },
    { icon: BookOpen, label: 'Articles', value: profile.articlesRead.length },
    { icon: Timer, label: 'Timer Sessions', value: profile.timerSessions },
    { icon: Flame, label: 'Day Streak', value: streak },
  ];

  return (
    <div className="stage-viewer__overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label={`${stage.stageName} stage details`}>
      <div className="stage-viewer glass-panel" ref={modalRef} onClick={(e) => e.stopPropagation()}>
        <button className="stage-viewer__close" onClick={onClose} aria-label="Close stage viewer">
          <X size={20} />
        </button>

        <div className="stage-viewer__sprite">
          {isUnlocked ? (
            <PixelFighter
              rankName={stage.rankName}
              size="lg"
              showScene={true}
              animation="idle"
              customization={customization}
            />
          ) : (
            <div className="stage-viewer__locked" aria-hidden="true">
              <Lock size={48} />
            </div>
          )}
        </div>

        <div className="stage-viewer__rank-badge" style={{ borderColor: tier.color }}>
          <RankIcon rankName={stage.rankName} size={16} />
          <span style={{ color: tier.color }}>{stage.rankName}</span>
        </div>

        <h2 className="stage-viewer__title">{isUnlocked ? stage.title : '???'}</h2>
        <p className="stage-viewer__desc">
          {isUnlocked ? stage.description : `Reach ${tier.minXP.toLocaleString()} XP to unlock this evolution.`}
        </p>
        {isUnlocked && <p className="stage-viewer__flavor">{stage.flavorText}</p>}

        <div className="stage-viewer__status">
          {isCurrent && <span className="stage-viewer__pill stage-viewer__pill--current">CURRENT STAGE</span>}
          {isUnlocked && !isCurrent && <span className="stage-viewer__pill stage-viewer__pill--past">CONQUERED</span>}
          {!isUnlocked && (
            <span className="stage-viewer__pill stage-viewer__pill--locked">
              <Lock size={12} /> {xpNeeded.toLocaleString()} XP TO GO
            </span>
          )}
        </div>

        <div className="stage-viewer__stats">
          {stats.map(({ icon: Icon, label, value }) => (
            <div key={label} className="stage-viewer__stat">
              <Icon size={15} className="stage-viewer__stat-icon" />
              <span className="stage-viewer__stat-value">{value}</span>
              <span className="stage-viewer__stat-label">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
