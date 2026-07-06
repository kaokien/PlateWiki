import React from 'react';
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { AnimatedText } from '../components/AnimatedText';
import { COLORS, FONT_FAMILY_DISPLAY } from '../lib/config';

export const TrainingScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Left panel slide
  const leftProgress = spring({
    frame,
    fps,
    config: { damping: 16, stiffness: 70, mass: 1 },
  });
  const leftX = interpolate(leftProgress, [0, 1], [-400, 0]);

  // Right panel slide
  const rightProgress = spring({
    frame: Math.max(0, frame - Math.round(fps * 0.3)),
    fps,
    config: { damping: 16, stiffness: 70, mass: 1 },
  });
  const rightX = interpolate(rightProgress, [0, 1], [400, 0]);

  // Divider line
  const dividerHeight = interpolate(frame, [fps * 0.5, fps * 1.2], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: COLORS.bg,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Title */}
      <div
        style={{
          position: 'absolute',
          top: 50,
          left: 0,
          right: 0,
          zIndex: 3,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <AnimatedText
          text="Train Smarter. Not Harder."
          startFrame={Math.round(fps * 0.5)}
          fontSize={48}
          color={COLORS.text}
        />
      </div>

      {/* Split screen */}
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          paddingTop: 120,
        }}
      >
        {/* Left: Gym Workouts */}
        <div
          style={{
            flex: '0 0 50%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            transform: `translateX(${leftX}px)`,
            padding: '0 30px',
          }}
        >
          <div
            style={{
              fontFamily: FONT_FAMILY_DISPLAY,
              fontSize: 18,
              color: COLORS.accent,
              letterSpacing: 4,
              marginBottom: 16,
            }}
          >
            GYM WORKOUTS
          </div>
          <div
            style={{
              borderRadius: 12,
              overflow: 'hidden',
              boxShadow: `0 0 30px ${COLORS.accent}15`,
              border: `1px solid ${COLORS.accent}20`,
            }}
          >
            <Img
              src={staticFile('screenshots/07-gym-workouts.png')}
              style={{ width: 460, height: 'auto', display: 'block' }}
            />
          </div>
        </div>

        {/* Center divider */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '15%',
            width: 2,
            height: `${dividerHeight}%`,
            background: `linear-gradient(180deg, transparent, ${COLORS.primary}, transparent)`,
            transform: 'translateX(-50%)',
            zIndex: 2,
          }}
        />

        {/* Right: Heavy Bag Timer */}
        <div
          style={{
            flex: '0 0 50%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            transform: `translateX(${rightX}px)`,
            padding: '0 30px',
          }}
        >
          <div
            style={{
              fontFamily: FONT_FAMILY_DISPLAY,
              fontSize: 18,
              color: COLORS.primary,
              letterSpacing: 4,
              marginBottom: 16,
            }}
          >
            HEAVY BAG TIMER
          </div>
          <div
            style={{
              borderRadius: 12,
              overflow: 'hidden',
              boxShadow: `0 0 30px ${COLORS.primary}15`,
              border: `1px solid ${COLORS.primary}20`,
            }}
          >
            <Img
              src={staticFile('screenshots/08-heavy-bag-timer.png')}
              style={{ width: 460, height: 'auto', display: 'block' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
