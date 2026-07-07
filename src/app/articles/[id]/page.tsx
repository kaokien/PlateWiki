import type { Metadata } from 'next';
import { JsonLd } from '@/components/JsonLd';
import { getArticleSchema, getBreadcrumbSchema } from '@/utils/seoSchemas';
import ArticlePageClient from './ArticlePageClient';
import { getArticlesList, getArticle } from '@/utils/contentLoader';

export async function generateStaticParams() {
  const articleList = await getArticlesList();
  return articleList.map((a) => ({ id: String(a.id) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const article = await getArticle(id);
  if (!article) {
    const title = id
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
    return {
      title,
      description: `Read our expert guide on ${title.toLowerCase()}. In-depth nutrition analysis from PlateWiki.`,
    };
  }
  return {
    title: article.title,
    description:
      article.subtitle ||
      `Read our expert guide on ${article.title.toLowerCase()}. In-depth nutrition analysis from PlateWiki.`,
    alternates: {
      canonical: `https://PlateWiki.org/articles/${id}`,
    },
    openGraph: {
      title: `${article.title} | PlateWiki`,
      description: article.subtitle,
      ...(article.heroImage && { images: [{ url: article.heroImage }] }),
    },
  };
}

export default async function ArticleRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = await getArticle(id);

  const articleSchema = article ? getArticleSchema(article) : null;
  const breadcrumbSchema = article
    ? getBreadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Articles', url: '/articles' },
        { name: article.category, url: `/articles?category=${encodeURIComponent(article.category)}` },
        { name: article.title },
      ])
    : null;

  return (
    <>
      {articleSchema && <JsonLd data={articleSchema} />}
      {breadcrumbSchema && <JsonLd data={breadcrumbSchema} />}
      <ArticlePageClient article={article} />
    </>
  );
}
