import type { Metadata } from 'next';
import ProgramsPage from '@/views/ProgramsPage';

export const metadata: Metadata = {
  title: 'Boxing Training Programs — Beginner to Advanced',
  description: 'Free nutrition training programs for all levels. Structured workout plans covering technique drills, conditioning, and skill development.',
};

export default function Route() {
  return <ProgramsPage />;
}