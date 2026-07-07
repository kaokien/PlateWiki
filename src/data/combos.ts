export interface ComboStep {
  name: string;
  zones: {
    orthodox: number;
    southpaw: number;
  };
  cue: string;
}

export interface Combo {
  id: string;
  name: string;
  type: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  instructions: string[];
  tips: string[];
  sequence: ComboStep[];
}

export const TRAINING_COMBOS: Combo[] = [
  {
    id: 'glycogen-bowl',
    name: 'Glycogen Loading Bowl',
    type: 'Sprouted Oats & Berries',
    difficulty: 'Beginner',
    instructions: [
      'Scoop 1/2 cup of sprouted rolled oats into a bowl.',
      'Pour 1 cup of coconut milk or hot water.',
      'Add a handful of wild blueberries and a sprinkle of pumpkin seeds.',
      'Drizzle raw honey on top and stir.'
    ],
    tips: [
      'Chef Tip: Soak oats overnight in kefir for active enzyme breakdown.',
      'Common Mistake: Using instant sugared oatmeal packets which digest too quickly.'
    ],
    sequence: [
      { name: 'Sprouted Oats', zones: { orthodox: 2, southpaw: 0 }, cue: 'Add sprouted oats!' },
      { name: 'Blueberries', zones: { orthodox: 0, southpaw: 2 }, cue: 'Sprinkle wild blueberries!' },
      { name: 'Pumpkin Seeds', zones: { orthodox: 1, southpaw: 1 }, cue: 'Toss pumpkin seeds!' },
      { name: 'Raw Honey', zones: { orthodox: 0, southpaw: 0 }, cue: 'Drizzle organic raw honey!' }
    ]
  },
  {
    id: 'anabolic-shake',
    name: 'Anabolic Repair Shake',
    type: 'Protein & Gut Support',
    difficulty: 'Beginner',
    instructions: [
      'Add 300ml of milk kefir or unsweetened almond milk to a blender.',
      'Add 1 scoop of cold-processed grass-fed whey isolate.',
      'Slice 1 ripe banana and grate a 1-inch slice of fresh ginger.',
      'Blend for 30 seconds until completely smooth.'
    ],
    tips: [
      'Chef Tip: Add 5g of glutamine or creatine for post-training cell hydration.',
      'Common Mistake: Blending with too much ice, which reduces digestive enzyme contact.'
    ],
    sequence: [
      { name: 'Milk Kefir', zones: { orthodox: 2, southpaw: 0 }, cue: 'Pour milk kefir base!' },
      { name: 'Whey Isolate', zones: { orthodox: 0, southpaw: 2 }, cue: 'Scoop whey protein isolate!' },
      { name: 'Ripe Banana', zones: { orthodox: 1, southpaw: 1 }, cue: 'Slice in a ripe banana!' },
      { name: 'Fresh Ginger', zones: { orthodox: 0, southpaw: 0 }, cue: 'Add grated fresh ginger root!' }
    ]
  },
  {
    id: 'anti-inflammatory-elixir',
    name: 'Anti-Inflammatory Joint Elixir',
    type: 'Curcumin & Pepper Stack',
    difficulty: 'Intermediate',
    instructions: [
      'Warm 1.5 cups of organic coconut milk in a pan.',
      'Stir in 1/2 tsp of organic turmeric powder and a pinch of black pepper.',
      'Add 1/2 tsp of fresh grated ginger.',
      'Whisk in 1 tsp of organic extra virgin coconut oil and sweeten with raw honey.'
    ],
    tips: [
      'Chef Tip: Curcumin requires black pepper (piperine) to increase absorption by 2000%.',
      'Common Mistake: Neglecting the fat source; curcumin is fat-soluble and won\'t absorb well without lipid carriers.'
    ],
    sequence: [
      { name: 'Coconut Milk', zones: { orthodox: 2, southpaw: 0 }, cue: 'Warm the organic coconut milk!' },
      { name: 'Turmeric Powder', zones: { orthodox: 0, southpaw: 2 }, cue: 'Stir in turmeric!' },
      { name: 'Black Pepper', zones: { orthodox: 1, southpaw: 1 }, cue: 'Add a pinch of black pepper!' },
      { name: 'Coconut Oil', zones: { orthodox: 0, southpaw: 0 }, cue: 'Stir in virgin coconut oil!' }
    ]
  },
  {
    id: 'electrolyte-hydration',
    name: 'Isotonic Electrolyte Drink',
    type: 'Minerals & Fast Hydration',
    difficulty: 'Intermediate',
    instructions: [
      'Pour 500ml of raw, single-origin coconut water into a shaker.',
      'Add 1/4 tsp of fine Himalayan pink salt.',
      'Squeeze in half of a fresh lime.',
      'Shake vigorously until salt dissolves and serve chilled.'
    ],
    tips: [
      'Chef Tip: Drink during training, long runs, or lifting to maintain muscle cell volume.',
      'Common Mistake: Using store-bought sports drinks filled with synthetic colorings and high-fructose corn syrup.'
    ],
    sequence: [
      { name: 'Coconut Water', zones: { orthodox: 2, southpaw: 0 }, cue: 'Pour raw coconut water!' },
      { name: 'Pink Salt', zones: { orthodox: 0, southpaw: 2 }, cue: 'Add a pinch of pink salt!' },
      { name: 'Fresh Lime', zones: { orthodox: 1, southpaw: 1 }, cue: 'Squeeze fresh lime juice!' }
    ]
  }
];
