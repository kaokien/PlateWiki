import type { Metadata } from 'next';
import LeaderboardPage from '@/views/LeaderboardPage';

export const metadata: Metadata = {
  title: 'Global Leaderboard — Top Athletes by XP',
  description:
    'The PlateWiki global leaderboard. See the top athletes ranked by training XP — earned from workouts, technique study, quizzes, and streaks.',
  alternates: {
    canonical: 'https://PlateWiki.org/leaderboard',
  },
};

export default function LeaderboardRoute() {
  return <LeaderboardPage />;
}
