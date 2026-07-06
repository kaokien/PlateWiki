import type { Metadata } from 'next';
import ProgramPage from '@/views/ProgramPage';
import { programs } from '@/data/programs';

interface ProgramPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ProgramPageProps): Promise<Metadata> {
  const { id } = await params;
  const program = (programs as Record<string, { title: string; shortDesc: string }>)[id];

  if (!program) {
    return {
      title: 'Training Program',
      description: 'Follow a structured boxing training program — day-by-day workouts, technique drills, and conditioning sessions.',
    };
  }

  return {
    title: `${program.title} — Boxing Training Program`,
    description: program.shortDesc,
    robots: { index: false, follow: true },
    alternates: {
      canonical: `https://FoodWiki.org/program/${id}`,
    },
  };
}

export default function Route() {
  return <ProgramPage />;
}