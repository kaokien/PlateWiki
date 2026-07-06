import React from 'react';
import { Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { AnimatedText } from '../components/AnimatedText';
import { FeatureCallout } from '../components/FeatureCallout';
import { COLORS } from '../lib/config';

export const BodyMapScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Slow zoom into the body map screenshot
  const scale = interpolate(frame, [0, fps * 5], [1, 1.12], {
    extrapolateRight: 'clamp',
  });

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
      }}
    >
      {/* Body map screenshot */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          opacity: imgOpacity,
          transform: `scale(${scale})`,
        }}
      >
        <Img
          src={staticFile('screenshots/02-body-map.png')}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </div>

      {/* Gradient overlay for text readability */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(180deg, ${COLORS.bg}CC 0%, transparent 30%, transparent 70%, ${COLORS.bg}CC 100%)`,
        }}
      />

      {/* Callout annotations */}
      <FeatureCallout
        label="Front muscles"
        x={32}
        y={45}
        startFrame={Math.round(fps * 0.8)}
      />
      <FeatureCallout
        label="Back muscles"
        x={68}
        y={45}
        startFrame={Math.round(fps * 1.4)}
      />
      <FeatureCallout
        label="Click any muscle group"
        x={50}
        y={32}
        startFrame={Math.round(fps * 2)}
        color={COLORS.primary}
      />

      {/* Bottom text */}
      <div
        style={{
          position: 'absolute',
          bottom: 60,
          left: 0,
          right: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <AnimatedText
          text="Tap any muscle. See every technique."
          startFrame={Math.round(fps * 2.5)}
          fontSize={42}
          color={COLORS.text}
        />
      </div>
    </div>
  );
};
