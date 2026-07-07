// gardenState.ts — Persistent per-plot growth for the Virtual Gym forest garden.
// The garden is the long-term progress mirror: plots grow when the user logs
// meals/meals and decay back toward soil when the avatar is neglected.

import type { SpeciesId } from './forestSprites';

export interface PlantPlot {
  species: SpeciesId;
  growth: number; // 0..100
}

interface StoredGarden {
  plots: PlantPlot[];
  lastUpdated: number;
}

export const GARDEN_STORAGE_KEY = 'PlateWiki_tamagotchi_garden';

// Neglect threshold: below this health score the garden loses growth over time.
export const GARDEN_DECAY_SCORE = 50;
// Below this the surviving plants render as withered husks.
export const GARDEN_WITHER_SCORE = 25;

const DECAY_PER_HOUR = 1.5;

// Plot order matches PLOT_LAYOUT in ForestGarden.tsx.
export const DEFAULT_PLOTS: PlantPlot[] = [
  { species: 'pine', growth: 30 },
  { species: 'appleTree', growth: 10 },
  { species: 'flower', growth: 5 },
  { species: 'berryBush', growth: 5 },
  { species: 'herb', growth: 15 },
  { species: 'mushroom', growth: 0 },
];

function clampGrowth(value: number): number {
  return Math.max(0, Math.min(100, value));
}

export function loadGarden(healthScore: number): PlantPlot[] {
  try {
    const raw = localStorage.getItem(GARDEN_STORAGE_KEY);
    if (!raw) return DEFAULT_PLOTS.map((p) => ({ ...p }));

    const stored: StoredGarden = JSON.parse(raw);
    if (!Array.isArray(stored.plots) || stored.plots.length !== DEFAULT_PLOTS.length) {
      return DEFAULT_PLOTS.map((p) => ({ ...p }));
    }

    const elapsedHours = Math.max(0, (Date.now() - (stored.lastUpdated || Date.now())) / 3600000);
    const offlineDecay = healthScore < GARDEN_DECAY_SCORE ? elapsedHours * DECAY_PER_HOUR : 0;

    return stored.plots.map((p, i) => ({
      species: DEFAULT_PLOTS[i].species,
      growth: clampGrowth((typeof p.growth === 'number' ? p.growth : 0) - offlineDecay),
    }));
  } catch {
    return DEFAULT_PLOTS.map((p) => ({ ...p }));
  }
}

export function saveGarden(plots: PlantPlot[]): void {
  try {
    const stored: StoredGarden = { plots, lastUpdated: Date.now() };
    localStorage.setItem(GARDEN_STORAGE_KEY, JSON.stringify(stored));
  } catch {
    /* ignore */
  }
}

// Distribute growth to the least-developed plots first, so consistent logging
// gradually fills the whole clearing instead of maxing one tree.
export function growGarden(plots: PlantPlot[], amount: number): PlantPlot[] {
  const next = plots.map((p) => ({ ...p }));
  let remaining = amount;
  while (remaining > 0) {
    const target = next.reduce(
      (lowest, p) => (p.growth < lowest.growth ? p : lowest),
      next[0],
    );
    if (target.growth >= 100) break;
    const chunk = Math.min(remaining, 8, 100 - target.growth);
    target.growth += chunk;
    remaining -= chunk;
  }
  return next;
}

export function decayGarden(plots: PlantPlot[], amount: number): PlantPlot[] {
  return plots.map((p) => ({ ...p, growth: clampGrowth(p.growth - amount) }));
}
