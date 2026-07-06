/** Type declarations for the gym workouts data module */

import type { Technique } from './techniques';

export interface GymExercise {
  name: string;
  sets: number;
  reps: number | string;
  rest: string;
  note: string;
}

export interface GymWorkout {
  title: string;
  duration: string;
  focus: string;
  warmup: string;
  exercises: GymExercise[];
  cooldown: string;
}

export const workoutsByCategory: Record<string, GymWorkout>;

export function getWorkoutForTechnique(
  technique: Technique | null | undefined
): (GymWorkout & { techniqueId: string; isFallback?: boolean }) | null;
