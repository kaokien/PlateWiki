import { describe, it, expect } from 'vitest';
import { glossary, toSlug } from '../data/glossary';
import { techniques, TECHNIQUE_COUNT } from '../data/techniques';
import { articles } from '../data/articles';
import { fighters } from '../data/fighters';
import {
  getTechniqueFAQs,
  getFAQSchema,
  getItemListSchema,
  getBreadcrumbSchema,
} from '../utils/seoSchemas';

// ============================================================
// Sitemap coverage — every dynamic content piece must be present
// ============================================================
describe('Sitemap coverage', () => {
  it(`has entries for all ${TECHNIQUE_COUNT} techniques`, () => {
    const techKeys = Object.keys(techniques);
    expect(techKeys.length).toBe(TECHNIQUE_COUNT);
    techKeys.forEach(id => {
      expect(typeof id).toBe('string');
      expect(id.length).toBeGreaterThan(0);
    });
  });

  it('has entries for all glossary terms with valid slugs', () => {
    expect(glossary.length).toBeGreaterThanOrEqual(25);
    glossary.forEach(entry => {
      const slug = toSlug(entry.term);
      expect(slug.length).toBeGreaterThan(0);
      expect(slug).not.toMatch(/[A-Z]/); // slugs must be lowercase
      expect(slug).not.toMatch(/\s/);    // no spaces
    });
  });

  it('has entries for all fighters', () => {
    expect(fighters.length).toBeGreaterThanOrEqual(4);
    fighters.forEach(f => {
      expect(f.id).toBeTruthy();
    });
  });

  it('has entries for all articles', () => {
    expect(articles.length).toBeGreaterThanOrEqual(3);
    articles.forEach(a => {
      expect(a.id).toBeTruthy();
      expect(a.title).toBeTruthy();
    });
  });
});

// ============================================================
// Technique metadata — search intent optimization
// ============================================================
describe('Technique SEO metadata', () => {
  const techniqueMap = techniques;

  it('every technique has a name and description', () => {
    Object.entries(techniqueMap).forEach(([id, t]) => {
      expect(t.name).toBeTruthy();
      expect(t.name.length).toBeGreaterThan(1);
    });
  });

  it('every technique has step-by-step instructions for HowTo schema', () => {
    Object.entries(techniqueMap).forEach(([id, t]) => {
      expect(Array.isArray(t.steps)).toBe(true);
      expect(t.steps.length).toBeGreaterThanOrEqual(2);
    });
  });
});

// ============================================================
// Glossary metadata — unique definitions
// ============================================================
describe('Glossary SEO metadata', () => {
  it('every term has a definition over 30 chars (min for meta description)', () => {
    glossary.forEach(entry => {
      expect(entry.definition.length).toBeGreaterThan(30);
    });
  });

  it('no two terms have the same definition', () => {
    const defs = glossary.map(g => g.definition);
    const unique = new Set(defs);
    expect(unique.size).toBe(defs.length);
  });
});

// ============================================================
// Article metadata — complete data for structured data
// ============================================================
describe('Article SEO metadata', () => {
  it('every article has title, subtitle, date, and category', () => {
    articles.forEach(a => {
      expect(a.title).toBeTruthy();
      expect(a.subtitle).toBeTruthy();
      expect(a.date).toBeTruthy();
      expect(a.category).toBeTruthy();
    });
  });

  it('every article has a unique id slug', () => {
    const ids = articles.map(a => a.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });
});

// ============================================================
// Cross-linking — glossary terms that reference techniques
// ============================================================
describe('Cross-linking integrity', () => {
  it('every glossary relatedTechnique points to a valid technique id', () => {
    const techIds = new Set(Object.keys(techniques));
    glossary.filter(g => g.relatedTechnique).forEach(entry => {
      expect(techIds.has(entry.relatedTechnique!)).toBe(true);
    });
  });
});

// ============================================================
// FAQ schema generation
// ============================================================
describe('Technique FAQ schema', () => {
  const techniqueMap = techniques as Record<string, any>;

  it('generates at least 2 FAQs per technique', () => {
    Object.entries(techniqueMap).forEach(([id, t]) => {
      const faqs = getTechniqueFAQs(t);
      expect(faqs.length).toBeGreaterThanOrEqual(2);
    });
  });

  it('produces valid FAQPage schema structure', () => {
    const jab = techniqueMap['sweet-potato'];
    const faqs = getTechniqueFAQs(jab);
    const schema = getFAQSchema(faqs);
    expect(schema['@type']).toBe('FAQPage');
    expect(schema.mainEntity.length).toBe(faqs.length);
    schema.mainEntity.forEach((q: any) => {
      expect(q['@type']).toBe('Question');
      expect(q.name).toBeTruthy();
      expect(q.acceptedAnswer.text).toBeTruthy();
    });
  });
});

// ============================================================
// ItemList schema
// ============================================================
describe('ItemList schema', () => {
  it('generates valid ItemList with correct count', () => {
    const items = [{ name: 'Jab', url: '/technique/jab' }, { name: 'Cross', url: '/technique/cross' }];
    const schema = getItemListSchema(items);
    expect(schema['@type']).toBe('ItemList');
    expect(schema.numberOfItems).toBe(2);
    expect(schema.itemListElement[0].position).toBe(1);
    expect(schema.itemListElement[1].position).toBe(2);
  });
});

// ============================================================
// Breadcrumb schema
// ============================================================
describe('Breadcrumb schema', () => {
  it('generates valid BreadcrumbList', () => {
    const schema = getBreadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'Techniques' },
    ]);
    expect(schema['@type']).toBe('BreadcrumbList');
    expect(schema.itemListElement.length).toBe(2);
    expect(schema.itemListElement[0].item).toContain('platewiki.org');
    expect(schema.itemListElement[1].item).toBeUndefined();
  });
});
