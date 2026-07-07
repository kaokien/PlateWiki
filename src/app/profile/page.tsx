import type { Metadata } from 'next';
import FighterProfilePage from '@/views/FighterProfilePage';

export const metadata: Metadata = {
  title: 'athlete Profile',
  description: 'Track your fueling journey — XP, rank, training streaks, workouts completed, and fighting style analysis.',
  robots: { index: false, follow: true },
};

export default function Route() {
  return <FighterProfilePage />;
}
