'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Users, TrendingUp, Eye, Shield, Zap, Video,
  ChevronDown, Mail, ExternalLink, Globe, Target,
  BarChart3, Handshake, Sparkles
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import './PartnerPage.css';
import { getFAQSchema } from '../utils/seoSchemas';
import { TECHNIQUE_COUNT } from '@/data/techniques';

/* ── Animated counter hook ── */
function useCountUp(target: number, duration = 2000, suffix = '') {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startTime = performance.now();
          const step = (now: number) => {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return { ref, display: `${count.toLocaleString()}${suffix}` };
}

/* ── Stats data ── */
const STATS = [
  { label: 'Social Media Views', value: 150000000, suffix: '+', display: '150M+', icon: Eye },
  { label: 'Athletes Trained', value: 200, suffix: '+', icon: Users },
  { label: 'Years Coaching', value: 6, suffix: '+', icon: Shield },
  { label: 'Techniques Documented', value: 54, suffix: '', icon: Target },
];

/* ── Why partner cards ── */
const WHY_CARDS = [
  {
    icon: Shield,
    title: 'High-Trust Authority',
    desc: '6+ years of professional coaching experience gives unparalleled credibility to product recommendations and reviews.',
    color: 'var(--color-primary)',
  },
  {
    icon: Zap,
    title: 'Hyper-Engaged Audience',
    desc: 'A dedicated following of fighters, athletes, and fitness enthusiasts who take action and buy what works.',
    color: '#ff9500',
  },
  {
    icon: Video,
    title: 'High-Quality Production',
    desc: 'Crisp audio, professional lighting, and dynamic editing tailored to the hooks that stop the scroll.',
    color: '#34c759',
  },
  {
    icon: BarChart3,
    title: 'FoodWiki Platform',
    desc: `${TECHNIQUE_COUNT} technique pages with built-in SEO, organic search traffic, and native ad placements across every page.`,
    color: '#5ac8fa',
  },
];

/* ── How we work steps ── */
const PROCESS_STEPS = [
  {
    num: '01',
    title: 'Strategy & Concept',
    desc: 'We align on your campaign goals, target audience, hooks, and USPs. Our team provides a brief or adapts yours to fit the audience perfectly.',
  },
  {
    num: '02',
    title: 'Production & Review',
    desc: 'We script, shoot, and edit high-quality assets. You review the first draft, and we make one round of included revisions if needed.',
  },
  {
    num: '03',
    title: 'Launch & Scale',
    desc: 'Final deliverables are sent over optimized for native platform performance. If whitelisting is included, access is granted to scale.',
  },
];

/* ── Demographics ── */
const DEMO_GENDER = { male: 72, female: 28 };
const DEMO_AGE = [
  { range: '18-24', pct: 35 },
  { range: '25-34', pct: 40 },
  { range: '35-44', pct: 15 },
  { range: '45+', pct: 10 },
];
const DEMO_REGIONS = [
  { flag: '🇺🇸', name: 'United States', pct: 55 },
  { flag: '🇬🇧', name: 'United Kingdom', pct: 6 },
  { flag: '🇨🇦', name: 'Canada', pct: 6 },
  { flag: '🇦🇺', name: 'Australia', pct: 6 },
];

/* ── Partnership tiers ── */
const TIERS = [
  {
    name: 'Starter',
    price: '$250',
    period: '/mo',
    features: [
      'Logo placement on FoodWiki sidebar',
      '1 sponsored technique page per month',
      'Monthly impression report',
      'Brand mention in newsletter',
    ],
    cta: 'Get Started',
    highlight: false,
  },
  {
    name: 'Growth',
    price: '$500',
    period: '/mo',
    features: [
      'Everything in Starter',
      'Dedicated ad banner across all pages',
      '1 UGC video per month (social media)',
      'Co-branded content collaboration',
      'Quarterly strategy call',
    ],
    cta: 'Most Popular',
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    features: [
      'Everything in Growth',
      'Multi-platform UGC campaign',
      'Whitelisting & paid media access',
      'Event coverage & ringside content',
      'Dedicated account management',
      'Custom integration on FoodWiki',
    ],
    cta: 'Let\'s Talk',
    highlight: false,
  },
];

/* ── FAQ data ── */
const FAQ_ITEMS = [
  {
    q: 'What kind of brands do you work with?',
    a: 'We partner with boxing equipment companies, fitness apparel brands, supplement brands, sports tech, and any brand targeting active, health-conscious consumers. If your audience trains, we can help.',
  },
  {
    q: 'What are the deliverables for UGC?',
    a: 'Deliverables vary by tier but typically include short-form vertical video (Reels/TikTok/Shorts), product integration into technique content, and social media posts. All content is shot in-gym with professional production quality.',
  },
  {
    q: 'Do you offer one-time campaigns?',
    a: 'Yes. While recurring partnerships deliver the best ROI, we offer single-campaign packages starting at $500 for brands testing the waters.',
  },
  {
    q: 'How is FoodWiki different from a social media sponsorship?',
    a: 'FoodWiki pages rank on Google and drive organic traffic 24/7. A sponsored technique page continues generating impressions long after a social post disappears from feeds. You get both the social reach AND evergreen search visibility.',
  },
  {
    q: 'Do you disclose paid partnerships?',
    a: 'Absolutely. All paid partnerships adhere to FTC disclosure guidelines. Transparency builds trust with our audience, which is why brands see higher conversion rates with us.',
  },
];

/* ── Stat Counter Component ── */
interface PartnerStat {
  label: string;
  value: number;
  suffix: string;
  display?: string;
  icon: LucideIcon;
}

const StatCounter = ({ stat }: { stat: PartnerStat }) => {
  const counter = useCountUp(stat.value, 2000, stat.suffix);
  const Icon = stat.icon;
  return (
    <div className="partner-stat" ref={counter.ref}>
      <Icon size={24} className="stat-icon" />
      <span className="stat-value">{counter.display}</span>
      <span className="stat-label">{stat.label}</span>
    </div>
  );
};

/* ── FAQ Item Component ── */
const FaqItem = ({ item, isOpen, onToggle }: { item: { q: string; a: string }; isOpen: boolean; onToggle: () => void }) => (
  <div className={`partner-faq-item ${isOpen ? 'open' : ''}`}>
    <button className="partner-faq-q" onClick={onToggle} aria-expanded={isOpen}>
      <span>{item.q}</span>
      <ChevronDown size={18} className="faq-chevron" />
    </button>
    {isOpen && <div className="partner-faq-a">{item.a}</div>}
  </div>
);

/* ═══════════════════════════════════════
   PARTNER PAGE
   ═══════════════════════════════════════ */
const PartnerPage = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const contactEmail = 'coachjoshofficial@playersclubllc.com';
  const mailtoLink = `mailto:${contactEmail}?subject=Partnership%20Inquiry%20-%20FoodWiki`;

  // JSON-LD for Organization
  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'FoodWiki',
    url: 'https://FoodWiki.org',
    description: 'Partner with FoodWiki to reach a highly engaged combat sports and fitness audience.',
    contactPoint: {
      '@type': 'ContactPoint',
      email: contactEmail,
      contactType: 'sales',
    },
  };

  return (
    <div className="partner-page">
{/* ── HERO ── */}
      <section className="partner-hero">
        <div className="partner-hero-inner">
          <span className="partner-badge">
            <Handshake size={14} /> PARTNERSHIPS
          </span>
          <h1>
            Authentic Reach.<br />
            <span className="text-primary">Hard-Hitting Results.</span>
          </h1>
          <p className="partner-hero-sub">
            Partner with FoodWiki to get your brand in front of a highly engaged,
            action-taking combat sports and fitness audience.
          </p>
          <div className="partner-hero-ctas">
            <a href={mailtoLink} className="btn-primary-lg">
              <Mail size={18} /> Book a Collab Call
            </a>
            <a href="#tiers" className="btn-outline-lg">
              View Packages <ChevronDown size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* ── STATS BAR (MuscleWiki-inspired) ── */}
      <section className="partner-stats-bar">
        {STATS.map((stat) => (
          <StatCounter key={stat.label} stat={stat} />
        ))}
      </section>

      {/* ── MISSION QUOTE ── */}
      <section className="partner-mission">
        <h2>The <span className="text-primary">FoodWiki</span> Advantage</h2>
        <p className="mission-body">
          FoodWiki isn't just another social media page. It's a search-indexed platform with {TECHNIQUE_COUNT} technique pages
          that drive organic traffic 24/7. When you partner with us, your brand gets embedded into the training
          experience — not sandwiched between cat videos.
        </p>
        <blockquote className="partner-quote">
          "No middlemen. We coach, we create, we ship. Every piece of content is backed by 6+ years
          of real coaching experience and 200+ athletes trained."
        </blockquote>
      </section>

      {/* ── WHY PARTNER (Feature cards - MuscleWiki style) ── */}
      <section className="partner-why">
        <h2>Why Brands <span className="text-primary">Win</span></h2>
        <p className="section-sub">Beyond vanity metrics. Real influence.</p>
        <div className="why-grid">
          {WHY_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.title} className="why-card glass-panel">
                <div className="why-icon" style={{ background: `${card.color}20`, color: card.color }}>
                  <Icon size={22} />
                </div>
                <h3>{card.title}</h3>
                <p>{card.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── AUDIENCE DEMOGRAPHICS ── */}
      <section className="partner-demographics">
        <h2>Audience <span className="text-primary">Demographics</span></h2>
        <p className="section-sub">A highly targeted, purchasing-power demographic.</p>

        <div className="demo-grid">
          {/* Gender split */}
          <div className="demo-card glass-panel">
            <h4>Gender</h4>
            <div className="gender-bar">
              <div className="gender-male" style={{ width: `${DEMO_GENDER.male}%` }}>
                <span>♂ {DEMO_GENDER.male}%</span>
              </div>
              <div className="gender-female" style={{ width: `${DEMO_GENDER.female}%` }}>
                <span>♀ {DEMO_GENDER.female}%</span>
              </div>
            </div>
          </div>

          {/* Age distribution */}
          <div className="demo-card glass-panel">
            <h4>Age Range</h4>
            <div className="age-bars">
              {DEMO_AGE.map((age) => (
                <div key={age.range} className="age-row">
                  <span className="age-label">{age.range}</span>
                  <div className="age-track">
                    <div className="age-fill" style={{ width: `${age.pct}%` }} />
                  </div>
                  <span className="age-pct">{age.pct}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top regions */}
          <div className="demo-card glass-panel">
            <h4>Top Regions</h4>
            <div className="region-list">
              {DEMO_REGIONS.map((r) => (
                <div key={r.name} className="region-row">
                  <span className="region-flag">{r.flag}</span>
                  <span className="region-name">{r.name}</span>
                  <span className="region-pct">{r.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CES BOXING CASE STUDY ── */}
      <section className="partner-case-study">
        <div className="case-study-inner glass-panel">
          <div className="case-label">
            <Sparkles size={14} /> CASE STUDY
          </div>
          <h3>CES Boxing Campaign</h3>
          <p>
            Partnered with CES Boxing to drive awareness and ticket hype for their recent fight night.
            Through a strategic mix of immersive ringside reels, fight breakdowns, and behind-the-scenes
            interviews, we captured the raw energy of the event and delivered massive organic reach.
          </p>
          <div className="case-metrics">
            <div className="case-metric">
              <span className="case-metric-value">Organic</span>
              <span className="case-metric-label">Reach Strategy</span>
            </div>
            <div className="case-metric">
              <span className="case-metric-value">Multi-Format</span>
              <span className="case-metric-label">Reels + Stories + Posts</span>
            </div>
            <div className="case-metric">
              <span className="case-metric-value">Live Event</span>
              <span className="case-metric-label">Ringside Coverage</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW WE WORK ── */}
      <section className="partner-process">
        <h2>How We <span className="text-primary">Work</span></h2>
        <div className="process-steps">
          {PROCESS_STEPS.map((step) => (
            <div key={step.num} className="process-step glass-panel">
              <div className="step-num">{step.num}</div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── PARTNERSHIP TIERS ── */}
      <section className="partner-tiers" id="tiers">
        <h2>Partnership <span className="text-primary">Packages</span></h2>
        <p className="section-sub">Flexible tiers for brands of all sizes.</p>
        <div className="tiers-grid">
          {TIERS.map((tier) => (
            <div key={tier.name} className={`tier-card glass-panel ${tier.highlight ? 'tier-highlight' : ''}`}>
              {tier.highlight && <div className="tier-popular">MOST POPULAR</div>}
              <h3 className="tier-name">{tier.name}</h3>
              <div className="tier-price">
                <span className="tier-amount">{tier.price}</span>
                {tier.period && <span className="tier-period">{tier.period}</span>}
              </div>
              <ul className="tier-features">
                {tier.features.map((f, i) => (
                  <li key={i}>
                    <span className="tier-check">✓</span> {f}
                  </li>
                ))}
              </ul>
              <a href={mailtoLink} className={`tier-cta ${tier.highlight ? 'tier-cta-primary' : ''}`}>
                {tier.cta}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="partner-faqs">
        <h2>Partnership <span className="text-primary">FAQs</span></h2>
        <div className="partner-faq-list">
          {FAQ_ITEMS.map((item, i) => (
            <FaqItem
              key={i}
              item={item}
              isOpen={openFaq === i}
              onToggle={() => setOpenFaq(openFaq === i ? null : i)}
            />
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="partner-final-cta">
        <div className="final-cta-inner">
          <h2>Ready to <span className="text-primary">Build?</span></h2>
          <p>Let's create something that moves your brand and our audience.</p>
          <a href={mailtoLink} className="btn-primary-lg">
            <Mail size={18} /> Book a Collab Call
          </a>
          <p className="final-cta-email">
            Or email directly at{' '}
            <a href={mailtoLink}>{contactEmail}</a>
          </p>
          <p className="ftc-note">
            All paid partnerships adhere to FTC disclosure guidelines.
          </p>
        </div>
      </section>
    </div>
  );
};

export default PartnerPage;
