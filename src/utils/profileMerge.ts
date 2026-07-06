/**
 * Merge helpers for cloud sync.
 *
 * The cloud is a backup, not an oracle: a pull must never erase progress
 * that only exists locally (XP earned before the pull completed, today's
 * daily-award throttles, a workout logged offline). These functions merge
 * cloud and local state conservatively instead of letting either side
 * clobber the other.
 */
import type { FighterProfile } from './fighterProfile';
import { daysBetween, localDateString } from './localDate';

function unionStrings(a: string[] | undefined, b: string[] | undefined): string[] {
  return Array.from(new Set([...(a || []), ...(b || [])]));
}

/**
 * Per-source daily-award dates: keep the most recent date for each key so
 * a stale cloud snapshot can't re-open today's throttle.
 */
export function mergeDailyAwards(
  a: Record<string, string> | undefined,
  b: Record<string, string> | undefined,
): Record<string, string> {
  const merged: Record<string, string> = { ...(a || {}) };
  for (const [key, date] of Object.entries(b || {})) {
    if (!merged[key] || date > merged[key]) merged[key] = date;
  }
  return merged;
}

/** Per-key numeric map merge (e.g. daily activity counts): keep the max. */
function mergeNumericMaps(
  a: Record<string, number> | undefined,
  b: Record<string, number> | undefined,
): Record<string, number> {
  const merged: Record<string, number> = { ...(a || {}) };
  for (const [key, val] of Object.entries(b || {})) {
    if (typeof val === 'number' && val > (merged[key] || 0)) merged[key] = val;
  }
  return merged;
}

/** Conservative field-by-field merge: counters take the max, lists union. */
export function mergeProfiles(local: FighterProfile, cloud: FighterProfile): FighterProfile {
  return {
    // carry through any extra fields the profile has grown locally
    // (streak freezes, badge flags, ...) that the cloud schema doesn't store
    ...local,
    displayName:
      cloud.displayName && cloud.displayName !== 'Harvest Sprout'
        ? cloud.displayName
        : local.displayName,
    xp: Math.max(local.xp || 0, cloud.xp || 0),
    workoutsCompleted: Math.max(local.workoutsCompleted || 0, cloud.workoutsCompleted || 0),
    articlesRead: unionStrings(local.articlesRead, cloud.articlesRead),
    techniquesStudied: unionStrings(local.techniquesStudied, cloud.techniquesStudied),
    quizzesCompleted: unionStrings(local.quizzesCompleted, cloud.quizzesCompleted),
    timerSessions: Math.max(local.timerSessions || 0, cloud.timerSessions || 0),
    programDaysCompleted: Math.max(local.programDaysCompleted || 0, cloud.programDaysCompleted || 0),
    longestStreak: Math.max(local.longestStreak || 0, cloud.longestStreak || 0),
    seenBadges: unionStrings(local.seenBadges, cloud.seenBadges),
    dailyAwards: mergeDailyAwards(cloud.dailyAwards, local.dailyAwards),
    joinedAt:
      cloud.joinedAt && (!local.joinedAt || cloud.joinedAt < local.joinedAt)
        ? cloud.joinedAt
        : local.joinedAt,
    streakFreezes: Math.max(local.streakFreezes || 0, cloud.streakFreezes || 0),
    dailyActivityCount: mergeNumericMaps(local.dailyActivityCount, cloud.dailyActivityCount),
  };
}

export interface WorkoutLogEntry {
  id?: string;
  workoutId?: string;
  techniqueId?: string;
  completedAt?: string;
  [key: string]: unknown;
}

/**
 * Merge two workout logs. Entries are deduplicated by id AND by content
 * (same workout/technique at the same completedAt timestamp) — ids are
 * random per write, so the same session can exist under two different ids
 * after an offline/online round-trip. Result is newest-first, capped.
 */
export function mergeWorkoutLogs(
  cloudLog: WorkoutLogEntry[],
  localLog: WorkoutLogEntry[],
  maxEntries = 200,
): WorkoutLogEntry[] {
  const byId = new Set<string>();
  const byContent = new Set<string>();
  const merged: WorkoutLogEntry[] = [];

  const contentKey = (e: WorkoutLogEntry) =>
    `${e.workoutId ?? ''}|${e.techniqueId ?? ''}|${e.completedAt ?? ''}`;

  for (const entry of [...cloudLog, ...localLog]) {
    if (!entry) continue;
    if (entry.id && byId.has(entry.id)) continue;
    const key = contentKey(entry);
    // only content-dedupe entries that actually carry identifying content
    if (key !== '||' && byContent.has(key)) continue;
    if (entry.id) byId.add(entry.id);
    if (key !== '||') byContent.add(key);
    merged.push(entry);
  }

  merged.sort(
    (a, b) => new Date(b.completedAt || 0).getTime() - new Date(a.completedAt || 0).getTime(),
  );
  return merged.slice(0, maxEntries);
}

/**
 * A cloud streak only counts if the cloud's last visit was today or
 * yesterday — an older snapshot describes a streak that has since broken,
 * and restoring it via max() would resurrect it.
 */
export function isCloudStreakFresh(cloudLastVisit: string | null | undefined, today = localDateString()): boolean {
  if (!cloudLastVisit) return false;
  const datePart = cloudLastVisit.slice(0, 10);
  const diff = daysBetween(datePart, today);
  return !Number.isNaN(diff) && diff >= 0 && diff <= 1;
}
