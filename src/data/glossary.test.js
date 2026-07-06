import { describe, it, expect } from 'vitest';
import {
  glossary,
  toSlug,
  getGlossaryBySlug,
  getRelatedTerms,
  getGlossaryLetters,
  getGlossaryCategories,
} from './glossary';

// ============================================================
// Slug generation
// ============================================================
describe('toSlug', () => {
  it('converts simple terms to lowercase slugs', () => {
    expect(toSlug('Antioxidants')).toBe('antioxidants');
    expect(toSlug('Autophagy')).toBe('autophagy');
  });

  it('replaces spaces with hyphens', () => {
    expect(toSlug('Amino Acids')).toBe('amino-acids');
    expect(toSlug('Gut Microbiome')).toBe('gut-microbiome');
  });

  it('handles parentheses and special chars', () => {
    expect(toSlug('Omega-3 Fatty Acids')).toBe('omega-3-fatty-acids');
  });

  it('strips leading and trailing hyphens', () => {
    expect(toSlug('  Carbohydrates  ')).toBe('carbohydrates');
  });
});

// ============================================================
// Slug lookup
// ============================================================
describe('getGlossaryBySlug', () => {
  it('returns the correct entry for a known slug', () => {
    const result = getGlossaryBySlug('amino-acids');
    expect(result).not.toBeNull();
    expect(result.term).toBe('Amino Acids');
  });

  it('returns null for unknown slugs', () => {
    expect(getGlossaryBySlug('not-a-term')).toBeNull();
    expect(getGlossaryBySlug('')).toBeNull();
  });
});

// ============================================================
// Related terms
// ============================================================
describe('getRelatedTerms', () => {
  it('returns terms in the same category', () => {
    const related = getRelatedTerms('Amino Acids');
    expect(related.length).toBeGreaterThan(0);
    related.forEach(r => {
      expect(r.category).toBe('Macronutrients');
      expect(r.term).not.toBe('Amino Acids');
    });
  });

  it('respects the limit parameter', () => {
    const related = getRelatedTerms('Amino Acids', 3);
    expect(related.length).toBeLessThanOrEqual(3);
  });

  it('returns empty array for unknown terms', () => {
    expect(getRelatedTerms('Not A Real Term')).toEqual([]);
  });
});

// ============================================================
// Data integrity
// ============================================================
describe('Glossary data integrity', () => {
  it('has at least 25 entries', () => {
    expect(glossary.length).toBeGreaterThanOrEqual(25);
  });

  it('every entry has a term and definition', () => {
    glossary.forEach(entry => {
      expect(entry.term).toBeTruthy();
      expect(entry.definition).toBeTruthy();
      expect(entry.definition.length).toBeGreaterThan(20);
    });
  });

  it('every entry has a valid category', () => {
    const validCategories = ['Macronutrients', 'Micronutrients', 'Physiology', 'Digestion', 'Timing', 'Hormones', 'Superfoods'];
    glossary.forEach(entry => {
      expect(validCategories).toContain(entry.category);
    });
  });

  it('generates unique slugs for every term', () => {
    const slugs = glossary.map(g => toSlug(g.term));
    const uniqueSlugs = new Set(slugs);
    expect(uniqueSlugs.size).toBe(slugs.length);
  });

  it('every relatedTechnique points to a non-empty string', () => {
    glossary.filter(g => g.relatedTechnique).forEach(entry => {
      expect(typeof entry.relatedTechnique).toBe('string');
      expect(entry.relatedTechnique.length).toBeGreaterThan(0);
    });
  });
});
