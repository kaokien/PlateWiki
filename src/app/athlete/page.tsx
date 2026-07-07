import type { Metadata } from 'next';

import { SITE_URL } from '@/utils/config';

export const metadata: Metadata = {
  title: 'Your Fighter — PlateWiki',
  description:
    'Watch your pixel fighter evolve as you train. Earn XP, rank up, and unlock new evolution stages from Prospect to Hall of Famer.',
  robots: { index: true, follow: true },
  alternates: {
    canonical: `${SITE_URL}/athlete`,
  },
  openGraph: {
    title: 'Your Fighter — PlateWiki',
    description:
      'Watch your pixel fighter evolve as you train. Earn XP, rank up, and unlock new evolution stages.',
    images: [{ url: '/og-image.png' }],
  },
};

export { default } from '@/views/FighterPage';
