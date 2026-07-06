import type { Metadata } from 'next';
import { getArticlesList, getCategoriesWithCounts } from '@/utils/contentLoader';
import { JsonLd } from '@/components/JsonLd';
import { getBreadcrumbSchema, getItemListSchema } from '@/utils/seoSchemas';

export const metadata: Metadata = {
  title: 'Boxing Articles & Guides',
  description: 'Expert nutrition articles covering food science, meal planning, sports nutrition, and recovery strategies from FoodWiki.',
  alternates: {
    canonical: 'https://FoodWiki.org/articles',
  },
};

// ArticlesPage uses scroll-reveal but is mostly static content
// Wrapping as client for the scroll animations
import ArticlesPageClient from './ArticlesPageClient';

export default async function ArticlesRoute() {
  const articlesList = await getArticlesList();
  const categoriesList = await getCategoriesWithCounts();

  const breadcrumb = getBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Articles' },
  ]);
  const itemList = getItemListSchema(
    articlesList.map(a => ({ name: a.title, url: `/articles/${a.id}` }))
  );

  return (
    <>
      <JsonLd data={breadcrumb} />
      <JsonLd data={itemList} />
      <ArticlesPageClient initialArticles={articlesList} initialCategories={categoriesList} />
    </>
  );
}
