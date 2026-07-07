/**
 * Utility functions for interacting with browser localStorage
 * Used to track user progress, streaks, and program completions entirely on the client side.
 */
import { isAuthenticated } from './authState';
import { localDateString, daysBetween } from './localDate';

const KEYS = {
  STREAK: 'PlateWiki_streak',
  LAST_VISIT: 'PlateWiki_last_visit',
  PROGRAMS: 'PlateWiki_programs', // Stores progress for programs
};

// --- Streak Tracking ---

export const trackDailyVisit = () => {
  if (!isAuthenticated()) return 0;
  try {
    // Local calendar date — streaks are "per day" from the user's
    // perspective, not per UTC day
    const today = localDateString();
    const lastVisit = localStorage.getItem(KEYS.LAST_VISIT);
    let streak = parseInt(localStorage.getItem(KEYS.STREAK) || '0', 10);

    if (lastVisit === today) {
      // Already visited today, do nothing
      return streak;
    }

    if (lastVisit) {
      const diffDays = daysBetween(lastVisit, today);

      if (diffDays === 1) {
        // Consecutive day
        streak += 1;
      } else if (diffDays <= 0) {
        // Stored date is today-or-later under a different date basis
        // (legacy UTC-dated visits) — treat as already visited, keep streak
        localStorage.setItem(KEYS.LAST_VISIT, today);
        return streak;
      } else {
        // Streak broken — check for streak freeze
        if (streak > 0) {
          const used = tryConsumeStreakFreeze();
          if (used) {
            // Freeze consumed — streak preserved (don't increment, just don't reset)
            // Emit event for UI to show "freeze used" notification
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('streak-freeze-used'));
            }
          } else {
            streak = 1;
          }
        } else {
          streak = 1;
        }
      }
    } else {
      // First ever visit
      streak = 1;
    }

    localStorage.setItem(KEYS.LAST_VISIT, today);
    localStorage.setItem(KEYS.STREAK, streak.toString());
    return streak;
  } catch (e) {
    console.warn('LocalStorage is not available:', e);
    return 0;
  }
};

export const getStreak = () => {
  try {
    return parseInt(localStorage.getItem(KEYS.STREAK) || '0', 10);
  } catch (e) {
    return 0;
  }
};

// ── Streak Freeze Helpers ──

const PROFILE_KEY = 'PlateWiki_fighter_profile';
const MAX_FREEZES = 3;

/** Try to consume a streak freeze. Returns true if one was used. */
function tryConsumeStreakFreeze(): boolean {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return false;
    const profile = JSON.parse(raw);
    const freezes = profile.streakFreezes || 0;
    if (freezes <= 0) return false;
    profile.streakFreezes = freezes - 1;
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    return true;
  } catch {
    return false;
  }
}

/** Award a streak freeze (max 3 stored). Returns new freeze count. */
export function addStreakFreeze(): number {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return 0;
    const profile = JSON.parse(raw);
    const current = profile.streakFreezes || 0;
    profile.streakFreezes = Math.min(current + 1, MAX_FREEZES);
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    return profile.streakFreezes;
  } catch {
    return 0;
  }
}

/** Get current streak freeze count. */
export function getStreakFreezes(): number {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return 0;
    return JSON.parse(raw).streakFreezes || 0;
  } catch {
    return 0;
  }
}

// --- Program Progress Tracking ---

export interface ProgramProgress {
  currentDay: number;
  completedDays: number[];
  startDate: string;
}

/**
 * Get all program progress
 * @returns {Object} { 'program-id': { currentDay: 1, completedDays: [1, 2], startDate: '...' } }
 */
export const getProgramsProgress = (): Record<string, ProgramProgress> => {
  try {
    const data = localStorage.getItem(KEYS.PROGRAMS);
    return data ? JSON.parse(data) : {};
  } catch (e) {
    return {};
  }
};

export const getProgramProgress = (programId: string) => {
  const allProgress = getProgramsProgress();
  return allProgress[programId] || null;
};

export const startProgram = (programId: string) => {
  if (!isAuthenticated()) return;
  try {
    const allProgress = getProgramsProgress();
    allProgress[programId] = {
      currentDay: 1,
      completedDays: [],
      startDate: new Date().toISOString(),
    };
    localStorage.setItem(KEYS.PROGRAMS, JSON.stringify(allProgress));
    return allProgress[programId];
  } catch (e) {
    console.error('Failed to start program:', e);
    return null;
  }
};

export const completeProgramDay = (programId: string, dayNumber: number) => {
  if (!isAuthenticated()) return;
  try {
    const allProgress = getProgramsProgress();
    if (!allProgress[programId]) {
      // Auto-start if not started
      allProgress[programId] = {
        currentDay: dayNumber + 1,
        completedDays: [dayNumber],
        startDate: new Date().toISOString(),
      };
    } else {
      if (!allProgress[programId].completedDays.includes(dayNumber)) {
        allProgress[programId].completedDays.push(dayNumber);
      }
      // Auto-advance current day if they completed the current one
      if (allProgress[programId].currentDay === dayNumber) {
        allProgress[programId].currentDay = dayNumber + 1;
      }
    }
    localStorage.setItem(KEYS.PROGRAMS, JSON.stringify(allProgress));
    return allProgress[programId];
  } catch (e) {
    console.error('Failed to complete day:', e);
    return null;
  }
};

export const resetProgram = (programId: string) => {
  if (!isAuthenticated()) return;
  try {
    const allProgress = getProgramsProgress();
    delete allProgress[programId];
    localStorage.setItem(KEYS.PROGRAMS, JSON.stringify(allProgress));
  } catch (e) {
    console.error('Failed to reset program:', e);
  }
};

// --- Workout Tracking ---

const WORKOUT_LOG_KEY = 'PlateWiki_workout_log';
const MAX_LOG_ENTRIES = 200;

export interface WorkoutLogEntry {
  workoutId?: string;
  workoutTitle?: string;
  techniqueId?: string;
  techniqueName?: string;
  exercisesCompleted?: number;
  totalSets?: number;
  duration?: number | string;
  completedAt?: string;
}

export interface WorkoutLogRecord extends WorkoutLogEntry {
  id: string;
  completedAt: string;
}

/**
 * Get all workout log entries
 * @returns {Array} Sorted newest-first
 */
export const getWorkoutLog = (): WorkoutLogRecord[] => {
  try {
    const raw = localStorage.getItem(WORKOUT_LOG_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

/**
 * Log a completed workout
 * @param {Object} entry — { workoutId, workoutTitle, techniqueId, techniqueName, exercisesCompleted, totalSets, duration, completedAt }
 */
export const logWorkout = (entry: WorkoutLogEntry) => {
  if (!isAuthenticated()) return;
  try {
    const log = getWorkoutLog();
    const record: WorkoutLogRecord = {
      ...entry,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      completedAt: entry.completedAt || new Date().toISOString(),
    };
    log.unshift(record);

    // Trim old entries
    if (log.length > MAX_LOG_ENTRIES) {
      log.length = MAX_LOG_ENTRIES;
    }

    localStorage.setItem(WORKOUT_LOG_KEY, JSON.stringify(log));
    return record;
  } catch (e) {
    console.error('Failed to log workout:', e);
    return null;
  }
};

/**
 * Get workout stats summary
 */
export const getWorkoutStats = () => {
  const log = getWorkoutLog();
  if (log.length === 0) {
    return { totalWorkouts: 0, totalSets: 0, thisWeek: 0, streak: 0, lastWorkout: null };
  }

  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  weekStart.setHours(0, 0, 0, 0);

  let thisWeek = 0;
  let totalSets = 0;

  log.forEach(entry => {
    totalSets += entry.totalSets || 0;
    const d = new Date(entry.completedAt);
    if (d >= weekStart) thisWeek++;
  });

  // Calculate workout streak (consecutive local days with at least 1 workout)
  const uniqueDays = ([...new Set(log.map((e: { completedAt: string }) => localDateString(new Date(e.completedAt))))].sort().reverse()) as string[];
  let streak = 0;

  if (uniqueDays.length > 0) {
    const today = localDateString(now);
    const yesterdayDate = new Date(now);
    yesterdayDate.setDate(now.getDate() - 1);
    const yesterday = localDateString(yesterdayDate);

    if (uniqueDays[0] === today || uniqueDays[0] === yesterday) {
      streak = 1;
      for (let i = 1; i < uniqueDays.length; i++) {
        const diffDays = daysBetween(uniqueDays[i], uniqueDays[i - 1]);
        if (diffDays === 1) {
          streak++;
        } else {
          break;
        }
      }
    }
  }

  return {
    totalWorkouts: log.length,
    totalSets,
    thisWeek,
    streak,
    lastWorkout: log[0],
  };
};

/**
 * Run schema migrations on client-side localStorage to ensure forward compatibility.
 */
export const migrateLocalStorageSchema = () => {
  if (typeof window === 'undefined') return;
  try {
    const CURRENT_VERSION = 2;
    const keyVersion = 'PlateWiki_schema_version';
    const oldVersion = parseInt(localStorage.getItem(keyVersion) || '0', 10);

    if (oldVersion >= CURRENT_VERSION) return;

    if (process.env.NODE_ENV !== 'production') console.log(`Running storage schema migrations from v${oldVersion} to v${CURRENT_VERSION}...`);

    // Migration v1: Ensure all workout logs have unique IDs and valid dates
    if (oldVersion < 1) {
      const logsRaw = localStorage.getItem('PlateWiki_workout_log');
      if (logsRaw) {
        try {
          const logs = JSON.parse(logsRaw);
          if (Array.isArray(logs)) {
            let modified = false;
            const migratedLogs = logs.map(entry => {
              const updatedEntry = { ...entry };
              let itemModified = false;
              if (!updatedEntry.id) {
                updatedEntry.id = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
                itemModified = true;
                modified = true;
              }
              if (!updatedEntry.completedAt) {
                updatedEntry.completedAt = new Date().toISOString();
                itemModified = true;
                modified = true;
              }
              return updatedEntry;
            });
            if (modified) {
              localStorage.setItem('PlateWiki_workout_log', JSON.stringify(migratedLogs));
            }
          }
        } catch (e) {
          console.warn('Failed to migrate workout log schema in v1:', e);
        }
      }
    }

    // Migration v2: Ensure athlete profile has all the default arrays & structures
    if (oldVersion < 2) {
      const profileRaw = localStorage.getItem('PlateWiki_fighter_profile');
      if (profileRaw) {
        try {
          const profile = JSON.parse(profileRaw);
          const defaultProfile = {
            displayName: 'athlete',
            xp: 0,
            workoutsCompleted: 0,
            articlesRead: [],
            techniquesStudied: [],
            timerSessions: 0,
            programDaysCompleted: 0,
            longestStreak: 0,
            joinedAt: new Date().toISOString(),
            dailyAwards: {},
          };
          // Merge to fill missing keys
          const migratedProfile = { ...defaultProfile, ...profile };
          localStorage.setItem('PlateWiki_fighter_profile', JSON.stringify(migratedProfile));
        } catch (e) {
          console.warn('Failed to migrate athlete profile schema in v2:', e);
        }
      }
    }

    // Update version
    localStorage.setItem(keyVersion, CURRENT_VERSION.toString());
    if (process.env.NODE_ENV !== 'production') console.log(`Storage schema successfully migrated to v${CURRENT_VERSION}.`);
  } catch (e) {
    console.error('Storage schema migration failed:', e);
  }
};


