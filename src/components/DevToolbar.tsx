'use client';
import React, { useState } from 'react';
import { useSubscription } from '../context/SubscriptionContext';
import { useFighterProfile } from '../context/FighterProfileContext';
import { Bug, X, Crown, User, Clock, Zap, RotateCcw } from 'lucide-react';

/**
 * DevToolbar — floating debug panel for toggling subscription states.
 * Only renders in development (import.meta.env.DEV).
 */
const DevToolbar = () => {
  const [open, setOpen] = useState(false);
  const { tier, isPro, trialDaysLeft, canStartTrial, unlockPro, startTrial, resetSubscription } = useSubscription();
  const { profile, rank, awardXP, resetProfile } = useFighterProfile();

  if (process.env.NODE_ENV === 'production') return null;

  const tierColor = {
    free: '#888',
    trial: '#f5a623',
    pro: '#4ade80',
  }[tier] || '#888';

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        aria-label="Toggle dev toolbar"
        style={{
          position: 'fixed',
          bottom: '4.5rem',
          right: '1rem',
          zIndex: 9999,
          width: 36,
          height: 36,
          borderRadius: '50%',
          border: `2px solid ${tierColor}`,
          background: 'rgba(0,0,0,0.8)',
          color: tierColor,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.75rem',
          fontWeight: 800,
        }}
      >
        <Bug size={16} />
      </button>

      {open && (
        <div style={{
          position: 'fixed',
          bottom: '5.5rem',
          right: '1rem',
          zIndex: 9999,
          background: '#111',
          border: '1px solid #333',
          borderRadius: '0.75rem',
          padding: '1rem',
          width: 220,
          fontFamily: 'monospace',
          fontSize: '0.75rem',
          color: '#ccc',
          boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontWeight: 700, color: '#fff', fontSize: '0.8rem' }}>DEV TOOLBAR</span>
            <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}>
              <X size={14} />
            </button>
          </div>

          <div style={{ marginBottom: '0.75rem', padding: '0.5rem', background: '#1a1a1a', borderRadius: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
              {isPro ? <Crown size={12} style={{ color: '#f5a623' }} /> : <User size={12} />}
              <span style={{ color: tierColor, fontWeight: 700, textTransform: 'uppercase' }}>{tier}</span>
            </div>
            {tier === 'trial' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.7rem', color: '#f5a623' }}>
                <Clock size={10} /> {trialDaysLeft} days left
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <button onClick={resetSubscription} style={btnStyle('#666')}>
              Set FREE
            </button>
            <button onClick={startTrial} disabled={!canStartTrial} style={btnStyle('#f5a623', !canStartTrial)}>
              Start TRIAL
            </button>
            <button onClick={unlockPro} style={btnStyle('#4ade80')}>
              Set PRO
            </button>
          </div>

          {/* Fighter Profile Section */}
          <div style={{ marginTop: '0.75rem', borderTop: '1px solid #333', paddingTop: '0.75rem' }}>
            <div style={{ marginBottom: '0.5rem', padding: '0.5rem', background: '#1a1a1a', borderRadius: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
                <span>{rank.emoji}</span>
                <span style={{ color: rank.color, fontWeight: 700, textTransform: 'uppercase' }}>{rank.name}</span>
              </div>
              <div style={{ fontSize: '0.7rem', color: '#888' }}>{profile.xp} XP</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <button onClick={() => awardXP('dev_award')} style={btnStyle('#ffd700')}>
                <Zap size={10} /> +100 XP
              </button>
              <button onClick={resetProfile} style={btnStyle('#ef4444')}>
                <RotateCcw size={10} /> Reset Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const btnStyle = (color: string, disabled = false) => ({
  padding: '0.4rem 0.6rem',
  background: disabled ? '#222' : 'transparent',
  border: `1px solid ${disabled ? '#333' : color}`,
  borderRadius: '0.35rem',
  color: disabled ? '#444' : color,
  fontWeight: 700,
  fontSize: '0.7rem',
  textTransform: 'uppercase',
  cursor: disabled ? 'not-allowed' : 'pointer',
  fontFamily: 'monospace',
  letterSpacing: '0.5px',
});

export default DevToolbar;
