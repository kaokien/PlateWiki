import type { Metadata } from 'next';
import { Suspense } from 'react';
import { redirect, notFound } from 'next/navigation';
import TechniquesPage from '@/views/TechniquesPage';
import { TECHNIQUE_COUNT } from '@/data/techniqueCount';

const VALID_CATEGORIES: Record<string, string> = {
  macronutrients: 'Macronutrients',
  'hydration-salts': 'Hydration & Salts',
  micronutrients: 'Micronutrients',
  'gut-digestion': 'Gut & Digestion',
  'superfoods-adaptogens': 'Superfoods & Adaptogens',
};

const CATEGORY_META: Record<string, { title: string; description: string }> = {
  macronutrients: {
    title: `Macronutrient Performance Fuels — All Macronutrient Profiles`,
    description: `Optimize glycogen replenishment, muscle protein synthesis, and hormone health with clean, athlete-focused macronutrients.`,
  },
  'hydration-salts': {
    title: 'Hydration & Electrolyte Salts — Cellular Fluid Balance',
    description: 'Maintain blood volume, prevent muscle cramping, and buffer lactic acid with natural electrolyte sources and mineral salts.',
  },
  micronutrients: {
    title: 'Micronutrient Density — Vitamins, Minerals & Antioxidants',
    description: 'Boost immune function, support oxygen transport, and neutralize oxidative stress with raw, bioavailable green vitamins.',
  },
  'gut-digestion': {
    title: 'Gut Health & Digestion — Active Enzymes & Probiotics',
    description: 'Build a resilient gut barrier, optimize nutrient assimilation, and reduce bloating with fermented kefirs and digestive enzymes.',
  },
  'superfoods-adaptogens': {
    title: 'Superfoods & Adaptogens — Focus, Stress & CNS Recovery',
    description: 'Modulate cortisol levels, combat physical fatigue, and sharpen cognitive focus with medicinal mushrooms and adaptogenic herbs.',
  },
};

type Props = {
  params: Promise<{ category: string }>;
};

export async function generateStaticParams() {
  return Object.keys(VALID_CATEGORIES).map((category) => ({ category }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const meta = CATEGORY_META[category];
  if (!meta) return {};

  const displayName = VALID_CATEGORIES[category];

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: `https://PlateWiki.org/foods/${category}`,
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
    },
  };
}

const REDIRECT_CATEGORIES: Record<string, string> = {
  carbs: 'macronutrients',
  proteins: 'macronutrients',
  'fats-hydration': 'hydration-salts',
  'vitamins-minerals': 'micronutrients',
  adaptogens: 'superfoods-adaptogens',
  'gut-health': 'gut-digestion',
};

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;

  if (REDIRECT_CATEGORIES[category]) {
    redirect(`/foods/${REDIRECT_CATEGORIES[category]}`);
  }

  const displayName = VALID_CATEGORIES[category];

  if (!displayName) {
    notFound();
  }

  return (
    <Suspense>
      <TechniquesPage initialCategory={displayName} />
    </Suspense>
  );
}
