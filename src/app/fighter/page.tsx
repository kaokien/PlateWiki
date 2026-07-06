import type { Metadata } from 'next';

const SITE_URL = 'https://FoodWiki.org';

export const metadata: Metadata = {
  title: 'Your Fighter — FoodWiki',
  description:
    'Watch your pixel fighter evolve as you train. Earn XP, rank up, and unlock new evolution stages from Prospect to Hall of Famer.',
  robots: { index: true, follow: true },
  alternates: {
    canonical: `${SITE_URL}/fighter`,
  },
  openGraph: {
    title: 'Your Fighter — FoodWiki',
    description:
      'Watch your pixel fighter evolve as you train. Earn XP, rank up, and unlock new evolution stages.',
    images: [{ url: '/og-image.png' }],
  },
};

export { default } from '@/views/FighterPage';
