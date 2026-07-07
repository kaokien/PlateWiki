import { safeStorage } from './safeStorage';

// 8-bit retro sound effects built on the Web Audio API — square/triangle
// oscillators only, no audio files. The AudioContext starts suspended under
// browser autoplay policies, so initRetroSound() attaches one-time gesture
// listeners that unlock it; play calls before unlock are silently dropped.

const MUTE_STORAGE_KEY = 'PlateWiki_sound_muted';
const MASTER_VOLUME = 0.14;

let audioCtx: AudioContext | null = null;
let unlockAttached = false;
let muted: boolean | null = null;
const muteListeners = new Set<() => void>();

function loadMuted(): boolean {
  if (muted === null) {
    muted = safeStorage.getItem(MUTE_STORAGE_KEY) === 'true';
  }
  return muted;
}

export function isSoundMuted(): boolean {
  return loadMuted();
}

export function setSoundMuted(next: boolean): void {
  muted = next;
  safeStorage.setItem(MUTE_STORAGE_KEY, String(next));
  muteListeners.forEach((fn) => fn());
}

export function toggleSoundMuted(): boolean {
  const next = !loadMuted();
  setSoundMuted(next);
  return next;
}

export function subscribeSoundMuted(listener: () => void): () => void {
  muteListeners.add(listener);
  return () => muteListeners.delete(listener);
}

function ensureContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    try {
      audioCtx = new Ctor();
    } catch {
      return null;
    }
  }
  return audioCtx;
}

// Attach one-time listeners so the first user gesture anywhere on the page
// creates/resumes the AudioContext. Safe to call multiple times.
export function initRetroSound(): void {
  if (typeof window === 'undefined' || unlockAttached) return;
  unlockAttached = true;

  const unlock = () => {
    const ctx = ensureContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => { /* ignore */ });
    }
    window.removeEventListener('pointerdown', unlock);
    window.removeEventListener('keydown', unlock);
    window.removeEventListener('touchend', unlock);
  };

  window.addEventListener('pointerdown', unlock);
  window.addEventListener('keydown', unlock);
  window.addEventListener('touchend', unlock);
}

// Run fn only with a running context — scheduling on a suspended context
// would queue every blip and blast them all at once on unlock.
function withRunningContext(fn: (ctx: AudioContext) => void): void {
  if (loadMuted()) return;
  const ctx = ensureContext();
  if (!ctx) return;
  if (ctx.state === 'running') {
    fn(ctx);
    return;
  }
  ctx.resume().then(() => {
    if (ctx.state === 'running') fn(ctx);
  }).catch(() => { /* autoplay policy: no gesture yet */ });
}

interface ToneOptions {
  type: OscillatorType;
  freq: number;
  /** Optional pitch to sweep toward over the tone's duration */
  freqEnd?: number;
  /** Seconds after ctx.currentTime to start */
  at: number;
  duration: number;
  volume?: number;
}

function scheduleTone(ctx: AudioContext, { type, freq, freqEnd, at, duration, volume = 1 }: ToneOptions): void {
  const start = ctx.currentTime + at;
  const stop = start + duration;

  const osc = ctx.createOscillator();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  if (freqEnd !== undefined) {
    osc.frequency.exponentialRampToValueAtTime(Math.max(1, freqEnd), stop);
  }

  const gain = ctx.createGain();
  const peak = MASTER_VOLUME * volume;
  gain.gain.setValueAtTime(0, start);
  gain.gain.linearRampToValueAtTime(peak, start + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.0005, stop);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(start);
  osc.stop(stop + 0.01);
  osc.onended = () => {
    osc.disconnect();
    gain.disconnect();
  };
}

/** High-pitched munch-munch blips for the eating state. */
export function playChewSound(): void {
  withRunningContext((ctx) => {
    for (let i = 0; i < 3; i++) {
      scheduleTone(ctx, {
        type: 'square',
        freq: i % 2 === 0 ? 900 : 760,
        freqEnd: 420,
        at: i * 0.16,
        duration: 0.09,
        volume: 0.7,
      });
    }
  });
}

/** Rising arpeggio fanfare for the level-up animation. */
export function playLevelUpSound(): void {
  withRunningContext((ctx) => {
    const arpeggio = [523.25, 659.25, 783.99, 1046.5]; // C5 E5 G5 C6
    arpeggio.forEach((freq, i) => {
      scheduleTone(ctx, { type: 'square', freq, at: i * 0.1, duration: 0.11, volume: 0.8 });
    });
    // Sustained closing chord
    scheduleTone(ctx, { type: 'triangle', freq: 1046.5, at: 0.4, duration: 0.45, volume: 1 });
    scheduleTone(ctx, { type: 'triangle', freq: 1318.51, at: 0.4, duration: 0.45, volume: 0.6 });
  });
}

/** Classic coin "ching" for successful shop purchases. */
export function playPurchaseSound(): void {
  withRunningContext((ctx) => {
    scheduleTone(ctx, { type: 'square', freq: 987.77, at: 0, duration: 0.08, volume: 0.8 }); // B5
    scheduleTone(ctx, { type: 'square', freq: 1318.51, at: 0.08, duration: 0.35, volume: 0.8 }); // E6
  });
}

/** A short click sound for tapping the sleeping athlete's environment. */
export function playTapSound(): void {
  withRunningContext((ctx) => {
    scheduleTone(ctx, {
      type: 'triangle',
      freq: 440,
      freqEnd: 220,
      at: 0,
      duration: 0.05,
      volume: 0.6,
    });
  });
}

/** A rising wake-up sound for when the athlete is woken up. */
export function playWakeupSound(): void {
  withRunningContext((ctx) => {
    const notes = [330.00, 440.00, 550.00, 660.00]; // E4, A4, C#5, E5
    notes.forEach((freq, i) => {
      scheduleTone(ctx, {
        type: 'square',
        freq,
        at: i * 0.08,
        duration: 0.1,
        volume: 0.7,
      });
    });
  });
}

