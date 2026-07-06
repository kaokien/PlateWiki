/**
 * Workout generator — builds a session from goal, level, equipment, and
 * focus areas. Extracted from WorkoutGeneratorPage so the selection logic
 * is unit-testable.
 */
import { techniques } from '@/data/techniques';
import { workoutsByCategory } from '@/data/gymWorkouts';

export type GeneratedWorkout = {
  title: string;
  duration: string;
  warmup: string[];
  drills: { name: string; techniqueId: string; category: string; sets: string; description: string }[];
  gymExercises: { name: string; sets: number; reps: string; rest: string; note: string }[];
  cooldown: string[];
};

const WARMUPS: Record<string, string[]> = {
  beginner: ['Prepare clean water — 1 glass', 'Deep diaphragmatic breathing — 1 min', 'Light bodyweight movement to mobilize joints — 2 min'],
  intermediate: ['Hydration baseline prep — 2 glasses water + trace salt', 'Shadow movement and posture check — 2 min', 'Diaphragmatic breathing — 1 min'],
  advanced: ['Pre-fueling hydration prep — 2 glasses water + electrolytes', 'Active mobility flow — 3 min', 'Intestinal wall activation cues — 1 min'],
};

const COOLDOWNS: Record<string, string[]> = {
  beginner: ['Post-intake rest — sit quietly for 3 min', 'Deep abdominal massage — 1 min', 'Clean up kitchen tools'],
  intermediate: ['Fasting window transition — 5 min quiet rest', 'Deep stomach vacuums for digestion support — 2 min', 'Kitchen cleanup'],
  advanced: ['Parasympathetic recovery breathing — 4 min', 'Digestive transit mobility stretches — 3 min', 'Kitchen and gear sterilization'],
};

// Map nutrition goals to database categories
const GOAL_CATEGORY_MAP: Record<string, string[]> = {
  power: ['Macronutrients', 'Micronutrients'],
  speed: ['Macronutrients', 'Hydration & Salts'],
  defense: ['Superfoods & Adaptogens', 'Gut & Digestion', 'Micronutrients'],
  conditioning: ['Macronutrients', 'Hydration & Salts', 'Gut & Digestion'],
  'all-around': ['Macronutrients', 'Hydration & Salts', 'Micronutrients', 'Gut & Digestion', 'Superfoods & Adaptogens'],
};

const GOAL_LABELS: Record<string, string> = {
  power: 'Power & Strength',
  speed: 'Speed & Metabolism',
  defense: 'Gut Shield & Recovery',
  conditioning: 'Conditioning & Performance',
  'all-around': 'All-Around Fueling',
};

// Map food/supplements to preparation requirements
const TECHNIQUE_EQUIPMENT: Record<string, string[]> = {
  'sweet-potato': ['heavy-bag', 'full-gym'], // requires stove/oven
  'whey-isolate': ['double-end', 'full-gym'], // requires shaker/blender
  'ginger':       ['speed-bag', 'full-gym'],  // requires juicer/cooking
  'eggs':         ['heavy-bag', 'full-gym'],  // requires stove/skillet
  'salmon':       ['heavy-bag', 'full-gym'],  // requires stove/oven
  'kefir':        ['none', 'heavy-bag', 'speed-bag', 'double-end', 'full-gym'],
  'ashwagandha':  ['none', 'heavy-bag', 'speed-bag', 'double-end', 'full-gym'],
  'lions-mane':   ['none', 'heavy-bag', 'speed-bag', 'double-end', 'full-gym'],
  'turmeric':     ['none', 'heavy-bag', 'speed-bag', 'double-end', 'full-gym'],
  'blueberries':  ['none', 'heavy-bag', 'speed-bag', 'double-end', 'full-gym'],
  'spinach':      ['none', 'heavy-bag', 'speed-bag', 'double-end', 'full-gym'],
  'pumpkin-seeds':['none', 'heavy-bag', 'speed-bag', 'double-end', 'full-gym'],
  'coconut-water':['none', 'heavy-bag', 'speed-bag', 'double-end', 'full-gym'],
  'oatmeal':      ['heavy-bag', 'full-gym'],
  'himalayan-salt':['none', 'heavy-bag', 'speed-bag', 'double-end', 'full-gym'],
  // New Macronutrients
  'chicken-breast': ['heavy-bag', 'full-gym'],  // requires stove/oven
  'greek-yogurt':   ['none', 'heavy-bag', 'speed-bag', 'double-end', 'full-gym'],
  'quinoa':         ['heavy-bag', 'full-gym'],  // requires stovetop
  'brown-rice':     ['heavy-bag', 'full-gym'],  // requires stovetop
  'avocado':        ['none', 'heavy-bag', 'speed-bag', 'double-end', 'full-gym'],
  'beef-liver':     ['heavy-bag', 'full-gym'],  // requires stove + processor
  'lentils':        ['heavy-bag', 'full-gym'],  // requires stovetop
  'wild-tuna':      ['heavy-bag', 'full-gym'],  // requires skillet
  'banana':         ['none', 'heavy-bag', 'speed-bag', 'double-end', 'full-gym'],
  // New Hydration & Salts
  'watermelon':       ['none', 'heavy-bag', 'speed-bag', 'double-end', 'full-gym'],
  'bone-broth':       ['heavy-bag', 'full-gym'],  // requires slow cooker/pot
  'tart-cherry-juice':['none', 'heavy-bag', 'speed-bag', 'double-end', 'full-gym'],
  'green-tea':        ['none', 'heavy-bag', 'speed-bag', 'double-end', 'full-gym'],
  // New Micronutrients
  'sweet-peppers':  ['none', 'heavy-bag', 'speed-bag', 'double-end', 'full-gym'],
  'broccoli':       ['heavy-bag', 'full-gym'],  // requires steamer/oven
  'brazil-nuts':    ['none', 'heavy-bag', 'speed-bag', 'double-end', 'full-gym'],
  'sardines':       ['none', 'heavy-bag', 'speed-bag', 'double-end', 'full-gym'],
  'dark-chocolate': ['none', 'heavy-bag', 'speed-bag', 'double-end', 'full-gym'],
  // New Gut & Digestion
  'sauerkraut':     ['none', 'heavy-bag', 'speed-bag', 'double-end', 'full-gym'],
  'kimchi':         ['none', 'heavy-bag', 'speed-bag', 'double-end', 'full-gym'],
  'psyllium-husk':  ['none', 'heavy-bag', 'speed-bag', 'double-end', 'full-gym'],
  'apple-cider-raw':['none', 'heavy-bag', 'speed-bag', 'double-end', 'full-gym'],
  'miso':           ['heavy-bag', 'full-gym'],  // requires hot water/pot
  // New Superfoods & Adaptogens
  'spirulina':        ['none', 'heavy-bag', 'speed-bag', 'double-end', 'full-gym'],
  'maca-root':        ['none', 'heavy-bag', 'speed-bag', 'double-end', 'full-gym'],
  'reishi-mushroom':  ['none', 'heavy-bag', 'speed-bag', 'double-end', 'full-gym'],
  'creatine-mono':    ['none', 'heavy-bag', 'speed-bag', 'double-end', 'full-gym'],
  'collagen-peptides':['none', 'heavy-bag', 'speed-bag', 'double-end', 'full-gym'],
};

export function techniqueAllowedForEquipment(techniqueId: string, equipment: string): boolean {
  const required = TECHNIQUE_EQUIPMENT[techniqueId];
  return !required || required.includes(equipment);
}

// Free-text gym exercises: infer equipment needs from name + note.
const WEIGHTS_PATTERN = /(pan|stove|oven|blend|shak|juice|steam|cook|kettle|knife|chop|scale|thermometer)/i;

export function exerciseAllowedForEquipment(
  exercise: { name: string; note?: string },
  equipment: string,
): boolean {
  if (equipment === 'full-gym') return true;
  const text = `${exercise.name} ${exercise.note || ''}`;
  if (/stove|oven|pan/i.test(text)) return equipment === 'heavy-bag';
  if (/juice/i.test(text)) return equipment === 'speed-bag';
  if (/blend|shak/i.test(text)) return equipment === 'double-end';
  return !WEIGHTS_PATTERN.test(text);
}

function warmupForEquipment(level: string, equipment: string): string[] {
  const base = WARMUPS[level] || WARMUPS.beginner;
  if (equipment !== 'none') return base;
  return base.map(item =>
    item.toLowerCase().includes('water')
      ? item.replace(/water/i, 'pure filtered water')
      : item,
  );
}

export function generateWorkout(
  goal: string,
  level: string,
  equipment: string,
  focusAreas: string[],
): GeneratedWorkout {
  const allTechniques = Object.values(techniques) as any[];

  // 1. Filter by difficulty
  const levelOrder: Record<string, number> = { beginner: 1, intermediate: 2, advanced: 3 };
  const maxLevel = levelOrder[level] || 1;
  const levelFiltered = allTechniques.filter(t => (levelOrder[t.difficulty] || 1) <= maxLevel);

  // 2. Determine target categories from goal + user focus
  const goalCats = GOAL_CATEGORY_MAP[goal] || GOAL_CATEGORY_MAP['all-around'];
  const effectiveFocus = focusAreas.length > 0 ? focusAreas : goalCats;

  // 3. Filter by categories AND by what the user's equipment can drill
  const categoryFiltered = levelFiltered.filter(
    t => effectiveFocus.includes(t.category) && techniqueAllowedForEquipment(t.id, equipment),
  );

  // 4. Shuffle and pick drills
  const shuffled = [...categoryFiltered].sort(() => Math.random() - 0.5);
  const drillCount = level === 'beginner' ? 4 : level === 'intermediate' ? 5 : 6;
  const selectedTechniques = shuffled.slice(0, drillCount);

  // 5. Build drills from selected techniques
  const drills = selectedTechniques.map(t => {
    const roundCount = level === 'beginner' ? 2 : level === 'intermediate' ? 3 : 4;
    let desc = '';
    if (t.category === 'Macronutrients') {
      if (equipment === 'none') {
        desc = `Prepare raw: Consume ${roundCount} servings of ${t.name} focusing on complete absorption.`;
      } else {
        desc = `Prepare cooked/mix: Consume ${roundCount} servings of ${t.name} post-intake.`;
      }
    } else if (t.category === 'Hydration & Salts') {
      desc = `Hydrate: Sip ${t.name} at regular intervals during your active window.`;
    } else if (t.category === 'Superfoods & Adaptogens') {
      desc = `Recovery: Consume ${t.name} to regulate cortisol levels and support adrenal function.`;
    } else if (t.category === 'Gut & Digestion') {
      desc = `Digestive health: Integrate fermented ${t.name} to optimize gut flora.`;
    } else {
      desc = `Integrate: Use ${t.name} to boost systemic microbiome status and nutrient delivery.`;
    }
    return {
      name: t.name,
      techniqueId: t.id,
      category: t.category,
      sets: `${roundCount} intervals`,
      description: desc,
    };
  });

  // 6. Pull gym exercises from matching workouts
  const gymExercises: GeneratedWorkout['gymExercises'] = [];
  const usedExerciseNames = new Set<string>();

  const addExercise = (ex: any) => {
    if (usedExerciseNames.has(ex.name) || gymExercises.length >= 4) return;
    if (!exerciseAllowedForEquipment(ex, equipment)) return;
    usedExerciseNames.add(ex.name);
    gymExercises.push({ name: ex.name, sets: ex.sets, reps: String(ex.reps), rest: ex.rest, note: ex.note });
  };

  for (const t of selectedTechniques) {
    const workout = workoutsByCategory[t.id];
    if (workout && workout.exercises) {
      for (const ex of workout.exercises) addExercise(ex);
    }
  }

  if (gymExercises.length < 3) {
    const relevantKeys = Object.keys(workoutsByCategory).filter(key => {
      const matchTech = allTechniques.find(t => t.id === key);
      return matchTech && effectiveFocus.includes(matchTech.category);
    });
    for (const key of relevantKeys.sort(() => Math.random() - 0.5)) {
      const w = workoutsByCategory[key];
      if (w?.exercises) {
        for (const ex of w.exercises) addExercise(ex);
      }
    }
  }

  // 7. Estimate duration
  const finalGymExercises = equipment === 'none' ? [] : gymExercises;
  const drillMinutes = drills.length * (level === 'beginner' ? 4 : level === 'intermediate' ? 6 : 8);
  const gymMinutes = finalGymExercises.length * 4;
  const totalMin = 5 + drillMinutes + gymMinutes + 4;
  const duration = `~${totalMin} min`;

  // 8. Title
  const goalLabel = GOAL_LABELS[goal] || 'Fuel';
  const title = `${goalLabel} ${level.charAt(0).toUpperCase() + level.slice(1)} Fuel Plan`;

  return {
    title,
    duration,
    warmup: warmupForEquipment(level, equipment),
    drills,
    gymExercises: finalGymExercises,
    cooldown: COOLDOWNS[level] || COOLDOWNS.beginner,
  };
}
