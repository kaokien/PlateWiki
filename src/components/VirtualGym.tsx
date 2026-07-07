'use client';

import React, { useState, useEffect, useRef } from 'react';
import PixelFighterCanvas from './PixelFighterCanvas';
import { useFighterProfile } from '@/context/FighterProfileContext';
import { useFighterCustomization } from '@/hooks/useFighterCustomization';
import { Zap, Flame, Heart, Play } from 'lucide-react';
import './VirtualGym.css';

const LOCAL_STORAGE_KEY = 'FoodWiki_tamagotchi_gym';

interface GymState {
  nourishment: number;
  fitness: number;
  energy: number;
  lastUpdated: number;
}

export default function VirtualGym() {
  const { rank, awardXP } = useFighterProfile();
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

  // Load state from local storage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed: GymState = JSON.parse(saved);
        const elapsedMinutes = (Date.now() - parsed.lastUpdated) / 60000;
        
        // Decay status based on time passed
        const decayNourishment = Math.max(0, parsed.nourishment - Math.floor(elapsedMinutes * 0.1)); // 1% per 10 mins
        const decayFitness = Math.max(0, parsed.fitness - Math.floor(elapsedMinutes * 0.08));     // 1% per 12 mins
        const decayEnergy = Math.max(0, parsed.energy - Math.floor(elapsedMinutes * 0.05));       // 1% per 20 mins

        setNourishment(decayNourishment);
        setFitness(decayFitness);
        setEnergy(decayEnergy);
      }
    } catch { /* ignore */ }
  }, []);

  // Save state to local storage on changes
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

  // Decay bars slowly during active usage
  useEffect(() => {
    const timer = setInterval(() => {
      if (gymState !== 'sleeping') {
        setNourishment((prev) => Math.max(0, prev - 1));
        setFitness((prev) => Math.max(0, prev - 1));
        setEnergy((prev) => Math.max(0, prev - 1));
      }
    }, 25000); // decay 1% every 25s while active

    return () => clearInterval(timer);
  }, [gymState]);

  // Trigger sleeping energy restore
  useEffect(() => {
    if (gymState !== 'sleeping') return;

    const timer = setInterval(() => {
      setEnergy((prev) => {
        if (prev >= 100) {
          setGymState('idle');
          addFloatText('Fully Energized!', 50, 40);
          return 100;
        }
        return Math.min(100, prev + 5);
      });
    }, 1000); // restore 5% every second

    return () => clearInterval(timer);
  }, [gymState]);

  // Helper to trigger floating text
  const addFloatText = (text: string, x: number, y: number) => {
    const id = floatIdCounter.current++;
    setFloatingText((prev) => [...prev, { id, text, x, y }]);
    setTimeout(() => {
      setFloatingText((prev) => prev.filter((item) => item.id !== id));
    }, 1500);
  };

  // Walk animation logic loop
  useEffect(() => {
    if (gymState === 'sleeping' || gymState === 'eating' || gymState === 'training') return;

    const intervalTime = 80; // step calculation frequency (ms)
    const stepSize = 1.2;     // X/Y coordinates change per step

    const moveTimer = setInterval(() => {
      if (targetX !== null && targetY !== null) {
        // Calculate distance
        const dx = targetX - posX;
        const dy = targetY - posY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < stepSize) {
          // Destination reached
          setPosX(targetX);
          setPosY(targetY);
          setTargetX(null);
          setTargetY(null);

          if (foodItem) {
            // Reached spawned food! Begin eating animation
            setGymState('eating');
            setFoodItem(null);
            setNourishment((prev) => Math.min(100, prev + 25));
            awardXP('daily_login'); // Award actual XP
            addFloatText('+5 XP', targetX, targetY - 15);
            addFloatText('+10 Coins', targetX + 10, targetY - 5);

            setTimeout(() => {
              setGymState('idle');
            }, 4000);
          } else {
            setGymState('idle');
          }
        } else {
          // Move towards target
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
  }, [posX, posY, targetX, targetY, gymState, foodItem, awardXP]);

  // Random wander loop (picks target coordinate every few seconds)
  useEffect(() => {
    if (gymState !== 'idle') return;

    const wanderingTimer = setInterval(() => {
      // 30% chance to start wandering
      if (Math.random() < 0.3) {
        const randX = 10 + Math.random() * 70;
        const randY = 55 + Math.random() * 25;
        setTargetX(randX);
        setTargetY(randY);
      }
    }, 4000);

    return () => clearInterval(wanderingTimer);
  }, [gymState]);

  // Action Button - Feed
  const handleFeed = () => {
    if (gymState === 'sleeping') return;
    
    // Spawn food on the gym floor
    const rx = 20 + Math.random() * 50;
    const ry = 60 + Math.random() * 20;
    
    setFoodItem({ x: rx, y: ry });
    setTargetX(rx);
    setTargetY(ry);
    setGymState('walking');
    
    addFloatText('Yum! 🍎', rx, ry - 10);
  };

  // Action Button - Train
  const handleTrain = () => {
    if (gymState === 'sleeping' || gymState === 'eating' || gymState === 'training') return;
    
    if (energy < 25) {
      addFloatText('Too tired to train!', posX, posY - 20);
      return;
    }

    // Walk to gym center first
    setTargetX(45);
    setTargetY(70);
    
    const checkCenter = setInterval(() => {
      // Check if arrived at center
      if (targetX === null && targetY === null) {
        clearInterval(checkCenter);
        setGymState('training');
        setFitness((prev) => Math.min(100, prev + 30));
        setEnergy((prev) => Math.max(0, prev - 25));
        
        // Award XP and coins
        awardXP('workout_complete');
        addFloatText('+10 XP', 45, 50);
        addFloatText('+20 Coins', 55, 60);

        setTimeout(() => {
          setGymState('idle');
        }, 5000);
      }
    }, 200);
  };

  // Action Button - Sleep
  const handleSleep = () => {
    if (gymState === 'sleeping') {
      // Wake up
      setGymState('idle');
      addFloatText('Good morning! ☀️', posX, posY - 20);
    } else {
      setGymState('sleeping');
      setTargetX(null);
      setTargetY(null);
      addFloatText('Zzz... 😴', posX, posY - 20);
    }
  };

  return (
    <div className={`virtual-gym-container ${gymState === 'sleeping' ? 'virtual-gym--dark' : ''}`}>
      {/* Gym screen viewport */}
      <div className="gym-viewport">
        {/* Neon floor grid */}
        <div className="gym-grid-floor" />
        
        {/* Spawned Food Item */}
        {foodItem && (
          <div 
            className="spawned-food"
            style={{ left: `${foodItem.x}%`, top: `${foodItem.y}%` }}
          >
            🍎
          </div>
        )}

        {/* Character Object */}
        <div 
          className={`gym-character-wrap ${facingRight ? 'facing-right' : 'facing-left'}`}
          style={{ 
            left: `${posX}%`, 
            top: `${posY}%`,
            transform: `translate(-50%, -100%) ${facingRight ? 'scaleX(1)' : 'scaleX(-1)'}`
          }}
        >
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

        {/* Floating XP/Coin Notifications */}
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

      {/* Tamagotchi LED status bars */}
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

      {/* Interactive Hub Controllers */}
      <div className="gym-controls">
        <button 
          onClick={handleFeed} 
          disabled={gymState === 'sleeping' || gymState === 'eating' || gymState === 'training'}
          className="gym-btn btn-feed"
        >
          🍎 FEED ATHLETE
        </button>
        <button 
          onClick={handleTrain} 
          disabled={gymState === 'sleeping' || gymState === 'eating' || gymState === 'training'}
          className="gym-btn btn-train"
        >
          🥊 TRAIN ATHLETE
        </button>
        <button 
          onClick={handleSleep}
          disabled={gymState === 'eating' || gymState === 'training'}
          className={`gym-btn btn-sleep ${gymState === 'sleeping' ? 'btn-active' : ''}`}
        >
          {gymState === 'sleeping' ? '☀️ WAKE UP' : '😴 REST ATHLETE'}
        </button>
      </div>
    </div>
  );
}
