// Timing and design constants for BoxingWiki Ad
export const FPS = 30;

// Scene durations in seconds
export const SCENE_DURATIONS = {
  intro: 4,        // 3D boxing glove + logo
  hero: 4,         // Hero screenshot + tagline
  bodyMap: 5,      // Body map demo
  techniqueLib: 4, // Technique library montage
  techniqueDetail: 4.5, // Technique detail zoom
  training: 5,     // Training tools split-screen
  programs: 4,     // Programs
  outro: 5,        // 3D outro + CTA
} as const;

export const TRANSITION_DURATION = 0.5; // seconds overlap

// Total duration in frames
export const TOTAL_SCENES = Object.values(SCENE_DURATIONS);
export const TOTAL_DURATION_SECONDS = TOTAL_SCENES.reduce((a, b) => a + b, 0);
export const TOTAL_DURATION_FRAMES = Math.ceil(TOTAL_DURATION_SECONDS * FPS);

// Brand colors
export const COLORS = {
  bg: '#0a0a0a',
  surface: '#121212',
  primary: '#DC2626',    // BoxingWiki red
  accent: '#00F0FF',     // Cyan accent
  text: '#FFFFFF',
  textMuted: '#9CA3AF',
  gold: '#FFD700',
} as const;

// Font family
export const FONT_FAMILY = "'Inter', 'Helvetica Neue', sans-serif";
export const FONT_FAMILY_DISPLAY = "'Oswald', 'Impact', sans-serif";

// Dimensions
export const LANDSCAPE = { width: 1920, height: 1080 };
export const VERTICAL = { width: 1080, height: 1920 };
