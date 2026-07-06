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
  Heart,
  ArrowLeft,
  Activity,
  Shield,
  Scale,
} from 'lucide-react';
import { muscleGroupWorkouts, exercises } from '@/data/exercises';
import { techniques } from '@/data/techniques';
import { addToHistory } from '@/utils/favorites';
import './MuscleWorkoutPage.css';

interface MuscleWorkoutPageProps {
  slug: string;
}

const difficultyColor: Record<string, string> = {
  Beginner: '#10b981',
  Intermediate: '#f59e0b',
  Advanced: '#ef4444',
};

const MuscleWorkoutPage = ({ slug }: MuscleWorkoutPageProps) => {
  const workout = (muscleGroupWorkouts as Record<string, any>)[slug];

  useEffect(() => {
    window.scrollTo(0, 0);
    if (workout) {
      addToHistory({ id: slug, type: 'workout', title: workout.name, href: `/workouts/${slug}` });
    }
  }, [slug, workout]);

  if (!workout) {
    return (
      <div className="mw-page">
        <div className="mw-not-found">
          <ChefHat size={48} />
          <h2>Meal Prep Guide Not Found</h2>
          <p>This nutritional target protocol does not exist yet.</p>
          <Link href="/workouts" className="mw-back-link">
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

  const otherWorkouts = Object.entries(muscleGroupWorkouts as Record<string, any>)
    .filter(([key]) => key !== slug)
    .slice(0, 4);

  const truncate = (text: string, max: number) =>
    text.length > max ? text.slice(0, max).trimEnd() + '…' : text;

  return (
    <div className="mw-page">
      {/* Breadcrumbs */}
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/" className="breadcrumb-link">Home</Link>
        <ChevronRight size={14} className="breadcrumb-chevron" />
        <Link href="/workouts" className="breadcrumb-link">Meal Prep Guides</Link>
        <ChevronRight size={14} className="breadcrumb-chevron" />
        <span className="breadcrumb-current">{workout.name}</span>
      </nav>

      {/* Hero */}
      <div className="mw-hero glass-panel">
        <div className="mw-hero-icon">
          <ChefHat size={28} />
        </div>
        <div className="mw-hero-text">
          <div className="mw-badges">
            <span className="mw-badge mw-badge-muscle">
              <Heart size={12} /> NUTRITIONAL TARGET
            </span>
            <span className="mw-badge mw-badge-duration">
              <Clock size={12} /> {workout.duration}
            </span>
            <span className="mw-badge mw-badge-count">
              <Target size={12} /> {workout.muscles.length} biomarkers
            </span>
          </div>
          <h1 className="mw-title">{workout.title}</h1>
          <p className="mw-description">{workout.description}</p>
        </div>
      </div>

      {/* Why It Matters */}
      <div className="mw-callout glass-panel">
        <div className="mw-callout-header">
          <Zap size={18} className="mw-callout-icon" />
          <h2>Why It Matters for Performance</h2>
        </div>
        <p className="mw-callout-text">{workout.whyItMatters}</p>
      </div>

      {/* Biomarkers / Substrates Targeted */}
      <div className="mw-muscles glass-panel">
        <div className="mw-section-header">
          <Heart size={18} />
          <h2>Target Physiological Biomarkers</h2>
        </div>
        <div className="mw-muscle-list">
          {workout.muscles.map((muscle: string) => (
            <span key={muscle} className="mw-muscle-tag">{muscle}</span>
          ))}
        </div>
      </div>

      {/* Pre-Prep & Cleanliness */}
      <div className="mw-phase mw-warmup glass-panel">
        <div className="mw-section-header">
          <Flame size={18} className="mw-icon-warmup" />
          <h2>Pre-Prep & Kitchen Hygiene</h2>
        </div>
        <p className="mw-phase-text">{workout.warmup}</p>
      </div>

      {/* Recipe Cards */}
      <div className="mw-exercises">
        <h2 className="mw-exercises-title">
          <ChefHat size={20} /> Recipes Included
        </h2>
        <div className="mw-exercise-list">
          {workoutExercises.map((ex: any, idx: number) => (
            <Link
              href={`/exercise/${ex.id}`}
              key={ex.id}
              className="mw-exercise-card glass-panel"
            >
              <div className="mw-exercise-number">{idx + 1}</div>
              <div className="mw-exercise-body">
                <div className="mw-exercise-top">
                  <h3 className="mw-exercise-name">{ex.name}</h3>
                  {ex.difficulty && (
                    <span
                      className="mw-difficulty-badge"
                      style={{
                        color: difficultyColor[ex.difficulty] || '#888',
                        borderColor: difficultyColor[ex.difficulty] || '#888',
                      }}
                    >
                      {ex.difficulty}
                    </span>
                  )}
                </div>
                <div className="mw-exercise-params">
                  <span className="mw-param">
                    Yield: <strong>{ex.sets}</strong>
                  </span>
                  <span className="mw-param-divider">·</span>
                  <span className="mw-param">
                    Active: <strong>{ex.reps}</strong>
                  </span>
                  <span className="mw-param-divider">·</span>
                  <span className="mw-param mw-param-rest">
                    <Scale size={12} /> {ex.rest}
                  </span>
                </div>
                {ex.boxingContext && (
                  <p className="mw-exercise-context">
                    {truncate(ex.boxingContext, 120)}
                  </p>
                )}
              </div>
              <ChevronRight size={16} className="mw-exercise-arrow" />
            </Link>
          ))}
        </div>
      </div>

      {/* Clean-Up */}
      <div className="mw-phase mw-cooldown glass-panel">
        <div className="mw-section-header">
          <RotateCcw size={18} className="mw-icon-cooldown" />
          <h2>Post-Meal Clean Up & Rest</h2>
        </div>
        <p className="mw-phase-text">{workout.cooldown}</p>
      </div>

      {/* Related Ingredients */}
      {relatedTechniques.length > 0 && (
        <div className="mw-related glass-panel">
          <div className="mw-section-header">
            <Shield size={18} />
            <h2>Associated Key Ingredients</h2>
          </div>
          <div className="mw-related-grid">
            {relatedTechniques.map((t: any) => (
              <Link href={`/technique/${t.id}`} key={t.id} className="mw-related-link">
                <span>{t.name}</span>
                <ChevronRight size={14} />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Related Meal Prep Guides */}
      {otherWorkouts.length > 0 && (
        <div className="mw-related glass-panel">
          <div className="mw-section-header">
            <ChefHat size={18} />
            <h2>Other Meal Prep Protocols</h2>
          </div>
          <div className="mw-related-grid">
            {otherWorkouts.map(([key, w]: [string, any]) => (
              <Link href={`/workouts/${key}`} key={key} className="mw-related-link">
                <span>{w.name}</span>
                <ChevronRight size={14} />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Back CTA */}
      <div className="mw-back-cta">
        <Link href="/workouts" className="mw-back-btn">
          <ArrowLeft size={16} /> Back to Meal Prep Guides
        </Link>
      </div>
    </div>
  );
};

export default MuscleWorkoutPage;
