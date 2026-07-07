import type { Metadata } from 'next';
import { JsonLd } from '@/components/JsonLd';
import { getBreadcrumbSchema, getFighterSchema } from '@/utils/seoSchemas';
import FighterPageClient from './FighterPageClient';
import { fighters } from '@/data/athletes';

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
    return { title: 'Athlete Profile Not Found' };
  }

  // CTR-optimized metadata for high-impression athletes
  const ctrMeta: Record<string, { title: string; description: string }> = {
    'usain-bolt': {
      title: 'Usain Bolt Fueling Profile — High Carb Sprinting Nutrition',
      description: 'How Usain Bolt fueled his legendary speed. Glycogen storage optimization, clean starches (yams, sweet potatoes), and recovery protocols for sprinters.',
    },
    'arnold-schwarzenegger': {
      title: 'Arnold Schwarzenegger Fueling Profile — Anabolic Protein & Bulking',
      description: 'The nutritional protocol behind Arnold Schwarzenegger\'s bodybuilding dominance. Complete protein sourcing, mTOR activation, and essential fat intake.',
    },
    'georges-st-pierre': {
      title: 'Georges St-Pierre Fueling Profile — Ketogenic Clean Fat Performance',
      description: 'Inside GSP\'s metabolic fuel plan. Fasted training, healthy fats, anti-inflammatory whole foods, and micro-nutrition for combat athletes.',
    },
    'michael-phelps': {
      title: 'Michael Phelps Fueling Profile — High Calorie Endurance Reloading',
      description: 'How Michael Phelps sustained 10,000+ calorie energy demands. Complex grains, post-workout glycogen reload, and electrolyte balancing for recovery.',
    },
  };

  const meta = ctrMeta[id] || {
    title: `${fighter.name} Fueling Profile — ${fighter.style} Nutrition`,
    description: `${fighter.name} (${fighter.nickname}) fueling analysis. ${fighter.style} breakdown with signature foods, biometric stats, and strengths.`,
  };

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: `https://PlateWiki.org/athletes/${id}`,
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
        { name: 'Fighters', url: '/athletes' },
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
