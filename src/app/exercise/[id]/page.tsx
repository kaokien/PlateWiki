import type { Metadata } from 'next';
import { exercises } from '@/data/exercises';
import { JsonLd } from '@/components/JsonLd';

const SITE_URL = 'https://FoodWiki.org';

const exerciseMap = exercises as Record<string, any>;

export async function generateStaticParams() {
  return Object.keys(exercises).map((id) => ({ id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const exercise = exerciseMap[id];
  if (!exercise) {
    return { title: 'Exercise Not Found' };
  }
  const title = `${exercise.name} — Boxing Exercise Guide`;
  return {
    title,
    description:
      exercise.boxingContext?.slice(0, 155) ||
      `Learn how to do ${exercise.name} for boxing. Step-by-step instructions, sets, reps, and why this exercise matters for fighters.`,
    robots: { index: true, follow: true },
    alternates: {
      canonical: `${SITE_URL}/exercise/${id}`,
    },
    openGraph: {
      title,
      description:
        exercise.boxingContext?.slice(0, 155) ||
        `Boxing-specific guide to the ${exercise.name}. Equipment needed, pro tips, and related techniques.`,
      images: [{ url: '/og-image.png' }],
    },
  };
}

export default async function ExerciseRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const exercise = exerciseMap[id];

  // HowTo schema for rich results
  const howToSchema = exercise
    ? {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: exercise.name,
        description: exercise.boxingContext,
        image: `${SITE_URL}/og-image.png`,
        totalTime: 'PT5M',
        author: {
          '@type': 'Organization',
          name: 'FoodWiki',
          url: SITE_URL,
        },
        step: (exercise.howTo || []).map((step: string, i: number) => ({
          '@type': 'HowToStep',
          position: i + 1,
          text: step,
        })),
      }
    : null;

  const breadcrumbSchema = exercise
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
            name: 'Exercises',
            item: `${SITE_URL}/exercises`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: exercise.name,
          },
        ],
      }
    : null;

  // Dynamically import client component
  const { default: ExercisePage } = await import('@/views/ExercisePage');

  return (
    <>
      {howToSchema && <JsonLd data={howToSchema} />}
      {breadcrumbSchema && <JsonLd data={breadcrumbSchema} />}
      <ExercisePage exerciseId={id} />
    </>
  );
}
