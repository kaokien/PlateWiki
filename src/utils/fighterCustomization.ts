/**
 * athlete Customization — localStorage persistence for appearance settings.
 * Separate from fighterProfile to keep concerns clean.
 * Future: sync with cloud when theme store launches.
 */
import { createDefaultCustomization, type FighterCustomization } from '@/data/fighterSprites';

const STORAGE_KEY = 'PlateWiki_fighter_customization';

/** Dispatched on window whenever customization is saved. */
export const CUSTOMIZATION_CHANGED_EVENT = 'PlateWiki:athlete-customization-changed';

export function getCustomization(): FighterCustomization {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return { ...createDefaultCustomization(), ...JSON.parse(raw) };
    }
  } catch { /* ignore */ }
  return createDefaultCustomization();
}

export function saveCustomization(custom: FighterCustomization): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(custom));
    window.dispatchEvent(new Event(CUSTOMIZATION_CHANGED_EVENT));
  } catch (e) {
    console.warn('Failed to save athlete customization:', e);
  }
}

export function updateCustomization(updates: Partial<FighterCustomization>): FighterCustomization {
  const current = getCustomization();
  const updated = { ...current, ...updates };
  saveCustomization(updated);
  return updated;
}
