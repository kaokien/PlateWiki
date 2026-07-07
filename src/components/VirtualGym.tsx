'use client';

import React, { useState, useEffect, useRef } from 'react';
import PixelFighterCanvas from './PixelFighterCanvas';
import { useFighterProfile } from '@/context/FighterProfileContext';
import { useFighterCustomization } from '@/hooks/useFighterCustomization';
import { Zap, Flame, Heart, Info } from 'lucide-react';
import './VirtualGym.css';

const LOCAL_STORAGE_KEY = 'FoodWiki_tamagotchi_gym';

interface GymState {
  nourishment: number;
  fitness: number;
  energy: number;
  lastUpdated: number;
}

export default function VirtualGym() {
  const { rank } = useFighterProfile();
  const { customization } = useFighterCustomization();

  // Coordinates (percentage of container width/height)
  // Walkable area: X between 10 and 80, Y between 55 and 80
  const [posX, setPosX] = useState(45);
  const [posY, setPosY] = useState(70);
  const [targetX, setTargetX] = useState<number | null>(null);
  const [targetY, setTargetY] = useState<number | null>(null);
  const [facingRight, setFacingRight] = useState(true);

  // States: 'idle', 'walking', 'eating', 'training', 'sleeping'
  const [gymState, setGymState] = useState<'idle' | 'walking' | 'eating' | 'training' | 'sleeping'>('idle');

  // Status Bars (0 - 100)
  const [nourishment, setNourishment] = useState(80);
  const [fitness, setFitness] = useState(70);
  const [energy, setEnergy] = useState(90);

  // Food spawn state
  const [foodItem, setFoodItem] = useState<{ x: number; y: number } | null>(null);

  // Floating notifications
  const [floatingText, setFloatingText] = useState<{ id: number; text: string; x: number; y: number }[]>([]);
  const floatIdCounter = useRef(0);

  const score = (nourishment + fitness) / 2;
  const isFamished = nourishment < 35 || fitness < 35;

  // Fixed locations for plants in the virtual forest clearing
  const PLANT_PRESETS = [
    { x: 18, y: 72, healthy: '🌲', withered: '🍂' },
    { x: 78, y: 75, healthy: '🌳', withered: '🪵' },
    { x: 32, y: 82, healthy: '🌿', withered: '🍂' },
    { x: 68, y: 76, healthy: '🌸', withered: '🥀' },
  ];

  // Helper to check if it is nighttime (10 PM to 6 AM)
  const checkIsNighttime = (): boolean => {
    const hour = new Date().getHours();
    return hour >= 22 || hour < 6;
  };

  // Helper to trigger floating text
  const addFloatText = (text: string, x: number, y: number) => {
    const id = floatIdCounter.current++;
    setFloatingText((prev) => [...prev, { id, text, x, y }]);
    setTimeout(() => {
      setFloatingText((prev) => prev.filter((item) => item.id !== id));
    }, 2000);
  };

  // 1. Load state and check decay on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      const isNight = checkIsNighttime();
      
      if (saved) {
        const parsed: GymState = JSON.parse(saved);
        const elapsedHours = (Date.now() - parsed.lastUpdated) / 3600000;
        
        // Decay status bars: 2% per hour
        const decayNourishment = Math.max(0, parsed.nourishment - Math.floor(elapsedHours * 2.0));
        const decayFitness = Math.max(0, parsed.fitness - Math.floor(elapsedHours * 2.0));
        
        // Energy: Restores 10% per hour if sleeping/idle
        const restoreEnergy = Math.min(100, parsed.energy + Math.floor(elapsedHours * 8.0));

        setNourishment(decayNourishment);
        setFitness(decayFitness);
        setEnergy(restoreEnergy);
      }
      
      if (isNight) {
        setGymState('sleeping');
      }
    } catch { /* ignore */ }
  }, []);

  // 2. Save state to local storage on changes
  useEffect(() => {
    try {
      const state: GymState = {
        nourishment,
        fitness,
        energy,
        lastUpdated: Date.now(),
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
    } catch { /* ignore */ }
  }, [nourishment, fitness, energy]);

  // 3. Periodic natural decay (1% every 15 minutes) and energy recovery
  useEffect(() => {
    const decayInterval = setInterval(() => {
      const isNight = checkIsNighttime();
      
      setNourishment((prev) => Math.max(0, prev - 1));
      setFitness((prev) => Math.max(0, prev - 1));
      
      if (isNight || gymState === 'sleeping') {
        setEnergy((prev) => Math.min(100, prev + 2)); // recover energy
        setGymState('sleeping');
      } else {
        setEnergy((prev) => Math.max(0, prev - 1)); // active energy drain
      }
    }, 900000); // 15 minutes

    return () => clearInterval(decayInterval);
  }, [gymState]);

  // 4. Listen for Real-life logged events (Meal Log & Workouts)
  useEffect(() => {
    const handleMealLogged = () => {
      // Restore nourishment
      setNourishment((prev) => Math.min(100, prev + 45));
      
      // Wake up if sleeping
      if (gymState === 'sleeping') {
        setGymState('idle');
      }

      // Spawn food item & move to it
      const fx = 20 + Math.random() * 40;
      const fy = 60 + Math.random() * 15;
      setFoodItem({ x: fx, y: fy });
      setTargetX(fx);
      setTargetY(fy);
      setGymState('walking');

      addFloatText('Logged Meal Prep! 🍎', fx, fy - 15);
    };

    const handleWorkoutLogged = () => {
      // Restore fitness & drain energy
      setFitness((prev) => Math.min(100, prev + 45));
      setEnergy((prev) => Math.max(0, prev - 25));

      // Wake up if sleeping
      if (gymState === 'sleeping') {
        setGymState('idle');
      }

      // Walk to training center
      setTargetX(45);
      setTargetY(70);
      setGymState('walking');

      addFloatText('Logged Workout Completed! 🥊', 45, 45);
    };

    window.addEventListener('foodwiki:meal-logged', handleMealLogged);
    window.addEventListener('foodwiki:workout-logged', handleWorkoutLogged);

    return () => {
      window.removeEventListener('foodwiki:meal-logged', handleMealLogged);
      window.removeEventListener('foodwiki:workout-logged', handleWorkoutLogged);
    };
  }, [gymState]);

  // 5. Walking animation movement loop
  useEffect(() => {
    if (gymState === 'sleeping' || gymState === 'eating' || gymState === 'training') return;

    const intervalTime = 70; // coordinate update rate
    const stepSize = isFamished ? 0.7 : 1.4; // walk sluggishly when famished

    const moveTimer = setInterval(() => {
      if (targetX !== null && targetY !== null) {
        const dx = targetX - posX;
        const dy = targetY - posY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < stepSize) {
          setPosX(targetX);
          setPosY(targetY);
          setTargetX(null);
          setTargetY(null);

          if (foodItem) {
            // Reached food, play chewing animation
            setGymState('eating');
            setFoodItem(null);
            addFloatText('MUNCH MUNCH... 😋', targetX, targetY - 15);
            setTimeout(() => {
              const isNight = checkIsNighttime();
              setGymState(isNight ? 'sleeping' : 'idle');
            }, 5000);
          } else if (posX === 45 && posY === 70 && fitness > 70) {
            // Reached training spot, play training shadowboxing animation
            setGymState('training');
            addFloatText('TRAINING HARD... ⚡', 45, 45);
            setTimeout(() => {
              const isNight = checkIsNighttime();
              setGymState(isNight ? 'sleeping' : 'idle');
            }, 5000);
          } else {
            const isNight = checkIsNighttime();
            setGymState(isNight ? 'sleeping' : 'idle');
          }
        } else {
          const vx = (dx / dist) * stepSize;
          const vy = (dy / dist) * stepSize;

          setPosX((prev) => prev + vx);
          setPosY((prev) => prev + vy);
          setGymState('walking');
          setFacingRight(vx > 0);
        }
      }
    }, intervalTime);

    return () => clearInterval(moveTimer);
  }, [posX, posY, targetX, targetY, gymState, foodItem, fitness, isFamished]);

  // 6. Wander wander wander (when idle)
  useEffect(() => {
    if (gymState !== 'idle') return;

    const wanderTimer = setInterval(() => {
      if (checkIsNighttime()) {
        setGymState('sleeping');
        return;
      }

      // Sluggish wander frequency when famished
      if (isFamished && Math.random() > 0.1) return;

      if (Math.random() < 0.25) {
        const rx = 15 + Math.random() * 65;
        const ry = 55 + Math.random() * 20;
        setTargetX(rx);
        setTargetY(ry);
      }
    }, 5000);

    return () => clearInterval(wanderTimer);
  }, [gymState, isFamished]);

  const numHealthy = score >= 85 ? 4 : score >= 65 ? 3 : score >= 45 ? 2 : score >= 25 ? 1 : 0;

  return (
    <div className={`virtual-gym-container ${gymState === 'sleeping' ? 'virtual-gym--dark' : ''}`}>
      {/* Viewport Gym Screen */}
      <div className="gym-viewport">
        <div className="gym-grid-floor" />

        {/* Dynamic Forest clearing plants (Concept inspired by ForestApp.cc) */}
        {PLANT_PRESETS.map((p, idx) => {
          const isHealthy = idx < numHealthy;
          return (
            <div 
              key={idx}
              className="forest-plant"
              style={{ left: `${p.x}%`, top: `${p.y}%`, animationDelay: `${idx * 0.5}s` }}
            >
              {isHealthy ? p.healthy : p.withered}
            </div>
          );
        })}

        {/* Famished Status Overlay Banner */}
        {isFamished && (
          <div className="famished-status-banner">
            ⚠️ AVATAR NEGLECTED / FAMISHED
          </div>
        )}

        {/* Food Item rendering */}
        {foodItem && (
          <div 
            className="spawned-food"
            style={{ left: `${foodItem.x}%`, top: `${foodItem.y}%` }}
          >
            🍎
          </div>
        )}

        {/* Character Wrap */}
        <div 
          className={`gym-character-wrap ${facingRight ? 'facing-right' : 'facing-left'}`}
          style={{ 
            left: `${posX}%`, 
            top: `${posY}%`,
            transform: `translate(-50%, -100%) ${facingRight ? 'scaleX(1)' : 'scaleX(-1)'}`
          }}
        >
          {isFamished && gymState !== 'sleeping' && (
            <div className="famished-bubble">😰 Hungry</div>
          )}
          <PixelFighterCanvas
            rankName={rank.name}
            size="md"
            animation={
              gymState === 'sleeping' ? 'none' : 
              gymState === 'eating' ? 'training' : 
              gymState === 'training' ? 'evolving' : 'idle'
            }
            customization={customization}
          />
          {gymState === 'sleeping' && <div className="sleep-particle">Zzz</div>}
        </div>

        {/* Float tags */}
        {floatingText.map((f) => (
          <div 
            key={f.id} 
            className="gym-float-text"
            style={{ left: `${f.x}%`, top: `${f.y}%` }}
          >
            {f.text}
          </div>
        ))}
      </div>

      {/* Retro Status Panel */}
      <div className="gym-stats-panel">
        <div className="gym-stat-bar">
          <div className="gym-stat-label">
            <Heart size={12} className="text-red" /> NOURISHMENT
          </div>
          <div className="gym-stat-track">
            <div className="gym-stat-fill fill-green" style={{ width: `${nourishment}%` }} />
          </div>
          <span className="gym-stat-value">{nourishment}%</span>
        </div>

        <div className="gym-stat-bar">
          <div className="gym-stat-label">
            <Flame size={12} className="text-orange" /> FITNESS
          </div>
          <div className="gym-stat-track">
            <div className="gym-stat-fill fill-blue" style={{ width: `${fitness}%` }} />
          </div>
          <span className="gym-stat-value">{fitness}%</span>
        </div>

        <div className="gym-stat-bar">
          <div className="gym-stat-label">
            <Zap size={12} className="text-yellow" /> ENERGY
          </div>
          <div className="gym-stat-track">
            <div className="gym-stat-fill fill-yellow" style={{ width: `${energy}%` }} />
          </div>
          <span className="gym-stat-value">{energy}%</span>
        </div>
      </div>

      {/* Gamification Octalysis Alignment Legend */}
      <div className="gym-octalysis-mirror-legend">
        <div className="gym-legend-title">
          <Info size={14} className="text-accent" />
          <span>BIOMETRIC MIRROR SYSTEM</span>
        </div>
        <p className="gym-legend-desc">
          This avatar represents your health. It decays when neglected. Maintain it through real action:
        </p>
        <ul className="gym-legend-list">
          <li><strong>🍎 Nourishment:</strong> Log recipe/meal preps to feed your avatar.</li>
          <li><strong>🥊 Fitness:</strong> Log technique workouts and timers to keep your avatar fit.</li>
          <li><strong>⚡ Energy:</strong> Drains when training; recovers automatically over time.</li>
        </ul>
      </div>
    </div>
  );
}
