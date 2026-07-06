import type { Metadata } from 'next';

const SITE_URL = 'https://FoodWiki.org';

export const metadata: Metadata = {
  title: 'Dashboard — FoodWiki',
  description:
    'Your personalized boxing training dashboard. Track progress through the boxing path, manage streaks, and find your next workout.',
  robots: { index: true, follow: true },
  alternates: {
    canonical: `${SITE_URL}/dashboard`,
  },
};

export { default } from '@/views/DashboardPage';
