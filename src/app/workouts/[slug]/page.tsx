import type { Metadata } from 'next';
import { muscleGroupWorkouts } from '@/data/exercises';
import { JsonLd } from '@/components/JsonLd';

const SITE_URL = 'https://FoodWiki.org';

const workoutMap = muscleGroupWorkouts as Record<string, any>;

export async function generateStaticParams() {
  return Object.keys(muscleGroupWorkouts).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const workout = workoutMap[slug];
  if (!workout) {
    return { title: 'Workout Not Found' };
  }
  return {
    title: workout.title,
    description:
      workout.description?.slice(0, 155) ||
      `Complete ${workout.name} program for boxing. ${workout.exercises?.length || 0} exercises targeting the muscles that matter for fighters.`,
    robots: { index: true, follow: true },
    alternates: {
      canonical: `${SITE_URL}/workouts/${slug}`,
    },
    openGraph: {
      title: workout.title,
      description:
        workout.description?.slice(0, 155) ||
        `${workout.name} — boxing-specific workout program.`,
      images: [{ url: '/og-image.png' }],
    },
  };
}

export default async function MuscleWorkoutRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const workout = workoutMap[slug];

  const breadcrumbSchema = workout
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
            name: 'Workouts',
            item: `${SITE_URL}/workouts`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: workout.name,
          },
        ],
      }
    : null;

  const { default: MuscleWorkoutPage } = await import(
    '@/views/MuscleWorkoutPage'
  );

  return (
    <>
      {breadcrumbSchema && <JsonLd data={breadcrumbSchema} />}
      <MuscleWorkoutPage slug={slug} />
    </>
  );
}
