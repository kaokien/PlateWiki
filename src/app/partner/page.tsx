import type { Metadata } from 'next';
import PartnerPage from '@/views/PartnerPage';

export const metadata: Metadata = {
  title: 'Advertise on FoodWiki',
  description: 'Reach athletes, home cooks, and nutrition enthusiasts. Advertise on FoodWiki to connect your brand with a dedicated health and nutrition audience.',
};

export default function Route() {
  return <PartnerPage />;
}