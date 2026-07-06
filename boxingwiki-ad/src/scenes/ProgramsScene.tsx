import React from 'react';
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { AnimatedText } from '../components/AnimatedText';
import { COLORS, FONT_FAMILY, FONT_FAMILY_DISPLAY } from '../lib/config';

const PROGRAMS = [
  { name: '7-Day Boxing Fundamentals', days: 7, color: '#10B981' },
  { name: '14-Day Knockout Power', days: 14, color: '#DC2626' },
];

export const ProgramsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const imgOpacity = interpolate(frame, [0, fps * 0.5], [0, 1], {
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
        display: 'flex',
      }}
    >
      {/* Left: Screenshot */}
      <div
        style={{
          flex: '0 0 55%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          opacity: imgOpacity,
        }}
      >
        <div
          style={{
            borderRadius: 16,
            overflow: 'hidden',
            boxShadow: `0 0 40px rgba(0,0,0,0.4)`,
          }}
        >
          <Img
            src={staticFile('screenshots/09-programs.png')}
            style={{ width: 780, height: 'auto', display: 'block' }}
          />
        </div>
      </div>

      {/* Right: Program cards with progress bars */}
      <div
        style={{
          flex: '0 0 45%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 60px',
          gap: 40,
        }}
      >
        <AnimatedText
          text="Structured Programs"
          startFrame={Math.round(fps * 0.3)}
          fontSize={42}
          style={{ textAlign: 'left' }}
        />

        {PROGRAMS.map((prog, i) => {
          const delay = fps * 0.8 + i * fps * 0.4;
          const cardProgress = spring({
            frame: Math.max(0, frame - delay),
            fps,
            config: { damping: 14, stiffness: 90, mass: 0.7 },
          });
          const cardOpacity = interpolate(cardProgress, [0, 0.3], [0, 1], {
            extrapolateRight: 'clamp',
          });
          const cardX = interpolate(cardProgress, [0, 1], [100, 0]);

          // Progress bar fill
          const barDelay = delay + fps * 0.3;
          const barWidth = interpolate(
            frame,
            [barDelay, barDelay + fps * 1.5],
            [0, 100],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
          );

          return (
            <div
              key={prog.name}
              style={{
                opacity: cardOpacity,
                transform: `translateX(${cardX}px)`,
                background: `${COLORS.surface}`,
                border: `1px solid ${prog.color}30`,
                borderRadius: 12,
                padding: '24px 28px',
              }}
            >
              <div
                style={{
                  fontFamily: FONT_FAMILY_DISPLAY,
                  fontSize: 22,
                  fontWeight: 700,
                  color: COLORS.text,
                  letterSpacing: 1,
                  marginBottom: 8,
                }}
              >
                {prog.name}
              </div>
              <div
                style={{
                  fontFamily: FONT_FAMILY,
                  fontSize: 14,
                  color: COLORS.textMuted,
                  marginBottom: 16,
                }}
              >
                {prog.days} days · Structured daily workouts
              </div>
              {/* Progress bar */}
              <div
                style={{
                  width: '100%',
                  height: 6,
                  background: `${prog.color}20`,
                  borderRadius: 3,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${barWidth}%`,
                    height: '100%',
                    background: `linear-gradient(90deg, ${prog.color}, ${prog.color}CC)`,
                    borderRadius: 3,
                    boxShadow: `0 0 8px ${prog.color}60`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
