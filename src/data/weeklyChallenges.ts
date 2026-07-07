// ── Weekly Challenge Data ─────────────────────────────────────────────
// Pool of 8 challenges, one auto-selected per ISO week number.

export interface ChallengeRequirement {
  type: 'technique_studied' | 'workout_complete' | 'article_read' | 'timer_session' | 'quiz_complete';
  count: number;
  label: string;
}

export interface WeeklyChallenge {
  id: string;
  name: string;
  description: string;
  emoji: string;
  requirements: ChallengeRequirement[];
  xpReward: number;
  durationDays: 7;
}

export const WEEKLY_CHALLENGES: WeeklyChallenge[] = [
  {
    id: 'jab-week',
    name: 'Jab Week',
    description: 'Master the most important punch in athletic nutrition. Study techniques and put in the work.',
    emoji: '🥊',
    requirements: [
      { type: 'technique_studied', count: 3, label: 'Study 3 techniques' },
      { type: 'workout_complete', count: 2, label: 'Complete 2 workouts' },
    ],
    xpReward: 50,
    durationDays: 7,
  },
  {
    id: 'iron-chin',
    name: 'Iron Chin',
    description: 'Build your athletic nutrition IQ. Read up on the science and test your knowledge.',
    emoji: '🛡️',
    requirements: [
      { type: 'article_read', count: 5, label: 'Read 5 articles' },
      { type: 'quiz_complete', count: 1, label: 'Complete 1 quiz' },
    ],
    xpReward: 40,
    durationDays: 7,
  },
  {
    id: 'roadwork',
    name: 'Roadwork',
    description: 'Conditioning is king. Hit the timer and grind out the rounds.',
    emoji: '🏃',
    requirements: [
      { type: 'timer_session', count: 4, label: 'Complete 4 timer sessions' },
      { type: 'workout_complete', count: 1, label: 'Complete 1 workout' },
    ],
    xpReward: 45,
    durationDays: 7,
  },
  {
    id: 'combo-king',
    name: 'Combo King',
    description: 'Chain your punches together. Study the combinations and prove you know them.',
    emoji: '👑',
    requirements: [
      { type: 'technique_studied', count: 5, label: 'Study 5 techniques' },
      { type: 'quiz_complete', count: 1, label: 'Complete 1 quiz' },
    ],
    xpReward: 50,
    durationDays: 7,
  },
  {
    id: 'heavy-bag',
    name: 'Heavy Bag',
    description: 'Pure work. Three workouts, no excuses.',
    emoji: '🎯',
    requirements: [
      { type: 'workout_complete', count: 3, label: 'Complete 3 workouts' },
    ],
    xpReward: 60,
    durationDays: 7,
  },
  {
    id: 'film-study',
    name: 'Film Study',
    description: 'Learn from the greats. Read the breakdowns and study the craft.',
    emoji: '🎬',
    requirements: [
      { type: 'article_read', count: 4, label: 'Read 4 articles' },
      { type: 'technique_studied', count: 2, label: 'Study 2 techniques' },
    ],
    xpReward: 45,
    durationDays: 7,
  },
  {
    id: 'training-prep',
    name: 'Training Prep',
    description: 'Get ring-ready. Mix conditioning, technique work, and round practice.',
    emoji: '🔔',
    requirements: [
      { type: 'workout_complete', count: 2, label: 'Complete 2 workouts' },
      { type: 'timer_session', count: 2, label: 'Complete 2 timer sessions' },
      { type: 'technique_studied', count: 2, label: 'Study 2 techniques' },
    ],
    xpReward: 55,
    durationDays: 7,
  },
  {
    id: 'scholar-athlete',
    name: 'Scholar athlete',
    description: 'Brains over brawn. Read the material and ace the quizzes.',
    emoji: '📚',
    requirements: [
      { type: 'article_read', count: 3, label: 'Read 3 articles' },
      { type: 'quiz_complete', count: 3, label: 'Complete 3 quizzes' },
    ],
    xpReward: 50,
    durationDays: 7,
  },
];

// ── ISO Week Helpers ──────────────────────────────────────────────────

/** Returns the ISO week number (1–53) for a given date. */
function getISOWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  // Set to nearest Thursday: current date + 4 - current day number (Mon=1, Sun=7)
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

/** Returns the Monday of the current ISO week as YYYY-MM-DD. */
export function getChallengeWeekStart(): string {
  const now = new Date();
  const day = now.getDay();
  // day 0 = Sunday → offset 6, Mon=0, Tue=1, ...
  const diff = day === 0 ? 6 : day - 1;
  const monday = new Date(now);
  monday.setDate(now.getDate() - diff);
  const y = monday.getFullYear();
  const m = String(monday.getMonth() + 1).padStart(2, '0');
  const d = String(monday.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Returns the current week's challenge based on ISO week number. */
export function getCurrentChallenge(): WeeklyChallenge {
  const week = getISOWeekNumber(new Date());
  return WEEKLY_CHALLENGES[week % WEEKLY_CHALLENGES.length];
}

// ── localStorage Helpers ──────────────────────────────────────────────

const STORAGE_KEY = 'PlateWiki_weekly_challenge';

interface StoredChallengeData {
  weekStart: string;
  progress: Record<string, number>;
  /** Unique item ids already counted this week, per requirement type */
  counted: Record<string, string[]>;
  rewardClaimed: boolean;
}

function emptyWeek(weekStart: string): StoredChallengeData {
  return { weekStart, progress: {}, counted: {}, rewardClaimed: false };
}

function readStorage(): StoredChallengeData {
  const currentWeek = getChallengeWeekStart();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyWeek(currentWeek);
    const parsed = JSON.parse(raw) as Partial<StoredChallengeData>;
    // If stored data is from a different week, reset
    if (parsed.weekStart !== currentWeek) {
      return emptyWeek(currentWeek);
    }
    return {
      weekStart: currentWeek,
      progress: typeof parsed.progress === 'object' && parsed.progress !== null ? parsed.progress : {},
      counted: typeof parsed.counted === 'object' && parsed.counted !== null ? parsed.counted : {},
      rewardClaimed: !!parsed.rewardClaimed,
    };
  } catch {
    return emptyWeek(currentWeek);
  }
}

function writeStorage(data: StoredChallengeData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Storage full or unavailable — silently fail
  }
}

/** Returns current week's progress counts keyed by requirement type. */
export function getChallengeProgress(): Record<string, number> {
  return readStorage().progress;
}

/**
 * Increments a requirement type's count for the current week.
 *
 * With a `uniqueId` (technique/article/quiz id), each id counts at most
 * once per week — so revisiting a technique studied long ago still
 * advances the challenge, while opening the same page repeatedly doesn't.
 * Without an id (workouts, timer sessions), it's a plain increment; those
 * sources are already daily-throttled upstream.
 */
export function incrementChallengeProgress(type: string, uniqueId?: string): void {
  const data = readStorage();
  if (uniqueId) {
    const seen = data.counted[type] || [];
    if (seen.includes(uniqueId)) return;
    data.counted[type] = [...seen, uniqueId];
  }
  data.progress[type] = (data.progress[type] || 0) + 1;
  writeStorage(data);
}

/** Checks if all requirements are met for the given challenge. */
export function isChallengeComplete(
  challenge: WeeklyChallenge,
  progress: Record<string, number>,
): boolean {
  return challenge.requirements.every(
    (req) => (progress[req.type] || 0) >= req.count,
  );
}

/** Whether this week's reward has been claimed. */
export function getChallengeRewardClaimed(): boolean {
  return readStorage().rewardClaimed;
}

/** Marks this week's reward as claimed. */
export function claimChallengeReward(): void {
  const data = readStorage();
  data.rewardClaimed = true;
  writeStorage(data);
}
