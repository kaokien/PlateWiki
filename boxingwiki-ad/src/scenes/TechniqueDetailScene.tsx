import React from 'react';
import { Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { AnimatedText } from '../components/AnimatedText';
import { FeatureCallout } from '../components/FeatureCallout';
import { COLORS } from '../lib/config';

export const TechniqueDetailScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Ken Burns zoom
  const scale = interpolate(frame, [0, fps * 4.5], [1.1, 1.35], {
    extrapolateRight: 'clamp',
  });

  const panX = interpolate(frame, [0, fps * 4.5], [0, -40], {
    extrapolateRight: 'clamp',
  });

  const panY = interpolate(frame, [0, fps * 4.5], [0, -30], {
    extrapolateRight: 'clamp',
  });

  const imgOpacity = interpolate(frame, [0, fps * 0.4], [0, 1], {
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
      {/* Technique detail screenshot with Ken Burns */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: imgOpacity,
          transform: `scale(${scale}) translate(${panX}px, ${panY}px)`,
        }}
      >
        <Img
          src={staticFile('screenshots/05-technique-detail.png')}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </div>

      {/* Dark overlay for text */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(135deg, ${COLORS.bg}E0 0%, ${COLORS.bg}80 40%, transparent 70%)`,
        }}
      />

      {/* Callout annotations */}
      <FeatureCallout
        label="Muscle groups targeted"
        x={22}
        y={38}
        startFrame={Math.round(fps * 1)}
        color={COLORS.primary}
      />
      <FeatureCallout
        label="Step-by-step execution"
        x={25}
        y={52}
        startFrame={Math.round(fps * 1.6)}
        color={COLORS.accent}
      />
      <FeatureCallout
        label="Common mistakes"
        x={20}
        y={66}
        startFrame={Math.round(fps * 2.2)}
        color="#FBBF24"
      />

      {/* Title overlay */}
      <div
        style={{
          position: 'absolute',
          top: 60,
          left: 80,
          right: '50%',
        }}
      >
        <AnimatedText
          text="Every technique."
          startFrame={Math.round(fps * 0.3)}
          fontSize={52}
          color={COLORS.text}
          style={{ textAlign: 'left' }}
        />
        <AnimatedText
          text="Biomechanically broken down."
          startFrame={Math.round(fps * 0.8)}
          fontSize={36}
          color={COLORS.accent}
          style={{ textAlign: 'left', marginTop: 8 }}
        />
      </div>
    </div>
  );
};
