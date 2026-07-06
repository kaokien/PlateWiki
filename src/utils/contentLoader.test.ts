import { describe, it, expect, beforeAll, vi } from 'vitest';
import { getArticlesList, getArticle } from './contentLoader';

describe('Article Release Scheduler (Option A) Verification', () => {
  beforeAll(() => {
    // Force Node environment to development so local content/articles files are read
    vi.stubEnv('NODE_ENV', 'development');
  });

  it('should exclude future-dated articles from the active articles list', async () => {
    const list = await getArticlesList();
    const futureTestFound = list.some(a => a.id === 'future-test');
    expect(futureTestFound).toBe(false);
  });

  it('should return null when trying to load a future-dated article directly', async () => {
    const article = await getArticle('future-test');
    expect(article).toBeNull();
  });

  it('should successfully load a past-dated article directly', async () => {
    const article = await getArticle('nutrition-for-boxing-sparring');
    expect(article).not.toBeNull();
    expect(article?.id).toBe('nutrition-for-boxing-sparring');
  });
});
