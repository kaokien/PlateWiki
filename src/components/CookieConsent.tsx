'use client';
import React, { useState, useEffect } from 'react';
import { safeStorage } from '@/utils/safeStorage';
import './CookieConsent.css';

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = safeStorage.getItem('bw_cookie_consent');
    if (!consent) {
      // Delay so it doesn't fight with page load
      const timer = setTimeout(() => setVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    safeStorage.setItem('bw_cookie_consent', 'accepted');
    setVisible(false);
    if (typeof window !== 'undefined') {
      window['ga-disable-G-BXS6C3GE6C'] = false;
      if (window.gtag) {
        window.gtag('consent', 'update', {
          'ad_storage': 'granted',
          'ad_user_data': 'granted',
          'ad_personalization': 'granted',
          'analytics_storage': 'granted'
        });
      }
    }
  };

  const handleDecline = () => {
    safeStorage.setItem('bw_cookie_consent', 'declined');
    setVisible(false);
    if (typeof window !== 'undefined') {
      window['ga-disable-G-BXS6C3GE6C'] = true;
      if (window.gtag) {
        window.gtag('consent', 'update', {
          'ad_storage': 'denied',
          'ad_user_data': 'denied',
          'ad_personalization': 'denied',
          'analytics_storage': 'denied'
        });
      }
    }
  };

  if (!visible) return null;

  return (
    <div className="cookie-banner" role="dialog" aria-label="Cookie consent">
      <div className="cookie-content">
        <p>
          We use cookies to track what works and show relevant ads.{' '}
          <a href="/privacy">Privacy policy</a>
        </p>
        <div className="cookie-actions">
          <button className="cookie-btn cookie-decline" onClick={handleDecline}>
            Decline
          </button>
          <button className="cookie-btn cookie-accept" onClick={handleAccept}>
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
