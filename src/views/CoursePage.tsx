'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  PlayCircle, CheckCircle, ChevronDown, ChevronUp,
  Star, Clock, Award, Users, Shield, Zap,
  Target, BookOpen, Dumbbell, Brain, Flame,
  Check, X
} from 'lucide-react';
import AdBanner from '../components/AdBanner';
import { analytics } from '../utils/analytics';
import { getFAQSchema } from '../utils/seoSchemas';
import './CoursePage.css';

// ====================================================================
// Striking Blueprint checkout URLs
// ====================================================================
const GUIDE_URL = 'https://www.coachjoshofficial.com/';
const COURSE_URL = 'https://coachjosh1.gumroad.com/l/opdee';

const GUIDE_PRICE = 49;
const COURSE_PRICE = 197;

const MODULES = [
  {
    num: '01',
    title: 'Striking Mechanics',
    desc: 'The complete technical breakdown. Generate power from the floor, fix your uppercut, and master distance. From stance through full combinations.',
    Icon: Target,
  },
  {
    num: '02',
    title: 'Conditioning Circuits',
    desc: 'Elite conditioning drills and routines that build relentless stamina and mental toughness. The same circuits used in real classes — burn maximum calories with real boxing work.',
    Icon: Flame,
  },
  {
    num: '03',
    title: 'Defense & Head Movement',
    desc: 'Slips, rolls, parries, and the defensive head movement patterns that keep you safe. Broken down step-by-step so you can learn them at your own pace.',
    Icon: Shield,
  },
  {
    num: '04',
    title: 'Footwork & Angles',
    desc: 'Old school Soviet boxing footwork concepts used by competitive athletes. Pivots, lateral movement, cutting angles, and ring generalship progressions.',
    Icon: BookOpen,
  },
];

const WHATS_INSIDE = [
  'Step-by-step fundamentals broken down from stance through combinations',
  'Bag work & focus mitt drills you can train solo',
  'Conditioning circuits (the same ones used in real classes)',
  'Defense, angles, and footwork progressions',
  'Lifetime access — train at your own pace',
];

const GUIDE_FEATURES = [
  { text: 'Striking Blueprint (complete technical breakdown)', included: true },
  { text: 'Footwork Drills & Angles', included: true },
  { text: 'Heavy Bag Workouts', included: true },
  { text: 'Defensive Head Movement', included: true },
  { text: 'Strength Program (4x/week)', included: true },
  { text: 'Printable Workout Logs', included: true },
  { text: '4 Deep-Dive Video Modules', included: false },
  { text: 'Step-by-Step Video Fundamentals', included: false },
  { text: 'Bag Work & Mitt Drill Videos', included: false },
  { text: 'Elite Conditioning Circuit Videos', included: false },
];

const COURSE_FEATURES = [
  { text: 'Everything in Striking Blueprint', included: true },
  { text: '4 Deep-Dive Video Modules', included: true },
  { text: 'Step-by-Step Fundamentals', included: true },
  { text: 'Bag Work & Mitt Drills', included: true },
  { text: 'Elite Conditioning Circuits', included: true },
  { text: 'Defense & Footwork Progressions', included: true },
  { text: 'Lifetime Access', included: true },
];

const TESTIMONIALS = [
  {
    name: 'Amanda R.',
    text: 'Incredible energy and you really learn the sweet science. I recommend this to anyone from absolute beginners to advanced trainees. Check your ego at the door and prepare to work.',
    stars: 5,
  },
  {
    name: 'Chris S.',
    text: 'He\'s motivating, technique driven, and his workouts are also fun. Coach Josh met me exactly where I was at.',
    stars: 5,
  },
  {
    name: 'Marcus T.',
    text: 'I trained at two gyms before finding Coach Josh. The difference is night and day. Every drill has a purpose and the conditioning circuits actually translate to real boxing.',
    stars: 5,
  },
];

const FAQ = [
  {
    q: 'Do I need any equipment to start?',
    a: 'No gear required to start. Just bring a good attitude. A heavy bag and hand wraps are recommended as you progress, but the fundamentals modules work with pure shadow boxing.',
  },
  {
    q: 'Is this for total beginners?',
    a: 'Yes. Zero experience required. The majority of students start with absolutely no boxing background. We break down the fundamentals from the ground up.',
  },
  {
    q: 'What\'s the difference between the Digital Guide and Video Course?',
    a: 'The Digital Guide ($49) is the written Striking Blueprint with workout logs and a 4x/week strength program. The Video Course ($197) includes everything in the Guide PLUS 4 deep-dive video modules where Coach Josh walks you through every technique, drill, and circuit step-by-step.',
  },
  {
    q: 'How long do I have access?',
    a: 'Lifetime. Once you purchase, it\'s yours forever — including all future updates.',
  },
  {
    q: 'Is this just cardio kickboxing?',
    a: 'No. This is real boxing instruction. You won\'t find aerobic cardio-kickboxing here. Every drill is built on proper, safe mechanics — the kind that translate outside the gym.',
  },
];

const CoursePage = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [openModule, setOpenModule] = useState<number | null>(null);

  const handleCheckoutClick = (product: string, price: number) => {
    analytics.customEvent('course_checkout_click', {
      event_category: 'monetization',
      course_name: product,
      price: price,
      transport_type: 'beacon',
    });
  };

  return (
    <div className="course-page">
{/* Hero */}
      <section className="course-hero">
        <div className="course-hero-bg">
          <Image src="/images/course-hero.webp" alt="" aria-hidden="true" fill className="course-hero-img" priority />
          <div className="course-hero-overlay" />
        </div>
        <div className="course-hero-content">
          <span className="course-badge">VIDEO COURSE</span>
          <h1>STOP DOING <span className="text-primary">CARDIO KICKBOXING.</span><br />LEARN THE REAL THING.</h1>
          <p className="course-hero-sub">
            The Boxing Blueprint is a complete fundamentals course taught by Coach Josh — 6+ years of experience, 200+ athletes trained, and 150M+ social media views.
          </p>
          <a
            href={COURSE_URL}
            className="course-cta-primary"
            onClick={() => handleCheckoutClick('boxing_blueprint', COURSE_PRICE)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <PlayCircle size={20} /> Get the Blueprint — ${COURSE_PRICE}
          </a>
          <span className="course-guarantee">Lifetime access · Instant delivery</span>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="course-stats">
        <div className="stat-item">
          <PlayCircle size={20} />
          <div>
            <strong>4</strong>
            <span>Deep-Dive Modules</span>
          </div>
        </div>
        <div className="stat-item">
          <Users size={20} />
          <div>
            <strong>200+</strong>
            <span>Athletes Trained</span>
          </div>
        </div>
        <div className="stat-item">
          <Clock size={20} />
          <div>
            <strong>6+ yrs</strong>
            <span>Coaching</span>
          </div>
        </div>
        <div className="stat-item">
          <Award size={20} />
          <div>
            <strong>Lifetime</strong>
            <span>Access</span>
          </div>
        </div>
      </section>

      {/* What You'll Learn */}
      <section className="course-section">
        <h2>WHAT YOU'LL <span className="text-primary">LEARN</span></h2>
        <div className="course-for-grid">
          <div className="course-for-card glass-panel">
            <Flame size={24} className="text-primary" />
            <h3>Elite Conditioning</h3>
            <p>Drills and routines that help build relentless stamina and mental toughness. Burn maximum calories with real boxing circuits.</p>
          </div>
          <div className="course-for-card glass-panel">
            <BookOpen size={24} className="text-primary" />
            <h3>Coordination & Footwork</h3>
            <p>Old school Soviet boxing concepts used by competitive athletes, broken down step-by-step so you can learn them safely.</p>
          </div>
          <div className="course-for-card glass-panel">
            <Shield size={24} className="text-primary" />
            <h3>Confidence You Can Feel</h3>
            <p>The same progression that helped 200+ athletes drop weight, build confidence, and completely change their routines.</p>
          </div>
        </div>
      </section>

      {/* Who This Is For */}
      <section className="course-section">
        <h2>WHO THIS IS <span className="text-primary">FOR</span></h2>
        <div className="course-who-list">
          <div className="course-who-item glass-panel">
            <CheckCircle size={20} className="text-primary" />
            <p><strong>Zero experience required.</strong> The majority of students start with absolutely no boxing background. We break down the fundamentals from the ground up.</p>
          </div>
          <div className="course-who-item glass-panel">
            <CheckCircle size={20} className="text-primary" />
            <p>People looking for a <strong>fun & new way to burn calories</strong>, build muscle, & improve confidence.</p>
          </div>
          <div className="course-who-item glass-panel">
            <CheckCircle size={20} className="text-primary" />
            <p>A <strong>beginner who wants to learn boxing</strong> without the intimidation.</p>
          </div>
        </div>
      </section>

      {/* Gear Image Break */}
      <section className="course-image-break">
        <Image src="/images/course-gear.webp" alt="Boxing training essentials" width={1200} height={600} className="course-break-img" />
      </section>

      {/* Not a Fitness Gimmick */}
      <section className="course-section course-manifesto">
        <h2>THIS IS NOT A <span className="text-primary">FITNESS GIMMICK</span></h2>
        <p className="manifesto-text">
          I don't just teach the art of boxing. I use it as the ultimate tool for total-body wellness, conditioning, and elite confidence. With a background in kinesthetics and amateur competitive experience, every drill in this course is built on proper, safe mechanics — the kind that translate outside the gym.
        </p>
      </section>

      {/* Modules */}
      <section className="course-section">
        <h2>THE <span className="text-primary">4 MODULES</span></h2>
        <div className="module-list">
          {MODULES.map((mod, i) => (
            <div
              key={mod.num}
              className={`module-item glass-panel ${openModule === i ? 'open' : ''}`}
            >
              <button
                className="module-header"
                onClick={() => setOpenModule(openModule === i ? null : i)}
                aria-expanded={openModule === i}
                aria-controls={`module-detail-${mod.num}`}
                style={{ width: '100%', background: 'none', border: 'none', textAlign: 'left', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'inherit' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                  <div className="module-num">{mod.num}</div>
                  <div className="module-info">
                    <h3>{mod.title}</h3>
                  </div>
                </div>
                {openModule === i ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              {openModule === i && (
                <div id={`module-detail-${mod.num}`} className="module-detail">
                  <p>{mod.desc}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* What's Inside */}
      <section className="course-section">
        <h2>WHAT'S <span className="text-primary">INSIDE</span></h2>
        <div className="whats-inside-list">
          {WHATS_INSIDE.map((item, i) => (
            <div key={i} className="inside-item">
              <CheckCircle size={18} className="text-primary" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Impact Image */}
      <section className="course-image-break">
        <Image src="/images/course-impact.webp" alt="Boxing glove impact" width={1200} height={600} className="course-break-img" />
      </section>

      {/* Social Proof */}
      <section className="course-section">
        <h2>WHAT FIGHTERS <span className="text-primary">SAY</span></h2>
        <div className="testimonial-grid testimonial-grid-2">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="testimonial-card glass-panel">
              <div className="testimonial-stars">
                {Array.from({ length: t.stars }).map((_, j) => (
                  <Star key={j} size={14} fill="var(--color-warning)" color="var(--color-warning)" />
                ))}
              </div>
              <p className="testimonial-text">"{t.text}"</p>
              <div className="testimonial-author">
                <strong>{t.name}</strong>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="course-section course-pricing-section">
        <h2>YOUR JOURNEY <span className="text-primary">STARTS HERE</span></h2>
        <p className="section-sub">Whether you're stepping into boxing for the first time or refining your skills, this course meets you where you are.</p>

        <div className="course-pricing-cards">
          {/* Digital Guide */}
          <div className="course-plan-card glass-panel">
            <h3>Digital Guide</h3>
            <div className="course-plan-label">Striking Blueprint</div>
            <div className="course-plan-desc">The complete technical breakdown. Generate power from the floor, fix your uppercut, and master distance.</div>
            <div className="course-plan-price">
              <span className="price-current">${GUIDE_PRICE}</span>
              <span className="price-period">one-time</span>
            </div>
            <a
              href={GUIDE_URL}
              className="course-plan-cta course-plan-cta-secondary"
              onClick={() => handleCheckoutClick('striking_blueprint', GUIDE_PRICE)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Read Now
            </a>
            <ul className="course-plan-features">
              {GUIDE_FEATURES.map((f, i) => (
                <li key={i} className={f.included ? '' : 'disabled'}>
                  {f.included ? <Check size={14} /> : <X size={14} />}
                  <span>{f.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Video Course */}
          <div className="course-plan-card course-plan-card-featured glass-panel">
            <div className="course-popular-badge">MOST POPULAR</div>
            <h3>Video Course</h3>
            <div className="course-plan-label">Boxing Blueprint</div>
            <div className="course-plan-desc">The complete fundamentals course. 4 deep-dive modules covering striking mechanics, conditioning circuits, defense, and footwork progressions.</div>
            <div className="course-plan-price">
              <span className="price-current">${COURSE_PRICE}</span>
              <span className="price-period">one-time</span>
            </div>
            <a
              href={COURSE_URL}
              className="course-plan-cta"
              onClick={() => handleCheckoutClick('boxing_blueprint', COURSE_PRICE)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <PlayCircle size={16} /> Get the Blueprint
            </a>
            <ul className="course-plan-features">
              {COURSE_FEATURES.map((f, i) => (
                <li key={i}>
                  <Check size={14} />
                  <span>{f.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="course-no-gear">No gear required to start. Just bring a good attitude.</p>
      </section>

      {/* FAQ */}
      <section className="course-section course-faq">
        <h2>QUESTIONS</h2>
        {FAQ.map((item, i) => (
          <div
            key={i}
            className={`faq-item glass-panel ${openFaq === i ? 'open' : ''}`}
          >
            <button
              className="faq-question"
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
              aria-expanded={openFaq === i}
              aria-controls={`faq-answer-${i}`}
              style={{ width: '100%', background: 'none', border: 'none', textAlign: 'left', padding: 0, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'inherit' }}
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

      {/* Repeated CTA after FAQ — high-intent readers */}
      <section className="course-section course-final-cta">
        <h2>READY TO <span className="text-primary">START?</span></h2>
        <p className="section-sub">Join 200+ athletes who trained with the Boxing Blueprint.</p>
        <a
          href={COURSE_URL}
          className="course-cta-primary"
          onClick={() => handleCheckoutClick('boxing_blueprint_bottom', COURSE_PRICE)}
          target="_blank"
          rel="noopener noreferrer"
        >
          <PlayCircle size={20} /> Get the Blueprint — ${COURSE_PRICE}
        </a>
        <span className="course-guarantee">Lifetime access · Instant delivery · No recurring fees</span>
      </section>

      {/* Coach Credit */}
      <section className="course-section course-coach-credit">
        <p>Taught by <strong>Coach Josh</strong> · <a href="https://youtube.com/@coachjoshofficial" target="_blank" rel="noopener noreferrer">YouTube</a> · <a href="https://instagram.com/coachjoshofficial" target="_blank" rel="noopener noreferrer">Instagram</a> · <a href="https://www.tiktok.com/@coachjoshofficial" target="_blank" rel="noopener noreferrer">TikTok</a></p>
        <p className="coach-location">Coach Josh Boxing · Hamden, CT</p>
      </section>

      <AdBanner format="horizontal" className="footer-ad" />
    </div>
  );
};

export default CoursePage;
