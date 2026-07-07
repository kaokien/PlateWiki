'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, X, Shield, Flame, Award, Leaf } from 'lucide-react';
import { useFighterProfile } from '@/context/FighterProfileContext';
import { useSubscription } from '@/context/SubscriptionContext';
import './TrialExpirationModal.css';

/**
 * TrialExpirationModal — Shows a loss-framed modal when trial is expiring.
 * Surfaces the user's specific data (streak, foods studied, avatar rank)
 * to make the loss tangible and personal.
 */
export default function TrialExpirationModal() {
  const { tier, trialDaysLeft } = useSubscription();
  const { profile, rank, streak } = useFighterProfile();
  const [dismissed, setDismissed] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only show for trial users with ≤2 days left
    if (tier !== 'trial' || trialDaysLeft > 2) return;
    // Don't re-show if dismissed this session
    try {
      if (sessionStorage.getItem('fw_trial_modal_dismissed')) return;
    } catch { /* ignore */ }
    setVisible(true);
  }, [tier, trialDaysLeft]);

  if (!visible || dismissed) return null;

  const totalStudied = profile.techniquesStudied?.length ?? 0;
  const displayName = profile.displayName || 'your avatar';
  const timeLabel = trialDaysLeft === 0 ? 'today' : trialDaysLeft === 1 ? 'tomorrow' : `in ${trialDaysLeft} days`;

  const handleDismiss = () => {
    setDismissed(true);
    try { sessionStorage.setItem('fw_trial_modal_dismissed', '1'); } catch { /* ignore */ }
  };

  return (
    <div className="trial-modal-backdrop" onClick={handleDismiss}>
      <div className="trial-modal glass-panel" onClick={(e) => e.stopPropagation()}>
        <button className="trial-modal__close" onClick={handleDismiss} aria-label="Close">
          <X size={16} />
        </button>

        <div className="trial-modal__icon">
          <AlertTriangle size={28} />
        </div>

        <h2 className="trial-modal__title">
          Your trial ends {timeLabel}
        </h2>

        <p className="trial-modal__desc">
          These will be locked when your trial expires:
        </p>

        <div className="trial-modal__losses">
          {streak > 0 && (
            <div className="trial-modal__loss">
              <Flame size={14} />
              <span>Your <strong>{streak}-day streak</strong> will freeze</span>
            </div>
          )}
          {totalStudied > 0 && (
            <div className="trial-modal__loss">
              <Leaf size={14} />
              <span><strong>{totalStudied} foods</strong> you've studied will be locked</span>
            </div>
          )}
          <div className="trial-modal__loss">
            <Award size={14} />
            <span>Your <strong>{rank.name}</strong> rank on '{displayName}' will stop progressing</span>
          </div>
          <div className="trial-modal__loss">
            <Shield size={14} />
            <span>Unlimited saves and meal prep access revoked</span>
          </div>
        </div>

        <Link href="/pricing" className="trial-modal__cta" onClick={handleDismiss}>
          Keep Everything — $2.50/mo
        </Link>

        <button className="trial-modal__skip" onClick={handleDismiss}>
          I'll lose my progress
        </button>
      </div>
    </div>
  );
}
