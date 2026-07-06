'use client';

import { useMemo, useEffect, useState } from 'react';
import { useFighterProfile } from '@/context/FighterProfileContext';
import { useFighterCustomization } from '@/hooks/useFighterCustomization';
import { getStageForRank } from '@/data/fighterSprites';
import PixelFighter from '@/components/PixelFighter';
import WeeklyChallengeCard from '@/components/WeeklyChallengeCard';
import { Flame, Zap, Swords, BookOpen, Dumbbell, Timer, ArrowRight, Shield, Crosshair, Move, Brain, Check, Lock, MessageSquare } from 'lucide-react';
import { localDateString, daysBetween } from '@/utils/localDate';
import Link from 'next/link';
import './HomeFighterModule.css';

interface PathStage {
  id: number;
  title: string;
  desc: string;
  category: string;
  icon: any;
  url: string;
  minTechs: number;
  maxTechs: number;
}

const PATH_STAGES: PathStage[] = [
  {
    id: 0,
    title: 'Energy & Carbs',
    desc: 'Master the foundation of glycogen restoration and slow/fast carb load timing.',
    category: 'Carbs',
    icon: Move,
    url: '/techniques/macronutrients',
    minTechs: 0,
    maxTechs: 4,
  },
  {
    id: 1,
    title: 'Muscle & Proteins',
    desc: 'Learn essential amino acid profiles, whey protein isolate, and recovery foods.',
    category: 'Proteins',
    icon: Crosshair,
    url: '/techniques/macronutrients',
    minTechs: 4,
    maxTechs: 8,
  },
  {
    id: 2,
    title: 'Fats & Hydration',
    desc: 'Support joint lubrication, cellular balance, and trace salt electrolytes.',
    category: 'Fats & Hydration',
    icon: Shield,
    url: '/techniques/hydration-salts',
    minTechs: 8,
    maxTechs: 12,
  },
  {
    id: 3,
    title: 'Stress & Adaptogens',
    desc: 'Regulate cortisol and improve focus with ashwagandha and medicinal mushrooms.',
    category: 'Adaptogens',
    icon: Brain,
    url: '/techniques/superfoods-adaptogens',
    minTechs: 12,
    maxTechs: 15,
  },
  {
    id: 4,
    title: 'Microbiome & Gut',
    desc: 'Build a solid gut barrier and absorb nutrients with fermented kefir and probiotics.',
    category: 'Gut Health',
    icon: Dumbbell,
    url: '/techniques/gut-digestion',
    minTechs: 15,
    maxTechs: 18,
  },
];

export default function HomeFighterModule() {
  const { profile, rank, streak, nextRankInfo } = useFighterProfile();
  const { customization } = useFighterCustomization();

  const [joinedDiscord, setJoinedDiscord] = useState(false);

  useEffect(() => {
    setJoinedDiscord(localStorage.getItem('joined_discord') === 'true');
  }, []);

  const handleJoinDiscord = () => {
    localStorage.setItem('joined_discord', 'true');
    setJoinedDiscord(true);
  };

  // Determine current active stage index along the path
  const totalStudied = profile.techniquesStudied?.length ?? 0;
  
  const activeStageIdx = useMemo(() => {
    let idx = 0;
    for (let i = 0; i < PATH_STAGES.length; i++) {
      const stage = PATH_STAGES[i];
      if (stage && totalStudied >= stage.minTechs) {
        idx = i;
      }
    }
    return idx;
  }, [totalStudied]);

  const currentStage = PATH_STAGES[activeStageIdx] || PATH_STAGES[0];
  const minTechs = currentStage.minTechs;
  const maxTechs = currentStage.maxTechs;
  const stageRange = maxTechs - minTechs;
  const stageProgressCount = Math.min(totalStudied - minTechs, stageRange);
  const stagePct = Math.min(100, Math.round((stageProgressCount / stageRange) * 100));

  // Calendar: Last 7 days
  const calendarDays = useMemo(() => {
    const days: any[] = [];
    const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0]; // local format YYYY-MM-DD
      const dayNum = date.getDate();
      const dayName = weekdays[date.getDay()];
      
      // Active if user had activity count on that day
      const isActive = !!profile.dailyActivityCount?.[dateStr];
      
      days.push({
        dayNum,
        dayName,
        isActive,
        isToday: i === 0,
      });
    }
    return days;
  }, [profile.dailyActivityCount]);

  const displayName = profile.displayName || 'Harvest Sprout';

  return (
    <div className="db-root" style={{ '--rank-color': rank.color } as React.CSSProperties}>
      
      {/* ── Welcome Header ── */}
      <header className="db-welcome">
        <span className="db-date">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
        <h1 className="db-welcome-title">Welcome back, <em>{displayName}</em>.</h1>
        <p className="db-welcome-sub">Your path starts today. The next session is ready when you are.</p>
      </header>

      {/* ── Grid Layout: Current Work, Challenge, Streak ── */}
      <div className="db-grid">
        {/* Next up in Path Card */}
        <section className="db-card glass-panel db-card--path">
          <div className="db-card-label">Next Up</div>
          <h2 className="db-card-title">{currentStage.title}</h2>
          <p className="db-card-desc">{currentStage.desc}</p>
          
          <div className="db-path-progress-wrap">
            <div className="db-path-progress-text">
              <span>STAGE PROGRESS</span>
              <span>{totalStudied} / {maxTechs} Foods</span>
            </div>
            <div className="db-path-progress-bar">
              <div className="db-path-progress-fill" style={{ width: `${stagePct}%` }} />
            </div>
          </div>

          <Link href={currentStage.url} className="db-cta-btn db-cta-btn--gold mt-auto">
            Resume Fueling <ArrowRight size={16} />
          </Link>
        </section>

        {/* Weekly Challenge Card */}
        <WeeklyChallengeCard />

        {/* Calendar / Activity Stats Card */}
        <section className="db-card glass-panel db-card--calendar">
          <div className="db-card-label">Active Days</div>
          
          <div className="db-calendar-strip">
            {calendarDays.map((day, i) => (
              <div key={i} className={`db-calendar-day ${day.isActive ? 'active' : ''} ${day.isToday ? 'today' : ''}`}>
                <span className="db-calendar-name">{day.dayName}</span>
                <div className="db-calendar-circle" title={day.isActive ? 'Active' : 'No activity recorded'}>
                  {day.isActive ? <Check size={14} /> : <span className="db-calendar-num">{day.dayNum}</span>}
                </div>
              </div>
            ))}
          </div>

          <div className="db-stats-row">
            <div className="db-stat-item">
              <span className="db-stat-value">{streak}</span>
              <span className="db-stat-label">DAY STREAK</span>
            </div>
            <div className="db-stat-item">
              <span className="db-stat-value">{profile.xp}</span>
              <span className="db-stat-label">TOTAL XP</span>
            </div>
          </div>
        </section>
      </div>

      {/* ── Discord Banner ── */}
      <div className="db-discord glass-panel">
        <div className="db-discord-content">
          <MessageSquare className="db-discord-icon" size={24} color="#ffd700" />
          <div className="db-discord-text">
            <h3>Fueling is better together</h3>
            <p>Join 400+ athletes in our Discord: ask questions, share meal prep photos, and learn together.</p>
          </div>
        </div>
        <a 
          href={joinedDiscord ? "discord://discord.gg/Vhygw7DpVM" : "https://discord.gg/Vhygw7DpVM"}
          onClick={handleJoinDiscord}
          target="_blank" 
          rel="noopener noreferrer" 
          className="db-discord-btn"
        >
          {joinedDiscord ? "Open Discord" : "Enter Kitchen Community"} <ArrowRight size={16} />
        </a>
      </div>

      {/* ── The Path Section ── */}
      <section className="db-path-section">
        <h2 className="db-section-title">
          The Path
          <span className="db-section-subtitle">RECOMMENDED NUTRITIONAL SEQUENCE</span>
        </h2>

        <div className="db-path-cards">
          {PATH_STAGES.map((stage, i) => {
            const isCompleted = activeStageIdx > i;
            const isActive = activeStageIdx === i;
            const isLocked = activeStageIdx < i;

            const StageIcon = stage.icon;

            let cardClass = 'db-path-card glass-panel';
            if (isCompleted) cardClass += ' db-path-card--completed';
            if (isActive) cardClass += ' db-path-card--active';
            if (isLocked) cardClass += ' db-path-card--locked';

            return (
              <div key={stage.id} className={cardClass}>
                <div className="db-path-card-status">
                  {isCompleted ? (
                    <span className="status-tag status-tag--completed"><Check size={12} /> Completed</span>
                  ) : isActive ? (
                    <span className="status-tag status-tag--active">Active</span>
                  ) : (
                    <span className="status-tag status-tag--locked"><Lock size={10} /> Locked</span>
                  )}
                  <span className="stage-num">0{i + 1}</span>
                </div>

                <div className="db-path-card-body">
                  <div className="db-path-card-icon-wrap">
                    <StageIcon size={20} />
                  </div>
                  <h3>{stage.title}</h3>
                  <p>{stage.desc}</p>
                </div>

                <Link href={isLocked ? '#' : stage.url} className={`db-path-card-link ${isLocked ? 'disabled' : ''}`}>
                  {isCompleted ? 'Review category' : isActive ? 'Resume fueling' : 'Locked'} <ArrowRight size={14} />
                </Link>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
