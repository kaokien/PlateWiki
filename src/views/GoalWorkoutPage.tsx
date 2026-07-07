'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import {
  ChevronRight,
  ChefHat,
  Clock,
  Target,
  Flame,
  RotateCcw,
  Zap,
  Brain,
  ArrowLeft,
  Calendar,
  Shield,
  Scale,
} from 'lucide-react';
import { goalWorkouts, exercises } from '@/data/recipes';
import { techniques } from '@/data/foods';
import { addToHistory } from '@/utils/favorites';
import './GoalWorkoutPage.css';

interface GoalWorkoutPageProps {
  slug: string;
}

const difficultyColor: Record<string, string> = {
  Beginner: '#10b981',
  Intermediate: '#f59e0b',
  Advanced: '#ef4444',
};

const GoalWorkoutPage = ({ slug }: GoalWorkoutPageProps) => {
  const workout = (goalWorkouts as Record<string, any>)[slug];

  useEffect(() => {
    window.scrollTo(0, 0);
    if (workout) {
      addToHistory({ id: slug, type: 'workout', title: workout.name, href: `/plans/${slug}` });
    }
  }, [slug, workout]);

  if (!workout) {
    return (
      <div className="gw-page">
        <div className="gw-not-found">
          <Target size={48} />
          <h2>Fuel Program Not Found</h2>
          <p>This goal-based fueling program does not exist yet.</p>
          <Link href="/meals" className="gw-back-link">
            <ArrowLeft size={16} /> Back to Meal Prep Guides
          </Link>
        </div>
      </div>
    );
  }

  const workoutExercises = (workout.exercises as string[])
    .map((id: string) => (exercises as Record<string, any>)[id])
    .filter(Boolean);

  const relatedTechniques = (workout.techniques as string[])
    .map((id: string) => ({ id, ...(techniques as Record<string, any>)[id] }))
    .filter((t: any) => t.name);

  const otherWorkouts = Object.entries(goalWorkouts as Record<string, any>)
    .filter(([key]) => key !== slug)
    .slice(0, 4);

  const truncate = (text: string, max: number) =>
    text.length > max ? text.slice(0, max).trimEnd() + '…' : text;

  return (
    <div className="gw-page">
      {/* Breadcrumbs */}
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/" className="breadcrumb-link">Home</Link>
        <ChevronRight size={14} className="breadcrumb-chevron" />
        <Link href="/meals" className="breadcrumb-link">Meal Prep Guides</Link>
        <ChevronRight size={14} className="breadcrumb-chevron" />
        <span className="breadcrumb-current">{workout.name}</span>
      </nav>

      {/* Hero */}
      <div className="gw-hero glass-panel">
        <div className="gw-hero-icon">
          <Target size={28} />
        </div>
        <div className="gw-hero-text">
          <div className="gw-badges">
            <span className="gw-badge gw-badge-goal">
              <Zap size={12} /> {workout.goal}
            </span>
            <span className="gw-badge gw-badge-duration">
              <Clock size={12} /> {workout.duration}
            </span>
            <span className="gw-badge gw-badge-frequency">
              <Calendar size={12} /> {workout.frequency}
            </span>
          </div>
          <h1 className="gw-title">{workout.title}</h1>
          <p className="gw-description">{workout.description}</p>
        </div>
      </div>

      {/* Key Principle */}
      <div className="gw-principle glass-panel">
        <div className="gw-principle-header">
          <Brain size={18} className="gw-principle-icon" />
          <h2>Key Nutritional Principle</h2>
        </div>
        <p className="gw-principle-text">{workout.keyPrinciple}</p>
      </div>

      {/* Pre-Prep & Cleanliness */}
      <div className="gw-phase gw-warmup glass-panel">
        <div className="gw-section-header">
          <Flame size={18} className="gw-icon-warmup" />
          <h2>Pre-Prep & Kitchen Hygiene</h2>
        </div>
        <p className="gw-phase-text">{workout.warmup}</p>
      </div>

      {/* Recipe Cards */}
      <div className="gw-exercises">
        <h2 className="gw-exercises-title">
          <ChefHat size={20} /> Recipes Included
        </h2>
        <div className="gw-exercise-list">
          {workoutExercises.map((ex: any, idx: number) => (
            <Link
              href={`/recipe/${ex.id}`}
              key={ex.id}
              className="gw-exercise-card glass-panel"
            >
              <div className="gw-exercise-number">{idx + 1}</div>
              <div className="gw-exercise-body">
                <div className="gw-exercise-top">
                  <h3 className="gw-exercise-name">{ex.name}</h3>
                  {ex.difficulty && (
                    <span
                      className="gw-difficulty-badge"
                      style={{
                        color: difficultyColor[ex.difficulty] || '#888',
                        borderColor: difficultyColor[ex.difficulty] || '#888',
                      }}
                    >
                      {ex.difficulty}
                    </span>
                  )}
                </div>
                <div className="gw-exercise-params">
                  <span className="gw-param">
                    Yield: <strong>{ex.sets}</strong>
                  </span>
                  <span className="gw-param-divider">·</span>
                  <span className="gw-param">
                    Active: <strong>{ex.reps}</strong>
                  </span>
                  <span className="gw-param-divider">·</span>
                  <span className="gw-param gw-param-rest">
                    <Scale size={12} /> {ex.rest}
                  </span>
                </div>
                {ex.boxingContext && (
                  <p className="gw-exercise-context">
                    {truncate(ex.boxingContext, 120)}
                  </p>
                )}
              </div>
              <ChevronRight size={16} className="gw-exercise-arrow" />
            </Link>
          ))}
        </div>
      </div>

      {/* Clean-Up */}
      <div className="gw-phase gw-cooldown glass-panel">
        <div className="gw-section-header">
          <RotateCcw size={18} className="gw-icon-cooldown" />
          <h2>Post-Meal Clean Up & Rest</h2>
        </div>
        <p className="gw-phase-text">{workout.cooldown}</p>
      </div>

      {/* Related Ingredients */}
      {relatedTechniques.length > 0 && (
        <div className="gw-related glass-panel">
          <div className="gw-section-header">
            <Shield size={18} />
            <h2>Associated Key Ingredients</h2>
          </div>
          <div className="gw-related-grid">
            {relatedTechniques.map((t: any) => (
              <Link href={`/food/${t.id}`} key={t.id} className="gw-related-link">
                <span>{t.name}</span>
                <ChevronRight size={14} />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Other Fuel Programs */}
      {otherWorkouts.length > 0 && (
        <div className="gw-related glass-panel">
          <div className="gw-section-header">
            <Target size={18} />
            <h2>Other Fuel Programs</h2>
          </div>
          <div className="gw-related-grid">
            {otherWorkouts.map(([key, w]: [string, any]) => (
              <Link href={`/plans/${key}`} key={key} className="gw-related-link">
                <span>{w.name}</span>
                <ChevronRight size={14} />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Back CTA */}
      <div className="gw-back-cta">
        <Link href="/meals" className="gw-back-btn">
          <ArrowLeft size={16} /> Back to Meal Prep Guides
        </Link>
      </div>
    </div>
  );
};

export default GoalWorkoutPage;
