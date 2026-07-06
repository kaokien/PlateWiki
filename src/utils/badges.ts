/**
 * Badge / Achievement system — pure definitions + check logic.
 * Each badge's `check()` reads existing FighterProfile fields.
 */

import type { FighterProfile } from './fighterProfile';
import { TECHNIQUE_COUNT } from '@/data/techniqueCount';

// ── Badge Shape ─────────────────────────────────────────────────────

export interface Badge {
  id: string;
  name: string;
  description: string;
  /** Lucide icon name */
  icon: string;
  color: string;
  category: 'training' | 'knowledge' | 'dedication' | 'mastery';
  check: (profile: FighterProfile, allBadges?: Badge[]) => boolean;
  hidden?: boolean;
  estimatedEarners?: number;
}

// ── Badge Roster ────────────────────────────────────────────────────

export const BADGES: Badge[] = [
  // ─ Dedication ─
  {
    id: 'first-blood',
    name: 'First Sprout',
    description: 'Earn XP for the first time',
    icon: 'Zap',
    color: '#fbbf24',
    category: 'dedication',
    check: (p) => p.xp > 0,
    estimatedEarners: 8200,
  },
  {
    id: 'iron-chin',
    name: 'Sprout Care',
    description: '7-day visit streak',
    icon: 'Flame',
    color: '#f97316',
    category: 'dedication',
    check: (p) => p.longestStreak >= 7,
    estimatedEarners: 3100,
  },
  {
    id: 'road-warrior',
    name: 'Soil Master',
    description: '30-day visit streak',
    icon: 'Flame',
    color: '#ef4444',
    category: 'dedication',
    check: (p) => p.longestStreak >= 30,
    estimatedEarners: 420,
  },

  // ─ Knowledge ─
  {
    id: 'bookworm',
    name: 'Bookworm',
    description: 'Read 5 articles',
    icon: 'BookOpen',
    color: '#60a5fa',
    category: 'knowledge',
    check: (p) => p.articlesRead.length >= 5,
    estimatedEarners: 4600,
  },
  {
    id: 'scholar',
    name: 'Nutritional Scholar',
    description: 'Read 15 articles',
    icon: 'GraduationCap',
    color: '#818cf8',
    category: 'knowledge',
    check: (p) => p.articlesRead.length >= 15,
    estimatedEarners: 1800,
  },
  {
    id: 'student',
    name: 'Apprentice Harvester',
    description: 'Study 5 foods',
    icon: 'BookOpen',
    color: '#34d399',
    category: 'knowledge',
    check: (p) => (p.techniquesStudied?.length ?? 0) >= 5,
    estimatedEarners: 2400,
  },
  {
    id: 'professor',
    name: 'Chief Alchemist',
    description: 'Study 15 foods',
    icon: 'Award',
    color: '#a78bfa',
    category: 'knowledge',
    check: (p) => (p.techniquesStudied?.length ?? 0) >= 15,
    estimatedEarners: 380,
  },
  {
    id: 'quiz-master',
    name: 'Quiz Master',
    description: 'Pass 20 knowledge checks',
    icon: 'Brain',
    color: '#f472b6',
    category: 'knowledge',
    check: (p) => (p.quizzesCompleted?.length ?? 0) >= 20,
    estimatedEarners: 650,
  },

  // ─ Training ─
  {
    id: 'gym-rat',
    name: 'Kitchen Regular',
    description: 'Complete 10 fuel guides/recipes',
    icon: 'Dumbbell',
    color: '#f87171',
    category: 'training',
    check: (p) => p.workoutsCompleted >= 10,
    estimatedEarners: 3200,
  },
  {
    id: 'iron-will',
    name: 'Culinary Master',
    description: 'Complete 50 fuel guides/recipes',
    icon: 'Dumbbell',
    color: '#dc2626',
    category: 'training',
    check: (p) => p.workoutsCompleted >= 50,
    estimatedEarners: 510,
  },
  {
    id: 'timekeeper',
    name: 'Timekeeper',
    description: 'Complete 10 fasting/harvest sessions',
    icon: 'Timer',
    color: '#2dd4bf',
    category: 'training',
    check: (p) => p.timerSessions >= 10,
    estimatedEarners: 2800,
  },

  // ─ Mastery ─
  {
    id: 'encyclopedia',
    name: 'Earthy Encyclopedia',
    description: 'Study every food in the database',
    icon: 'Trophy',
    color: '#ffd700',
    category: 'mastery',
    check: (p) => (p.techniquesStudied?.length ?? 0) >= TECHNIQUE_COUNT,
    estimatedEarners: 85,
  },

  // ─ Mystery ─ (hidden until earned)
  {
    id: 'night-owl',
    name: 'Night Owl',
    description: 'Visit the site between midnight and 4 AM',
    icon: 'Moon',
    color: '#6366f1',
    category: 'dedication',
    hidden: true,
    estimatedEarners: 1200,
    check: (p) => {
      try {
        if (typeof window !== 'undefined') {
          if (localStorage.getItem('FoodWiki_badge_night_owl')) return true;
        }
      } catch {}
      return !!(p as any).nightOwlUnlocked;
    },
  },
  {
    id: 'marathon',
    name: 'Marathon',
    description: 'Complete 5 activities in a single day',
    icon: 'Rocket',
    color: '#ec4899',
    category: 'training',
    hidden: true,
    estimatedEarners: 950,
    check: (p) => {
      const counts = p.dailyActivityCount;
      if (!counts) return false;
      return Object.values(counts).some((c: any) => c >= 5);
    },
  },
  {
    id: 'completionist',
    name: 'Completionist',
    description: 'Earn every other badge',
    icon: 'Crown',
    color: '#f59e0b',
    category: 'mastery',
    hidden: true,
    estimatedEarners: 42,
    check: (p, allBadges) => {
      if (!allBadges) return false;
      return allBadges
        .filter((b) => !b.hidden && b.id !== 'completionist')
        .every((b) => b.check(p));
    },
  },
];

export function formatEarners(count: number): string {
  if (count >= 1000) return `~${(count / 1000).toFixed(1)}k athletes`;
  return `~${count} athletes`;
}

export function getEarnedBadges(profile: FighterProfile): Badge[] {
  return BADGES.filter((b) => b.check(profile, BADGES));
}

export function getEarnedBadgeIds(profile: FighterProfile): string[] {
  return getEarnedBadges(profile).map((b) => b.id);
}

export function getNewlyUnlockedBadges(
  profile: FighterProfile,
  previouslySeenIds: string[]
): Badge[] {
  return BADGES.filter(
    (b) => b.check(profile, BADGES) && !previouslySeenIds.includes(b.id)
  );
}
