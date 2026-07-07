'use client';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ChevronRight, Clock, Target, Flame, RotateCcw, Zap, Check, Trophy, AlertTriangle, Volume2, VolumeX, Leaf, ChefHat, Heart, UtensilsCrossed, Scale } from 'lucide-react';
import { techniques, bodyParts } from '../data/techniques';
import { getWorkoutForTechnique } from '../data/gymWorkouts';
import { useSubscription } from '../context/SubscriptionContext';
import { useFighterProfile } from '../context/FighterProfileContext';
import ProGate from '../components/ProGate';
import ProBadge from '../components/ProBadge';
import { analytics } from '../utils/analytics';
import { logWorkout } from '../utils/storage';
import './TechniqueWorkoutPage.css';

const ChefHatIcon = ({ size, className }: { size?: number; className?: string }) => {
  return <UtensilsCrossed size={size} className={className} />;
};

const TechniqueWorkoutPage = () => {
  const params = useParams<{ id: string }>();
  const id = params?.id ?? '';
  const technique = techniques[id];
  const workout = technique ? getWorkoutForTechnique(technique) : null;
  const { isPro, isWorkoutFree } = useSubscription();
  const { awardXP } = useFighterProfile();
  const hasAccess = isPro || isWorkoutFree(id);
  const canTrack = isPro || isWorkoutFree(id);

  const [checkedExercises, setCheckedExercises] = useState<number[]>([]);
  const [workoutComplete, setWorkoutComplete] = useState(false);

  const [voiceCoach, setVoiceCoach] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('PlateWiki_gym_voice_coach');
      return saved === 'true';
    }
    return false;
  });

  useEffect(() => {
    localStorage.setItem('PlateWiki_gym_voice_coach', String(voiceCoach));
  }, [voiceCoach]);

  const speakText = useCallback((text: string, force = false) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      if (!voiceCoach && !force) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.15;
      utterance.pitch = 1.0;
      const voices = window.speechSynthesis.getVoices();
      const engVoice = voices.find(v => v.lang.startsWith('en') && v.name.includes('Google')) ||
                       voices.find(v => v.lang.startsWith('en')) ||
                       voices[0];
      if (engVoice) utterance.voice = engVoice;
      window.speechSynthesis.speak(utterance);
    }
  }, [voiceCoach]);

  const speakExercise = useCallback((ex: { name: string; sets: number; reps: number | string; note?: string } | null, force = false) => {
    if (!ex) return;
    const text = `${ex.name}. ${ex.sets}. Active time: ${ex.reps}. ${ex.note || ''}`;
    speakText(text, force);
  }, [speakText]);

  // Track abandonment on exit
  const stateRef = useRef({ workoutComplete, checkedCount: checkedExercises.length, totalCount: workout?.exercises?.length || 0 });
  useEffect(() => {
    stateRef.current = { workoutComplete, checkedCount: checkedExercises.length, totalCount: workout?.exercises?.length || 0 };
  }, [workoutComplete, checkedExercises.length, workout?.exercises?.length]);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (technique && workout) {
      analytics.customEvent('workout_view', {
        technique: technique.name,
        workout_title: workout.title,
        duration: workout.duration,
      });
    }

    return () => {
      const state = stateRef.current;
      if (!state.workoutComplete && state.checkedCount > 0) {
        analytics.customEvent('workout_abandoned', {
          workout_id: `technique_gym_${id}`,
          workout_title: workout?.title,
          technique: technique?.name,
          exercises_completed: state.checkedCount,
          total_exercises: state.totalCount,
          reason: 'page_exit'
        });
      }
    };
  }, [id, technique, workout]);

  if (!technique) {
    return (
      <div className="not-found">
        <h2>Ingredient not found</h2>
        <Link href="/" className="back-link">Return to Map</Link>
      </div>
    );
  }

  if (!workout) {
    return (
      <div className="not-found">
        <h2>No prep guide available for this food yet</h2>
        <Link href={`/technique/${id}`} className="back-link">Back to {technique.name}</Link>
      </div>
    );
  }

  return (
    <div className="tw-page">
      {/* Breadcrumb */}
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/" className="breadcrumb-link">Home</Link>
        <ChevronRight size={14} className="breadcrumb-chevron" />
        <Link href={`/technique/${id}`} className="breadcrumb-link">{technique.name}</Link>
        <ChevronRight size={14} className="breadcrumb-chevron" />
        <span className="breadcrumb-current">Prep Guide</span>
      </nav>

      {/* Header */}
      <div className="tw-header glass-panel">
        <div className="tw-header-icon">
          <ChefHatIcon size={28} />
        </div>
        <div className="tw-header-text">
          <div className="tw-badges">
            <span className="tw-badge tw-badge-workout">
              <ChefHatIcon size={12} /> KITCHEN PREP GUIDE
            </span>
            <span className="tw-badge tw-badge-duration">
              <Clock size={12} /> {workout.duration}
            </span>
            <span className="tw-badge tw-badge-exercises">
              {workout.exercises.length} steps
            </span>
          </div>
          <h1 className="tw-title">{workout.title}</h1>
          <p className="tw-subtitle">
            Prepare and digest the nutrients in <Link href={`/technique/${id}`} className="tw-tech-link">{technique.name}</Link>
          </p>
        </div>
      </div>

      {/* Focus & Biomarkers */}
      <div className="tw-meta-row">
        <div className="tw-meta-card glass-panel">
          <div className="tw-meta-header">
            <Target size={16} />
            <h3>Preparation Focus</h3>
          </div>
          <p>{workout.focus}</p>
        </div>
        <div className="tw-meta-card glass-panel">
          <div className="tw-meta-header">
            <Zap size={16} />
            <h3>Nutritional Targets</h3>
          </div>
          <div className="tw-muscle-tags">
            {technique.muscles.map(m => (
              <Link href={`/anatomy/${m}`} key={m} className="muscle-tag">{bodyParts[m]?.name || m}</Link>
            ))}
          </div>
        </div>
      </div>

      {/* Safety Warning */}
      <div className="workout-safety-card glass-panel warning-theme tw-safety-margin">
        <div className="safety-icon-container">
          <AlertTriangle size={24} className="warning-text-color" />
        </div>
        <div className="safety-card-content">
          <strong>Nutritional & Food Safety Disclaimer:</strong>
          <p>Consuming raw or undercooked meats, poultry, seafood, shellfish, or eggs may increase your risk of foodborne illness. Consult a physician or registered dietitian before initiating any major dietary adjustments, particularly if you are pregnant, have metabolic diseases, or have food allergies. PlateWiki assumes no liability for adverse reactions.</p>
        </div>
      </div>

      {/* Voice Coach Control */}
      {hasAccess && (
        <div className="tw-voice-coach-control glass-panel">
          <div className="tw-voice-header">
            {voiceCoach ? <Volume2 size={20} style={{ color: 'var(--color-primary)' }} /> : <VolumeX size={20} style={{ color: 'var(--color-text-muted)' }} />}
            <div>
              <h3>Voice Kitchen Guidance</h3>
              <p>Automatically speaks the next preparation step as you check them off.</p>
            </div>
          </div>
          <button 
            className={`tw-voice-toggle-btn ${voiceCoach ? 'active' : ''}`}
            onClick={() => {
              const nextState = !voiceCoach;
              setVoiceCoach(nextState);
              if (nextState && typeof window !== 'undefined' && 'speechSynthesis' in window) {
                window.speechSynthesis.cancel();
                const u = new SpeechSynthesisUtterance("Voice Guidance Enabled");
                u.rate = 1.15;
                const voices = window.speechSynthesis.getVoices();
                const engVoice = voices.find(v => v.lang.startsWith('en')) || voices[0];
                if (engVoice) u.voice = engVoice;
                window.speechSynthesis.speak(u);
              }
            }}
          >
            {voiceCoach ? 'Disable' : 'Enable'}
          </button>
        </div>
      )}

      {/* Pre-prep */}
      {hasAccess ? (
        <>
      <div className="tw-section tw-warmup glass-panel">
        <div className="tw-section-header">
          <Flame size={18} className="tw-icon-warmup" />
          <h2>Pre-Prep & Kitchen Hygiene</h2>
        </div>
        <p className="tw-warmup-text">{workout.warmup}</p>
      </div>

      {/* Steps */}
      <div className="tw-exercises">
        <h2 className="tw-exercises-title">
          <ChefHatIcon size={20} /> Preparation Steps
        </h2>
        <div className="tw-exercise-list">
          {workout.exercises.map((ex, idx) => {
            const isChecked = checkedExercises.includes(idx);
            const isFocus = (ex as any).focus || ex.name.toLowerCase().includes('cook') || ex.name.toLowerCase().includes('sauté') || ex.name.toLowerCase().includes('blend') || ex.name.toLowerCase().includes('boil') || ex.name.toLowerCase().includes('prep');
            return (
            <div key={idx} className={`tw-exercise-card glass-panel ${isChecked ? 'tw-exercise-done' : ''} ${isFocus ? 'tw-exercise-focus' : ''}`}>
              {canTrack && (
                <button
                  className={`tw-check-btn ${isChecked ? 'checked' : ''}`}
                  onClick={() => {
                    const willBeChecked = !isChecked;
                    setCheckedExercises(prev =>
                      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
                    );

                    if (willBeChecked && voiceCoach) {
                      const nextIdx = idx + 1;
                      if (nextIdx < workout.exercises.length) {
                        const nextEx = workout.exercises[nextIdx];
                        speakText(`Step ${idx + 1} completed. Next: ${nextEx.name}. ${nextEx.sets}. Active time: ${nextEx.reps}.`);
                      } else {
                        speakText("Excellent job! You have completed all steps in this prep guide. Tap Log Preparation to save your progress.");
                      }
                    }
                  }}
                  aria-label={`Mark step ${idx + 1} ${isChecked ? 'incomplete' : 'complete'}`}
                >
                  {isChecked ? <Check size={14} /> : <span className="tw-check-empty" />}
                </button>
              )}
              <div className="tw-exercise-number">{idx + 1}</div>
              <div className="tw-exercise-body">
                <h3 className="tw-exercise-name">
                  <span>{ex.name}</span>
                  {isFocus && <span className="tw-focus-badge">Active Cooking</span>}
                  <button 
                    className="tw-speak-btn"
                    onClick={() => speakExercise(ex, true)}
                    aria-label={`Read instructions for ${ex.name}`}
                    title="Read aloud"
                  >
                    <Volume2 size={12} />
                  </button>
                </h3>
                <div className="tw-exercise-params">
                  <span className="tw-param">
                    Yield: <strong>{ex.sets}</strong>
                  </span>
                  <span className="tw-param-divider">·</span>
                  <span className="tw-param">
                    Active: <strong>{ex.reps}</strong>
                  </span>
                  <span className="tw-param-divider">·</span>
                  <span className="tw-param tw-param-rest">
                    <Scale size={12} /> {ex.rest}
                  </span>
                </div>
                {ex.note && (
                  <p className="tw-exercise-note">{ex.note}</p>
                )}
              </div>
            </div>
            );
          })}
        </div>

        {/* Progress Bar + Complete */}
        {canTrack && !workoutComplete && checkedExercises.length > 0 && (
          <div className="tw-track-bar glass-panel">
            <div className="tw-track-progress">
              <div
                className="tw-track-fill"
                style={{ width: `${(checkedExercises.length / workout.exercises.length) * 100}%` }}
              />
            </div>
            <span className="tw-track-count">
              {checkedExercises.length}/{workout.exercises.length} steps completed
            </span>
            {checkedExercises.length === workout.exercises.length && (
              <button
                className="tw-complete-btn"
                onClick={() => {
                  logWorkout({
                    workoutId: id,
                    workoutTitle: workout.title,
                    techniqueId: id,
                    techniqueName: technique.name,
                    exercisesCompleted: checkedExercises.length,
                    totalSets: workout.exercises.reduce((sum, ex) => sum + ex.sets, 0),
                    duration: workout.duration,
                  });
                  awardXP('workout_complete');
                  setWorkoutComplete(true);
                  analytics.customEvent('workout_complete', {
                    technique: technique.name,
                    workout_title: workout.title,
                  });
                }}
              >
                <Trophy size={16} /> Log Preparation
              </button>
            )}
          </div>
        )}

        {workoutComplete && (
          <div className="tw-completion glass-panel">
            <Trophy size={28} className="tw-completion-icon" />
            <h3>Preparation Logged</h3>
            <p>{workout.title} saved to history. {isPro ? 'Check your dashboard journal.' : ''}</p>
            <div className="tw-completion-actions">
              <Link href={`/technique/${id}`} className="tw-back-btn">Back to {technique.name}</Link>
              {isPro && <Link href="/history" className="tw-history-link">View Journal</Link>}
            </div>
          </div>
        )}
      </div>

      {/* Post-prep clean up */}
      <div className="tw-section tw-cooldown glass-panel">
        <div className="tw-section-header">
          <RotateCcw size={18} className="tw-icon-cooldown" />
          <h2>Post-Meal Clean Up & Rest</h2>
        </div>
        <p className="tw-cooldown-text">{workout.cooldown}</p>
      </div>

      {/* Back to food CTA */}
      <div className="tw-back-cta">
        <Link href={`/technique/${id}`} className="tw-back-btn">
          <ChevronRight size={16} style={{ transform: 'rotate(180deg)' }} />
          Back to {technique.name} Page
        </Link>
      </div>
        </>
      ) : (
        <ProGate
          feature={`${technique.name} Prep Guide`}
          description={`Unlock the full ${workout.duration} prep guide with ${workout.exercises.length} steps detailing the preparation of ${technique.name}.`}
        >
          <div className="tw-section tw-warmup glass-panel">
            <div className="tw-section-header">
              <Flame size={18} className="tw-icon-warmup" />
              <h2>Pre-Prep & Kitchen Hygiene</h2>
            </div>
            <p className="tw-warmup-text">{workout.warmup}</p>
          </div>
          <div className="tw-exercises">
            <h2 className="tw-exercises-title">
              <ChefHatIcon size={20} /> Preparation Steps
            </h2>
            <div className="tw-exercise-list">
              {workout.exercises.slice(0, 2).map((ex, idx) => (
                <div key={idx} className="tw-exercise-card glass-panel">
                  <div className="tw-exercise-number">{idx + 1}</div>
                  <div className="tw-exercise-body">
                    <h3 className="tw-exercise-name">{ex.name}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ProGate>
      )}
    </div>
  );
};

export default TechniqueWorkoutPage;
