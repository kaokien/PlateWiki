// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getPersonalizedWorkout } from '@/utils/recommendations';

// Mock localStorage
const store: Record<string, string> = {};
beforeEach(() => {
  Object.keys(store).forEach(k => delete store[k]);
  vi.spyOn(Storage.prototype, 'getItem').mockImplementation(k => store[k] ?? null);
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation((k, v) => { store[k] = v; });
  vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(k => { delete store[k]; });
});

describe('getPersonalizedWorkout', () => {
  it('returns default jab workout for new users (Prospect)', () => {
    const workout = getPersonalizedWorkout();
    expect(workout.id).toBe('jab');
    expect(workout.title).toContain('Jab');
    expect(workout.reason).toContain('most important punch');
  });

  it('returns advanced workout for high rank users (e.g. 1000+ XP) with no history', () => {
    // Mock high XP fighter profile
    const highXPProfile = {
      displayName: 'Champ',
      xp: 1200,
      workoutsCompleted: 0,
      articlesRead: [],
      techniquesStudied: [],
      timerSessions: 0,
      programDaysCompleted: 0,
      longestStreak: 0,
      joinedAt: new Date().toISOString(),
      dailyAwards: {},
    };
    store['PlateWiki_fighter_profile'] = JSON.stringify(highXPProfile);

    const workout = getPersonalizedWorkout();
    expect(workout.id).toBe('mexican-combo');
    expect(workout.reason).toContain('elite rank');
  });

  it('recommends a balanced workout in a different category than the last logged workout', () => {
    // Mock profile
    const profile = {
      displayName: 'Contender',
      xp: 150,
      workoutsCompleted: 1,
      articlesRead: [],
      techniquesStudied: [],
      timerSessions: 0,
      programDaysCompleted: 0,
      longestStreak: 1,
      joinedAt: new Date().toISOString(),
      dailyAwards: {},
    };
    store['PlateWiki_fighter_profile'] = JSON.stringify(profile);

    // Mock last logged workout is 'jab' (Punches category)
    const log = [
      {
        workoutId: 'jab',
        workoutTitle: 'Jab Power & Speed',
        id: '123-abc',
        completedAt: new Date().toISOString(),
      }
    ];
    store['PlateWiki_workout_log'] = JSON.stringify(log);

    const workout = getPersonalizedWorkout();
    // Since last was Punches, it should recommend next category in list (Defense, Footwork, etc.)
    expect(workout.id).not.toBe('jab');
    expect(workout.reason).toContain('You completed a Punches drill last session');
  });
});
