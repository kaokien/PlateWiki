import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Flame, ArrowRight, Calendar, ChefHat } from 'lucide-react';
import { exercises } from '../data/recipes';
import { trackDailyVisit } from '../utils/storage';
import './DailyWidget.css';

const exerciseList = Object.values(exercises);

// Seeded randomizer to pick the same exercise for everyone on a given day
const getDailyExercise = () => {
  if (exerciseList.length === 0) return null;

  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  // Simple hash of the date string
  let hash = 0;
  for (let i = 0; i < today.length; i++) {
    hash = ((hash << 5) - hash) + today.charCodeAt(i);
    hash |= 0;
  }

  const index = Math.abs(hash) % exerciseList.length;
  return exerciseList[index];
};

const DailyWidget = () => {
  const [streak, setStreak] = useState(0);

  // Compute exercise synchronously — getDailyExercise is pure, no browser APIs.
  // This prevents the null→content CLS shift.
  const exercise = useMemo(() => getDailyExercise(), []);

  useEffect(() => {
    const currentStreak = trackDailyVisit();
    setStreak(currentStreak);
  }, []);

  if (!exercise) return null;

  return (
    <div className="daily-widget-container">
      <div className="streak-card card glass-panel">
        <div className="streak-icon">
          <Flame size={32} className={streak > 0 ? 'text-primary' : 'text-secondary'} fill={streak > 0 ? 'currentColor' : 'none'} />
        </div>
        <div className="streak-content">
          <h2>Your Streak</h2>
          <p className="streak-number">{streak} {streak === 1 ? 'Day' : 'Days'}</p>
          <p className="streak-subtext">{streak > 0 ? "You're on fire! Keep it up." : "Train today to start a streak."}</p>
        </div>
      </div>

      <div className="daily-combo-card card glass-panel">
        <div className="daily-badge">
          <ChefHat size={14} /> RECIPE OF THE DAY
        </div>
        <div className="daily-content">
          <h2>{exercise.name}</h2>
          <div className="daily-meta">
            <span className="daily-muscle">{exercise.muscles?.[0]}</span>
            <span className={`daily-diff ${exercise.difficulty}`}>{exercise.difficulty}</span>
          </div>
          <p>{exercise.boxingContext?.substring(0, 100)}…</p>
        </div>
        <Link href={`/recipe/${exercise.id}`} className="daily-btn">
          View Recipe <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
};

export default DailyWidget;
