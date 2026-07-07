import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import PricingPage from '@/views/PricingPage';

export const metadata: Metadata = {
  title: 'Pro Plans & Pricing — Train Smarter, Hit Harder',
  description: 'Unlock PlateWiki Pro for $3.99/mo — flashcard quizzes, workout tracking, training history, and an ad-free experience.',
};

export default function Route() {
  // No payment processor wired — redirect to home in production
  if (process.env.NODE_ENV === 'production') {
    redirect('/');
    return null;
  }
  return <PricingPage />;
}