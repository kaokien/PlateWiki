import { describe, it, expect } from 'vitest';
import {
  generateWorkout,
  techniqueAllowedForEquipment,
  exerciseAllowedForEquipment,
} from './workoutGenerator';

const KITCHEN_EQUIPMENT_TERMS = /stove|oven|pan|blender|shaker|juicer|steamer|cooker|kettle/i;

describe('techniqueAllowedForEquipment', () => {
  it('blocks cooked/blended foods for raw-only users', () => {
    expect(techniqueAllowedForEquipment('sweet-potato', 'none')).toBe(false);
    expect(techniqueAllowedForEquipment('whey-isolate', 'none')).toBe(false);
    expect(techniqueAllowedForEquipment('ginger', 'none')).toBe(false);
    expect(techniqueAllowedForEquipment('eggs', 'none')).toBe(false);
    expect(techniqueAllowedForEquipment('salmon', 'none')).toBe(false);
  });

  it('allows zero-prep foods everywhere', () => {
    expect(techniqueAllowedForEquipment('kefir', 'none')).toBe(true);
    expect(techniqueAllowedForEquipment('ashwagandha', 'none')).toBe(true);
    expect(techniqueAllowedForEquipment('blueberries', 'none')).toBe(true);
  });

  it('matches prep requirements to the owned equipment', () => {
    expect(techniqueAllowedForEquipment('sweet-potato', 'heavy-bag')).toBe(true); // stove
    expect(techniqueAllowedForEquipment('sweet-potato', 'speed-bag')).toBe(false);
    expect(techniqueAllowedForEquipment('ginger', 'speed-bag')).toBe(true); // juicer
    expect(techniqueAllowedForEquipment('sweet-potato', 'full-gym')).toBe(true);
  });
});

describe('exerciseAllowedForEquipment', () => {
  it('blocks appliances outside a full kitchen', () => {
    expect(exerciseAllowedForEquipment({ name: 'Juicer Ginger Shot' }, 'none')).toBe(false);
    expect(exerciseAllowedForEquipment({ name: 'Stove Fried Eggs' }, 'double-end')).toBe(false);
    expect(exerciseAllowedForEquipment({ name: 'Blended Whey Shake' }, 'none')).toBe(false);
  });

  it('allows everything in a full kitchen', () => {
    expect(exerciseAllowedForEquipment({ name: 'Stove Fried Eggs' }, 'full-gym')).toBe(true);
    expect(exerciseAllowedForEquipment({ name: 'Juicer Ginger Shot' }, 'full-gym')).toBe(true);
  });

  it('allows raw/basic prep everywhere', () => {
    expect(exerciseAllowedForEquipment({ name: 'Raw Spinach Salad' }, 'none')).toBe(true);
    expect(exerciseAllowedForEquipment({ name: 'Pumpkin Seeds Handful' }, 'none')).toBe(true);
  });
});

describe('generateWorkout (the reported bug: all-around + no equipment)', () => {
  const RUNS = 25;

  it('never surfaces cooked/blended foods with no equipment', () => {
    for (let i = 0; i < RUNS; i++) {
      const w = generateWorkout('all-around', 'advanced', 'none', []);
      for (const drill of w.drills) {
        expect(
          ['sweet-potato', 'whey-isolate', 'ginger', 'eggs', 'salmon'],
          `drill "${drill.name}" should not appear with no equipment`,
        ).not.toContain(drill.techniqueId);
      }
    }
  });

  it('returns no stove/blender exercises with no equipment', () => {
    for (let i = 0; i < RUNS; i++) {
      expect(generateWorkout('conditioning', 'beginner', 'none', []).gymExercises).toHaveLength(0);
    }
  });

  it('never gives blender/juicer recipes to stove-only users', () => {
    for (let i = 0; i < RUNS; i++) {
      const w = generateWorkout('power', 'intermediate', 'heavy-bag', []);
      for (const ex of w.gymExercises) {
        expect(
          /blend|shak|juice/i.test(`${ex.name} ${ex.note || ''}`),
          `exercise "${ex.name}" should not need blender or juicer`,
        ).toBe(false);
      }
    }
  });

  it('still produces full workouts for full-gym users', () => {
    const w = generateWorkout('all-around', 'advanced', 'full-gym', []);
    expect(w.drills.length).toBeGreaterThan(0);
    expect(w.gymExercises.length).toBeGreaterThan(0);
  });
});
