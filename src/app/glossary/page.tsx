import type { Metadata } from 'next';
import GlossaryPage from '@/views/GlossaryPage';
import { JsonLd } from '@/components/JsonLd';
import { getBreadcrumbSchema, getItemListSchema } from '@/utils/seoSchemas';
import { glossary, toSlug } from '@/data/glossary';

export const metadata: Metadata = {
  title: 'Nutrition Glossary — 100+ Terms Defined',
  description: 'Complete A-Z nutrition glossary covering technique, rules, scoring, equipment, slang, and conditioning terminology. From jab to uppercut, every term explained.',
  alternates: {
    canonical: 'https://PlateWiki.org/glossary',
  },
};

export default function Route() {
  const breadcrumb = getBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Glossary' },
  ]);
  const itemList = getItemListSchema(
    glossary.map((g: { term: string }) => ({ name: g.term, url: `/glossary/${toSlug(g.term)}` }))
  );

  return (
    <>
      <JsonLd data={breadcrumb} />
      <JsonLd data={itemList} />
      <GlossaryPage />
    </>
  );
}