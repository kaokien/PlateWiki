import type { Metadata } from 'next';

import { SITE_URL } from '@/utils/config';

export const metadata: Metadata = {
  title: 'Dashboard — PlateWiki',
  description:
    'Your personalized boxing training dashboard. Track progress through the boxing path, manage streaks, and find your next workout.',
  robots: { index: true, follow: true },
  alternates: {
    canonical: `${SITE_URL}/dashboard`,
  },
};

export { default } from '@/views/DashboardPage';
