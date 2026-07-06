import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Coach Josh Training Videos — nutrition & Recovery',
  description:
    'Watch Coach Josh demonstrate nutrition drills, footwork patterns, defensive slips, and recovery routines. Free training videos for all skill levels from FoodWiki\'s lead coach.',
};

import WatchPageClient from './WatchPageClient';

export default function WatchRoute() {
  return <WatchPageClient />;
}
