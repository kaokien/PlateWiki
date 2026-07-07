/**
 * Fighter Profile — XP engine, rank math, and localStorage persistence.
 * Pure utility module (no React). Handles all gamification logic.
 */
import { isAuthenticated } from './authState';
import { localDateString } from './localDate';
import { getDailyRewardState } from './dailyRewards';

// ── Rank Tiers ──────────────────────────────────────────────────────

export interface RankTier {
  name: string;
  emoji: string;
  minXP: number;
  color: string;
}

export const RANK_TIERS: RankTier[] = [
  { name: 'Sprout',      emoji: '', minXP: 0,     color: '#a0a0a0' },
  { name: 'Forager',     emoji: '', minXP: 100,   color: '#60a5fa' },
  { name: 'Cultivator',    emoji: '', minXP: 500,   color: '#f87171' },
  { name: 'Artisanal Chef',   emoji: '', minXP: 1000,  color: '#fbbf24' },
  { name: 'Harvest Master',      emoji: '', minXP: 2500,  color: '#c084fc' },
  { name: 'Earthy Sage', emoji: '', minXP: 5000,  color: '#ffd700' },
];

// ── XP Sources ──────────────────────────────────────────────────────

export type XPSource =
  | 'workout_complete'
  | 'program_day_complete'
  | 'article_read'
  | 'technique_studied'
  | 'timer_session'
  | 'streak_bonus'
  | 'quiz_complete'
  | 'dev_award'
  | 'daily_login'
  | 'challenge_complete'
  | 'welcome_bonus';

export const XP_VALUES: Record<XPSource, number> = {
  workout_complete: 10,
  program_day_complete: 25,
  article_read: 5,
  technique_studied: 5,
  timer_session: 15,
  streak_bonus: 50,
  quiz_complete: 10,
  dev_award: 100,
  daily_login: 5,
  challenge_complete: 50, // base — actual reward comes from the challenge via meta.xpAmount
  welcome_bonus: 25,
};

// ── Profile Shape ───────────────────────────────────────────────────

export interface FighterProfile {
  displayName: string;
  xp: number;
  workoutsCompleted: number;
  articlesRead: string[];
  techniquesStudied: string[];
  quizzesCompleted: string[];
  timerSessions: number;
  programDaysCompleted: number;
  longestStreak: number;
  joinedAt: string;
  /** Map of source -> last awarded date (YYYY-MM-DD) for daily throttling */
  dailyAwards: Record<string, string>;
  /** Badge IDs the user has already seen the unlock toast for */
  seenBadges: string[];
  /** Number of streak freezes earned from weekly challenges (max 3) */
  streakFreezes?: number;
  /** Total activities completed today (for Marathon badge) */
  dailyActivityCount?: Record<string, number>;
  /** Selected training goal from onboarding flow */
  trainingGoal?: 'speed' | 'power' | 'stamina' | 'defense';
  /** Spendable currency for Gym Shop */
  fightCoins?: number;
}

export interface XPAwardResult {
  awarded: boolean;
  xpGained: number;
  newXP: number;
  rankChanged: boolean;
  newRank: RankTier;
  oldRank: RankTier;
  reason?: string;
  /** True when the Lucky Harvest 2x multiplier activated */
  luckyHarvest?: boolean;
  /** Amount of Fight Coins gained in this action */
  coinsGained?: number;
  /** True when the 10% Lucky Drop 2x coin multiplier activated */
  luckyDrop?: boolean;
  /** Bonus coins awarded due to rank change */
  rankBonusCoins?: number;
}

// ── Storage ─────────────────────────────────────────────────────────

const STORAGE_KEY = 'FoodWiki_fighter_profile';

export function createDefaultProfile(): FighterProfile {
  return {
    displayName: 'Harvest Sprout',
    xp: 0,
    workoutsCompleted: 0,
    articlesRead: [],
    techniquesStudied: [],
    quizzesCompleted: [],
    timerSessions: 0,
    programDaysCompleted: 0,
    longestStreak: 0,
    joinedAt: new Date().toISOString(),
    dailyAwards: {},
    seenBadges: [],
    streakFreezes: 0,
    dailyActivityCount: {},
    trainingGoal: undefined,
    fightCoins: 0,
  };
}

// Parse cache: getProfile is called on every award and by many components,
// and re-parsing the JSON blob each time adds up. Keyed by the raw string so
// external writes (other tabs, cloud sync) invalidate naturally. Callers
// mutate the returned profile, so cache hits return a clone.
let profileCacheRaw: string | null = null;
let profileCacheValue: FighterProfile | null = null;

export function getProfile(): FighterProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      if (raw === profileCacheRaw && profileCacheValue) {
        return structuredClone(profileCacheValue);
      }
      const parsed = JSON.parse(raw);
      // Merge with defaults to handle schema evolution
      const profile = { ...createDefaultProfile(), ...parsed };
      profileCacheRaw = raw;
      profileCacheValue = structuredClone(profile);
      return profile;
    }
  } catch { /* ignore */ }
  return createDefaultProfile();
}

export function saveProfile(profile: FighterProfile): void {
  if (!isAuthenticated()) return;
  try {
    const raw = JSON.stringify(profile);
    localStorage.setItem(STORAGE_KEY, raw);
    profileCacheRaw = raw;
    profileCacheValue = structuredClone(profile);
  } catch (e) {
    console.warn('Failed to save fighter profile:', e);
  }
}

// ── Rank Math ───────────────────────────────────────────────────────

export function getRankForXP(xp: number): RankTier {
  let rank = RANK_TIERS[0];
  for (const tier of RANK_TIERS) {
    if (xp >= tier.minXP) rank = tier;
  }
  return rank;
}

export function getNextRankThreshold(xp: number): { nextRank: RankTier | null; xpNeeded: number; progress: number } {
  const current = getRankForXP(xp);
  const currentIdx = RANK_TIERS.indexOf(current);
  
  if (currentIdx >= RANK_TIERS.length - 1) {
    // Already max rank
    return { nextRank: null, xpNeeded: 0, progress: 1 };
  }

  const next = RANK_TIERS[currentIdx + 1];
  const xpIntoCurrentTier = xp - current.minXP;
  const tierRange = next.minXP - current.minXP;
  const progress = Math.min(xpIntoCurrentTier / tierRange, 1);

  return {
    nextRank: next,
    xpNeeded: next.minXP - xp,
    progress,
  };
}

// ── Lucky Harvest System ──────────────────────────────────────────────

/**
 * Deterministic lucky day calculation based on a string seed (date + source).
 * Allows unit tests to verify double-XP awards reliably.
 */
export function isLuckyHarvest(source: XPSource, dateStr: string): boolean {
  // Never award double XP on admin/streak rewards
  if (['streak_bonus', 'dev_award', 'daily_login', 'challenge_complete'].includes(source)) return false;

  const seed = `${dateStr}:${source}:lucky`;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i);
    hash |= 0;
  }
  return (Math.abs(hash) % 100) < 15;
}

// ── XP Awards ───────────────────────────────────────────────────────

function getToday(): string {
  // Local calendar date — daily throttles reset at the user's midnight,
  // not UTC's
  return localDateString();
}

/**
 * Award XP for an action. Handles deduplication and daily throttling.
 */
export function awardXP(
  source: XPSource,
  meta?: { articleId?: string; techniqueId?: string; xpAmount?: number }
): XPAwardResult {
  if (!isAuthenticated()) return { awarded: false, xpGained: 0, newXP: 0, rankChanged: false, newRank: RANK_TIERS[0], oldRank: RANK_TIERS[0] };
  const profile = getProfile();
  const oldRank = getRankForXP(profile.xp);
  const today = getToday();

  // ── Throttling ──
  // For articles: deduplicate by article ID
  if (source === 'article_read' && meta?.articleId) {
    if (profile.articlesRead.includes(meta.articleId)) {
      return {
        awarded: false,
        xpGained: 0,
        newXP: profile.xp,
        rankChanged: false,
        newRank: oldRank,
        oldRank,
        reason: 'Article already read',
      };
    }
    profile.articlesRead.push(meta.articleId);
  }

  // For techniques: deduplicate by technique ID
  if (source === 'technique_studied' && meta?.techniqueId) {
    if (!profile.techniquesStudied) profile.techniquesStudied = [];
    if (profile.techniquesStudied.includes(meta.techniqueId)) {
      return {
        awarded: false,
        xpGained: 0,
        newXP: profile.xp,
        rankChanged: false,
        newRank: oldRank,
        oldRank,
        reason: 'Technique already studied',
      };
    }
    profile.techniquesStudied.push(meta.techniqueId);
  }

  // For quizzes: deduplicate by technique ID
  if (source === 'quiz_complete' && meta?.techniqueId) {
    if (!profile.quizzesCompleted) profile.quizzesCompleted = [];
    if (profile.quizzesCompleted.includes(meta.techniqueId)) {
      return {
        awarded: false,
        xpGained: 0,
        newXP: profile.xp,
        rankChanged: false,
        newRank: oldRank,
        oldRank,
        reason: 'Quiz already completed',
      };
    }
    profile.quizzesCompleted.push(meta.techniqueId);
  }

  // For non-dev sources: throttle to 1 award per source per day
  // (challenge_complete is once-per-week, guarded by the challenge's own claimed flag)
  if (source !== 'dev_award' && source !== 'article_read' && source !== 'technique_studied' && source !== 'streak_bonus' && source !== 'quiz_complete' && source !== 'challenge_complete') {
    const lastAwarded = profile.dailyAwards[source];
    if (lastAwarded === today) {
      return {
        awarded: false,
        xpGained: 0,
        newXP: profile.xp,
        rankChanged: false,
        newRank: oldRank,
        oldRank,
        reason: 'Already earned today',
      };
    }
    profile.dailyAwards[source] = today;
  }

  // ── Lucky Harvest check (~15% chance of 2x XP) ──
  const lucky = isLuckyHarvest(source, today);
  const baseXP = source === 'daily_login'
    ? getDailyRewardState().reward
    : source === 'challenge_complete' && meta?.xpAmount
      ? meta.xpAmount
      : XP_VALUES[source];
  const xpGained = lucky ? baseXP * 2 : baseXP;
  profile.xp += xpGained;

  // ── Coin Distribution ──
  // Base coins is 2x XP gained (1:2 ratio)
  let coinsGained = xpGained * 2;
  // 10% chance for Lucky Drop (2x coins)
  const isLuckyDrop = Math.random() < 0.10 && source !== 'dev_award' && source !== 'daily_login' && source !== 'streak_bonus';
  if (isLuckyDrop) {
    coinsGained *= 2;
  }
  profile.fightCoins = (profile.fightCoins || 0) + coinsGained;

  // ── Track daily activity count (for Marathon badge) ──
  if (!profile.dailyActivityCount) profile.dailyActivityCount = {};
  profile.dailyActivityCount[today] = (profile.dailyActivityCount[today] || 0) + 1;
  // Prune old days (keep only last 2 days)
  const dayKeys = Object.keys(profile.dailyActivityCount);
  if (dayKeys.length > 2) {
    dayKeys.sort();
    for (let i = 0; i < dayKeys.length - 2; i++) {
      delete profile.dailyActivityCount[dayKeys[i]];
    }
  }

  // ── Update counters ──
  switch (source) {
    case 'workout_complete':
      profile.workoutsCompleted += 1;
      break;
    case 'timer_session':
      profile.timerSessions += 1;
      break;
    case 'program_day_complete':
      profile.programDaysCompleted += 1;
      break;
  }

  const newRank = getRankForXP(profile.xp);
  const rankChanged = newRank.name !== oldRank.name;

  let rankBonusCoins = 0;
  if (rankChanged) {
    // Award flat bonus based on the new tier
    if (newRank.name === 'Contender') rankBonusCoins = 200;
    else if (newRank.name === 'Gatekeeper') rankBonusCoins = 400;
    else if (newRank.name === 'Rising Star') rankBonusCoins = 600;
    else if (newRank.name === 'Champion') rankBonusCoins = 1000;
    else if (newRank.name === 'Hall of Famer') rankBonusCoins = 2500;
    
    if (rankBonusCoins > 0) {
      profile.fightCoins = (profile.fightCoins || 0) + rankBonusCoins;
    }
  }

  saveProfile(profile);

  // Trigger cloud sync
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('cloud-sync', { detail: { type: 'profile' } }));
  }

  return {
    awarded: true,
    xpGained,
    newXP: profile.xp,
    rankChanged,
    newRank,
    oldRank,
    luckyHarvest: lucky,
    coinsGained,
    luckyDrop: isLuckyDrop,
    rankBonusCoins,
  };
}

export function spendCoins(amount: number): boolean {
  if (!isAuthenticated()) return false;
  const profile = getProfile();
  if ((profile.fightCoins || 0) < amount) return false;
  profile.fightCoins = (profile.fightCoins || 0) - amount;
  saveProfile(profile);

  // Trigger cloud sync
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('cloud-sync', { detail: { type: 'profile' } }));
  }
  return true;
}

// ── Streak Integration ──────────────────────────────────────────────

/**
 * Update the longest streak record and check for 7-day streak bonus.
 * Call this after trackDailyVisit() from storage.ts.
 */
export function updateStreak(currentStreak: number): XPAwardResult | null {
  const profile = getProfile();

  if (currentStreak > profile.longestStreak) {
    profile.longestStreak = currentStreak;
    saveProfile(profile);
  }

  // Award streak bonus at every 7-day milestone
  if (currentStreak > 0 && currentStreak % 7 === 0) {
    const today = getToday();
    const streakKey = `streak_${currentStreak}`;
    if (!profile.dailyAwards[streakKey]) {
      profile.dailyAwards[streakKey] = today;
      saveProfile(profile);
      return awardXP('streak_bonus');
    }
  }

  return null;
}

// ── Setters ─────────────────────────────────────────────────────────

export function setDisplayName(name: string): void {
  const profile = getProfile();
  profile.displayName = name.trim().slice(0, 30) || 'Harvest Sprout';
  saveProfile(profile);
}

export function resetProfile(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch { /* ignore */ }
}

// ── Style Detection ─────────────────────────────────────────────────

/**
 * Determine the user's "fighting style" based on their most-trained categories.
 * Returns a style label for the fighter card.
 */
export function detectFightingStyle(profile: FighterProfile): string {
  if (profile.workoutsCompleted === 0) return 'Undetermined';
  
  // Simple heuristic based on volume
  const ratio = profile.timerSessions / Math.max(profile.workoutsCompleted, 1);
  
  if (ratio > 1.5) return 'Conditioning Machine';
  if (profile.articlesRead.length > profile.workoutsCompleted) return 'Student of the Game';
  if (profile.workoutsCompleted >= 20) return 'Pressure Fighter';
  if (profile.workoutsCompleted >= 10) return 'Counter Puncher';
  if (profile.workoutsCompleted >= 5) return 'Volume Puncher';
  return 'Prospect';
}
