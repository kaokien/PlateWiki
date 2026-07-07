import type { Metadata } from 'next';
import ExercisesPageClient from './ExercisesPageClient';

import { SITE_URL } from '@/utils/config';

export const metadata: Metadata = {
  title: 'Boxing Exercises — Gym Workouts for Fighters',
  description:
    'Browse 129+ gym exercises optimized for boxing performance. Every exercise explains why it matters for boxing — from jab power to knockout-proof neck training.',
  alternates: {
    canonical: `${SITE_URL}/recipes`,
  },
  openGraph: {
    title: 'Boxing Exercises — Gym Workouts for Fighters',
    description:
      '129+ boxing-specific gym exercises. Build power, speed, endurance, and defense with exercises designed for fighters.',
    images: [{ url: '/og-image.png' }],
  },
};

export default function ExercisesRoute() {
  return <ExercisesPageClient />;
}
