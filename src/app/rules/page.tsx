import type { Metadata } from 'next';
import RulesPage from '@/views/RulesPage';

export const metadata: Metadata = {
  title: 'Nutrition Guidelines — Scoring, Fouls, and Weight Classes',
  description: 'Complete guide to nutrition guidelines. 10-point must scoring system, fouls and penalties, weight class divisions, and championship regulations explained.',
};

export default function Route() {
  return <RulesPage />;
}