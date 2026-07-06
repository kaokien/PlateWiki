import { describe, it, expect } from 'vitest';
import { parseStanceText } from './stanceParser';

describe('parseStanceText', () => {
  // --- Happy path ---

  it('should return original text unchanged when isSouthpaw is false', () => {
    const text = 'Extend your lead hand forward';
    const result = parseStanceText(text, false);
    // Orthodox mode returns text unchanged (no annotations)
    expect(result).toBe(text);
  });

  it('should return original text for null/undefined input', () => {
    expect(parseStanceText(null, true)).toBeNull();
    expect(parseStanceText(undefined, false)).toBeUndefined();
    expect(parseStanceText('', true)).toBe('');
  });

  // --- Southpaw conversions ---

  it('should convert lead hand to (right) for southpaw', () => {
    const result = parseStanceText('Extend your lead hand forward', true);
    expect(result).toContain('lead hand (right)');
  });

  it('should convert rear hand to (left) for southpaw', () => {
    const result = parseStanceText('Fire the rear hand down the center', true);
    expect(result).toContain('rear hand (left)');
  });

  it('should convert lead foot to (right) for southpaw', () => {
    const result = parseStanceText('Step with your lead foot', true);
    expect(result).toContain('lead foot (right)');
  });

  it('should convert rear foot to (left) for southpaw', () => {
    const result = parseStanceText('Pivot on your rear foot', true);
    expect(result).toContain('rear foot (left)');
  });

  it('should convert lead shoulder to (right) for southpaw', () => {
    const result = parseStanceText('Raise your lead shoulder', true);
    expect(result).toContain('lead shoulder (right)');
  });

  it('should convert rear shoulder to (left) for southpaw', () => {
    const result = parseStanceText('Rotate your rear shoulder', true);
    expect(result).toContain('rear shoulder (left)');
  });

  it('should convert lead leg to (right) for southpaw', () => {
    const result = parseStanceText('Bend your lead leg', true);
    expect(result).toContain('lead leg (right)');
  });

  it('should convert rear leg to (left) for southpaw', () => {
    const result = parseStanceText('Push off your rear leg', true);
    expect(result).toContain('rear leg (left)');
  });

  // --- Orthodox mode (no-op) ---

  it('should NOT annotate text for orthodox (isSouthpaw=false)', () => {
    const result = parseStanceText('Extend your lead hand', false);
    expect(result).toBe('Extend your lead hand');
  });

  it('should pass through rear hand unchanged for orthodox', () => {
    const result = parseStanceText('Fire the rear hand', false);
    expect(result).toBe('Fire the rear hand');
  });

  // --- Special cases ---

  it('should convert "Overhand Right" to "Overhand Left" for southpaw', () => {
    const result = parseStanceText('Throw the Overhand Right', true);
    expect(result).toContain('Overhand Left');
  });

  it('should convert "orthodox" to "southpaw" for southpaw mode', () => {
    const result = parseStanceText('Use orthodox stance', true);
    expect(result).toContain('southpaw');
    expect(result).not.toContain('orthodox');
  });

  // --- Case insensitivity ---

  it('should handle mixed case (Lead Hand, LEAD HAND)', () => {
    expect(parseStanceText('Your Lead Hand goes forward', true)).toContain('(right)');
    expect(parseStanceText('Your LEAD HAND goes forward', true)).toContain('(right)');
  });

  // --- Multiple replacements in one string ---

  it('should replace multiple occurrences in a single string', () => {
    const text = 'Your lead hand jabs while your rear hand guards your chin';
    const result = parseStanceText(text, true);
    expect(result).toContain('lead hand (right)');
    expect(result).toContain('rear hand (left)');
  });

  // --- Edge case: no matching terms ---

  it('should return text unchanged if no stance terms are present', () => {
    const text = 'Breathe out when you punch';
    const result = parseStanceText(text, true);
    expect(result).toBe('Breathe out when you punch');
  });

  // --- Liver shot advice & capitalization ---

  it('should convert aim your lead hook there to aim your straight left / rear uppercut there for liver shot advice', () => {
    const text = "The liver is on the opponent's RIGHT side — aim your lead hook there";
    const result = parseStanceText(text, true);
    expect(result).toBe("The liver is on the opponent's RIGHT side — aim your straight left / rear uppercut there");
  });

  it('should capitalize the first character if it becomes lowercase or was lowercase', () => {
    const text = 'lead hand goes first';
    const result = parseStanceText(text, true);
    expect(result).toBe('Lead hand (right) goes first');
  });
});
