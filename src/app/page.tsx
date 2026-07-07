import { JsonLd } from '@/components/JsonLd';
import HomePageClient from './HomePageClient';
import type { Metadata } from 'next';
import { techniques } from '@/data/techniques';
import type { TechniqueSummary } from '@/views/HomePage';

export const metadata: Metadata = {
  title: 'PlateWiki — Sports Nutrition & Performance Fuel Library',
  description:
    'Learn sports nutrition with step-by-step macro and superfood profiles, interactive food harvesting tools, fuel planners, and training programs. Free for athletes.',
  alternates: {
    canonical: 'https://platewiki.org',
  },
};

import { SITE_URL } from '@/utils/config';

const CATEGORIES = [
  { name: 'Macronutrients', url: '/techniques/macronutrients' },
  { name: 'Hydration & Salts', url: '/techniques/hydration-salts' },
  { name: 'Micronutrients', url: '/techniques/micronutrients' },
  { name: 'Gut & Digestion', url: '/techniques/gut-digestion' },
  { name: 'Superfoods & Adaptogens', url: '/techniques/superfoods-adaptogens' },
];

const techEntries = Object.values(techniques);
const totalTechniques = techEntries.length;
const categoryCounts: Record<string, number> = {};
for (const t of techEntries) {
  categoryCounts[t.category] = (categoryCounts[t.category] || 0) + 1;
}
const techniqueIndex: Record<string, TechniqueSummary> = {};
for (const t of techEntries) {
  techniqueIndex[t.id] = { id: t.id, name: t.name, category: t.category };
}

export default function Home() {
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Plate Wiki Categories',
    itemListElement: CATEGORIES.map((cat, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: cat.name,
      url: `${SITE_URL}${cat.url}`,
    })),
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Is PlateWiki free to use?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. The entire sports nutrition and performance fuel library — with step-by-step nutrient profiles, synergistic combinations, and bio-boost tips — is free and always will be. We also offer interactive tools including a fasting/harvest timer and meal planner.',
        },
      },
      {
        '@type': 'Question',
        name: 'How do I align my diet with my sport?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Different sports require different fuel structures. Runners benefit from slow-digesting complex carbohydrates for glycogen storage. Lifters require clean, amino-dense proteins to support protein synthesis and muscle hypertrophy. Combat fighters often benefit from adaptogens to manage stress levels and optimize recovery.',
        },
      },
      {
        '@type': 'Question',
        name: 'What makes PlateWiki different from other recipe sites?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'PlateWiki focuses purely on performance sports nutrition for athletic goals (endurance, strength, recovery). Each food profile includes exact biomechanical benefits, target goals, prep formats, synergistic foods (such as black pepper to boost curcumin absorption), and common preparation pitfalls to avoid.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do I need supplements to succeed?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No. While targeted supplementation can offer minor performance increases, a whole-food diet containing nutrient-dense carbohydrates, proteins, anti-inflammatory fats, and adaptogenic mushrooms forms 95% of athletic success.',
        },
      },
      {
        '@type': 'Question',
        name: 'Who reviews the nutritional advice?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'All food profile entries are reviewed and updated under guidance from certified sports nutritionists and athletic coaches. We cross-reference peer-reviewed nutrition studies and sport-specific clinical trials.',
        },
      },
    ],
  };

  return (
    <>
      <JsonLd data={itemListSchema} />
      <JsonLd data={faqSchema} />
      <HomePageClient
        totalTechniques={totalTechniques}
        categoryCounts={categoryCounts}
        techniqueIndex={techniqueIndex}
      />
    </>
  );
}
