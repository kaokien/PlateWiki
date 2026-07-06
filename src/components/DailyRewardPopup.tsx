'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Zap, Check, Lock, X } from 'lucide-react';
import { getDailyRewardState, claimDailyReward, DAILY_REWARDS } from '@/utils/dailyRewards';
import { useFighterProfile } from '@/context/FighterProfileContext';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import './DailyRewardPopup.css';

export default function DailyRewardPopup() {
  const { awardXP } = useFighterProfile();
  const [isOpen, setIsOpen] = useState(false);
  const [state, setState] = useState(() => getDailyRewardState());
  const modalRef = useFocusTrap(isOpen, () => setIsOpen(false));

  useEffect(() => {
    // Check if user has an unclaimed reward today
    const currentState = getDailyRewardState();
    setState(currentState);

    if (!currentState.claimed) {
      // Delay popup by 1 second for a less intrusive entry
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClaim = useCallback(() => {
    const currentState = getDailyRewardState();
    if (currentState.claimed) return;

    // First call claimDailyReward to record the claim in storage
    const xpReward = claimDailyReward();
    if (xpReward > 0) {
      // Award the XP using the profile context
      awardXP('daily_login');
      // Update local component state
      setState(getDailyRewardState());
      // Dismiss popup after a short celebration delay
      setTimeout(() => {
        setIsOpen(false);
      }, 1500);
    }
  }, [awardXP]);

  if (!isOpen) return null;

  return (
    <div className="dr-backdrop" onClick={() => setIsOpen(false)} role="dialog" aria-modal="true" aria-labelledby="dr-title">
      <div ref={modalRef} className="dr-modal glass-panel" onClick={(e) => e.stopPropagation()}>
        <button className="dr-close" onClick={() => setIsOpen(false)} aria-label="Close daily rewards">
          <X size={16} />
        </button>

        <div className="dr-header">
          <Zap className="dr-zap-icon animate-pulse" size={24} color="#ffd700" />
          <h2 id="dr-title" className="dr-title">Daily Rewards</h2>
          <p className="dr-subtitle">Train consecutive days to earn larger XP boosts!</p>
        </div>

        <div className="dr-calendar">
          {DAILY_REWARDS.map((reward, i) => {
            const isPast = i < state.day;
            const isCurrent = i === state.day;
            const isClaimedCurrent = isCurrent && state.claimed;
            const isFuture = i > state.day;

            let dayClass = 'dr-day';
            if (isPast) dayClass += ' dr-day--past';
            if (isCurrent && !state.claimed) dayClass += ' dr-day--current';
            if (isClaimedCurrent) dayClass += ' dr-day--claimed';
            if (isFuture) dayClass += ' dr-day--future';

            return (
              <div key={i} className={dayClass}>
                <span className="dr-day-num">Day {i + 1}</span>
                <div className="dr-day-circle">
                  {isPast || isClaimedCurrent ? (
                    <Check size={16} className="dr-check-icon" />
                  ) : isFuture ? (
                    <Lock size={12} className="dr-lock-icon" />
                  ) : (
                    <span className="dr-xp-val">+{reward}</span>
                  )}
                </div>
                {!isPast && !isClaimedCurrent && <span className="dr-day-xp">+{reward} XP</span>}
                {(isPast || isClaimedCurrent) && <span className="dr-day-status">Claimed</span>}
              </div>
            );
          })}
        </div>

        <div className="dr-action">
          {!state.claimed ? (
            <button className="dr-claim-btn" onClick={handleClaim}>
              Claim Day {state.day + 1} Reward
            </button>
          ) : (
            <div className="dr-claimed-msg">
              <Check size={18} color="#22c55e" />
              <span>Reward Claimed! Come back tomorrow.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
