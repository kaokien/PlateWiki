import { describe, it, expect, beforeEach } from 'vitest';
import { articles, categories, getArticleById, getArticlesByCategory, getRelatedArticles } from './index';

describe('Articles Data Integrity', () => {
  // --- Structure validation ---

  it('should export a non-empty articles array', () => {
    expect(Array.isArray(articles)).toBe(true);
    expect(articles.length).toBeGreaterThan(0);
  });

  it('every article should have all required fields', () => {
    const requiredFields = ['id', 'title', 'subtitle', 'category', 'tags', 'date', 'author', 'readTime', 'sections'];

    articles.forEach(article => {
      requiredFields.forEach(field => {
        expect(article, `Article "${article.id}" is missing field "${field}"`).toHaveProperty(field);
      });
    });
  });

  it('every article should have at least one section', () => {
    articles.forEach(article => {
      expect(article.sections.length, `Article "${article.id}" has no sections`).toBeGreaterThan(0);
    });
  });

  it('every section should have a heading and content', () => {
    articles.forEach(article => {
      article.sections.forEach((section, idx) => {
        expect(section.heading, `Article "${article.id}" section ${idx} missing heading`).toBeTruthy();
        expect(section.content, `Article "${article.id}" section ${idx} missing content`).toBeTruthy();
      });
    });
  });

  // --- Uniqueness ---

  it('every article ID should be unique', () => {
    const ids = articles.map(a => a.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('every article title should be unique', () => {
    const titles = articles.map(a => a.title);
    const uniqueTitles = new Set(titles);
    expect(uniqueTitles.size).toBe(titles.length);
  });

  // --- Sorting ---

  it('articles should be sorted by date descending (newest first)', () => {
    for (let i = 1; i < articles.length; i++) {
      const prev = new Date(articles[i - 1].date).getTime();
      const curr = new Date(articles[i].date).getTime();
      expect(prev).toBeGreaterThanOrEqual(curr);
    }
  });

  // --- Categories ---

  it('every article category should match a defined category', () => {
    const categoryIds = categories.map(c => c.id).filter(id => id !== 'all');

    articles.forEach(article => {
      expect(categoryIds, `Article "${article.id}" has unknown category "${article.category}"`).toContain(article.category);
    });
  });

  it('category counts should match the actual number of articles', () => {
    categories.forEach(cat => {
      if (cat.id === 'all') {
        expect(cat.count).toBe(articles.length);
      } else {
        const actual = articles.filter(a => a.category === cat.id).length;
        expect(cat.count, `Category "${cat.name}" count mismatch`).toBe(actual);
      }
    });
  });
});

describe('getArticleById', () => {
  it('should return the correct article by ID', () => {
    const article = getArticleById('what-to-eat-before-boxing-training');
    expect(article).toBeDefined();
    expect(article.title).toContain('Eat');
  });

  it('should return undefined for a non-existent ID', () => {
    expect(getArticleById('non-existent-id')).toBeUndefined();
  });
});

describe('getArticlesByCategory', () => {
  it('should return all articles when category is "all"', () => {
    const result = getArticlesByCategory('all');
    expect(result.length).toBe(articles.length);
  });

  it('should filter articles by category', () => {
    const result = getArticlesByCategory('Athlete Fueling');
    expect(result.length).toBeGreaterThan(0);
    result.forEach(a => {
      expect(a.category).toBe('Athlete Fueling');
    });
  });

  it('should return empty array for non-existent category', () => {
    const result = getArticlesByCategory('Nonexistent Category');
    expect(result).toEqual([]);
  });
});

describe('getRelatedArticles', () => {
  it('should return related articles for a valid article', () => {
    const article = articles.find(a => a.relatedArticles && a.relatedArticles.length > 0);
    if (!article) return; // skip if no related articles exist

    const related = getRelatedArticles(article.id);
    expect(related.length).toBeGreaterThan(0);
    related.forEach(r => {
      expect(r).toHaveProperty('id');
      expect(r).toHaveProperty('title');
    });
  });

  it('should return empty array for article with no related articles', () => {
    const result = getRelatedArticles('non-existent-id');
    expect(result).toEqual([]);
  });

  it('all relatedArticle IDs should point to existing articles', () => {
    const allIds = new Set(articles.map(a => a.id));

    articles.forEach(article => {
      if (article.relatedArticles) {
        article.relatedArticles.forEach(relatedId => {
          expect(allIds.has(relatedId), `Article "${article.id}" references non-existent related article "${relatedId}"`).toBe(true);
        });
      }
    });
  });
});

describe('Article Content Quality', () => {
  it('no article section content should be empty', () => {
    articles.forEach(article => {
      article.sections.forEach(section => {
        expect(section.content.trim().length, `Article "${article.id}" section "${section.heading}" has empty content`).toBeGreaterThan(0);
      });
    });
  });

  it('every article should have a readTime string', () => {
    articles.forEach(article => {
      expect(article.readTime).toMatch(/^\d+ min$/);
    });
  });

  it('every article should have a valid ISO date', () => {
    articles.forEach(article => {
      const date = new Date(article.date);
      expect(date.toString(), `Article "${article.id}" has invalid date: ${article.date}`).not.toBe('Invalid Date');
    });
  });

  it('every article should have at least one tag', () => {
    articles.forEach(article => {
      expect(article.tags.length, `Article "${article.id}" has no tags`).toBeGreaterThan(0);
    });
  });
});
