'use client';

import React from 'react';
import { SignInButton } from '@clerk/nextjs';
import { Lock, LogIn } from 'lucide-react';
import './AuthGate.css';

interface AuthGateProps {
  /** What feature is gated (e.g. "Saved Favorites") */
  feature: string;
  /** Subtitle explaining the benefit */
  description?: string;
  /** 'page' = full-page overlay, 'inline' = compact banner */
  mode?: 'page' | 'inline';
}

/**
 * AuthGate — blocks access to data features for unauthenticated users.
 * Shows a sign-in prompt with Clerk's SignInButton.
 */
export default function AuthGate({ feature, description, mode = 'page' }: AuthGateProps) {
  if (mode === 'inline') {
    return (
      <div className="auth-gate-inline">
        <Lock size={14} />
        <span>Sign in to {feature.toLowerCase()}</span>
        <SignInButton mode="modal">
          <button className="auth-gate-inline__btn">Sign In</button>
        </SignInButton>
      </div>
    );
  }

  return (
    <div className="auth-gate">
      <div className="auth-gate__card glass-panel">
        <div className="auth-gate__icon">
          <Lock size={32} />
        </div>
        <h2 className="auth-gate__title">{feature}</h2>
        <p className="auth-gate__desc">
          {description || 'Create a free account to save your progress across devices.'}
        </p>

        <div className="auth-gate__features">
          <div className="auth-gate__feature">✓ Sync across all devices</div>
          <div className="auth-gate__feature">✓ Track XP and training streaks</div>
          <div className="auth-gate__feature">✓ Save favorites and workouts</div>
          <div className="auth-gate__feature">✓ Full training history</div>
        </div>

        <SignInButton mode="modal">
          <button className="auth-gate__cta">
            <LogIn size={16} />
            Sign In / Create Account
          </button>
        </SignInButton>

        <p className="auth-gate__footer">Free forever. No credit card required.</p>
      </div>
    </div>
  );
}
