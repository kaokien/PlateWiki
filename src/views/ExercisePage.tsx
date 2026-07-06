'use client';
import React, { useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  ChevronRight,
  ArrowLeft,
  BookOpen,
  Clock,
  Lightbulb,
  Zap,
  Activity,
  ChefHat,
  Heart,
  Scale,
} from 'lucide-react';
import { exercises } from '@/data/exercises';
import { techniques } from '@/data/techniques';
import { addToHistory } from '@/utils/favorites';
import './ExercisePage.css';

interface ExercisePageProps {
  exerciseId: string;
}

const DIFFICULTY_COLOR: Record<string, string> = {
  Beginner: 'ex-diff-beginner',
  Intermediate: 'ex-diff-intermediate',
  Advanced: 'ex-diff-advanced',
};

const ExercisePage = ({ exerciseId }: ExercisePageProps) => {
  const exercise = (exercises as Record<string, any>)[exerciseId];

  useEffect(() => {
    window.scrollTo(0, 0);
    if (exercise) {
      addToHistory({ id: exercise.id ?? exerciseId, type: 'exercise', title: exercise.name, href: `/exercise/${exerciseId}` });
    }
  }, [exerciseId, exercise]);

  // Resolve linked techniques (ingredients/foods)
  const linkedTechniques = useMemo(() => {
    if (!exercise) return [];
    return (exercise.techniques || [])
      .map((tid: string) => {
        const t = (techniques as Record<string, any>)[tid];
        return t ? { ...t, id: tid } : null;
      })
      .filter(Boolean);
  }, [exercise]);

  // Related exercises: share at least one muscle group, exclude self, limit 6
  const relatedExercises = useMemo(() => {
    if (!exercise) return [];
    const myMuscles = new Set(exercise.muscles as string[]);
    return Object.entries(exercises as Record<string, any>)
      .filter(
        ([id, ex]) =>
          id !== exerciseId &&
          (ex.muscles as string[]).some((m: string) => myMuscles.has(m))
      )
      .slice(0, 6)
      .map(([id, ex]) => ({ ...ex, id }));
  }, [exercise, exerciseId]);

  if (!exercise) {
    return (
      <div className="ex-page">
        <div className="ex-not-found glass-panel">
          <ChefHat size={40} style={{ opacity: 0.3, marginBottom: '1rem' }} />
          <h2>Recipe Not Found</h2>
          <p>The recipe you are looking for does not exist or has been moved.</p>
          <Link href="/exercises" className="ex-back-btn">
            <ArrowLeft size={16} /> Browse All Recipes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="ex-page">
      {/* Breadcrumbs */}
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/" className="breadcrumb-link">Home</Link>
        <ChevronRight size={14} className="breadcrumb-chevron" />
        <Link href="/exercises" className="breadcrumb-link">Recipes</Link>
        <ChevronRight size={14} className="breadcrumb-chevron" />
        <span className="breadcrumb-current">{exercise.name}</span>
      </nav>

      {/* Hero */}
      <div className="ex-hero glass-panel">
        <div className="ex-hero-icon">
          <ChefHat size={28} />
        </div>
        <div className="ex-hero-text">
          <div className="ex-badges">
            <span className={`ex-badge ${DIFFICULTY_COLOR[exercise.difficulty] || ''}`}>
              {exercise.difficulty === 'Beginner' && '• '}
              {exercise.difficulty === 'Intermediate' && '•• '}
              {exercise.difficulty === 'Advanced' && '••• '}
              {exercise.difficulty}
            </span>
            <span className="ex-badge ex-badge-category">
              <Zap size={11} /> {exercise.category}
            </span>
          </div>
          <h1 className="ex-title">{exercise.name}</h1>
          <div className="ex-equipment-tags">
            {(exercise.equipment as string[]).map((eq: string) => (
              <span key={eq} className="ex-equip-tag">
                <Activity size={11} /> {eq}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Nutritional Context */}
      <div className="ex-context glass-panel">
        <div className="ex-context-header">
          <div className="ex-context-icon">🥑</div>
          <h2>Nutritional Role & Bio-benefit</h2>
        </div>
        <p className="ex-context-body">{exercise.boxingContext}</p>
      </div>

      {/* Preparation Steps */}
      <div className="ex-section glass-panel">
        <div className="ex-section-header">
          <BookOpen size={18} className="ex-icon-target" />
          <h2>How To Prepare</h2>
        </div>
        <ol className="ex-step-list">
          {(exercise.howTo as string[]).map((step: string, idx: number) => (
            <li key={idx}>
              <span className="ex-step-number">{idx + 1}</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Preparation parameters */}
      <div className="ex-params-grid">
        <div className="ex-param-card glass-panel">
          <div className="ex-param-icon">
            <ChefHat size={18} />
          </div>
          <div className="ex-param-label">Yield / Servings</div>
          <div className="ex-param-value">{exercise.sets}</div>
        </div>
        <div className="ex-param-card glass-panel">
          <div className="ex-param-icon">
            <Clock size={18} />
          </div>
          <div className="ex-param-label">Prep Time</div>
          <div className="ex-param-value">{exercise.reps}</div>
        </div>
        <div className="ex-param-card glass-panel">
          <div className="ex-param-icon">
            <Scale size={18} />
          </div>
          <div className="ex-param-label">Macronutrients</div>
          <div className="ex-param-value text-xs font-mono">{exercise.rest}</div>
        </div>
      </div>

      {/* Cooking Tips */}
      {exercise.tips && exercise.tips.length > 0 && (
        <div className="ex-section glass-panel ex-tips-section">
          <div className="ex-section-header">
            <Lightbulb size={18} className="ex-icon-tip" />
            <h2>Bio-Booster Cooking Tips</h2>
          </div>
          <ul className="ex-tip-list">
            {(exercise.tips as string[]).map((tip: string, idx: number) => (
              <li key={idx}>
                <Lightbulb size={14} className="ex-tip-bullet" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Associated Key Ingredients */}
      {linkedTechniques.length > 0 && (
        <div className="ex-section-open">
          <div className="ex-section-header">
            <Heart size={18} className="ex-icon-technique" />
            <h2>Key Ingredients Highlighted</h2>
          </div>
          <div className="ex-technique-grid">
            {linkedTechniques.map((t: any) => (
              <Link
                key={t.id}
                href={`/technique/${t.id}`}
                className="ex-technique-card glass-panel"
              >
                <div className="ex-technique-info">
                  <span className="ex-technique-name">{t.name}</span>
                  <span className="ex-technique-cat">{t.category}</span>
                </div>
                <ChevronRight size={16} className="ex-technique-arrow" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Related Recipes */}
      {relatedExercises.length > 0 && (
        <div className="ex-section-open">
          <div className="ex-section-header">
            <ChefHat size={18} className="ex-icon-related" />
            <h2>Related Recipes & Fuel</h2>
          </div>
          <p className="ex-related-subtitle">
            Other recipes targeting similar biological roles
          </p>
          <div className="ex-related-grid">
            {relatedExercises.map((ex: any) => (
              <Link
                key={ex.id}
                href={`/exercise/${ex.id}`}
                className="ex-related-card glass-panel"
              >
                <div className="ex-related-top">
                  <span className="ex-related-name">{ex.name}</span>
                  <span
                    className={`ex-related-diff ${DIFFICULTY_COLOR[ex.difficulty] || ''}`}
                  >
                    {ex.difficulty}
                  </span>
                </div>
                <div className="ex-related-muscles">
                  {(ex.muscles as string[]).map((m: string) => (
                    <span key={m} className="ex-muscle-chip">{m}</span>
                  ))}
                </div>
                <ChevronRight size={14} className="ex-related-arrow" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Back CTA */}
      <div className="ex-back-cta">
        <Link href="/exercises" className="ex-back-btn">
          <ArrowLeft size={16} /> Browse All Recipes
        </Link>
      </div>
    </div>
  );
};

export default ExercisePage;
