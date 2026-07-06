import type { Metadata } from 'next';
import CoursePage from '@/views/CoursePage';

export const metadata: Metadata = {
  title: 'Boxing Blueprint Course — Learn Boxing From Scratch',
  description: 'Complete boxing fundamentals course with digital guide and video breakdowns. 6+ years of coaching experience distilled into a step-by-step training system.',
};

export default function Route() {
  return <CoursePage />;
}