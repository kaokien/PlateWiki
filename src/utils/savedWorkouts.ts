export interface SavedWorkout {
  id: string;
  title: string;
  duration: string;
  goal: string;
  level: string;
  equipment: string;
  drills: Array<{
    name: string;
    techniqueId: string;
    category: string;
    sets: string;
    description: string;
  }>;
  gymExercises: Array<{
    name: string;
    sets: number;
    reps: string;
    rest: string;
    note: string;
  }>;
  warmup: string[];
  cooldown: string[];
  savedAt: string;
}

export const FREE_WORKOUTS_LIMIT = 3;
const STORAGE_KEY = 'PlateWiki_saved_workouts';

export function getSavedWorkouts(): SavedWorkout[] {
  if (typeof localStorage === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to parse saved workouts:', error);
    return [];
  }
}

export function getSavedWorkoutById(id: string): SavedWorkout | null {
  const list = getSavedWorkouts();
  return list.find(w => w.id === id) || null;
}

export function canSaveMoreWorkouts(isPro: boolean): boolean {
  if (isPro) return true;
  const list = getSavedWorkouts();
  return list.length < FREE_WORKOUTS_LIMIT;
}

export function saveWorkout(
  workout: Omit<SavedWorkout, 'id' | 'savedAt'>,
  isPro: boolean = false
): { success: boolean; error?: 'limit' | 'unknown'; workout?: SavedWorkout } {
  if (typeof localStorage === 'undefined') return { success: false, error: 'unknown' };

  try {
    const list = getSavedWorkouts();
    
    // Check limit
    if (!isPro && list.length >= FREE_WORKOUTS_LIMIT) {
      return { success: false, error: 'limit' };
    }

    // Create new saved workout
    const newWorkout: SavedWorkout = {
      ...workout,
      id: `workout_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      savedAt: new Date().toISOString(),
    };

    list.unshift(newWorkout); // Add to beginning
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));

    // Trigger cloud sync
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cloud-sync', { detail: { type: 'workouts' } }));
    }

    return { success: true, workout: newWorkout };
  } catch (error) {
    console.error('Failed to save workout:', error);
    return { success: false, error: 'unknown' };
  }
}

export function deleteSavedWorkout(id: string): boolean {
  if (typeof localStorage === 'undefined') return false;

  try {
    const list = getSavedWorkouts();
    const updated = list.filter(w => w.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    // Trigger cloud sync
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cloud-sync', { detail: { type: 'workouts' } }));
    }

    return true;
  } catch (error) {
    console.error('Failed to delete saved workout:', error);
    return false;
  }
}

export function isWorkoutSaved(drills: SavedWorkout['drills']): boolean {
  if (typeof localStorage === 'undefined') return false;

  try {
    const list = getSavedWorkouts();
    // Compare drill techniqueIds and order to see if it's already saved
    return list.some(w => {
      if (w.drills.length !== drills.length) return false;
      return w.drills.every((d, i) => d.techniqueId === drills[i]?.techniqueId);
    });
  } catch (error) {
    return false;
  }
}
