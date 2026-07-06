import { foodsData } from './foodsData';

export { bodyParts } from './bodyParts.js';

// Re-export foodsData as techniques to keep API compatibility with existing Next.js views
export const techniques = foodsData;

/** Dynamic count — import this instead of hardcoding numbers */
export const TECHNIQUE_COUNT = Object.keys(techniques).length;
