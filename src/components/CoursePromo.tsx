import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PlayCircle, ArrowRight } from 'lucide-react';
import { analytics } from '../utils/analytics';
import './CoursePromo.css';

/**
 * Inline course upsell component. Drop this on any page to promote
 * The Boxing Blueprint course. Tracks clicks via GA4.
 *
 * @param {string} location - Page placement for analytics (e.g. 'homepage', 'technique_page')
 * @param {string} variant - 'banner' (wide) or 'card' (compact). Default: 'banner'
 */
const CoursePromo = ({ location = 'unknown', variant = 'banner' }) => {
  const handleClick = () => {
    analytics.customEvent('course_promo_click', {
      event_category: 'monetization',
      location,
      variant,
    });
  };

  if (variant === 'card') {
    return (
      <Link href="/course" className="course-promo-card glass-panel" onClick={handleClick}>
        <div className="promo-card-icon">
          <PlayCircle size={28} />
        </div>
        <div className="promo-card-text">
          <span className="promo-label">VIDEO COURSE</span>
          <h3>The Boxing Blueprint</h3>
          <p>4 deep-dive modules. Real boxing, not cardio kickboxing.</p>
        </div>
        <ArrowRight size={16} className="promo-card-arrow" />
      </Link>
    );
  }

  return (
    <div className="course-promo-banner glass-panel">
      <div className="promo-banner-bg">
        <Image src="/images/course-impact.webp" alt="" aria-hidden="true" fill className="promo-banner-img" />
        <div className="promo-banner-overlay" />
      </div>
      <div className="promo-banner-content">
        <span className="promo-label">VIDEO COURSE</span>
        <h3>STOP DOING CARDIO KICKBOXING. <span className="text-primary">LEARN THE REAL THING.</span></h3>
        <p>The complete fundamentals course. 4 deep-dive modules covering striking mechanics, conditioning, defense, and footwork. Featured on PlateWiki.</p>
        <Link href="/course" className="promo-banner-cta" onClick={handleClick}>
          <PlayCircle size={16} /> View Boxing Blueprint <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
};

export default CoursePromo;
