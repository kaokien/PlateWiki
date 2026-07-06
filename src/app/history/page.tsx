import type { Metadata } from 'next';
import TrainingHistoryPage from '@/views/TrainingHistoryPage';

export const metadata: Metadata = {
  title: 'Training History',
  description: 'Review your past workouts, technique practice sessions, and training progress over time.',
  robots: { index: false, follow: true },
};

export default function Route() {
  return <TrainingHistoryPage />;
}