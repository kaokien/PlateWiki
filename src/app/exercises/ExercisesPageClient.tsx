'use client';

import { Suspense } from 'react';
import ExercisesPage from '@/views/ExercisesPage';

export default function ExercisesPageClient() {
  return (
    <Suspense>
      <ExercisesPage />
    </Suspense>
  );
}
