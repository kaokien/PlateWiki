/**
 * Custom Combo Creator — user-designed combos for the Shadowbox Tracker.
 *
 * Combos are stored locally (safeStorage) and merged after the built-in
 * TRAINING_COMBOS in the tracker. Steps are picked from MOVE_LIBRARY, whose
 * zone mappings reuse the exact name/zone pairs the motion tracker already
 * detects (3×2 motion grid, per-stance zone indexes) — so anything a user
 * builds is guaranteed trackable.
 */
import type { Combo, ComboStep } from '@/data/combos';
import { safeStorage } from './safeStorage';

const STORAGE_KEY = 'FoodWiki_custom_combos';

export const MAX_CUSTOM_COMBOS = 20;
export const MAX_STEPS = 8;
export const MIN_STEPS = 2;
export const MAX_NAME_LENGTH = 40;

/** Moves the tracker can detect, with their per-stance motion zones. */
export const MOVE_LIBRARY: ComboStep[] = [
  { name: 'Jab', zones: { orthodox: 2, southpaw: 0 }, cue: 'Jab!' },
  { name: 'Cross', zones: { orthodox: 0, southpaw: 2 }, cue: 'Cross!' },
  { name: 'Lead Hook', zones: { orthodox: 2, southpaw: 0 }, cue: 'Hook!' },
  { name: 'Rear Hook', zones: { orthodox: 0, southpaw: 2 }, cue: 'Rear hook!' },
  { name: 'Lead Uppercut', zones: { orthodox: 5, southpaw: 3 }, cue: 'Uppercut!' },
  { name: 'Rear Uppercut', zones: { orthodox: 3, southpaw: 5 }, cue: 'Uppercut!' },
  { name: 'Slip Lead', zones: { orthodox: 3, southpaw: 5 }, cue: 'Slip!' },
  { name: 'Slip Rear', zones: { orthodox: 5, southpaw: 3 }, cue: 'Slip!' },
];

function difficultyFor(steps: number): Combo['difficulty'] {
  if (steps <= 3) return 'Beginner';
  if (steps <= 5) return 'Intermediate';
  return 'Advanced';
}

/** Build a full Combo object from a name + sequence of library moves. */
export function buildCustomCombo(name: string, sequence: ComboStep[]): Combo {
  const cleanName = name.trim().slice(0, MAX_NAME_LENGTH) || 'My Combo';
  return {
    id: `custom-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    name: cleanName,
    type: sequence.map((s) => s.name).join(', '),
    difficulty: difficultyFor(sequence.length),
    instructions: sequence.map((s, i) => `Step ${i + 1}: throw a clean ${s.name}.`),
    tips: [
      'Coaching Tip: Start slow — accuracy first, then build speed between steps.',
      'Custom combo: reset happens automatically if you pause more than 2 seconds mid-sequence.',
    ],
    sequence,
  };
}

export function isCustomCombo(combo: Combo): boolean {
  return combo.id.startsWith('custom-');
}

function isValidStep(step: unknown): step is ComboStep {
  if (!step || typeof step !== 'object') return false;
  const s = step as ComboStep;
  return (
    typeof s.name === 'string' &&
    typeof s.cue === 'string' &&
    !!s.zones &&
    typeof s.zones.orthodox === 'number' &&
    typeof s.zones.southpaw === 'number'
  );
}

export function getCustomCombos(): Combo[] {
  try {
    const raw = safeStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (c): c is Combo =>
        !!c &&
        typeof c.id === 'string' &&
        typeof c.name === 'string' &&
        Array.isArray(c.sequence) &&
        c.sequence.length >= MIN_STEPS &&
        c.sequence.length <= MAX_STEPS &&
        c.sequence.every(isValidStep),
    ).slice(0, MAX_CUSTOM_COMBOS);
  } catch {
    return [];
  }
}

export function saveCustomCombo(combo: Combo): Combo[] {
  const existing = getCustomCombos().filter((c) => c.id !== combo.id);
  const next = [...existing, combo].slice(-MAX_CUSTOM_COMBOS);
  safeStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}

export function deleteCustomCombo(id: string): Combo[] {
  const next = getCustomCombos().filter((c) => c.id !== id);
  safeStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}
