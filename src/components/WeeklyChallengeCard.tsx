'use client';

import { useState, useEffect, useCallback } from 'react';
import { CheckCircle, Shield } from 'lucide-react';
import { useFighterProfile } from '@/context/FighterProfileContext';
import {
  getCurrentChallenge,
  getChallengeProgress,
  getChallengeRewardClaimed,
  claimChallengeReward,
  isChallengeComplete,
  getChallengeWeekStart,
} from '@/data/weeklyChallenges';
import type { WeeklyChallenge } from '@/data/weeklyChallenges';
import { addStreakFreeze } from '@/utils/storage';
import './WeeklyChallengeCard.css';

function getDaysRemaining(): number {
  const weekStart = getChallengeWeekStart();
  const start = new Date(weekStart + 'T00:00:00');
  const end = new Date(start);
  end.setDate(start.getDate() + 7);
  const now = new Date();
  const diff = end.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / 86400000));
}

export default function WeeklyChallengeCard() {
  const { awardXP } = useFighterProfile();
  const [challenge, setChallenge] = useState<WeeklyChallenge | null>(null);
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [claimed, setClaimed] = useState(false);
  const [daysLeft, setDaysLeft] = useState(7);

  useEffect(() => {
    setChallenge(getCurrentChallenge());
    setProgress(getChallengeProgress());
    setClaimed(getChallengeRewardClaimed());
    setDaysLeft(getDaysRemaining());
  }, []);

  // Re-check progress on window focus (user may have completed something in another tab/page)
  useEffect(() => {
    function handleFocus() {
      setProgress(getChallengeProgress());
      setClaimed(getChallengeRewardClaimed());
    }
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const handleClaim = useCallback(() => {
    if (!challenge) return;
    claimChallengeReward();
    // Award the challenge's actual XP reward (button advertises this amount)
    awardXP('challenge_complete', { xpAmount: challenge.xpReward });
    // Award 1 streak freeze
    addStreakFreeze();
    
    // Dispatch event to refresh profile states across other components
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cloud-sync-complete'));
    }
    
    setClaimed(true);
  }, [challenge, awardXP]);

  if (!challenge) return null;

  const complete = isChallengeComplete(challenge, progress);

  return (
    <div className="weekly-challenge glass-panel">
      {/* Header */}
      <div className="weekly-challenge__header">
        <span className="weekly-challenge__emoji">{challenge.emoji}</span>
        <div className="weekly-challenge__title-group">
          <span className="weekly-challenge__label">Weekly Challenge</span>
          <span className="weekly-challenge__name">{challenge.name}</span>
        </div>
      </div>

      {/* Requirements */}
      <div className="weekly-challenge__reqs">
        {challenge.requirements.map((req) => {
          const current = Math.min(progress[req.type] || 0, req.count);
          const pct = Math.round((current / req.count) * 100);
          const done = current >= req.count;

          return (
            <div key={req.type} className="weekly-challenge__req">
              <div className="weekly-challenge__req-info">
                <span className="weekly-challenge__req-label">{req.label}</span>
                <span className={`weekly-challenge__req-count${done ? ' weekly-challenge__req-count--done' : ''}`}>
                  {current}/{req.count}
                </span>
              </div>
              <div className="weekly-challenge__bar">
                <div
                  className={`weekly-challenge__bar-fill${done ? ' weekly-challenge__bar-fill--complete' : ''}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="weekly-challenge__footer">
        {complete && !claimed && (
          <button className="weekly-challenge__claim-btn" onClick={handleClaim} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
            Claim +{challenge.xpReward} XP & <Shield size={14} /> Freeze
          </button>
        )}
        {complete && claimed && (
          <div className="weekly-challenge__completed">
            <CheckCircle />
            Completed!
          </div>
        )}
        {!complete && (
          <span className="weekly-challenge__remaining">
            {daysLeft} day{daysLeft !== 1 ? 's' : ''} remaining
          </span>
        )}
      </div>
    </div>
  );
}
