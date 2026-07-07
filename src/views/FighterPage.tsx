'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import {
  Zap, ChevronRight, Lock, Trophy, Swords,
  Dumbbell, BookOpen, Timer, Target, Flame, Star,
  Edit3, Check, X,
} from 'lucide-react';
import { useFighterProfile } from '@/context/FighterProfileContext';
import { useFighterCustomization } from '@/hooks/useFighterCustomization';
import { RANK_TIERS, XP_VALUES } from '@/utils/fighterProfile';
import { FIGHTER_STAGES, getStageForRank, getStageIndex } from '@/data/fighterSprites';
import PixelFighter from '@/components/PixelFighter';
import VirtualGym from '@/components/VirtualGym';
import { RankIcon } from '@/components/RankIcons';
import AuthGate from '@/components/AuthGate';
import FighterCustomizer from '@/components/FighterCustomizer';
import StageViewerModal from '@/components/StageViewerModal';
import './FighterPage.css';

const XP_SOURCE_META: Record<string, { label: string; icon: React.ComponentType<{ size?: number; className?: string }> }> = {
  workout_complete:    { label: 'Workout',        icon: Dumbbell },
  program_day_complete: { label: 'Program Day',   icon: Target },
  article_read:        { label: 'Article',        icon: BookOpen },
  technique_studied:   { label: 'Food Profile',      icon: BookOpen },
  timer_session:       { label: 'Timer Session',  icon: Timer },
  streak_bonus:        { label: 'Streak Bonus',   icon: Flame },
  quiz_complete:       { label: 'Quiz',           icon: Star },
  daily_login:         { label: 'Daily Login',    icon: Zap },
  challenge_complete:  { label: 'Weekly Challenge', icon: Trophy },
};

export default function FighterPage() {
  const { profile, rank, nextRankInfo, streak, setDisplayName } = useFighterProfile();
  const { customization, update } = useFighterCustomization();
  const { user, isLoaded } = useUser();
  const [viewedStage, setViewedStage] = useState<number | null>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState('');

  const handleSaveName = () => {
    if (!nameInput.trim()) return;
    setDisplayName(nameInput.trim());
    if (update) {
      update({ fighterName: nameInput.trim() });
    }
    setIsEditingName(false);
  };

  if (isLoaded && !user) {
    return (
      <div className="athlete-page">
        <AuthGate
          feature="Your Avatar"
          description="Sign in to see your pixel fighter evolve as you train. Every food profile, recipe, and article earns XP that transforms your avatar."
        />
      </div>
    );
  }

  const currentStage = getStageForRank(rank.name);
  const currentIdx = getStageIndex(rank.name);
  const { nextRank, xpNeeded, progress } = nextRankInfo;

  return (
    <div className="fighter-page">
      {/* ── Hero: The Fighter ──────────────────────────────────── */}
      <section className="athlete-hero">
        <div className="fighter-hero__spotlight" aria-hidden="true" />

        <div className="fighter-hero__content">
          <div className="fighter-hero__gym-wrap">
            <VirtualGym />
          </div>

          <div className="fighter-hero__info">
            <div className="fighter-hero__stage-badge" style={{ borderColor: rank.color }}>
              <RankIcon rankName={rank.name} size={18} />
              <span>{currentStage.stageName}</span>
            </div>
            <div className="fighter-hero__name-edit-container">
              {isEditingName ? (
                <div className="fighter-hero__name-input-wrapper">
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveName();
                      if (e.key === 'Escape') setIsEditingName(false);
                    }}
                    maxLength={25}
                    className="fighter-hero__name-input"
                    autoFocus
                  />
                  <button className="fighter-hero__name-btn fighter-hero__name-btn--save" onClick={handleSaveName} aria-label="Save name">
                    <Check size={14} />
                  </button>
                  <button className="fighter-hero__name-btn fighter-hero__name-btn--cancel" onClick={() => setIsEditingName(false)} aria-label="Cancel">
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <div className="fighter-hero__name-display-wrapper">
                  <h1 className="fighter-hero__title">
                    {customization?.fighterName || profile.displayName || currentStage.title}
                  </h1>
                  <button
                    className="fighter-hero__edit-btn"
                    onClick={() => {
                      setNameInput(customization?.fighterName || profile.displayName || currentStage.title);
                      setIsEditingName(true);
                    }}
                    aria-label="Edit name"
                  >
                    <Edit3 size={16} />
                  </button>
                </div>
              )}
            </div>
            <p className="fighter-hero__desc">{currentStage.description}</p>
            <p className="fighter-hero__flavor">{currentStage.flavorText}</p>
          </div>
        </div>

        {/* XP Progress bar */}
        <div className="fighter-hero__xp-section">
          <div className="athlete-xp-bar">
            <div className="fighter-xp-bar__labels">
              <span className="fighter-xp-bar__current">
                <Zap size={14} /> {profile.xp.toLocaleString()} XP
              </span>
              {nextRank && (
                <span className="fighter-xp-bar__next">
                  <span style={{ color: nextRank.color }}>{nextRank.name}</span>
                  {' '}&mdash; {xpNeeded.toLocaleString()} XP away
                </span>
              )}
              {!nextRank && (
                <span className="fighter-xp-bar__max">MAX RANK</span>
              )}
            </div>
            <div className="fighter-xp-bar__track">
              <div
                className="fighter-xp-bar__fill"
                style={{
                  width: `${Math.round(progress * 100)}%`,
                  backgroundColor: rank.color,
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Customization Panel ─────────────────────────────────── */}
      <section className="athlete-customizer-section">
        <FighterCustomizer />
        <div className="athlete-shop-cta">
          <Link href="/shop" className="btn-shop-cta">
            🛍️ Visit Kitchen Shop
          </Link>
        </div>
      </section>


      {/* ── Evolution Timeline ─────────────────────────────────── */}
      <section className="athlete-evolution">
        <h2 className="athlete-section-title">
          <Trophy size={20} /> Evolution Timeline
        </h2>

        <div className="evolution-timeline">
          {FIGHTER_STAGES.map((stage, idx) => {
            const tierForStage = RANK_TIERS[idx];
            const isUnlocked = idx <= currentIdx;
            const isCurrent = idx === currentIdx;
            const isNext = idx === currentIdx + 1;

            return (
              <div
                key={stage.id}
                className={[
                  'evolution-card',
                  isUnlocked ? 'evolution-card--unlocked' : 'evolution-card--locked',
                  isCurrent ? 'evolution-card--current' : '',
                  isNext ? 'evolution-card--next' : '',
                ].filter(Boolean).join(' ')}
                role="button"
                tabIndex={0}
                aria-label={`View ${stage.stageName} stage details`}
                onClick={() => setViewedStage(idx)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setViewedStage(idx); } }}
              >
                <div className="evolution-card__sprite-wrap">
                  {isUnlocked ? (
                    <PixelFighter
                      rankName={stage.rankName}
                      size="md"
                      animation={isCurrent ? 'idle' : 'none'}
                      showScene={false}
                      customization={customization}
                    />
                  ) : (
                    <div className="evolution-card__locked">
                      <Lock size={24} />
                    </div>
                  )}
                </div>

                <div className="evolution-card__info">
                  <span
                    className="evolution-card__rank"
                    style={{ color: isUnlocked ? tierForStage.color : undefined }}
                  >
                    {stage.rankName}
                  </span>
                  <span className="evolution-card__stage">{stage.stageName}</span>
                  <span className="evolution-card__xp">
                    {tierForStage.minXP.toLocaleString()} XP
                  </span>
                </div>

                {isCurrent && (
                  <div className="evolution-card__current-badge">CURRENT</div>
                )}
                {isNext && (
                  <div className="evolution-card__next-badge">NEXT</div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Ways to Earn XP ────────────────────────────────────── */}
      <section className="athlete-earn">
        <h2 className="fighter-section-title">
          <Zap size={20} /> Ways to Earn XP
        </h2>

        <div className="earn-grid">
          {Object.entries(XP_VALUES).filter(([k]) => k !== 'dev_award').map(([source, xp]) => {
            const meta = XP_SOURCE_META[source];
            if (!meta) return null;
            const Icon = meta.icon;
            return (
              <div key={source} className="earn-card glass-panel">
                <div className="earn-card__icon">
                  <Icon size={20} />
                </div>
                <div className="earn-card__info">
                  <span className="earn-card__label">{meta.label}</span>
                  <span className="earn-card__xp">+{xp} XP</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Quick Stats ────────────────────────────────────────── */}
      <section className="athlete-stats">
        <h2 className="fighter-section-title">
          <Target size={20} /> Training Record
        </h2>

        <div className="stats-grid">
          <Link href="/train" className="stat-card stat-card--link glass-panel">
            <Dumbbell size={20} className="stat-card__icon" />
            <div className="stat-card__value">{profile.workoutsCompleted}</div>
            <div className="stat-card__label">Recipes</div>
          </Link>
          <Link href="/articles" className="stat-card stat-card--link glass-panel">
            <BookOpen size={20} className="stat-card__icon" />
            <div className="stat-card__value">{profile.articlesRead.length}</div>
            <div className="stat-card__label">Articles</div>
          </Link>
          <Link href="/techniques" className="stat-card stat-card--link glass-panel">
            <Swords size={20} className="stat-card__icon" />
            <div className="stat-card__value">{profile.techniquesStudied.length}</div>
            <div className="stat-card__label">Foods</div>
          </Link>
          <Link href="/timer" className="stat-card stat-card--link glass-panel">
            <Timer size={20} className="stat-card__icon" />
            <div className="stat-card__value">{profile.timerSessions}</div>
            <div className="stat-card__label">Fasting/Harvest Sessions</div>
          </Link>
          <div className="stat-card glass-panel">
            <Flame size={20} className="stat-card__icon" />
            <div className="stat-card__value">{streak}</div>
            <div className="stat-card__label">Day Streak</div>
          </div>
          <Link href="/techniques" className="stat-card stat-card--link glass-panel">
            <Star size={20} className="stat-card__icon" />
            <div className="stat-card__value">{profile.quizzesCompleted?.length || 0}</div>
            <div className="stat-card__label">Quizzes</div>
          </Link>
        </div>
      </section>

      {/* ── Stage Viewer ───────────────────────────────────────── */}
      <StageViewerModal
        stageIndex={viewedStage}
        onClose={() => setViewedStage(null)}
        currentRankName={rank.name}
        profile={profile}
        streak={streak}
        customization={customization}
      />

      {/* ── Train CTA ──────────────────────────────────────────── */}
      <section className="athlete-cta-section">
        <Link href="/techniques" className="athlete-train-cta">
          <Swords size={18} />
          Start Harvesting
          <ChevronRight size={16} />
        </Link>
      </section>
    </div>
  );
}
