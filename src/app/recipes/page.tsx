import type { Metadata } from 'next';
import ExercisesPageClient from './ExercisesPageClient';

import { SITE_URL } from '@/utils/config';

export const metadata: Metadata = {
  title: 'Athletic Recipes — Performance Nutrition',
  description:
    'Browse 129+ gym exercises optimized for athletic nutrition performance. Every exercise explains why it matters for athletic nutrition — from jab power to knockout-proof neck training.',
  alternates: {
    canonical: `${SITE_URL}/recipes`,
  },
  openGraph: {
    title: 'Athletic Recipes — Performance Nutrition',
    description:
      '129+ athlete-specific gym exercises. Build power, speed, endurance, and defense with exercises designed for athletes.',
    images: [{ url: '/og-image.png' }],
  },
};

export default function ExercisesRoute() {
  return <ExercisesPageClient />;
}
