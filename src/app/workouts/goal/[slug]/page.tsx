import type { Metadata } from 'next';
import { goalWorkouts } from '@/data/exercises';
import { JsonLd } from '@/components/JsonLd';

const SITE_URL = 'https://FoodWiki.org';

const goalMap = goalWorkouts as Record<string, any>;

export async function generateStaticParams() {
  return Object.keys(goalWorkouts).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const workout = goalMap[slug];
  if (!workout) {
    return { title: 'Workout Not Found' };
  }
  return {
    title: workout.title,
    description:
      workout.description?.slice(0, 155) ||
      `${workout.name} — boxing training program. ${workout.exercises?.length || 0} exercises to reach your goal.`,
    robots: { index: true, follow: true },
    alternates: {
      canonical: `${SITE_URL}/workouts/goal/${slug}`,
    },
    openGraph: {
      title: workout.title,
      description:
        workout.description?.slice(0, 155) ||
        `${workout.name} — goal-based boxing workout.`,
      images: [{ url: '/og-image.png' }],
    },
  };
}

export default async function GoalWorkoutRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const workout = goalMap[slug];

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

  const { default: GoalWorkoutPage } = await import(
    '@/views/GoalWorkoutPage'
  );

  return (
    <>
      {breadcrumbSchema && <JsonLd data={breadcrumbSchema} />}
      <GoalWorkoutPage slug={slug} />
    </>
  );
}
