import { describe, it, expect, beforeEach, vi } from 'vitest';

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
  getSavedWorkouts,
  getSavedWorkoutById,
  saveWorkout,
  deleteSavedWorkout,
  canSaveMoreWorkouts,
  SavedWorkout,
  FREE_WORKOUTS_LIMIT
} from './savedWorkouts';

const dummyWorkout: SavedWorkout = {
  id: 'workout-123',
  title: 'Power Punching Routine',
  duration: '35 mins',
  goal: 'power',
  level: 'intermediate',
  equipment: 'heavy-bag',
  warmup: ['Jump rope 5 mins', 'Shadowboxing 5 mins'],
  drills: [
    {
      name: 'Heavy Bag Power Combos',
      techniqueId: 'cross',
      category: 'punching',
      sets: '4 rounds',
      description: 'Focus on rotational hip power.'
    }
  ],
  gymExercises: [],
  cooldown: ['Stretching 5 mins'],
  savedAt: '2026-05-20T20:00:00.000Z'
};

beforeEach(() => {
  localStorageMock.clear();
  vi.clearAllMocks();
});

describe('Saved Workouts Storage Utility', () => {
  it('should return empty list when no workouts are saved', () => {
    expect(getSavedWorkouts()).toEqual([]);
  });

  it('should save a workout successfully', () => {
    const res = saveWorkout(dummyWorkout);
    expect(res.success).toBe(true);
    expect(res.workout).toBeDefined();
    expect(res.workout?.id).toContain('workout_');

    const saved = getSavedWorkouts();
    expect(saved).toHaveLength(1);
    expect(saved[0].title).toBe('Power Punching Routine');
  });

  it('should find a saved workout by id', () => {
    const res = saveWorkout(dummyWorkout);
    const id = res.workout!.id;
    
    const found = getSavedWorkoutById(id);
    expect(found).not.toBeNull();
    expect(found?.title).toBe('Power Punching Routine');

    const notFound = getSavedWorkoutById('non-existent');
    expect(notFound).toBeNull();
  });

  it('should delete a saved workout successfully', () => {
    const res = saveWorkout(dummyWorkout);
    expect(getSavedWorkouts()).toHaveLength(1);

    deleteSavedWorkout(res.workout!.id);
    expect(getSavedWorkouts()).toHaveLength(0);
  });

  it('should manage workout counts and checks against limits', () => {
    // Free limit check
    expect(canSaveMoreWorkouts(false)).toBe(true); // 0 saved

    for (let i = 0; i < FREE_WORKOUTS_LIMIT; i++) {
      saveWorkout(dummyWorkout, false);
    }

    // Now at limit
    expect(getSavedWorkouts()).toHaveLength(FREE_WORKOUTS_LIMIT);
    expect(canSaveMoreWorkouts(false)).toBe(false); // Free tier at limit
    expect(canSaveMoreWorkouts(true)).toBe(true);  // Pro tier is unlimited

    // Try saving one more on free tier
    const saveExceeded = saveWorkout(dummyWorkout, false);
    expect(saveExceeded.success).toBe(false); // Should prevent saving
    expect(saveExceeded.error).toBe('limit');
  });

  it('should handle storage write exceptions gracefully', () => {
    localStorageMock.setItem.mockImplementationOnce(() => {
      throw new Error('Quota exceeded');
    });
    const res = saveWorkout(dummyWorkout);
    expect(res.success).toBe(false);
    expect(res.error).toBe('unknown');
  });
});
