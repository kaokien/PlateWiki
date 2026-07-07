import type { Metadata } from 'next';

import { SITE_URL } from '@/utils/config';

export const metadata: Metadata = {
  title: 'Dashboard — PlateWiki',
  description:
    'Your personalized athletic fueling dashboard. Track progress through the athletic nutrition path, manage streaks, and find your next workout.',
  robots: { index: true, follow: true },
  alternates: {
    canonical: `${SITE_URL}/dashboard`,
  },
};

export { default } from '@/views/DashboardPage';
