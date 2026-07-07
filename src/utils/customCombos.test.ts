// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import {
  MOVE_LIBRARY, MAX_STEPS, MAX_CUSTOM_COMBOS,
  buildCustomCombo, getCustomCombos, saveCustomCombo, deleteCustomCombo, isCustomCombo,
} from './customCombos';

const jab = MOVE_LIBRARY[0];
const cross = MOVE_LIBRARY[1];

beforeEach(() => {
  localStorage.clear();
});

describe('buildCustomCombo', () => {
  it('builds a trackable combo with generated instructions', () => {
    const combo = buildCustomCombo('My Combo', [jab, cross, jab]);
    expect(combo.id.startsWith('custom-')).toBe(true);
    expect(combo.sequence).toHaveLength(3);
    expect(combo.difficulty).toBe('Beginner');
    expect(combo.instructions).toHaveLength(3);
    expect(isCustomCombo(combo)).toBe(true);
  });

  it('scales difficulty with length and defaults empty names', () => {
    expect(buildCustomCombo('  ', [jab, cross, jab, cross]).name).toBe('My Combo');
    expect(buildCustomCombo('x', [jab, cross, jab, cross]).difficulty).toBe('Intermediate');
    expect(buildCustomCombo('x', Array(6).fill(jab)).difficulty).toBe('Advanced');
  });
});

describe('storage round-trip', () => {
  it('saves, lists, and deletes combos', () => {
    const a = buildCustomCombo('A', [jab, cross]);
    const b = buildCustomCombo('B', [cross, jab, cross]);
    saveCustomCombo(a);
    expect(saveCustomCombo(b)).toHaveLength(2);
    expect(getCustomCombos().map(c => c.name)).toEqual(['A', 'B']);
    expect(deleteCustomCombo(a.id).map(c => c.name)).toEqual(['B']);
  });

  it('drops malformed or oversized entries on read', () => {
    localStorage.setItem('PlateWiki_custom_combos', JSON.stringify([
      { id: 'custom-ok', name: 'OK', sequence: [jab, cross] },
      { id: 'custom-bad-steps', name: 'Bad', sequence: [{ name: 'X' }] },
      { id: 'custom-too-long', name: 'Long', sequence: Array(MAX_STEPS + 1).fill(jab) },
      'garbage',
    ]));
    expect(getCustomCombos().map(c => c.id)).toEqual(['custom-ok']);
  });

  it('caps the number of stored combos', () => {
    for (let i = 0; i < MAX_CUSTOM_COMBOS + 5; i++) {
      saveCustomCombo(buildCustomCombo(`C${i}`, [jab, cross]));
    }
    expect(getCustomCombos().length).toBeLessThanOrEqual(MAX_CUSTOM_COMBOS);
  });
});
