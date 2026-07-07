/**
 * Fighter Sprites — Evolution stages and customization-ready architecture.
 * Adapted for FoodWiki: Ranks are renamed to Gardening/Chef evolution stages,
 * and gear/colors are customized for an organic earth-crunch theme.
 */

export type GearSlot = 'gloves' | 'shorts' | 'headgear' | 'robe' | 'belt' | 'boots' | 'style';

export interface GearItem {
  id: string;
  slot: GearSlot;
  name: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  /** Unlock condition — null means purchasable in store */
  unlockedByRank?: string;
  /** CSS class suffix for visual override */
  cssClass: string;
}

export interface FighterStage {
  id: string;
  rankName: string;
  stageName: string;
  title: string;
  description: string;
  flavorText: string;
  sprite: string;  // path to sprite image
  defaultGear: GearSlot[];
  sceneClass: string;  // CSS class for background scene
}

export const FIGHTER_STAGES: FighterStage[] = [
  {
    id: 'prospect',
    rankName: 'Prospect',
    stageName: 'Sprout',
    title: 'The Sprout',
    description: 'You\'ve just planted your first seed. The journey to nutritional mastery begins here.',
    flavorText: '"To see a world in a grain of sand, and a heaven in a wild flower."',
    sprite: '/fighters/prospect.png',
    defaultGear: ['shorts'],
    sceneClass: 'scene-garage',
  },
  {
    id: 'contender',
    rankName: 'Contender',
    stageName: 'Forager',
    title: 'The Forager',
    description: 'You are learning to identify whole ingredients and harvest clean food.',
    flavorText: '"In all things of nature there is something of the marvelous."',
    sprite: '/fighters/contender.png',
    defaultGear: ['gloves', 'shorts'],
    sceneClass: 'scene-gym',
  },
  {
    id: 'gatekeeper',
    rankName: 'Gatekeeper',
    stageName: 'Cultivator',
    title: 'The Cultivator',
    description: 'You maintain a thriving garden. You understand soil, minerals, and adaptogens.',
    flavorText: '"He who plants a garden plants happiness."',
    sprite: '/fighters/gatekeeper.png',
    defaultGear: ['gloves', 'shorts', 'headgear'],
    sceneClass: 'scene-ring',
  },
  {
    id: 'rising-star',
    rankName: 'Rising Star',
    stageName: 'Artisanal Chef',
    title: 'The Artisanal Chef',
    description: 'You blend ingredients, timing, and macro profiles into culinary medicine.',
    flavorText: '"Good food is the foundation of genuine happiness."',
    sprite: '/fighters/rising-star.png',
    defaultGear: ['gloves', 'shorts', 'boots'],
    sceneClass: 'scene-tournament',
  },
  {
    id: 'champion',
    rankName: 'Champion',
    stageName: 'Harvest Master',
    title: 'The Harvest Master',
    description: 'Your kitchen is a sanctuary. Your body is a temple of clean fueling.',
    flavorText: '"Let food be thy medicine and medicine be thy food."',
    sprite: '/fighters/champion.png',
    defaultGear: ['gloves', 'shorts', 'robe', 'belt', 'boots'],
    sceneClass: 'scene-arena',
  },
  {
    id: 'hall-of-famer',
    rankName: 'Hall of Famer',
    stageName: 'Earthy Sage',
    title: 'The Earthy Sage',
    description: 'You have achieved total metabolic flexibility and symbiotic gut health.',
    flavorText: '"Nature does not hurry, yet everything is accomplished."',
    sprite: '/fighters/hall-of-famer.png',
    defaultGear: ['gloves', 'shorts', 'robe', 'belt', 'boots'],
    sceneClass: 'scene-hall-of-fame',
  },
];

export function getStageForRank(rankName: string): FighterStage {
  return FIGHTER_STAGES.find(s => s.rankName === rankName) || FIGHTER_STAGES[0];
}

export function getStageIndex(rankName: string): number {
  const idx = FIGHTER_STAGES.findIndex(s => s.rankName === rankName);
  return idx >= 0 ? idx : 0;
}

export type BodyType = 'male' | 'female';

export interface FighterCustomization {
  fighterName: string;
  bodyType: BodyType;
  skinTone: number;
  hairColor: number;
  gloveColor: number;
  shoeColor: number;
  topColor: number;
  equippedGear: Partial<Record<GearSlot, string>>;
  unlockedGear: string[];
}

export const SKIN_TONES = [
  { id: 0, name: 'Light',        hex: '#f5d0b0' },
  { id: 1, name: 'Medium Light', hex: '#d4a574' },
  { id: 2, name: 'Medium',       hex: '#b07840' },
  { id: 3, name: 'Medium Dark',  hex: '#8b5e3c' },
  { id: 4, name: 'Dark',         hex: '#5c3a1e' },
  { id: 5, name: 'Deep',         hex: '#3b2010' },
];

export const HAIR_COLORS = [
  { id: 0, name: 'Black',    hex: '#1a1a1a' },
  { id: 1, name: 'Brown',    hex: '#5c3317' },
  { id: 2, name: 'Blonde',   hex: '#d4a84b' },
  { id: 3, name: 'Red',      hex: '#8b2500' },
  { id: 4, name: 'Gray',     hex: '#8c8c8c' },
  { id: 5, name: 'Platinum', hex: '#e8e0d0' },
];

export const GLOVE_COLORS = [
  { id: 0, name: 'Terracotta', hex: '#d97d54' },
  { id: 1, name: 'Forest Green', hex: '#1e2621' },
  { id: 2, name: 'Sand Gold', hex: '#e2a740' },
  { id: 3, name: 'Oatmeal', hex: '#eae6df' },
  { id: 4, name: 'Copper Bronze', hex: '#b87333' },
  { id: 5, name: 'Sage Green', hex: '#618b76' },
];

export const SHOE_COLORS = [
  { id: 0, name: 'Soil Black', hex: '#111613' },
  { id: 1, name: 'Canvas Cream', hex: '#eae6df' },
  { id: 2, name: 'Rust Red', hex: '#c46d47' },
  { id: 3, name: 'Slate Blue', hex: '#4a5d6e' },
];

export const TOP_COLORS = [
  { id: 0, name: 'Moss Slate', hex: '#2e3b33' },
  { id: 1, name: 'Terracotta', hex: '#d97d54' },
  { id: 2, name: 'Mustard', hex: '#e2a740' },
  { id: 3, name: 'Oat Cream', hex: '#eae6df' },
  { id: 4, name: 'Berry Pink', hex: '#8a5d7e' },
  { id: 5, name: 'Sage Herbal', hex: '#618b76' },
];

export function createDefaultCustomization(): FighterCustomization {
  return {
    fighterName: '',
    bodyType: 'male',
    skinTone: 1,
    hairColor: 1,
    gloveColor: 0,
    shoeColor: 0,
    topColor: 0,
    equippedGear: {},
    unlockedGear: [],
  };
}

export const DEFAULT_GEAR: GearItem[] = [
  { id: 'apple-hat',       slot: 'headgear', name: 'Apple Hat',        rarity: 'rare',      unlockedByRank: 'Gatekeeper',  cssClass: 'gear-apple-hat' },
  { id: 'broccoli-shield', slot: 'gloves',   name: 'Broccoli Shield',  rarity: 'epic',      unlockedByRank: 'Rising Star', cssClass: 'gear-broccoli-shield' },
  { id: 'wraps-basic',     slot: 'gloves',   name: 'Linen Hand Wraps', rarity: 'common',    unlockedByRank: 'Prospect',    cssClass: 'gear-wraps' },
  { id: 'gloves-red',      slot: 'gloves',   name: 'Gardening Gloves', rarity: 'common',    unlockedByRank: 'Contender',   cssClass: 'gear-gloves-red' },
  { id: 'shorts-basic',    slot: 'shorts',   name: 'Linen Apron',      rarity: 'common',    unlockedByRank: 'Prospect',    cssClass: 'gear-shorts-basic' },
  { id: 'headgear-red',    slot: 'headgear', name: 'Straw Sun Hat',     rarity: 'rare',      unlockedByRank: 'Gatekeeper',  cssClass: 'gear-headgear-red' },
  { id: 'gloves-gold',     slot: 'gloves',   name: 'Golden Chef Spoon', rarity: 'epic',      unlockedByRank: 'Rising Star', cssClass: 'gear-gloves-gold' },
  { id: 'robe-satin',      slot: 'robe',     name: 'Heavy Flannel Shirt', rarity: 'epic',    unlockedByRank: 'Champion',    cssClass: 'gear-robe-satin' },
  { id: 'belt-champion',   slot: 'belt',     name: 'Gardener Tool Belt', rarity: 'legendary', unlockedByRank: 'Champion',    cssClass: 'gear-belt-champ' },
  { id: 'robe-golden',     slot: 'robe',     name: 'Sage Alchemist Cloak', rarity: 'legendary', unlockedByRank: 'Hall of Famer', cssClass: 'gear-robe-gold' },
];
