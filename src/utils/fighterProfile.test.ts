// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Mock authState
vi.mock('./authState', () => ({
  isAuthenticated: vi.fn(() => true),
}));

import {
  getProfile,
  awardXP,
  getRankForXP,
  getNextRankThreshold,
  resetProfile,
  updateStreak,
  setDisplayName,
  detectFightingStyle,
  isLuckyHarvest,
  RANK_TIERS,
  XP_VALUES,
} from '@/utils/fighterProfile';

// Mock localStorage
const store: Record<string, string> = {};
beforeEach(() => {
  Object.keys(store).forEach(k => delete store[k]);
  vi.spyOn(Storage.prototype, 'getItem').mockImplementation(k => store[k] ?? null);
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation((k, v) => { store[k] = v; });
  vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(k => { delete store[k]; });
  // Freeze time to a date where Lucky Punch is FALSE for every activity
  // source, so XP assertions are deterministic (awardXP doubles XP on
  // ~15% of day+source combinations)
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2026, 4, 2, 12, 0, 0)); // 2026-05-02 local
});

afterEach(() => {
  vi.useRealTimers();
});

describe('getRankForXP', () => {
  it('returns Prospect for 0 XP', () => {
    expect(getRankForXP(0).name).toBe('Sprout');
  });

  it('returns Contender at 100 XP', () => {
    expect(getRankForXP(100).name).toBe('Forager');
  });

  it('returns Champion at 2500 XP', () => {
    expect(getRankForXP(2500).name).toBe('Harvest Master');
  });

  it('returns Hall of Famer at 5000+ XP', () => {
    expect(getRankForXP(9999).name).toBe('Earthy Sage');
  });

  it('stays at current rank just below threshold', () => {
    expect(getRankForXP(99).name).toBe('Sprout');
    expect(getRankForXP(499).name).toBe('Forager');
  });
});

describe('getNextRankThreshold', () => {
  it('returns Contender as next rank for Prospect', () => {
    const info = getNextRankThreshold(0);
    expect(info.nextRank?.name).toBe('Forager');
    expect(info.xpNeeded).toBe(100);
    expect(info.progress).toBe(0);
  });

  it('calculates progress correctly at midpoint', () => {
    const info = getNextRankThreshold(50);
    expect(info.progress).toBe(0.5);
  });

  it('returns null nextRank at max rank', () => {
    const info = getNextRankThreshold(5000);
    expect(info.nextRank).toBeNull();
    expect(info.progress).toBe(1);
  });
});

describe('awardXP', () => {
  it('awards XP for a workout', () => {
    const result = awardXP('workout_complete');
    expect(result.awarded).toBe(true);
    expect(result.xpGained).toBe(XP_VALUES.workout_complete);
    expect(result.newXP).toBe(XP_VALUES.workout_complete);
  });

  it('throttles same source to once per day', () => {
    awardXP('workout_complete');
    const second = awardXP('workout_complete');
    expect(second.awarded).toBe(false);
    expect(second.reason).toBe('Already earned today');
  });

  it('deduplicates article reads by ID', () => {
    awardXP('article_read', { articleId: 'test-article' });
    const second = awardXP('article_read', { articleId: 'test-article' });
    expect(second.awarded).toBe(false);
    expect(second.reason).toBe('Article already read');
  });

  it('allows different article IDs', () => {
    const first = awardXP('article_read', { articleId: 'article-1' });
    const second = awardXP('article_read', { articleId: 'article-2' });
    expect(first.awarded).toBe(true);
    expect(second.awarded).toBe(true);
  });

  it('increments workouts counter', () => {
    awardXP('workout_complete');
    const profile = getProfile();
    expect(profile.workoutsCompleted).toBe(1);
  });

  it('increments timer sessions counter', () => {
    awardXP('timer_session');
    const profile = getProfile();
    expect(profile.timerSessions).toBe(1);
  });

  it('detects rank change', () => {
    // Award enough XP to reach Contender (100 XP)
    // workout = 10, timer = 15, article = 5, dev = 100
    const result = awardXP('dev_award');
    expect(result.awarded).toBe(true);
    expect(result.rankChanged).toBe(true);
    expect(result.newRank.name).toBe('Forager');
    expect(result.oldRank.name).toBe('Sprout');
  });
});

describe('getProfile / resetProfile', () => {
  it('returns default profile when empty', () => {
    const profile = getProfile();
    expect(profile.displayName).toBe('Harvest Sprout');
    expect(profile.xp).toBe(0);
    expect(profile.workoutsCompleted).toBe(0);
  });

  it('resets profile to defaults', () => {
    awardXP('dev_award');
    resetProfile();
    const profile = getProfile();
    expect(profile.xp).toBe(0);
  });
});

describe('setDisplayName', () => {
  it('updates display name', () => {
    setDisplayName('Iron Mike');
    expect(getProfile().displayName).toBe('Iron Mike');
  });

  it('trims and caps at 30 chars', () => {
    setDisplayName('  A'.repeat(20) + '  ');
    expect(getProfile().displayName.length).toBeLessThanOrEqual(30);
  });

  it('falls back to Fighter for empty string', () => {
    setDisplayName('   ');
    expect(getProfile().displayName).toBe('Harvest Sprout');
  });
});

describe('detectFightingStyle', () => {
  it('returns Undetermined for no workouts', () => {
    expect(detectFightingStyle(getProfile())).toBe('Undetermined');
  });
});

describe('updateStreak', () => {
  it('updates longest streak', () => {
    updateStreak(5);
    expect(getProfile().longestStreak).toBe(5);
  });

  it('does not decrease longest streak', () => {
    updateStreak(10);
    updateStreak(3);
    expect(getProfile().longestStreak).toBe(10);
  });

  it('awards streak bonus at 7-day milestone', () => {
    const result = updateStreak(7);
    expect(result).not.toBeNull();
    expect(result?.awarded).toBe(true);
    expect(result?.xpGained).toBe(XP_VALUES.streak_bonus);
  });

  it('does not award streak bonus for non-milestone days', () => {
    const result = updateStreak(5);
    expect(result).toBeNull();
  });
});

describe('RANK_TIERS', () => {
  it('has 6 tiers in ascending XP order', () => {
    expect(RANK_TIERS).toHaveLength(6);
    for (let i = 1; i < RANK_TIERS.length; i++) {
      expect(RANK_TIERS[i].minXP).toBeGreaterThan(RANK_TIERS[i - 1].minXP);
    }
  });

  it('starts at 0 XP (Prospect)', () => {
    expect(RANK_TIERS[0].minXP).toBe(0);
    expect(RANK_TIERS[0].name).toBe('Sprout');
  });
});

describe('isLuckyHarvest', () => {
  it('is deterministic for the same day + source', () => {
    expect(isLuckyHarvest('workout_complete', '2026-05-20')).toBe(
      isLuckyHarvest('workout_complete', '2026-05-20'),
    );
  });

  it('never doubles meta-rewards', () => {
    for (const d of ['2026-05-01', '2026-05-20', '2026-06-15']) {
      expect(isLuckyHarvest('streak_bonus', d)).toBe(false);
      expect(isLuckyHarvest('dev_award', d)).toBe(false);
      expect(isLuckyHarvest('daily_login', d)).toBe(false);
      expect(isLuckyHarvest('challenge_complete', d)).toBe(false);
    }
  });

  it('doubles XP on a lucky day', () => {
    // 2026-05-20 is a known lucky day for workout_complete
    vi.setSystemTime(new Date(2026, 4, 20, 12, 0, 0));
    const result = awardXP('workout_complete');
    expect(result.luckyHarvest).toBe(true);
    expect(result.xpGained).toBe(XP_VALUES.workout_complete * 2);
  });
});

describe('challenge_complete awards', () => {
  it('awards the amount the challenge specifies', () => {
    const result = awardXP('challenge_complete', { xpAmount: 60 });
    expect(result.awarded).toBe(true);
    expect(result.xpGained).toBe(60);
  });

  it('falls back to the base value without an explicit amount', () => {
    const result = awardXP('challenge_complete');
    expect(result.xpGained).toBe(XP_VALUES.challenge_complete);
  });

  it('is not daily-throttled (weekly claim flag guards it)', () => {
    awardXP('challenge_complete', { xpAmount: 40 });
    const second = awardXP('challenge_complete', { xpAmount: 40 });
    expect(second.awarded).toBe(true);
  });
});
