'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Crown, X } from 'lucide-react';
import { useSubscription } from '../context/SubscriptionContext';
import { safeStorage } from '../utils/safeStorage';
import './UpgradeNudge.css';

const NUDGE_KEY = 'bw_nudge_dismissed';
const COOLDOWN_DAYS = 3;

/**
 * UpgradeNudge — non-blocking banner shown after value moments.
 * Frequency-capped: max 1 per session, 3-day cooldown after dismiss.
 */
const UpgradeNudge = () => {
  const { isPro } = useSubscription();
  const [visible, setVisible] = useState(false);

  // No payment processor — hide nudge in production
  if (process.env.NODE_ENV === 'production') return null;

  useEffect(() => {
    if (isPro) return;

    try {
      const raw = safeStorage.getItem(NUDGE_KEY);
      if (raw) {
        const dismissed = new Date(raw);
        const now = new Date();
        const daysSince = (now.getTime() - dismissed.getTime()) / (1000 * 60 * 60 * 24);
        if (daysSince < COOLDOWN_DAYS) return;
      }
    } catch { /* show it */ }

    // Small delay so it doesn't flash immediately
    const timer = setTimeout(() => setVisible(true), 2000);
    return () => clearTimeout(timer);
  }, [isPro]);

  const dismiss = () => {
    setVisible(false);
    safeStorage.setItem(NUDGE_KEY, new Date().toISOString());
  };

  if (!visible || isPro) return null;

  return (
    <div className="upgrade-nudge">
      <div className="nudge-content">
        <Crown size={16} className="nudge-icon" />
        <span className="nudge-text">
          Track your progress and unlock all workouts with <strong>Pro</strong>
        </span>
        <Link href="/pricing" className="nudge-cta" onClick={dismiss}>
          See Plans
        </Link>
      </div>
      <button className="nudge-close" onClick={dismiss} aria-label="Dismiss">
        <X size={14} />
      </button>
    </div>
  );
};

export default UpgradeNudge;
