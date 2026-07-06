import { describe, it, expect, beforeEach, vi } from 'vitest';

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key) => store[key] ?? null),
    setItem: vi.fn((key, value) => { store[key] = value; }),
    removeItem: vi.fn((key) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
    get _store() { return store; },
  };
})();

vi.stubGlobal('localStorage', localStorageMock);

import { getTrainingStats, saveTrainingStats, trackPunchRep, trackBlitzSession, trackTimeActive } from './analytics';

describe('Training Stats Analytics', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it('should return default stats when localStorage is empty', () => {
    const stats = getTrainingStats();
    expect(stats.totalPunches).toBe(0);
    expect(stats.totalSessions).toBe(0);
    expect(stats.highScore).toBe(0);
    expect(stats.streak).toBe(0);
  });

  it('should save and parse stats correctly', () => {
    const mockStats = {
      totalSessions: 5,
      totalPunches: 150,
      highScore: 1200,
      streak: 3,
      lastActiveDate: '2026-05-19',
      totalTime: 600,
      blitzHits: 100,
      blitzMisses: 50,
      weeklyLog: { '2026-05-19': 150 }
    };
    saveTrainingStats(mockStats);
    const parsed = getTrainingStats();
    expect(parsed.totalSessions).toBe(5);
    expect(parsed.totalPunches).toBe(150);
    expect(parsed.highScore).toBe(1200);
    expect(parsed.streak).toBe(3);
    expect(parsed.totalTime).toBe(600);
  });

  it('should increment total punches on punch tracking', () => {
    trackPunchRep(5);
    const parsed = getTrainingStats();
    expect(parsed.totalPunches).toBe(5);
    const today = new Date().toISOString().split('T')[0];
    expect(parsed.weeklyLog[today]).toBe(5);
  });

  it('should register score and streaks on blitz session tracker', () => {
    trackBlitzSession(500, 30, 5);
    const parsed = getTrainingStats();
    expect(parsed.totalSessions).toBe(1);
    expect(parsed.totalPunches).toBe(30);
    expect(parsed.highScore).toBe(500);
    expect(parsed.streak).toBe(1);
  });

  it('should accumulate training active times', () => {
    trackTimeActive(30);
    trackTimeActive(45);
    const parsed = getTrainingStats();
    expect(parsed.totalTime).toBe(75);
  });
});
