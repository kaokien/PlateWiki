import React from 'react';
import { AbsoluteFill, Sequence, interpolate, staticFile } from 'remotion';
import { Audio } from '@remotion/media';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { slide } from '@remotion/transitions/slide';
import { IntroScene } from './scenes/IntroScene';
import { HeroScene } from './scenes/HeroScene';
import { BodyMapScene } from './scenes/BodyMapScene';
import { TechniqueLibraryScene } from './scenes/TechniqueLibraryScene';
import { TechniqueDetailScene } from './scenes/TechniqueDetailScene';
import { TrainingScene } from './scenes/TrainingScene';
import { ProgramsScene } from './scenes/ProgramsScene';
import { OutroScene } from './scenes/OutroScene';
import { FPS, SCENE_DURATIONS, COLORS } from './lib/config';

const TRANSITION_FRAMES = Math.round(FPS * 0.5); // 15 frames = 0.5s

// Calculate scene start frames for SFX placement
const T = TRANSITION_FRAMES;
const sceneStarts = {
  intro: 0,
  hero: SCENE_DURATIONS.intro * FPS - T,
  bodyMap: (SCENE_DURATIONS.intro + SCENE_DURATIONS.hero) * FPS - 2 * T,
  techniqueLib: (SCENE_DURATIONS.intro + SCENE_DURATIONS.hero + SCENE_DURATIONS.bodyMap) * FPS - 3 * T,
  techniqueDetail: (SCENE_DURATIONS.intro + SCENE_DURATIONS.hero + SCENE_DURATIONS.bodyMap + SCENE_DURATIONS.techniqueLib) * FPS - 4 * T,
  training: (SCENE_DURATIONS.intro + SCENE_DURATIONS.hero + SCENE_DURATIONS.bodyMap + SCENE_DURATIONS.techniqueLib + SCENE_DURATIONS.techniqueDetail) * FPS - 5 * T,
  programs: (SCENE_DURATIONS.intro + SCENE_DURATIONS.hero + SCENE_DURATIONS.bodyMap + SCENE_DURATIONS.techniqueLib + SCENE_DURATIONS.techniqueDetail + SCENE_DURATIONS.training) * FPS - 6 * T,
  outro: (SCENE_DURATIONS.intro + SCENE_DURATIONS.hero + SCENE_DURATIONS.bodyMap + SCENE_DURATIONS.techniqueLib + SCENE_DURATIONS.techniqueDetail + SCENE_DURATIONS.training + SCENE_DURATIONS.programs) * FPS - 7 * T,
};

export const BoxingWikiAd: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: COLORS.bg }}>
      {/* === AUDIO LAYER === */}

      {/* Background trap beat — fades in at 1s, fades out at end */}
      <Sequence from={FPS * 1} premountFor={FPS}>
        <Audio
          src={staticFile('audio/beat.wav')}
          volume={(f) => {
            // Fade in over 1s
            const fadeIn = interpolate(f, [0, FPS], [0, 0.6], { extrapolateRight: 'clamp' });
            // Fade out last 3s (around frame 870)
            const fadeOut = interpolate(f, [FPS * 28, FPS * 32], [0.6, 0], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });
            return Math.min(fadeIn, fadeOut);
          }}
        />
      </Sequence>

      {/* Impact hit on logo reveal (Scene 1, ~3s) */}
      <Sequence from={Math.round(FPS * 3)} premountFor={FPS}>
        <Audio src={staticFile('audio/impact.wav')} volume={0.8} />
      </Sequence>

      {/* Whoosh on each transition */}
      {[sceneStarts.hero, sceneStarts.bodyMap, sceneStarts.techniqueLib,
        sceneStarts.techniqueDetail, sceneStarts.training, sceneStarts.programs,
        sceneStarts.outro].map((startFrame, i) => (
        <Sequence key={`whoosh-${i}`} from={Math.round(startFrame)} premountFor={FPS}>
          <Audio src={staticFile('audio/whoosh.wav')} volume={0.5} />
        </Sequence>
      ))}

      {/* Impact hit on CTA reveal (Outro, ~2.5s into outro) */}
      <Sequence from={Math.round(sceneStarts.outro + FPS * 2.5)} premountFor={FPS}>
        <Audio src={staticFile('audio/impact.wav')} volume={0.7} />
      </Sequence>
      <TransitionSeries>
        {/* Scene 1: 3D Intro */}
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.intro * FPS}>
          <IntroScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
        />

        {/* Scene 2: Hero + Counter */}
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.hero * FPS}>
          <HeroScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: 'from-left' })}
          timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
        />

        {/* Scene 3: Body Map */}
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.bodyMap * FPS}>
          <BodyMapScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
        />

        {/* Scene 4: Technique Library */}
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.techniqueLib * FPS}>
          <TechniqueLibraryScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: 'from-right' })}
          timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
        />

        {/* Scene 5: Technique Detail */}
        <TransitionSeries.Sequence durationInFrames={Math.round(SCENE_DURATIONS.techniqueDetail * FPS)}>
          <TechniqueDetailScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
        />

        {/* Scene 6: Training Tools */}
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.training * FPS}>
          <TrainingScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: 'from-bottom' })}
          timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
        />

        {/* Scene 7: Programs */}
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.programs * FPS}>
          <ProgramsScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
        />

        {/* Scene 8: 3D Outro + CTA */}
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.outro * FPS}>
          <OutroScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
