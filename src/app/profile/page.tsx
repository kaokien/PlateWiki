import type { Metadata } from 'next';
import FighterProfilePage from '@/views/FighterProfilePage';

export const metadata: Metadata = {
  title: 'Fighter Profile',
  description: 'Track your boxing journey — XP, rank, training streaks, workouts completed, and fighting style analysis.',
  robots: { index: false, follow: true },
};

export default function Route() {
  return <FighterProfilePage />;
}
