import type { Metadata } from 'next';
import CoursePage from '@/views/CoursePage';

export const metadata: Metadata = {
  title: 'Athletic Fueling Blueprint Course — Learn Athletic Nutrition From Scratch',
  description: 'Complete athletic nutrition fundamentals course with digital guide and video breakdowns. 6+ years of coaching experience distilled into a step-by-step training system.',
};

export default function Route() {
  return <CoursePage />;
}