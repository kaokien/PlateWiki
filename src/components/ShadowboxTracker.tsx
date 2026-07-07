'use client';
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Camera, VideoOff, Play, Volume2, VolumeX, Trophy, Zap, Flame, Target, RotateCcw, BookOpen, CheckCircle, HelpCircle, ChevronRight, Settings, BarChart2, X, Plus, Trash2 } from 'lucide-react';
import { analytics, getTrainingStats, saveTrainingStats, trackPunchRep, trackBlitzSession, trackTimeActive } from '../utils/analytics';
import { TRAINING_COMBOS, type Combo, type ComboStep } from '../data/combos';
import {
  MOVE_LIBRARY, MAX_STEPS, MIN_STEPS, MAX_NAME_LENGTH, MAX_CUSTOM_COMBOS,
  buildCustomCombo, getCustomCombos, saveCustomCombo, deleteCustomCombo, isCustomCombo,
} from '../utils/customCombos';
import { safeStorage } from '../utils/safeStorage';
import ShareButton from './ShareButton';
import './ShadowboxTracker.css';

// â”€â”€â”€ Game Config â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const ROUND_DURATION = 30; // seconds per round
const NUM_BLOCKS = 3;
const REST_DURATION = 15; // seconds between blocks
const CANVAS_W = 160;
const CANVAS_H = 120;

// Target spawn timing by difficulty (ms)
const SPAWN_INTERVAL = [1800, 1400, 1000]; // per round
const TARGET_LIFETIME = [2200, 1800, 1400]; // ms before miss

// Zone grid: 3 columns × 2 rows = 6 zones
const ZONE_COLS = 3;
const ZONE_ROWS = 2;

type GamePhase = 'idle' | 'countdown' | 'playing' | 'rest' | 'results';

interface GameTarget {
  id: number;
  zone: number; // 0-5
  createdAt: number;
  lifetime: number;
  hit: boolean;
}

interface FrameHistoryEntry {
  data: Uint8ClampedArray;
  timestamp: number;
}

interface PracticeTechnique {
  id: string;
  name: string;
  type: string;
  instructions: string[];
  tips: string[];
  repCues: string[];
  zones: {
    orthodox: number;
    southpaw: number;
  };
}

const PRACTICE_TECHNIQUES: PracticeTechnique[] = [
  {
    id: 'sweet-potato',
    name: 'Sweet Potatoes',
    type: 'Glycogen Carb Loading',
    instructions: [
      'Reach and harvest sweet potatoes from the lower soil zones.',
      'Keep your core engaged as you bend slightly to reach.',
      'Recover to your upright organic stance.',
      'Exhale and focus on your breathing during the pull.'
    ],
    tips: [
      'Form Check: Keep your hips centered to protect your lower back.',
      'Common Mistake: Grabbing too fast without stabilizing your core.'
    ],
    repCues: [
      'One. Reach down into the soil.',
      'Two. Grab the sweet potato.',
      'Three. Pull it up cleanly.',
      'Four. Exhale as you lift.',
      'Five! Excellent Sweet Potato harvest.'
    ],
    zones: {
      orthodox: 3, // Bottom Left
      southpaw: 5  // Bottom Right
    }
  },
  {
    id: 'whey-isolate',
    name: 'Whey Protein Isolate',
    type: 'Anabolic Repair Block',
    instructions: [
      'Reach high to grab clean whey jars from the top shelves.',
      'Extend your arm fully, stretching your shoulders and traps.',
      'Keep your opposite guard up to maintain balance.',
      'Snap your hand back to your center line immediately.'
    ],
    tips: [
      'Form Check: Extend your arm straight along the line of sight.',
      'Common Mistake: Dropping your guard when reaching.'
    ],
    repCues: [
      'One. Reach for the top shelf.',
      'Two. Grab the protein jar.',
      'Three. Bring it back to center.',
      'Four. Keep your chin tucked.',
      'Five! Perfect protein reach.'
    ],
    zones: {
      orthodox: 2, // Top Right
      southpaw: 0  // Top Left
    }
  },
  {
    id: 'blueberries',
    name: 'Wild Blueberries',
    type: 'Antioxidant Gathering',
    instructions: [
      'Gather fresh wild blueberries from the middle branch zones.',
      'Use horizontal sweeping hand motions to collect the berries.',
      'Keep your elbow bent at 90 degrees as you sweep.',
      'Maintain your posture and turn your hips with the motion.'
    ],
    tips: [
      'Form Check: Align your elbow and hand vertically during the sweep.',
      'Common Mistake: Swinging too wide and losing balance.'
    ],
    repCues: [
      'One. Sweep your arm horizontally.',
      'Two. Keep the elbow bent at ninety degrees.',
      'Three. Gblock your feet.',
      'Four. Gather the berries.',
      'Five! Successful blueberry harvest.'
    ],
    zones: {
      orthodox: 2, // Top/Middle Right
      southpaw: 0  // Top/Middle Left
    }
  },
  {
    id: 'ginger',
    name: 'Fresh Ginger Root',
    type: 'Digestive Inflammation Control',
    instructions: [
      'Uproot fresh ginger from the bottom soil zones.',
      'Squat slightly to load power in your legs.',
      'Drive upward and lift the ginger roots cleanly.',
      'Keep your opposite hand guarding your center.'
    ],
    tips: [
      'Form Check: Use leg extension and hip rotation for power, not just arm swing.',
      'Common Mistake: Dropping your head below your waist.'
    ],
    repCues: [
      'One. Squat down slightly.',
      'Two. Reach for the ginger.',
      'Three. Lift upward with your legs.',
      'Four. Rotate your hips.',
      'Five! Solid ginger harvest.'
    ],
    zones: {
      orthodox: 0, // Top Left (Right hand rear)
      southpaw: 2  // Top Right (Left hand rear)
    }
  }
];

const renderPunchTrajectorySvg = (name: string) => {
  const normalized = name.toLowerCase();
  if (normalized.includes('hook')) {
    // Curved hook arrow
    return (
      <svg className="punch-trajectory-svg hook-arrow" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M 15 55 C 20 80, 80 80, 80 45" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeDasharray="4 4" className="trajectory-path-back" />
        <path d="M 15 55 C 20 80, 80 80, 80 45" stroke="currentColor" strokeWidth="6" strokeLinecap="round" className="trajectory-path" />
        <path d="M 68 55 L 80 45 L 83 58" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  } else if (normalized.includes('uppercut')) {
    // Upward uppercut arrow
    return (
      <svg className="punch-trajectory-svg uppercut-arrow" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M 50 85 C 30 75, 30 45, 50 25" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeDasharray="4 4" className="trajectory-path-back" />
        <path d="M 50 85 C 30 75, 30 45, 50 25" stroke="currentColor" strokeWidth="6" strokeLinecap="round" className="trajectory-path" />
        <path d="M 38 35 L 50 23 L 59 34" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  } else if (normalized.includes('slip')) {
    // Slip / Dodge guide
    return (
      <svg className="punch-trajectory-svg slip-guide" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="35" r="14" stroke="currentColor" strokeWidth="5" strokeDasharray="3 3" />
        <path d="M 50 58 Q 30 65 20 50" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeDasharray="4 4" className="trajectory-path-back" />
        <path d="M 50 58 Q 30 65 20 50" stroke="currentColor" strokeWidth="5" strokeLinecap="round" className="trajectory-path" />
        <path d="M 28 48 L 18 48 L 18 58" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  } else {
    // Straight arrow (Jab/Cross/Generic)
    return (
      <svg className="punch-trajectory-svg straight-arrow" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M 50 85 L 50 22" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeDasharray="4 4" className="trajectory-path-back" />
        <path d="M 50 85 L 50 22" stroke="currentColor" strokeWidth="6" strokeLinecap="round" className="trajectory-path" />
        <path d="M 36 36 L 50 20 L 64 36" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
};

interface ShadowboxTrackerProps {
  initialMode?: string;
  initialTech?: string;
}

const ShadowboxTracker = ({ initialMode, initialTech }: ShadowboxTrackerProps = {}) => {
  // Camera
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Game state
  const [phase, setPhase] = useState<GamePhase>('idle');
  const [countdownValue, setCountdownValue] = useState(3);
  const [round, setRound] = useState(1);
  const [timeLeft, setTimeLeft] = useState(ROUND_DURATION);
  const [score, setScore] = useState(0);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [targets, setTargets] = useState<GameTarget[]>([]);
  const [flashZone, setFlashZone] = useState<number | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [highScore, setHighScore] = useState(0);
  const [lastHitText, setLastHitText] = useState<string | null>(null);

  // Focus Practice mode state
  const [mode, setMode] = useState<'blitz' | 'practice'>(
    initialMode === 'practice' ? 'practice' : 'blitz'
  );
  const [stance, setStance] = useState<'orthodox' | 'southpaw'>('orthodox');
  const [activePracticeIdx, setActivePracticeIdx] = useState<number>(() => {
    if (!initialTech) return 0;
    const mappedTech = initialTech === 'lead-hook' || initialTech === 'blueberries' ? 'blueberries' : initialTech === 'rear-uppercut' || initialTech === 'ginger' ? 'ginger' : initialTech === 'sweet-potato' ? 'sweet-potato' : initialTech === 'whey-isolate' ? 'whey-isolate' : initialTech;
    const idx = PRACTICE_TECHNIQUES.findIndex(t => t.id === mappedTech || t.id === initialTech);
    return idx !== -1 ? idx : 0;
  });
  const [practiceSuccess, setPracticeSuccess] = useState<boolean>(false);
  const [practiceReps, setPracticeReps] = useState<number>(0);
  const [advanceCountdown, setAdvanceCountdown] = useState<number | null>(null);

  // Combo Practice mode state
  const [practiceSubMode, setPracticeSubMode] = useState<'single' | 'combo'>('single');
  const [activeComboIdx, setActiveComboIdx] = useState<number>(0);

  // Custom combos (user-created, stored locally) + builder modal state
  const [customCombos, setCustomCombos] = useState<Combo[]>([]);
  const [builderOpen, setBuilderOpen] = useState(false);
  const [builderName, setBuilderName] = useState('');
  const [builderSeq, setBuilderSeq] = useState<ComboStep[]>([]);
  useEffect(() => { setCustomCombos(getCustomCombos()); }, []);
  const allCombos = useMemo(() => [...TRAINING_COMBOS, ...customCombos], [customCombos]);
  const [comboStepIdx, setComboStepIdx] = useState<number>(0);
  const [comboSuccess, setComboSuccess] = useState<boolean>(false);
  const [comboReps, setComboReps] = useState<number>(0);
  const lastComboStepTimeRef = useRef<number>(0);

  // Calibration & Settings Panel state
  const [sensitivity, setSensitivity] = useState<number>(12);
  const [velocityMult, setVelocityMult] = useState<number>(1.5);
  const [mirrorCamera, setMirrorCamera] = useState<boolean>(true);
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  const [analyticsOpen, setAnalyticsOpen] = useState<boolean>(false);

  // Recording states
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [activeMobileTab, setActiveMobileTab] = useState<'left' | 'right'>('left');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const getTabLabels = () => {
    if (mode === 'practice') {
      return {
        left: practiceSubMode === 'single' ? 'CHECKLIST' : 'SEQUENCE',
        right: practiceSubMode === 'single' ? 'COACHING' : 'INFO'
      };
    } else {
      return {
        left: 'STATS',
        right: phase === 'results' ? 'RESULTS' : 'GUIDE'
      };
    }
  };

  const formatDuration = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameHistoryRef = useRef<FrameHistoryEntry[]>([]);
  const frameHistoryIndexRef = useRef<number>(0);
  const advanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const targetIdRef = useRef(0);
  const gameLoopRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const spawnTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const zoneMotionRef = useRef<number[]>(new Array(ZONE_COLS * ZONE_ROWS).fill(0));
  const streamRef = useRef<MediaStream | null>(null);
  const lastPracticeHitRef = useRef<number>(0);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sensitivityRef = useRef(12);
  const velocityMultRef = useRef(1.5);

  // Keep refs in sync
  useEffect(() => { sensitivityRef.current = sensitivity; }, [sensitivity]);
  useEffect(() => { velocityMultRef.current = velocityMult; }, [velocityMult]);
  useEffect(() => { streamRef.current = stream; }, [stream]);

  // Load high score & settings
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = safeStorage.getItem('bw_blitz_high_score');
      if (stored) setHighScore(parseInt(stored, 10));
      
      const savedSens = safeStorage.getItem('shadowbox_sensitivity');
      const savedMult = safeStorage.getItem('shadowbox_velocityMult');
      const savedMirror = safeStorage.getItem('shadowbox_mirrorCamera');
      if (savedSens) setSensitivity(parseInt(savedSens, 10));
      if (savedMult) setVelocityMult(parseFloat(savedMult));
      if (savedMirror) setMirrorCamera(savedMirror === 'true');
    }
  }, []);

  // Track active time when camera is active
  useEffect(() => {
    if (!cameraActive || !stream) return;
    const interval = setInterval(() => {
      trackTimeActive(1);
    }, 1000);
    return () => clearInterval(interval);
  }, [cameraActive, stream]);

  // â”€â”€â”€ iOS fix: set srcObject AFTER the <video> element renders â”€â”€â”€
  useEffect(() => {
    if (cameraActive && stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      // iOS requires explicit play() call
      videoRef.current.play().catch(e => console.warn('Video play failed:', e));
    }
  }, [cameraActive, stream]);

  // â”€â”€â”€ Audio â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  const playSound = useCallback((type: 'hit' | 'miss' | 'combo' | 'round') => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
        const AC = window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!AC) return;
        audioCtxRef.current = new AC();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();
      if (type === 'hit') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.06);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.12);
      } else if (type === 'miss') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(200, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      } else if (type === 'combo') {
        [523, 659, 784, 1047].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.06);
          gain.gain.setValueAtTime(0.12, ctx.currentTime + i * 0.06);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.06 + 0.12);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + i * 0.06);
          osc.stop(ctx.currentTime + i * 0.06 + 0.15);
        });
      } else if (type === 'round') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
      }
    } catch (e) { /* silence */ }
  }, [soundEnabled]);

  const speakForm = useCallback((text: string) => {
    if (!soundEnabled || typeof window === 'undefined') return;
    const synth = window.speechSynthesis;
    if (!synth) return;
    try {
      synth.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      synth.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis failed:', e);
    }
  }, [soundEnabled]);

  // Stop talking immediately if sound is turned off
  useEffect(() => {
    if (!soundEnabled && typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }, [soundEnabled]);

  // Trigger speech guide when activePracticeIdx or mode changes
  useEffect(() => {
    if (mode === 'practice' && cameraActive) {
      const activeTechnique = PRACTICE_TECHNIQUES[activePracticeIdx];
      if (activeTechnique) {
        const text = `Practice ${activeTechnique.name}. Form check. ${activeTechnique.tips[0].replace('Form Check: ', '')}`;
        speakForm(text);
      }
    }
  }, [activePracticeIdx, mode, cameraActive, speakForm]);

  // â”€â”€â”€ Camera â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  const startCamera = async () => {
    setCameraError(null);
    try {
      const userStream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
        audio: false,
      });
      setStream(userStream);
      setCameraActive(true);
      analytics.customEvent('blitz_camera_start', { success: true });
    } catch (err: unknown) {
      console.error('Camera access error:', err);
      setCameraError('Camera access denied. Check your browser permissions.');
      analytics.customEvent('blitz_camera_start', { success: false, error: err instanceof Error ? err.message : String(err) });
    }
  };

  // Mount effect to start camera if practice mode & technique parameter pre-selected
  useEffect(() => {
    if (initialMode === 'practice' && initialTech) {
      startCamera();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startRecording = useCallback(() => {
    if (!stream || isRecording) return;

    recordedChunksRef.current = [];
    setRecordingDuration(0);

    try {
      let options = { mimeType: 'video/webm;codecs=vp9' };
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options = { mimeType: 'video/webm;codecs=vp8' };
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
          options = { mimeType: 'video/webm' };
          if (!MediaRecorder.isTypeSupported(options.mimeType)) {
            options = { mimeType: 'video/mp4' }; // Fallback for Safari/iOS
          }
        }
      }

      const recorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const chunks = recordedChunksRef.current;
        if (chunks.length === 0) return;

        const activeTechnique = PRACTICE_TECHNIQUES[activePracticeIdx];
        const techId = activeTechnique ? activeTechnique.id : 'practice';
        const dateString = new Date().toISOString().split('T')[0];

        const mimeType = chunks[0].type || 'video/webm';
        const extension = mimeType.includes('mp4') ? 'mp4' : 'webm';

        const blob = new Blob(chunks, { type: mimeType });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `platewiki-${techId}-${dateString}.${extension}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        setTimeout(() => {
          URL.revokeObjectURL(url);
        }, 100);
      };

      recorder.start(1000);
      setIsRecording(true);

      recordingTimerRef.current = setInterval(() => {
        setRecordingDuration(prev => {
          const next = prev + 1;
          if (next >= 180) { // 3 minutes cap
            if (recordingTimerRef.current) {
              clearInterval(recordingTimerRef.current);
              recordingTimerRef.current = null;
            }
            recorder.stop();
            setIsRecording(false);
            return 180;
          }
          return next;
        });
      }, 1000);

    } catch (err) {
      console.error('Failed to start recording:', err);
    }
  }, [stream, isRecording, activePracticeIdx]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    setIsRecording(false);
  }, []);

  const stopCamera = () => {
    stopRecording();
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
    }
    setStream(null);
    setCameraActive(false);
    endGame();
  };

  // â”€â”€â”€ Zone motion detection â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  const processFrame = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) {
      animationFrameRef.current = requestAnimationFrame(processFrame);
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (ctx && video.readyState === video.HAVE_ENOUGH_DATA) {
      ctx.drawImage(video, 0, 0, CANVAS_W, CANVAS_H);
      const imgData = ctx.getImageData(0, 0, CANVAS_W, CANVAS_H);
      const data = imgData.data;

      const now = Date.now();
      const currentData = new Uint8ClampedArray(data);
      // Ring buffer: keep max 10 frames (covers ~150ms at 60fps)
      const MAX_FRAMES = 10;
      const hist = frameHistoryRef.current;
      if (hist.length < MAX_FRAMES) {
        hist.push({ data: currentData, timestamp: now });
      } else {
        const idx = frameHistoryIndexRef.current % MAX_FRAMES;
        hist[idx] = { data: currentData, timestamp: now };
        frameHistoryIndexRef.current++;
      }

      // Find the frame from approximately 100ms ago
      const targetTime = now - 100;
      let comparisonFrame = frameHistoryRef.current[0]?.data || currentData;
      let bestDiff = Math.abs((frameHistoryRef.current[0]?.timestamp || now) - targetTime);

      for (const entry of frameHistoryRef.current) {
        const diff = Math.abs(entry.timestamp - targetTime);
        if (diff < bestDiff) {
          bestDiff = diff;
          comparisonFrame = entry.data;
        }
      }

      const zoneW = Math.floor(CANVAS_W / ZONE_COLS);
      const zoneH = Math.floor(CANVAS_H / ZONE_ROWS);
      const zoneMotion = new Array(ZONE_COLS * ZONE_ROWS).fill(0);
      const zoneCounts = new Array(ZONE_COLS * ZONE_ROWS).fill(0);

      // Sample pixels and bucket into zones
      for (let y = 0; y < CANVAS_H; y += 3) {
        for (let x = 0; x < CANVAS_W; x += 3) {
          const i = (y * CANVAS_W + x) * 4;
          const v1 = 0.299 * data[i] + 0.587 * data[i+1] + 0.114 * data[i+2];
          const v2 = 0.299 * comparisonFrame[i] + 0.587 * comparisonFrame[i+1] + 0.114 * comparisonFrame[i+2];
          const diff = Math.abs(v1 - v2);

          const col = Math.min(Math.floor(x / zoneW), ZONE_COLS - 1);
          const row = Math.min(Math.floor(y / zoneH), ZONE_ROWS - 1);
          const zoneIdx = row * ZONE_COLS + col;
          zoneMotion[zoneIdx] += diff;
          zoneCounts[zoneIdx]++;
        }
      }

      // Normalize per zone
      for (let z = 0; z < zoneMotion.length; z++) {
        zoneMotion[z] = zoneCounts[z] > 0 ? zoneMotion[z] / zoneCounts[z] : 0;
      }
      zoneMotionRef.current = zoneMotion;
    }

    animationFrameRef.current = requestAnimationFrame(processFrame);
  }, []);

  // Start/stop frame processing with camera
  useEffect(() => {
    if (cameraActive) {
      processFrame();
    }
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [cameraActive, processFrame]);

  // â”€â”€â”€ Game logic â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  const spawnTarget = useCallback((roundIdx: number) => {
    const id = ++targetIdRef.current;
    // Pick a random zone, avoid repeating the last zone
    const zone = Math.floor(Math.random() * (ZONE_COLS * ZONE_ROWS));
    const lifetime = TARGET_LIFETIME[Math.min(roundIdx, TARGET_LIFETIME.length - 1)];
    setTargets(prev => [...prev, { id, zone, createdAt: Date.now(), lifetime, hit: false }]);
  }, []);

  const startGame = () => {
    if (!cameraActive) {
      startCamera();
      return;
    }
    setScore(0);
    setHits(0);
    setMisses(0);
    setStreak(0);
    setBestStreak(0);
    setRound(1);
    setTargets([]);
    setPhase('countdown');
    setCountdownValue(3);
    frameHistoryRef.current = []; // Reset frame comparison

    // 3-2-1 countdown
    let count = 3;
    setCountdownValue(count);
    const countdownInterval = setInterval(() => {
      count--;
      if (count <= 0) {
        clearInterval(countdownInterval);
        beginBlock(1);
      } else {
        setCountdownValue(count);
      }
    }, 1000);
  };

  const beginBlock = (roundNum: number) => {
    setPhase('playing');
    setRound(roundNum);
    setTimeLeft(ROUND_DURATION);
    setTargets([]);
    playSound('round');

    const roundIdx = roundNum - 1;
    const interval = SPAWN_INTERVAL[Math.min(roundIdx, SPAWN_INTERVAL.length - 1)];

    // Spawn targets on interval
    spawnTimerRef.current = setInterval(() => {
      spawnTarget(roundIdx);
    }, interval);

    // Spawn first immediately
    setTimeout(() => spawnTarget(roundIdx), 300);

    // Block timer
    let remaining = ROUND_DURATION;
    gameLoopRef.current = setInterval(() => {
      remaining--;
      setTimeLeft(remaining);
      if (remaining <= 0) {
        endBlock(roundNum);
      }
    }, 1000);
  };

  const endBlock = (roundNum: number) => {
    if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
    if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    setTargets([]);

    if (roundNum >= NUM_BLOCKS) {
      setPhase('results');
      // Save high score
      setScore(prev => {
        if (prev > highScore) {
          setHighScore(prev);
          safeStorage.setItem('bw_blitz_high_score', prev.toString());
        }
        trackBlitzSession(prev, hits, misses);
        return prev;
      });
      analytics.customEvent('blitz_game_complete', { score, hits, misses, bestStreak });
    } else {
      // Rest period
      setPhase('rest');
      setTimeLeft(REST_DURATION);
      let restRemaining = REST_DURATION;
      gameLoopRef.current = setInterval(() => {
        restRemaining--;
        setTimeLeft(restRemaining);
        if (restRemaining <= 0) {
          if (gameLoopRef.current) clearInterval(gameLoopRef.current);
          beginBlock(roundNum + 1);
        }
      }, 1000);
    }
  };

  const endGame = () => {
    if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
    if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    setPhase('idle');
    setTargets([]);
  };

  // â”€â”€â”€ Target hit detection (runs every frame via game tick) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  useEffect(() => {
    if (phase !== 'playing') return;

    const checkInterval = setInterval(() => {
      const now = Date.now();
      const zoneMotion = zoneMotionRef.current;
      const HIT_THRESHOLD = sensitivityRef.current; // calibrated motion energy needed in zone

      setTargets(prev => {
        let anyHit = false;
        let anyMiss = false;

        const updated = prev.map(t => {
          if (t.hit) return t;

          // Check if expired
          if (now - t.createdAt > t.lifetime) {
            anyMiss = true;
            return { ...t, hit: true }; // mark as processed
          }

          // Check zone motion using localized motion detection
          const motion = zoneMotion[t.zone] || 0;
          const sumOther = zoneMotion.reduce((sum, val, idx) => idx !== t.zone ? sum + val : sum, 0);
          const avgOther = sumOther / (zoneMotion.length - 1);

          if (motion > HIT_THRESHOLD && motion > avgOther * velocityMultRef.current) {
            anyHit = true;
            return { ...t, hit: true };
          }

          return t;
        });

        if (anyHit) {
          // Calculate points
          setStreak(s => {
            const newStreak = s + 1;
            setBestStreak(b => Math.max(b, newStreak));
            const multiplier = Math.min(newStreak, 5);
            const points = 10 * multiplier;
            setScore(sc => sc + points);
            setLastHitText(`+${points}${multiplier > 1 ? ` ×${multiplier}` : ''}`);
            setTimeout(() => setLastHitText(null), 600);
            if (newStreak > 0 && newStreak % 5 === 0) {
              playSound('combo');
            } else {
              playSound('hit');
            }
            return newStreak;
          });
          setHits(h => h + 1);
        }

        if (anyMiss && !anyHit) {
          setStreak(0);
          setMisses(m => m + 1);
          playSound('miss');
        }

        // Clean up old processed targets
        return updated.filter(t => !t.hit || now - t.createdAt < 400);
      });
    }, 80); // check ~12 times per second

    return () => clearInterval(checkInterval);
  }, [phase, playSound]);

  // â”€â”€â”€ Harvest Practice Detection Loop â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  useEffect(() => {
    if (mode !== 'practice' || !cameraActive) return;

    const checkInterval = setInterval(() => {
      const now = Date.now();

      if (practiceSubMode === 'single') {
        const activeTechnique = PRACTICE_TECHNIQUES[activePracticeIdx];
        if (!activeTechnique) return;

        const targetZone = activeTechnique.zones[stance];
        const motion = zoneMotionRef.current[targetZone] || 0;
        const HIT_THRESHOLD = sensitivityRef.current;

        const zoneMotion = zoneMotionRef.current;
        const sumOther = zoneMotion.reduce((sum, val, idx) => idx !== targetZone ? sum + val : sum, 0);
        const avgOther = sumOther / (zoneMotion.length - 1);

        if (motion > HIT_THRESHOLD && motion > avgOther * velocityMultRef.current && !practiceSuccess) {
          if (now - lastPracticeHitRef.current > 1200) { // 1.2s recovery cooldown to snap back guard
            lastPracticeHitRef.current = now;
            
            setFlashZone(targetZone);
            setTimeout(() => setFlashZone(null), 300);

            // Record a rep in the analytics database layer
            trackPunchRep(1);

            setPracticeReps(prev => {
              const next = prev + 1;
              const REQUIRED_REPS = 5;
              
              if (next >= REQUIRED_REPS) {
                setPracticeSuccess(true);
                playSound('combo');
                if (activeTechnique.repCues && activeTechnique.repCues[4]) {
                  speakForm(activeTechnique.repCues[4]);
                } else {
                  speakForm("Five. Excellent!");
                }
              } else {
                playSound('hit');
                if (activeTechnique.repCues && activeTechnique.repCues[next - 1]) {
                  speakForm(activeTechnique.repCues[next - 1]);
                } else {
                  speakForm(`${next}`);
                }
              }
              return next;
            });
          }
        }
      } else {
        // Combo sub-mode sequence check
        const activeCombo = allCombos[activeComboIdx];
        if (!activeCombo) return;

        // Auto-reset recipe step index if timed out
        if (comboStepIdx > 0 && now - lastComboStepTimeRef.current > 2000) {
          setComboStepIdx(0);
          speakForm("Combo reset. Try again.");
          playSound('miss');
          lastComboStepTimeRef.current = now;
          return;
        }

        const currentStep = activeCombo.sequence[comboStepIdx];
        if (!currentStep) return;

        const targetZone = currentStep.zones[stance];
        const motion = zoneMotionRef.current[targetZone] || 0;
        const HIT_THRESHOLD = sensitivityRef.current;

        const zoneMotion = zoneMotionRef.current;
        const sumOther = zoneMotion.reduce((sum, val, idx) => idx !== targetZone ? sum + val : sum, 0);
        const avgOther = sumOther / (zoneMotion.length - 1);

        if (motion > HIT_THRESHOLD && motion > avgOther * velocityMultRef.current && !comboSuccess) {
          if (now - lastPracticeHitRef.current > 600) { // faster recovery for sequence chaining
            lastPracticeHitRef.current = now;
            lastComboStepTimeRef.current = now;

            setFlashZone(targetZone);
            setTimeout(() => setFlashZone(null), 300);

            // Record a step rep in our analytics database layer
            trackPunchRep(1);

            const nextStep = comboStepIdx + 1;
            if (nextStep >= activeCombo.sequence.length) {
              // Combo Completed!
              playSound('combo');
              setComboStepIdx(0);
              
              setComboReps(prev => {
                const nextReps = prev + 1;
                const REQUIRED_REPS = 5;
                if (nextReps >= REQUIRED_REPS) {
                  setComboSuccess(true);
                  speakForm("Five recipes completed. Well done!");
                } else {
                  speakForm(`Combo completed! Rep ${nextReps}`);
                }
                return nextReps;
              });
            } else {
              // Step completed, cue up the next one
              playSound('hit');
              setComboStepIdx(nextStep);
              const nextStepInfo = activeCombo.sequence[nextStep];
              if (nextStepInfo) {
                speakForm(nextStepInfo.cue);
              }
            }
          }
        }
      }
    }, 100);

    return () => clearInterval(checkInterval);
  }, [mode, cameraActive, activePracticeIdx, activeComboIdx, comboStepIdx, stance, practiceSuccess, comboSuccess, practiceSubMode, playSound, speakForm, allCombos]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
      if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  // â”€â”€â”€ Auto-Advance Logic for Focus & Combo Practice â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  useEffect(() => {
    const isSuccess = practiceSubMode === 'single' ? practiceSuccess : comboSuccess;
    if (mode === 'practice' && isSuccess) {
      setAdvanceCountdown(10);
      let count = 10;
      
      advanceTimerRef.current = setInterval(() => {
        count--;
        setAdvanceCountdown(count);
        if (count <= 0) {
          if (advanceTimerRef.current) clearInterval(advanceTimerRef.current);
          advanceTimerRef.current = null;
          setAdvanceCountdown(null);
          if (practiceSubMode === 'single') {
            setActivePracticeIdx(prev => (prev + 1) % PRACTICE_TECHNIQUES.length);
            setPracticeSuccess(false);
            setPracticeReps(0);
          } else {
            setActiveComboIdx(prev => (prev + 1) % allCombos.length);
            setComboSuccess(false);
            setComboReps(0);
            setComboStepIdx(0);
          }
        }
      }, 1000);
    }

    return () => {
      if (advanceTimerRef.current) {
        if (advanceTimerRef.current) clearInterval(advanceTimerRef.current);
        advanceTimerRef.current = null;
      }
      setAdvanceCountdown(null);
    };
  }, [mode, practiceSuccess, comboSuccess, practiceSubMode]);

  const handleNextTechnique = useCallback(() => {
    if (advanceTimerRef.current) {
      if (advanceTimerRef.current) clearInterval(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }
    setAdvanceCountdown(null);
    if (practiceSubMode === 'single') {
      setActivePracticeIdx(prev => (prev + 1) % PRACTICE_TECHNIQUES.length);
      setPracticeSuccess(false);
      setPracticeReps(0);
    } else {
      setActiveComboIdx(prev => (prev + 1) % allCombos.length);
      setComboSuccess(false);
      setComboReps(0);
      setComboStepIdx(0);
    }
  }, [practiceSubMode]);

  const switchMode = (newMode: 'blitz' | 'practice') => {
    if (advanceTimerRef.current) {
      if (advanceTimerRef.current) clearInterval(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }
    setAdvanceCountdown(null);
    setPracticeSuccess(false);
    setPracticeReps(0);
    setComboSuccess(false);
    setComboReps(0);
    setComboStepIdx(0);
    setMode(newMode);
  };

  // â”€â”€â”€ Helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  const getZonePosition = (zone: number) => {
    const col = zone % ZONE_COLS;
    const row = Math.floor(zone / ZONE_COLS);
    // Return center % position (mirrored horizontally for camera mirror)
    const x = ((ZONE_COLS - 1 - col) + 0.5) / ZONE_COLS * 100;
    const y = (row + 0.5) / ZONE_ROWS * 100;
    return { x, y };
  };

  const accuracy = hits + misses > 0 ? Math.round((hits / (hits + misses)) * 100) : 0;

  // â”€â”€â”€ Fullscreen Camera HUD â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  if (cameraActive) {
    let activeZone: number | null = null;
    let activePunchName = '';
    let showTrajectory = false;

    if (mode === 'practice') {
      if (practiceSubMode === 'single') {
        const tech = PRACTICE_TECHNIQUES[activePracticeIdx];
        if (tech && !practiceSuccess) {
          activeZone = tech.zones[stance];
          activePunchName = tech.name;
          showTrajectory = true;
        }
      } else {
        const combo = allCombos[activeComboIdx];
        if (combo && !comboSuccess) {
          const step = combo.sequence[comboStepIdx];
          if (step) {
            activeZone = step.zones[stance];
            activePunchName = step.name;
            showTrajectory = true;
          }
        }
      }
    }

    const accuracy = hits + misses > 0 ? Math.round((hits / (hits + misses)) * 100) : 0;

    return (
      <div className="camera-fullscreen-hud">
        {/* Fullscreen Video Backgblock */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="fullscreen-video fs-exclude hj-hidden lr-hide clarity-mask"
          style={{ transform: mirrorCamera ? 'scaleX(-1)' : 'scaleX(1)' }}
        />

        {/* Hidden processing canvas */}
        <canvas ref={canvasRef} width={CANVAS_W} height={CANVAS_H} className="hidden-canvas fs-exclude hj-hidden lr-hide clarity-mask" />

        {/* Blinking REC indicator and privacy disclaimer overlay */}
        {isRecording && (
          <div className="hud-rec-indicator">
            <span className="rec-dot" />
            <span className="rec-text">REC {formatDuration(recordingDuration)}</span>
          </div>
        )}
        <div className="hud-privacy-disclaimer">
          <span>ðŸ”’ Videos are processed entirely in-browser and never sent to our servers.</span>
        </div>

        {/* 3x2 Detection Grid Overlay */}
        <div className="fullscreen-detection-grid">
          {Array.from({ length: 2 }).map((_, r) => (
            <div key={r} className="grid-row">
              {Array.from({ length: 3 }).map((_, c) => {
                const col = mirrorCamera ? (ZONE_COLS - 1 - c) : c;
                const zoneIdx = r * ZONE_COLS + col;
                
                const isPracticeActive = mode === 'practice' && activeZone === zoneIdx;
                const blitzTargetsInZone = mode === 'blitz' ? targets.filter(t => !t.hit && t.zone === zoneIdx) : [];
                const isBlitzActive = mode === 'blitz' && blitzTargetsInZone.length > 0;
                const isActive = isPracticeActive || isBlitzActive;
                const isFlash = flashZone === zoneIdx;

                return (
                  <div 
                    key={c} 
                    className={`grid-cell ${isActive ? 'zone-active-glow' : ''} ${isFlash ? 'zone-flash' : ''}`}
                  >
                    {/* SVG Trajectory Guide for Practice Single / Combo step */}
                    {isPracticeActive && showTrajectory && (
                      <div className="trajectory-container animate-fade-in">
                        {renderPunchTrajectorySvg(activePunchName)}
                        <span className="trajectory-label">{activePunchName.toUpperCase()}</span>
                      </div>
                    )}

                    {/* Blitz targets in zone */}
                    {isBlitzActive && blitzTargetsInZone.map(t => {
                      const age = Date.now() - t.createdAt;
                      const progress = Math.min(age / t.lifetime, 1);
                      const size = 70 + (1 - progress) * 20;
                      return (
                        <div
                          key={t.id}
                          className="blitz-target-hud"
                          style={{
                            width: `${size}px`,
                            height: `${size}px`,
                            borderColor: progress > 0.7 ? '#ff4a4a' : '#4ade80',
                            boxShadow: `0 0 ${20 + (1 - progress) * 15}px ${progress > 0.7 ? 'rgba(255,74,74,0.7)' : 'rgba(74,222,128,0.5)'}`,
                          }}
                        >
                          <Target size={size * 0.45} />
                          <svg className="target-timer-ring" viewBox="0 0 36 36">
                            <circle
                              cx="18" cy="18" r="16"
                              fill="none"
                              stroke={progress > 0.7 ? '#ff4a4a' : '#4ade80'}
                              strokeWidth="2"
                              strokeDasharray={`${(1 - progress) * 100} 100`}
                              transform="rotate(-90 18 18)"
                            />
                          </svg>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Hit flash */}
        {flashZone !== null && (
          <div className="blitz-flash" />
        )}

        {/* Floating score text */}
        {lastHitText && (
          <div className="blitz-hit-text">{lastHitText}</div>
        )}

        {/* Countdown overlay */}
        {phase === 'countdown' && (
          <div className="blitz-overlay" aria-live="assertive" role="alert">
            <div className="countdown-number">{countdownValue}</div>
          </div>
        )}

        {/* Rest overlay */}
        {phase === 'rest' && (
          <div className="blitz-overlay" aria-live="assertive" role="alert">
            <div className="rest-text">REST</div>
            <div className="rest-timer">{timeLeft}s</div>
            <div className="rest-next">Block {round + 1} starting...</div>
          </div>
        )}

        {/* HUD Top Bar */}
        <div className="hud-top-bar">
          <div className="hud-top-left">
            <h3 className="hud-logo-title">
              {mode === 'blitz' ? (
                <>SPEED BAG <span className="text-primary">BLITZ</span></>
              ) : (
                <>FOCUS & LEARN <span className="text-primary">PRACTICE</span></>
              )}
            </h3>
          </div>
          
          <div className="hud-top-center">
            {mode === 'blitz' && phase === 'playing' && (
              <div className="hud-round-info" aria-live="polite">
                <span className="hud-round-badge">BLOCK {round}/{NUM_BLOCKS}</span>
                <span className="hud-time-display"><Flame size={14} className="hud-flame-icon" /> {timeLeft}s</span>
                <span className="hud-score-badge">SCORE: {score}</span>
              </div>
            )}
            {mode === 'practice' && (
              <div className="hud-technique-info">
                <span className="hud-tech-badge">
                  {practiceSubMode === 'single' ? 'SINGLE PRACTICE' : 'COMBO TRAINER'}
                </span>
                <span className="hud-tech-active-name">
                  {practiceSubMode === 'single' 
                    ? PRACTICE_TECHNIQUES[activePracticeIdx]?.name.toUpperCase() 
                    : allCombos[activeComboIdx]?.name.toUpperCase()}
                </span>
              </div>
            )}
          </div>

          <div className="hud-top-stance">
            <div className="hud-stance-toggle">
              <button
                className={`hud-stance-btn ${stance === 'orthodox' ? 'active' : ''}`}
                onClick={() => {
                  setStance('orthodox');
                  setPracticeSuccess(false);
                  setPracticeReps(0);
                  setComboSuccess(false);
                  setComboReps(0);
                  setComboStepIdx(0);
                }}
              >
                RIGHT-HANDED
              </button>
              <button
                className={`hud-stance-btn ${stance === 'southpaw' ? 'active' : ''}`}
                onClick={() => {
                  setStance('southpaw');
                  setPracticeSuccess(false);
                  setPracticeReps(0);
                  setComboSuccess(false);
                  setComboReps(0);
                  setComboStepIdx(0);
                }}
              >
                LEFT-HANDED
              </button>
            </div>
          </div>

          <div className="hud-top-right">
            <button 
              className={`hud-icon-btn ${analyticsOpen ? 'active' : ''}`}
              onClick={() => {
                setAnalyticsOpen(!analyticsOpen);
                setSettingsOpen(false);
              }}
            >
              <BarChart2 size={16} />
              <span>Stats</span>
            </button>
            <button 
              className={`hud-icon-btn ${settingsOpen ? 'active' : ''}`}
              onClick={() => {
                setSettingsOpen(!settingsOpen);
                setAnalyticsOpen(false);
              }}
            >
              <Settings size={16} />
              <span>Calibrate</span>
            </button>
          </div>
        </div>

        {/* Mobile Tab Switcher */}
        <div className="hud-mobile-tabs">
          <button 
            className={`hud-mobile-tab-btn ${activeMobileTab === 'left' ? 'active' : ''}`}
            onClick={() => setActiveMobileTab('left')}
          >
            {getTabLabels().left}
          </button>
          <button 
            className={`hud-mobile-tab-btn ${activeMobileTab === 'right' ? 'active' : ''}`}
            onClick={() => setActiveMobileTab('right')}
          >
            {getTabLabels().right}
          </button>
        </div>

        {/* HUD Left Panel */}
        <div className={`hud-left-overlay ${activeMobileTab === 'left' ? 'mobile-visible' : 'mobile-hidden'}`}>
          {mode === 'practice' ? (
            practiceSubMode === 'single' ? (
              // Practice Single Form Checklist
              (() => {
                const tech = PRACTICE_TECHNIQUES[activePracticeIdx];
                if (!tech) return null;
                return (
                  <div className="hud-panel-content">
                    <h4 className="hud-panel-title">FORM CHECKLIST</h4>
                    <ul className="hud-checklist">
                      {tech.instructions.map((inst, idx) => (
                        <li key={idx} className={`hud-checklist-item ${practiceSuccess ? 'completed' : ''}`}>
                          <span className="hud-check-dot">
                            {practiceSuccess ? <CheckCircle size={14} /> : idx + 1}
                          </span>
                          <span className="hud-check-text">{inst}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })()
            ) : (
              // Combo Steps Checklist
              (() => {
                const combo = allCombos[activeComboIdx];
                if (!combo) return null;
                return (
                  <div className="hud-panel-content">
                    <h4 className="hud-panel-title">COMBO SEQUENCE</h4>
                    <ul className="hud-checklist">
                      {combo.sequence.map((step, idx) => {
                        const isCompleted = idx < comboStepIdx;
                        const isActive = idx === comboStepIdx && !comboSuccess;
                        return (
                          <li 
                            key={idx} 
                            className={`hud-checklist-item ${isCompleted ? 'completed' : ''} ${isActive ? 'active-step' : ''}`}
                          >
                            <span className="hud-check-dot">
                              {isCompleted ? <CheckCircle size={14} /> : idx + 1}
                            </span>
                            <span className="hud-check-text font-bold">
                              {step.name.toUpperCase()}
                              {isActive && <span className="hud-active-tag">THROW</span>}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })()
            )
          ) : (
            // Blitz Stats panel
            <div className="hud-panel-content">
              <h4 className="hud-panel-title">LIVE STATISTICS</h4>
              <div className="hud-blitz-stats">
                <div className="hud-stat-box">
                  <span className="hud-stat-num">{score}</span>
                  <span className="hud-stat-lbl">SCORE</span>
                </div>
                <div className="hud-stat-box">
                  <span className="hud-stat-num">{hits}</span>
                  <span className="hud-stat-lbl">HITS</span>
                </div>
                <div className="hud-stat-box">
                  <span className="hud-stat-num">{streak}</span>
                  <span className="hud-stat-lbl">STREAK</span>
                </div>
                <div className="hud-stat-box">
                  <span className="hud-stat-num">{accuracy}%</span>
                  <span className="hud-stat-lbl">ACCURACY</span>
                </div>
              </div>
              {streak >= 3 && phase === 'playing' && (
                <div className="hud-streak-alert" aria-live="polite">
                  🔥 {streak} HIT STREAK (×{Math.min(streak, 5)} MULTIPLIER)
                </div>
              )}
            </div>
          )}
        </div>

        {/* HUD Right Panel */}
        <div className={`hud-right-overlay ${activeMobileTab === 'right' ? 'mobile-visible' : 'mobile-hidden'}`}>
          {mode === 'practice' ? (
            practiceSubMode === 'single' ? (
              // Chef Tips for single practice
              (() => {
                const tech = PRACTICE_TECHNIQUES[activePracticeIdx];
                if (!tech) return null;
                return (
                  <div className="hud-panel-content">
                    <h4 className="hud-panel-title">COACHING TIPS</h4>
                    <div className="hud-coaching-box">
                      <ul className="hud-tips-list">
                        {tech.tips.map((tip, idx) => (
                          <li key={idx} className="hud-tip-item">
                            <HelpCircle size={14} className="hud-tip-icon" />
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })()
            ) : (
              // Combo description & instructions
              (() => {
                const combo = allCombos[activeComboIdx];
                if (!combo) return null;
                return (
                  <div className="hud-panel-content">
                    <h4 className="hud-panel-title">COMBO DESCRIPTION</h4>
                    <div className="hud-coaching-box">
                      <p className="hud-combo-desc">{combo.instructions.join(' ')}</p>
                      <ul className="hud-tips-list mt-2">
                        {combo.tips.map((tip, idx) => (
                          <li key={idx} className="hud-tip-item">
                            <HelpCircle size={14} className="hud-tip-icon" />
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })()
            )
          ) : (
            // Blitz Instructions / Results
            <div className="hud-panel-content">
              {phase === 'results' ? (
                <>
                  <h4 className="hud-panel-title text-gold"><Trophy size={14} /> GAME RESULTS</h4>
                  <div className="hud-results-list">
                    <div className="hud-result-item"><span>Total Score</span><strong>{score}</strong></div>
                    <div className="hud-result-item"><span>Targets Hit</span><strong>{hits}</strong></div>
                    <div className="hud-result-item"><span>Targets Missed</span><strong>{misses}</strong></div>
                    <div className="hud-result-item"><span>Accuracy</span><strong>{accuracy}%</strong></div>
                    <div className="hud-result-item"><span>Best Streak</span><strong>{bestStreak}</strong></div>
                    <div className="hud-result-item highlight"><span>High Score</span><strong>{highScore}</strong></div>
                  </div>
                  <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'center' }}>
                    <ShareButton
                      title={`Scored ${score} on PlateWiki Shadowbox Blitz! ${accuracy}% accuracy 🥊`}
                      description={`${hits} hits, best streak: ${bestStreak}`}
                      url="/workout?tab=tracker"
                    />
                  </div>
                </>
              ) : (
                <>
                  <h4 className="hud-panel-title">HOW TO BLITZ</h4>
                  <ul className="hud-instructions-list">
                    <li><Target size={14} /> Punch inside the target circles that appear on screen.</li>
                    <li><Zap size={14} /> Chain hits quickly to build score multipliers (up to 5x).</li>
                    <li><Flame size={14} /> Hit targets before they turn red and shrink away.</li>
                  </ul>
                </>
              )}
            </div>
          )}
        </div>

        {/* HUD Bottom Bar */}
        <div className="hud-bottom-bar">
          <div className="hud-bottom-left">
            {mode === 'practice' && (
              <div className="hud-progress-section" aria-live="polite">
                <div className="hud-progress-info">
                  <span className="hud-progress-label">
                    {practiceSubMode === 'single' ? 'REP COUNT' : 'COMBOS COMPLETED'}
                  </span>
                  <span className="hud-progress-value">
                    <strong>{practiceSubMode === 'single' ? practiceReps : comboReps}</strong> / 5
                  </span>
                </div>
                <div className="hud-progress-track">
                  <div 
                    className={`hud-progress-fill ${((practiceSubMode === 'single' ? practiceReps : comboReps) >= 5) ? 'success' : ''}`}
                    style={{ width: `${Math.min(((practiceSubMode === 'single' ? practiceReps : comboReps) / 5) * 100, 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="hud-bottom-center">
            {/* Countdown or Success notification */}
            {mode === 'practice' && (practiceSubMode === 'single' ? practiceSuccess : comboSuccess) && (
              <div className="hud-success-banner" role="alert">
                <CheckCircle size={16} />
                <span>SUCCESS!</span>
                {advanceCountdown !== null && (
                  <span className="hud-next-countdown">Next in {advanceCountdown}s</span>
                )}
              </div>
            )}
          </div>

          <div className="hud-bottom-right">
            {mode === 'practice' && (
              isRecording ? (
                <button className="hud-action-btn hud-action-btn--danger hud-action-btn--record active-rec" onClick={stopRecording}>
                  <span className="rec-dot-btn" />
                  <span>Stop Rec</span>
                </button>
              ) : (
                <button className="hud-action-btn hud-action-btn--primary hud-action-btn--record" onClick={startRecording}>
                  <span className="rec-dot-btn idle" />
                  <span>Record</span>
                </button>
              )
            )}
            {mode === 'practice' && ((practiceSubMode === 'single' ? practiceReps : comboReps) > 0 || (practiceSubMode === 'single' ? practiceSuccess : comboSuccess)) && (
              <button
                className="hud-action-btn hud-action-btn--success hud-action-btn--secondary"
                onClick={() => {
                  if (advanceTimerRef.current) {
                    if (advanceTimerRef.current) clearInterval(advanceTimerRef.current);
                    advanceTimerRef.current = null;
                  }
                  setAdvanceCountdown(null);
                  setPracticeSuccess(false);
                  setPracticeReps(0);
                  setComboSuccess(false);
                  setComboReps(0);
                  setComboStepIdx(0);
                }}
              >
                <RotateCcw size={14} />
                <span>Reset</span>
              </button>
            )}
            
            {mode === 'blitz' && (
              <>
                {phase === 'idle' && (
                  <button className="hud-action-btn hud-action-btn--primary" onClick={startGame}>
                    <Play size={14} />
                    <span>Start Game</span>
                  </button>
                )}
                {phase === 'results' && (
                  <button className="hud-action-btn hud-action-btn--primary" onClick={startGame}>
                    <RotateCcw size={14} />
                    <span>Play Again</span>
                  </button>
                )}
                {phase === 'playing' && (
                  <button className="hud-action-btn hud-action-btn--danger" onClick={endGame}>
                    <span>Stop Blitz</span>
                  </button>
                )}
              </>
            )}

            <button
              className="hud-action-btn hud-action-btn--secondary hud-action-btn--sound"
              onClick={() => setSoundEnabled(!soundEnabled)}
            >
              {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
              <span>{soundEnabled ? 'Mute' : 'Unmute'}</span>
            </button>

            <button 
              className="hud-action-btn hud-action-btn--danger hud-exit-btn" 
              onClick={stopCamera}
            >
              <X size={14} />
              <span>Exit & Stop</span>
            </button>
          </div>
        </div>

        {/* Dynamic Calibration Drawer */}
        {settingsOpen && (
          <div className="settings-drawer-overlay animate-fade-in" style={{ zIndex: 10000 }} onClick={() => setSettingsOpen(false)}>
            <div className="settings-drawer glass-panel animate-slide-in" onClick={e => e.stopPropagation()}>
              <div className="drawer-header">
                <h3><Settings size={18} /> Calibration & Settings</h3>
                <button className="close-drawer-btn" onClick={() => setSettingsOpen(false)}>×</button>
              </div>
              
              <div className="drawer-content">
                <div className="calibration-meter-box">
                  <div className="meter-label">
                    <span>Live Motion Feed</span>
                    <span className="meter-value">
                      {(() => {
                        const maxMot = Math.round(Math.max(...(zoneMotionRef.current || [0])));
                        return isNaN(maxMot) ? 0 : maxMot;
                      })()} / 100
                    </span>
                  </div>
                  <div className="meter-track">
                    <div 
                      className={`meter-fill ${Math.max(...(zoneMotionRef.current || [0])) > sensitivity ? 'active' : ''}`}
                      style={{ width: `${Math.min(Math.max(...(zoneMotionRef.current || [0])), 100)}%` }}
                    />
                    <div 
                      className="meter-threshold-marker" 
                      style={{ left: `${(sensitivity / 100) * 100}%` }}
                      title={`Threshold: ${sensitivity}`}
                    />
                  </div>
                  <p className="meter-hint">
                    Make punches in front of target zones. The blue bar must cross the orange line to register a hit.
                  </p>
                </div>

                <div className="setting-slider-group">
                  <div className="slider-label-row">
                    <span className="slider-title">Motion Sensitivity</span>
                    <span className="slider-value-badge">{sensitivity}</span>
                  </div>
                  <input 
                    type="range" 
                    min="5" 
                    max="35" 
                    value={sensitivity} 
                    onChange={e => {
                      const val = parseInt(e.target.value, 10);
                      setSensitivity(val);
                      safeStorage.setItem('shadowbox_sensitivity', val.toString());
                    }}
                    className="setting-range-slider"
                  />
                  <span className="slider-desc">Lower values are more sensitive. Raise if getting false hits.</span>
                </div>

                <div className="setting-slider-group">
                  <div className="slider-label-row">
                    <span className="slider-title">Velocity Threshold Multiplier</span>
                    <span className="slider-value-badge">{velocityMult}x</span>
                  </div>
                  <input 
                    type="range" 
                    min="1.0" 
                    max="2.5" 
                    step="0.1"
                    value={velocityMult} 
                    onChange={e => {
                      const val = parseFloat(e.target.value);
                      setVelocityMult(val);
                      safeStorage.setItem('shadowbox_velocityMult', val.toString());
                    }}
                    className="setting-range-slider"
                  />
                  <span className="slider-desc">Forces punch zone to be faster than non-punch zones. Default is 1.5x.</span>
                </div>

                <div className="setting-toggle-group">
                  <span className="slider-title">Mirror Camera Stream</span>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={mirrorCamera} 
                      onChange={e => {
                        const val = e.target.checked;
                        setMirrorCamera(val);
                        safeStorage.setItem('shadowbox_mirrorCamera', val ? 'true' : 'false');
                      }}
                    />
                    <span className="toggle-slider" />
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Training Analytics Dashboard Overlay */}
        {analyticsOpen && (
          <div className="settings-drawer-overlay animate-fade-in" style={{ zIndex: 10000 }} onClick={() => setAnalyticsOpen(false)}>
            <div className="settings-drawer glass-panel animate-slide-in analytics-drawer" onClick={e => e.stopPropagation()}>
              <div className="drawer-header">
                <h3><BarChart2 size={18} /> Training Analytics</h3>
                <button className="close-drawer-btn" onClick={() => setAnalyticsOpen(false)}>×</button>
              </div>
              
              {(() => {
                const stats = getTrainingStats();
                const activeMinutes = Math.round(stats.totalTime / 60);
                
                const last7Days = Array.from({ length: 7 }, (_, i) => {
                  const d = new Date();
                  d.setDate(d.getDate() - i);
                  const dateStr = d.toISOString().split('T')[0];
                  return {
                    date: dateStr,
                    label: d.toLocaleDateString(undefined, { weekday: 'short' }),
                    count: stats.weeklyLog[dateStr] || 0
                  };
                }).reverse();

                const maxHistoryCount = Math.max(...last7Days.map(d => d.count), 1);

                return (
                  <div className="drawer-content">
                    <div className="analytics-bento-grid">
                      <div className="bento-card">
                        <div className="bento-label">Punches Thrown</div>
                        <div className="bento-value text-primary">{stats.totalPunches}</div>
                      </div>
                      <div className="bento-card">
                        <div className="bento-label">Active Training</div>
                        <div className="bento-value">{activeMinutes} <span className="bento-unit">mins</span></div>
                      </div>
                      <div className="bento-card">
                        <div className="bento-label">Completed blocks</div>
                        <div className="bento-value">{stats.totalSessions}</div>
                      </div>
                      <div className="bento-card">
                        <div className="bento-label">Daily Streak</div>
                        <div className="bento-value text-gold">ðŸ”¥ {stats.streak} <span className="bento-unit">days</span></div>
                      </div>
                    </div>

                    <div className="analytics-chart-box">
                      <h4>Weekly Activity History</h4>
                      <div className="weekly-bars-container">
                        {last7Days.map((day, idx) => {
                          const percent = (day.count / maxHistoryCount) * 100;
                          return (
                            <div key={idx} className="weekly-bar-column">
                              <div className="weekly-bar-tooltip">{day.count} punches</div>
                              <div className="weekly-bar-track">
                                <div className="weekly-bar-fill" style={{ height: `${Math.max(percent, 4)}%` }} />
                              </div>
                              <span className="weekly-bar-label">{day.label}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="analytics-footer">
                      <span>Last session: {stats.lastActiveDate ? new Date(stats.lastActiveDate).toLocaleDateString() : 'None today'}</span>
                      <button 
                        className="reset-analytics-btn"
                        onClick={() => {
                          if (window.confirm('Are you sure you want to reset all training stats? This cannot be undone.')) {
                            saveTrainingStats({
                              totalSessions: 0,
                              totalPunches: 0,
                              highScore: 0,
                              streak: 0,
                              lastActiveDate: '',
                              totalTime: 0,
                              blitzHits: 0,
                              blitzMisses: 0,
                              weeklyLog: {}
                            });
                            setAnalyticsOpen(false);
                            setTimeout(() => setAnalyticsOpen(true), 50);
                          }
                        }}
                      >
                        Reset Stats
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    );
  }

  // â”€â”€â”€ Render â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  return (
    <div className="shadowbox-tracker">
      <div className="tracker-header">
        <div className="header-titles">
          {mode === 'blitz' ? (
            <>
              <h2>SPEED BAG <span className="text-primary">BLITZ</span></h2>
              <p className="tracker-sub">
                Targets appear on your camera feed — punch toward them to score! Chain hits for combo multipliers.
              </p>
            </>
          ) : (
            <>
              <h2>FOCUS & LEARN <span className="text-primary">PRACTICE</span></h2>
              <p className="tracker-sub">
                Master the basic punches at your own pace with interactive coaching tips and target feedback.
              </p>
            </>
          )}
        </div>
        <div className="header-actions">
          <button 
            className={`action-icon-btn ${analyticsOpen ? 'active' : ''}`}
            onClick={() => {
              setAnalyticsOpen(!analyticsOpen);
              setSettingsOpen(false);
            }}
            title="Training Analytics"
          >
            <BarChart2 size={18} />
            <span>Stats</span>
          </button>
          <button 
            className={`action-icon-btn ${settingsOpen ? 'active' : ''}`}
            onClick={() => {
              setSettingsOpen(!settingsOpen);
              setAnalyticsOpen(false);
            }}
            title="Calibration Settings"
          >
            <Settings size={18} />
            <span>Calibrate</span>
          </button>
        </div>
      </div>

      {/* Mode Switcher */}
      <div className="mode-switcher glass-panel">
        <button
          className={`mode-tab ${mode === 'blitz' ? 'active' : ''}`}
          onClick={() => {
            if (phase === 'playing' || phase === 'countdown' || phase === 'rest') {
              if (window.confirm('Stop your current Blitz game to switch mode?')) {
                endGame();
                switchMode('blitz');
              }
            } else {
              switchMode('blitz');
            }
          }}
        >
          <Zap size={16} /> Speed Bag Blitz
        </button>
        <button
          className={`mode-tab ${mode === 'practice' ? 'active' : ''}`}
          onClick={() => {
            if (phase === 'playing' || phase === 'countdown' || phase === 'rest') {
              if (window.confirm('Stop your current Blitz game to switch mode?')) {
                endGame();
                switchMode('practice');
              }
            } else {
              switchMode('practice');
            }
          }}
        >
          <BookOpen size={16} /> Focus Practice & Learn
        </button>
      </div>

      <div className="blitz-layout">
        {/* Camera + game area */}
        <div className="blitz-arena">
          <div className={`camera-box glass-panel ${phase === 'playing' ? 'active' : ''}`}>
            {cameraActive ? (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="camera-video fs-exclude hj-hidden lr-hide clarity-mask"
                  style={{ transform: mirrorCamera ? 'scaleX(-1)' : 'scaleX(1)' }}
                />

                {/* Blinking REC indicator and privacy disclaimer overlay */}
                {isRecording && (
                  <div className="hud-rec-indicator box-rec-indicator">
                    <span className="rec-dot" />
                    <span className="rec-text">REC {formatDuration(recordingDuration)}</span>
                  </div>
                )}
                <div className="hud-privacy-disclaimer box-privacy-disclaimer">
                  <span>🔒 Videos are processed entirely in-browser and never sent to our servers.</span>
                </div>

                {/* Target overlays */}
                {mode === 'blitz' && targets.filter(t => !t.hit).map(t => {
                  const pos = getZonePosition(t.zone);
                  const age = Date.now() - t.createdAt;
                  const progress = Math.min(age / t.lifetime, 1);
                  const size = 60 + (1 - progress) * 20;
                  return (
                    <div
                      key={t.id}
                      className="blitz-target"
                      style={{
                        left: `${pos.x}%`,
                        top: `${pos.y}%`,
                        width: `${size}px`,
                        height: `${size}px`,
                        opacity: 1 - progress * 0.4,
                        borderColor: progress > 0.7 ? '#ff4a4a' : '#4ade80',
                        boxShadow: `0 0 ${20 + (1 - progress) * 15}px ${progress > 0.7 ? 'rgba(255,74,74,0.6)' : 'rgba(74,222,128,0.4)'}`,
                      }}
                    >
                      <Target size={size * 0.45} />
                      <svg className="target-timer-ring" viewBox="0 0 36 36">
                        <circle
                          cx="18" cy="18" r="16"
                          fill="none"
                          stroke={progress > 0.7 ? '#ff4a4a' : '#4ade80'}
                          strokeWidth="2"
                          strokeDasharray={`${(1 - progress) * 100} 100`}
                          transform="rotate(-90 18 18)"
                        />
                      </svg>
                    </div>
                  );
                })}

                {/* Practice Target overlay */}
                {mode === 'practice' && (
                  (() => {
                    if (practiceSubMode === 'single') {
                      const tech = PRACTICE_TECHNIQUES[activePracticeIdx];
                      if (!tech) return null;
                      const zone = tech.zones[stance];
                      const pos = getZonePosition(zone);
                      return (
                        <div
                          className={`practice-target-box ${practiceSuccess ? 'success' : ''}`}
                          style={{
                            left: `${pos.x}%`,
                            top: `${pos.y}%`,
                          }}
                        >
                          <div className="practice-target-circle">
                            {practiceSuccess ? (
                              <CheckCircle className="practice-success-check" size={32} />
                            ) : (
                              <div className="practice-rep-counter">
                                <span className="rep-num">{practiceReps}</span>
                                <span className="rep-divider">/</span>
                                <span className="rep-total">5</span>
                              </div>
                            )}
                            <div className="practice-pulse-ring" />
                          </div>
                          <div className="practice-target-label">
                            {practiceSuccess ? 'COMPLETED!' : `${tech.name.toUpperCase()} (${practiceReps}/5)`}
                          </div>
                        </div>
                      );
                    } else {
                      const combo = allCombos[activeComboIdx];
                      if (!combo) return null;
                      if (comboSuccess) {
                        const zone = combo.sequence[0].zones[stance];
                        const pos = getZonePosition(zone);
                        return (
                          <div
                            className="practice-target-box success animate-bounce"
                            style={{
                              left: `${pos.x}%`,
                              top: `${pos.y}%`,
                            }}
                          >
                            <div className="practice-target-circle">
                              <CheckCircle className="practice-success-check" size={32} />
                              <div className="practice-pulse-ring" />
                            </div>
                            <div className="practice-target-label">
                              COMBO COMPLETE!
                            </div>
                          </div>
                        );
                      }
                      
                      const currentStep = combo.sequence[comboStepIdx];
                      if (!currentStep) return null;
                      const zone = currentStep.zones[stance];
                      const pos = getZonePosition(zone);
                      return (
                        <div
                          className="practice-target-box active-combo-step"
                          style={{
                            left: `${pos.x}%`,
                            top: `${pos.y}%`,
                          }}
                        >
                          <div className="practice-target-circle">
                            <div className="practice-rep-counter">
                              <span className="rep-num">{comboStepIdx + 1}</span>
                              <span className="rep-divider">/</span>
                              <span className="rep-total">{combo.sequence.length}</span>
                            </div>
                            <div className="practice-pulse-ring" />
                          </div>
                          <div className="practice-target-label">
                            THROW: {currentStep.name.toUpperCase()}
                          </div>
                        </div>
                      );
                    }
                  })()
                )}

                {/* Hit flash */}
                {flashZone !== null && (
                  <div className="blitz-flash" />
                )}

                {/* Floating score text */}
                {lastHitText && (
                  <div className="blitz-hit-text">{lastHitText}</div>
                )}

                {/* Countdown overlay */}
                {phase === 'countdown' && (
                  <div className="blitz-overlay">
                    <div className="countdown-number">{countdownValue}</div>
                  </div>
                )}

                {/* Rest overlay */}
                {phase === 'rest' && (
                  <div className="blitz-overlay">
                    <div className="rest-text">REST</div>
                    <div className="rest-timer">{timeLeft}s</div>
                    <div className="rest-next">Block {round + 1} starting...</div>
                  </div>
                )}
              </>
            ) : (
              <div className="camera-placeholder">
                {cameraError ? (
                  <div className="camera-err-msg">
                    <VideoOff size={36} />
                    <p>{cameraError}</p>
                    <button className="blitz-btn-primary" onClick={startCamera}>
                      Try Again
                    </button>
                  </div>
                ) : (
                  <>
                    <Camera size={48} className="placeholder-icon animate-pulse" />
                    <h3>Ready to Blitz?</h3>
                    <p>Targets will appear on your camera feed. Punch toward them to score points!</p>
                    <button className="blitz-btn-primary" onClick={startCamera}>
                      <Camera size={16} /> Enable Camera
                    </button>
                  </>
                )}
              </div>
            )}

            {/* Hidden processing canvas */}
            <canvas ref={canvasRef} width={CANVAS_W} height={CANVAS_H} className="hidden-canvas fs-exclude hj-hidden lr-hide clarity-mask" />
          </div>

          {/* Controls bar */}
          {cameraActive && (
            <div className="blitz-controls glass-panel">
              <div className="blitz-controls-left">
                {mode === 'blitz' ? (
                  <>
                    {phase === 'idle' && (
                      <button className="blitz-btn-primary" onClick={startGame}>
                        <Play size={16} /> Start Game
                      </button>
                    )}
                    {phase === 'playing' && (
                      <div className="round-info">
                        <span className="round-badge">Block {round}/{NUM_BLOCKS}</span>
                        <span className="time-display">
                          <Flame size={14} /> {timeLeft}s
                        </span>
                      </div>
                    )}
                    {phase === 'results' && (
                      <button className="blitz-btn-primary" onClick={startGame}>
                        <RotateCcw size={16} /> Play Again
                      </button>
                    )}
                  </>
                ) : (
                  <div className="practice-stance-controls">
                    <button
                      className={`practice-stance-btn ${stance === 'orthodox' ? 'active' : ''}`}
                      onClick={() => {
                        setStance('orthodox');
                        setPracticeSuccess(false);
                        setPracticeReps(0);
                      }}
                    >
                      Orthodox Stance
                    </button>
                    <button
                      className={`practice-stance-btn ${stance === 'southpaw' ? 'active' : ''}`}
                      onClick={() => {
                        setStance('southpaw');
                        setPracticeSuccess(false);
                        setPracticeReps(0);
                      }}
                    >
                      Southpaw Stance
                    </button>
                  </div>
                )}
              </div>
              <div className="blitz-controls-right">
                {mode === 'practice' && (
                  isRecording ? (
                    <button className="labeled-btn labeled-btn--danger active-rec" onClick={stopRecording}>
                      <span className="rec-dot-btn" />
                      Stop Rec
                    </button>
                  ) : (
                    <button className="labeled-btn labeled-btn--primary" onClick={startRecording}>
                      <span className="rec-dot-btn idle" />
                      Record Practice
                    </button>
                  )
                )}
                {mode === 'practice' && (practiceSuccess || practiceReps > 0) && (
                  <button
                    className="labeled-btn labeled-btn--success"
                    onClick={() => {
                      if (advanceTimerRef.current) {
                        if (advanceTimerRef.current) clearInterval(advanceTimerRef.current);
                        advanceTimerRef.current = null;
                      }
                      setAdvanceCountdown(null);
                      setPracticeSuccess(false);
                      setPracticeReps(0);
                    }}
                  >
                    <RotateCcw size={14} /> Reset Reps
                  </button>
                )}
                <button
                  className="labeled-btn"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                >
                  {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
                  {soundEnabled ? 'Sound On' : 'Sound Off'}
                </button>
                <button className="labeled-btn labeled-btn--danger" onClick={stopCamera}>
                  <VideoOff size={14} />
                  Stop Camera
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Scoreboard / Practice Panel */}
        <div className="blitz-scoreboard">
          {mode === 'blitz' ? (
            <>
              <div className="stats-dashboard glass-panel">
                <div className="stat-card">
                  <div className="stat-label">Score</div>
                  <div className="stat-value">{score}</div>
                </div>

                <div className="stat-mini-grid">
                  <div className="mini-stat">
                    <div className="mini-label"><Zap size={14} /> Hits</div>
                    <div className="mini-value">{hits}</div>
                  </div>
                  <div className="mini-stat">
                    <div className="mini-label"><Target size={14} /> Accuracy</div>
                    <div className="mini-value">{accuracy}%</div>
                  </div>
                  <div className="mini-stat">
                    <div className="mini-label"><Flame size={14} /> Streak</div>
                    <div className="mini-value">{streak}</div>
                  </div>
                </div>

                {streak >= 3 && phase === 'playing' && (
                  <div className="streak-banner">
                    🔥 {streak} HIT STREAK — ×{Math.min(streak, 5)} MULTIPLIER
                  </div>
                )}
              </div>

              {/* Results panel */}
              {phase === 'results' && (
                <div className="results-panel glass-panel">
                  <h3><Trophy size={20} /> Final Results</h3>
                  <div className="results-grid">
                    <div className="result-row">
                      <span>Total Score</span>
                      <strong>{score}</strong>
                    </div>
                    <div className="result-row">
                      <span>Targets Hit</span>
                      <strong>{hits}</strong>
                    </div>
                    <div className="result-row">
                      <span>Targets Missed</span>
                      <strong>{misses}</strong>
                    </div>
                    <div className="result-row">
                      <span>Accuracy</span>
                      <strong>{accuracy}%</strong>
                    </div>
                    <div className="result-row">
                      <span>Best Streak</span>
                      <strong>{bestStreak}</strong>
                    </div>
                    <div className="result-row highlight">
                      <span>High Score</span>
                      <strong>{highScore}</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* How to play (when idle) */}
              {phase === 'idle' && (
                <div className="how-to-play glass-panel">
                  <h3>How to Play</h3>
                  <ol>
                    <li><Target size={14} /> Targets appear on your camera feed</li>
                    <li><Zap size={14} /> Punch toward targets to hit them</li>
                    <li><Flame size={14} /> Chain hits for combo multipliers (up to ×5)</li>
                    <li><Trophy size={14} /> {NUM_BLOCKS} blocks of {ROUND_DURATION}s — beat your high score!</li>
                  </ol>
                </div>
              )}
            </>
          ) : (
            // Harvest Practice Sidebar Panel
            <div className="practice-sidebar animate-fade-in">
              {/* Sub-mode Selection Tabs */}
              <div className="practice-submode-toggle glass-panel">
                <button
                  className={`submode-btn ${practiceSubMode === 'single' ? 'active' : ''}`}
                  onClick={() => {
                    setPracticeSubMode('single');
                    setPracticeSuccess(false);
                    setPracticeReps(0);
                    if (advanceTimerRef.current) {
                      if (advanceTimerRef.current) clearInterval(advanceTimerRef.current);
                      advanceTimerRef.current = null;
                    }
                    setAdvanceCountdown(null);
                  }}
                >
                  Single Punch
                </button>
                <button
                  className={`submode-btn ${practiceSubMode === 'combo' ? 'active' : ''}`}
                  onClick={() => {
                    setPracticeSubMode('combo');
                    setComboSuccess(false);
                    setComboReps(0);
                    setComboStepIdx(0);
                    if (advanceTimerRef.current) {
                      if (advanceTimerRef.current) clearInterval(advanceTimerRef.current);
                      advanceTimerRef.current = null;
                    }
                    setAdvanceCountdown(null);
                  }}
                >
                  Combo Trainer
                </button>
              </div>

              {practiceSubMode === 'single' ? (
                <>
                  {/* Technique Selection Grid */}
                  <div className="practice-tech-selector glass-panel">
                    <h3>Select Technique</h3>
                    <div className="practice-tech-buttons">
                      {PRACTICE_TECHNIQUES.map((tech, idx) => (
                        <button
                          key={tech.id}
                          className={`practice-tech-tab ${activePracticeIdx === idx ? 'active' : ''}`}
                          onClick={() => {
                            if (advanceTimerRef.current) {
                              if (advanceTimerRef.current) clearInterval(advanceTimerRef.current);
                              advanceTimerRef.current = null;
                            }
                            setAdvanceCountdown(null);
                            setActivePracticeIdx(idx);
                            setPracticeSuccess(false);
                            setPracticeReps(0);
                          }}
                        >
                          <span className="practice-tech-num">{idx + 1}</span>
                          <span className="practice-tech-name">{tech.name}</span>
                          {activePracticeIdx === idx && <span className="active-dot" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Technique Guidance Card */}
                  {(() => {
                    const tech = PRACTICE_TECHNIQUES[activePracticeIdx];
                    if (!tech) return null;
                    return (
                      <div className="practice-guide-card glass-panel">
                        <div className="practice-guide-header">
                          <span className="practice-tag">{tech.type}</span>
                          <div className="practice-title-row">
                            <h2>{tech.name} Practice</h2>
                            <button
                              className="speak-guide-btn"
                              onClick={() => {
                                const text = `${tech.name}. ${tech.instructions.join(' ')}`;
                                speakForm(text);
                              }}
                              title="Listen to Chef Guide"
                            >
                              <Volume2 size={14} /> Listen to Chef
                            </button>
                          </div>
                        </div>

                        {/* Repetition Goal Counter */}
                        <div className="practice-progress-banner">
                          <div className="practice-progress-info">
                            <span className="practice-progress-label">Punch Count</span>
                            <span className="practice-progress-value"><strong>{practiceReps}</strong> of 5 reps</span>
                          </div>
                          <div className="practice-progress-track">
                            <div 
                              className={`practice-progress-bar ${practiceSuccess ? 'success' : ''}`}
                              style={{ width: `${(practiceReps / 5) * 100}%` }}
                            />
                          </div>
                        </div>

                        {/* Technique Instructions Checklist */}
                        <div className="practice-instructions">
                          <h4>Form Checklist</h4>
                          <ul className="practice-steps-list">
                            {tech.instructions.map((inst, idx) => (
                              <li key={idx} className={`practice-step-item ${practiceSuccess ? 'completed' : ''}`}>
                                <span className="step-check-circle">
                                  {practiceSuccess ? 'âœ“' : idx + 1}
                                </span>
                                <span className="step-text">{inst}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Pro Chef Tip */}
                        <div className="coaching-tips-box">
                          <div className="coaching-tips-title">
                            <HelpCircle size={16} />
                            <span>Chef Tips</span>
                          </div>
                          <ul className="coaching-tips-list">
                            {tech.tips.map((tip, idx) => (
                              <li key={idx}>{tip}</li>
                            ))}
                          </ul>
                        </div>

                        {/* Success/Next step banner */}
                        {practiceSuccess && (
                          <div className="practice-success-card animate-fade-in">
                            <div className="success-banner-title">
                              <CheckCircle size={20} />
                              <span>PUNCH COMPLETE!</span>
                            </div>
                            <p>Excellent form! Keep practicing or proceed to the next technique.</p>
                            {advanceCountdown !== null && (
                              <div className="advance-countdown-bar">
                                <div className="countdown-text">
                                  Next technique in <strong>{advanceCountdown}s</strong>
                                </div>
                                <button
                                  className="cancel-countdown-btn"
                                  onClick={() => {
                                    if (advanceTimerRef.current) {
                                      if (advanceTimerRef.current) clearInterval(advanceTimerRef.current);
                                      advanceTimerRef.current = null;
                                    }
                                    setAdvanceCountdown(null);
                                  }}
                                >
                                  Stay Here
                                </button>
                              </div>
                            )}
                            <button
                              className="blitz-btn-primary next-tech-btn"
                              onClick={handleNextTechnique}
                            >
                              Next Technique <ChevronRight size={16} />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </>
              ) : (
                <>
                  {/* Combo Selection Selector */}
                  <div className="practice-tech-selector glass-panel">
                    <h3>Select Recipe</h3>
                    <div className="practice-tech-buttons">
                      {allCombos.map((combo, idx) => (
                        <div key={combo.id} className="practice-tech-tab-row">
                          <button
                            className={`practice-tech-tab ${activeComboIdx === idx ? 'active' : ''}`}
                            onClick={() => {
                              if (advanceTimerRef.current) {
                                if (advanceTimerRef.current) clearInterval(advanceTimerRef.current);
                                advanceTimerRef.current = null;
                              }
                              setAdvanceCountdown(null);
                              setActiveComboIdx(idx);
                              setComboSuccess(false);
                              setComboReps(0);
                              setComboStepIdx(0);
                            }}
                          >
                            <span className="practice-tech-num">{idx + 1}</span>
                            <span className="practice-tech-name">{combo.name}</span>
                            {activeComboIdx === idx && <span className="active-dot" />}
                          </button>
                          {isCustomCombo(combo) && (
                            <button
                              className="combo-delete-btn"
                              aria-label={`Delete ${combo.name}`}
                              onClick={() => {
                                const next = deleteCustomCombo(combo.id);
                                setCustomCombos(next);
                                if (activeComboIdx >= TRAINING_COMBOS.length + next.length) {
                                  setActiveComboIdx(0);
                                  setComboSuccess(false);
                                  setComboReps(0);
                                  setComboStepIdx(0);
                                }
                              }}
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    <button
                      className="combo-create-btn"
                      onClick={() => {
                        setBuilderName('');
                        setBuilderSeq([]);
                        setBuilderOpen(true);
                      }}
                      disabled={customCombos.length >= MAX_CUSTOM_COMBOS}
                    >
                      <Plus size={16} />
                      {customCombos.length >= MAX_CUSTOM_COMBOS ? 'Recipe limit reached' : 'Create Custom Recipe'}
                    </button>
                  </div>

                  {/* Custom Recipe Builder Modal */}
                  {builderOpen && (
                    <div className="combo-builder-overlay" role="dialog" aria-modal="true" aria-label="Create custom recipe">
                      <div className="combo-builder glass-panel">
                        <div className="combo-builder-header">
                          <h3>CREATE <span className="text-primary">CUSTOM COMBO</span></h3>
                          <button className="hud-icon-btn" aria-label="Close builder" onClick={() => setBuilderOpen(false)}>
                            <X size={16} />
                          </button>
                        </div>

                        <input
                          type="text"
                          className="combo-builder-name"
                          placeholder="Combo name (e.g. My Morning Shake)"
                          value={builderName}
                          maxLength={MAX_NAME_LENGTH}
                          onChange={(e) => setBuilderName(e.target.value)}
                        />

                        <div className="combo-builder-seq">
                          {builderSeq.length === 0 ? (
                            <span className="combo-builder-empty">Tap ingredients below to build your sequence ({MIN_STEPS}–{MAX_STEPS} steps)</span>
                          ) : (
                            builderSeq.map((step, i) => (
                              <button
                                key={`${step.name}-${i}`}
                                className="combo-builder-chip"
                                aria-label={`Remove step ${i + 1}: ${step.name}`}
                                onClick={() => setBuilderSeq(seq => seq.filter((_, j) => j !== i))}
                              >
                                <span className="combo-builder-chip-num">{i + 1}</span>
                                {step.name}
                                <X size={12} />
                              </button>
                            ))
                          )}
                        </div>

                        <div className="combo-builder-moves">
                          {MOVE_LIBRARY.map((move) => (
                            <button
                              key={move.name}
                              className="combo-builder-move"
                              disabled={builderSeq.length >= MAX_STEPS}
                              onClick={() => setBuilderSeq(seq => seq.length < MAX_STEPS ? [...seq, move] : seq)}
                            >
                              {move.name}
                            </button>
                          ))}
                        </div>

                        <div className="combo-builder-actions">
                          <button className="combo-builder-cancel" onClick={() => setBuilderOpen(false)}>Cancel</button>
                          <button
                            className="combo-builder-save"
                            disabled={builderSeq.length < MIN_STEPS}
                            onClick={() => {
                              const combo = buildCustomCombo(builderName, builderSeq);
                              const next = saveCustomCombo(combo);
                              setCustomCombos(next);
                              setBuilderOpen(false);
                              // select the new combo (it's appended after built-ins)
                              setActiveComboIdx(TRAINING_COMBOS.length + next.length - 1);
                              setComboSuccess(false);
                              setComboReps(0);
                              setComboStepIdx(0);
                            }}
                          >
                            Save & Harvest
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Combo Guidance Card */}
                  {(() => {
                    const combo = allCombos[activeComboIdx];
                    if (!combo) return null;
                    return (
                      <div className="practice-guide-card glass-panel">
                        <div className="practice-guide-header">
                          <span className="practice-tag">COMBO</span>
                          <div className="practice-title-row">
                            <h2>{combo.name}</h2>
                            <button
                              className="speak-guide-btn"
                              onClick={() => {
                                const seqStr = combo.sequence.map(s => s.name).join(', ');
                                const text = `${combo.name}. Sequence: ${seqStr}. ${combo.instructions.join(' ')}`;
                                speakForm(text);
                              }}
                              title="Listen to Chef Guide"
                            >
                              <Volume2 size={14} /> Listen to Chef
                            </button>
                          </div>
                        </div>

                        {/* Combo Repetition Goal */}
                        <div className="practice-progress-banner">
                          <div className="practice-progress-info">
                            <span className="practice-progress-label">Recipes Completed</span>
                            <span className="practice-progress-value"><strong>{comboReps}</strong> of 5 reps</span>
                          </div>
                          <div className="practice-progress-track">
                            <div 
                              className={`practice-progress-bar ${comboSuccess ? 'success' : ''}`}
                              style={{ width: `${(comboReps / 5) * 100}%` }}
                            />
                          </div>
                        </div>

                        {/* Sequence Steps Checklist */}
                        <div className="practice-instructions">
                          <h4>Recipe Sequence</h4>
                          <ul className="practice-steps-list combo-steps-list">
                            {combo.sequence.map((step, idx) => {
                              const isCompleted = idx < comboStepIdx;
                              const isActive = idx === comboStepIdx && !comboSuccess;
                              
                              return (
                                <li 
                                  key={idx} 
                                  className={`practice-step-item ${isCompleted ? 'completed' : ''} ${isActive ? 'active-step animate-pulse' : ''}`}
                                >
                                  <span className="step-check-circle">
                                    {isCompleted ? 'âœ“' : idx + 1}
                                  </span>
                                  <span className="step-text font-bold">
                                    {step.name.toUpperCase()} 
                                    {isActive && <span className="active-tag-inline">THROW!</span>}
                                  </span>
                                </li>
                              );
                            })}
                          </ul>
                        </div>

                        {/* Description Tips */}
                        <div className="coaching-tips-box">
                          <div className="coaching-tips-title">
                            <HelpCircle size={16} />
                            <span>Description</span>
                          </div>
                          <p className="combo-desc-text">{combo.instructions.join(' ')}</p>
                        </div>

                        {/* Combo Complete Success Banner */}
                        {comboSuccess && (
                          <div className="practice-success-card animate-fade-in">
                            <div className="success-banner-title">
                              <CheckCircle size={20} />
                              <span>COMBO COMPLETED!</span>
                            </div>
                            <p>Fantastic combination execution! Keep working on it or try another combo.</p>
                            {advanceCountdown !== null && (
                              <div className="advance-countdown-bar">
                                <div className="countdown-text">
                                  Next combo in <strong>{advanceCountdown}s</strong>
                                </div>
                                <button
                                  className="cancel-countdown-btn"
                                  onClick={() => {
                                    if (advanceTimerRef.current) {
                                      if (advanceTimerRef.current) clearInterval(advanceTimerRef.current);
                                      advanceTimerRef.current = null;
                                    }
                                    setAdvanceCountdown(null);
                                  }}
                                >
                                  Stay Here
                                </button>
                              </div>
                            )}
                            <button
                              className="blitz-btn-primary next-tech-btn"
                              onClick={handleNextTechnique}
                            >
                              Next Combo <ChevronRight size={16} />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Dynamic Calibration Drawer */}
      {settingsOpen && (
        <div className="settings-drawer-overlay animate-fade-in" onClick={() => setSettingsOpen(false)}>
          <div className="settings-drawer glass-panel animate-slide-in" onClick={e => e.stopPropagation()}>
            <div className="drawer-header">
              <h3><Settings size={18} /> Calibration & Settings</h3>
              <button className="close-drawer-btn" onClick={() => setSettingsOpen(false)}>×</button>
            </div>
            
            <div className="drawer-content">
              {/* Live calibration meter */}
              <div className="calibration-meter-box">
                <div className="meter-label">
                  <span>Live Motion Feed</span>
                  <span className="meter-value">
                    {(() => {
                      const maxMot = Math.round(Math.max(...(zoneMotionRef.current || [0])));
                      return isNaN(maxMot) ? 0 : maxMot;
                    })()} / 100
                  </span>
                </div>
                <div className="meter-track">
                  <div 
                    className={`meter-fill ${Math.max(...(zoneMotionRef.current || [0])) > sensitivity ? 'active' : ''}`}
                    style={{ width: `${Math.min(Math.max(...(zoneMotionRef.current || [0])), 100)}%` }}
                  />
                  <div 
                    className="meter-threshold-marker" 
                    style={{ left: `${(sensitivity / 100) * 100}%` }}
                    title={`Threshold: ${sensitivity}`}
                  />
                </div>
                <p className="meter-hint">
                  Make punches in front of target zones. The blue bar must cross the orange line to register a hit.
                </p>
              </div>

              {/* Slider 1: Sensitivity */}
              <div className="setting-slider-group">
                <div className="slider-label-row">
                  <span className="slider-title">Motion Sensitivity</span>
                  <span className="slider-value-badge">{sensitivity}</span>
                </div>
                <input 
                  type="range" 
                  min="5" 
                  max="35" 
                  value={sensitivity} 
                  onChange={e => {
                    const val = parseInt(e.target.value, 10);
                    setSensitivity(val);
                    safeStorage.setItem('shadowbox_sensitivity', val.toString());
                  }}
                  className="setting-range-slider"
                />
                <span className="slider-desc">Lower values are more sensitive. Raise if getting false hits.</span>
              </div>

              {/* Slider 2: Velocity Multiplier */}
              <div className="setting-slider-group">
                <div className="slider-label-row">
                  <span className="slider-title">Velocity Threshold Multiplier</span>
                  <span className="slider-value-badge">{velocityMult}x</span>
                </div>
                <input 
                  type="range" 
                  min="1.0" 
                  max="2.5" 
                  step="0.1"
                  value={velocityMult} 
                  onChange={e => {
                    const val = parseFloat(e.target.value);
                    setVelocityMult(val);
                    safeStorage.setItem('shadowbox_velocityMult', val.toString());
                  }}
                  className="setting-range-slider"
                />
                <span className="slider-desc">Forces punch zone to be faster than non-punch zones. Default is 1.5x.</span>
              </div>

              {/* Toggle 3: Mirror camera */}
              <div className="setting-toggle-group">
                <span className="slider-title">Mirror Camera Stream</span>
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={mirrorCamera} 
                    onChange={e => {
                      const val = e.target.checked;
                      setMirrorCamera(val);
                      safeStorage.setItem('shadowbox_mirrorCamera', val ? 'true' : 'false');
                    }}
                  />
                  <span className="toggle-slider" />
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Training Analytics Dashboard Overlay */}
      {analyticsOpen && (
        <div className="settings-drawer-overlay animate-fade-in" onClick={() => setAnalyticsOpen(false)}>
          <div className="settings-drawer glass-panel animate-slide-in analytics-drawer" onClick={e => e.stopPropagation()}>
            <div className="drawer-header">
              <h3><BarChart2 size={18} /> Training Analytics</h3>
              <button className="close-drawer-btn" onClick={() => setAnalyticsOpen(false)}>×</button>
            </div>
            
            {(() => {
              const stats = getTrainingStats();
              const activeMinutes = Math.round(stats.totalTime / 60);
              
              // Calculate weekly chart history
              const last7Days = Array.from({ length: 7 }, (_, i) => {
                const d = new Date();
                d.setDate(d.getDate() - i);
                const dateStr = d.toISOString().split('T')[0];
                return {
                  date: dateStr,
                  label: d.toLocaleDateString(undefined, { weekday: 'short' }),
                  count: stats.weeklyLog[dateStr] || 0
                };
              }).reverse();

              const maxHistoryCount = Math.max(...last7Days.map(d => d.count), 1);

              return (
                <div className="drawer-content">
                  {/* Bento Grid layout */}
                  <div className="analytics-bento-grid">
                    <div className="bento-card">
                      <div className="bento-label">Punches Thrown</div>
                      <div className="bento-value text-primary">{stats.totalPunches}</div>
                    </div>
                    <div className="bento-card">
                      <div className="bento-label">Active Training</div>
                      <div className="bento-value">{activeMinutes} <span className="bento-unit">mins</span></div>
                    </div>
                    <div className="bento-card">
                      <div className="bento-label">Completed blocks</div>
                      <div className="bento-value">{stats.totalSessions}</div>
                    </div>
                    <div className="bento-card">
                      <div className="bento-label">Daily Streak</div>
                      <div className="bento-value text-gold">ðŸ”¥ {stats.streak} <span className="bento-unit">days</span></div>
                    </div>
                  </div>

                  {/* SVG Bar Chart */}
                  <div className="analytics-chart-box">
                    <h4>Weekly Activity History</h4>
                    <div className="weekly-bars-container">
                      {last7Days.map((day, idx) => {
                        const percent = (day.count / maxHistoryCount) * 100;
                        return (
                          <div key={idx} className="weekly-bar-column">
                            <div className="weekly-bar-tooltip">{day.count} punches</div>
                            <div className="weekly-bar-track">
                              <div className="weekly-bar-fill" style={{ height: `${Math.max(percent, 4)}%` }} />
                            </div>
                            <span className="weekly-bar-label">{day.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="analytics-footer">
                    <span>Last session: {stats.lastActiveDate ? new Date(stats.lastActiveDate).toLocaleDateString() : 'None today'}</span>
                    <button 
                      className="reset-analytics-btn"
                      onClick={() => {
                        if (window.confirm('Are you sure you want to reset all training stats? This cannot be undone.')) {
                          saveTrainingStats({
                            totalSessions: 0,
                            totalPunches: 0,
                            highScore: 0,
                            streak: 0,
                            lastActiveDate: '',
                            totalTime: 0,
                            blitzHits: 0,
                            blitzMisses: 0,
                            weeklyLog: {}
                          });
                          // Force re-render by toggling open/close state
                          setAnalyticsOpen(false);
                          setTimeout(() => setAnalyticsOpen(true), 50);
                        }
                      }}
                    >
                      Reset Stats
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default ShadowboxTracker;
