import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Use',
  description: 'PlateWiki terms of use — terms, safety disclaimers, and physical training assumption of risk agreements.',
};

import TermsPageClient from './TermsPageClient';

export default function TermsRoute() {
  return <TermsPageClient />;
}
