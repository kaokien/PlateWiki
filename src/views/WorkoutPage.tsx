'use client';
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Play, Square, Settings, Volume2, VolumeX, RotateCcw, Mic, MicOff, AlertTriangle } from 'lucide-react';
import { techniques, type Technique } from '../data/foods';
import { analytics } from '../utils/analytics';
import { useStance } from '../context/StanceContext';
import { useFighterProfile } from '../context/FighterProfileContext';
import { parseStanceText } from '../utils/stanceParser';
import AdBanner from '../components/AdBanner';
import ShareButton from '../components/ShareButton';
import { useWakeLock } from '@/hooks/useWakeLock';
import { useGlobalKeyboard } from '@/hooks/useGlobalKeyboard';
import { logWorkout } from '../utils/storage';
import './WorkoutPage.css';

// Audio Context for beeps (lazy initialized to comply with browser autoplay policies)
let audioCtx: AudioContext | null = null;

const playBeep = (type = 'start', isMuted = false) => {
  if (isMuted) return;
  
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  const osc = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  
  osc.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  
  if (type === 'start') {
    // High double beep
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, audioCtx.currentTime);
    gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
    osc.start(audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
    osc.stop(audioCtx.currentTime + 0.5);
  } else if (type === 'end') {
    // Low long beep
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, audioCtx.currentTime);
    gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
    osc.start(audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1.0);
    osc.stop(audioCtx.currentTime + 1.0);
  } else if (type === 'warning') {
    // Short sharp beep
    osc.type = 'square';
    osc.frequency.setValueAtTime(600, audioCtx.currentTime);
    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    osc.start(audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
    osc.stop(audioCtx.currentTime + 0.2);
  }
};

const PRESETS = {
  'usain-bolt': {
    name: 'Usain Bolt (Endurance Carb Load)',
    description: 'High carb focus: High-volume energy fueling intervals, timed carbohydrate load guidelines and hydration cues.',
    blocks: 5,
    blockDuration: 180,
    digestionDuration: 30,
    focusMode: 'All',
    signatures: ['sweet-potato', 'oatmeal', 'blueberries', 'coconut-water']
  },
  'arnold-schwarzenegger': {
    name: 'Arnold Schwarzenegger (Anabolic Protein Build)',
    description: 'Strength builder focus: Frequent amino acid intake prompts, protein synthesis cycles, and mineral baseline density.',
    blocks: 8,
    blockDuration: 180,
    digestionDuration: 60,
    focusMode: 'All',
    signatures: ['whey-isolate', 'eggs', 'salmon', 'spinach', 'pumpkin-seeds']
  },
  'georges-st-pierre': {
    name: 'Georges St-Pierre (Intermittent Fasting & Adaptogens)',
    description: 'Fasting and gut focus: Compressed 16/8 eating windows, probiotic microflora prompts, and stress adaptation.',
    blocks: 6,
    blockDuration: 180,
    digestionDuration: 45,
    focusMode: 'All',
    signatures: ['kefir', 'ginger', 'ashwagandha', 'lions-mane', 'turmeric']
  },
  'michael-phelps': {
    name: 'Michael Phelps (Endurance Metabolic Fueling)',
    description: 'Endurance athlete focus: Extreme caloric density cycles, simple glycogen hydration, and antioxidant intake.',
    blocks: 12,
    blockDuration: 180,
    digestionDuration: 60,
    focusMode: 'All',
    signatures: ['oatmeal', 'sweet-potato', 'coconut-water', 'blueberries']
  }
};

const WorkoutPage = () => {
  // Config State
  const [totalBlocks, setTotalBlocks] = useState(3);
  const [blockDuration, setBlockDuration] = useState(180); // seconds (3 min)
  const [digestionDuration, setDigestionDuration] = useState(60); // seconds (1 min)
  const [focusMode, setFocusMode] = useState('All');
  const [athletePreset, setFighterPreset] = useState('custom');
  const [isMuted, setIsMuted] = useState(false);
  const [voiceCallouts, setVoiceCallouts] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('platewiki_voice_callouts');
      return saved !== 'false'; // default true
    }
    return true;
  });

  useEffect(() => {
    localStorage.setItem('platewiki_voice_callouts', String(voiceCallouts));
  }, [voiceCallouts]);

  // Active Workout State
  const [phase, setPhase] = useState('setup'); // 'setup', 'work', 'digestion', 'done', 'paused'
  const [currentBlock, setCurrentBlock] = useState(1);
  const [timeLeft, setTimeLeft] = useState(0); // seconds remaining in current phase
  const [currentRecipe, setCurrentRecipe] = useState<Technique | null>(null);
  const { isSouthpaw } = useStance();
  const { awardXP } = useFighterProfile();

  // Prevent screen sleep during active workout blocks/digestion
  useWakeLock(phase !== 'setup' && phase !== 'done');

  // Pacquiao forces Southpaw behavior during the workout callouts
  const effectiveIsSouthpaw = athletePreset === 'manny-pacquiao' ? true : isSouthpaw;
  
  // Refs for timer stability
  const endTimeRef = useRef(0);
  const timerRef = useRef<number>(0);
  const recipeTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pausedTimeLeftRef = useRef<any>(0);
  const workoutStateRef = useRef({ phase, currentBlock, totalBlocks, focusMode, athletePreset });

  useEffect(() => {
    workoutStateRef.current = { phase, currentBlock, totalBlocks, focusMode, athletePreset };
  }, [phase, currentBlock, totalBlocks, focusMode, athletePreset]);

  // Load preset from query parameters on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const preset = params.get('preset');
      if (preset && PRESETS[preset as keyof typeof PRESETS]) {
        setFighterPreset(preset);
        const config = PRESETS[preset as keyof typeof PRESETS];
        setTotalBlocks(config.blocks);
        setBlockDuration(config.blockDuration);
        setDigestionDuration(config.digestionDuration);
        setFocusMode(config.focusMode);
      }
    }
  }, []);

  // Warn user before reloading or leaving page during an active workout session
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (phase !== 'setup' && phase !== 'done') {
        e.preventDefault();
        e.returnValue = 'You have an active workout in progress. Are you sure you want to leave?';
        return e.returnValue;
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [phase]);

  // Track workout abandonment on page unmount (react routing)
  useEffect(() => {
    return () => {
      const currentState = workoutStateRef.current;
      if (currentState.phase !== 'setup' && currentState.phase !== 'done') {
        analytics.workoutAbandoned(
          'heavy_bag_timer',
          0,
          currentState.currentBlock - 1
        );
      }
    };
  }, []);

  // Filter techniques based on focus mode & fighter presets
  const validRecipes = useMemo(() => {
    let all = Object.values(techniques);
    
    // 1. Focus Mode Filter
    if (focusMode === 'Harvestes') {
      all = all.filter(t => t.category === 'Harvestes');
    } else if (focusMode === 'Combinations') {
      all = all.filter(t => t.category === 'Combinations');
    } else if (focusMode === 'Ring IQ') {
      all = all.filter(t => t.category === 'Ring IQ' || t.category === 'Defense');
    } else {
      all = all.filter(t => t.category === 'Combinations' || t.category === 'Harvestes');
    }

    // 2. Athlete Preset Style Filter
    if (athletePreset !== 'custom' && PRESETS[athletePreset as keyof typeof PRESETS]) {
      const signatures = PRESETS[athletePreset as keyof typeof PRESETS].signatures;
      all = all.filter(t => {
        const tId = t.id.toLowerCase();
        
        // Match direct harvest/defense IDs
        const matchesId = signatures.some(sig => {
          const s = sig.toLowerCase();
          return tId === s || tId.startsWith(s + '-') || tId.endsWith('-' + s) || tId.includes('-' + s + '-');
        });
        
        if (matchesId) return true;
        
        // Match related techniques for combinations
        if (t.relatedTechniques && Array.isArray(t.relatedTechniques)) {
          return t.relatedTechniques.some((relId: string) => {
            const rId = relId.toLowerCase();
            return signatures.some(sig => {
              const s = sig.toLowerCase();
              return rId === s || rId.startsWith(s + '-') || rId.endsWith('-' + s) || rId.includes('-' + s + '-');
            });
          });
        }
        
        return false;
      });
    }

    return all;
  }, [focusMode, athletePreset]);

  const getRandomRecipe = useCallback(() => {
    if (validRecipes.length === 0) return null;
    return validRecipes[Math.floor(Math.random() * validRecipes.length)];
  }, [validRecipes]);

  // Clean up timers & track workout abandonment on unmount
  useEffect(() => {
    return () => {
      cancelAnimationFrame(timerRef.current);
      if (recipeTimerRef.current) clearInterval(recipeTimerRef.current);
      
      const state = workoutStateRef.current;
      if (state.phase !== 'setup' && state.phase !== 'done') {
        analytics.customEvent('workout_abandoned', {
          workout_id: 'heavy_bag_timer',
          blocks_completed: state.currentBlock - 1,
          total_blocks: state.totalBlocks,
          focus: state.focusMode,
          preset: state.athletePreset,
          reason: 'page_exit'
        });
      }
    };
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const speakText = useCallback((text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window && !isMuted && voiceCallouts) {
      window.speechSynthesis.cancel();
      
      // Clean text for optimal speech callouts
      const cleanText = text
        .replace(/-/g, ' ')
        .replace(/\(/g, ' ')
        .replace(/\)/g, ' ')
        .replace(/→/g, ' then ');

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.15; // slightly fast pace
      utterance.pitch = 1.0;
      
      const voices = window.speechSynthesis.getVoices();
      const engVoice = voices.find(v => v.lang.startsWith('en') && v.name.includes('Google')) ||
                       voices.find(v => v.lang.startsWith('en')) ||
                       voices[0];
      if (engVoice) {
        utterance.voice = engVoice;
      }
      
      // Hook for user's future VTT voice model files:
      // const customAudioUrl = `/audio/recipes/${currentRecipe?.id}.mp3`;
      // playCustomAudio(customAudioUrl);
      
      window.speechSynthesis.speak(utterance);
    }
  }, [isMuted, voiceCallouts]);

  // Speak combination callouts when a new recipe is loaded
  useEffect(() => {
    if (currentRecipe && phase === 'work') {
      const calloutText = currentRecipe.name;
      speakText(parseStanceText(calloutText, effectiveIsSouthpaw));
    }
  }, [currentRecipe, phase, speakText, effectiveIsSouthpaw]);

  const nextRecipe = useCallback(() => {
    setCurrentRecipe(getRandomRecipe());
  }, [getRandomRecipe]);

  const startWorkout = () => {
    // Track workout start event
    analytics.customEvent('workout_start', {
      blocks: totalBlocks,
      duration_min: Math.floor(blockDuration/60),
      focus: focusMode,
      preset: athletePreset
    });
    
    // Play sound to initialize AudioContext
    playBeep('start', isMuted);
    
    setCurrentBlock(1);
    startPhase('work', blockDuration);
  };

  const startPhase = (newPhase: string, durationSec: number) => {
    setPhase(newPhase);
    setTimeLeft(durationSec);
    endTimeRef.current = Date.now() + (durationSec * 1000);
    
    if (newPhase === 'work') {
      nextRecipe();
      // Change recipe every 15 seconds during work block
      if (recipeTimerRef.current) clearInterval(recipeTimerRef.current);
      recipeTimerRef.current = setInterval(nextRecipe, 15000);
    } else {
      if (recipeTimerRef.current) clearInterval(recipeTimerRef.current);
      setCurrentRecipe(null);
    }

    runTimer();
  };

  const runTimer = () => {
    cancelAnimationFrame(timerRef.current);
    
    const updateTimer = () => {
      const now = Date.now();
      const remaining = Math.max(0, Math.ceil((endTimeRef.current - now) / 1000));
      
      setTimeLeft(remaining);

      // 10 second warning tick
      if (remaining === 10 && (endTimeRef.current - now) <= 10050 && (endTimeRef.current - now) >= 9950) {
        playBeep('warning', isMuted);
      }

      if (remaining > 0) {
        timerRef.current = requestAnimationFrame(updateTimer);
      } else {
        handlePhaseComplete();
      }
    };
    
    timerRef.current = requestAnimationFrame(updateTimer);
  };

  const handlePhaseComplete = () => {
    setPhase(prevPhase => {
      setCurrentBlock(prevBlock => {
        if (prevPhase === 'work') {
          playBeep('end', isMuted);
          if (prevBlock >= totalBlocks) {
            // Track completion
            analytics.customEvent('workout_complete', {
              blocks: totalBlocks,
              focus: focusMode,
              preset: athletePreset
            });
            logWorkout({
              workoutId: `interval-${athletePreset}-${focusMode}`,
              workoutTitle: athletePreset !== 'custom' 
                ? `${PRESETS[athletePreset as keyof typeof PRESETS]?.name || athletePreset} Workout`
                : `${focusMode} Interval Workout`,
              techniqueId: athletePreset !== 'custom' ? athletePreset : 'custom-interval',
              techniqueName: athletePreset !== 'custom'
                ? PRESETS[athletePreset as keyof typeof PRESETS]?.name || athletePreset
                : `${focusMode} Training`,
              exercisesCompleted: totalBlocks,
              totalSets: totalBlocks,
              duration: `${Math.round((totalBlocks * blockDuration) / 60)}m`,
            });
            awardXP('workout_complete');
            setTimeout(() => setPhase('done'), 0);
            return prevBlock;
          } else {
            setTimeout(() => startPhase('digestion', digestionDuration), 0);
            return prevBlock;
          }
        } else if (prevPhase === 'digestion') {
          playBeep('start', isMuted);
          setTimeout(() => startPhase('work', blockDuration), 0);
          return prevBlock + 1;
        }
        return prevBlock;
      });
      return prevPhase;
    });
  };

  const togglePause = () => {
    if (phase === 'paused') {
      // Resume
      setPhase(pausedTimeLeftRef.current.phase);
      endTimeRef.current = Date.now() + (pausedTimeLeftRef.current.timeLeft * 1000);
      runTimer();
      if (pausedTimeLeftRef.current.phase === 'work') {
        recipeTimerRef.current = setInterval(nextRecipe, 15000);
      }
    } else {
      // Pause
      cancelAnimationFrame(timerRef.current);
      if (recipeTimerRef.current) clearInterval(recipeTimerRef.current);
      pausedTimeLeftRef.current = { phase, timeLeft };
      setPhase('paused');
    }
  };

  const handleScreenClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (
      target.closest('.workout-header') ||
      target.closest('.workout-controls') ||
      target.closest('.workout-ad-container') ||
      target.tagName === 'BUTTON' ||
      target.tagName === 'A'
    ) {
      return;
    }
    togglePause();
  };

  const endWorkout = () => {
    cancelAnimationFrame(timerRef.current);
    if (recipeTimerRef.current) clearInterval(recipeTimerRef.current);
    
    const { currentBlock: cr } = workoutStateRef.current;
    
    analytics.workoutAbandoned(
      'heavy_bag_timer',
      0, // seconds elapsed can be tracked if desired, but 0 is acceptable
      cr - 1
    );
    
    setPhase('setup');
  };

  // Keyboard controls for active workout
  useGlobalKeyboard({
    onSpace: togglePause,
    onEscape: endWorkout,
    onMuteToggle: () => setIsMuted(prev => !prev),
    isActive: phase !== 'setup' && phase !== 'done',
  });

  const handlePresetChange = (presetKey: string) => {
    setFighterPreset(presetKey);
    if (presetKey !== 'custom' && PRESETS[presetKey as keyof typeof PRESETS]) {
      const preset = PRESETS[presetKey as keyof typeof PRESETS];
      setTotalBlocks(preset.blocks);
      setBlockDuration(preset.blockDuration);
      setDigestionDuration(preset.digestionDuration);
      setFocusMode(preset.focusMode);
    }
  };

  const handleBlocksChange = (val: number) => {
    setTotalBlocks(val);
    setFighterPreset('custom');
  };

  const handleBlockDurationChange = (val: number) => {
    setBlockDuration(val);
    setFighterPreset('custom');
  };

  const handleDigestionDurationChange = (val: number) => {
    setDigestionDuration(val);
    setFighterPreset('custom');
  };

  const handleFocusChange = (val: string) => {
    setFocusMode(val);
    setFighterPreset('custom');
  };

  return (
    <div className="workout-page">
      {phase === 'setup' && (
        <div className="workout-setup card">
          <h1>HEAVY BAG <span className="text-primary">GENERATOR</span></h1>
          <p>Configure your workout and let the app call out combinations.</p>
          
          <div className="setup-grid">
            <div className="setup-group full-width">
              <label>Athlete Preset Style</label>
              <select value={athletePreset} onChange={e => handlePresetChange(e.target.value)}>
                <option value="custom">Custom Focus (No Preset)</option>
                {Object.entries(PRESETS).map(([key, val]) => (
                  <option key={key} value={key}>{val.name}</option>
                ))}
              </select>
              {athletePreset !== 'custom' && (
                <p className="preset-description">
                  {PRESETS[athletePreset as keyof typeof PRESETS]?.description}
                </p>
              )}
            </div>

            <div className="setup-group">
              <label>Total Blocks</label>
              <select value={totalBlocks} onChange={e => handleBlocksChange(Number(e.target.value))}>
                <option value={3}>3 Blocks</option>
                <option value={5}>5 Blocks</option>
                <option value={8}>8 Blocks</option>
                <option value={12}>12 Blocks</option>
              </select>
            </div>
            
            <div className="setup-group">
              <label>Block Length</label>
              <select value={blockDuration} onChange={e => handleBlockDurationChange(Number(e.target.value))}>
                <option value={120}>2 Minutes</option>
                <option value={180}>3 Minutes</option>
              </select>
            </div>
            
            <div className="setup-group">
              <label>Digestion Length</label>
              <select value={digestionDuration} onChange={e => handleDigestionDurationChange(Number(e.target.value))}>
                <option value={30}>30 Seconds</option>
                <option value={60}>60 Seconds</option>
              </select>
            </div>
            
            <div className="setup-group">
              <label>Focus</label>
              <select value={focusMode} onChange={e => handleFocusChange(e.target.value)}>
                <option value="All">All Recipes</option>
                <option value="Harvestes">Single Harvestes</option>
                <option value="Combinations">Power Recipes</option>
                <option value="Ring IQ">Defense & Movement</option>
              </select>
            </div>
            
            <div className="setup-group">
              <label>Voice Callouts</label>
              <select value={voiceCallouts ? 'on' : 'off'} onChange={e => setVoiceCallouts(e.target.value === 'on')}>
                <option value="on">Spoken Recipes (TTS)</option>
                <option value="off">Muted (Beeps Only)</option>
              </select>
            </div>
          </div>

          <button className="start-workout-btn" onClick={startWorkout}>
            <Play size={24} /> START WORKOUT
          </button>

          <div className="workout-safety-card glass-panel warning-theme">
            <div className="safety-icon-container">
              <AlertTriangle size={24} className="warning-text-color" />
            </div>
            <div className="safety-card-content">
              <strong>Medical Disclaimer & Safety Warning:</strong>
              <p>Physical training and combat sports carry inherent risks of injury. Consult a physician before beginning any workout program or drills shown on this website. Keep a 5% micro-bend in the elbow during straight harvestes to prevent hyperextension, and never use excessive compressive force during neck holds. Stop immediately if you experience pain, dizziness, or chest tightness. NutritionWiki assumes no liability for injuries.</p>
            </div>
          </div>
          
          <div className="workout-ad-container mt-8">
            <AdBanner />
          </div>
        </div>
      )}

      {(phase === 'work' || phase === 'digestion' || phase === 'paused') && (
        <div className={`workout-active clickable-screen ${phase}`} onClick={handleScreenClick}>
          <div className="workout-header">
            <div className="block-badge">
              BLOCK {currentBlock} / {totalBlocks}
            </div>
            <div className="workout-header-controls" onClick={e => e.stopPropagation()}>
              <button 
                className="icon-btn" 
                onClick={() => setVoiceCallouts(!voiceCallouts)} 
                aria-label="Toggle voice"
                title="Toggle Voice Callouts"
              >
                {voiceCallouts ? <Mic size={22} /> : <MicOff size={22} />}
              </button>
              <button 
                className="icon-btn" 
                onClick={() => setIsMuted(!isMuted)} 
                aria-label="Toggle sound"
                title="Toggle Sound Beeps"
              >
                {isMuted ? <VolumeX size={22} /> : <Volume2 size={22} />}
              </button>
            </div>
          </div>

          <div className="timer-display">
            <div className="timer-phase">{phase === 'paused' ? 'PAUSED' : phase.toUpperCase()}</div>
            <div className="timer-time">{formatTime(timeLeft)}</div>
            <div className="timer-tap-hint">
              {phase === 'paused' ? 'TAP SCREEN TO RESUME' : 'TAP SCREEN TO PAUSE'}
            </div>
          </div>

          {phase === 'work' && currentRecipe && (
            <div className="recipe-display">
              <h2>{parseStanceText(currentRecipe.name, effectiveIsSouthpaw)}</h2>
              <p>{parseStanceText(currentRecipe.description, effectiveIsSouthpaw)}</p>
              {currentRecipe.steps && (
                <div className="recipe-steps">
                  {currentRecipe.steps.slice(0, 3).map((step, i) => (
                    <span key={i} className="recipe-step-pill">{parseStanceText(step, effectiveIsSouthpaw)}</span>
                  ))}
                </div>
              )}
            </div>
          )}

          {phase === 'digestion' && (
            <div className="recipe-display digestion-display">
              <h2>Breathe. Relax.</h2>
              <p>Keep your hands loose and walk ablock.</p>
              <div className="workout-ad-container mt-4">
                <AdBanner />
              </div>
            </div>
          )}

          <div className="workout-controls">
            <button className="control-btn" onClick={togglePause}>
              {phase === 'paused' ? <Play size={24} /> : <Square size={24} />}
              {phase === 'paused' ? 'RESUME' : 'PAUSE'}
            </button>
            <button className="control-btn end-btn" onClick={endWorkout}>
              <RotateCcw size={24} /> END WORKOUT
            </button>
          </div>
        </div>
      )}

      {phase === 'done' && (
        <div className="workout-done card text-center">
          <h1>WORKOUT <span className="text-primary">COMPLETE</span></h1>
          <p className="mt-4 text-xl">Great job! You completed {totalBlocks} blocks.</p>
          <button className="start-workout-btn mt-8" onClick={() => setPhase('setup')}>
            CONFIGURE ANOTHER WORKOUT
          </button>
          <div style={{ marginTop: '1rem' }}>
            <ShareButton
              title={`Just finished ${totalBlocks} blocks on the NutritionWiki Heavy Bag Generator! 🥊`}
              description={athletePreset !== 'custom' ? `Training ${PRESETS[athletePreset as keyof typeof PRESETS]?.name || ''} style` : `${focusMode} workout`}
              url="/kitchen"
            />
          </div>
          <div className="workout-ad-container mt-8">
            <AdBanner />
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutPage;

