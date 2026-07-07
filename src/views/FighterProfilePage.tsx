'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import {
  User, Trophy, Flame, BookOpen, Timer, Dumbbell,
  Share2, Check, Edit3, ChevronRight, Target, Zap, Award,
  Settings, Trash2, Shield, X, Brain, GraduationCap,
  Moon, Rocket, Crown,
  type LucideIcon
} from 'lucide-react';
import { useFighterProfile } from '@/context/FighterProfileContext';
import { useSubscription } from '@/context/SubscriptionContext';
import { RANK_TIERS, XP_VALUES } from '@/utils/fighterProfile';
import { BADGES, getEarnedBadgeIds, formatEarners } from '@/utils/badges';
import { RankIcon } from '@/components/RankIcons';
import PixelFighter from '@/components/PixelFighter';
import { getWorkoutStats } from '@/utils/storage';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { analytics } from '@/utils/analytics';
import EmailCapture from '@/components/EmailCapture';
import AuthGate from '@/components/AuthGate';
import { useFighterCustomization } from '@/hooks/useFighterCustomization';
import './FighterProfilePage.css';

const badgeIconMap: Record<string, LucideIcon> = {
  Zap, Flame, BookOpen, GraduationCap, Award, Brain, Dumbbell, Timer, Trophy, Moon, Rocket, Crown,
};

export default function FighterProfilePage() {
  const {
    profile,
    rank,
    nextRankInfo,
    streak,
    fightingStyle,
    setDisplayName,
    setTrainingGoal,
    resetProfile,
  } = useFighterProfile();

  const { isPro, tier, resetSubscription } = useSubscription();
  const { user, isLoaded } = useUser();
  const { customization } = useFighterCustomization();

  const earnedBadgeIds = React.useMemo(() => getEarnedBadgeIds(profile), [profile]);

  const [showResetModal, setShowResetModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const resetModalRef = useFocusTrap(showResetModal, () => setShowResetModal(false));
  const cancelModalRef = useFocusTrap(showCancelModal, () => setShowCancelModal(false));

  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(profile.displayName);
  const [shareState, setShareState] = useState<'idle' | 'copied'>('idle');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [workoutStats, setWorkoutStats] = useState({
    totalWorkouts: 0,
    totalSets: 0,
    thisWeek: 0,
    streak: 0,
    lastWorkout: null as any
  });

  useEffect(() => {
    setWorkoutStats(getWorkoutStats());
  }, []);

  useEffect(() => {
    const handleSyncComplete = () => {
      setWorkoutStats(getWorkoutStats());
    };
    window.addEventListener('cloud-sync-complete', handleSyncComplete);
    return () => window.removeEventListener('cloud-sync-complete', handleSyncComplete);
  }, []);

  const [remindersEnabled, setRemindersEnabled] = useState(false);
  const [reminderHour, setReminderHour] = useState('09:00');

  useEffect(() => {
    setRemindersEnabled(localStorage.getItem('bw_daily_reminders') === 'true');
    setReminderHour(localStorage.getItem('bw_reminder_hour') || '09:00');
  }, []);

  const handleHourChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setReminderHour(value);
    localStorage.setItem('bw_reminder_hour', value);
    analytics.customEvent('notification_hour_change', { hour: value });
  };

  const handleToggleReminders = async () => {
    if (!remindersEnabled) {
      if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          try {
            new Notification('PlateWiki Reminders Active! 🥊', {
              body: "We'll remind you to train and keep your streak alive.",
              icon: '/favicon.svg'
            });
          } catch (err) {
            console.warn('Native notification failed:', err);
          }
          localStorage.setItem('bw_daily_reminders', 'true');
          setRemindersEnabled(true);
          analytics.customEvent('notification_toggle', { enabled: true });
        } else {
          alert('Notification permission denied. Please enable notifications in your browser settings.');
        }
      } else {
        alert('Notifications are not supported in this browser.');
      }
    } else {
      localStorage.setItem('bw_daily_reminders', 'false');
      setRemindersEnabled(false);
      analytics.customEvent('notification_toggle', { enabled: false });
    }
  };

  useEffect(() => {
    setNameInput(profile.displayName);
  }, [profile.displayName]);

  const handleSaveName = () => {
    setDisplayName(nameInput);
    setIsEditingName(false);
  };

  const handleResetProfile = () => {
    resetProfile();
    setShowResetModal(false);
    // Refresh stats UI
    setTimeout(() => {
      setWorkoutStats(getWorkoutStats());
    }, 50);
  };

  const handleCancelSubscription = () => {
    resetSubscription();
    setShowCancelModal(false);
  };

  const handleExportData = () => {
    try {
      const keys = [
        'nutritionwiki_fighter_profile',
        'bw_onboarded',
        'bw_cookie_consent',
        'PlateWiki_workout_stats',
        'PlateWiki_workout_history',
        'PlateWiki_saved_techniques',
        'PlateWiki_streak',
        'PlateWiki_last_visit',
        'PlateWiki_subscription'
      ];
      const data: Record<string, string | null> = {};
      keys.forEach(k => {
        data[k] = localStorage.getItem(k);
      });
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `PlateWiki_fighter_data_${profile.displayName.toLowerCase().replace(/\s+/g, '_') || 'profile'}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      analytics.customEvent('data_export_completed', { format: 'json' });
    } catch (e) {
      alert('Failed to export data: local storage is not accessible.');
    }
  };

  // ── Share athlete Card ──────────────────────────────────────────
  const generateCardImage = useCallback(async (): Promise<Blob | null> => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const w = 600;
    const h = 400;
    canvas.width = w;
    canvas.height = h;

    // Background
    const bg = ctx.createLinearGradient(0, 0, w, h);
    bg.addColorStop(0, '#0a0a0a');
    bg.addColorStop(1, '#141414');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    // Border
    ctx.strokeStyle = rank.color;
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, w - 2, h - 2);

    // Accent bar
    ctx.fillStyle = rank.color;
    ctx.fillRect(0, 0, w, 4);

    // Header
    ctx.font = 'bold 14px "Barlow Condensed", sans-serif';
    ctx.fillStyle = '#8c8c8c';
    ctx.textAlign = 'left';
    ctx.fillText('PlateWiki ATHLETE PROFILE', 30, 40);

    // Name
    ctx.font = 'bold 32px "Barlow Condensed", sans-serif';
    ctx.fillStyle = '#fff';
    ctx.fillText(profile.displayName.toUpperCase(), 30, 80);

    // Rank
    ctx.font = 'bold 20px "Barlow Condensed", sans-serif';
    ctx.fillStyle = rank.color;
    ctx.fillText(`${rank.name.toUpperCase()}`, 30, 115);

    // XP
    ctx.font = '14px Inter, sans-serif';
    ctx.fillStyle = '#b0b0b0';
    ctx.fillText(`${profile.xp.toLocaleString()} XP`, 30, 140);

    // XP Bar
    const barX = 30;
    const barY = 155;
    const barW = w - 60;
    const barH = 8;
    ctx.fillStyle = '#2a2a2a';
    ctx.beginPath();
    ctx.roundRect(barX, barY, barW, barH, 4);
    ctx.fill();

    const fillW = barW * nextRankInfo.progress;
    if (fillW > 0) {
      const barGrad = ctx.createLinearGradient(barX, 0, barX + fillW, 0);
      barGrad.addColorStop(0, rank.color);
      barGrad.addColorStop(1, rank.color + '88');
      ctx.fillStyle = barGrad;
      ctx.beginPath();
      ctx.roundRect(barX, barY, fillW, barH, 4);
      ctx.fill();
    }

    // Divider
    ctx.fillStyle = '#2a2a2a';
    ctx.fillRect(30, 185, w - 60, 1);

    // Stats
    const stats = [
      { label: 'WORKOUTS', value: profile.workoutsCompleted.toString() },
      { label: 'STREAK', value: `${streak}d` },
      { label: 'ARTICLES', value: profile.articlesRead.length.toString() },
      { label: 'TIMER', value: profile.timerSessions.toString() },
    ];

    const colW = (w - 60) / 4;
    stats.forEach((stat, i) => {
      const x = 30 + colW * i + colW / 2;
      
      ctx.font = 'bold 28px "Barlow Condensed", sans-serif';
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'center';
      ctx.fillText(stat.value, x, 230);
      
      ctx.font = '11px Inter, sans-serif';
      ctx.fillStyle = '#8c8c8c';
      ctx.fillText(stat.label, x, 250);
    });

    // Divider
    ctx.fillStyle = '#2a2a2a';
    ctx.fillRect(30, 275, w - 60, 1);

    // Style
    ctx.textAlign = 'left';
    ctx.font = '12px Inter, sans-serif';
    ctx.fillStyle = '#8c8c8c';
    ctx.fillText('FIGHTING STYLE', 30, 305);
    
    ctx.font = 'bold 18px "Barlow Condensed", sans-serif';
    ctx.fillStyle = '#fff';
    ctx.fillText(fightingStyle.toUpperCase(), 30, 330);

    // Footer
    ctx.font = '12px Inter, sans-serif';
    ctx.fillStyle = '#8c8c8c';
    ctx.textAlign = 'right';
    ctx.fillText('PlateWiki.org', w - 30, h - 20);

    return new Promise(resolve => {
      canvas.toBlob(blob => resolve(blob), 'image/png');
    });
  }, [profile, rank, nextRankInfo, streak, fightingStyle]);

  const handleShare = useCallback(async () => {
    const blob = await generateCardImage();
    if (!blob) return;

    // Try native share (mobile)
    if (navigator.share && navigator.canShare) {
      try {
        const file = new File([blob], 'PlateWiki-athlete-card.png', { type: 'image/png' });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: `${profile.displayName} — ${rank.name} on PlateWiki`,
            text: `I'm a ${rank.name} on PlateWiki with ${profile.xp} XP!`,
            files: [file],
          });
          analytics.customEvent('fighter_card_shared', { method: 'native_share', rank: rank.name, xp: profile.xp });
          analytics.fighterCardDownloaded(rank.name, streak, profile.xp);
          return;
        }
      } catch { /* user cancelled or not supported */ }
    }

    // Fallback: Download image and copy text to clipboard
    try {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${profile.displayName.toLowerCase().replace(/\s+/g, '-')}-athlete-card.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      const text = `My PlateWiki Athlete Stats\n  Rank: ${rank.name}\n  XP: ${profile.xp.toLocaleString()}\n  Workouts: ${profile.workoutsCompleted}\n  Streak: ${streak} days\n  Style: ${fightingStyle}\n  PlateWiki.org`;
      await navigator.clipboard.writeText(text);
      setShareState('copied');
      setTimeout(() => setShareState('idle'), 2000);
      
      analytics.customEvent('fighter_card_shared', { method: 'copy_download_fallback', rank: rank.name, xp: profile.xp });
      analytics.fighterCardDownloaded(rank.name, streak, profile.xp);
    } catch { /* download/clipboard failed */ }
  }, [generateCardImage, profile, rank, streak, fightingStyle]);

  if (isLoaded && !user) {
    return (
      <div className="profile-page">
        <AuthGate feature="Athlete Profile" description="Sign in to track your XP, badges, training streaks, and workout history." />
      </div>
    );
  }

  const joinedDate = new Date(profile.joinedAt).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });

  // Current rank index for progress calculation
  const currentRankIdx = RANK_TIERS.findIndex(t => t.name === rank.name);

  return (
    <div className="fp-page">
      {/* Hidden canvas for card generation */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* ── athlete Card Hero ── */}
      <section className="fp-card glass-panel">
        <div className="fp-card__accent" style={{ background: `linear-gradient(90deg, ${rank.color}, ${rank.color}44)` }} />

        <div className="fp-card__header">
          <span className="fp-card__label">Athlete Profile</span>
          <span className="fp-card__joined">Since {joinedDate}</span>
        </div>

        {/* Pixel Athlete + Rank Icon */}
        <div className="fp-card__identity">
          <Link href="/athlete" className="fp-card__fighter-link">
            <PixelFighter rankName={rank.name} size="md" animation="idle" showScene={false} customization={customization} />
          </Link>
          <div className="fp-card__rank-ring" style={{ '--rank-color': rank.color } as React.CSSProperties}>
            <svg viewBox="0 0 80 80" className="fp-card__rank-ring-svg">
              <circle cx="40" cy="40" r="36" fill="none" stroke="currentColor" strokeWidth="3" opacity="0.08" />
              <circle
                cx="40" cy="40" r="36"
                fill="none"
                stroke={rank.color}
                strokeWidth="3.5"
                strokeDasharray={`${nextRankInfo.progress * 226.2} 226.2`}
                strokeLinecap="round"
                transform="rotate(-90 40 40)"
                className="fp-card__rank-ring-fill"
              />
            </svg>
            <RankIcon rankName={rank.name} size={32} color={rank.color} />
          </div>

          <div className="fp-card__name-block">
            <div className="fp-card__name-row">
              {isEditingName ? (
                <div className="fp-card__name-edit">
                  <input
                    type="text"
                    value={nameInput}
                    onChange={e => setNameInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSaveName()}
                    maxLength={30}
                    autoFocus
                    className="fp-card__name-input"
                  />
                  <button onClick={handleSaveName} className="fp-card__name-save">
                    <Check size={14} />
                  </button>
                </div>
              ) : (
                <>
                  <h1 className="fp-card__name">{profile.displayName}</h1>
                  <button
                    onClick={() => { setNameInput(profile.displayName); setIsEditingName(true); }}
                    className="fp-card__name-edit-btn"
                    aria-label="Edit display name"
                  >
                    <Edit3 size={14} />
                  </button>
                </>
              )}
            </div>
            <div className="fp-card__rank-label" style={{ color: rank.color }}>
              {rank.name}
            </div>
          </div>
        </div>

        {/* XP Bar */}
        <div className="fp-card__xp-section">
          <div className="fp-card__xp-info">
            <span className="fp-card__xp-value">
              <Zap size={12} className="fp-card__xp-icon" />
              {profile.xp.toLocaleString()} XP
            </span>
            {nextRankInfo.nextRank && (
              <span className="fp-card__xp-next">
                {nextRankInfo.xpNeeded.toLocaleString()} XP to {nextRankInfo.nextRank.name}
              </span>
            )}
          </div>
          <div className="fp-card__xp-bar">
            <div
              className="fp-card__xp-fill"
              style={{
                width: `${nextRankInfo.progress * 100}%`,
                background: `linear-gradient(90deg, ${rank.color}, ${rank.color}88)`,
              }}
            />
          </div>
        </div>

        <div className="fp-card__stats">
          {profile.workoutsCompleted === 0 ? (
            <Link href="/programs" className="fp-card__stat fp-card__stat--actionable">
              <Dumbbell size={16} />
              <span className="fp-card__stat-value">0</span>
              <span className="fp-card__stat-label">Workouts</span>
              <ChevronRight size={12} className="fp-card__stat-cta" />
            </Link>
          ) : (
            <div className="fp-card__stat">
              <Dumbbell size={16} />
              <span className="fp-card__stat-value">{profile.workoutsCompleted}</span>
              <span className="fp-card__stat-label">Workouts</span>
            </div>
          )}
          <div className="fp-card__stat">
            <Flame size={16} />
            <span className="fp-card__stat-value">{streak}</span>
            <span className="fp-card__stat-label">Day Streak</span>
          </div>
          {(profile.techniquesStudied?.length ?? 0) === 0 ? (
            <Link href="/foods" className="fp-card__stat fp-card__stat--actionable">
              <BookOpen size={16} />
              <span className="fp-card__stat-value">0</span>
              <span className="fp-card__stat-label">Techniques</span>
              <ChevronRight size={12} className="fp-card__stat-cta" />
            </Link>
          ) : (
            <div className="fp-card__stat">
              <BookOpen size={16} />
              <span className="fp-card__stat-value">{profile.techniquesStudied.length}</span>
              <span className="fp-card__stat-label">Techniques</span>
            </div>
          )}
          {profile.timerSessions === 0 ? (
            <Link href="/timer" className="fp-card__stat fp-card__stat--actionable">
              <Timer size={16} />
              <span className="fp-card__stat-value">0</span>
              <span className="fp-card__stat-label">Timer</span>
              <ChevronRight size={12} className="fp-card__stat-cta" />
            </Link>
          ) : (
            <div className="fp-card__stat">
              <Timer size={16} />
              <span className="fp-card__stat-value">{profile.timerSessions}</span>
              <span className="fp-card__stat-label">Timer</span>
            </div>
          )}
        </div>

        {/* Style */}
        <div className="fp-card__style">
          <Target size={14} />
          <span>{fightingStyle}</span>
        </div>

        {/* Share */}
        <button className="fp-card__share" onClick={handleShare}>
          {shareState === 'copied' ? <Check size={16} /> : <Share2 size={16} />}
          {shareState === 'copied' ? 'Copied!' : 'Share athlete Card'}
        </button>
      </section>

      {/* ── Rank Progression ── */}
      <section className="fp-ranks glass-panel">
        <h2 className="fp-section-title">
          <Trophy size={18} /> Rank Progression
        </h2>
        <div className="fp-ranks__timeline">
          {RANK_TIERS.map((tier, i) => {
            const isCurrent = tier.name === rank.name;
            const isAchieved = profile.xp >= tier.minXP;
            const isNext = i === currentRankIdx + 1;
            return (
              <div
                key={tier.name}
                className={`fp-ranks__tier ${isCurrent ? 'current' : ''} ${isAchieved ? 'achieved' : ''} ${isNext ? 'next' : ''} ${!isAchieved && !isNext ? 'locked' : ''}`}
              >
                <div
                  className="fp-ranks__dot"
                  style={{
                    borderColor: isAchieved ? tier.color : isNext ? tier.color + '66' : '#333',
                    background: isCurrent ? tier.color + '22' : isAchieved ? tier.color + '11' : '#1a1a1a',
                    '--tier-color': tier.color,
                  } as React.CSSProperties}
                >
                  <RankIcon rankName={tier.name} size={18} color={isAchieved ? tier.color : isNext ? tier.color + '88' : '#444'} />
                </div>
                <div className="fp-ranks__info">
                  <span className="fp-ranks__name" style={{ color: isAchieved ? tier.color : isNext ? tier.color + 'aa' : '#888' }}>
                    {tier.name}
                  </span>
                  <span className="fp-ranks__xp">
                    {tier.minXP.toLocaleString()} XP
                    {isCurrent && <span className="fp-ranks__current-tag">Current</span>}
                  </span>
                </div>
                {i < RANK_TIERS.length - 1 && (
                  <div className={`fp-ranks__line ${isAchieved ? 'filled' : ''}`} />
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Badge Showcase ── */}
      <section className="fp-badges glass-panel">
        <h2 className="fp-section-title">
          <Award size={18} /> Badges
          <span className="fp-badges__count">{earnedBadgeIds.length}/{BADGES.length}</span>
        </h2>
        <div className="fp-badges__grid">
          {BADGES.map((badge) => {
            const earned = earnedBadgeIds.includes(badge.id);
            const isHidden = badge.hidden && !earned;
            const BadgeIcon = isHidden ? Trophy : (badgeIconMap[badge.icon] || Award);
            return (
              <div
                key={badge.id}
                className={`fp-badge ${earned ? 'fp-badge--earned' : 'fp-badge--locked'} ${isHidden ? 'fp-badge--hidden' : ''}`}
              >
                <div
                  className="fp-badge__icon"
                  style={{
                    borderColor: earned ? badge.color : isHidden ? '#222' : '#333',
                    background: earned ? badge.color + '18' : '#1a1a1a',
                  }}
                >
                  <BadgeIcon size={18} color={earned ? badge.color : isHidden ? '#222' : '#444'} />
                </div>
                <div className="fp-badge__info">
                  <span className="fp-badge__name" style={{ color: earned ? '#fff' : isHidden ? '#444' : '#666' }}>
                    {isHidden ? '???' : badge.name}
                  </span>
                  <span className="fp-badge__desc">
                    {earned ? badge.description : isHidden ? 'Keep training to discover this mystery badge' : badge.description}
                  </span>
                  <span className="fp-badge__earners">
                    {formatEarners(badge.estimatedEarners || 0)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── XP Sources ── */}
      <section className="fp-xp-sources glass-panel">
        <h2 className="fp-section-title">
          <Zap size={18} /> How to Earn XP
        </h2>
        <div className="fp-xp-sources__grid">
          <div className="fp-xp-source">
            <Dumbbell size={16} className="fp-xp-source__icon" />
            <span className="fp-xp-source__action">Complete a Workout</span>
            <span className="fp-xp-source__value">+{XP_VALUES.workout_complete} XP</span>
          </div>
          <div className="fp-xp-source">
            <Award size={16} className="fp-xp-source__icon" />
            <span className="fp-xp-source__action">Finish a Program Day</span>
            <span className="fp-xp-source__value">+{XP_VALUES.program_day_complete} XP</span>
          </div>
          <div className="fp-xp-source">
            <BookOpen size={16} className="fp-xp-source__icon" />
            <span className="fp-xp-source__action">Study a Technique</span>
            <span className="fp-xp-source__value">+{XP_VALUES.technique_studied} XP</span>
          </div>
          <div className="fp-xp-source">
            <Timer size={16} className="fp-xp-source__icon" />
            <span className="fp-xp-source__action">Complete a Timer Session</span>
            <span className="fp-xp-source__value">+{XP_VALUES.timer_session} XP</span>
          </div>
          <div className="fp-xp-source">
            <Flame size={16} className="fp-xp-source__icon" />
            <span className="fp-xp-source__action">7-Day Streak Bonus</span>
            <span className="fp-xp-source__value">+{XP_VALUES.streak_bonus} XP</span>
          </div>
        </div>
      </section>

      {/* ── Quick Actions ── */}
      <section className="fp-actions">
        <Link href="/kitchen" className="fp-action glass-panel">
          <Dumbbell size={20} />
          <div>
            <h3>Train</h3>
            <p>+{XP_VALUES.workout_complete} XP per workout</p>
          </div>
          <ChevronRight size={16} />
        </Link>
        <Link href="/articles" className="fp-action glass-panel">
          <BookOpen size={20} />
          <div>
            <h3>Read Articles</h3>
            <p>+{XP_VALUES.article_read} XP per article</p>
          </div>
          <ChevronRight size={16} />
        </Link>
        <Link href="/timer" className="fp-action glass-panel">
          <Timer size={20} />
          <div>
            <h3>Nutrition Timer</h3>
            <p>+{XP_VALUES.timer_session} XP per session</p>
          </div>
          <ChevronRight size={16} />
        </Link>
        {workoutStats.totalWorkouts > 0 && (
          <Link href="/history" className="fp-action glass-panel">
            <Trophy size={20} />
            <div>
              <h3>Training History</h3>
              <p>{workoutStats.totalWorkouts} workouts logged</p>
            </div>
            <ChevronRight size={16} />
          </Link>
        )}
      </section>

      {/* ── Settings & Plan Management ── */}
      <section className="fp-settings glass-panel mt-8">
        <h2 className="fp-section-title">
          <Settings size={18} /> Settings & Plan Management
        </h2>
        
        <div className="fp-settings__grid">
          {/* Plan Info */}
          <div className="fp-settings__item">
            <div className="fp-settings__item-info">
              <Shield size={16} className="fp-settings__icon" />
              <div>
                <span className="fp-settings__label">Current Plan:</span>
                <strong className="fp-settings__value uppercase">
                  {tier === 'trial' ? '7-Day Free Trial' : tier === 'pro' ? 'Pro Plan' : 'Free Tier'}
                </strong>
              </div>
            </div>
            {isPro && (
              <button 
                className="fp-settings__btn fp-settings__btn--cancel"
                onClick={() => setShowCancelModal(true)}
              >
                Cancel Subscription
              </button>
            )}
          </div>

          {/* Daily Reminder */}
          <div className="fp-settings__item">
            <div className="fp-settings__item-info">
              <Flame size={16} className="fp-settings__icon text-primary" />
              <div>
                <span className="fp-settings__label">Daily Reminder:</span>
                <span className="fp-settings__sub">Enable browser alerts to keep your training streak active.</span>
                {remindersEnabled && (
                  <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Alert Time:</span>
                    <select 
                      value={reminderHour} 
                      onChange={handleHourChange}
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid var(--color-border)',
                        color: 'var(--color-text)',
                        padding: '0.2rem 0.5rem',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.8rem',
                        outline: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      {Array.from({ length: 24 }).map((_, h) => {
                        const label = h === 0 ? '12 AM' : h < 12 ? `${h} AM` : h === 12 ? '12 PM' : `${h - 12} PM`;
                        const val = `${h.toString().padStart(2, '0')}:00`;
                        return (
                          <option key={val} value={val} style={{ background: '#111', color: '#fff' }}>
                            {label}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                )}
              </div>
            </div>
            <button 
              className={`fp-settings__btn ${remindersEnabled ? 'fp-settings__btn--cancel' : 'fp-settings__btn--export'}`}
              onClick={handleToggleReminders}
            >
              {remindersEnabled ? 'Disable alerts' : 'Enable alerts'}
            </button>
          </div>

          {/* Data Portability */}
          <div className="fp-settings__item">
            <div className="fp-settings__item-info">
              <Share2 size={16} className="fp-settings__icon" />
              <div>
                <span className="fp-settings__label">Data Portability:</span>
                <span className="fp-settings__sub">Download a JSON backup of your local training data.</span>
              </div>
            </div>
            <button 
              className="fp-settings__btn fp-settings__btn--export"
              onClick={handleExportData}
            >
              Download Data
            </button>
          </div>

          {/* Training Focus / Goal */}
          <div className="fp-settings__item">
            <div className="fp-settings__item-info">
              <Target size={16} className="fp-settings__icon" />
              <div>
                <span className="fp-settings__label">Training Focus:</span>
                <span className="fp-settings__sub">Select your main focus area to customize recommended workouts.</span>
              </div>
            </div>
            <select
              value={profile.trainingGoal || 'speed'}
              onChange={(e) => setTrainingGoal(e.target.value as any)}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text)',
                padding: '0.4rem 0.8rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.85rem',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="speed" style={{ background: '#111', color: '#fff' }}>Hand Speed</option>
              <option value="power" style={{ background: '#111', color: '#fff' }}>Punching Power</option>
              <option value="stamina" style={{ background: '#111', color: '#fff' }}>Stamina</option>
              <option value="defense" style={{ background: '#111', color: '#fff' }}>Defense</option>
            </select>
          </div>

          {/* Danger Zone */}
          <div className="fp-settings__item fp-settings__item--danger">
            <div className="fp-settings__item-info">
              <Trash2 size={16} className="fp-settings__icon text-primary" />
              <div>
                <span className="fp-settings__label text-primary">Danger Zone:</span>
                <span className="fp-settings__sub">Delete all XP, streaks, and training logs.</span>
              </div>
            </div>
            <button 
              className="fp-settings__btn fp-settings__btn--danger"
              onClick={() => setShowResetModal(true)}
            >
              Reset Profile
            </button>
          </div>
        </div>
      </section>

      {/* Backup Stats Email Section */}
      <div className="mt-8">
        <EmailCapture location="fighter_profile" />
      </div>

      {showResetModal && (
        <div className="fp-modal-backdrop" onClick={() => setShowResetModal(false)} role="dialog" aria-modal="true" aria-labelledby="reset-modal-title">
          <div ref={resetModalRef} className="fp-modal-card" onClick={e => e.stopPropagation()}>
            <button className="fp-modal-close" onClick={() => setShowResetModal(false)} aria-label="Close modal">
              <X size={18} />
            </button>
            <div className="fp-modal-icon fp-modal-icon--danger">
              <Trash2 size={24} />
            </div>
            <h3 className="fp-modal-title" id="reset-modal-title">RESET FIGHTER PROFILE?</h3>
            <p className="fp-modal-desc">
              This action cannot be undone. You will lose your current rank ({rank.name}), {profile.xp.toLocaleString()} XP, streaking stats, and all logged training sessions.
            </p>
            <div className="fp-modal-actions">
              <button className="fp-modal-btn fp-modal-btn--secondary" onClick={() => setShowResetModal(false)}>
                Go Back
              </button>
              <button className="fp-modal-btn fp-modal-btn--danger" onClick={handleResetProfile}>
                Yes, Reset Everything
              </button>
            </div>
          </div>
        </div>
      )}

      {showCancelModal && (
        <div className="fp-modal-backdrop" onClick={() => setShowCancelModal(false)} role="dialog" aria-modal="true" aria-labelledby="cancel-modal-title">
          <div ref={cancelModalRef} className="fp-modal-card" onClick={e => e.stopPropagation()}>
            <button className="fp-modal-close" onClick={() => setShowCancelModal(false)} aria-label="Close modal">
              <X size={18} />
            </button>
            <div className="fp-modal-icon fp-modal-icon--warning">
              <Shield size={24} />
            </div>
            <h3 className="fp-modal-title" id="cancel-modal-title">CANCEL PRO PLAN?</h3>
            <p className="fp-modal-desc">
              Your saved techniques library (max 10), workout generator custom options, and interactive drill history will immediately revert to the free plan.
            </p>
            <div className="fp-modal-actions">
              <button className="fp-modal-btn fp-modal-btn--secondary" onClick={() => setShowCancelModal(false)}>
                Keep Pro Plan
              </button>
              <button className="fp-modal-btn fp-modal-btn--primary" onClick={handleCancelSubscription}>
                Cancel & Downgrade
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
