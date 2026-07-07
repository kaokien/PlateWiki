import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'PlateWiki privacy policy — how we collect, use, and protect your data.',
};

import PrivacyPageClient from './PrivacyPageClient';

export default function PrivacyRoute() {
  return <PrivacyPageClient />;
}
