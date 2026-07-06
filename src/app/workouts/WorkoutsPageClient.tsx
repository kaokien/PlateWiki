'use client';

import { Suspense } from 'react';
import WorkoutsPage from '@/views/WorkoutsPage';

export default function WorkoutsPageClient() {
  return (
    <Suspense>
      <WorkoutsPage />
    </Suspense>
  );
}
