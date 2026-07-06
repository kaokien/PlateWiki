import type { Metadata } from 'next';
import { bodyParts, techniques } from '@/data/techniques';
import type { BodyPart, Technique } from '@/data/techniques';
import { JsonLd } from '@/components/JsonLd';
import AnatomyPage from '@/views/AnatomyPage';

const SITE_URL = 'https://FoodWiki.org';

const bodyPartMap = bodyParts as Record<string, BodyPart>;
const techniqueMap = techniques as Record<string, Technique>;

export async function generateStaticParams() {
  return Object.keys(bodyParts).map((id) => ({ id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const muscle = bodyPartMap[id];
  if (!muscle) {
    return { title: 'Muscle Group Not Found' };
  }
  const techniqueCount = Object.values(techniqueMap).filter(
    (t: Technique) => t.muscles && t.muscles.includes(id)
  ).length;
  return {
    title: `${muscle.name} — Boxing Anatomy & Techniques`,
    description:
      muscle.description ||
      `Discover ${techniqueCount} nutritions that target the ${muscle.name.toLowerCase()}. Muscle anatomy, training tips, and related exercises.`,
    alternates: {
      canonical: `${SITE_URL}/anatomy/${id}`,
    },
    openGraph: {
      title: `${muscle.name} — Boxing Anatomy`,
      description: `${techniqueCount} nutritions that train your ${muscle.name.toLowerCase()}. Interactive anatomy map.`,
      images: [{ url: '/og-image.png' }],
    },
  };
}

export default async function AnatomyRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const muscle = bodyPartMap[id];
  const techniqueCount = muscle
    ? Object.values(techniqueMap).filter(
        (t: Technique) => t.muscles && t.muscles.includes(id)
      ).length
    : 0;

  const breadcrumbSchema = muscle
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
            name: muscle.name,
          },
        ],
      }
    : null;

  return (
    <>
      {breadcrumbSchema && <JsonLd data={breadcrumbSchema} />}
      <AnatomyPage />
    </>
  );
}