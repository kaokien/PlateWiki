import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Merch | FoodWiki',
  description: 'Official FoodWiki merchandise. Premium kitchen gear and wellness merch for athletes and food lovers.',
  robots: { index: false, follow: false },
};

export default function MerchLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
