import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock authState
vi.mock('./authState', () => ({
  isAuthenticated: vi.fn(() => true),
}));

// Mock localStorage before importing the module
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

// Import after mocking
import {
  getFavorites, isFavorite, toggleFavorite, removeFavorite,
  getRecentlyViewed, addRecentlyViewed,
  getTrainingPlan, addToTrainingPlan, removeFromTrainingPlan, clearTrainingPlan, isInTrainingPlan,
} from './favorites';

beforeEach(() => {
  localStorageMock.clear();
  vi.clearAllMocks();
});

// ─── Favorites ───────────────────────────────────────────────────────

describe('Favorites', () => {
  it('should return empty array when no favorites exist', () => {
    expect(getFavorites()).toEqual([]);
  });

  it('should add a technique to favorites via toggleFavorite', () => {
    const added = toggleFavorite('jab');
    expect(added).toBe(true);
    expect(isFavorite('jab')).toBe(true);
  });

  it('should remove a technique from favorites via toggleFavorite', () => {
    toggleFavorite('jab'); // add
    const removed = toggleFavorite('jab'); // remove
    expect(removed).toBe(false);
    expect(isFavorite('jab')).toBe(false);
  });

  it('should handle multiple favorites', () => {
    toggleFavorite('jab');
    toggleFavorite('cross');
    toggleFavorite('hook');
    expect(getFavorites()).toEqual(['jab', 'cross', 'hook']);
  });

  it('removeFavorite should remove a specific technique', () => {
    toggleFavorite('jab');
    toggleFavorite('cross');
    removeFavorite('jab');
    expect(isFavorite('jab')).toBe(false);
    expect(isFavorite('cross')).toBe(true);
  });

  it('removeFavorite should handle removing non-existent ID gracefully', () => {
    removeFavorite('non-existent');
    expect(getFavorites()).toEqual([]);
  });
});

// ─── Recently Viewed ─────────────────────────────────────────────────

describe('Recently Viewed', () => {
  it('should return empty array when nothing viewed', () => {
    expect(getRecentlyViewed()).toEqual([]);
  });

  it('should add a technique to recently viewed', () => {
    addRecentlyViewed('jab');
    expect(getRecentlyViewed()).toEqual(['jab']);
  });

  it('should keep most recently viewed at the front', () => {
    addRecentlyViewed('jab');
    addRecentlyViewed('cross');
    addRecentlyViewed('hook');
    expect(getRecentlyViewed()[0]).toBe('hook');
  });

  it('should not duplicate entries — re-viewing moves to front', () => {
    addRecentlyViewed('jab');
    addRecentlyViewed('cross');
    addRecentlyViewed('jab'); // re-view
    const recent = getRecentlyViewed();
    expect(recent[0]).toBe('jab');
    expect(recent.filter(id => id === 'jab').length).toBe(1);
  });

  it('should cap at 12 entries', () => {
    for (let i = 0; i < 20; i++) {
      addRecentlyViewed(`technique-${i}`);
    }
    expect(getRecentlyViewed().length).toBe(12);
  });

  it('oldest entries should be dropped when exceeding cap', () => {
    for (let i = 0; i < 15; i++) {
      addRecentlyViewed(`technique-${i}`);
    }
    const recent = getRecentlyViewed();
    // technique-0, technique-1, technique-2 should be gone
    expect(recent).not.toContain('technique-0');
    expect(recent).not.toContain('technique-1');
    expect(recent).not.toContain('technique-2');
    expect(recent).toContain('technique-14'); // most recent
  });
});

// ─── Training Plan ───────────────────────────────────────────────────

describe('Training Plan', () => {
  it('should return empty array when no plan exists', () => {
    expect(getTrainingPlan()).toEqual([]);
  });

  it('should add a technique to the training plan', () => {
    addToTrainingPlan('jab');
    expect(isInTrainingPlan('jab')).toBe(true);
  });

  it('should not add duplicates', () => {
    addToTrainingPlan('jab');
    addToTrainingPlan('jab');
    expect(getTrainingPlan().length).toBe(1);
  });

  it('should remove a technique from the plan', () => {
    addToTrainingPlan('jab');
    addToTrainingPlan('cross');
    removeFromTrainingPlan('jab');
    expect(isInTrainingPlan('jab')).toBe(false);
    expect(isInTrainingPlan('cross')).toBe(true);
  });

  it('clearTrainingPlan should empty the entire plan', () => {
    addToTrainingPlan('jab');
    addToTrainingPlan('cross');
    addToTrainingPlan('hook');
    clearTrainingPlan();
    expect(getTrainingPlan()).toEqual([]);
  });
});

// ─── localStorage Error Handling ─────────────────────────────────────

describe('localStorage Error Handling', () => {
  it('should return fallback when localStorage.getItem throws', () => {
    localStorageMock.getItem.mockImplementationOnce(() => { throw new Error('Storage disabled'); });
    expect(getFavorites()).toEqual([]);
  });

  it('should not throw when localStorage.setItem fails', () => {
    localStorageMock.setItem.mockImplementationOnce(() => { throw new Error('Quota exceeded'); });
    expect(() => toggleFavorite('jab')).not.toThrow();
  });
});
