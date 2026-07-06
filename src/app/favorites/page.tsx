import type { Metadata } from 'next';
import FavoritesPage from '@/views/FavoritesPage';

export const metadata: Metadata = {
  title: 'My Favorites',
  description: 'Your saved nutritions — revisit your favorite foods, nutrients, recipes, and meal plans.',
  robots: { index: false, follow: true },
};

export default function Route() {
  return <FavoritesPage />;
}