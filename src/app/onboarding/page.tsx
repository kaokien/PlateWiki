'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useClerk, useUser } from '@clerk/nextjs';
import { useFighterProfile } from '@/context/FighterProfileContext';
import { useFighterCustomization } from '@/hooks/useFighterCustomization';
import PixelFighter from '@/components/PixelFighter';
import { Zap, Check, Shield, Crosshair, Dumbbell, Move, User, ArrowRight, ArrowLeft } from 'lucide-react';
import { SKIN_TONES, HAIR_COLORS, GLOVE_COLORS, type BodyType } from '@/data/fighterSprites';
import './page.css';

const GOALS = [
  { id: 'speed' as const, name: 'Hand Speed', Icon: Zap, desc: 'Focus on combinations, fast footwork, and volume punching.', color: '#fbbf24' },
  { id: 'power' as const, name: 'Punching Power', Icon: Crosshair, desc: 'Focus on leverage, heavy bag drills, and explosive strength.', color: '#ef4444' },
  { id: 'stamina' as const, name: 'Stamina & Cardio', Icon: Dumbbell, desc: 'Focus on high-intensity round training and conditioning.', color: '#22c55e' },
  { id: 'defense' as const, name: 'Defense & IQ', Icon: Shield, desc: 'Focus on head movement, slipping, and counter-punching.', color: '#3b82f6' },
];

export default function OnboardingPage() {
  const router = useRouter();
  const clerk = useClerk();
  const { user } = useUser();
  const { profile, setDisplayName, setTrainingGoal } = useFighterProfile();
  const { customization, update } = useFighterCustomization();

  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [bodyType, setBodyType] = useState<BodyType>('male');
  const [skinTone, setSkinTone] = useState(1);
  const [hairColor, setHairColor] = useState(1);
  const [gloveColor, setGloveColor] = useState(0);
  const [selectedGoal, setSelectedGoal] = useState<'speed' | 'power' | 'stamina' | 'defense'>('speed');

  // Hydrate form values once customization loads
  useEffect(() => {
    if (customization) {
      setName(customization.fighterName || profile.displayName || '');
      setBodyType(customization.bodyType || 'male');
      setSkinTone(customization.skinTone ?? 1);
      setHairColor(customization.hairColor ?? 1);
      setGloveColor(customization.gloveColor ?? 0);
    }
  }, [customization, profile]);

  // Handle redirect if they are already onboarded, or if they sign up/sign in
  useEffect(() => {
    if (user) {
      // If user logs in during onboarding, apply settings and go home
      localStorage.setItem('bw_onboarded', '1');
      router.push('/');
    }
  }, [user, router]);

  const handleNext = () => {
    if (step === 1) {
      if (!name.trim()) return;
      setDisplayName(name);
      update({ fighterName: name });
    }
    if (step === 2) {
      update({
        bodyType,
        skinTone,
        hairColor,
        gloveColor,
      });
    }
    if (step === 3) {
      setTrainingGoal(selectedGoal);
    }
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleFinishAsGuest = () => {
    localStorage.setItem('bw_onboarded', '1');
    router.push('/');
  };

  const handleFinishSignUp = () => {
    localStorage.setItem('bw_onboarded', '1');
    clerk.openSignUp();
  };

  return (
    <div className="ob-page-root">
      <div className="ob-grid-bg" aria-hidden="true" />

      {/* Top Header */}
      <div className="ob-navbar">
        <span className="ob-brand">PlateWiki</span>
        <div className="ob-progress-indicator">
          <div className="ob-progress-bar">
            <div className="ob-progress-fill" style={{ width: `${(step / 4) * 100}%` }} />
          </div>
          <span className="ob-step-text">Step 0{step} / 04</span>
        </div>
      </div>

      {/* Main Container */}
      <div className="ob-container">
        {step > 1 && step < 4 && (
          <button className="ob-back-btn" onClick={handleBack}>
            <ArrowLeft size={16} /> Back
          </button>
        )}

        {/* Step 1: Identity */}
        {step === 1 && (
          <div className="ob-step-card animation-fade">
            <h1 className="ob-title">First, what should we call your fighter?</h1>
            <p className="ob-desc">This is the name of your training avatar. We&apos;ll use this as your identity through techniques, badges, and streaks.</p>
            <div className="ob-input-group">
              <label htmlFor="fighter-name" className="ob-label">Fighter Name</label>
              <input
                id="fighter-name"
                type="text"
                className="ob-input"
                placeholder="e.g. Iron Mike"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={30}
                autoFocus
              />
            </div>
            <button className="ob-cta-btn" onClick={handleNext} disabled={!name.trim()}>
              Continue <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* Step 2: Customization */}
        {step === 2 && (
          <div className="ob-step-card ob-step-card--split animation-fade">
            <div className="ob-customizer-controls">
              <h1 className="ob-title">Customize your base fighter</h1>
              <p className="ob-desc">Pick your fighter&apos;s style. You can customize this anytime, and unlock premium gear like robes and belts as you rank up.</p>

              {/* Body Type */}
              <div className="ob-option-group">
                <span className="ob-option-label">Gender / Model</span>
                <div className="ob-gender-toggle">
                  <button className={`ob-toggle-btn ${bodyType === 'male' ? 'active' : ''}`} onClick={() => setBodyType('male')}>Male</button>
                  <button className={`ob-toggle-btn ${bodyType === 'female' ? 'active' : ''}`} onClick={() => setBodyType('female')}>Female</button>
                </div>
              </div>

              {/* Skin Tone */}
              <div className="ob-option-group">
                <span className="ob-option-label">Skin Tone</span>
                <div className="ob-swatches">
                  {SKIN_TONES.map((color, i) => (
                    <button
                      key={i}
                      className={`ob-swatch ${skinTone === i ? 'active' : ''}`}
                      style={{ backgroundColor: color.hex }}
                      onClick={() => setSkinTone(i)}
                    />
                  ))}
                </div>
              </div>

              {/* Hair Color */}
              <div className="ob-option-group">
                <span className="ob-option-label">Hair Color</span>
                <div className="ob-swatches">
                  {HAIR_COLORS.map((color, i) => (
                    <button
                      key={i}
                      className={`ob-swatch ${hairColor === i ? 'active' : ''}`}
                      style={{ backgroundColor: color.hex }}
                      onClick={() => setHairColor(i)}
                    />
                  ))}
                </div>
              </div>

              {/* Glove Color */}
              <div className="ob-option-group">
                <span className="ob-option-label">Glove Color</span>
                <div className="ob-swatches">
                  {GLOVE_COLORS.map((color, i) => (
                    <button
                      key={i}
                      className={`ob-swatch ${gloveColor === i ? 'active' : ''}`}
                      style={{ backgroundColor: color.hex }}
                      onClick={() => setGloveColor(i)}
                    />
                  ))}
                </div>
              </div>

              <button className="ob-cta-btn" onClick={handleNext}>
                Continue <ArrowRight size={16} />
              </button>
            </div>

            {/* Fighter Preview Panel */}
            <div className="ob-preview-panel glass-panel">
              <div className="ob-preview-inner">
                <PixelFighter
                  rankName="Prospect"
                  size="lg"
                  showScene
                  animation="idle"
                  customization={{
                    fighterName: name,
                    bodyType,
                    skinTone,
                    hairColor,
                    gloveColor,
                    shoeColor: 0,
                    topColor: 0,
                    equippedGear: {},
                    unlockedGear: [],
                  }}
                />
              </div>
              <span className="ob-preview-tag">Fighter Preview</span>
            </div>
          </div>
        )}

        {/* Step 3: Training Goal */}
        {step === 3 && (
          <div className="ob-step-card animation-fade">
            <h1 className="ob-title">What is your main focus area?</h1>
            <p className="ob-desc">Select your training goal to personalize your dashboard workout recommendations.</p>
            
            <div className="ob-goals-grid">
              {GOALS.map((goal) => {
                const isSelected = selectedGoal === goal.id;
                return (
                  <button
                    key={goal.id}
                    className={`ob-goal-card glass-panel ${isSelected ? 'active' : ''}`}
                    style={{ '--goal-color': goal.color } as React.CSSProperties}
                    onClick={() => setSelectedGoal(goal.id)}
                  >
                    <div className="ob-goal-header">
                      <goal.Icon size={20} color={isSelected ? goal.color : '#888'} />
                      <span className="ob-goal-name">{goal.name}</span>
                    </div>
                    <p className="ob-goal-desc">{goal.desc}</p>
                    {isSelected && <Check size={16} className="ob-goal-check" color={goal.color} />}
                  </button>
                );
              })}
            </div>

            <button className="ob-cta-btn" onClick={handleNext}>
              Continue <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* Step 4: Save & Start */}
        {step === 4 && (
          <div className="ob-step-card ob-step-card--split animation-fade">
            <div className="ob-finish-options">
              <h1 className="ob-title">Ready to enter the gym?</h1>
              <p className="ob-desc">Create a free account to save your customized fighter, preserve your streaks, collect badges, and access the round timer history on any device.</p>
              
              <div className="ob-action-buttons">
                <button className="ob-cta-btn ob-cta-btn--gold" onClick={handleFinishSignUp}>
                  Create Free Account
                </button>
                <button className="ob-cta-btn ob-cta-btn--secondary" onClick={handleFinishAsGuest}>
                  Continue as Guest
                </button>
              </div>
            </div>

            {/* Final Fighter Card Preview */}
            <div className="ob-final-card glass-panel">
              <div className="ob-final-sprite">
                <PixelFighter
                  rankName="Prospect"
                  size="lg"
                  showScene
                  animation="idle"
                  customization={{
                    fighterName: name,
                    bodyType,
                    skinTone,
                    hairColor,
                    gloveColor,
                    shoeColor: 0,
                    topColor: 0,
                    equippedGear: {},
                    unlockedGear: [],
                  }}
                />
              </div>
              <div className="ob-final-details">
                <h3 className="ob-final-name">{name}</h3>
                <span className="ob-final-rank">Prospect · Level 1</span>
                <span className="ob-final-goal">
                  Goal: {GOALS.find(g => g.id === selectedGoal)?.name}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
