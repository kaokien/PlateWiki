import { describe, it, expect } from 'vitest';

// Replicate the formatting logic from ShadowboxTracker
const formatDuration = (s: number) => {
  const mins = Math.floor(s / 60);
  const secs = s % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// Replicate the tech mapping logic from ShadowboxTracker
const mapTechId = (techId: string | undefined): string | undefined => {
  if (!techId) return undefined;
  return techId === 'lead-hook' ? 'hook' : techId === 'rear-uppercut' ? 'uppercut' : techId;
};

const PRACTICE_TECHNIQUES_IDS = ['jab', 'cross', 'hook', 'uppercut'];

describe('ShadowboxTracker — Duration Formatting', () => {
  it('should format seconds to MM:SS correctly', () => {
    expect(formatDuration(0)).toBe('00:00');
    expect(formatDuration(9)).toBe('00:09');
    expect(formatDuration(60)).toBe('01:00');
    expect(formatDuration(119)).toBe('01:59');
    expect(formatDuration(180)).toBe('03:00');
  });
});

describe('ShadowboxTracker — Technique Parameter Mapping', () => {
  it('should map lead-hook to hook', () => {
    expect(mapTechId('lead-hook')).toBe('hook');
  });

  it('should map rear-uppercut to uppercut', () => {
    expect(mapTechId('rear-uppercut')).toBe('uppercut');
  });

  it('should pass jab and cross straight through', () => {
    expect(mapTechId('jab')).toBe('jab');
    expect(mapTechId('cross')).toBe('cross');
  });

  it('should return undefined when no tech is provided', () => {
    expect(mapTechId(undefined)).toBeUndefined();
  });

  it('mapped values should match the IDs in PRACTICE_TECHNIQUES', () => {
    const testCases = ['jab', 'cross', 'lead-hook', 'rear-uppercut'];
    for (const testCase of testCases) {
      const mapped = mapTechId(testCase);
      expect(PRACTICE_TECHNIQUES_IDS.includes(mapped!)).toBe(true);
    }
  });

  it('should find index in PRACTICE_TECHNIQUES or default to 0', () => {
    const findIndex = (techId: string | undefined) => {
      const mapped = mapTechId(techId);
      if (!mapped) return 0;
      const idx = PRACTICE_TECHNIQUES_IDS.indexOf(mapped);
      return idx !== -1 ? idx : 0;
    };

    expect(findIndex('jab')).toBe(0);
    expect(findIndex('cross')).toBe(1);
    expect(findIndex('lead-hook')).toBe(2);
    expect(findIndex('rear-uppercut')).toBe(3);
    expect(findIndex('unknown')).toBe(0);
    expect(findIndex(undefined)).toBe(0);
  });
});
