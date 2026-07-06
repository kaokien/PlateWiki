import type { Metadata } from 'next';
import ContactPage from '@/views/ContactPage';

export const metadata: Metadata = {
  title: 'Contact FoodWiki',
  description: 'Get in touch with the FoodWiki team. Questions about techniques, training programs, partnerships, or content suggestions.',
};

export default function Route() {
  return <ContactPage />;
}