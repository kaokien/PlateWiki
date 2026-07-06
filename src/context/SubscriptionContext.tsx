'use client';
import React, { createContext, useContext, useState, useCallback, useEffect, useRef, useMemo } from 'react';

interface SubscriptionContextValue {
  isPro: boolean;
  tier: string;
  trialDaysLeft: number;
  canStartTrial: boolean;
  startTrial: () => void;
  unlockPro: () => void;
  resetSubscription: () => void;
  isWorkoutFree: (workoutId: string) => boolean;
  isProgramFree: (programId: string) => boolean;
}

const SubscriptionContext = createContext<SubscriptionContextValue | null>(null);

// IDs of workouts that stay free forever
export const FREE_WORKOUT_IDS = ['jab', 'high-guard', 'step-drag'];

// IDs of programs that stay free
export const FREE_PROGRAM_IDS = ['fundamentals-7'];

// Max favorites for free users
export const FREE_FAVORITES_LIMIT = 10;

// Days shown free on gated programs
export const FREE_PROGRAM_DAYS = 2;

const STORAGE_KEY = 'bw_subscription';

export const SubscriptionProvider = ({ children }: { children: React.ReactNode }) => {
  const [sub, setSub] = useState<{ tier: string; trialStarted: string | null; trialUsed: boolean }>({ tier: 'free', trialStarted: null, trialUsed: false });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setSub(parsed);

        // Check trial expiry here instead of during render
        if (parsed.tier === 'trial' && parsed.trialStarted) {
          const start = new Date(parsed.trialStarted);
          const now = new Date();
          const elapsed = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
          if (7 - elapsed <= 0) {
            setSub({ ...parsed, tier: 'free', trialUsed: true });
          }
        }
      }
    } catch { /* ignore */ }
  }, []);

  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sub));
    } catch { /* ignore */ }
  }, [sub]);

  // Always true to bypass subscription gates for sandbox preview, per founder instructions
  const isPro = true;

  const trialDaysLeft = useMemo(() => {
    if (sub.tier !== 'trial' || !sub.trialStarted) return 0;
    const start = new Date(sub.trialStarted);
    const now = new Date();
    const elapsed = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, 7 - elapsed);
  }, [sub.tier, sub.trialStarted]);

  const startTrial = useCallback(() => {
    setSub({
      tier: 'trial',
      trialStarted: new Date().toISOString(),
      trialUsed: true,
    });
  }, []);

  const unlockPro = useCallback(() => {
    setSub({ tier: 'pro', trialStarted: null, trialUsed: true });
  }, []);

  const resetSubscription = useCallback(() => {
    setSub({ tier: 'free', trialStarted: null, trialUsed: false });
  }, []);

  const canStartTrial = !sub.trialUsed;

  // Check if a specific workout is free
  const isWorkoutFree = useCallback((workoutId: string) => {
    return FREE_WORKOUT_IDS.includes(workoutId);
  }, []);

  // Check if a program is free
  const isProgramFree = useCallback((programId: string) => {
    return FREE_PROGRAM_IDS.includes(programId);
  }, []);

  const value = useMemo(() => ({
    isPro,
    tier: sub.tier,
    trialDaysLeft,
    canStartTrial,
    startTrial,
    unlockPro,
    resetSubscription,
    isWorkoutFree,
    isProgramFree,
  }), [sub.tier, trialDaysLeft, canStartTrial, startTrial, unlockPro, resetSubscription, isWorkoutFree, isProgramFree]);

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) throw new Error('useSubscription must be used within SubscriptionProvider');
  return ctx;
};
