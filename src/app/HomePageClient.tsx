'use client';

import HomePage, { type HomePageProps } from '@/views/HomePage';

export default function HomePageClient(props: HomePageProps) {
  return <HomePage {...props} />;
}
