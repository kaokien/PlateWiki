'use client';

import ArticlePage from '@/views/ArticlePage';
import type { Article } from '@/utils/contentLoader';

export default function ArticlePageClient({ article }: { article: Article | null }) {
  return <ArticlePage article={article ?? undefined} />;
}