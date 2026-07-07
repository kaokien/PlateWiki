'use client';

import { Suspense } from 'react';
import TechniquePage from '@/views/TechniquePage';

export default function TechniquePageClient({ id }: { id: string }) {
  return (
    <Suspense>
      <TechniquePage routeId={id} />
    </Suspense>
  );
}