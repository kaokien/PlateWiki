import type { Metadata } from 'next';
import WorkoutsPageClient from './WorkoutsPageClient';

import { SITE_URL } from '@/utils/config';

export const metadata: Metadata = {
  title: 'Athletic Meals — Fueling Plans for Athletes',
  description:
    'Complete athletic nutrition workout programs organized by muscle group and training goal. Build punching power, hand speed, defensive conditioning, and fight-ready cardio.',
  alternates: {
    canonical: `${SITE_URL}/meals`,
  },
  openGraph: {
    title: 'Athletic Meals — Fueling Plans for Athletes',
    description:
      'Athletic Nutrition-specific workout programs for every muscle group and training goal. From punch power to knockout prevention.',
    images: [{ url: '/og-image.png' }],
  },
};

export default function WorkoutsRoute() {
  return <WorkoutsPageClient />;
}
