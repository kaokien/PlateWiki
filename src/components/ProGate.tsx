'use client';
import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import { Lock, Zap, X } from 'lucide-react';
import { useSubscription } from '../context/SubscriptionContext';
import { useFocusTrap } from '../hooks/useFocusTrap';
import './ProGate.css';

interface ProGateProps {
  /** Label for what's being locked (e.g. "Gym Workout") */
  feature: string;
  /** One-line description of the locked content */
  description?: string;
  /** Preview content shown behind the blur */
  children: React.ReactNode;
}

/**
 * ProGate — wraps locked content with a soft paywall overlay.
 *
 * @param {string} feature — label for what's being locked (e.g. "Gym Workout")
 * @param {string} description — one-line description of the locked content
 * @param {React.ReactNode} children — preview content shown behind the blur
 */
const ProGate = ({ feature, description, children }: ProGateProps) => {
  const { isPro, canStartTrial, startTrial } = useSubscription();
  const [showModal, setShowModal] = useState(false);

  const closeModal = useCallback(() => setShowModal(false), []);
  const modalRef = useFocusTrap(showModal, closeModal);

  // No payment processor wired yet — unlock everything in production
  if (process.env.NODE_ENV === 'production') return children;

  if (isPro) return children;

  const handleUnlock = () => {
    if (canStartTrial) {
      startTrial();
    }
    setShowModal(false);
  };

  const handleWrapperKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setShowModal(true);
    }
  };

  return (
    <>
      <div
        className="pro-gate-wrapper"
        role="button"
        tabIndex={0}
        onClick={() => setShowModal(true)}
        onKeyDown={handleWrapperKeyDown}
      >
        <div className="pro-gate-preview">
          {children}
        </div>
        <div className="pro-gate-overlay">
          <Lock size={20} />
          <span>PRO</span>
        </div>
      </div>

      {showModal && (
        <div
          className="pro-gate-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="pro-gate-modal-title"
          onClick={closeModal}
        >
          <div ref={modalRef} className="pro-gate-modal" onClick={e => e.stopPropagation()}>
            <button className="pro-gate-close" onClick={closeModal} aria-label="Close">
              <X size={18} />
            </button>

            <div className="pro-gate-icon">
              <Lock size={24} />
            </div>

            <h3 className="pro-gate-title" id="pro-gate-modal-title">
              {feature}
            </h3>

            {description && (
              <p className="pro-gate-desc">{description}</p>
            )}

            <div className="pro-gate-perks">
              <div className="pro-gate-perk">
                <Zap size={14} /> All 25+ gym workouts
              </div>
              <div className="pro-gate-perk">
                <Zap size={14} /> Full program access
              </div>
              <div className="pro-gate-perk">
                <Zap size={14} /> Workout tracking & history
              </div>
            </div>

            {canStartTrial ? (
              <button className="pro-gate-cta" onClick={handleUnlock}>
                Start 7-Day Free Trial
              </button>
            ) : (
              <Link href="/pricing" className="pro-gate-cta" onClick={closeModal}>
                View Pro Plans
              </Link>
            )}

            <button className="pro-gate-dismiss" onClick={closeModal}>
              Not now — keep browsing
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ProGate;
