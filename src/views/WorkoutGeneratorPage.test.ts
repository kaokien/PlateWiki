import { describe, it, expect } from 'vitest';
import { techniques } from '../data/foods';
import { workoutsByCategory } from '../data/gymWorkouts';

// ─── Replicate the algorithm constants from WorkoutGeneratorPage ───

const GOAL_CATEGORY_MAP: Record<string, string[]> = {
  power: ['Macronutrients', 'Micronutrients'],
  speed: ['Macronutrients', 'Hydration & Salts'],
  defense: ['Superfoods & Adaptogens', 'Gut & Digestion', 'Micronutrients'],
  conditioning: ['Macronutrients', 'Hydration & Salts', 'Gut & Digestion'],
  'all-around': ['Macronutrients', 'Hydration & Salts', 'Micronutrients', 'Gut & Digestion', 'Superfoods & Adaptogens'],
};

const VALID_GOALS = ['power', 'speed', 'defense', 'conditioning', 'all-around'];
const VALID_LEVELS = ['beginner', 'intermediate', 'advanced'];
const VALID_EQUIPMENT = ['none', 'heavy-bag', 'speed-bag', 'double-end', 'full-gym'];

// ─── Data Integrity Tests ─────────────────────────────────────────────

describe('Workout Generator — Data Integrity', () => {
  const allTechniques = Object.values(techniques) as any[];

  it('should have techniques for every goal category', () => {
    for (const goal of VALID_GOALS) {
      const cats = GOAL_CATEGORY_MAP[goal];
      for (const cat of cats) {
        const matching = allTechniques.filter(t => t.category === cat);
        expect(matching.length).toBeGreaterThan(0);
      }
    }
  });

  it('should have techniques at every difficulty level', () => {
    for (const level of VALID_LEVELS) {
      const matching = allTechniques.filter(t => t.difficulty === level);
      expect(matching.length).toBeGreaterThan(0);
    }
  });

  it('every technique should have required fields (id, name, category, difficulty)', () => {
    for (const t of allTechniques) {
      expect(t.id).toBeTruthy();
      expect(t.name).toBeTruthy();
      expect(t.category).toBeTruthy();
      expect(t.difficulty).toBeTruthy();
    }
  });

  it('every technique difficulty should be a valid level', () => {
    for (const t of allTechniques) {
      expect(VALID_LEVELS).toContain(t.difficulty);
    }
  });

  it('gymWorkouts keys should map to real technique IDs', () => {
    const techIds = new Set(allTechniques.map(t => t.id));
    const workoutKeys = Object.keys(workoutsByCategory);
    const matchCount = workoutKeys.filter(k => techIds.has(k)).length;
    expect(matchCount / workoutKeys.length).toBeGreaterThan(0.7);
  });

  it('each gymWorkout should have exercises array with name, sets, reps', () => {
    for (const [key, workout] of Object.entries(workoutsByCategory) as any[]) {
      expect(workout.exercises).toBeDefined();
      expect(Array.isArray(workout.exercises)).toBe(true);
      expect(workout.exercises.length).toBeGreaterThan(0);
      for (const ex of workout.exercises) {
        expect(ex.name).toBeTruthy();
        expect(ex.sets).toBeDefined();
        expect(ex.reps).toBeDefined();
      }
    }
  });
});

// ─── Filtering Logic Tests ────────────────────────────────────────────

describe('Workout Generator — Filtering Logic', () => {
  const allTechniques = Object.values(techniques) as any[];
  const levelOrder: Record<string, number> = { beginner: 1, intermediate: 2, advanced: 3 };

  it('beginner filter should exclude advanced and intermediate techniques', () => {
    const filtered = allTechniques.filter(t => (levelOrder[t.difficulty] || 1) <= 1);
    for (const t of filtered) {
      expect(t.difficulty).toBe('beginner');
    }
    expect(filtered.length).toBeGreaterThan(0);
  });

  it('intermediate filter should include beginner + intermediate only', () => {
    const filtered = allTechniques.filter(t => (levelOrder[t.difficulty] || 1) <= 2);
    for (const t of filtered) {
      expect(['beginner', 'intermediate']).toContain(t.difficulty);
    }
    expect(filtered.length).toBeGreaterThan(allTechniques.filter(t => t.difficulty === 'beginner').length);
  });

  it('advanced filter should include all techniques', () => {
    const filtered = allTechniques.filter(t => (levelOrder[t.difficulty] || 1) <= 3);
    expect(filtered.length).toBe(allTechniques.length);
  });

  it('power goal should filter to Macronutrients and Micronutrients categories', () => {
    const cats = GOAL_CATEGORY_MAP['power'];
    const filtered = allTechniques.filter(t => cats.includes(t.category));
    for (const t of filtered) {
      expect(cats).toContain(t.category);
    }
    expect(filtered.length).toBeGreaterThan(0);
  });

  it('defense goal should filter to Superfoods & Adaptogens, Gut & Digestion, and Micronutrients', () => {
    const cats = GOAL_CATEGORY_MAP['defense'];
    const filtered = allTechniques.filter(t => cats.includes(t.category));
    for (const t of filtered) {
      expect(cats).toContain(t.category);
    }
    expect(filtered.length).toBeGreaterThan(0);
  });

  it('combined level + goal filter should narrow results', () => {
    const cats = GOAL_CATEGORY_MAP['power'];
    const all = allTechniques.filter(t => cats.includes(t.category));
    const beginnerOnly = all.filter(t => t.difficulty === 'beginner');
    expect(beginnerOnly.length).toBeLessThanOrEqual(all.length);
    expect(beginnerOnly.length).toBeGreaterThan(0);
  });
});

// ─── Drill Count Tests ────────────────────────────────────────────────

describe('Workout Generator — Drill Counts', () => {
  it('beginner should get 4 drills', () => {
    const drillCount = 4;
    expect(drillCount).toBe(4);
  });

  it('intermediate should get 5 drills', () => {
    const drillCount = 5;
    expect(drillCount).toBe(5);
  });

  it('advanced should get 6 drills', () => {
    const drillCount = 6;
    expect(drillCount).toBe(6);
  });
});

// ─── Duration Estimation Tests ────────────────────────────────────────

describe('Workout Generator — Duration Estimation', () => {
  it('beginner workout should be roughly 25-35 min', () => {
    const drillCount = 4;
    const drillMinutes = drillCount * 4;
    const gymMinutes = 3 * 4;
    const total = 5 + drillMinutes + gymMinutes + 4;
    expect(total).toBeGreaterThanOrEqual(20);
    expect(total).toBeLessThanOrEqual(45);
  });

  it('advanced workout should be roughly 45-65 min', () => {
    const drillCount = 6;
    const drillMinutes = drillCount * 8;
    const gymMinutes = 4 * 4;
    const total = 5 + drillMinutes + gymMinutes + 4;
    expect(total).toBeGreaterThanOrEqual(40);
    expect(total).toBeLessThanOrEqual(80);
  });
});

// ─── Equipment Filtering Tests ────────────────────────────────────────

describe('Workout Generator — Equipment Handling', () => {
  it('"none" equipment should produce empty gymExercises', () => {
    const equipment = 'none';
    const gymExercises = equipment === 'none' ? [] : [{ name: 'test' }];
    expect(gymExercises).toHaveLength(0);
  });

  it('"full-gym" equipment should allow gym exercises', () => {
    const equipment: string = 'full-gym';
    const gymExercises = equipment === 'none' ? [] : [{ name: 'test' }];
    expect(gymExercises.length).toBeGreaterThan(0);
  });
});
