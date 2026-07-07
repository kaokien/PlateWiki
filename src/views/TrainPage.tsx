'use client';
import React, { useState, useMemo, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useClientSearchParams } from '@/hooks/useClientSearchParams';
import { Timer, Clock, ArrowRight, ChevronRight, Shield, Zap, Activity, Camera, ChefHat, Leaf, Flame, Heart } from 'lucide-react';
import { techniques } from '../data/foods';
import { workoutsByCategory } from '../data/gymWorkouts';
import { useSubscription } from '../context/SubscriptionContext';
import ProGate from '../components/ProGate';
import ProBadge from '../components/ProBadge';
import WorkoutPage from './WorkoutPage';
import './TrainPage.css';

const ShadowboxTracker = dynamic(() => import('../components/ShadowboxTracker'), { ssr: false });

const WORKOUT_GROUPS = [
  { label: 'Macronutrients', Icon: Leaf, ids: ['sweet-potato', 'eggs', 'salmon', 'oatmeal', 'blueberries', 'whey-isolate'] },
  { label: 'Hydration & Salts', Icon: Flame, ids: ['coconut-water', 'pink-salt'] },
  { label: 'Gut Health & Digestion', Icon: Heart, ids: ['kefir', 'acv'] },
  { label: 'Anti-Inflammatory & Recovery', Icon: Activity, ids: ['turmeric', 'ginger'] },
  { label: 'Superfoods & Adaptogens', Icon: Zap, ids: ['ashwagandha', 'lions-mane', 'cordyceps'] },
];

const TrainPage = () => {
  const [activeTab, setActiveTab] = useState<string>('workouts');
  const { isPro, isWorkoutFree } = useSubscription();

  const workoutGroups = useMemo(() => {
    return WORKOUT_GROUPS.map(group => ({
      ...group,
      workouts: group.ids
        .filter(id => workoutsByCategory[id])
        .map(id => {
          const workout = workoutsByCategory[id];
          const technique = techniques[id];
          return {
            id,
            title: workout.title,
            duration: workout.duration,
            exerciseCount: workout.exercises.length,
            focus: workout.focus,
            techniqueName: technique?.name || id,
          };
        }),
    })).filter(g => g.workouts.length > 0);
  }, []);

  const searchParams = useClientSearchParams();

  useEffect(() => {
    if (searchParams) {
      const tabParam = searchParams.get('tab');
      if (tabParam) {
        setActiveTab(tabParam);
      }
    }
  }, [searchParams]);

  const initialMode = searchParams ? (searchParams.get('mode') || undefined) : undefined;
  const initialTech = searchParams ? (searchParams.get('tech') || undefined) : undefined;

  return (
    <div className="train-page-container">
      {/* Shared Tab Bar */}
      <div className="train-tabs-wrapper">
        <div className="train-tabs">
          <button
            className={`train-tab ${activeTab === 'workouts' ? 'active' : ''}`}
            onClick={() => setActiveTab('workouts')}
          >
            <ChefHat size={16} /> Prep Guides
          </button>
          <button
            className={`train-tab ${activeTab === 'timer' ? 'active' : ''}`}
            onClick={() => setActiveTab('timer')}
          >
            <Timer size={16} /> Digestion Timer
          </button>
          <button
            className={`train-tab ${activeTab === 'tracker' ? 'active' : ''}`}
            onClick={() => setActiveTab('tracker')}
          >
            <Camera size={16} /> Eating Coach
          </button>
        </div>
      </div>

      {activeTab === 'workouts' && (
        <div className="train-page">
          {/* Prep Guides Index */}
          <div className="train-header">
            <h1>KITCHEN <span className="text-primary">PREP GUIDES</span></h1>
            <p>Step-by-step preparation and bioavailability routines to optimize absorption for each clean food. Pick one and prep.</p>
          </div>

          {workoutGroups.map(group => (
            <section key={group.label} className="train-group">
              <h2 className="train-group-title">
                <span className="train-group-icon"><group.Icon size={18} /></span>
                {group.label}
              </h2>
              <div className="train-grid">
                {group.workouts.map(w => {
                  const isFree = isWorkoutFree(w.id);
                  const locked = !isPro && !isFree;

                  const card = (
                    <div className="train-card glass-panel">
                      <div className="train-card-top">
                        <h3>{w.title} {locked && <ProBadge />}</h3>
                        <ArrowRight size={16} className="train-card-arrow" />
                      </div>
                      <p className="train-card-focus">{w.focus}</p>
                      <div className="train-card-meta">
                        <span><Clock size={12} /> {w.duration}</span>
                        <span>{w.exerciseCount} steps</span>
                      </div>
                    </div>
                  );

                  if (locked) {
                    return (
                      <div key={w.id}>
                        <ProGate
                          feature={w.title}
                          description={`Learn the ideal preparation and digestion protocols for your ${w.techniqueName}.`}
                        >
                          {card}
                        </ProGate>
                      </div>
                    );
                  }

                  return (
                    <Link
                      href={`/food/${w.id}/prep`}
                      key={w.id}
                      className="train-card-link"
                    >
                      {card}
                    </Link>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}

      {activeTab === 'timer' && (
        <WorkoutPage />
      )}

      {activeTab === 'tracker' && (
        <div className="train-page">
          <ShadowboxTracker initialMode={initialMode} initialTech={initialTech} />
        </div>
      )}
    </div>
  );
};

export default TrainPage;
