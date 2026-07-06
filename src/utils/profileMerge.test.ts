import { describe, it, expect } from 'vitest';
import { createDefaultProfile } from './fighterProfile';
import {
  mergeProfiles,
  mergeDailyAwards,
  mergeWorkoutLogs,
  isCloudStreakFresh,
} from './profileMerge';
import { localDateString, daysBetween } from './localDate';

describe('mergeProfiles', () => {
  it('never loses XP: takes the max of both sides', () => {
    const local = { ...createDefaultProfile(), xp: 150 };
    const cloud = { ...createDefaultProfile(), xp: 100 };
    expect(mergeProfiles(local, cloud).xp).toBe(150);
    expect(mergeProfiles(cloud, local).xp).toBe(150);
  });

  it('unions dedupe lists so re-earning is impossible after a stale pull', () => {
    const local = { ...createDefaultProfile(), articlesRead: ['a', 'b'] };
    const cloud = { ...createDefaultProfile(), articlesRead: ['b', 'c'] };
    expect(mergeProfiles(local, cloud).articlesRead.sort()).toEqual(['a', 'b', 'c']);
  });

  it('keeps local daily-award throttles when cloud snapshot is stale', () => {
    const local = { ...createDefaultProfile(), dailyAwards: { workout_complete: '2026-07-03' } };
    const cloud = { ...createDefaultProfile(), dailyAwards: { workout_complete: '2026-07-01' } };
    expect(mergeProfiles(local, cloud).dailyAwards.workout_complete).toBe('2026-07-03');
  });

  it('prefers a customized cloud display name over the local default', () => {
    const local = { ...createDefaultProfile() };
    const cloud = { ...createDefaultProfile(), displayName: 'Iron Mike' };
    expect(mergeProfiles(local, cloud).displayName).toBe('Iron Mike');
  });

  it('keeps a customized local display name when cloud has the default', () => {
    const local = { ...createDefaultProfile(), displayName: 'Southpaw Sam' };
    const cloud = { ...createDefaultProfile() };
    expect(mergeProfiles(local, cloud).displayName).toBe('Southpaw Sam');
  });

  it('uses the earlier joinedAt', () => {
    const local = { ...createDefaultProfile(), joinedAt: '2026-06-01T00:00:00Z' };
    const cloud = { ...createDefaultProfile(), joinedAt: '2026-01-01T00:00:00Z' };
    expect(mergeProfiles(local, cloud).joinedAt).toBe('2026-01-01T00:00:00Z');
  });
});

describe('mergeDailyAwards', () => {
  it('keeps the most recent date per key from either side', () => {
    const merged = mergeDailyAwards(
      { workout_complete: '2026-07-01', streak_7: '2026-06-28' },
      { workout_complete: '2026-07-03', timer_session: '2026-07-02' },
    );
    expect(merged).toEqual({
      workout_complete: '2026-07-03',
      streak_7: '2026-06-28',
      timer_session: '2026-07-02',
    });
  });
});

describe('mergeWorkoutLogs', () => {
  const entry = (id: string, workoutId: string, completedAt: string) => ({
    id,
    workoutId,
    completedAt,
  });

  it('dedupes by id', () => {
    const a = entry('1', 'jab', '2026-07-01T10:00:00Z');
    expect(mergeWorkoutLogs([a], [a])).toHaveLength(1);
  });

  it('dedupes the same session stored under two different random ids', () => {
    const cloudCopy = entry('id-aaa', 'jab', '2026-07-01T10:00:00Z');
    const localCopy = entry('id-bbb', 'jab', '2026-07-01T10:00:00Z');
    expect(mergeWorkoutLogs([cloudCopy], [localCopy])).toHaveLength(1);
  });

  it('keeps genuinely distinct sessions of the same workout', () => {
    const morning = entry('1', 'jab', '2026-07-01T10:00:00Z');
    const evening = entry('2', 'jab', '2026-07-01T19:00:00Z');
    expect(mergeWorkoutLogs([morning], [evening])).toHaveLength(2);
  });

  it('sorts newest-first and caps entries', () => {
    const logs = Array.from({ length: 10 }, (_, i) =>
      entry(String(i), 'jab', `2026-07-${String(i + 1).padStart(2, '0')}T10:00:00Z`),
    );
    const merged = mergeWorkoutLogs(logs, [], 5);
    expect(merged).toHaveLength(5);
    expect(merged[0].id).toBe('9');
  });
});

describe('isCloudStreakFresh', () => {
  it('accepts today and yesterday, rejects older or missing visits', () => {
    const today = '2026-07-03';
    expect(isCloudStreakFresh('2026-07-03', today)).toBe(true);
    expect(isCloudStreakFresh('2026-07-02', today)).toBe(true);
    expect(isCloudStreakFresh('2026-07-01', today)).toBe(false);
    expect(isCloudStreakFresh(null, today)).toBe(false);
    expect(isCloudStreakFresh('garbage', today)).toBe(false);
  });
});

describe('localDate helpers', () => {
  it('formats local dates as YYYY-MM-DD', () => {
    expect(localDateString(new Date(2026, 0, 5))).toBe('2026-01-05');
  });

  it('computes signed day differences across month boundaries', () => {
    expect(daysBetween('2026-06-30', '2026-07-01')).toBe(1);
    expect(daysBetween('2026-07-01', '2026-06-30')).toBe(-1);
    expect(daysBetween('2026-07-01', '2026-07-01')).toBe(0);
    expect(daysBetween('2025-12-31', '2026-01-01')).toBe(1);
  });
});

describe('mergeProfiles gamification fields', () => {
  it('keeps streak freezes when the cloud does not store them', () => {
    const local = { ...createDefaultProfile(), streakFreezes: 2 };
    const cloud = { ...createDefaultProfile() }; // cloud schema drops the field
    expect(mergeProfiles(local, cloud).streakFreezes).toBe(2);
  });

  it('takes the max streak freezes from either side', () => {
    const local = { ...createDefaultProfile(), streakFreezes: 1 };
    const cloud = { ...createDefaultProfile(), streakFreezes: 3 };
    expect(mergeProfiles(local, cloud).streakFreezes).toBe(3);
  });

  it('merges daily activity counts per day with max', () => {
    const local = { ...createDefaultProfile(), dailyActivityCount: { '2026-07-04': 4 } };
    const cloud = { ...createDefaultProfile(), dailyActivityCount: { '2026-07-04': 2, '2026-07-03': 5 } };
    expect(mergeProfiles(local, cloud).dailyActivityCount).toEqual({
      '2026-07-04': 4,
      '2026-07-03': 5,
    });
  });

  it('carries through unknown local-only fields', () => {
    const local = { ...createDefaultProfile(), nightOwlUnlocked: true } as any;
    const cloud = { ...createDefaultProfile() };
    expect((mergeProfiles(local, cloud) as any).nightOwlUnlocked).toBe(true);
  });
});
