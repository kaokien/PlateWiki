import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS, FONT_FAMILY } from '../lib/config';

interface FeatureCalloutProps {
  label: string;
  x: number; // percentage
  y: number; // percentage
  startFrame?: number;
  color?: string;
}

export const FeatureCallout: React.FC<FeatureCalloutProps> = ({
  label,
  x,
  y,
  startFrame = 0,
  color = COLORS.accent,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = frame - startFrame;

  if (localFrame < 0) return null;

  const scale = spring({
    frame: localFrame,
    fps,
    config: { damping: 12, stiffness: 120, mass: 0.5 },
  });

  const opacity = interpolate(localFrame, [0, fps * 0.3], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        left: `${x}%`,
        top: `${y}%`,
        transform: `translate(-50%, -50%) scale(${scale})`,
        opacity,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}
    >
      {/* Pulse dot */}
      <div
        style={{
          width: 12,
          height: 12,
          borderRadius: '50%',
          background: color,
          boxShadow: `0 0 12px ${color}, 0 0 24px ${color}40`,
        }}
      />
      {/* Label */}
      <div
        style={{
          background: `${COLORS.surface}E0`,
          border: `1px solid ${color}60`,
          borderRadius: 6,
          padding: '6px 14px',
          color: COLORS.text,
          fontSize: 14,
          fontFamily: FONT_FAMILY,
          fontWeight: 600,
          letterSpacing: 1,
          whiteSpace: 'nowrap',
          backdropFilter: 'blur(8px)',
        }}
      >
        {label}
      </div>
    </div>
  );
};
