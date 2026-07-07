import React, { useState } from 'react';
import { Mail, CheckCircle } from 'lucide-react';
import { analytics } from '../utils/analytics';
import './EmailCapture.css';

const EmailCapture = ({ location = 'homepage' }: { location?: string }) => {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState('');
  
  const isProfile = location === 'fighter_profile';

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) return;
    analytics.newsletterCta(location);
    // TODO: POST to your email provider (Mailchimp, ConvertKit, etc.)
    // fetch('/api/subscribe', { method: 'POST', body: JSON.stringify({ email }) });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="email-capture glass-panel submitted" role="status" aria-live="polite">
        <CheckCircle size={32} className="text-primary success-icon-pop" />
        <h3>{isProfile ? 'Profile Backed Up! 🥊' : "You're in! 🥊"}</h3>
        <p>
          {isProfile 
            ? "Your training stats are synced to your inbox. We'll also keep you updated with new drills."
            : "We'll send you athletic nutrition tips, new techniques, and training plans. No spam, ever."}
        </p>
      </div>
    );
  }

  return (
    <div className="email-capture glass-panel">
      <div className="email-capture-content">
        <div className="email-icon-wrap">
          <Mail size={24} className="text-primary" />
        </div>
        <h3>{isProfile ? 'Back Up Your Stats' : 'Join the Athletic Nutrition Lab'}</h3>
        <p>
          {isProfile 
            ? 'Save your XP, level, and workout history. Never lose your local training progress.'
            : 'Weekly technique breakdowns, training plans, and drills. Straight to you.'}
        </p>
        <form className="email-form" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="your@email.com"
            className="email-input"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-label="Email address for stats backup"
          />
          <button type="submit" className="email-btn">
            {isProfile ? 'Back Up Stats' : 'Join the Lab'}
          </button>
        </form>
        <span className="email-fine-print">Free forever. Unsubscribe anytime.</span>
      </div>
    </div>
  );
};

export default EmailCapture;
