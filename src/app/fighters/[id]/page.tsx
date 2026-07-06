import type { Metadata } from 'next';
import { JsonLd } from '@/components/JsonLd';
import { getBreadcrumbSchema, getFighterSchema } from '@/utils/seoSchemas';
import FighterPageClient from './FighterPageClient';
import { fighters } from '@/data/fighters';

export function generateStaticParams() {
  return fighters.map((f) => ({ id: f.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const fighter = fighters.find((f) => f.id === id);
  if (!fighter) {
    return { title: 'Fighter Not Found' };
  }

  // CTR-optimized metadata for high-impression fighters
  const ctrMeta: Record<string, { title: string; description: string }> = {
    'canelo-alvarez': {
      title: `Canelo Álvarez Boxing Style — Counter-Punching & Liver Shot Breakdown`,
      description: `How Canelo reads the jab, slips to the outside, and fires back with fight-ending counters. Upper body movement, liver shot setups, and the counter timing that makes him the best at 168 lbs.`,
    },
    'floyd-mayweather': {
      title: `Floyd Mayweather Boxing Style — Philly Shell & Pull Counter Masterclass`,
      description: `Why Mayweather makes opponents miss 70% of their shots. Shoulder roll mechanics, pull counter timing, and the footwork adjustments that built a 50-0 record.`,
    },
    'vasyl-lomachenko': {
      title: `Lomachenko Boxing Style — V-Step Footwork & Angle Creation Analysis`,
      description: `The footwork system that makes Lomachenko "a ghost." V-step pivots, simultaneous punching while moving, and how he traps opponents in corners using geometry.`,
    },
  };

  const meta = ctrMeta[id] || {
    title: `${fighter.name} Boxing Style — ${fighter.style} Breakdown`,
    description: `${fighter.name} (${fighter.nickname}) style analysis. ${fighter.style} technique breakdown with signature moves, stats, strengths, and weaknesses.`,
  };

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: `https://FoodWiki.org/fighters/${id}`,
    },
  };
}

export default async function FighterRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const fighter = fighters.find((f) => f.id === id);

  const breadcrumbSchema = fighter
    ? getBreadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Fighters', url: '/fighters' },
        { name: fighter.name },
      ])
    : null;

  const fighterSchema = fighter ? getFighterSchema(fighter) : null;

  return (
    <>
      {breadcrumbSchema && <JsonLd data={breadcrumbSchema} />}
      {fighterSchema && <JsonLd data={fighterSchema} />}
      <FighterPageClient />
    </>
  );
}
