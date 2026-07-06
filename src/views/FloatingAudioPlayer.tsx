import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, X, Volume2, VolumeX } from 'lucide-react';
import './FloatingAudioPlayer.css';

interface FloatingAudioPlayerProps {
  articleId: string | number;
  articleTitle: string;
}

export default function FloatingAudioPlayer({ articleId, articleTitle }: FloatingAudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Reset state when article changes
  useEffect(() => {
    setIsPlaying(false);
    setProgress(0);
    setHasError(false);
    setIsDismissed(false);
  }, [articleId]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const total = audioRef.current.duration;
      setProgress((current / total) * 100);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const newTime = (Number(e.target.value) / 100) * audioRef.current.duration;
      audioRef.current.currentTime = newTime;
      setProgress(Number(e.target.value));
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setProgress(0);
  };

  // Don't render if dismissed or audio file doesn't exist
  if (isDismissed || hasError) return null;

  return (
    <div className="floating-audio-player">
      <audio
        ref={audioRef}
        src={`/audio/${String(articleId)}.mp3`}
        preload="none"
        onError={() => setHasError(true)}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />
      
      <div className="fap-header">
        <div className="fap-title">
          <span className="fap-label">Listen to Article</span>
          <span className="fap-article-name">{articleTitle}</span>
        </div>
        <button className="fap-close" onClick={() => setIsDismissed(true)} aria-label="Dismiss audio player">
          <X size={16} />
        </button>
      </div>

      <div className="fap-controls">
        <button className="fap-play-btn" onClick={togglePlay} aria-label={isPlaying ? "Pause" : "Play"}>
          {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
        </button>

        <div className="fap-progress-container">
          <input
            type="range"
            min="0"
            max="100"
            value={progress || 0}
            onChange={handleSeek}
            className="fap-progress-bar"
            aria-label="Audio progress"
          />
          <div 
            className="fap-progress-fill" 
            style={{ width: `${progress}%` }}
          />
        </div>

        <button className="fap-mute-btn" onClick={toggleMute} aria-label={isMuted ? "Unmute" : "Mute"}>
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
      </div>
    </div>
  );
}
