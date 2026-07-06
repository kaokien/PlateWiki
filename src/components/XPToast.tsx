'use client';

import React from 'react';
import { useFighterProfile } from '@/context/FighterProfileContext';
import './XPToast.css';

/**
 * Toast notification for XP and coin gains.
 * Fades in briefly when the user performs any XP-awarded action,
 * then auto-dismisses.
 */
export default function XPToast() {
  const { xpToast, clearXPToast } = useFighterProfile();

  if (!xpToast) return null;

  const labels: Record<string, string> = {
    workout_complete: 'Fueling Guide',
    program_day_complete: 'Program',
    article_read: 'Article',
    technique_studied: 'Food Profile',
    timer_session: 'Timer',
    streak_bonus: 'Streak Bonus',
    quiz_complete: 'Knowledge Check',
    dev_award: 'Dev',
    daily_login: 'Daily Login',
    challenge_complete: 'Weekly Challenge',
  };

  const isLucky = !!(xpToast as any).luckyHarvest || !!xpToast.luckyDrop;
  const showLuckyIcon = !!(xpToast as any).luckyHarvest;

  return (
    <div className={`xp-toast ${isLucky ? 'xp-toast--lucky' : ''}`} onClick={clearXPToast} role="status" aria-live="polite">
      <span className="xp-toast__amount">
        {showLuckyIcon ? '🍀 ' : ''}+{xpToast.xpGained} XP
      </span>
      {xpToast.coinsGained && (
        <>
          <span className="xp-toast__divider">·</span>
          <span className="xp-toast__coins">+{xpToast.coinsGained} 🌱</span>
        </>
      )}
      <span className="xp-toast__label">
        {xpToast.luckyDrop 
          ? '🍀 Lucky Drop! 2x' 
          : (xpToast as any).luckyHarvest 
            ? 'Lucky Harvest! 2x' 
            : (labels[xpToast.source] || 'Bonus')}
      </span>
    </div>
  );
}
