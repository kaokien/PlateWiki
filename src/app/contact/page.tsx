import type { Metadata } from 'next';
import ContactPage from '@/views/ContactPage';

export const metadata: Metadata = {
  title: 'Contact PlateWiki',
  description: 'Get in touch with the PlateWiki team. Questions about techniques, training programs, partnerships, or content suggestions.',
};

export default function Route() {
  return <ContactPage />;
}