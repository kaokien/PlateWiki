import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS, FONT_FAMILY_DISPLAY } from '../lib/config';

interface CounterAnimationProps {
  from: number;
  to: number;
  startFrame?: number;
  durationFrames?: number;
  suffix?: string;
  fontSize?: number;
  color?: string;
  style?: React.CSSProperties;
}

export const CounterAnimation: React.FC<CounterAnimationProps> = ({
  from = 0,
  to,
  startFrame = 0,
  durationFrames,
  suffix = '',
  fontSize = 120,
  color = COLORS.primary,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = frame - startFrame;
  const dur = durationFrames ?? fps * 2;

  if (localFrame < 0) return null;

  const progress = interpolate(localFrame, [0, dur], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Ease out for satisfying deceleration
  const eased = 1 - Math.pow(1 - progress, 3);
  const value = Math.round(from + (to - from) * eased);

  const opacity = interpolate(localFrame, [0, fps * 0.3], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const scale = interpolate(localFrame, [dur - 5, dur], [1, 1.15], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        opacity,
        transform: `scale(${scale})`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        ...style,
      }}
    >
      <span
        style={{
          fontSize,
          fontFamily: FONT_FAMILY_DISPLAY,
          fontWeight: 900,
          color,
          lineHeight: 1,
        }}
      >
        {value}
      </span>
      {suffix && (
        <span
          style={{
            fontSize: fontSize * 0.25,
            fontFamily: FONT_FAMILY_DISPLAY,
            fontWeight: 700,
            color: COLORS.text,
            letterSpacing: 8,
            marginTop: 8,
          }}
        >
          {suffix}
        </span>
      )}
    </div>
  );
};
