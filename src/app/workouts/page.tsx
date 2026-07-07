import type { Metadata } from 'next';
import WorkoutsPageClient from './WorkoutsPageClient';

import { SITE_URL } from '@/utils/config';

export const metadata: Metadata = {
  title: 'Boxing Workouts — Training Programs for Fighters',
  description:
    'Complete boxing workout programs organized by muscle group and training goal. Build punching power, hand speed, defensive conditioning, and fight-ready cardio.',
  alternates: {
    canonical: `${SITE_URL}/workouts`,
  },
  openGraph: {
    title: 'Boxing Workouts — Training Programs for Fighters',
    description:
      'Boxing-specific workout programs for every muscle group and training goal. From punch power to knockout prevention.',
    images: [{ url: '/og-image.png' }],
  },
};

export default function WorkoutsRoute() {
  return <WorkoutsPageClient />;
}
