import type { Metadata } from 'next';
import { Suspense } from 'react';
import TrainPage from '@/views/TrainPage';

export const metadata: Metadata = {
  title: 'Meal & Fuel Generator — Custom Training Sessions',
  description: 'Generate custom athletic nutrition workouts based on your skill level and goals. Warm-up, technique drills, bag rounds, and conditioning combined into complete training sessions.',
  robots: { index: false, follow: true },
};

export default function Route() {
  return (
    <Suspense fallback={
      <div className="train-page-loading" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh', color: 'var(--color-text-muted)' }}>
        Loading Workout Interface...
      </div>
    }>
      <TrainPage />
    </Suspense>
  );
}