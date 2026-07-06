'use client';

import { useCallback, useEffect, useState } from 'react';
import type { FighterCustomization, GearSlot } from '@/data/fighterSprites';
import {
  CUSTOMIZATION_CHANGED_EVENT,
  getCustomization,
  updateCustomization,
} from '@/utils/fighterCustomization';
import { useFighterProfile } from '@/context/FighterProfileContext';
import type { ShopItem } from '@/data/shopItems';
import type { RankTier } from '@/utils/fighterProfile';

export function useFighterCustomization(): {
  customization: FighterCustomization | null;
  update: (updates: Partial<FighterCustomization>) => void;
  purchaseItem: (item: ShopItem) => boolean;
  equipItem: (slot: GearSlot, itemId: string) => void;
  unequipSlot: (slot: GearSlot) => void;
} {
  const [customization, setCustomization] = useState<FighterCustomization | null>(null);
  const { spendCoins, profile } = useFighterProfile();

  useEffect(() => {
    setCustomization(getCustomization());
    const refresh = () => setCustomization(getCustomization());
    window.addEventListener(CUSTOMIZATION_CHANGED_EVENT, refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener(CUSTOMIZATION_CHANGED_EVENT, refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  const update = useCallback((updates: Partial<FighterCustomization>) => {
    updateCustomization(updates);
  }, []);

  const purchaseItem = useCallback((item: ShopItem): boolean => {
    if (!customization) return false;

    // Check rank requirement
    if (item.requiredRank) {
      const { getRankForXP, RANK_TIERS } = require('@/utils/fighterProfile');
      const currentRank = getRankForXP(profile.xp);
      const requiredRankTier = RANK_TIERS.find((t: RankTier) => t.name === item.requiredRank);
      if (requiredRankTier && profile.xp < requiredRankTier.minXP) {
        return false;
      }
    }

    // Try spending coins
    const success = spendCoins(item.price);
    if (!success) return false;

    // Handle boost items
    if (item.category === 'boost') {
      if (item.id === 'streak-freeze') {
        const { getProfile, saveProfile } = require('@/utils/fighterProfile');
        const p = getProfile();
        p.streakFreezes = Math.min((p.streakFreezes || 0) + 1, 3);
        saveProfile(p);
        // Force profile context sync
        window.dispatchEvent(new CustomEvent('cloud-sync-complete'));
      }
      return true;
    }

    // Handle swatch / style items
    const unlocked = [...(customization.unlockedGear || []), item.id];
    update({ unlockedGear: unlocked });
    return true;
  }, [customization, spendCoins, profile.xp, update]);

  const equipItem = useCallback((slot: GearSlot, itemId: string) => {
    if (!customization) return;
    const equipped = { ...(customization.equippedGear || {}), [slot]: itemId };
    update({ equippedGear: equipped });
  }, [customization, update]);

  const unequipSlot = useCallback((slot: GearSlot) => {
    if (!customization) return;
    const equipped = { ...(customization.equippedGear || {}) };
    delete equipped[slot];
    update({ equippedGear: equipped });
  }, [customization, update]);

  return { customization, update, purchaseItem, equipItem, unequipSlot };
}
