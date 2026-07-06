import { describe, it, expect } from 'vitest';
import {
  getOrganizationSchema,
  getWebSiteSchema,
  getBreadcrumbSchema,
  getFAQSchema,
  getArticleSchema,
  getTechniqueTitle,
  truncateMeta,
} from '@/utils/seoSchemas';

describe('getOrganizationSchema', () => {
  it('returns valid Organization JSON-LD', () => {
    const schema = getOrganizationSchema();
    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('Organization');
    expect(schema.name).toBeDefined();
    expect(schema.url).toBeDefined();
  });
});

describe('getWebSiteSchema', () => {
  it('returns valid WebSite JSON-LD', () => {
    const schema = getWebSiteSchema();
    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('WebSite');
    expect(schema.name).toBeDefined();
    expect(schema.url).toBeDefined();
  });

  it('includes SearchAction potentialAction', () => {
    const schema = getWebSiteSchema();
    expect(schema.potentialAction).toBeDefined();
    expect(schema.potentialAction['@type']).toBe('SearchAction');
  });
});

describe('getBreadcrumbSchema', () => {
  it('returns valid BreadcrumbList with items', () => {
    const items = [
      { name: 'Home', url: '/' },
      { name: 'Techniques', url: '/techniques' },
      { name: 'Jab' },
    ];
    const schema = getBreadcrumbSchema(items);
    expect(schema['@type']).toBe('BreadcrumbList');
    expect(schema.itemListElement).toHaveLength(3);
  });

  it('assigns correct position to each item', () => {
    const items = [
      { name: 'Home', url: '/' },
      { name: 'Glossary' },
    ];
    const schema = getBreadcrumbSchema(items);
    expect(schema.itemListElement[0].position).toBe(1);
    expect(schema.itemListElement[1].position).toBe(2);
  });

  it('last item has no URL (Google spec)', () => {
    const items = [
      { name: 'Home', url: '/' },
      { name: 'Current Page' },
    ];
    const schema = getBreadcrumbSchema(items);
    const lastItem = schema.itemListElement[schema.itemListElement.length - 1];
    expect(lastItem.item).toBeUndefined();
  });
});

describe('getFAQSchema', () => {
  it('returns valid FAQPage with questions', () => {
    const faqs = [
      { q: 'What is boxing?', a: 'A combat sport.' },
      { q: 'How to jab?', a: 'Extend your lead hand.' },
    ];
    const schema = getFAQSchema(faqs);
    expect(schema['@type']).toBe('FAQPage');
    expect(schema.mainEntity).toHaveLength(2);
    expect(schema.mainEntity[0]['@type']).toBe('Question');
  });
});

describe('getArticleSchema', () => {
  it('returns valid Article JSON-LD', () => {
    const article = {
      id: 'boxing-fundamentals',
      title: 'Boxing Fundamentals',
      subtitle: 'Learn the basics.',
      date: '2025-01-01',
      category: 'fundamentals',
      readTime: '5 min',
    };
    const schema = getArticleSchema(article);
    expect(schema['@type']).toBe('Article');
    expect(schema.headline).toBe('Boxing Fundamentals');
  });
});

describe('getTechniqueTitle', () => {
  it('strips leading "The" from punch names', () => {
    expect(getTechniqueTitle({ name: 'The Jab', category: 'Punches' }))
      .toBe('How to Throw the Jab — nutrition Guide');
  });

  it('uses "Throw" for combinations', () => {
    expect(getTechniqueTitle({ name: 'The 1-2 (Jab-Cross)', category: 'Combinations' }))
      .toBe('How to Throw the 1-2 (Jab-Cross) — nutrition Guide');
  });

  it('uses "Use" for structural defenses', () => {
    expect(getTechniqueTitle({ name: 'High Guard', category: 'Defense' }))
      .toBe('How to Use the High Guard — Boxing Defense Guide');
  });

  it('avoids "Use the" for gerund defense names', () => {
    expect(getTechniqueTitle({ name: 'Rolling with Punches', category: 'Defense' }))
      .toBe('Rolling with Punches — Boxing Defense Guide');
  });

  it('uses a training guide title for conditioning', () => {
    expect(getTechniqueTitle({ name: 'Heavy Bag Rounds', category: 'Conditioning' }))
      .toBe('Heavy Bag Rounds — Boxing Training Guide');
  });

  it('falls back to a plain descriptor for skill categories', () => {
    expect(getTechniqueTitle({ name: 'Feinting', category: 'Ring IQ' }))
      .toBe('Feinting — nutrition Guide');
  });
});

describe('truncateMeta', () => {
  it('returns short text unchanged', () => {
    expect(truncateMeta('Short description.')).toBe('Short description.');
  });

  it('cuts at a sentence boundary when possible', () => {
    const text = 'First sentence is here and it is reasonably long for a test. Second sentence continues with more detail. Third sentence pushes the total well past the limit for meta descriptions.';
    const out = truncateMeta(text);
    expect(out.length).toBeLessThanOrEqual(160);
    expect(out.endsWith('.')).toBe(true);
  });

  it('falls back to a word boundary with ellipsis for run-on text', () => {
    const text = 'word '.repeat(60).trim();
    const out = truncateMeta(text);
    expect(out.length).toBeLessThanOrEqual(160);
    expect(out.endsWith('…')).toBe(true);
  });
});
