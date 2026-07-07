import type { Metadata } from 'next';
import { techniques } from '@/data/techniques';
import { JsonLd } from '@/components/JsonLd';
import { getFAQSchema, getTechniqueFAQs, getTechniqueTitle, truncateMeta } from '@/utils/seoSchemas';
import TechniquePageClient from './TechniquePageClient';

import { SITE_URL } from '@/utils/config';

// The techniques data is a plain JS object; cast for TS indexing
const techniqueMap = techniques as Record<string, any>;

// Pre-generate all technique pages at build time
export async function generateStaticParams() {
  return Object.keys(techniques).map((id) => ({ id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const technique = techniqueMap[id];
  if (!technique) {
    return { title: 'Technique Not Found' };
  }
  // Target "how to" search queries — e.g. "how to throw a jab"
  const howToTitle = getTechniqueTitle(technique);
  const description = truncateMeta(
    technique.description ||
      `Learn the ${technique.name} with step-by-step instructions, video guide, and targeted muscle analysis.`
  );
  return {
    title: howToTitle,
    description,
    alternates: {
      canonical: `${SITE_URL}/technique/${id}`,
    },
    openGraph: {
      title: howToTitle,
      description,
      // og:image comes from the opengraph-image.tsx file convention
    },
  };
}

export default async function TechniqueRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const technique = techniqueMap[id];

  // Build HowTo schema server-side (no stance parsing — use canonical/orthodox names)
  const howToSchema = technique
    ? {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: technique.name,
        description: technique.description,
        image: `${SITE_URL}/og-image.png`,
        totalTime: 'PT5M',
        author: {
          '@type': 'Organization',
          name: 'PlateWiki',
          url: SITE_URL,
        },
        step: (technique.steps || []).map((step: string, i: number) => ({
          '@type': 'HowToStep',
          position: i + 1,
          text: step,
        })),
      }
    : null;

  const breadcrumbSchema = technique
    ? {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: `${SITE_URL}/`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Techniques',
            item: `${SITE_URL}/techniques`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: technique.name,
          },
        ],
      }
    : null;

  const faqData = technique ? getTechniqueFAQs(technique) : [];
  const faqSchema = faqData.length > 0 ? getFAQSchema(faqData) : null;

  return (
    <>
      {howToSchema && <JsonLd data={howToSchema} />}
      {breadcrumbSchema && <JsonLd data={breadcrumbSchema} />}
      {faqSchema && <JsonLd data={faqSchema} />}
      <TechniquePageClient id={id} />
    </>
  );
}
