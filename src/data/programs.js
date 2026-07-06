export const programs = {
  'weight-cut-fighter': {
    id: 'weight-cut-fighter',
    title: '7-Day Fighter Weight Cut',
    level: 'Advanced',
    duration: '7 Days',
    shortDesc: 'A safe, science-based electrolyte and macro cycling program to drop water weight and maintain power.',
    description: 'Designed for combat athletes. This program walks you through sodium manipulation, glycogen depletion, and rehydration strategies to hit your target weight safely without compromising strength or endurance.',
    days: [
      {
        day: 1,
        title: 'Sodium Loading Phase',
        description: 'Initiate water flushing by loading high-quality sodium and clean water.',
        tasks: [
          { type: 'learn', techniqueId: 'pink-salt' },
          { type: 'learn', techniqueId: 'coconut-water' },
          { type: 'practice', description: 'Consume 4 liters of water with 1/2 tsp of pink salt to saturate cellular hydration.' }
        ]
      },
      {
        day: 2,
        title: 'High Protein / Low Carb Intake',
        description: 'Begin depletion of glycogen reserves while protecting muscle mass.',
        tasks: [
          { type: 'learn', techniqueId: 'whey-isolate' },
          { type: 'learn', techniqueId: 'eggs' },
          { type: 'practice', description: 'Keep carbs under 50g. Focus on protein isolate and egg whites to trigger muscle protein synthesis.' }
        ]
      },
      {
        day: 3,
        title: 'Digestive Comfort & Fiber Reduction',
        description: 'Soothe the gut and reduce residual digestive weight by focusing on low-residue foods.',
        tasks: [
          { type: 'learn', techniqueId: 'ginger' },
          { type: 'learn', techniqueId: 'acv' },
          { type: 'practice', description: 'Drink warm ginger tea pre-meals. Eat low-fiber proteins to clear gut weight.' }
        ]
      },
      {
        day: 4,
        title: 'Metabolic Support & Calm CNS',
        description: 'Manage stress hormones as calorie deficit peaks. Prepare for the scale.',
        tasks: [
          { type: 'learn', techniqueId: 'ashwagandha' },
          { type: 'learn', techniqueId: 'pumpkin-seeds' },
          { type: 'practice', description: 'Take Ashwagandha in the evening to suppress cortisol spikes and protect sleep.' }
        ]
      },
      {
        day: 5,
        title: 'Active Dehydration & Salt Cut',
        description: 'Cut sodium intake to zero to trigger high urine excretion. Cut fluid intake.',
        tasks: [
          { type: 'learn', techniqueId: 'spinach' },
          { type: 'practice', description: 'Eliminate all pink salt and salted foods. Limit fluid intake to 1 liter of distilled water.' }
        ]
      },
      {
        day: 6,
        title: 'Weigh-in & Initial Rehydration',
        description: 'After the scale, initiate the critical 2-stage cellular rehydration process.',
        tasks: [
          { type: 'learn', techniqueId: 'coconut-water' },
          { type: 'learn', techniqueId: 'pink-salt' },
          { type: 'practice', description: 'Drink 1 liter of coconut water with 1/4 tsp of pink salt within the first hour post weigh-in.' }
        ]
      },
      {
        day: 7,
        title: 'Glycogen Replenishment & Refeed',
        description: 'Refill your depleted muscle glycogen stores with easily digestible complex carbs.',
        tasks: [
          { type: 'learn', techniqueId: 'sweet-potato' },
          { type: 'learn', techniqueId: 'oatmeal' },
          { type: 'practice', description: 'Consume 100g of clean carbs (roasted sweet potato/oats) every 2 hours until saturated.' }
        ]
      }
    ]
  },
  'glycogen-max-runner': {
    id: 'glycogen-max-runner',
    title: '7-Day Runner Glycogen Saturation',
    level: 'Intermediate',
    duration: '7 Days',
    shortDesc: 'Optimize leg muscle glycogen storage and cardiovascular efficiency for peak performance.',
    description: 'Designed for endurance runners. Learn how to execute a perfect carb refeed, prime nitric oxide levels, and maintain digestive health for long-distance efforts.',
    days: [
      {
        day: 1,
        title: 'Mitochondrial Aerobic Prep',
        description: 'Start loading inorganic nitrates to enhance mitochondrial output.',
        tasks: [
          { type: 'learn', techniqueId: 'beetroot-juice' },
          { type: 'practice', description: 'Drink 250ml of beetroot juice with breakfast to support oxygen delivery.' }
        ]
      },
      {
        day: 2,
        title: 'Gut Training & Slow Carbs',
        description: 'Train the gut to absorb complex carbs under exertion.',
        tasks: [
          { type: 'learn', techniqueId: 'oatmeal' },
          { type: 'practice', description: 'Eat a bowl of sprouted oatmeal 2 hours before a run to ensure stable energy levels.' }
        ]
      },
      {
        day: 3,
        title: 'Electrolyte & Muscle Prep',
        description: 'Ensure mineral saturation to prevent muscle cramps and spasms.',
        tasks: [
          { type: 'learn', techniqueId: 'pumpkin-seeds' },
          { type: 'learn', techniqueId: 'coconut-water' },
          { type: 'practice', description: 'Incorporate raw pumpkin seeds for zinc/magnesium and sip coconut water.' }
        ]
      },
      {
        day: 4,
        title: 'Nitric Oxide Saturation Peak',
        description: 'Maximize vasodilation and lung ventilation before the high-volume days.',
        tasks: [
          { type: 'learn', techniqueId: 'beetroot-juice' },
          { type: 'learn', techniqueId: 'spinach' },
          { type: 'practice', description: 'Drink 500ml of beetroot juice. Eat a serving of steamed spinach with lemon.' }
        ]
      },
      {
        day: 5,
        title: 'Digestive Cleanse Phase',
        description: 'Keep the GI tract light and clear to prevent running distress.',
        tasks: [
          { type: 'learn', techniqueId: 'acv' },
          { type: 'learn', techniqueId: 'ginger' },
          { type: 'practice', description: 'Drink ACV diluted in water before dinner to facilitate gastric clearing.' }
        ]
      },
      {
        day: 6,
        title: 'Peak Carb Supercompensation',
        description: 'Carb load to super-saturate leg muscles (quads/glutes/calves).',
        tasks: [
          { type: 'learn', techniqueId: 'sweet-potato' },
          { type: 'learn', techniqueId: 'oatmeal' },
          { type: 'practice', description: 'Consume 7-8g of carbs per kg of bodyweight, primarily from sweet potatoes and oats.' }
        ]
      },
      {
        day: 7,
        title: 'Race Day Isotonic Fueling',
        description: 'Maintain fluid-electrolyte balance under high cardiovascular stress.',
        tasks: [
          { type: 'learn', techniqueId: 'coconut-water' },
          { type: 'learn', techniqueId: 'pink-salt' },
          { type: 'practice', description: 'Sip isotonic coconut water with pink salt during the race or run.' }
        ]
      }
    ]
  },
  'hypertrophy-lifter': {
    id: 'hypertrophy-lifter',
    title: '14-Day Lifter Anabolic Build',
    level: 'Beginner',
    duration: '14 Days',
    shortDesc: 'Saturate muscle protein synthesis, support joints, and fuel heavy resistance loads.',
    description: 'Designed for weightlifters. Maximize the anabolic window, load creatine/protein bio-availability, and use adaptogenic recovery to build dense muscle mass.',
    days: [
      {
        day: 1,
        title: 'MPS Trigger Phase',
        description: 'Initiate frequent leucine dosing to trigger the mTOR pathway.',
        tasks: [
          { type: 'learn', techniqueId: 'whey-isolate' },
          { type: 'practice', description: 'Consume 30-40g of whey isolate post-workout to maximize muscle protein synthesis.' }
        ]
      },
      {
        day: 2,
        title: 'Whole-Food Protein Base',
        description: 'Load high-quality fats and complete amino profile.',
        tasks: [
          { type: 'learn', techniqueId: 'eggs' },
          { type: 'practice', description: 'Consume 3-4 whole pasture-raised eggs to absorb key fat-soluble nutrients and choline.' }
        ]
      },
      {
        day: 3,
        title: 'Anti-Inflammatory Joint Shield',
        description: 'Combat joint and tendon soreness from heavy squatting and pressing.',
        tasks: [
          { type: 'learn', techniqueId: 'turmeric' },
          { type: 'learn', techniqueId: 'salmon' },
          { type: 'practice', description: 'Eat wild salmon seasoned with turmeric and black pepper to reduce inflammation.' }
        ]
      },
      {
        day: 4,
        title: 'Sleep & Recovery Modulation',
        description: 'Promote deep sleep where testosterone and GH release peak.',
        tasks: [
          { type: 'learn', techniqueId: 'ashwagandha' },
          { type: 'learn', techniqueId: 'pumpkin-seeds' },
          { type: 'practice', description: 'Eat pumpkin seeds and take ashwagandha KSM-66 before bed.' }
        ]
      },
      {
        day: 5,
        title: 'Intracellular Hydration Pump',
        description: 'Load water and trace minerals to increase cell volume and mechanical tension.',
        tasks: [
          { type: 'learn', techniqueId: 'pink-salt' },
          { type: 'learn', techniqueId: 'coconut-water' },
          { type: 'practice', description: 'Pre-workout: drink water with a pinch of pink salt for cell expansion.' }
        ]
      },
      {
        day: 6,
        title: 'ATP Restoration & Energy',
        description: 'Boost training capacity and force production.',
        tasks: [
          { type: 'learn', techniqueId: 'cordyceps' },
          { type: 'practice', description: 'Take cordyceps extract 1 hour before heavy lifting to support oxygen utilization.' }
        ]
      },
      {
        day: 7,
        title: 'Gut Integrity Check',
        description: 'Optimize nutrient digestion and absorption capacity.',
        tasks: [
          { type: 'learn', techniqueId: 'kefir' },
          { type: 'learn', techniqueId: 'acv' },
          { type: 'practice', description: 'Drink diluted ACV before meals and a cup of milk kefir to maintain gut microflora.' }
        ]
      },
      {
        day: 8,
        title: 'High Glycogen Load Day',
        description: 'Refill muscular energy stores for the upcoming heavy strength week.',
        tasks: [
          { type: 'learn', techniqueId: 'sweet-potato' },
          { type: 'practice', description: 'Eat clean sweet potatoes at lunch and dinner to fully stock muscle glycogen.' }
        ]
      },
      {
        day: 9,
        title: 'Cognitive Drive Focus',
        description: 'Enhance focus and mind-muscle connection during complex lifts.',
        tasks: [
          { type: 'learn', techniqueId: 'lions-mane' },
          { type: 'practice', description: 'Take Lion\'s Mane mushroom extract with coffee or tea for clean focus.' }
        ]
      },
      {
        day: 10,
        title: 'Iron & Oxygen Saturation',
        description: 'Load organic iron and nitrates to support blood circulation.',
        tasks: [
          { type: 'learn', techniqueId: 'spinach' },
          { type: 'practice', description: 'Incorporate steamed spinach into your post-lifting meal.' }
        ]
      },
      {
        day: 11,
        title: 'Anti-Oxidant Recovery',
        description: 'Clear metabolic waste and oxidative markers from heavy training.',
        tasks: [
          { type: 'learn', techniqueId: 'blueberries' },
          { type: 'practice', description: 'Eat 1 cup of wild blueberries in a post-workout recovery bowl.' }
        ]
      },
      {
        day: 12,
        title: 'Nerve & Gut Reset',
        description: 'Soothe GI lining to improve systemic energy.',
        tasks: [
          { type: 'learn', techniqueId: 'ginger' },
          { type: 'practice', description: 'Sip warm ginger tea between meals to support gastric motility.' }
        ]
      },
      {
        day: 13,
        title: 'Nitric Oxide Spike',
        description: 'Saturate vasodilation for high-repetition muscle pumps.',
        tasks: [
          { type: 'learn', techniqueId: 'beetroot-juice' },
          { type: 'practice', description: 'Drink 300ml of beetroot juice before training.' }
        ]
      },
      {
        day: 14,
        title: 'Anabolic Recovery Peak',
        description: 'Lock in gains with high-quality protein and rest.',
        tasks: [
          { type: 'learn', techniqueId: 'eggs' },
          { type: 'learn', techniqueId: 'whey-isolate' },
          { type: 'practice', description: 'Maintain high protein intake (2.0g/kg) and complete the 14-day cycle.' }
        ]
      }
    ]
  }
};
