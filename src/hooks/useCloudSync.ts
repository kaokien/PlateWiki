'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import { getProfile, saveProfile as saveLocalProfile, FighterProfile } from '@/utils/fighterProfile';
import { mergeProfiles, mergeWorkoutLogs, isCloudStreakFresh } from '@/utils/profileMerge';
import { getSavedWorkouts } from '@/utils/savedWorkouts';
import { getFavorites, getHistory } from '@/utils/favorites';
import { getProgramsProgress, getWorkoutLog, getStreak } from '@/utils/storage';
import { setAuthenticated } from '@/utils/authState';

/**
 * useCloudSync — keeps localStorage in sync with Supabase.
 *
 * Architecture:
 * - On sign-in: pull cloud → localStorage (cloud is source of truth)
 * - If cloud is empty: push local to seed it
 * - On every change: push local → cloud immediately (PUT full-replace)
 * - On sign-out: clear user data from localStorage
 */

const SYNC_DEBOUNCE_MS = 1500;

const MAX_RETRIES = 3;
const BASE_RETRY_DELAY = 1000;

// ── Retry helper with exponential backoff ───────────────────────
async function withRetry<T>(fn: () => Promise<T>, label: string): Promise<T | null> {
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      return await fn();
    } catch (e) {
      const delay = BASE_RETRY_DELAY * Math.pow(2, attempt);
      console.warn(`[CloudSync] ${label} attempt ${attempt + 1}/${MAX_RETRIES} failed, retrying in ${delay}ms`, e);
      if (attempt < MAX_RETRIES - 1) {
        await new Promise(r => setTimeout(r, delay));
      }
    }
  }
  // All retries exhausted — dispatch error event for UI
  console.error(`[CloudSync] ${label} failed after ${MAX_RETRIES} attempts`);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('cloud-sync-error', { detail: { type: label } }));
  }
  return null;
}

// ── Trigger a cloud sync from anywhere ──────────────────────────
export function triggerCloudSync(type: 'profile' | 'favorites' | 'workouts') {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('cloud-sync', { detail: { type } }));
  }
}

export function useCloudSync() {
  const { user, isLoaded } = useUser();
  const syncTimerRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const hasSynced = useRef(false);

  // ── Push helpers (full-replace to cloud) ──────────────────────
  const pushProfile = useCallback(() => withRetry(async () => {
    const p = getProfile();
    const stance = typeof window !== 'undefined'
      ? localStorage.getItem('PlateWiki_stance') || 'orthodox'
      : 'orthodox';
    const programProgress = getProgramsProgress();
    const workoutLog = getWorkoutLog();
    const currentStreak = getStreak();
    const lastVisit = typeof window !== 'undefined'
      ? localStorage.getItem('PlateWiki_last_visit') || null
      : null;

    const browsingHistory = getHistory();

    const res = await fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...p, stance, programProgress, workoutLog, currentStreak, lastVisit, browsingHistory }),
    });
    if (!res.ok) throw new Error(`Profile push failed: ${res.status}`);
  }, 'profile'), []);

  const pushFavorites = useCallback(() => withRetry(async () => {
    const favs = getFavorites();
    const res = await fetch('/api/favorites', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ favorites: favs }),
    });
    if (!res.ok) throw new Error(`Favorites push failed: ${res.status}`);
  }, 'favorites'), []);

  const pushWorkouts = useCallback(() => withRetry(async () => {
    const workouts = getSavedWorkouts();
    const res = await fetch('/api/meals', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ workouts }),
    });
    if (!res.ok) throw new Error(`Workouts push failed: ${res.status}`);
  }, 'workouts'), []);

  // ── Pull from cloud → localStorage ────────────────────────────
  const pullFromCloud = useCallback(async () => {
    try {
      // Profile
      const profileRes = await fetch('/api/profile');
      if (profileRes.ok) {
        const { profile: cloud } = await profileRes.json();
        if (cloud) {
          const mapped: FighterProfile = {
            displayName: cloud.display_name || 'Fighter',
            xp: cloud.xp || 0,
            workoutsCompleted: cloud.workouts_completed || 0,
            articlesRead: cloud.articles_read || [],
            techniquesStudied: cloud.techniques_studied || [],
            quizzesCompleted: cloud.quizzes_completed || [],
            timerSessions: cloud.timer_sessions || 0,
            programDaysCompleted: cloud.program_days_completed || 0,
            longestStreak: cloud.longest_streak || 0,
            seenBadges: cloud.seen_badges || [],
            dailyAwards: cloud.daily_awards || {},
            joinedAt: cloud.joined_at || new Date().toISOString(),
          };
          // Merge, don't replace: a stale cloud snapshot must not erase XP
          // earned locally or re-open today's daily-award throttles.
          saveLocalProfile(mergeProfiles(getProfile(), mapped));

          // Restore stance
          if (cloud.stance) {
            try { localStorage.setItem('PlateWiki_stance', cloud.stance); } catch { /* ignore */ }
          }
          // Restore program progress
          if (cloud.program_progress && Object.keys(cloud.program_progress).length > 0) {
            try { localStorage.setItem('PlateWiki_programs', JSON.stringify(cloud.program_progress)); } catch { /* ignore */ }
          }
          // Restore workout log — merge cloud + local, deduplicating by id
          // and by content (same session can carry two random ids)
          if (cloud.workout_log && Array.isArray(cloud.workout_log) && cloud.workout_log.length > 0) {
            try {
              const localRaw = localStorage.getItem('PlateWiki_workout_log');
              const localLog: any[] = localRaw ? JSON.parse(localRaw) : [];
              const merged = mergeWorkoutLogs(cloud.workout_log, localLog);
              localStorage.setItem('PlateWiki_workout_log', JSON.stringify(merged));
            } catch { /* ignore */ }
          }
          // Restore current streak — only trust the cloud streak when its
          // last visit is today/yesterday; an older snapshot describes a
          // streak that has since broken and must not be resurrected.
          if (cloud.current_streak != null && cloud.current_streak > 0 && isCloudStreakFresh(cloud.last_visit)) {
            try {
              const localStreak = parseInt(localStorage.getItem('PlateWiki_streak') || '0', 10);
              if (cloud.current_streak > localStreak) {
                localStorage.setItem('PlateWiki_streak', String(cloud.current_streak));
              }
            } catch { /* ignore */ }
          }
          if (cloud.last_visit) {
            try {
              const localVisit = localStorage.getItem('PlateWiki_last_visit') || '';
              // Only overwrite if cloud visit is more recent
              if (cloud.last_visit >= localVisit) {
                localStorage.setItem('PlateWiki_last_visit', cloud.last_visit);
              }
            } catch { /* ignore */ }
          }
          // Restore browsing history — cloud replaces local
          if (cloud.browsing_history && Array.isArray(cloud.browsing_history)) {
            try {
              localStorage.setItem('PlateWiki_history', JSON.stringify(cloud.browsing_history));
            } catch { /* ignore */ }
          }
        }
      }

      // Favorites — cloud replaces local
      const favRes = await fetch('/api/favorites');
      if (favRes.ok) {
        const { favorites: cloudFavs } = await favRes.json();
        try {
          localStorage.setItem('PlateWiki_favorites', JSON.stringify(cloudFavs || []));
        } catch { /* ignore */ }
      }

      // Workouts — cloud replaces local
      const workoutRes = await fetch('/api/meals');
      if (workoutRes.ok) {
        const { workouts } = await workoutRes.json();
        if (workouts) {
          const cloudFormat = workouts.map((w: any) => ({
            id: w.id,
            title: w.title,
            duration: w.duration,
            goal: w.goal,
            level: w.level,
            equipment: w.equipment,
            drills: w.drills || [],
            gymExercises: w.gym_exercises || [],
            warmup: w.warmup || [],
            cooldown: w.cooldown || [],
            savedAt: w.saved_at,
          }));
          try {
            localStorage.setItem('PlateWiki_saved_workouts', JSON.stringify(cloudFormat));
          } catch { /* ignore */ }
        }
      }
    } catch (e) {
      console.warn('Pull from cloud failed:', e);
    }
  }, []);

  // ── Initial Sync ──────────────────────────────────────────────
  useEffect(() => {
    if (!isLoaded || !user || hasSynced.current) return;
    hasSynced.current = true;
    setAuthenticated(true);

    (async () => {
      try {
        const profileRes = await fetch('/api/profile');
        if (!profileRes.ok) return;
        const { profile: cloudProfile } = await profileRes.json();

        // Always pull cloud → localStorage (cloud is source of truth)
        if (process.env.NODE_ENV !== 'production') console.log('[CloudSync] Pulling cloud data...');
        await pullFromCloud();
        // Push local state to seed empty cloud profiles
        if (!cloudProfile) {
          await pushProfile();
          await pushFavorites();
          await pushWorkouts();
        }
        window.dispatchEvent(new Event('cloud-sync-complete'));
      } catch (e) {
        console.warn('Initial cloud sync failed:', e);
      }
    })();
  }, [isLoaded, user, pushProfile, pushFavorites, pushWorkouts, pullFromCloud]);

  // Clear user data from localStorage on sign-out
  useEffect(() => {
    if (isLoaded && !user) {
      setAuthenticated(false);
      // Clear user data keys (keep device prefs like theme, stance, voice)
      const userDataKeys = [
        'PlateWiki_fighter_profile', 'PlateWiki_favorites', 'PlateWiki_recently_viewed',
        'PlateWiki_history', 'PlateWiki_training_plan', 'PlateWiki_streak',
        'PlateWiki_last_visit', 'PlateWiki_programs', 'PlateWiki_workout_log',
        'PlateWiki_saved_workouts', 'PlateWiki_first_blood', 'PlateWiki_cloud_migrated',
        'PlateWiki_sync_nudge_dismissed', 'PlateWiki_schema_version',
      ];
      for (const key of userDataKeys) {
        try { localStorage.removeItem(key); } catch { /* ignore */ }
      }
    }
  }, [isLoaded, user]);

  // ── Event-driven sync ─────────────────────────────────────────
  const debouncedSync = useCallback((type: string) => {
    if (!user) return;

    if (syncTimerRef.current[type]) {
      clearTimeout(syncTimerRef.current[type]);
    }

    // Track what needs to be flushed on beforeunload
    pendingTypesRef.current.add(type);

    syncTimerRef.current[type] = setTimeout(() => {
      if (process.env.NODE_ENV !== 'production') console.log(`[CloudSync] Pushing ${type} to cloud...`);
      pendingTypesRef.current.delete(type);
      switch (type) {
        case 'profile': pushProfile(); break;
        case 'favorites': pushFavorites(); break;
        case 'workouts': pushWorkouts(); break;
      }
    }, SYNC_DEBOUNCE_MS);
  }, [user, pushProfile, pushFavorites, pushWorkouts]);

  const pendingTypesRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.type) {
        debouncedSync(detail.type);
      }
    };

    // Flush pending syncs before page unload to prevent data loss
    const flushHandler = () => {
      for (const type of pendingTypesRef.current) {
        clearTimeout(syncTimerRef.current[type]);
        if (process.env.NODE_ENV !== 'production') console.log(`[CloudSync] Flushing pending ${type} sync before unload...`);
        switch (type) {
          case 'profile': pushProfile(); break;
          case 'favorites': pushFavorites(); break;
          case 'workouts': pushWorkouts(); break;
        }
      }
      pendingTypesRef.current.clear();
    };

    window.addEventListener('cloud-sync', handler);
    window.addEventListener('beforeunload', flushHandler);
    return () => {
      window.removeEventListener('cloud-sync', handler);
      window.removeEventListener('beforeunload', flushHandler);
      Object.values(syncTimerRef.current).forEach(t => clearTimeout(t));
    };
  }, [debouncedSync, pushProfile, pushFavorites, pushWorkouts]);

  return { isSignedIn: !!user };
}
