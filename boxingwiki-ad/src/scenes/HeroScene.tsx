import React from 'react';
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { AnimatedText } from '../components/AnimatedText';
import { CounterAnimation } from '../components/CounterAnimation';
import { GlowText } from '../components/GlowText';
import { COLORS } from '../lib/config';

export const HeroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Screenshot slides in from right
  const slideProgress = spring({
    frame,
    fps,
    config: { damping: 18, stiffness: 60, mass: 1 },
  });
  const slideX = interpolate(slideProgress, [0, 1], [200, 0]);
  const imgOpacity = interpolate(frame, [0, fps * 0.5], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Parallax
  const parallaxY = interpolate(frame, [0, fps * 4], [10, -10]);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: COLORS.bg,
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
      }}
    >
      {/* Left: Text content */}
      <div
        style={{
          flex: '0 0 45%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '0 60px',
          zIndex: 2,
        }}
      >
        <CounterAnimation
          from={0}
          to={54}
          startFrame={Math.round(fps * 0.5)}
          durationFrames={Math.round(fps * 2)}
          suffix="TECHNIQUES"
          fontSize={140}
        />
        <div style={{ height: 32 }} />
        <GlowText
          text="Free · Interactive · Open"
          startFrame={Math.round(fps * 1.5)}
          fontSize={20}
        />
      </div>

      {/* Right: Screenshot */}
      <div
        style={{
          flex: '0 0 55%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          opacity: imgOpacity,
          transform: `translateX(${slideX}px) translateY(${parallaxY}px)`,
        }}
      >
        <div
          style={{
            borderRadius: 16,
            overflow: 'hidden',
            boxShadow: `0 0 60px ${COLORS.primary}30, 0 20px 60px rgba(0,0,0,0.6)`,
            border: `1px solid ${COLORS.primary}20`,
          }}
        >
          <Img
            src={staticFile('screenshots/01-hero.png')}
            style={{
              width: 860,
              height: 'auto',
              display: 'block',
            }}
          />
        </div>
      </div>

      {/* Gradient overlays */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '50%',
          height: '100%',
          background: `linear-gradient(90deg, ${COLORS.bg} 60%, transparent)`,
          zIndex: 1,
        }}
      />
    </div>
  );
};
