'use client';

import React, { useEffect, useSyncExternalStore } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import {
  initRetroSound,
  isSoundMuted,
  subscribeSoundMuted,
  toggleSoundMuted,
} from '@/utils/retroSound';

export default function SoundToggle({ className = '' }: { className?: string }) {
  const muted = useSyncExternalStore(subscribeSoundMuted, isSoundMuted, () => false);

  useEffect(() => {
    initRetroSound();
  }, []);

  return (
    <button
      type="button"
      className={`sound-toggle-btn ${className}`}
      onClick={() => toggleSoundMuted()}
      aria-pressed={muted}
      aria-label={muted ? 'Unmute sound effects' : 'Mute sound effects'}
      title={muted ? 'Unmute sound effects' : 'Mute sound effects'}
    >
      {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
    </button>
  );
}
