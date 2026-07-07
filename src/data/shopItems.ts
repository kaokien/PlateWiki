export type ShopItemCategory = 'boost' | 'swatch' | 'style' | 'gear';

export interface ShopItem {
  id: string;
  category: ShopItemCategory;
  name: string;
  description: string;
  price: number;
  icon: string; // lucide icon name reference
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  /** For swatches: slot name like 'gloveColor' | 'hairColor' | 'shoeColor' | 'topColor' */
  swatchSlot?: 'gloveColor' | 'hairColor' | 'shoeColor' | 'topColor';
  /** For swatches: color index in the respective array */
  swatchIndex?: number;
  /** For styles: stage ID like 'contender' | 'gatekeeper' | 'champion' */
  styleStageId?: string;
  /** For gear: slot name */
  gearSlot?: 'headgear' | 'gloves' | 'shorts' | 'robe' | 'belt' | 'boots';
  /** For gear: item ID */
  gearId?: string;
  /** Minimum rank required to purchase */
  requiredRank?: string;
}

export const SHOP_ITEMS: ShopItem[] = [
  // ── Boosts & Utilities (Free for testing) ───────────────────────────
  {
    id: 'streak-freeze',
    category: 'boost',
    name: 'Harvest Shield (Streak Freeze)',
    description: 'Equip to protect your daily fueling streak if you miss a logging day. Max 3.',
    price: 0,
    icon: 'Shield',
    rarity: 'common',
  },

  // ── Gear & Equipments (New Category — Free) ─────────────────────────
  {
    id: 'gear-apple-hat',
    category: 'gear',
    name: 'Apple Hat',
    description: 'A round, red organic Apple Hat with a green leaf stem.',
    price: 0,
    icon: 'Apple',
    rarity: 'rare',
    gearSlot: 'headgear',
    gearId: 'apple-hat',
  },
  {
    id: 'gear-broccoli-shield',
    category: 'gear',
    name: 'Broccoli Shield',
    description: 'A tough, fibrous shield made from a giant organic broccoli head.',
    price: 0,
    icon: 'Shield',
    rarity: 'epic',
    gearSlot: 'gloves',
    gearId: 'broccoli-shield',
  },
  {
    id: 'gear-banana-sword',
    category: 'gear',
    name: 'Banana Sword',
    description: 'A sharp, potassium-packed custom sword with a green peel hilt.',
    price: 0,
    icon: 'Swords',
    rarity: 'epic',
    gearSlot: 'gloves',
    gearId: 'banana-sword',
  },

  // ── Customizer Swatch Unlocks (Free for testing) ────────────────────
  {
    id: 'glove-gold',
    category: 'swatch',
    name: 'Copper Bronze Spoon',
    description: 'Unlock the premium Copper Bronze color option for your chef hands/spoon.',
    price: 0,
    icon: 'Palette',
    rarity: 'epic',
    swatchSlot: 'gloveColor',
    swatchIndex: 4, // index in GLOVE_COLORS
    requiredRank: 'Forager',
  },
  {
    id: 'glove-green',
    category: 'swatch',
    name: 'Sage Green Gloves',
    description: 'Unlock the premium Sage Green color option for your gardening gloves.',
    price: 0,
    icon: 'Palette',
    rarity: 'rare',
    swatchSlot: 'gloveColor',
    swatchIndex: 5,
  },
  {
    id: 'hair-platinum',
    category: 'swatch',
    name: 'Silver Sage Hair Dye',
    description: 'Unlock the premium Platinum color option for your avatar\'s hair.',
    price: 0,
    icon: 'Palette',
    rarity: 'rare',
    swatchSlot: 'hairColor',
    swatchIndex: 5, // index in HAIR_COLORS
    requiredRank: 'Forager',
  },
  {
    id: 'hair-blonde',
    category: 'swatch',
    name: 'Wheat Blonde Dye',
    description: 'Unlock the premium Blonde color option for your avatar\'s hair.',
    price: 0,
    icon: 'Palette',
    rarity: 'common',
    swatchSlot: 'hairColor',
    swatchIndex: 2,
  },
  {
    id: 'shoe-red',
    category: 'swatch',
    name: 'Rust Red Clogs',
    description: 'Unlock the vibrant Rust Red color option for your gardening shoes.',
    price: 0,
    icon: 'Palette',
    rarity: 'common',
    swatchSlot: 'shoeColor',
    swatchIndex: 2, // index in SHOE_COLORS
  },
  {
    id: 'shoe-blue',
    category: 'swatch',
    name: 'Slate Blue Wellies',
    description: 'Unlock the vibrant Slate Blue color option for your gardening shoes.',
    price: 0,
    icon: 'Palette',
    rarity: 'common',
    swatchSlot: 'shoeColor',
    swatchIndex: 3,
  },
  {
    id: 'top-pink',
    category: 'swatch',
    name: 'Berry Pink Apron Dye',
    description: 'Unlock the premium Berry Pink top color for female avatar models.',
    price: 0,
    icon: 'Palette',
    rarity: 'common',
    swatchSlot: 'topColor',
    swatchIndex: 4, // index in TOP_COLORS
  },
  {
    id: 'top-purple',
    category: 'swatch',
    name: 'Sage Herbal Dye',
    description: 'Unlock the premium Sage Herbal top color for female avatar models.',
    price: 0,
    icon: 'Palette',
    rarity: 'rare',
    swatchSlot: 'topColor',
    swatchIndex: 5,
  },

  // ── Transmog styles (Cosmetic Ranks — Free for testing) ─────────────
  {
    id: 'style-contender',
    category: 'style',
    name: 'Forager Attire',
    description: 'Transmog: Display Forager garments regardless of current rank.',
    price: 0,
    icon: 'Shirt',
    rarity: 'common',
    styleStageId: 'contender',
  },
  {
    id: 'style-gatekeeper',
    category: 'style',
    name: 'Cultivator Straw Hat',
    description: 'Transmog: Wear the protective straw sun hat and overalls of a Cultivator.',
    price: 0,
    icon: 'Shirt',
    rarity: 'rare',
    styleStageId: 'gatekeeper',
    requiredRank: 'Cultivator',
  },
  {
    id: 'style-rising-star',
    category: 'style',
    name: 'Artisanal Chef Jacket',
    description: 'Transmog: Wear the clean, double-breasted white jacket of an Artisanal Chef.',
    price: 0,
    icon: 'Shirt',
    rarity: 'epic',
    styleStageId: 'rising-star',
    requiredRank: 'Artisanal Chef',
  },
  {
    id: 'style-champion',
    category: 'style',
    name: 'Harvest Master Sash',
    description: 'Transmog: Display the organic hemp sash and master robes of a Harvest Master.',
    price: 0,
    icon: 'Shirt',
    rarity: 'legendary',
    styleStageId: 'champion',
    requiredRank: 'Harvest Master',
  },
];
