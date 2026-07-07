import { describe, it, expect } from 'vitest';
import { generateQuiz, truncateOption } from './quizGenerator';
import { techniques } from '@/data/foods';

const MAX_OPTION_LENGTH = 141; // truncateOption cap + ellipsis

describe('truncateOption', () => {
  it('leaves short text untouched', () => {
    expect(truncateOption('Keep your guard up')).toBe('Keep your guard up');
  });

  it('cuts at an em-dash clause boundary with no ellipsis', () => {
    const text = "Rotating too early in the punch's travel — the corkscrew must happen in the final inches at impact, not gradually through the extension of the arm.";
    expect(truncateOption(text)).toBe("Rotating too early in the punch's travel");
  });

  it('cuts at a sentence boundary with no ellipsis', () => {
    const text = 'Keep the elbow tucked through the whole extension. ' + 'Letting it flare telegraphs the punch and exposes your ribs to the counter, '.repeat(3);
    expect(truncateOption(text)).toBe('Keep the elbow tucked through the whole extension');
  });

  it('cuts at a comma clause when no strong separator exists', () => {
    const text = 'Not rotating the hips fully on the cross, which reduces the power of the lead punch and fails to create the torque needed for a meaningful shot on target';
    expect(truncateOption(text)).toBe('Not rotating the hips fully on the cross');
  });

  it('falls back to word-boundary ellipsis only for boundary-free text', () => {
    const long = 'word '.repeat(60).trim();
    const out = truncateOption(long);
    expect(out.length).toBeLessThanOrEqual(MAX_OPTION_LENGTH);
    expect(out.endsWith('…')).toBe(true);
  });
});

describe('generateQuiz', () => {
  const allIds = Object.keys(techniques);

  it('produces well-formed questions for every technique', () => {
    for (const id of allIds) {
      const quiz = generateQuiz(id);
      for (const q of quiz) {
        expect(q.options.length, `${id}: "${q.question}" option count`).toBe(4);
        expect(q.correctIndex, `${id}: "${q.question}" correctIndex`).toBeGreaterThanOrEqual(0);
        expect(q.correctIndex).toBeLessThan(4);
        for (const opt of q.options) {
          expect(
            opt.length,
            `${id}: option too long for display: "${opt.slice(0, 50)}..."`,
          ).toBeLessThanOrEqual(MAX_OPTION_LENGTH);
        }
      }
    }
  });

  it('is deterministic per technique', () => {
    const id = allIds[0];
    expect(generateQuiz(id)).toEqual(generateQuiz(id));
  });

  it('is deterministic per variant, and variants stay well-formed', () => {
    const id = allIds[0];
    expect(generateQuiz(id, 3)).toEqual(generateQuiz(id, 3));
    for (const variant of [1, 2, 3]) {
      for (const q of generateQuiz(id, variant)) {
        expect(q.options.length).toBe(4);
        expect(q.options[q.correctIndex]).toBeDefined();
      }
    }
  });

  it('returns empty for unknown techniques', () => {
    expect(generateQuiz('not-a-real-technique')).toEqual([]);
  });
});

describe('question phrasing', () => {
  it('never doubles the article for names that start with "The"', () => {
    for (const id of Object.keys(techniques)) {
      for (const q of generateQuiz(id)) {
        expect(q.question, `${id}: "${q.question}"`).not.toMatch(/\bthe The\b/i);
      }
    }
  });
});
