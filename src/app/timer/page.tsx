import type { Metadata } from 'next';
import TimerPage from '@/views/TimerPage';

export const metadata: Metadata = {
  title: 'Boxing Round Timer — Free Online Timer',
  description: 'Free nutrition round timer with customizable rounds, rest periods, and warning bells. Train like a pro with accurate round timing for shadow boxing, bag work, and sparring.',
  robots: { index: false, follow: true },
};

export default function Route() {
  return <TimerPage />;
}