import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS, FONT_FAMILY } from '../lib/config';

interface GlowTextProps {
  text: string;
  startFrame?: number;
  color?: string;
  glowColor?: string;
  fontSize?: number;
  style?: React.CSSProperties;
}

export const GlowText: React.FC<GlowTextProps> = ({
  text,
  startFrame = 0,
  color = COLORS.accent,
  glowColor = COLORS.accent,
  fontSize = 24,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = frame - startFrame;

  if (localFrame < 0) return null;

  const opacity = interpolate(localFrame, [0, fps * 0.4], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const glowIntensity = interpolate(
    localFrame,
    [0, fps * 0.6, fps * 1.2],
    [0, 20, 12],
    { extrapolateRight: 'clamp' }
  );

  return (
    <div
      style={{
        opacity,
        color,
        fontSize,
        fontFamily: FONT_FAMILY,
        fontWeight: 600,
        textTransform: 'uppercase' as const,
        letterSpacing: 6,
        textShadow: `0 0 ${glowIntensity}px ${glowColor}, 0 0 ${glowIntensity * 2}px ${glowColor}40`,
        textAlign: 'center' as const,
        ...style,
      }}
    >
      {text}
    </div>
  );
};
