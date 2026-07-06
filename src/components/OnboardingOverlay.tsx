import React, { useState, useEffect } from 'react';
import { useUser, useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Search, Dumbbell, BookOpen, LogIn } from 'lucide-react';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { analytics } from '../utils/analytics';
import { safeStorage } from '../utils/safeStorage';
import './OnboardingOverlay.css';

const STORAGE_KEY = 'bw_onboarded';

const OnboardingOverlay = () => {
  const [visible, setVisible] = useState(false);
  const { user, isLoaded: clerkLoaded } = useUser();
  const clerk = useClerk();
  const router = useRouter();

  useEffect(() => {
    if (!clerkLoaded) return;

    if (user) {
      safeStorage.setItem(STORAGE_KEY, '1');
      return;
    }

    if (!safeStorage.getItem(STORAGE_KEY)) {
      const timer = setTimeout(() => {
        setVisible(true);
        analytics.onboardingStart();
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [clerkLoaded, user]);

  const dismiss = () => {
    setVisible(false);
    safeStorage.setItem(STORAGE_KEY, '1');
    analytics.onboardingComplete();
  };

  const cardRef = useFocusTrap(visible, dismiss);

  if (!visible) return null;

  return (
    <div className="onboarding-backdrop" role="dialog" aria-modal="true" aria-label="Welcome to FoodWiki">
      <div ref={cardRef} className="onboarding-card">
        <div className="onboarding-step-content animation-fade">
          <h2 className="onboarding-title">
            Welcome to <span className="text-primary">FoodWiki</span>
          </h2>
          <p className="onboarding-desc">
            The interactive fighter&apos;s manual. Set up your fighter profile to track streaks, complete weekly challenges, and unlock gear.
          </p>

          <div className="onboarding-features">
            <div className="onboarding-feature">
              <div className="onboarding-feature-icon">
                <Search size={20} />
              </div>
              <div>
                <h3>Explore Techniques</h3>
                <p>Tap muscles on the body map or browse our library of punches, defense, and footwork.</p>
              </div>
            </div>

            <div className="onboarding-feature">
              <div className="onboarding-feature-icon icon-gym">
                <Dumbbell size={20} />
              </div>
              <div>
                <h3>Follow Workouts</h3>
                <p>Each technique has target conditioning and gym-ready drills with sets and reps.</p>
              </div>
            </div>

            <div className="onboarding-feature">
              <div className="onboarding-feature-icon icon-program">
                <BookOpen size={20} />
              </div>
              <div>
                <h3>Start a Program</h3>
                <p>Structured training paths designed to build real skills from day one.</p>
              </div>
            </div>
          </div>

          <button className="onboarding-cta" onClick={() => {
            dismiss();
            router.push('/onboarding');
          }}>
            Get Started
          </button>

          <div className="onboarding-signin-divider">
            <span>or</span>
          </div>

          <button
            className="onboarding-signin-btn"
            onClick={() => {
              dismiss();
              clerk.openSignIn();
            }}
          >
            <LogIn size={16} />
            Already have an account? Sign in
          </button>

          <button
            className="onboarding-guest-link"
            onClick={dismiss}
          >
            Browse as Guest
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingOverlay;


