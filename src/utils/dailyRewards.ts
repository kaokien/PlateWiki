import { localDateString, daysBetween } from './localDate';
import { isAuthenticated } from './authState';

export const DAILY_REWARDS = [5, 10, 10, 15, 15, 25, 50];

export interface DailyRewardState {
  day: number;
  reward: number;
  claimed: boolean;
  loginStreak: number;
}

interface StoredDailyReward {
  lastClaimedDate: string;
  currentDay: number;
}

const STORAGE_KEY = 'PlateWiki_daily_reward';

function readStored(): StoredDailyReward {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { lastClaimedDate: '', currentDay: 0 };
    return JSON.parse(raw);
  } catch {
    return { lastClaimedDate: '', currentDay: 0 };
  }
}

function writeStored(state: StoredDailyReward) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

export function getDailyRewardState(): DailyRewardState {
  if (!isAuthenticated()) {
    return { day: 0, reward: DAILY_REWARDS[0], claimed: true, loginStreak: 0 };
  }

  const today = localDateString();
  const stored = readStored();

  if (!stored.lastClaimedDate) {
    return { day: 0, reward: DAILY_REWARDS[0], claimed: false, loginStreak: 0 };
  }

  if (stored.lastClaimedDate === today) {
    return {
      day: stored.currentDay,
      reward: DAILY_REWARDS[stored.currentDay],
      claimed: true,
      loginStreak: stored.currentDay + 1,
    };
  }

  const diff = daysBetween(stored.lastClaimedDate, today);

  if (diff === 1) {
    // Consecutive day
    const nextDay = (stored.currentDay + 1) % DAILY_REWARDS.length;
    return {
      day: nextDay,
      reward: DAILY_REWARDS[nextDay],
      claimed: false,
      loginStreak: nextDay,
    };
  } else {
    // Streak broken, reset to day 0
    return {
      day: 0,
      reward: DAILY_REWARDS[0],
      claimed: false,
      loginStreak: 0,
    };
  }
}

export function claimDailyReward(): number {
  if (!isAuthenticated()) return 0;

  const today = localDateString();
  const state = getDailyRewardState();
  if (state.claimed) return 0;

  const reward = state.reward;
  writeStored({
    lastClaimedDate: today,
    currentDay: state.day,
  });

  return reward;
}
