'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Check, X, Crown, Zap, Shield, ChevronDown, ChevronUp } from 'lucide-react';
import { useSubscription } from '../context/SubscriptionContext';
import { TECHNIQUE_COUNT } from '@/data/techniques';
import { getOrAssignVariant } from '../utils/abTest';
import { analytics } from '../utils/analytics';
import './PricingPage.css';

const FEATURES = [
  { name: `Full Technique Library (${TECHNIQUE_COUNT} techniques)`, free: true, pro: true },
  { name: 'Interactive Body Map', free: true, pro: true },
  { name: 'Daily Drill', free: true, pro: true },
  { name: 'Gym Workouts', free: '3 workouts', pro: 'All 25+' },
  { name: 'Training Programs', free: '7-Day Fundamentals', pro: 'All programs' },
  { name: 'Saved Techniques', free: '10 max', pro: 'Unlimited' },
  { name: 'Workout Tracking', free: false, pro: true },
  { name: 'Training History & Stats', free: false, pro: true },
  { name: 'Flashcard Quiz Mode', free: false, pro: true },
  { name: 'Heavy Bag Custom Presets', free: false, pro: true },
  { name: 'Ad-Free Experience', free: false, pro: true },
];

const FAQ_ITEMS = [
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. Cancel with one click from your account settings. No questions asked, no hoops to jump through.',
  },
  {
    q: 'What happens to my data if I cancel?',
    a: 'Your technique library access stays free forever. Saved techniques (up to 10) and your training history are preserved for 90 days if you decide to come back.',
  },
  {
    q: 'Is the free trial really free?',
    a: 'Yes. You get full Pro access for 7 days. No credit card required to start.',
  },
  {
    q: 'Do I need an account?',
    a: 'Not during our beta. All your stats, custom presets, and training history are saved securely right on your local device. We will roll out cloud sign-ups once our main server database launches.',
  },
];

const PricingPage = () => {
  const { isPro, tier, canStartTrial, startTrial, trialDaysLeft, unlockPro } = useSubscription();
  const [billing, setBilling] = useState('annual');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [framingVariant, setFramingVariant] = useState<'A' | 'B'>('A');

  useEffect(() => {
    const variant = getOrAssignVariant('pricing_framing');
    setFramingVariant(variant);
    analytics.customEvent('pricing_page_view', { variant });

    const params = new URLSearchParams(window.location.search);
    const trigger = params.get('trigger') || 'pricing_nav';
    analytics.paywallViewed(trigger);
  }, []);

  const monthlyPrice = 3.99;
  const annualPrice = 29.99;
  const annualMonthly = (annualPrice / 12).toFixed(2);
  const savingsPercent = Math.round((1 - annualPrice / (monthlyPrice * 12)) * 100);

  const handleStartTrial = () => {
    if (canStartTrial) {
      analytics.trialStarted(billing as 'monthly' | 'annual');
      startTrial();
    }
  };

  const handleUnlockPro = () => {
    analytics.purchaseCompleted(billing as 'monthly' | 'annual', billing === 'annual' ? annualPrice : monthlyPrice);
    unlockPro();
  };

  return (
    <div className="pricing-page">
{/* Hero */}
      <div className="pricing-hero">
        <div className="pricing-badge">
          <Crown size={14} /> FoodWiki PRO
        </div>
        <h1>Train smarter. <span className="text-primary">Hit harder.</span></h1>
        <p className="pricing-subtitle">
          Everything in the free library, plus the tools that turn knowledge into results.
        </p>
      </div>

      {/* Active Pro Banner */}
      {isPro && (
        <div className="pricing-active-banner glass-panel">
          <Shield size={18} />
          <span>
            {tier === 'trial'
              ? `You're on a free trial — ${trialDaysLeft} days left`
              : 'You have FoodWiki Pro'
            }
          </span>
        </div>
      )}

      {/* Billing Toggle */}
      <div className="pricing-toggle">
        <button
          className={`toggle-btn ${billing === 'monthly' ? 'active' : ''}`}
          onClick={() => setBilling('monthly')}
        >
          Monthly
        </button>
        <button
          className={`toggle-btn ${billing === 'annual' ? 'active' : ''}`}
          onClick={() => setBilling('annual')}
        >
          Annual
          <span className="toggle-save">Save {savingsPercent}%</span>
        </button>
      </div>

      {/* Plan Cards */}
      <div className="pricing-cards">
        {/* Free */}
        <div className="pricing-card glass-panel">
          <h3>Free</h3>
          <div className="pricing-price">
            <span className="price-amount">$0</span>
            <span className="price-period">forever</span>
          </div>
          <p className="pricing-card-desc">Browse the full technique library and start learning.</p>
          <Link href="/techniques" className="pricing-card-cta pricing-card-cta-secondary">
            Keep Browsing
          </Link>
          <ul className="pricing-features">
            {FEATURES.map(f => (
              <li key={f.name} className={f.free ? '' : 'disabled'}>
                {f.free ? <Check size={14} /> : <X size={14} />}
                <span>{f.name}</span>
                {typeof f.free === 'string' && <em>({f.free})</em>}
              </li>
            ))}
          </ul>
        </div>

        {/* Pro */}
        <div className="pricing-card pricing-card-pro glass-panel">
          <div className="pricing-popular">Most Popular</div>
          <h3>Pro</h3>
          <div className="pricing-price">
            <span className="price-amount">
              ${billing === 'annual' ? annualMonthly : monthlyPrice.toFixed(2)}
            </span>
            <span className="price-period">/month</span>
          </div>
          {billing === 'annual' && (
            <div className="pricing-billed">
              Billed ${annualPrice}/year
            </div>
          )}
          <p className="pricing-card-desc">Full access to every workout, program, and training tool.</p>

          {!isPro ? (
            canStartTrial ? (
              <button className="pricing-card-cta" onClick={handleStartTrial}>
                Start 7-Day Free Trial
              </button>
            ) : (
              <button className="pricing-card-cta" onClick={handleUnlockPro}>
                Upgrade to Pro
              </button>
            )
          ) : (
            <div className="pricing-card-cta pricing-card-cta-active">
              <Check size={16} /> Active
            </div>
          )}

          <ul className="pricing-features">
            {FEATURES.map(f => (
              <li key={f.name}>
                <Check size={14} />
                <span>{f.name}</span>
                {typeof f.pro === 'string' && <em>({f.pro})</em>}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Daily cost framing */}
      <div className="pricing-framing">
        {framingVariant === 'B' ? (
          <>
            That's less than <strong>a single drop-in fee</strong> at any boxing gym — with full training tools 24/7.
          </>
        ) : (
          <>
            That's less than <strong>13 cents a day</strong> — cheaper than a single round of heavy bag tape.
          </>
        )}
      </div>

      {/* FAQ */}
      <section className="pricing-faq">
        <h2>Questions</h2>
        {FAQ_ITEMS.map((item, i) => (
          <div
            key={i}
            className={`faq-item glass-panel ${openFaq === i ? 'open' : ''}`}
          >
            <button
              className="faq-question"
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
              aria-expanded={openFaq === i}
              aria-controls={`faq-answer-${i}`}
            >
              <span>{item.q}</span>
              {openFaq === i ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {openFaq === i && (
              <div id={`faq-answer-${i}`} className="faq-answer">{item.a}</div>
            )}
          </div>
        ))}
      </section>
    </div>
  );
};

export default PricingPage;
