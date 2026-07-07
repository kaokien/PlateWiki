import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About PlateWiki — Our Story, Team & Editorial Process',
  description: 'PlateWiki was built by a tech enthusiast turned nutrition advocate who wanted the world\'s best-organized food and nutrition database. Learn about our mission, featured creator Coach Josh, editorial process, and community.',
};

import AboutPageClient from './AboutPageClient';

export default function AboutRoute() {
  return <AboutPageClient />;
}
