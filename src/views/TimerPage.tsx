'use client';
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Play, Pause, RotateCcw, Maximize, Minimize, Timer, Volume2, VolumeX } from 'lucide-react';
import { useFighterProfile } from '../context/FighterProfileContext';
import { useWakeLock } from '@/hooks/useWakeLock';
import { useGlobalKeyboard } from '@/hooks/useGlobalKeyboard';
import { analytics } from '../utils/analytics';
import './TimerPage.css';

const PRESETS = [
  { label: 'Amateur', rounds: 3, roundMin: 3, roundSec: 0, restMin: 1, restSec: 0 },
  { label: 'Professional', rounds: 12, roundMin: 3, roundSec: 0, restMin: 1, restSec: 0 },
  { label: 'Drill', rounds: 6, roundMin: 2, roundSec: 0, restMin: 0, restSec: 30 },
  { label: 'Tabata', rounds: 8, roundMin: 0, roundSec: 20, restMin: 0, restSec: 10 },
  { label: 'Custom', rounds: 0, roundMin: 0, roundSec: 0, restMin: 0, restSec: 0 },
];

/**
 * Generates a boxing bell sound using the Web Audio API.
 * Creates a metallic ring by layering multiple sine waves with rapid decay.
 */
function playBell(audioCtxRef: React.MutableRefObject<AudioContext | null>, bellCount = 1) {
  if (!audioCtxRef.current) {
    audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
  }
  const ctx = audioCtxRef.current;

  for (let b = 0; b < bellCount; b++) {
    const startTime = ctx.currentTime + b * 0.35;

    // Layer multiple frequencies for a metallic bell sound
    const frequencies = [830, 1660, 2490, 3320];
    const gains = [1.0, 0.6, 0.3, 0.15];

    frequencies.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);
      // Slight detuning for realism
      osc.detune.setValueAtTime(Math.random() * 10 - 5, startTime);

      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(gains[i] * 0.3, startTime + 0.005);
      gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 1.2);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 1.5);
    });
  }
}

function playWarning(audioCtxRef: React.MutableRefObject<AudioContext | null>) {
  if (!audioCtxRef.current) {
    audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
  }
  const ctx = audioCtxRef.current;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(600, ctx.currentTime);
  gain.gain.setValueAtTime(0.15, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.3);
}

const TimerPage = () => {
  const [rounds, setRounds] = useState(3);
  const [roundDuration, setRoundDuration] = useState(180); // seconds
  const [restDuration, setRestDuration] = useState(60);    // seconds
  const [currentRound, setCurrentRound] = useState(1);
  const [timeLeft, setTimeLeft] = useState(180);
  const [isRunning, setIsRunning] = useState(false);
  const [phase, setPhase] = useState('ready'); // 'ready' | 'round' | 'rest' | 'done'
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activePreset, setActivePreset] = useState('Amateur');

  const timerRef = useRef<number>(0);
  const endTimeRef = useRef<number>(0);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const timerStateRef = useRef({ phase, currentRound });
  
  useEffect(() => {
    timerStateRef.current = { phase, currentRound };
  }, [phase, currentRound]);

  // Prevent screen sleep during active timer rounds/rest
  useWakeLock(phase !== 'ready' && phase !== 'done');
  const warningPlayed = useRef(false);
  const { awardXP } = useFighterProfile();

  // Warn user before reloading or leaving page during an active timer session
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (phase !== 'ready' && phase !== 'done') {
        e.preventDefault();
        e.returnValue = 'You have an active round timer session in progress. Are you sure you want to leave?';
        return e.returnValue;
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [phase]);

  // Track timer abandonment on page unmount
  useEffect(() => {
    return () => {
      const currentState = timerStateRef.current;
      if (currentState.phase !== 'ready' && currentState.phase !== 'done') {
        analytics.workoutAbandoned(
          'round_timer',
          0,
          currentState.currentRound - 1
        );
      }
    };
  }, []);

  const bell = useCallback((count = 1) => {
    if (!isMuted) playBell(audioCtxRef, count);
  }, [isMuted]);

  const warning = useCallback(() => {
    if (!isMuted) playWarning(audioCtxRef);
  }, [isMuted]);

  // Cleanup animation frame on unmount
  useEffect(() => {
    return () => {
      cancelAnimationFrame(timerRef.current);
    };
  }, []);

  const runTimer = () => {
    cancelAnimationFrame(timerRef.current);
    
    const updateTimer = () => {
      const now = Date.now();
      const remaining = Math.max(0, Math.ceil((endTimeRef.current - now) / 1000));
      
      setTimeLeft(remaining);

      // 10-second warning
      if (remaining === 10 && !warningPlayed.current) {
        warning();
        warningPlayed.current = true;
      }

      if (remaining > 0) {
        timerRef.current = requestAnimationFrame(updateTimer);
      } else {
        handlePhaseComplete();
      }
    };

    timerRef.current = requestAnimationFrame(updateTimer);
  };

  const startPhase = (newPhase: string, durationSec: number) => {
    setPhase(newPhase);
    setTimeLeft(durationSec);
    endTimeRef.current = Date.now() + (durationSec * 1000);
    warningPlayed.current = false;
    runTimer();
  };

  const handlePhaseComplete = () => {
    if (phase === 'round') {
      if (currentRound >= rounds) {
        setPhase('done');
        setIsRunning(false);
        bell(3);
        awardXP('timer_session');
      } else {
        bell(1);
        setTimeout(() => startPhase('rest', restDuration), 0);
      }
    } else if (phase === 'rest') {
      bell(1);
      setCurrentRound(r => r + 1);
      setTimeout(() => startPhase('round', roundDuration), 0);
    }
  };

  // Sync running state with requestAnimationFrame loop
  useEffect(() => {
    if (isRunning) {
      endTimeRef.current = Date.now() + (timeLeft * 1000);
      runTimer();
    } else {
      cancelAnimationFrame(timerRef.current);
    }
    return () => cancelAnimationFrame(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning]);

  const handleStart = () => {
    if (phase === 'ready' || phase === 'done') {
      setPhase('round');
      setCurrentRound(1);
      setTimeLeft(roundDuration);
      warningPlayed.current = false;
      bell(1);
      endTimeRef.current = Date.now() + (roundDuration * 1000);
    }
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    if (phase !== 'ready' && phase !== 'done') {
      analytics.workoutAbandoned('round_timer', 0, currentRound - 1);
    }
    setIsRunning(false);
    setPhase('ready');
    setCurrentRound(1);
    setTimeLeft(roundDuration);
    warningPlayed.current = false;
  };

  const [flashClass, setFlashClass] = useState('');

  useEffect(() => {
    if (phase === 'round') {
      setFlashClass('flash-work');
    } else if (phase === 'rest') {
      setFlashClass('flash-rest');
    } else if (phase === 'ready') {
      setFlashClass('flash-prepare');
    } else if (phase === 'done') {
      setFlashClass('flash-prepare');
    }

    const timer = setTimeout(() => {
      setFlashClass('');
    }, 600); // matches CSS animation duration

    return () => clearTimeout(timer);
  }, [phase]);

  const applyPreset = (preset: (typeof PRESETS)[number]) => {
    if (preset.label === 'Custom') {
      setActivePreset('Custom');
      return;
    }
    const rd = preset.roundMin * 60 + preset.roundSec;
    const rest = preset.restMin * 60 + preset.restSec;
    setRounds(preset.rounds);
    setRoundDuration(rd);
    setRestDuration(rest);
    setTimeLeft(rd);
    setPhase('ready');
    setCurrentRound(1);
    setIsRunning(false);
    setActivePreset(preset.label);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Keyboard controls for active timer session
  useGlobalKeyboard({
    onSpace: () => {
      if (isRunning) {
        handlePause();
      } else {
        handleStart();
      }
    },
    onEscape: handleReset,
    onMuteToggle: () => setIsMuted(prev => !prev),
    isActive: true,
  });

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const progress = phase === 'round'
    ? ((roundDuration - timeLeft) / roundDuration) * 100
    : phase === 'rest'
      ? ((restDuration - timeLeft) / restDuration) * 100
      : 0;

  const phaseLabel = phase === 'round' ? 'FIGHT' : phase === 'rest' ? 'REST' : phase === 'done' ? 'DONE' : 'READY';
  const countdownPhaseClass = phase === 'round' ? 'phase-work' : phase === 'rest' ? 'phase-rest' : phase === 'ready' ? 'phase-prepare' : 'phase-prepare';

  return (
    <div className={`timer-page ${phase} ${flashClass}`} ref={containerRef}>
{/* Header — hidden in fullscreen */}
      <section className="timer-header">
        <span className="timer-header__label"><Timer size={14} /> Training Tool</span>
        <h1>ROUND <span className="text-primary">TIMER</span></h1>
      </section>

      {/* Presets */}
      <div className="timer-presets">
        {PRESETS.filter(p => p.label !== 'Custom').map(p => (
          <button
            key={p.label}
            className={`preset-btn ${activePreset === p.label ? 'active' : ''}`}
            onClick={() => applyPreset(p)}
            disabled={isRunning}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Settings (only when not running) */}
      {!isRunning && phase === 'ready' && (
        <div className="timer-settings">
          <div className="timer-setting">
            <label>Rounds</label>
            <div className="setting-control">
              <button onClick={() => setRounds(r => Math.max(1, r - 1))} aria-label="Decrease rounds">−</button>
              <span className="setting-value">{rounds}</span>
              <button onClick={() => setRounds(r => Math.min(15, r + 1))} aria-label="Increase rounds">+</button>
            </div>
          </div>
          <div className="timer-setting">
            <label>Round Duration</label>
            <div className="setting-control">
              <button onClick={() => setRoundDuration(d => { const v = Math.max(10, d - 30); setTimeLeft(v); return v; })} aria-label="Decrease round time">−</button>
              <span className="setting-value">{formatTime(roundDuration)}</span>
              <button onClick={() => setRoundDuration(d => { const v = Math.min(300, d + 30); setTimeLeft(v); return v; })} aria-label="Increase round time">+</button>
            </div>
          </div>
          <div className="timer-setting">
            <label>Rest Duration</label>
            <div className="setting-control">
              <button onClick={() => setRestDuration(d => Math.max(10, d - 10))} aria-label="Decrease rest time">−</button>
              <span className="setting-value">{formatTime(restDuration)}</span>
              <button onClick={() => setRestDuration(d => Math.min(120, d + 10))} aria-label="Increase rest time">+</button>
            </div>
          </div>
        </div>
      )}

      {/* Main Display */}
      <div className="timer-display">
        <div className="timer-phase-label">{phaseLabel}</div>
        <div className={`timer-countdown ${countdownPhaseClass}`}>{formatTime(timeLeft)}</div>
        <div className="timer-round-info">
          Round {currentRound} of {rounds}
        </div>
        <div className="timer-progress-bar">
          <div className="timer-progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Controls */}
      <div className="timer-controls">
        {isRunning ? (
          <button className="timer-btn timer-btn--pause" onClick={handlePause} aria-label="Pause">
            <Pause size={28} />
          </button>
        ) : (
          <button className="timer-btn timer-btn--start" onClick={handleStart} aria-label={phase === 'done' ? 'Restart' : 'Start'}>
            <Play size={28} />
          </button>
        )}
        <button className="timer-btn timer-btn--reset" onClick={handleReset} aria-label="Reset">
          <RotateCcw size={20} />
        </button>
        <button className="timer-btn timer-btn--mute" onClick={() => setIsMuted(!isMuted)} aria-label={isMuted ? 'Unmute' : 'Mute'}>
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
        <button className="timer-btn timer-btn--fullscreen" onClick={toggleFullscreen} aria-label="Toggle fullscreen">
          {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
        </button>
      </div>
    </div>
  );
};

export default TimerPage;
