import { getWorkoutLog } from './storage';
import { getProfile, getRankForXP } from './fighterProfile';
import { workoutsByCategory } from '../data/gymWorkouts';
import { techniques } from '../data/techniques';

export interface RecommendedWorkout {
  id: string;
  title: string;
  duration: string;
  focus: string;
  reason: string;
}

/**
 * Get a personalized workout recommendation based on user rank and history.
 * Runs completely locally and client-side (100% free, private).
 */
export function getPersonalizedWorkout(): RecommendedWorkout {
  const profile = getProfile();
  const log = getWorkoutLog();
  const rank = getRankForXP(profile.xp);

  // Default recommendations based on training goal or rank if no history exists
  if (log.length === 0) {
    if (profile.trainingGoal === 'speed') {
      return {
        id: 'jab',
        title: workoutsByCategory['jab']?.title || 'Jab Power & Speed',
        duration: workoutsByCategory['jab']?.duration || '20 min',
        focus: workoutsByCategory['jab']?.focus || 'Shoulder snap, tricep extension, wrist stability',
        reason: 'Accelerate your hands: start with the speed and snap of the lead jab.',
      };
    }
    if (profile.trainingGoal === 'power') {
      return {
        id: 'cross',
        title: workoutsByCategory['cross']?.title || 'Rear Hand Power Mechanics',
        duration: workoutsByCategory['cross']?.duration || '20 min',
        focus: workoutsByCategory['cross']?.focus || 'Rotational leverage, hip drive, shoulder rotation',
        reason: 'Build explosive force: master the rotation behind your primary power punch.',
      };
    }
    if (profile.trainingGoal === 'stamina') {
      return {
        id: 'shadow-boxing',
        title: workoutsByCategory['shadow-boxing']?.title || 'Shadowboxing Conditioning',
        duration: workoutsByCategory['shadow-boxing']?.duration || '15 min',
        focus: workoutsByCategory['shadow-boxing']?.focus || 'Aerobic base, rhythm, high volume rounds',
        reason: 'Build stamina: start with interval rounds of active shadowboxing.',
      };
    }
    if (profile.trainingGoal === 'defense') {
      return {
        id: 'slip-outside',
        title: workoutsByCategory['slip-outside']?.title || 'Defensive Slips & Head Movement',
        duration: workoutsByCategory['slip-outside']?.duration || '18 min',
        focus: workoutsByCategory['slip-outside']?.focus || 'Torso rotation, weight transfer, counter angles',
        reason: 'Defense first: start with head movement to slip punches and create angles.',
      };
    }

    if (rank.minXP >= 1000) {
      return {
        id: 'mexican-combo',
        title: workoutsByCategory['mexican-combo']?.title || 'Mexican Style Hook Rip',
        duration: workoutsByCategory['mexican-combo']?.duration || '25 min',
        focus: workoutsByCategory['mexican-combo']?.focus || 'Body-head flow, liver shot, rotational power',
        reason: `Based on your elite rank (${rank.name}), try this advanced body-ripping flow.`,
      };
    }
    
    // Default fallback
    return {
      id: 'jab',
      title: workoutsByCategory['jab']?.title || 'Jab Power & Speed',
      duration: workoutsByCategory['jab']?.duration || '20 min',
      focus: workoutsByCategory['jab']?.focus || 'Shoulder snap, tricep extension, wrist stability',
      reason: 'Start your journey with the most important punch in boxing.',
    };
  }

  // Analyze last completed workout
  const lastEntry = log[0];
  const lastWorkoutId = lastEntry.workoutId;
  
  // Find a category to recommend next to avoid fatigue and balance training
  // Categories: Punches, Defense, Footwork, Conditioning, Combinations
  const categories = ['Punches', 'Defense', 'Footwork', 'Conditioning', 'Combinations'];
  let lastCategory = 'Punches';

  // Find category of the last workout
  const matchedTechnique = lastWorkoutId ? techniques[lastWorkoutId] : undefined;
  if (matchedTechnique) {
    lastCategory = matchedTechnique.category;
  }

  // Select next category in rotation
  const lastCatIndex = categories.indexOf(lastCategory);
  const nextCategory = categories[lastCatIndex === -1 ? 0 : (lastCatIndex + 1) % categories.length];

  // Workouts by category
  const pool: { id: string; category: string }[] = [
    { id: 'jab', category: 'Punches' },
    { id: 'cross', category: 'Punches' },
    { id: 'lead-hook', category: 'Punches' },
    { id: 'slip-outside', category: 'Defense' },
    { id: 'high-guard', category: 'Defense' },
    { id: 'duck-under', category: 'Defense' },
    { id: 'lateral-movement', category: 'Footwork' },
    { id: 'step-drag', category: 'Footwork' },
    { id: 'pivot-escape', category: 'Footwork' },
    { id: 'shadow-boxing', category: 'Conditioning' },
    { id: 'core-conditioning', category: 'Conditioning' },
    { id: 'heavy-bag-conditioning', category: 'Conditioning' },
    { id: 'one-two', category: 'Combinations' },
    { id: 'three-punch-combo', category: 'Combinations' },
    { id: 'double-jab-cross', category: 'Combinations' },
  ];

  // Bias category selection towards the selected training goal
  let targetCategory = nextCategory;
  let isBiased = false;
  if (profile.trainingGoal && Math.random() < 0.4) {
    isBiased = true;
    if (profile.trainingGoal === 'speed' || profile.trainingGoal === 'power') {
      targetCategory = Math.random() < 0.5 ? 'Punches' : 'Combinations';
    } else if (profile.trainingGoal === 'stamina') {
      targetCategory = 'Conditioning';
    } else if (profile.trainingGoal === 'defense') {
      targetCategory = 'Defense';
    }
  }

  // Filter pool by target category
  let candidates = pool.filter(item => item.category === targetCategory && item.id !== lastWorkoutId);
  if (candidates.length === 0) {
    candidates = pool.filter(item => item.id !== lastWorkoutId);
    isBiased = false;
  }

  // Select a candidate based on XP rank
  // High XP users get advanced combos or harder drills
  if (profile.xp >= 500) {
    if (targetCategory === 'Combinations') {
      candidates.push(
        { id: 'mexican-combo', category: 'Combinations' },
        { id: 'philly-shell-counter', category: 'Combinations' },
        { id: 'peekaboo-counter', category: 'Combinations' }
      );
    }
  }

  const selection = candidates[Math.floor(Math.random() * candidates.length)] || pool[0];
  const workoutInfo = workoutsByCategory[selection.id];

  const goalNames: Record<string, string> = {
    speed: 'Hand Speed',
    power: 'Punching Power',
    stamina: 'Stamina',
    defense: 'Defense',
  };

  return {
    id: selection.id,
    title: workoutInfo?.title || 'Boxing Workout',
    duration: workoutInfo?.duration || '20 min',
    focus: workoutInfo?.focus || 'Balance & Form',
    reason: isBiased && profile.trainingGoal
      ? `Based on your focus on ${goalNames[profile.trainingGoal] || 'training'}, try this specialized workout.`
      : `You completed a ${lastCategory} drill last session. Try this ${selection.category} workout to balance your training.`,
  };
}
