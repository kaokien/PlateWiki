// forestSprites.ts — Hand-authored pixel-art sprite matrices for the Virtual Gym
// forest garden. Each sprite is an array of equal-width strings; each character
// maps to a PALETTE color ('.' = transparent). Colors are sampled from
// /public/athletes/forest_bg.png so plants sit naturally in the scene.

export type SpeciesId =
  | 'pine'
  | 'appleTree'
  | 'berryBush'
  | 'flower'
  | 'herb'
  | 'mushroom';

export const PALETTE: Record<string, string> = {
  O: '#18231a', // outline / darkest
  D: '#2b4733', // dark leaf
  G: '#3f6d42', // mid leaf
  L: '#6fa055', // light leaf
  H: '#9cc36e', // leaf highlight
  T: '#4a3627', // trunk dark
  t: '#6e4f33', // trunk light
  S: '#3a3126', // soil dark
  s: '#57452f', // soil light
  R: '#b23a30', // red (apple / mushroom cap)
  r: '#d96a4e', // red highlight
  W: '#e8dcc0', // cream (mushroom stem / spots)
  P: '#d98aa6', // petal pink
  p: '#f0bcc8', // petal light
  Y: '#e0b84e', // flower center
  B: '#5f4e9e', // berry
  b: '#8d7de0', // berry light
  w: '#6b5a42', // withered brown
  x: '#4e463c', // dead gray / rock
  C: '#d9812e', // carrot orange
};

export type Sprite = string[];

// ---------------------------------------------------------------------------
// Shared early stages
// ---------------------------------------------------------------------------

const SOIL: Sprite = [
  '........',
  '...ss...',
  '..sSSs..',
  '.sSSSSs.',
];

const SPROUT: Sprite = [
  '.......',
  '.L...L.',
  '.LG.GL.',
  '..LGL..',
  '...G...',
  '..sss..',
  '.sSSSs.',
];

// ---------------------------------------------------------------------------
// Species growth stages (index 2..4)
// ---------------------------------------------------------------------------

const PINE_2: Sprite = [
  '....L....',
  '...LGD...',
  '..LLGDD..',
  '...LGD...',
  '..LLGDD..',
  '.LLLGDDD.',
  '....T....',
  '...sss...',
];

const PINE_3: Sprite = [
  '.....L.....',
  '....LGD....',
  '...LLGDD...',
  '....LGD....',
  '...LLGDD...',
  '..LLLGDDD..',
  '...LLGDD...',
  '..LLLGDDD..',
  '.LLLLGDDDD.',
  '.....T.....',
  '.....T.....',
  '....sss....',
];

const PINE_4: Sprite = [
  '......H......',
  '.....LGD.....',
  '....LLGDD....',
  '.....LGD.....',
  '....LLGDD....',
  '...LLLGDDD...',
  '....LLGDD....',
  '...LLLGDDD...',
  '..LLLLGDDDD..',
  '...LLLGDDD...',
  '..LLLLGDDDD..',
  '.LLLLLGDDDDD.',
  '......T......',
  '......T......',
  '.....sss.....',
];

const APPLE_2: Sprite = [
  '.........',
  '...LLG...',
  '..LLGGD..',
  '..LGGDD..',
  '...GDD...',
  '....t....',
  '....T....',
  '...sss...',
];

const APPLE_3: Sprite = [
  '....LLLGG....',
  '..LLLLLGGGD..',
  '.LLLLLGGGDDD.',
  '.LLLLGGGDDDD.',
  '..LLLGGGDDD..',
  '....LGGDD....',
  '......t......',
  '......T......',
  '.....ssss....',
];

const APPLE_4: Sprite = [
  '....LLLGG....',
  '..LLRLLGGGD..',
  '.LLLLLGRGDDD.',
  '.LLLLGGGDDDD.',
  '..LRLGGGDDD..',
  '....LGGDRD...',
  '......t......',
  '......T......',
  '.....ssss....',
];

const BUSH_2: Sprite = [
  '........',
  '..LLGD..',
  '.LLGGDD.',
  '.LGGDDD.',
  '..ssss..',
];

const BUSH_3: Sprite = [
  '..........',
  '...LLGG...',
  '..LLLGGD..',
  '.LLLGGDDD.',
  '.LLGGDDDD.',
  '...ssss...',
];

const BUSH_4: Sprite = [
  '..........',
  '...LLGG...',
  '..LBLGGb..',
  '.LLLGBDDD.',
  '.LBGGDDDb.',
  '...ssss...',
];

const FLOWER_2: Sprite = [
  '......',
  '..pP..',
  '..PP..',
  '..G...',
  '.LG...',
  '..G...',
  '..ss..',
];

const FLOWER_3: Sprite = [
  '...p...',
  '..pPP..',
  '.pPYPP.',
  '..PPP..',
  '...G...',
  '..LG...',
  '...G...',
  '..sss..',
];

const FLOWER_4: Sprite = [
  '...p......',
  '..pPP..p..',
  '.pPYPP.PP.',
  '..PPP.PYP.',
  '...G...P..',
  '..LG...G..',
  '...G..LG..',
  '...G...G..',
  '...ssss...',
];

const HERB_2: Sprite = [
  '........',
  '.L...L..',
  '.GL..GL.',
  '..ssss..',
  '.sSSSSs.',
];

const HERB_3: Sprite = [
  '..........',
  '.L..L..L..',
  '.GL.GL.GL.',
  '..ssssss..',
  '.sSSSSSSs.',
];

const HERB_4: Sprite = [
  '..........',
  '.L..L..L..',
  '.GL.GL.GL.',
  '..C..C.C..',
  '..ssssss..',
  '.sSSSSSSs.',
];

const MUSH_2: Sprite = [
  '......',
  '..RR..',
  '.RWRr.',
  '..WW..',
  '..ss..',
];

const MUSH_3: Sprite = [
  '..........',
  '..RR......',
  '.RWRr..RR.',
  '..WW..RWRr',
  '..WW...WW.',
  '...ssss...',
];

const MUSH_4: Sprite = [
  '............',
  '..RR....RR..',
  '.RWRr..RWRr.',
  '..WW.RR.WW..',
  '..WWRWRrWW..',
  '.....WW.....',
  '...ssssss...',
];

// ---------------------------------------------------------------------------
// Withered variants
// ---------------------------------------------------------------------------

const WITHER_SMALL: Sprite = [
  '.......',
  '.x...w.',
  '..w.w..',
  '...w...',
  '...w...',
  '..sss..',
];

const WITHER_TALL: Sprite = [
  '....x....',
  '.x..w....',
  '..w.w.x..',
  '...ww.w..',
  '....ww...',
  '.....w...',
  '....w....',
  '....w....',
  '...sss...',
];

// ---------------------------------------------------------------------------
// Ambient decor (always present, not tied to growth)
// ---------------------------------------------------------------------------

export const TUFT_A: Sprite = [
  'L.G.',
  'GLGL',
];

export const TUFT_B: Sprite = [
  '.G.L',
  'LGLG',
];

export const ROCK: Sprite = [
  '..xx..',
  '.xsxx.',
  'xxxxxx',
  '.xxxx.',
];

export const STUMP: Sprite = [
  '.tttt.',
  'tsstst',
  '.TTTT.',
  '.TTTT.',
];

export const FOOD_APPLE: Sprite = [
  '....t...',
  '...tL...',
  '..RrRR..',
  '.RrrRRR.',
  '.RRRRRR.',
  '.RRRRRR.',
  '..RRRR..',
];

// ---------------------------------------------------------------------------
// Lookup
// ---------------------------------------------------------------------------

interface SpeciesDef {
  stages: [Sprite, Sprite, Sprite, Sprite, Sprite]; // soil, sprout, young, mature, flourishing
  withered: Sprite;
}

export const SPECIES: Record<SpeciesId, SpeciesDef> = {
  pine: { stages: [SOIL, SPROUT, PINE_2, PINE_3, PINE_4], withered: WITHER_TALL },
  appleTree: { stages: [SOIL, SPROUT, APPLE_2, APPLE_3, APPLE_4], withered: WITHER_TALL },
  berryBush: { stages: [SOIL, SPROUT, BUSH_2, BUSH_3, BUSH_4], withered: WITHER_SMALL },
  flower: { stages: [SOIL, SPROUT, FLOWER_2, FLOWER_3, FLOWER_4], withered: WITHER_SMALL },
  herb: { stages: [SOIL, SPROUT, HERB_2, HERB_3, HERB_4], withered: WITHER_SMALL },
  mushroom: { stages: [SOIL, SPROUT, MUSH_2, MUSH_3, MUSH_4], withered: WITHER_SMALL },
};

export function stageForGrowth(growth: number): 0 | 1 | 2 | 3 | 4 {
  if (growth >= 80) return 4;
  if (growth >= 50) return 3;
  if (growth >= 25) return 2;
  if (growth >= 1) return 1;
  return 0;
}

export function spriteForPlant(species: SpeciesId, growth: number, withered: boolean): Sprite {
  const stage = stageForGrowth(growth);
  // A withered garden only affects plants big enough to visibly die back;
  // soil mounds and sprouts just stay as they are.
  if (withered && stage >= 2) return SPECIES[species].withered;
  return SPECIES[species].stages[stage];
}
