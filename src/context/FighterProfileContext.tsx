'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, useRef, useMemo } from 'react';
import {
  getProfile,
  saveProfile,
  createDefaultProfile,
  awardXP as awardXPUtil,
  updateStreak,
  setDisplayName as setDisplayNameUtil,
  resetProfile as resetProfileUtil,
  getRankForXP,
  getNextRankThreshold,
  detectFightingStyle,
  spendCoins as spendCoinsUtil,
  type FighterProfile,
  type XPSource,
  type XPAwardResult,
  type RankTier,
} from '@/utils/fighterProfile';
import { trackDailyVisit, getStreak } from '@/utils/storage';
import { safeStorage } from '@/utils/safeStorage';
import { getNewlyUnlockedBadges, type Badge } from '@/utils/badges';
import { isAuthenticated, setAuthenticated } from '@/utils/authState';
import { useUser } from '@clerk/nextjs';
import { incrementChallengeProgress } from '@/data/weeklyChallenges';

interface FighterProfileContextValue {
  profile: FighterProfile;
  rank: RankTier;
  nextRankInfo: { nextRank: RankTier | null; xpNeeded: number; progress: number };
  streak: number;
  fightingStyle: string;
  awardXP: (source: XPSource, meta?: { articleId?: string; techniqueId?: string; xpAmount?: number }) => XPAwardResult;
  setDisplayName: (name: string) => void;
  setTrainingGoal: (goal: 'speed' | 'power' | 'stamina' | 'defense') => void;
  resetProfile: () => void;
  spendCoins: (amount: number) => boolean;
  /** Most recent rank-up event, consumed by the RankUpModal */
  rankUpEvent: { oldRank: RankTier; newRank: RankTier } | null;
  clearRankUpEvent: () => void;
  /** Most recent XP toast, consumed by the XPToast component */
  xpToast: { xpGained: number; source: XPSource; luckyHarvest?: boolean; coinsGained?: number; luckyDrop?: boolean; rankBonusCoins?: number } | null;
  clearXPToast: () => void;
  /** First Blood event — fires once, ever, on first XP earn */
  firstBloodEvent: boolean;
  clearFirstBloodEvent: () => void;
  /** Badge unlock event — consumed by BadgeUnlockToast */
  badgeUnlockEvent: Badge | null;
  clearBadgeUnlockEvent: () => void;
}

const FighterProfileContext = createContext<FighterProfileContextValue | null>(null);

export function FighterProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<FighterProfile>(createDefaultProfile);
  const [streak, setStreak] = useState(0);
  const [rankUpEvent, setRankUpEvent] = useState<{ oldRank: RankTier; newRank: RankTier } | null>(null);
  const [xpToast, setXPToast] = useState<{ xpGained: number; source: XPSource; luckyHarvest?: boolean; coinsGained?: number; luckyDrop?: boolean; rankBonusCoins?: number } | null>(null);
  const [firstBloodEvent, setFirstBloodEvent] = useState(false);
  const [badgeUnlockEvent, setBadgeUnlockEvent] = useState<Badge | null>(null);
  const initializedRef = useRef(false);
  const { isSignedIn } = useUser();

  // Load the profile (and check the Night Owl badge window) on mount
  useEffect(() => {
    // Check Night Owl badge unlock (midnight to 4 AM)
    const hours = new Date().getHours();
    let nightOwlTriggered = false;
    if (hours >= 0 && hours < 4) {
      try {
        if (!localStorage.getItem('FoodWiki_badge_night_owl')) {
          localStorage.setItem('FoodWiki_badge_night_owl', 'true');
          nightOwlTriggered = true;
        }
      } catch { /* ignore */ }
    }

    // Load actual profile
    const loadedProfile = getProfile();
    if (nightOwlTriggered) {
      (loadedProfile as any).nightOwlUnlocked = true;
    }
    setProfile(loadedProfile);
  }, []);

  // Track the daily visit + streak once Clerk confirms the session.
  //
  // This must NOT run on bare mount: trackDailyVisit() no-ops unless the
  // module-level auth flag (utils/authState) is set, and that flag is only
  // raised asynchronously after Clerk loads. Tracking on mount raced Clerk
  // and silently dropped the visit, leaving the streak stuck at 0. (The old
  // homepage DailyWidget used to mask this by re-tracking later — signed-in
  // users now go straight to /dashboard, which has no such retry.)
  useEffect(() => {
    if (!isSignedIn || initializedRef.current) return;
    initializedRef.current = true;

    // Open the utility-write gate before tracking. Idempotent — useCloudSync
    // sets the same flag from the same Clerk signal.
    setAuthenticated(true);

    const currentStreak = trackDailyVisit();
    setStreak(currentStreak);

    // Check for 7-day streak bonus
    const streakResult = updateStreak(currentStreak);
    let finalProfile = getProfile();
    setProfile(finalProfile);
    if (streakResult?.awarded) {
      setXPToast({
        xpGained: streakResult.xpGained,
        source: 'streak_bonus',
        luckyHarvest: streakResult.luckyHarvest,
        coinsGained: streakResult.coinsGained,
        luckyDrop: streakResult.luckyDrop,
        rankBonusCoins: streakResult.rankBonusCoins,
      });
      if (streakResult.rankChanged) {
        setRankUpEvent({ oldRank: streakResult.oldRank, newRank: streakResult.newRank });
      }
    }

    // Badge detection (covers night owl, streak milestone badges, etc.)
    const newBadges = getNewlyUnlockedBadges(finalProfile, finalProfile.seenBadges || []);
    if (newBadges.length > 0) {
      setBadgeUnlockEvent(newBadges[0]);
      try {
        finalProfile = { ...finalProfile, seenBadges: [...(finalProfile.seenBadges || []), ...newBadges.map(b => b.id)] };
        localStorage.setItem('FoodWiki_fighter_profile', JSON.stringify(finalProfile));
      } catch { /* ignore */ }
    }
  }, [isSignedIn]);

  // Re-read profile + streak when cloud sync completes (pulls cloud data to
  // localStorage — including a restored FoodWiki_streak from another device)
  useEffect(() => {
    const handler = () => {
      const refreshed = getProfile();
      setProfile(refreshed);
      setStreak(getStreak());
    };
    window.addEventListener('cloud-sync-complete', handler);
    return () => window.removeEventListener('cloud-sync-complete', handler);
  }, []);

  const rank = useMemo(() => getRankForXP(profile.xp), [profile.xp]);
  const nextRankInfo = useMemo(() => getNextRankThreshold(profile.xp), [profile.xp]);
  const fightingStyle = useMemo(() => detectFightingStyle(profile), [profile]);

  const awardXP = useCallback((source: XPSource, meta?: { articleId?: string; techniqueId?: string; xpAmount?: number }) => {
    const result = awardXPUtil(source, meta);

    // Track weekly challenge progress. Runs for awarded XP AND for id-deduped
    // repeats ("already studied/read") — challenges count unique items per
    // week, so revisiting a technique studied long ago still advances them.
    // Daily-throttled repeats ("Already earned today") don't count.
    try {
      const uniqueId = meta?.articleId ?? meta?.techniqueId;
      // a dedupe rejection carries a reason; a signed-out rejection carries none
      const isDedupedRepeat = !!uniqueId && !!result.reason && result.reason !== 'Already earned today';
      if (result.awarded || isDedupedRepeat) {
        incrementChallengeProgress(source, uniqueId);
      }
    } catch { /* ignore */ }

    if (result.awarded) {
      const updatedProfile = getProfile();
      setProfile(updatedProfile);
      setXPToast({
        xpGained: result.xpGained,
        source,
        luckyHarvest: result.luckyHarvest,
        coinsGained: result.coinsGained,
        luckyDrop: result.luckyDrop,
        rankBonusCoins: result.rankBonusCoins,
      });

      // First Blood — one-time event for first-ever XP earn.
      // Derive "first ever" from the profile itself (newXP === xpGained means
      // XP was 0 before this award): the profile is cloud-synced, so an
      // established user never re-triggers this even if the local flag was
      // wiped (sign-out cleanup, cleared storage). The flag remains as a
      // same-session guard.
      try {
        const isFirstEverXP = result.newXP === result.xpGained;
        if (isFirstEverXP && !safeStorage.getItem('FoodWiki_first_blood')) {
          safeStorage.setItem('FoodWiki_first_blood', 'true');
          setFirstBloodEvent(true);
        }
      } catch { /* storage unavailable */ }

      if (result.rankChanged) {
        setRankUpEvent({ oldRank: result.oldRank, newRank: result.newRank });
      }

      // Badge detection — check for newly unlocked badges
      const newBadges = getNewlyUnlockedBadges(updatedProfile, updatedProfile.seenBadges || []);
      if (newBadges.length > 0) {
        // Show the first new badge (queue others for next action)
        setBadgeUnlockEvent(newBadges[0]);
        // Mark all new badges as seen
        try {
          const p = getProfile();
          p.seenBadges = [...(p.seenBadges || []), ...newBadges.map(b => b.id)];
          if (isAuthenticated()) {
            localStorage.setItem('FoodWiki_fighter_profile', JSON.stringify(p));
          }
        } catch { /* storage unavailable */ }
      }
    }

    return result;
  }, []);

  const setDisplayName = useCallback((name: string) => {
    setDisplayNameUtil(name);
    setProfile(getProfile());
  }, []);

  const setTrainingGoal = useCallback((goal: 'speed' | 'power' | 'stamina' | 'defense') => {
    const p = getProfile();
    p.trainingGoal = goal;
    saveProfile(p);
    setProfile(p);
  }, []);

  const resetProfileAction = useCallback(() => {
    resetProfileUtil();
    setProfile(getProfile());
    setRankUpEvent(null);
    setXPToast(null);
  }, []);

  const spendCoins = useCallback((amount: number) => {
    const success = spendCoinsUtil(amount);
    if (success) {
      setProfile(getProfile());
    }
    return success;
  }, []);

  const clearRankUpEvent = useCallback(() => setRankUpEvent(null), []);
  const clearXPToast = useCallback(() => setXPToast(null), []);
  const clearFirstBloodEvent = useCallback(() => setFirstBloodEvent(false), []);
  const clearBadgeUnlockEvent = useCallback(() => setBadgeUnlockEvent(null), []);

  const value = useMemo(() => ({
    profile,
    rank,
    nextRankInfo,
    streak,
    fightingStyle,
    awardXP,
    setDisplayName,
    setTrainingGoal,
    resetProfile: resetProfileAction,
    spendCoins,
    rankUpEvent,
    clearRankUpEvent,
    xpToast,
    clearXPToast,
    firstBloodEvent,
    clearFirstBloodEvent,
    badgeUnlockEvent,
    clearBadgeUnlockEvent,
  }), [profile, rank, nextRankInfo, streak, fightingStyle, awardXP, setDisplayName, setTrainingGoal, resetProfileAction, spendCoins, rankUpEvent, clearRankUpEvent, xpToast, clearXPToast, firstBloodEvent, clearFirstBloodEvent, badgeUnlockEvent, clearBadgeUnlockEvent]);

  return (
    <FighterProfileContext.Provider value={value}>
      {children}
    </FighterProfileContext.Provider>
  );
}

export function useFighterProfile() {
  const ctx = useContext(FighterProfileContext);
  if (!ctx) throw new Error('useFighterProfile must be used within FighterProfileProvider');
  return ctx;
}
