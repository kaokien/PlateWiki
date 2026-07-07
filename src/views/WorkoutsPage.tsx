'use client';
import React from 'react';
import Link from 'next/link';
import {
  Target,
  Shield,
  Activity,
  ChefHat,
  Heart,
  Scale,
  Zap,
  Clock,
  ListChecks,
  CalendarDays,
  Flame,
  BookOpen,
} from 'lucide-react';
import { muscleGroupWorkouts, goalWorkouts } from '@/data/recipes';
import './WorkoutsPage.css';

const MUSCLE_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  shoulders: Zap,
  core: Activity,
  legs: ChefHat,
  arms: Heart,
  chest: Scale,
  back: BookOpen,
  neck: Shield,
  cardio: Flame,
};

const WorkoutsPage = () => {
  const muscleWorkouts = Object.values(muscleGroupWorkouts);
  const goalWorkoutsList = Object.values(goalWorkouts);

  return (
    <div className="wkl-page">
      <div className="wkl-header">
        <h1>MEAL PREP <span className="text-primary">GUIDES</span></h1>
        <p className="wkl-subtitle">
          Curated nutritional strategies and meal plans to fuel recovery, endurance, and strength.
        </p>
      </div>

      {/* Nutritional Targets Section */}
      <section className="wkl-section">
        <h2 className="wkl-section-title">By Nutritional Target</h2>
        <div className="wkl-grid">
          {muscleWorkouts.map(workout => {
            const Icon = MUSCLE_ICONS[workout.slug] || ChefHat;
            return (
              <Link
                key={workout.slug}
                href={`/meals/${workout.slug}`}
                className="glass-panel wkl-card"
                aria-label={workout.name}
              >
                <div className="wkl-card-icon">
                  <Icon size={24} />
                </div>
                <div className="wkl-card-top">
                  <span className="wkl-badge wkl-badge-duration">
                    <Clock size={12} /> {workout.duration}
                  </span>
                  <span className="wkl-badge wkl-badge-count">
                    <ListChecks size={12} /> {workout.exercises.length} recipes
                  </span>
                </div>
                <h3>{workout.name}</h3>
                <p className="wkl-card-desc">
                  {workout.description.length > 120
                    ? workout.description.substring(0, 120) + '...'
                    : workout.description}
                </p>
                <div className="wkl-read-more">View Meal Prep Guide →</div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Goal Section */}
      <section className="wkl-section">
        <h2 className="wkl-section-title">By Performance Goal</h2>
        <div className="wkl-grid">
          {goalWorkoutsList.map(workout => (
            <Link
              key={workout.slug}
              href={`/plans/${workout.slug}`}
              className="glass-panel wkl-card wkl-card-goal"
              aria-label={workout.name}
            >
              <div className="wkl-card-top">
                <span className="wkl-badge wkl-badge-duration">
                  <Clock size={12} /> {workout.duration}
                </span>
                <span className="wkl-badge wkl-badge-freq">
                  <CalendarDays size={12} /> {workout.frequency}
                </span>
              </div>
              <h3>{workout.name}</h3>
              <p className="wkl-goal-label">{workout.goal}</p>
              <p className="wkl-card-desc">
                {workout.description.length > 120
                  ? workout.description.substring(0, 120) + '...'
                  : workout.description}
              </p>
              <div className="wkl-read-more">View Fuel Program →</div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default WorkoutsPage;
