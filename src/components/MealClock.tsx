'use client';

import { useMemo, useState, useCallback } from 'react';
import Link from 'next/link';
import { exercises, type MealTime } from '@/data/recipes';
import {
  Sun, Coffee, UtensilsCrossed, Cookie, Moon, Shuffle,
  Clock, ChevronRight, Flame, Zap, Timer,
} from 'lucide-react';
import './MealClock.css';

/* ── Time window config ─────────────────────────────────────────────── */
interface MealWindow {
  key: string;
  label: string;
  greeting: string;
  emoji: string;
  icon: typeof Sun;
  mealTimes: MealTime[];
}

const MEAL_WINDOWS: { start: number; end: number; window: MealWindow }[] = [
  {
    start: 5, end: 10,
    window: {
      key: 'breakfast', label: 'Breakfast', greeting: 'Good Morning',
      emoji: '☀️', icon: Coffee,
      mealTimes: ['breakfast', 'anytime'],
    },
  },
  {
    start: 11, end: 13,
    window: {
      key: 'lunch', label: 'Lunch', greeting: 'Lunch Hour',
      emoji: '🍽', icon: UtensilsCrossed,
      mealTimes: ['lunch', 'anytime'],
    },
  },
  {
    start: 14, end: 16,
    window: {
      key: 'snack', label: 'Snack', greeting: 'Afternoon Fuel',
      emoji: '⚡', icon: Cookie,
      mealTimes: ['snack', 'anytime'],
    },
  },
  {
    start: 17, end: 20,
    window: {
      key: 'dinner', label: 'Dinner', greeting: 'Dinner Time',
      emoji: '🥘', icon: Flame,
      mealTimes: ['dinner', 'anytime'],
    },
  },
  {
    start: 21, end: 4,  // wraps midnight
    window: {
      key: 'recovery', label: 'Late Recovery', greeting: 'Recovery Window',
      emoji: '🌙', icon: Moon,
      // Late night = recovery-focused snacks + anytime (ashwagandha milk, tart cherry, etc.)
      mealTimes: ['snack', 'anytime'],
    },
  },
];

function getCurrentWindow(): MealWindow {
  const hour = new Date().getHours();
  for (const mw of MEAL_WINDOWS) {
    if (mw.start <= mw.end) {
      // Normal range
      if (hour >= mw.start && hour <= mw.end) return mw.window;
    } else {
      // Wraps midnight (e.g. 21–4)
      if (hour >= mw.start || hour <= mw.end) return mw.window;
    }
  }
  return MEAL_WINDOWS[0].window; // fallback: breakfast
}

/* ── Parse macros from rest string ──────────────────────────────────── */
function parseMacros(rest: string): { carbs: string; protein: string; fat: string } | null {
  const match = rest.match(/Carbs:\s*(\d+g)\s*\|\s*Protein:\s*(\d+g)\s*\|\s*Fat:\s*(\d+g)/);
  if (!match) return null;
  return { carbs: match[1], protein: match[2], fat: match[3] };
}

/* ── Shuffle helper ─────────────────────────────────────────────────── */
function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/* ── Recovery-biased filter for late night ───────────────────────────── */
const RECOVERY_KEYWORDS = ['recovery', 'sleep', 'cortisol', 'anti-inflammatory', 'melatonin', 'ashwagandha', 'tart cherry', 'collagen', 'golden'];

function isRecoveryRecipe(recipe: any): boolean {
  const text = `${recipe.name} ${recipe.performanceContext} ${recipe.category}`.toLowerCase();
  return RECOVERY_KEYWORDS.some(kw => text.includes(kw));
}

/* ── Component ──────────────────────────────────────────────────────── */
const CARDS_TO_SHOW = 3;

export default function MealClock() {
  const mealWindow = useMemo(() => getCurrentWindow(), []);
  const [shuffleSeed, setShuffleSeed] = useState(0);

  const allRecipes = useMemo(() => Object.values(exercises) as any[], []);

  const filteredPool = useMemo(() => {
    let pool = allRecipes.filter((r: any) =>
      mealWindow.mealTimes.includes(r.mealTime)
    );

    // For late-night recovery window, prioritize recovery recipes
    if (mealWindow.key === 'recovery') {
      const recoveryRecipes = pool.filter(isRecoveryRecipe);
      const otherRecipes = pool.filter(r => !isRecoveryRecipe(r));
      pool = [...recoveryRecipes, ...otherRecipes];
    }

    return pool;
  }, [allRecipes, mealWindow]);

  const displayedRecipes = useMemo(() => {
    if (mealWindow.key === 'recovery') {
      // Keep recovery priority, only shuffle within each group
      const recoveryRecipes = filteredPool.filter(isRecoveryRecipe);
      const otherRecipes = filteredPool.filter(r => !isRecoveryRecipe(r));
      const combined = [...shuffleArray(recoveryRecipes), ...shuffleArray(otherRecipes)];
      return combined.slice(0, CARDS_TO_SHOW);
    }
    return shuffleArray(filteredPool).slice(0, CARDS_TO_SHOW);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredPool, shuffleSeed]);

  const handleShuffle = useCallback(() => {
    setShuffleSeed(s => s + 1);
  }, []);

  const WindowIcon = mealWindow.icon;

  return (
    <section className="meal-clock">
      <div className="meal-clock__header">
        <div className="meal-clock__title-row">
          <WindowIcon size={20} className="meal-clock__icon" />
          <h2 className="meal-clock__title">
            {mealWindow.emoji} {mealWindow.greeting} — <span className="text-primary">{mealWindow.label} Picks</span>
          </h2>
        </div>
        <button
          className="meal-clock__shuffle"
          onClick={handleShuffle}
          aria-label="Shuffle recipes"
          title="Show different recipes"
        >
          <Shuffle size={14} />
          <span>Shuffle</span>
        </button>
      </div>

      <div className="meal-clock__grid">
        {displayedRecipes.map((recipe: any) => {
          const macros = parseMacros(recipe.rest || '');
          const prepTime = recipe.reps || '';
          const contextSnippet = recipe.performanceContext
            ? recipe.performanceContext.length > 90
              ? recipe.performanceContext.substring(0, 90) + '…'
              : recipe.performanceContext
            : '';

          return (
            <Link
              key={recipe.id}
              href={`/recipe/${recipe.id}`}
              className="meal-clock-card glass-panel"
            >
              <div className="meal-clock-card__top">
                <span className="meal-clock-card__category">{recipe.category}</span>
                <span className={`meal-clock-card__diff meal-clock-card__diff--${recipe.difficulty?.toLowerCase()}`}>
                  {recipe.difficulty}
                </span>
              </div>

              <h3 className="meal-clock-card__name">{recipe.name}</h3>

              {contextSnippet && (
                <p className="meal-clock-card__context">{contextSnippet}</p>
              )}

              {macros && (
                <div className="meal-clock-card__macros">
                  <span className="meal-clock-card__macro meal-clock-card__macro--carbs">
                    <Zap size={11} /> {macros.carbs}
                  </span>
                  <span className="meal-clock-card__macro meal-clock-card__macro--protein">
                    <Flame size={11} /> {macros.protein}
                  </span>
                  <span className="meal-clock-card__macro meal-clock-card__macro--fat">
                    <Cookie size={11} /> {macros.fat}
                  </span>
                </div>
              )}

              <div className="meal-clock-card__footer">
                {prepTime && (
                  <span className="meal-clock-card__prep">
                    <Timer size={11} /> {prepTime}
                  </span>
                )}
                <span className="meal-clock-card__cta">
                  View Recipe <ChevronRight size={12} />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
