import React from 'react';
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS, FONT_FAMILY, FONT_FAMILY_DISPLAY } from '../lib/config';

const CATEGORIES = [
  { name: 'PUNCHES', count: 11, color: '#DC2626' },
  { name: 'DEFENSE', count: 7, color: '#F97316' },
  { name: 'FOOTWORK', count: 7, color: '#FBBF24' },
  { name: 'COMBOS', count: 9, color: '#10B981' },
  { name: 'RING IQ', count: 6, color: '#3B82F6' },
  { name: 'CONDITIONING', count: 11, color: '#8B5CF6' },
];

export const TechniqueLibraryScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

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
      {/* Left: Category pills */}
      <div
        style={{
          flex: '0 0 40%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 80px',
          gap: 20,
        }}
      >
        {/* Title */}
        {(() => {
          const titleOpacity = interpolate(frame, [0, fps * 0.4], [0, 1], {
            extrapolateRight: 'clamp',
          });
          const titleY = interpolate(frame, [0, fps * 0.6], [30, 0], {
            extrapolateRight: 'clamp',
          });
          return (
            <div
              style={{
                opacity: titleOpacity,
                transform: `translateY(${titleY}px)`,
                fontFamily: FONT_FAMILY_DISPLAY,
                fontWeight: 900,
                fontSize: 48,
                color: COLORS.text,
                letterSpacing: 2,
                marginBottom: 20,
              }}
            >
              6 CATEGORIES
            </div>
          );
        })()}

        {/* Category pills */}
        {CATEGORIES.map((cat, i) => {
          const delay = fps * 0.3 + i * fps * 0.15;
          const pillProgress = spring({
            frame: Math.max(0, frame - delay),
            fps,
            config: { damping: 14, stiffness: 100, mass: 0.6 },
          });
          const pillX = interpolate(pillProgress, [0, 1], [-200, 0]);
          const pillOpacity = interpolate(pillProgress, [0, 0.3], [0, 1], {
            extrapolateRight: 'clamp',
          });

          return (
            <div
              key={cat.name}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                opacity: pillOpacity,
                transform: `translateX(${pillX}px)`,
              }}
            >
              <div
                style={{
                  width: 6,
                  height: 40,
                  background: cat.color,
                  borderRadius: 3,
                  boxShadow: `0 0 12px ${cat.color}60`,
                }}
              />
              <div
                style={{
                  fontFamily: FONT_FAMILY_DISPLAY,
                  fontSize: 28,
                  fontWeight: 700,
                  color: COLORS.text,
                  letterSpacing: 3,
                }}
              >
                {cat.name}
              </div>
              <div
                style={{
                  fontFamily: FONT_FAMILY,
                  fontSize: 18,
                  color: COLORS.textMuted,
                  marginLeft: 'auto',
                }}
              >
                {cat.count}
              </div>
            </div>
          );
        })}
      </div>

      {/* Right: Screenshot */}
      <div
        style={{
          flex: '0 0 60%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        {(() => {
          const imgOpacity = interpolate(frame, [fps * 0.3, fps * 0.8], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          const imgScale = interpolate(frame, [fps * 0.3, fps * 0.8], [0.95, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          return (
            <div
              style={{
                opacity: imgOpacity,
                transform: `scale(${imgScale})`,
                borderRadius: 16,
                overflow: 'hidden',
                boxShadow: `0 0 40px ${COLORS.primary}20, 0 20px 60px rgba(0,0,0,0.5)`,
              }}
            >
              <Img
                src={staticFile('screenshots/03-technique-library.png')}
                style={{ width: 780, height: 'auto', display: 'block' }}
              />
            </div>
          );
        })()}
      </div>
    </div>
  );
};
