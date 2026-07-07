import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { isNighttime } from './tamagotchiState';

describe('tamagotchiState - isNighttime', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return false if PlateWiki_woken_up is set to true', () => {
    // Set time to nighttime (e.g. 11 PM / 23:00)
    const date = new Date(2026, 6, 7, 23, 0, 0);
    vi.setSystemTime(date);

    // Verify it is normally nighttime
    expect(isNighttime()).toBe(true);

    // Set woken_up to true
    localStorage.setItem('PlateWiki_woken_up', 'true');

    // Should now return false because of the override
    expect(isNighttime()).toBe(false);
  });

  it('should return true if PlateWiki_manual_sleep is true and not woken up', () => {
    // Set time to daytime (e.g. 12:00 PM)
    const date = new Date(2026, 6, 7, 12, 0, 0);
    vi.setSystemTime(date);

    // Verify it is normally daytime
    expect(isNighttime()).toBe(false);

    // Set manual sleep to true
    localStorage.setItem('PlateWiki_manual_sleep', 'true');

    expect(isNighttime()).toBe(true);
  });
});
