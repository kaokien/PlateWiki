import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, Minimize2, Play, Pause } from 'lucide-react';
import './FlashcardCarousel.css';

interface FlashcardCarouselProps {
  steps: string[];
  onClose: () => void;
}

const AUTO_SPEEDS = [5, 8, 12] as const;

const FlashcardCarousel: React.FC<FlashcardCarouselProps> = ({ steps, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const [autoSpeed, setAutoSpeed] = useState<number>(8);
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);

  // ── Fullscreen ──────────────────────────────────────────────
  const toggleFullscreen = useCallback(async () => {
    setIsFullscreen((prev) => {
      const next = !prev;
      // Lock/unlock body scroll
      document.body.style.overflow = next ? 'hidden' : '';
      return next;
    });
  }, []);

  // Clean up body overflow on unmount
  useEffect(() => {
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Exit fullscreen on close
  const handleClose = useCallback(() => {
    setIsFullscreen(false);
    document.body.style.overflow = '';
    setAutoPlay(false);
    onClose();
  }, [onClose]);

  // ── Auto-advance ────────────────────────────────────────────
  useEffect(() => {
    if (!autoPlay) {
      if (timerRef.current) clearInterval(timerRef.current);
      setProgress(0);
      return;
    }

    startTimeRef.current = Date.now();
    const intervalMs = autoSpeed * 1000;

    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const pct = Math.min((elapsed / intervalMs) * 100, 100);
      setProgress(pct);

      if (elapsed >= intervalMs) {
        setCurrentIndex((prev) => {
          if (prev >= steps.length - 1) {
            // Reached the end — stop auto-play
            setAutoPlay(false);
            return prev;
          }
          startTimeRef.current = Date.now();
          return prev + 1;
        });
      }
    }, 50);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [autoPlay, autoSpeed, steps.length]);

  // Reset progress timer on manual navigation
  const goTo = useCallback((idx: number) => {
    setCurrentIndex(idx);
    startTimeRef.current = Date.now();
    setProgress(0);
  }, []);

  const nextStep = () => {
    if (currentIndex < steps.length - 1) goTo(currentIndex + 1);
  };

  const prevStep = () => {
    if (currentIndex > 0) goTo(currentIndex - 1);
  };

  // Keyboard controls
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); nextStep(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); prevStep(); }
      else if (e.key === 'Escape') handleClose();
      else if (e.key === 'f' || e.key === 'F') toggleFullscreen();
      else if (e.key === 'p' || e.key === 'P') setAutoPlay((p) => !p);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  });

  const cycleSpeed = () => {
    const idx = AUTO_SPEEDS.indexOf(autoSpeed as (typeof AUTO_SPEEDS)[number]);
    setAutoSpeed(AUTO_SPEEDS[(idx + 1) % AUTO_SPEEDS.length]);
    startTimeRef.current = Date.now();
    setProgress(0);
  };

  return (
    <div
      ref={containerRef}
      className={`flashcard-carousel${isFullscreen ? ' flashcard-carousel--fullscreen' : ''}`}
    >
      <div className="flashcard-header">
        <span className="step-counter">
          STEP {currentIndex + 1} OF {steps.length}
        </span>
        <div className="flashcard-header__actions">
          {/* Auto-advance controls */}
          <button
            className={`flashcard-ctrl-btn${autoPlay ? ' flashcard-ctrl-btn--active' : ''}`}
            onClick={() => setAutoPlay((p) => !p)}
            aria-label={autoPlay ? 'Pause auto-advance' : 'Start auto-advance'}
            title={autoPlay ? 'Pause (P)' : 'Auto-advance (P)'}
          >
            {autoPlay ? <Pause size={16} /> : <Play size={16} />}
          </button>
          {autoPlay && (
            <button
              className="flashcard-speed-btn"
              onClick={cycleSpeed}
              aria-label={`Auto-advance speed: ${autoSpeed}s`}
              title="Change speed"
            >
              {autoSpeed}s
            </button>
          )}
          {/* Fullscreen */}
          <button
            className="flashcard-ctrl-btn"
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            title={isFullscreen ? 'Exit fullscreen (F)' : 'Fullscreen (F)'}
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
          <button className="close-flashcard-btn" onClick={handleClose} aria-label="Exit flashcard mode">
            Exit Mode
          </button>
        </div>
      </div>

      <div className="flashcard-body">
        <button
          className="nav-btn prev-btn"
          onClick={prevStep}
          disabled={currentIndex === 0}
          aria-label="Previous step"
        >
          <ChevronLeft size={48} />
        </button>

        <div className="flashcard-content">
          <p className="flashcard-text">{steps[currentIndex]}</p>
        </div>

        <button
          className="nav-btn next-btn"
          onClick={nextStep}
          disabled={currentIndex === steps.length - 1}
          aria-label="Next step"
        >
          <ChevronRight size={48} />
        </button>
      </div>

      <div className="flashcard-footer">
        <div className="flashcard-dots">
          {steps.map((_, idx) => (
            <span
              key={idx}
              className={`dot ${idx === currentIndex ? 'active' : ''}`}
              onClick={() => goTo(idx)}
            />
          ))}
        </div>
        {/* Auto-advance progress bar */}
        {autoPlay && (
          <div className="flashcard-progress">
            <div
              className="flashcard-progress__fill"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default FlashcardCarousel;
