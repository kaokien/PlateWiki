import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { isNighttime, markWokenUp, WOKEN_UP_KEY, MANUAL_SLEEP_KEY } from './tamagotchiState';

describe('tamagotchiState - isNighttime', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns false during the night after a manual wake', () => {
    // 11 PM — normally nighttime
    vi.setSystemTime(new Date(2026, 6, 7, 23, 0, 0));
    expect(isNighttime()).toBe(true);

    markWokenUp();
    expect(isNighttime()).toBe(false);
  });

  it('wake override expires at the next 6 AM so natural sleep resumes', () => {
    // Wake at 11 PM
    vi.setSystemTime(new Date(2026, 6, 7, 23, 0, 0));
    markWokenUp();
    expect(isNighttime()).toBe(false);

    // Still awake at 2 AM the same night
    vi.setSystemTime(new Date(2026, 6, 8, 2, 0, 0));
    expect(isNighttime()).toBe(false);

    // The NEXT night the avatar must sleep again
    vi.setSystemTime(new Date(2026, 6, 8, 23, 0, 0));
    expect(isNighttime()).toBe(true);
    // Expired override is cleaned out of storage
    expect(localStorage.getItem(WOKEN_UP_KEY)).toBeNull();
  });

  it('treats a legacy boolean woken_up flag as expired', () => {
    vi.setSystemTime(new Date(2026, 6, 7, 23, 0, 0));
    localStorage.setItem(WOKEN_UP_KEY, 'true');

    expect(isNighttime()).toBe(true);
    expect(localStorage.getItem(WOKEN_UP_KEY)).toBeNull();
  });

  it('returns true if manual sleep is on and not woken up', () => {
    // Noon — normally daytime
    vi.setSystemTime(new Date(2026, 6, 7, 12, 0, 0));
    expect(isNighttime()).toBe(false);

    localStorage.setItem(MANUAL_SLEEP_KEY, 'true');
    expect(isNighttime()).toBe(true);
  });

  it('manual wake clears manual sleep', () => {
    vi.setSystemTime(new Date(2026, 6, 7, 12, 0, 0));
    localStorage.setItem(MANUAL_SLEEP_KEY, 'true');
    expect(isNighttime()).toBe(true);

    markWokenUp();
    expect(isNighttime()).toBe(false);
    expect(localStorage.getItem(MANUAL_SLEEP_KEY)).toBeNull();
  });
});
