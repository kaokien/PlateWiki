'use client';

import ArticlesPage from '@/views/ArticlesPage';
import type { Article } from '@/utils/contentLoader';
import type { Category } from '@/data/articles';

export default function Client({
  initialArticles,
  initialCategories,
}: {
  initialArticles: Article[];
  initialCategories: Category[];
}) {
  return <ArticlesPage articles={initialArticles} categories={initialCategories} />;
}