import type { Metadata } from 'next';
import { techniques } from '@/data/techniques';
import { getWorkoutForTechnique } from '@/data/gymWorkouts';
import { JsonLd } from '@/components/JsonLd';
import TechniqueWorkoutPage from '@/views/TechniqueWorkoutPage';

const SITE_URL = 'https://FoodWiki.org';

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
    title: `${workout.title} — ${technique.name} Gym Workout`,
    description: `${workout.duration} gym workout for the ${technique.name}: ${workout.exercises.length} exercises targeting ${workout.focus.toLowerCase()}.`,
    alternates: {
      canonical: `${SITE_URL}/technique/${id}/workout`,
    },
    openGraph: {
      title: `${workout.title} — Gym Workout`,
      description: `${workout.exercises.length} exercises · ${workout.duration} · Train the muscles behind the ${technique.name}.`,
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
              name: 'Techniques',
              item: `${SITE_URL}/techniques`,
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: technique.name,
              item: `${SITE_URL}/technique/${id}`,
            },
            {
              '@type': 'ListItem',
              position: 4,
              name: 'Gym Workout',
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