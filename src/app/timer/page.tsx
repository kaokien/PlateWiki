import type { Metadata } from 'next';
import TimerPage from '@/views/TimerPage';

export const metadata: Metadata = {
  title: 'Digestion & Fasting Timer — Free Online Timer',
  description: 'Free nutrition nutrition timer with customizable rounds, rest periods, and warning bells. Train like a pro with accurate round timing for shadow athletic nutrition, bag work, and training.',
  robots: { index: false, follow: true },
};

export default function Route() {
  return <TimerPage />;
}