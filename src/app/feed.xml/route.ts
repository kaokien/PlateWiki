import { SITE_URL } from '@/utils/config';

export const revalidate = 3600;

interface FeedArticle {
  id: string | number;
  title: string;
  subtitle?: string;
  date?: string;
  category?: string;
}

/**
 * Load the merged article list, falling back to the bundled local articles
 * if the remote content pipeline (GitHub Contents API) is unavailable.
 * The feed must never 500 — a partial feed beats an error page.
 */
async function loadArticles(): Promise<FeedArticle[]> {
  try {
    const { getArticlesList } = await import('@/utils/contentLoader');
    return await getArticlesList();
  } catch (error) {
    console.error('feed.xml: falling back to local articles:', error);
    const { articles } = await import('@/data/articles');
    return articles as FeedArticle[];
  }
}

export async function GET() {
  let articles: FeedArticle[] = [];
  try {
    articles = await loadArticles();
  } catch (error) {
    console.error('feed.xml: failed to load any articles:', error);
  }

  // Sort by date descending
  const sorted = [...articles].sort((a, b) => {
    const da = new Date(a.date || 0).getTime();
    const db = new Date(b.date || 0).getTime();
    return db - da;
  });

  const items = sorted
    .map(
      (article) => `
    <item>
      <title><![CDATA[${article.title}]]></title>
      <link>${SITE_URL}/articles/${article.id}</link>
      <guid isPermaLink="true">${SITE_URL}/articles/${article.id}</guid>
      <description><![CDATA[${article.subtitle || article.title}]]></description>
      <pubDate>${new Date(article.date || Date.now()).toUTCString()}</pubDate>
      <category>${article.category || 'Boxing'}</category>
    </item>`
    )
    .join('\n');

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>PlateWiki Articles</title>
    <link>${SITE_URL}/articles</link>
    <description>Expert nutrition guides, training tips, and fighter analysis from PlateWiki.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`;

  return new Response(feed, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
