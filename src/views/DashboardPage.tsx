'use client';

import { useMemo, useEffect, useState, useCallback } from 'react';


import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useUser } from '@clerk/nextjs';
import { useFighterProfile } from '@/context/FighterProfileContext';
import { useFighterCustomization } from '@/hooks/useFighterCustomization';
import { getStageForRank } from '@/data/fighterSprites';
import PixelFighter from '@/components/PixelFighter';
import BodySilhouette from '@/components/BodySilhouette';
import { RankIcon } from '@/components/RankIcons';
import WeeklyChallengeCard from '@/components/WeeklyChallengeCard';
import AuthGate from '@/components/AuthGate';
import TrialExpirationModal from '@/components/TrialExpirationModal';
import { techniques } from '@/data/techniques';
import { getFavorites } from '@/utils/favorites';
import {
  Zap, ArrowRight, Shield, Crosshair, Move, Brain,
  Dumbbell, Flame, Check, Lock, ChevronRight,
  BookOpen, Timer, Target, Activity, Trophy, MessageSquare, X, Play, ShoppingBag,
  Award, ClipboardList, Heart, Leaf, UtensilsCrossed, Scale, Sparkles, User, CircleCheck
} from 'lucide-react';
import './DashboardPage.css';

const InteractiveBoxer = dynamic(() => import('@/components/InteractiveBoxer'), { ssr: false });

/* ── Path stage definitions ─────────────────────────────────────────── */
const PATH_STAGES: {
  id: number;
  title: string;
  category: string;
  icon: any;
  url: string;
  desc: string;
}[] = [
  { id: 0, title: 'Macronutrient Base',   category: 'Macronutrients',          icon: Scale,    url: '/techniques/macronutrients',        desc: 'Complex carbs, clean proteins, and lipids.' },
  { id: 1, title: 'Hydration & Minerals',  category: 'Hydration & Salts',       icon: Flame,    url: '/techniques/hydration-salts',       desc: 'Electrolytes, salts, and pure hydration.' },
  { id: 2, title: 'Micronutrient Density', category: 'Micronutrients',          icon: Shield,   url: '/techniques/micronutrients',        desc: 'Vitamins, polyphenols, and green density.' },
  { id: 3, title: 'Gut & Microbiome',     category: 'Gut & Digestion',         icon: Heart,    url: '/techniques/gut-digestion',         desc: 'Fermented kefirs, active flora, and enzymes.' },
  { id: 4, title: 'Adaptogenic Support',   category: 'Superfoods & Adaptogens', icon: Zap,      url: '/techniques/superfoods-adaptogens', desc: 'Stress adapters, adrenal rest, and cordyceps.' },
];

/* ── Training goal → recommended food categories ───────────────── */
const GOAL_FOOD_MAP: Record<string, { categories: string[]; label: string }> = {
  speed: { categories: ['Macronutrients', 'Hydration & Salts'], label: 'Quick energy & hydration for speed training' },
  power: { categories: ['Macronutrients', 'Superfoods & Adaptogens'], label: 'High-density fuel for explosive power' },
  stamina: { categories: ['Hydration & Salts', 'Macronutrients', 'Gut & Digestion'], label: 'Endurance fuel & gut health for cardio' },
  defense: { categories: ['Micronutrients', 'Superfoods & Adaptogens'], label: 'Brain food & adaptogens for fight IQ' },
};

/* ── Quick action cards ─────────────────────────────────────────────── */
const QUICK_ACTIONS = [
  { label: 'Foods Library', icon: BookOpen,   href: '/techniques',          desc: 'Browse all clean fuel sources' },
  { label: 'Physiology Map', icon: Activity,   href: '#body-map',            desc: 'Explore targeted biological systems' },
  { label: 'Meal Prep Guides', icon: ChefHat,   href: '/workouts',            desc: 'Structured sports nutrition plans' },
  { label: 'Kitchen Shop',  icon: ShoppingBag, href: '/shop',                desc: 'Unlock appliances with Seed Coins' },
  { label: 'Chewing Timer', icon: Timer,      href: '/timer',               desc: 'Eating interval & digestion tracker' },
  { label: 'Articles',      icon: ClipboardList, href: '/articles',            desc: 'Read performance nutrition science' },
  { label: 'Fuel Programs', icon: Target,     href: '/programs',            desc: 'Multi-day dietary guidelines' },
];

/* Count techniques per category */
const techEntries = Object.values(techniques) as any[];
const countByCategory = (cat: string) => techEntries.filter((t: any) => t.category === cat).length;

/* ── Chef Hat / Digestion Icon fallback for ChefHat ── */
function ChefHat({ size, className }: { size?: number; className?: string }) {
  return <UtensilsCrossed size={size} className={className} />;
}

/* ── Discord Community Banner ──────────────────────────────────────── */
function DiscordBanner() {
  const [dismissed, setDismissed] = useState(false);
 
  useEffect(() => {
    if (localStorage.getItem('bw_discord_dismissed') === '1') {
      setDismissed(true);
    }
  }, []);

  if (dismissed) return null;

  const handleDismiss = () => {
    localStorage.setItem('bw_discord_dismissed', '1');
    setDismissed(true);
  };

  return (
    <div className="dash-discord glass-panel">
      <MessageSquare size={18} className="dash-discord__icon" />
      <div className="dash-discord__text">
        <strong>Nutrition is simpler with a kitchen community.</strong>{' '}
        <span className="dash-discord__sub">Share recipe photos, talk sports fueling with other athletes, and get feedback in our Discord community.</span>
      </div>
      <a
        href="https://discord.gg/FoodWiki"
        target="_blank"
        rel="noopener noreferrer"
        className="dash-discord__cta"
      >
        Join the Kitchen <ArrowRight size={14} />
      </a>
      <button className="dash-discord__close" onClick={handleDismiss} aria-label="Dismiss">
        <X size={14} />
      </button>
    </div>
  );
}

/* ── Getting Started Checklist (Goal Gradient Effect) ───────────────── */
function GettingStartedChecklist({ profile, customization, totalStudied }: {
  profile: any;
  customization: any;
  totalStudied: number;
}) {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('fw_checklist_dismissed') === '1') {
      setDismissed(true);
    }
  }, []);

  const items = useMemo(() => [
    { label: 'Account created', done: true },
    { label: 'Avatar customized', done: !!(customization?.fighterName || customization?.skinTone > 0 || customization?.gloveColor > 0) },
    { label: 'Nutrition goal set', done: !!profile.trainingGoal },
    { label: 'Read your first food page', done: totalStudied > 0 },
    { label: 'Complete a quiz', done: (profile.quizzesCompleted?.length ?? 0) > 0 },
    { label: 'Log a meal prep', done: profile.workoutsCompleted > 0 },
    { label: 'Start a timer session', done: profile.timerSessions > 0 },
  ], [profile, customization, totalStudied]);

  const completed = items.filter(i => i.done).length;
  const pct = Math.round((completed / items.length) * 100);

  if (dismissed || completed === items.length) return null;

  return (
    <div className="dash-checklist glass-panel">
      <div className="dash-checklist__head">
        <div className="dash-checklist__title-row">
          <Sparkles size={16} className="dash-checklist__icon" />
          <span className="dash-checklist__title">Getting Started</span>
          <span className="dash-checklist__pct">{pct}%</span>
        </div>
        <button
          className="dash-checklist__dismiss"
          onClick={() => { localStorage.setItem('fw_checklist_dismissed', '1'); setDismissed(true); }}
          aria-label="Dismiss checklist"
        >
          <X size={14} />
        </button>
      </div>
      <div className="dash-checklist__bar">
        <div className="dash-checklist__bar-fill" style={{ width: `${pct}%` }} />
      </div>
      <ul className="dash-checklist__items">
        {items.map((item) => (
          <li key={item.label} className={`dash-checklist__item ${item.done ? 'done' : ''}`}>
            {item.done ? <CircleCheck size={14} /> : <div className="dash-checklist__circle" />}
            <span>{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const { profile, rank, nextRankInfo, streak } = useFighterProfile();
  const { customization } = useFighterCustomization();
  const [handlePartSelect, setHandlePartSelect] = useState<((id: string) => void) | null>(null);

  // Build the router handler client-side
  useEffect(() => {
    setHandlePartSelect(() => (partId: string) => {
      window.location.href = `/anatomy/${partId}`;
    });
  }, []);

  // My Pantry — user's saved favorites
  const [pantryIds, setPantryIds] = useState<string[]>([]);
  useEffect(() => {
    setPantryIds(getFavorites());
  }, []);
  const pantryFoods = useMemo(() => {
    return pantryIds
      .slice(0, 5)
      .map(id => (techniques as any)[id])
      .filter(Boolean);
  }, [pantryIds]);

  if (isLoaded && !user) {
    return (
      <div className="dash-page dash-page--preview">
        {/* Blurred sample dashboard preview */}
        <div className="dash-preview-bg" aria-hidden="true">
          <header className="dash-header">
            <div className="dash-header__left">
              <div className="dash-header__fighter">
                <PixelFighter rankName="Harvest Sprout" size="md" animation="idle" />
              </div>
              <div className="dash-header__text">
                <h1 className="dash-header__title">Welcome, Challenger</h1>
                <div className="dash-header__meta">
                  <RankIcon rankName="Harvest Sprout" size={14} />
                  <span>Harvest Sprout</span>
                  <span className="dash-sep">·</span>
                  <span style={{ color: '#2d8a4e', fontWeight: 800 }}>🌱 25</span>
                  <span className="dash-sep">·</span>
                  <Flame size={14} />
                  <span>Start your streak 🔥</span>
                </div>
              </div>
            </div>
          </header>
          <div className="dash-stats-row">
            <div className="dash-stat-card glass-panel">
              <div className="dash-stat-card__label">GROWTH PROGRESS</div>
              <div className="dash-stat-card__bar-wrap">
                <div className="dash-stat-card__bar">
                  <div className="dash-stat-card__bar-fill" style={{ width: '15%' }} />
                </div>
                <span className="dash-stat-card__bar-text">Earn XP to reach Green Shoot</span>
              </div>
            </div>
            <div className="dash-stat-card glass-panel">
              <div className="dash-stat-card__label">ACTIVE DAYS</div>
              <div className="dash-calendar">
                {['SU','MO','TU','WE','TH','FR','SA'].map((d, i) => (
                  <div key={i} className={`dash-cal-day ${i === 6 ? 'today' : ''}`}>
                    <span className="dash-cal-name">{d}</span>
                    <span className="dash-cal-num">{new Date().getDate() - (6 - i)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sign-in overlay */}
        <div className="dash-preview-overlay">
          <AuthGate
            feature="Fueling Dashboard"
            description="Sign in to access your personalized clean fueling path, progress tracking, and recipe recommendations."
          />
        </div>
      </div>
    );
  }

  const stage = getStageForRank(rank.name);
  const { nextRank, xpNeeded, progress } = nextRankInfo;
  const displayName = profile.displayName || user?.firstName || 'Harvest Sprout';
  const totalStudied = profile.techniquesStudied?.length ?? 0;
  const isNewUser = totalStudied === 0 && profile.workoutsCompleted === 0;

  // Reactive fighter animation based on user state (IKEA Effect)
  const fighterAnimation = streak > 0 ? 'training' as const : 'idle' as const;

  // Determine active stage based on studied techniques per category
  const studiedByCategory: Record<string, number> = {};
  (profile.techniquesStudied ?? []).forEach((techId: string) => {
    const tech = (techniques as any)[techId];
    if (tech) {
      studiedByCategory[tech.category] = (studiedByCategory[tech.category] || 0) + 1;
    }
  });

  // A stage is "complete" if user studied at least 3 techniques in that category
  const getStageStatus = (stageIdx: number) => {
    const cat = PATH_STAGES[stageIdx].category;
    const studied = studiedByCategory[cat] || 0;
    const total = countByCategory(cat);
    const threshold = Math.min(3, total);
    if (studied >= threshold) return 'completed';
    // Active = first incomplete stage
    for (let i = 0; i < stageIdx; i++) {
      const prevCat = PATH_STAGES[i].category;
      const prevStudied = studiedByCategory[prevCat] || 0;
      const prevTotal = countByCategory(prevCat);
      const prevThreshold = Math.min(3, prevTotal);
      if (prevStudied < prevThreshold) return 'locked';
    }
    return 'active';
  };

  // 7-day streak calendar
  const calendarDays = useMemo(() => {
    const days: { dayNum: number; dayName: string; isActive: boolean; isToday: boolean }[] = [];
    const weekdays = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      days.push({
        dayNum: date.getDate(),
        dayName: weekdays[date.getDay()],
        isActive: !!(profile as any).dailyActivityCount?.[dateStr],
        isToday: i === 0,
      });
    }
    return days;
  }, [profile]);

  // Goal-based recommendations (IKEA Effect — make the training goal visible)
  const goalRecs = useMemo(() => {
    if (!profile.trainingGoal) return null;
    const mapping = GOAL_FOOD_MAP[profile.trainingGoal];
    if (!mapping) return null;
    const allTechs = Object.values(techniques) as any[];
    const studied = new Set(profile.techniquesStudied || []);
    const recs = allTechs
      .filter((t: any) => mapping.categories.includes(t.category) && !studied.has(t.id))
      .slice(0, 3);
    return recs.length > 0 ? { foods: recs, label: mapping.label } : null;
  }, [profile.trainingGoal, profile.techniquesStudied]);

  return (
    <div className="dash-page">
        <TrialExpirationModal />
      {/* ── Header Row ─────────────────────────────────────────────── */}
      <header className="dash-header">
        <div className="dash-header__left">
          <div className="dash-header__fighter">
            <PixelFighter rankName={rank.name} size="md" animation={fighterAnimation} customization={customization} />
          </div>
          <div className="dash-header__text">
            <h1 className="dash-header__title">
              WELCOME BACK, <span className="text-primary">{displayName.toUpperCase()}</span>
            </h1>
            <div className="dash-header__meta">
              <RankIcon rankName={rank.name} size={14} />
              <span style={{ color: rank.color }}>{rank.name}</span>
              <span className="dash-sep">·</span>
              <Zap size={14} />
              <span>{profile.xp.toLocaleString()} XP</span>
              <span className="dash-sep">·</span>
              <span style={{ color: '#2d8a4e', fontWeight: 800 }}>🌱 {(profile.fightCoins || 0).toLocaleString()}</span>
              <span className="dash-sep">·</span>
              <Flame size={14} color={streak > 0 ? '#2d8a4e' : undefined} />
              <span>{streak > 0 ? `${streak}-day streak` : 'Start your streak 🔥'}</span>
            </div>
          </div>
          <a
            href="#body-map"
            className="dash-header__bodymap"
            aria-label="Jump to the physiology map"
            onClick={(e) => {
              const target = document.getElementById('body-map');
              if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
          >
            <BodySilhouette className="dash-header__bodymap-svg" aria-hidden="true" />
            <span className="dash-header__bodymap-label">Physiology Map</span>
          </a>
        </div>
        <Link href="/fighter" className="dash-header__profile-link">
          Bio-Athlete Profile <ChevronRight size={14} />
        </Link>
      </header>

      {/* ── Stats Row ──────────────────────────────────────────────── */}
      <div className="dash-stats-row">
        {/* XP Progress */}
        <div className="dash-stat-card glass-panel">
          <div className="dash-stat-card__label">GROWTH PROGRESS</div>
          <div className="dash-stat-card__bar-wrap">
            <div className="dash-stat-card__bar">
              <div className="dash-stat-card__bar-fill" style={{ width: `${Math.round(progress * 100)}%` }} />
            </div>
            <span className="dash-stat-card__bar-text">
              {nextRank ? (progress > 0 ? `${xpNeeded.toLocaleString()} XP to ${nextRank.name}` : `Earn XP to reach ${nextRank.name}`) : 'MAX RANK'}
            </span>
          </div>
        </div>

        {/* 7-Day Calendar */}
        <div className="dash-stat-card glass-panel">
          <div className="dash-stat-card__label">ACTIVE DAYS</div>
          <div className="dash-calendar">
            {calendarDays.map((day, i) => (
              <div key={i} className={`dash-cal-day ${day.isActive ? 'active' : ''} ${day.isToday ? 'today' : ''}`}>
                <span className="dash-cal-name">{day.dayName}</span>
                <span className="dash-cal-num">
                  {day.isActive ? <Check size={12} /> : day.dayNum}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Challenge */}
        <WeeklyChallengeCard />

        {/* Nutritional Journal */}
        <div className="dash-stat-card glass-panel">
          <div className="dash-stat-card__label">NUTRITIONAL JOURNAL</div>
          <div className="dash-record-inline">
            <Link href="/workouts" className="dash-record-inline__stat dash-record-inline__stat--link">
              <ChefHat size={13} />
              <span className="dash-record-inline__val">{profile.workoutsCompleted || '—'}</span>
              <span className="dash-record-inline__lbl">{profile.workoutsCompleted > 0 ? 'Meal Preps' : 'Try a recipe'}</span>
            </Link>
            <Link href="/techniques" className="dash-record-inline__stat dash-record-inline__stat--link">
              <Leaf size={13} />
              <span className="dash-record-inline__val">{totalStudied || '—'}</span>
              <span className="dash-record-inline__lbl">{totalStudied > 0 ? 'Foods' : 'Explore foods'}</span>
            </Link>
            <Link href="/articles" className="dash-record-inline__stat dash-record-inline__stat--link">
              <BookOpen size={13} />
              <span className="dash-record-inline__val">{(profile.articlesRead?.length ?? 0) || '—'}</span>
              <span className="dash-record-inline__lbl">{(profile.articlesRead?.length ?? 0) > 0 ? 'Articles' : 'Read an article'}</span>
            </Link>
            <Link href="/timer" className="dash-record-inline__stat dash-record-inline__stat--link">
              <Timer size={13} />
              <span className="dash-record-inline__val">{profile.timerSessions || '—'}</span>
              <span className="dash-record-inline__lbl">{profile.timerSessions > 0 ? 'Sessions' : 'Try fasting'}</span>
            </Link>
            <Link href="/techniques" className="dash-record-inline__stat dash-record-inline__stat--link">
              <Award size={13} />
              <span className="dash-record-inline__val">{(profile.quizzesCompleted?.length ?? 0) || '—'}</span>
              <span className="dash-record-inline__lbl">{(profile.quizzesCompleted?.length ?? 0) > 0 ? 'Quizzes' : 'Take a quiz'}</span>
            </Link>
            <div className="dash-record-inline__stat">
              <Flame size={13} />
              <span className="dash-record-inline__val">{profile.longestStreak || '—'}</span>
              <span className="dash-record-inline__lbl">{profile.longestStreak > 0 ? 'Best Streak' : 'Build a streak'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Getting Started Checklist (Goal Gradient) ──────────────── */}
      <GettingStartedChecklist profile={profile} customization={customization} totalStudied={totalStudied} />

      {/* ── My Pantry (IKEA/Endowment Effect) ──────────────────────── */}
      {pantryFoods.length > 0 && (
        <section className="dash-pantry">
          <div className="dash-section-head">
            <h2 className="section-heading">MY <span className="text-primary">PANTRY</span></h2>
            <Link href="/favorites" className="dash-section-link">View all ({pantryIds.length}) <ChevronRight size={14} /></Link>
          </div>
          <div className="dash-pantry__grid">
            {pantryFoods.map((food: any) => (
              <Link key={food.id} href={`/technique/${food.id}`} className="dash-pantry-card glass-panel">
                <Heart size={12} className="dash-pantry-card__heart" fill="currentColor" />
                <span className="dash-pantry-card__name">{food.name}</span>
                <span className="dash-pantry-card__cat">{food.category}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Continue Fueling CTA ──────────────────────────────────── */}
      {(() => {
        const activeStage = PATH_STAGES.find((_, i) => getStageStatus(i) === 'active');
        const allComplete = PATH_STAGES.every((_, i) => getStageStatus(i) === 'completed');
        const ctaStage = activeStage || (allComplete ? null : PATH_STAGES[0]);
        const ctaUrl = ctaStage?.url || '/techniques';
        const ctaLabel = isNewUser ? 'Start Here' : allComplete ? 'Keep Fueling' : 'Continue Fueling';
        const ctaDesc = isNewUser
          ? 'Begin your clean fueling journey — explore energy and carbs first.'
          : allComplete
            ? 'You\'ve cleared The Path. Keep nourishing your systems across all food disciplines.'
            : `Pick up where you left off: ${ctaStage?.title} — ${ctaStage?.desc}`;
        const CtaIcon = ctaStage?.icon || Leaf;

        return (
          <Link href={ctaUrl} className="dash-continue glass-panel">
            <div className="dash-continue__icon-wrap">
              <CtaIcon size={22} />
            </div>
            <div className="dash-continue__content">
              <span className="dash-continue__label">{ctaLabel}</span>
              <span className="dash-continue__desc">{ctaDesc}</span>
            </div>
            <ArrowRight size={18} className="dash-continue__arrow" />
          </Link>
        );
      })()}

      {/* ── Discord Banner ────────────────────────────────────────── */}
      <DiscordBanner />

      {/* ── Goal-Based Recommendations ────────────────────────────── */}
      {goalRecs && (
        <section className="dash-goal-recs">
          <div className="dash-section-head">
            <h2 className="section-heading">FOR YOUR <span className="text-primary">GOAL</span></h2>
            <span className="dash-section-sub">{goalRecs.label.toUpperCase()}</span>
          </div>
          <div className="dash-goal-recs__grid">
            {goalRecs.foods.map((food: any) => (
              <Link key={food.id} href={`/technique/${food.id}`} className="dash-goal-rec glass-panel">
                <div className="dash-goal-rec__cat">{food.category}</div>
                <h3 className="dash-goal-rec__name">{food.name}</h3>
                <p className="dash-goal-rec__desc">{food.description?.substring(0, 80)}…</p>
                <span className="dash-goal-rec__link">Study <ArrowRight size={12} /></span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── The Path ───────────────────────────────────────────────── */}
      <section className="dash-path">
        <div className="dash-section-head">
          <h2 className="section-heading">THE <span className="text-primary">PATH</span></h2>
          <span className="dash-section-sub">RECOMMENDED SEQUENCE · SKIP AHEAD IF YOU PREFER</span>
        </div>

        <div className="dash-path-grid">
          {PATH_STAGES.map((s, i) => {
            const status = getStageStatus(i);
            const catCount = countByCategory(s.category);
            const studied = studiedByCategory[s.category] || 0;
            const StageIcon = s.icon;

            return (
              <Link
                key={s.id}
                href={status === 'locked' ? '#' : s.url}
                className={`dash-path-card glass-panel dash-path-card--${status}`}
              >
                <div className="dash-path-card__top">
                  <span className={`dash-path-tag dash-path-tag--${status}`}>
                    {status === 'completed' && <><Check size={10} /> DONE</>}
                    {status === 'active' && <>ACTIVE</>}
                    {status === 'locked' && <><Lock size={10} /> LOCKED</>}
                  </span>
                  <span className="dash-path-num">0{i + 1}</span>
                </div>

                <div className="dash-path-card__icon">
                  <StageIcon size={20} />
                </div>

                <h3 className="dash-path-card__title">{s.title}</h3>
                <p className="dash-path-card__desc">{s.desc}</p>

                <div className="dash-path-card__progress">
                  <span>{studied > 0 ? `${studied} / ${catCount}` : `${catCount} to explore`}</span>
                  <div className="dash-path-card__bar">
                    <div className="dash-path-card__bar-fill" style={{ width: `${catCount > 0 ? (studied / catCount) * 100 : 0}%` }} />
                  </div>
                </div>

                {status !== 'locked' && (
                  <span className="dash-path-card__link">
                    {status === 'completed' ? 'Review' : 'Fuel'} <ArrowRight size={12} />
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── Quick Actions ──────────────────────────────────────────── */}
      <section className="dash-quick">
        <h2 className="section-heading">QUICK <span className="text-primary">ACCESS</span></h2>
        <div className="dash-quick-grid">
          {QUICK_ACTIONS.map((action) => {
            const ActionIcon = action.icon;
            return (
              <Link key={action.label} href={action.href} className="dash-quick-card glass-panel">
                <ActionIcon size={18} />
                <div>
                  <span className="dash-quick-card__title">{action.label}</span>
                  <span className="dash-quick-card__desc">{action.desc}</span>
                </div>
                <ChevronRight size={14} className="dash-quick-card__arrow" />
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── Physiology Map ──────────────────────────────────────────── */}
      <section className="dash-bodymap" id="body-map">
        <h2 className="section-heading">EXPLORE BY <span className="text-primary">PHYSIOLOGY</span></h2>
        <div className="dash-bodymap__wrap">
          {handlePartSelect && (
            <InteractiveBoxer onPartSelect={handlePartSelect} activePart={null} />
          )}
        </div>
        <Link href="/workout-generator" className="dash-bodymap__cta">
          <ChefHat size={18} /> Build Custom Fueling Plan <ArrowRight size={16} />
        </Link>
      </section>
    </div>
  );
}
