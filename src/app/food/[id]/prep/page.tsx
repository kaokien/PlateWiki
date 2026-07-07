import type { Metadata } from 'next';
import { techniques } from '@/data/foods';
import { getWorkoutForTechnique } from '@/data/gymWorkouts';
import { JsonLd } from '@/components/JsonLd';
import TechniqueWorkoutPage from '@/views/TechniqueWorkoutPage';

import { SITE_URL } from '@/utils/config';

const techniqueMap = techniques as Record<string, any>;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const technique = techniqueMap[id];
  const workout = technique ? getWorkoutForTechnique(technique) : null;

  if (!technique || !workout) {
    return { title: 'Workout Not Found' };
  }

  return {
    title: `${workout.title} — ${technique.name} Prep Guide`,
    description: `${workout.duration} prep guide for ${technique.name}: ${workout.exercises.length} steps focused on ${workout.focus.toLowerCase()}.`,
    alternates: {
      canonical: `${SITE_URL}/food/${id}/prep`,
    },
    openGraph: {
      title: `${workout.title} — Prep Guide`,
      description: `${workout.exercises.length} prep steps · ${workout.duration} · Learn optimal preparation for ${technique.name}.`,
      images: [{ url: '/og-image.png' }],
    },
  };
}

export default async function WorkoutRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const technique = techniqueMap[id];
  const workout = technique ? getWorkoutForTechnique(technique) : null;

  const breadcrumbSchema =
    technique && workout
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
              name: 'Foods',
              item: `${SITE_URL}/foods`,
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: technique.name,
              item: `${SITE_URL}/food/${id}`,
            },
            {
              '@type': 'ListItem',
              position: 4,
              name: 'Prep Guide',
            },
          ],
        }
      : null;

  return (
    <>
      {breadcrumbSchema && <JsonLd data={breadcrumbSchema} />}
      <TechniqueWorkoutPage />
    </>
  );
}