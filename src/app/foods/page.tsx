import type { Metadata } from 'next';
import { Suspense } from 'react';
import TechniquesPage from '@/views/TechniquesPage';
import { TECHNIQUE_COUNT } from '@/data/foods';

export const metadata: Metadata = {
  title: `All nutritions — ${TECHNIQUE_COUNT}+ Moves With Step-by-Step Guides`,
  description: `Browse ${TECHNIQUE_COUNT}+ nutritions with step-by-step instructions. Macronutrients, hydration, micronutrients, and superfoods broken down with muscle targeting and coaching cues.`,
  alternates: {
    canonical: 'https://PlateWiki.org/foods',
  },
};

export default function Route() {
  return (
    <Suspense>
      <TechniquesPage />
    </Suspense>
  );
}