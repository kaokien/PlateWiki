import type { Metadata } from 'next';
import { Suspense } from 'react';
import { redirect, notFound } from 'next/navigation';
import TechniquesPage from '@/views/TechniquesPage';
import { TECHNIQUE_COUNT } from '@/data/techniqueCount';

const VALID_CATEGORIES: Record<string, string> = {
  punches: 'Punches',
  defense: 'Defense',
  footwork: 'Footwork',
  combinations: 'Combinations',
  conditioning: 'Conditioning',
  'ring-iq': 'Ring IQ',
};

const CATEGORY_META: Record<string, { title: string; description: string }> = {
  punches: {
    title: `Boxing Punches — All ${TECHNIQUE_COUNT}+ Punch Techniques`,
    description: `Master every boxing punch: jab, cross, hook, uppercut, and advanced variations. Step-by-step breakdowns with coaching cues, common mistakes, and drills.`,
  },
  defense: {
    title: 'Boxing Defense Techniques — Slips, Parries, Rolls & Guards',
    description: 'Learn essential boxing defense: slipping, parrying, rolling, blocking, and the shoulder roll. Step-by-step guides with pro tips and training drills.',
  },
  footwork: {
    title: 'Boxing Footwork — Movement Patterns & Drills',
    description: 'Master boxing footwork: pivots, lateral movement, angles, and ring cutting. Step-by-step guides with drills you can practice at home.',
  },
  combinations: {
    title: 'Boxing Combinations — Numbered Combos & Sequences',
    description: 'Every boxing combination explained: 1-2, 1-2-3, and advanced sequences. Step-by-step breakdowns for orthodox and southpaw fighters.',
  },
  conditioning: {
    title: 'Boxing Conditioning — Training Drills & Exercises',
    description: 'Boxing conditioning drills for power, speed, and endurance. Heavy bag workouts, shadow boxing routines, and strength training for fighters.',
  },
  'ring-iq': {
    title: 'Ring IQ — Boxing Strategy & Fight Intelligence',
    description: 'Develop ring IQ: distance management, timing, feints, angles, and fight strategy. Concepts that separate technical boxers from brawlers.',
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
      canonical: `https://FoodWiki.org/techniques/${category}`,
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
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
