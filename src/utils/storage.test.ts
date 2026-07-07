import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Mock authState
vi.mock('./authState', () => ({
  isAuthenticated: vi.fn(() => true),
}));

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key) => store[key] ?? null),
    setItem: vi.fn((key, value) => { store[key] = value; }),
    removeItem: vi.fn((key) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
  };
})();

vi.stubGlobal('localStorage', localStorageMock);


import {
  trackDailyVisit, getStreak,
  getProgramsProgress, getProgramProgress, startProgram, completeProgramDay, resetProgram,
  getWorkoutLog, logWorkout, getWorkoutStats,
} from './storage';
import { localDateString } from './localDate';

beforeEach(() => {
  localStorageMock.clear();
  vi.clearAllMocks();
});

// ─── Streak Tracking ─────────────────────────────────────────────────

describe('Streak Tracking', () => {
  it('should return 0 when no streak exists', () => {
    expect(getStreak()).toBe(0);
  });

  it('should start a streak of 1 on first visit', () => {
    const streak = trackDailyVisit();
    expect(streak).toBe(1);
  });

  it('should return same streak when visiting twice on the same day', () => {
    trackDailyVisit();
    const streak = trackDailyVisit();
    expect(streak).toBe(1);
  });

  it('should increment streak on consecutive days', () => {
    // Day 1
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    // seed with a LOCAL date string — streak dates are local-calendar based
    localStorageMock.setItem('PlateWiki_last_visit', localDateString(yesterday));
    localStorageMock.setItem('PlateWiki_streak', '3');

    const streak = trackDailyVisit();
    expect(streak).toBe(4);
  });

  it('should reset streak if more than 1 day gap', () => {
    // Set last visit to 3 days ago
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    localStorageMock.setItem('PlateWiki_last_visit', localDateString(threeDaysAgo));
    localStorageMock.setItem('PlateWiki_streak', '10');

    const streak = trackDailyVisit();
    expect(streak).toBe(1);
  });

  it('should return 0 when localStorage throws', () => {
    localStorageMock.getItem.mockImplementationOnce(() => { throw new Error('fail'); });
    expect(trackDailyVisit()).toBe(0);
  });
});

// ─── Program Progress ────────────────────────────────────────────────

describe('Program Progress', () => {
  it('should return empty object when no programs exist', () => {
    expect(getProgramsProgress()).toEqual({});
  });

  it('should return null for non-existent program', () => {
    expect(getProgramProgress('non-existent')).toBeNull();
  });

  it('should start a new program correctly', () => {
    const progress = startProgram('athletic nutrition-101');
    expect(progress).toBeDefined();
    expect(progress!.currentDay).toBe(1);
    expect(progress!.completedDays).toEqual([]);
    expect(progress!.startDate).toBeTruthy();
  });

  it('should track a completed day', () => {
    startProgram('athletic nutrition-101');
    const progress = completeProgramDay('athletic nutrition-101', 1);
    expect(progress!.completedDays).toContain(1);
  });

  it('should auto-advance currentDay when completing the current day', () => {
    startProgram('athletic nutrition-101');
    const progress = completeProgramDay('athletic nutrition-101', 1);
    expect(progress!.currentDay).toBe(2);
  });

  it('should not duplicate completed days', () => {
    startProgram('athletic nutrition-101');
    completeProgramDay('athletic nutrition-101', 1);
    completeProgramDay('athletic nutrition-101', 1);
    const progress = getProgramProgress('athletic nutrition-101');
    expect(progress.completedDays.filter(d => d === 1).length).toBe(1);
  });

  it('should auto-start a program if completing a day without starting', () => {
    const progress = completeProgramDay('unstarted-program', 3);
    expect(progress).toBeDefined();
    expect(progress!.currentDay).toBe(4);
    expect(progress!.completedDays).toContain(3);
  });

  it('should reset a program', () => {
    startProgram('athletic nutrition-101');
    completeProgramDay('athletic nutrition-101', 1);
    resetProgram('athletic nutrition-101');
    expect(getProgramProgress('athletic nutrition-101')).toBeNull();
  });

  it('should handle multiple programs independently', () => {
    startProgram('athletic nutrition-101');
    startProgram('advanced-footwork');
    completeProgramDay('athletic nutrition-101', 1);

    const prog1 = getProgramProgress('athletic nutrition-101');
    const prog2 = getProgramProgress('advanced-footwork');

    expect(prog1.completedDays).toContain(1);
    expect(prog2.completedDays).toEqual([]);
  });
});

// ─── Workout Logging ─────────────────────────────────────────────────

describe('Workout Logging', () => {
  it('should return empty array when no workouts logged', () => {
    expect(getWorkoutLog()).toEqual([]);
  });

  it('should log a workout and return it', () => {
    const entry = logWorkout({
      workoutId: 'w1',
      workoutTitle: 'Jab Drill',
      techniqueId: 'jab',
      techniqueName: 'Jab',
      exercisesCompleted: 3,
      totalSets: 9,
      duration: 1200,
    });

    expect(entry).toBeDefined();
    expect(entry!.id).toBeTruthy();
    expect(entry!.completedAt).toBeTruthy();
    expect(entry!.workoutTitle).toBe('Jab Drill');
  });

  it('should put newest workout first', () => {
    logWorkout({ workoutTitle: 'First', totalSets: 3 });
    logWorkout({ workoutTitle: 'Second', totalSets: 5 });

    const log = getWorkoutLog();
    expect(log[0].workoutTitle).toBe('Second');
  });

  it('should cap at 200 entries', () => {
    for (let i = 0; i < 210; i++) {
      logWorkout({ workoutTitle: `Workout ${i}`, totalSets: 1 });
    }
    expect(getWorkoutLog().length).toBe(200);
  });

  it('should return null when localStorage write fails', () => {
    localStorageMock.setItem.mockImplementationOnce(() => { throw new Error('Quota exceeded'); });
    const result = logWorkout({ workoutTitle: 'Fail Test', totalSets: 1 });
    expect(result).toBeNull();
  });
});

// ─── Workout Stats ───────────────────────────────────────────────────

describe('getWorkoutStats', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-05-20T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return zeroed stats when no workouts exist', () => {
    const stats = getWorkoutStats();
    expect(stats.totalWorkouts).toBe(0);
    expect(stats.totalSets).toBe(0);
    expect(stats.thisWeek).toBe(0);
    expect(stats.streak).toBe(0);
    expect(stats.lastWorkout).toBeNull();
  });

  it('should correctly count total workouts and sets', () => {
    logWorkout({ totalSets: 5 });
    logWorkout({ totalSets: 3 });
    logWorkout({ totalSets: 7 });

    const stats = getWorkoutStats();
    expect(stats.totalWorkouts).toBe(3);
    expect(stats.totalSets).toBe(15);
  });

  it('should count workouts this week', () => {
    logWorkout({ totalSets: 5, completedAt: '2026-05-20T10:00:00Z' });
    logWorkout({ totalSets: 2, completedAt: '2026-05-15T10:00:00Z' }); // Last week

    const stats = getWorkoutStats();
    expect(stats.thisWeek).toBe(1);
    expect(stats.totalWorkouts).toBe(2);
  });

  it('lastWorkout should be the most recent entry', () => {
    logWorkout({ workoutTitle: 'Old Workout', totalSets: 3, completedAt: '2026-05-19T10:00:00Z' });
    logWorkout({ workoutTitle: 'Latest Workout', totalSets: 5, completedAt: '2026-05-20T10:00:00Z' });

    const stats = getWorkoutStats();
    expect(stats.lastWorkout!.workoutTitle).toBe('Latest Workout');
  });

  it('should calculate consecutive streak starting today', () => {
    logWorkout({ completedAt: '2026-05-20T10:00:00Z' }); // Today
    logWorkout({ completedAt: '2026-05-19T10:00:00Z' }); // Yesterday
    logWorkout({ completedAt: '2026-05-18T10:00:00Z' }); // 2 days ago

    const stats = getWorkoutStats();
    expect(stats.streak).toBe(3);
  });

  it('should calculate consecutive streak starting yesterday (today not logged yet)', () => {
    logWorkout({ completedAt: '2026-05-19T10:00:00Z' }); // Yesterday
    logWorkout({ completedAt: '2026-05-18T10:00:00Z' }); // 2 days ago
    logWorkout({ completedAt: '2026-05-17T10:00:00Z' }); // 3 days ago

    const stats = getWorkoutStats();
    expect(stats.streak).toBe(3);
  });

  it('should break streak if a day is skipped in between', () => {
    logWorkout({ completedAt: '2026-05-20T10:00:00Z' }); // Today
    logWorkout({ completedAt: '2026-05-18T10:00:00Z' }); // Skipped yesterday!

    const stats = getWorkoutStats();
    expect(stats.streak).toBe(1); // Only today counts
  });

  it('should return 0 streak if neither today nor yesterday is logged', () => {
    logWorkout({ completedAt: '2026-05-18T10:00:00Z' }); // 2 days ago
    logWorkout({ completedAt: '2026-05-17T10:00:00Z' }); // 3 days ago

    const stats = getWorkoutStats();
    expect(stats.streak).toBe(0);
  });
});

// ─── Extra Code Coverage (Catch Blocks & Edge Cases) ──────────────────

describe('Storage Edge Cases & Failures', () => {
  it('should return 0 when getStreak localStorage fails', () => {
    localStorageMock.getItem.mockImplementationOnce(() => { throw new Error('fail'); });
    expect(getStreak()).toBe(0);
  });

  it('should return empty object when getProgramsProgress localStorage fails', () => {
    localStorageMock.getItem.mockImplementationOnce(() => { throw new Error('fail'); });
    expect(getProgramsProgress()).toEqual({});
  });

  it('should return null when startProgram localStorage fails', () => {
    localStorageMock.setItem.mockImplementationOnce(() => { throw new Error('fail'); });
    expect(startProgram('some-program')).toBeNull();
  });

  it('should return null when completeProgramDay localStorage fails', () => {
    localStorageMock.setItem.mockImplementationOnce(() => { throw new Error('fail'); });
    expect(completeProgramDay('some-program', 1)).toBeNull();
  });

  it('should not add completed day if already completed', () => {
    startProgram('prog');
    completeProgramDay('prog', 2);
    const progress = completeProgramDay('prog', 2);
    expect(progress!.completedDays).toEqual([2]);
  });

  it('should not advance currentDay if day number does not match currentDay', () => {
    startProgram('prog'); // currentDay is 1
    const progress = completeProgramDay('prog', 2); // completes day 2, currentDay stays 1
    expect(progress!.currentDay).toBe(1);
    expect(progress!.completedDays).toEqual([2]);
  });

  it('should log error and not throw when resetProgram localStorage fails', () => {
    localStorageMock.setItem.mockImplementationOnce(() => { throw new Error('fail'); });
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    resetProgram('prog');
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('should return empty array when getWorkoutLog localStorage fails', () => {
    localStorageMock.getItem.mockImplementationOnce(() => { throw new Error('fail'); });
    expect(getWorkoutLog()).toEqual([]);
  });
});

