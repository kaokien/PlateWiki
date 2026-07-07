// tamagotchiState.ts — Shared store for the tamagotchi gym + garden state.
//
// Logging events ('platewiki:meal-logged' / 'platewiki:workout-logged') are
// applied to localStorage here, at the window level, so the avatar's stats and
// garden update even when the Virtual Gym component isn't mounted. VirtualGym
// renders from this store via useSyncExternalStore; other tabs stay in sync
// through the 'storage' event.

import {
  DEFAULT_PLOTS,
  GARDEN_DECAY_SCORE,
  GARDEN_STORAGE_KEY,
  decayGarden,
  growGarden,
  loadGarden,
  saveGarden,
  type PlantPlot,
} from './gardenState';

export const GYM_STORAGE_KEY = 'PlateWiki_tamagotchi_gym';

interface GymStats {
  nourishment: number;
  fitness: number;
  energy: number;
  lastUpdated: number;
}

export interface TamagotchiSnapshot {
  nourishment: number;
  fitness: number;
  energy: number;
  garden: PlantPlot[];
}

const DEFAULT_STATS = { nourishment: 80, fitness: 70, energy: 90 };

// Stable reference for SSR/hydration renders.
const SERVER_SNAPSHOT: TamagotchiSnapshot = {
  ...DEFAULT_STATS,
  garden: DEFAULT_PLOTS,
};

const DECAY_TICK_MS = 900000; // 15 minutes

const listeners = new Set<() => void>();
let snapshot: TamagotchiSnapshot | null = null;
let installed = false;

// Nighttime window (10 PM – 6 AM): the avatar sleeps and energy recovers.
export function isNighttime(): boolean {
  if (typeof localStorage !== 'undefined' && localStorage.getItem('PlateWiki_woken_up') === 'true') {
    return false;
  }
  if (typeof localStorage !== 'undefined' && localStorage.getItem('PlateWiki_manual_sleep') === 'true') {
    return true;
  }
  const hour = new Date().getHours();
  return hour >= 22 || hour < 6;
}

function clampStat(value: number): number {
  return Math.max(0, Math.min(100, value));
}

// Always read fresh from localStorage (never trust the in-memory cache for
// mutations) so the /dev/gym harness workflow — edit localStorage by hand,
// then dispatch a logging event — sees the edited values.
function readStats(): GymStats {
  try {
    const raw = localStorage.getItem(GYM_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<GymStats>;
      return {
        nourishment: clampStat(typeof parsed.nourishment === 'number' ? parsed.nourishment : DEFAULT_STATS.nourishment),
        fitness: clampStat(typeof parsed.fitness === 'number' ? parsed.fitness : DEFAULT_STATS.fitness),
        energy: clampStat(typeof parsed.energy === 'number' ? parsed.energy : DEFAULT_STATS.energy),
        lastUpdated: typeof parsed.lastUpdated === 'number' ? parsed.lastUpdated : Date.now(),
      };
    }
  } catch { /* ignore */ }
  return { ...DEFAULT_STATS, lastUpdated: Date.now() };
}

function writeStats(stats: Omit<GymStats, 'lastUpdated'>): void {
  try {
    localStorage.setItem(GYM_STORAGE_KEY, JSON.stringify({ ...stats, lastUpdated: Date.now() }));
  } catch { /* ignore */ }
}

function healthScore(stats: Pick<GymStats, 'nourishment' | 'fitness'>): number {
  return (stats.nourishment + stats.fitness) / 2;
}

function refreshSnapshot(): void {
  const stats = readStats();
  snapshot = {
    nourishment: stats.nourishment,
    fitness: stats.fitness,
    energy: stats.energy,
    garden: loadGarden(healthScore(stats)),
  };
}

function emit(): void {
  refreshSnapshot();
  listeners.forEach((listener) => listener());
}

// Offline catch-up, applied once per page load: stats decay 2%/hour away,
// energy restores 8%/hour, and the garden consumes its neglect decay.
function applyOfflineCatchUp(): void {
  const stats = readStats();
  const elapsedHours = Math.max(0, (Date.now() - stats.lastUpdated) / 3600000);
  const next = {
    nourishment: Math.max(0, stats.nourishment - Math.floor(elapsedHours * 2.0)),
    fitness: Math.max(0, stats.fitness - Math.floor(elapsedHours * 2.0)),
    energy: Math.min(100, stats.energy + Math.floor(elapsedHours * 8.0)),
  };
  writeStats(next);
  saveGarden(loadGarden(healthScore(next)));
}

// Live decay while a tab is open: 1% every 15 minutes, energy recovering at
// night and draining during the day, garden shrinking while neglected.
function tick(): void {
  const stats = readStats();
  const next = {
    nourishment: Math.max(0, stats.nourishment - 1),
    fitness: Math.max(0, stats.fitness - 1),
    energy: isNighttime()
      ? Math.min(100, stats.energy + 2)
      : Math.max(0, stats.energy - 1),
  };
  writeStats(next);
  if (healthScore(next) < GARDEN_DECAY_SCORE) {
    saveGarden(decayGarden(loadGarden(healthScore(next)), 1));
  }
  emit();
}

export function applyMealLogged(): void {
  const stats = readStats();
  writeStats({ ...stats, nourishment: Math.min(100, stats.nourishment + 45) });
  saveGarden(growGarden(loadGarden(healthScore(readStats())), 10));
  emit();
}

export function applyWorkoutLogged(): void {
  const stats = readStats();
  writeStats({
    ...stats,
    fitness: Math.min(100, stats.fitness + 45),
    energy: Math.max(0, stats.energy - 25),
  });
  saveGarden(growGarden(loadGarden(healthScore(readStats())), 8));
  emit();
}

// Page-lifetime singleton: safe to call from any client component; listeners
// are never removed so logging keeps feeding the avatar after unmounts.
export function initTamagotchiStore(): void {
  if (installed || typeof window === 'undefined') return;
  installed = true;

  applyOfflineCatchUp();

  window.addEventListener('platewiki:meal-logged', applyMealLogged);
  window.addEventListener('platewiki:workout-logged', applyWorkoutLogged);

  // Cross-tab sync: another tab wrote gym/garden state — re-read and re-render.
  window.addEventListener('storage', (e: StorageEvent) => {
    if (e.key === GYM_STORAGE_KEY || e.key === GARDEN_STORAGE_KEY || e.key === null) {
      emit();
    }
  });

  setInterval(tick, DECAY_TICK_MS);

  refreshSnapshot();
}

export function subscribeTamagotchi(listener: () => void): () => void {
  initTamagotchiStore();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getTamagotchiSnapshot(): TamagotchiSnapshot {
  if (!snapshot) refreshSnapshot();
  return snapshot!;
}

export function getTamagotchiServerSnapshot(): TamagotchiSnapshot {
  return SERVER_SNAPSHOT;
}
