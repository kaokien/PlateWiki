'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ChevronRight,
  Clock,
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  RotateCcw,
  Check,
  Crown,
  Dumbbell,
  Zap,
  Shield,
  Flame,
  Target,
  Heart,
  Scale,
  Activity,
  Leaf,
  UtensilsCrossed
} from 'lucide-react';
import { generateWorkout } from '@/utils/workoutGenerator';
import { saveWorkout, isWorkoutSaved, FREE_WORKOUTS_LIMIT } from '@/utils/savedWorkouts';
import { useSubscription } from '@/context/SubscriptionContext';
import { useUser } from '@clerk/nextjs';
import './WorkoutGeneratorPage.css';

const GOALS = [
  { id: 'power', label: 'Anabolic / Strength', icon: Scale, desc: 'Protein efficiency, muscle synthesis & recovery' },
  { id: 'speed', label: 'Endurance / Stamina', icon: Activity, desc: 'Carb loading, blood flow & cardiovascular efficiency' },
  { id: 'defense', label: 'Joint & Anti-Inflammatory', icon: Heart, desc: 'Soothe tissue soreness, tendons & joint lubrication' },
  { id: 'conditioning', label: 'Metabolism & Deficits', icon: Flame, desc: 'Weight cutting, low-calorie density & high water flush' },
  { id: 'all-around', label: 'Balanced Baseline', icon: Leaf, desc: 'Gut microbiome, trace minerals & overall cellular health' },
];

const LEVELS = [
  { id: 'beginner', label: 'Beginner', desc: 'Easy recipes, simple kitchen setup', dots: 1 },
  { id: 'intermediate', label: 'Intermediate', desc: 'Cooked meals, standard skillet work', dots: 2 },
  { id: 'advanced', label: 'Advanced', desc: 'Adaptogenic elixirs & fermentations', dots: 3 },
];

const EQUIPMENT = [
  { id: 'none', label: 'No Cooking', desc: 'Blender, shaker, or raw ingredients only' },
  { id: 'heavy-bag', label: 'Sauté Skillet', desc: 'Standard cast-iron or sauté skillet' },
  { id: 'speed-bag', label: 'Boiling Pot', desc: 'Saucepan or kettle hot water' },
  { id: 'double-end', label: 'Juicer / Strainer', desc: 'Juice extractor or cloth filtration' },
  { id: 'full-gym', label: 'Full Kitchen', desc: 'Full range stove, oven, blender, and pots' },
];

const FOCUS_AREAS = [
  { id: 'Macronutrients', label: 'Macros', icon: Scale },
  { id: 'Hydration & Salts', label: 'Hydration', icon: Flame },
  { id: 'Micronutrients', label: 'Micros', icon: Shield },
  { id: 'Gut & Digestion', label: 'Gut Health', icon: Heart },
  { id: 'Superfoods & Adaptogens', label: 'Superfoods', icon: Zap },
];

const TOTAL_STEPS = 5;

export default function WorkoutGeneratorPage() {
  const { user } = useUser();
  const { isPro } = useSubscription();
  const [step, setStep] = useState(0);

  // Form selections
  const [goal, setGoal] = useState('');
  const [level, setLevel] = useState('');
  const [equipment, setEquipment] = useState('');
  const [focusAreas, setFocusAreas] = useState<string[]>([]);

  // Results state
  const [generatedWorkout, setGeneratedWorkout] = useState<any>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [saveError, setSaveError] = useState<'limit' | 'unknown' | null>(null);

  // Sync saved status
  useEffect(() => {
    if (generatedWorkout) {
      setIsSaved(isWorkoutSaved(generatedWorkout.drills));
    }
  }, [generatedWorkout]);

  const toggleFocus = (area: string) => {
    setFocusAreas(prev =>
      prev.includes(area) ? prev.filter(x => x !== area) : [...prev, area]
    );
  };

  const next = () => {
    if (step === 3) {
      const plan = generateWorkout(
        goal,
        level,
        equipment,
        focusAreas
      );
      setGeneratedWorkout(plan);
      setStep(4);
    } else {
      setStep(prev => prev + 1);
    }
  };

  const back = () => {
    setStep(prev => prev - 1);
    setSaveError(null);
  };

  const restart = () => {
    setStep(0);
    setGoal('');
    setLevel('');
    setEquipment('');
    setFocusAreas([]);
    setGeneratedWorkout(null);
    setIsSaved(false);
    setSaveError(null);
  };

  const canProceed = () => {
    if (step === 0) return !!goal;
    if (step === 1) return !!level;
    if (step === 2) return !!equipment;
    return true;
  };

  const handleSaveWorkout = () => {
    if (!generatedWorkout) return;
    const res = saveWorkout(generatedWorkout, isPro);
    if (res.success) {
      setIsSaved(true);
      setSaveError(null);
    } else {
      setSaveError(res.error || 'unknown');
    }
  };

  const truncate = (text: string, max: number) =>
    text.length > max ? text.slice(0, max).trimEnd() + '…' : text;

  return (
    <div className="wg-container">
      {/* Back button header (only steps 1, 2, 3) */}
      {step > 0 && step < 4 && (
        <button className="wg-back-btn" onClick={back}>
          <ChevronLeft size={16} /> Back
        </button>
      )}

      {/* Progress Bar (steps 0, 1, 2, 3) */}
      {step < 4 && (
        <div className="wg-progress-bar">
          <div
            className="wg-progress-fill"
            style={{ width: `${((step + 1) / (TOTAL_STEPS - 1)) * 100}%` }}
          />
        </div>
      )}

      {/* ─── Step 0: Goal selection ─── */}
      {step === 0 && (
        <div className="wg-step wg-fade-in">
          <h1 className="wg-title">Nutritional <span className="text-primary">Goal</span></h1>
          <p className="wg-subtitle">What is your primary athletic performance focus right now?</p>
          <div className="wg-options-grid">
            {GOALS.map(g => {
              const Icon = g.icon;
              return (
                <button
                  key={g.id}
                  className={`wg-option-card glass-panel ${goal === g.id ? 'selected' : ''}`}
                  onClick={() => setGoal(g.id)}
                >
                  <div className="wg-option-icon"><Icon size={20} /></div>
                  <div className="wg-option-text">
                    <span className="wg-option-label">{g.label}</span>
                    <span className="wg-option-desc">{g.desc}</span>
                  </div>
                  {goal === g.id && <CheckCircle2 size={20} className="wg-check" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── Step 1: Difficulty Level ─── */}
      {step === 1 && (
        <div className="wg-step wg-fade-in">
          <h1 className="wg-title">Preparation <span className="text-primary">Level</span></h1>
          <p className="wg-subtitle">Choose a culinary skill tier matching your kitchen focus.</p>
          <div className="wg-options-grid">
            {LEVELS.map(l => (
              <button
                key={l.id}
                className={`wg-option-card glass-panel ${level === l.id ? 'selected' : ''}`}
                onClick={() => setLevel(l.id)}
              >
                <div className="wg-option-icon dots font-mono">
                  {'.'.repeat(l.dots)}
                </div>
                <div className="wg-option-text">
                  <span className="wg-option-label">{l.label}</span>
                  <span className="wg-option-desc">{l.desc}</span>
                </div>
                {level === l.id && <CheckCircle2 size={20} className="wg-check" />}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ─── Step 2: Equipment selection ─── */}
      {step === 2 && (
        <div className="wg-step wg-fade-in">
          <h1 className="wg-title">Kitchen <span className="text-primary">Equipment</span></h1>
          <p className="wg-subtitle">What preparation tools do you have access to?</p>
          <div className="wg-options-grid">
            {EQUIPMENT.map(e => (
              <button
                key={e.id}
                className={`wg-option-card glass-panel ${equipment === e.id ? 'selected' : ''}`}
                onClick={() => setEquipment(e.id)}
              >
                <div className="wg-option-icon"><UtensilsCrossed size={18} /></div>
                <div className="wg-option-text">
                  <span className="wg-option-label">{e.label}</span>
                  <span className="wg-option-desc">{e.desc}</span>
                </div>
                {equipment === e.id && <CheckCircle2 size={20} className="wg-check" />}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ─── Step 3: Focus Areas ─── */}
      {step === 3 && (
        <div className="wg-step wg-fade-in">
          <h1 className="wg-title">Target <span className="text-primary">Focus</span></h1>
          <p className="wg-subtitle">Optional — pick specific areas, or skip for a balanced fueling plan.</p>
          <div className="wg-chip-grid">
            {FOCUS_AREAS.map(f => {
              const Icon = f.icon;
              return (
                <button
                  key={f.id}
                  className={`wg-chip ${focusAreas.includes(f.id) ? 'selected' : ''}`}
                  onClick={() => toggleFocus(f.id)}
                >
                  <Icon size={16} />
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── Step 4: Results ─── */}
      {step === 4 && generatedWorkout && (
        <div className="wg-step wg-fade-in">
          <div className="wg-results-header">
            <h1 className="wg-title">{generatedWorkout.title}</h1>
            <div className="wg-results-meta">
              <span className="wg-meta-pill"><Clock size={14} /> {generatedWorkout.duration}</span>
              <span className="wg-meta-pill">{LEVELS.find(l => l.id === level)?.label}</span>
              <span className="wg-meta-pill">{EQUIPMENT.find(e => e.id === equipment)?.label}</span>
            </div>
          </div>

          {/* Pre-prep */}
          <div className="wg-results-section">
            <h2 className="wg-section-label">🔥 Pre-Prep & Cleanliness</h2>
            <ul className="wg-checklist">
              {generatedWorkout.warmup.map((w: string, i: number) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          </div>

          {/* Core Foods */}
          <div className="wg-results-section">
            <h2 className="wg-section-label">🌱 Whole Performance Foods</h2>
            <div className="wg-drill-list">
              {generatedWorkout.drills.map((d: any, i: number) => (
                <div className="wg-drill-card" key={i}>
                  <div className="wg-drill-top">
                    <span className="wg-drill-number">{i + 1}</span>
                    <div className="wg-drill-info">
                      <Link href={`/technique/${d.techniqueId}`} className="wg-drill-name">
                        {d.name} <ChevronRight size={14} />
                      </Link>
                      <span className="wg-drill-cat">{d.category} · {d.sets}</span>
                    </div>
                  </div>
                  <p className="wg-drill-desc">{d.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recipes */}
          {generatedWorkout.gymExercises.length > 0 && (
            <div className="wg-results-section">
              <h2 className="wg-section-label">🍳 Cooking & Recipes to Prep</h2>
              <div className="wg-exercise-table">
                {generatedWorkout.gymExercises.map((ex: any, i: number) => (
                  <div className="wg-exercise-row" key={i}>
                    <span className="wg-ex-name">{ex.name}</span>
                    <span className="wg-ex-detail">Yield: {ex.sets} · Active: {ex.reps}</span>
                    <span className="wg-ex-rest">Macros: {ex.rest}</span>
                    <span className="wg-ex-note">{ex.note}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Post-Meal Clean Up */}
          <div className="wg-results-section">
            <h2 className="wg-section-label">🧊 Post-Meal Clean Up & Rest</h2>
            <ul className="wg-checklist">
              {generatedWorkout.cooldown.map((c: string, i: number) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>

          {/* Save Errors */}
          {saveError === 'limit' && (
            <div className="glass-panel wg-limit-banner">
              <Crown size={16} style={{ color: '#f5a623' }} />
              <span>You've hit the limit of {FREE_WORKOUTS_LIMIT} saved plans. <Link href="/pricing" style={{ color: '#f5a623', fontWeight: 700 }}>Unlock unlimited saves with Pro</Link></span>
            </div>
          )}
          {saveError === 'unknown' && (
            <div className="glass-panel wg-error-banner">
              <span>An unexpected error occurred. Please try again.</span>
            </div>
          )}

          {/* Actions */}
          <div className="wg-results-actions">
            <button className="wg-btn-primary" onClick={restart}>
              <RotateCcw size={16} /> Generate Another
            </button>
            {isSaved ? (
              <button className="wg-btn-secondary saved" disabled>
                <Check size={16} /> Saved to Favorites
              </button>
            ) : (
              <button className="wg-btn-secondary" onClick={handleSaveWorkout}>
                Save Fuel Plan
              </button>
            )}
            <Link href="/timer" className="wg-btn-secondary">
              Open Digestion Timer <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      )}

      {/* Navigation */}
      {step < 4 && (
        <div className="wg-nav">
          <button
            className="wg-btn-primary"
            disabled={!canProceed()}
            onClick={next}
          >
            {step === 3 ? 'Generate Fuel Plan' : 'Continue'} <ArrowRight size={16} />
          </button>
          {step === 3 && focusAreas.length === 0 && (
            <span className="wg-skip-note">Skipping will generate a balanced fuel plan</span>
          )}
        </div>
      )}
    </div>
  );
}
