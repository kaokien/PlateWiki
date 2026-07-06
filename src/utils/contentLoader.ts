import matter from 'gray-matter';
import { marked } from 'marked';
import DOMPurify from 'isomorphic-dompurify';
import { articles as localArticles, categories as localCategories } from '../data/articles';

// GitHub Contents API (works with private repos + token auth)
const CONTENT_REPO = process.env.CONTENT_REPO || 'kaokien/FoodWiki';
const CONTENT_BRANCH = process.env.CONTENT_BRANCH || 'main';
const GITHUB_API_BASE = `https://api.github.com/repos/${CONTENT_REPO}/contents/content/articles`;

export interface ArticleSection {
  heading: string;
  content: string;
  list?: string[];
}

export interface Article {
  id: string | number;
  title: string;
  subtitle: string;
  category: string;
  tags: string[];
  date: string;
  dateModified?: string;
  author: string;
  readTime: string;
  heroImage?: string;
  youtubeId?: string;
  relatedArticles?: (string | number)[];
  relatedTechniques?: string[];
  callToAction?: {
    text: string;
    link: string;
  };
  // Dynamic fields
  contentHtml?: string;
  sections: ArticleSection[]; // For backwards compatibility
}

// Check if we are running in a Node server environment
const isServer = typeof window === 'undefined';

/**
 * Reads local file content during development.
 */
function readLocalFile(relativePath: string): string {
  if (!isServer) throw new Error('Cannot read local files on client side');
  const fs = require('fs');
  const path = require('path');
  const absolutePath = path.join(/*turbopackIgnore: true*/ process.cwd(), relativePath);
  return fs.readFileSync(absolutePath, 'utf8');
}

/**
 * Fetches remote file content from GitHub Contents API (supports private repos).
 */
async function fetchRemoteFile(filename: string): Promise<string> {
  const url = `${GITHUB_API_BASE}/${filename}?ref=${CONTENT_BRANCH}`;
  
  const headers: HeadersInit = {
    'Accept': 'application/vnd.github.v3.raw',
  };
  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const res = await fetch(url, {
    headers,
    next: { revalidate: 3600, tags: ['articles'] },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch file: ${filename} (status ${res.status})`);
  }

  return res.text();
}

/**
 * Fetch the articles manifest index (remote metadata).
 */
export async function getRemoteManifest(): Promise<Article[]> {
  try {
    let content: string;
    if (process.env.NODE_ENV === 'development') {
      content = readLocalFile('content/articles/manifest.json');
    } else {
      try {
        content = await fetchRemoteFile('manifest.json');
      } catch (remoteError) {
        console.warn('Failed to load remote manifest, trying local fallback...', remoteError);
        content = readLocalFile('content/articles/manifest.json');
      }
    }
    return JSON.parse(content) as Article[];
  } catch (error) {
    console.error('Failed to load remote manifest.', error);
    return [];
  }
}

/**
 * Get merged list of local and remote articles, sorted by date.
 */
export async function getArticlesList(): Promise<Article[]> {
  const remoteArticles = await getRemoteManifest();
  
  // Filter out any remote article that overrides a local one by ID to prevent duplicates
  const localIds = new Set(localArticles.map(a => a.id));
  const filteredRemote = remoteArticles.filter(a => !localIds.has(a.id)).map(a => ({
    ...a,
    sections: a.sections || [],
  }));

  const merged = [...(localArticles as Article[]), ...filteredRemote];
  
  // Filter out future-dated articles
  const todayStr = new Date().toISOString().split('T')[0];
  const activeArticles = merged.filter(a => a.date <= todayStr);
  
  return activeArticles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Expose categories with counts computed from dynamic merged article list.
 */
export async function getCategoriesWithCounts() {
  const mergedArticles = await getArticlesList();
  
  // Clone baseline categories
  const categories = JSON.parse(JSON.stringify(localCategories));
  
  // All count
  categories[0].count = mergedArticles.length;
  
  // Individual counts
  categories.forEach((cat: { id: string; name: string; icon?: string; count: number }) => {
    if (cat.id !== 'all') {
      cat.count = mergedArticles.filter(a => a.category === cat.id).length;
    }
  });
  
  return categories;
}

/**
 * Fetches and parses a single article by ID.
 * Returns null if not found.
 */
export async function getArticle(id: string): Promise<Article | null> {
  const todayStr = new Date().toISOString().split('T')[0];

  // 1. Check local static articles first
  const localArticle = (localArticles as Article[]).find(a => a.id === id);
  if (localArticle) {
    if (localArticle.date > todayStr) {
      return null;
    }
    return localArticle;
  }

  // 2. Fetch remote article markdown
  try {
    let rawMarkdown: string;
    if (process.env.NODE_ENV === 'development') {
      rawMarkdown = readLocalFile(`content/articles/${id}.md`);
    } else {
      try {
        rawMarkdown = await fetchRemoteFile(`${id}.md`);
      } catch (remoteError) {
        console.warn(`Failed to fetch remote article "${id}", trying local fallback...`, remoteError);
        rawMarkdown = readLocalFile(`content/articles/${id}.md`);
      }
    }

    // Parse frontmatter
    const { data, content } = matter(rawMarkdown);

    // Filter out future-dated articles
    const articleDate = data.date || new Date().toISOString().split('T')[0];
    if (articleDate > todayStr) {
      return null;
    }
    
    // Parse body markdown to HTML
    const contentHtml = DOMPurify.sanitize(await marked.parse(content));

    // Extract H2 headings for Table of Contents
    const h2Regex = /^##\s+(.+)$/gm;
    const headings: string[] = [];
    let match;
    while ((match = h2Regex.exec(content)) !== null) {
      headings.push(match[1]);
    }

    // Map headings to backwards-compatible sections array for Table of Contents rendering
    const sections: ArticleSection[] = headings.map(heading => ({
      heading,
      content: '', // Left blank since contentHtml contains the body
    }));

    // Merge frontmatter metadata with body HTML
    return {
      id,
      title: data.title || '',
      subtitle: data.subtitle || '',
      category: data.category || 'Boxing Fundamentals',
      tags: data.tags || [],
      date: articleDate,
      dateModified: data.dateModified,
      author: data.author || 'FoodWiki Editorial',
      readTime: data.readTime || '5 min',
      heroImage: data.heroImage,
      youtubeId: data.youtubeId,
      relatedArticles: data.relatedArticles || [],
      relatedTechniques: data.relatedTechniques || [],
      callToAction: data.callToAction,
      contentHtml,
      sections,
    };
  } catch (error) {
    console.error(`Failed to fetch dynamic article "${id}":`, error);
    return null;
  }
}
