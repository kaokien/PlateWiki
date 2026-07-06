import React from 'react';
import { Composition } from 'remotion';
import { BoxingWikiAd } from './BoxingWikiAd';
import {
  FPS,
  SCENE_DURATIONS,
  LANDSCAPE,
  VERTICAL,
} from './lib/config';

// Calculate total duration accounting for transitions
const TRANSITION_FRAMES = Math.round(FPS * 0.5);
const NUM_TRANSITIONS = 7; // 8 scenes = 7 transitions
const SCENE_FRAMES = Object.values(SCENE_DURATIONS).reduce(
  (sum, dur) => sum + Math.round(dur * FPS),
  0
);
const TOTAL_FRAMES = SCENE_FRAMES - NUM_TRANSITIONS * TRANSITION_FRAMES;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* 16:9 Landscape — Discord / YouTube */}
      <Composition
        id="BoxingWikiAd"
        component={BoxingWikiAd}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={LANDSCAPE.width}
        height={LANDSCAPE.height}
      />

      {/* 9:16 Vertical — TikTok / Reels (same composition, different viewport) */}
      <Composition
        id="BoxingWikiAdVertical"
        component={BoxingWikiAd}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={VERTICAL.width}
        height={VERTICAL.height}
      />
    </>
  );
};
