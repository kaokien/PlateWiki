/**
 * Favorites & Recently Viewed — localStorage persistence layer
 * 
 * Provides save/favorite techniques, recently viewed tracking,
 * and training plan (saved drill list) functionality.
 * All data is stored client-side in localStorage.
 */
import { isAuthenticated } from './authState';

const KEYS = {
  FAVORITES: 'PlateWiki_favorites',
  RECENTLY_VIEWED: 'PlateWiki_recently_viewed',
  TRAINING_PLAN: 'PlateWiki_training_plan',
  HISTORY: 'PlateWiki_history',
};

const MAX_RECENTLY_VIEWED = 12;

// --- Helpers ---

const safeGet = <T>(key: string, fallback: T): T => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch (e) {
    return fallback;
  }
};

const safeSet = (key: string, value: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('LocalStorage write failed:', e);
  }
};

// --- Favorites ---

export const getFavorites = (): string[] => safeGet<string[]>(KEYS.FAVORITES, []);

export const isFavorite = (techniqueId: string) => {
  return getFavorites().includes(techniqueId);
};

export const toggleFavorite = (techniqueId: string) => {
  if (!isAuthenticated()) return false;
  const favs = getFavorites();
  const index = favs.indexOf(techniqueId);
  if (index === -1) {
    favs.push(techniqueId);
  } else {
    favs.splice(index, 1);
  }
  safeSet(KEYS.FAVORITES, favs);
  // Trigger cloud sync
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('cloud-sync', { detail: { type: 'favorites' } }));
  }
  return index === -1; // returns true if added, false if removed
};

export const removeFavorite = (techniqueId: string) => {
  const favs = getFavorites().filter(id => id !== techniqueId);
  safeSet(KEYS.FAVORITES, favs);
  // Trigger cloud sync
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('cloud-sync', { detail: { type: 'favorites' } }));
  }
};

// --- Recently Viewed ---

export const getRecentlyViewed = (): string[] => safeGet<string[]>(KEYS.RECENTLY_VIEWED, []);

export const addRecentlyViewed = (techniqueId: string) => {
  if (!isAuthenticated()) return;
  let recent = getRecentlyViewed();
  // Remove if already exists (will re-add at front)
  recent = recent.filter(id => id !== techniqueId);
  // Add to front
  recent.unshift(techniqueId);
  // Cap at max
  if (recent.length > MAX_RECENTLY_VIEWED) {
    recent = recent.slice(0, MAX_RECENTLY_VIEWED);
  }
  safeSet(KEYS.RECENTLY_VIEWED, recent);
};

// --- Universal History (all content types) ---

export type HistoryItem = {
  id: string;
  type: 'technique' | 'article' | 'exercise' | 'workout' | 'fighter';
  title: string;
  href: string;
  timestamp: number;
};

const MAX_HISTORY = 30;

export const getHistory = (): HistoryItem[] => safeGet(KEYS.HISTORY, []);

export const addToHistory = (item: Omit<HistoryItem, 'timestamp'>) => {
  if (!isAuthenticated()) return;
  let history = getHistory();
  // Remove duplicate (same href)
  history = history.filter(h => h.href !== item.href);
  // Add to front with timestamp
  history.unshift({ ...item, timestamp: Date.now() });
  // Cap
  if (history.length > MAX_HISTORY) {
    history = history.slice(0, MAX_HISTORY);
  }
  safeSet(KEYS.HISTORY, history);

  // Trigger cloud sync for browsing history
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('cloud-sync', { detail: { type: 'profile' } }));
  }

  // Also add to legacy recently-viewed if it's a technique
  if (item.type === 'technique') {
    addRecentlyViewed(item.id);
  }
};

// --- Training Plan (saved drill list) ---

export const getTrainingPlan = (): string[] => safeGet<string[]>(KEYS.TRAINING_PLAN, []);

export const addToTrainingPlan = (techniqueId: string) => {
  if (!isAuthenticated()) return;
  const plan = getTrainingPlan();
  if (!plan.includes(techniqueId)) {
    plan.push(techniqueId);
    safeSet(KEYS.TRAINING_PLAN, plan);
  }
};

export const removeFromTrainingPlan = (techniqueId: string) => {
  const plan = getTrainingPlan().filter(id => id !== techniqueId);
  safeSet(KEYS.TRAINING_PLAN, plan);
};

export const clearTrainingPlan = () => {
  safeSet(KEYS.TRAINING_PLAN, []);
};

export const isInTrainingPlan = (techniqueId: string) => {
  return getTrainingPlan().includes(techniqueId);
};

// --- Shopping List (for dashboard sticky note) ---

export type ShoppingItem = {
  id: string;
  name: string;
  category: string;
  recipeName: string;
  addedAt: number;
  crossedOff: boolean;
};

const SHOPPING_LIST_KEY = 'PlateWiki_shopping_list';

export const getShoppingList = (): ShoppingItem[] => safeGet<ShoppingItem[]>(SHOPPING_LIST_KEY, []);

export const addToShoppingList = (items: Omit<ShoppingItem, 'addedAt' | 'crossedOff'>[]) => {
  const list = getShoppingList();
  const now = Date.now();
  items.forEach(item => {
    // Avoid duplicates by id + recipeName
    const exists = list.some(existing => existing.id === item.id && existing.recipeName === item.recipeName);
    if (!exists) {
      list.push({ ...item, addedAt: now, crossedOff: false });
    }
  });
  safeSet(SHOPPING_LIST_KEY, list);
};

export const toggleShoppingItem = (id: string, recipeName: string) => {
  const list = getShoppingList();
  const item = list.find(i => i.id === id && i.recipeName === recipeName);
  if (item) {
    item.crossedOff = !item.crossedOff;
    safeSet(SHOPPING_LIST_KEY, list);
  }
};

export const removeShoppingItem = (id: string, recipeName: string) => {
  const list = getShoppingList().filter(i => !(i.id === id && i.recipeName === recipeName));
  safeSet(SHOPPING_LIST_KEY, list);
};

export const clearCrossedOffItems = () => {
  const list = getShoppingList().filter(i => !i.crossedOff);
  safeSet(SHOPPING_LIST_KEY, list);
};

export const clearShoppingList = () => {
  safeSet(SHOPPING_LIST_KEY, []);
};
