import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS, FONT_FAMILY_DISPLAY } from '../lib/config';

interface AnimatedTextProps {
  text: string;
  startFrame?: number;
  style?: React.CSSProperties;
  color?: string;
  fontSize?: number;
  letterSpacing?: number;
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  startFrame = 0,
  style = {},
  color = COLORS.text,
  fontSize = 72,
  letterSpacing = 4,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = frame - startFrame;

  if (localFrame < 0) return null;

  const opacity = interpolate(localFrame, [0, fps * 0.5], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const translateY = spring({
    frame: localFrame,
    fps,
    config: { damping: 15, stiffness: 80, mass: 0.8 },
  });

  const y = interpolate(translateY, [0, 1], [40, 0]);

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${y}px)`,
        color,
        fontSize,
        fontFamily: FONT_FAMILY_DISPLAY,
        fontWeight: 900,
        textTransform: 'uppercase' as const,
        letterSpacing,
        textAlign: 'center' as const,
        ...style,
      }}
    >
      {text}
    </div>
  );
};
