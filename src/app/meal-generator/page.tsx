import type { Metadata } from 'next';
import { Suspense } from 'react';
import WorkoutGeneratorPage from '../../views/WorkoutGeneratorPage';

export const metadata: Metadata = {
  title: 'Workout Generator — Build Your Custom Athletic Nutrition Workout | PlateWiki',
  description: 'Generate a personalized athletic nutrition workout based on your goals, fitness level, available equipment, and focus areas. Free, no sign-up required.',
  robots: { index: false, follow: true },
};

export default function Page() {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>Loading...</div>}>
      <WorkoutGeneratorPage />
    </Suspense>
  );
}
