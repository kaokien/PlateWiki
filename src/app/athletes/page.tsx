import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Athletic Fueling — Athlete Profiles & Nutrition Breakdowns',
  description: 'Study the athletic nutrition styles of legends like Tyson, Mayweather, Ali, and Pacquiao. See their signature techniques, stat breakdowns, and tactical analysis.',
};

import FightersPageClient from './FightersPageClient';

export default function FightersRoute() {
  return <FightersPageClient />;
}
