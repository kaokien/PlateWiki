import type { Technique } from '../foods';

export const hydrationFoods: Record<string, Technique> = {
  "celery-juice": {
    "id": "celery-juice",
    image: '/images/foods/celery-juice.jpg',
    "name": "Celery Juice",
    "category": "Hydration & Salts",
    "difficulty": "intermediate",
    "stance": "both",
    "trainingFormat": [
      "raw",
      "cold-pressed"
    ],
    "muscles": [
      "abs",
      "calves",
      "heart"
    ],
    "description": "A highly hydrating, cold-pressed green juice rich in organic sodium, potassium, and cluster salts. Celery juice support gastric acid production, flushes toxins, and restores electrolyte balance to prevent muscle cramping.",
    "whenToUse": "Drink on an empty stomach in the morning or 1 hour before training for deep cellular hydration.",
    "coachingCues": [
      "Drink fresh and raw; do not pasteurize.",
      "Drink pure celery juice without diluting with other juices.",
      "Consume immediately after juicing to prevent oxidation."
    ],
    "steps": [
      "Natural mineral salts support the restoration of the stomach's hydrochloric acid.",
      "Organic sodium and potassium regulate cellular fluid balance and blood pressure.",
      "Antioxidants help calm systemic inflammation in the digestive tract."
    ],
    "mistakes": [
      "Buying store-bought, pasteurized celery juices that have lost their active enzymes and vitamin content.",
      "Adding high-sugar fruits (like apples or pineapples) which spikes insulin and dilutes the digestive benefits."
    ],
    "proTips": [
      "Drink 12-16 oz of fresh celery juice on an empty stomach in the morning to optimize digestion and reduce bloating.",
      "Juice raw celery with a small slice of fresh ginger to add a powerful anti-inflammatory and digestion-boosting kick."
    ],
    "conditioning": [
      "Pure Celery Hydrator: Juice 1 bunch of organic celery stalks. Drink immediately on an empty stomach."
    ],
    "combinations": [
      {
        "name": "Anti-Inflammatory Hydration (Celery Juice + Ginger)",
        "link": "ginger"
      }
    ],
    "relatedTechniques": [
      "coconut-water",
      "pink-salt",
      "ginger"
    ]
  },
  "cucumber": {
    "id": "cucumber",
    image: '/images/foods/cucumber.jpg',
    "name": "Cucumber",
    "category": "Hydration & Salts",
    "difficulty": "beginner",
    "stance": "both",
    "trainingFormat": [
      "raw",
      "sliced",
      "juiced"
    ],
    "muscles": [
      "calves",
      "quadriceps",
      "abs"
    ],
    "description": "A refreshing vegetable containing 95% water, alongside silica, potassium, and magnesium. Cucumber provides excellent low-calorie hydration and supports joint, skin, and connective tissue recovery in athletes.",
    "whenToUse": "Eat raw as a hydrating snack, add to salads, or juice before and after training.",
    "coachingCues": [
      "Eat with the skin on for extra silica and fiber.",
      "Choose organic cucumbers to avoid pesticide residues on the skin.",
      "Sprinkle with pink salt for an electrolyte boost."
    ],
    "steps": [
      "High water content provides immediate cellular hydration.",
      "Silica acts as an essential trace mineral to support collagen synthesis in joints.",
      "Potassium and magnesium help regulate fluid balance and prevent cramping."
    ],
    "mistakes": [
      "Peeling the skin off conventional cucumbers, which strips away the majority of the silica and fiber.",
      "Eating cucumbers that are soft and yellowing, indicating they have lost their moisture and nutrients."
    ],
    "proTips": [
      "Slice a whole cucumber, sprinkle with pink salt and lime juice, for a low-calorie, mineral-rich pre-workout hydration snack.",
      "Juice cucumber with lemon and mint for a refreshing, cooling intra-workout drink."
    ],
    "conditioning": [
      "Hydrating Cucumber Salad: Slice 1 cucumber, toss with 1 tsp olive oil, apple cider vinegar, and a pinch of pink salt."
    ],
    "combinations": [
      {
        "name": "Electrolyte Replenishment (Cucumber + Pink Salt)",
        "link": "pink-salt"
      }
    ],
    "relatedTechniques": [
      "pink-salt",
      "coconut-water",
      "celery-juice"
    ]
  },
  "mineral-water": {
    "id": "mineral-water",
    image: '/images/foods/mineral-water.jpg',
    "name": "Mineral Water",
    "category": "Hydration & Salts",
    "difficulty": "beginner",
    "stance": "both",
    "trainingFormat": [
      "sparkling",
      "still"
    ],
    "muscles": [
      "calves",
      "quadriceps",
      "heart"
    ],
    "description": "Natural water sourced from underground springs, naturally rich in minerals like calcium, magnesium, and bicarbonate. Mineral water offers highly bioavailable trace minerals to support hydration, bone strength, and muscle function.",
    "whenToUse": "Drink throughout the day and during/after workouts to maintain electrolyte balance.",
    "coachingCues": [
      "Choose water bottled in glass to avoid plastic microparticles.",
      "Look for high TDS (Total Dissolved Solids) ratings for more minerals.",
      "Bicarbonates help buffer lactic acid."
    ],
    "steps": [
      "Calcium and magnesium ions are absorbed in the small intestine with high bioavailability.",
      "Bicarbonate ions help buffer systemic acidity, including exercise-induced lactic acid.",
      "Fluid volume is restored, maintaining blood pressure and cardiovascular output."
    ],
    "mistakes": [
      "Drinking purified tap waters stripped of all natural minerals.",
      "Relying solely on plain water without electrolytes during heavy sweating, which can lead to hyponatremia."
    ],
    "proTips": [
      "Choose high-mineral sparkling waters (like Gerolsteiner) which contain over 2,500mg of TDS per liter to naturally replenish electrolytes without sugar.",
      "Add a squeeze of lemon and a pinch of pink salt to mineral water for the ultimate clean sports drink."
    ],
    "conditioning": [
      "Electrolyte Buffer: 16 oz sparkling mineral water, a squeeze of fresh lime, and 1/8 tsp pink salt. Drink during training."
    ],
    "combinations": [
      {
        "name": "Lactic Acid Buffer (Mineral Water + Pink Salt)",
        "link": "pink-salt"
      }
    ],
    "relatedTechniques": [
      "pink-salt",
      "coconut-water",
      "celery-juice"
    ]
  },
  "pickle-juice": {
    "id": "pickle-juice",
    image: '/images/foods/pickle-juice.jpg',
    "name": "Pickle Juice",
    "category": "Hydration & Salts",
    "difficulty": "intermediate",
    "stance": "both",
    "trainingFormat": [
      "raw-shot"
    ],
    "muscles": [
      "calves",
      "hamstring",
      "quadriceps"
    ],
    "description": "The briny, high-sodium liquid from fermented pickles. Pickle juice contains high concentrations of sodium chloride, vinegar, and potassium, which triggers a reflex in the throat that halts muscle cramps in seconds.",
    "whenToUse": "Take a 2 oz shot immediately at the onset of muscle cramps during intense training or competition.",
    "coachingCues": [
      "Use juice from naturally fermented pickles, not vinegar-brined.",
      "Drink straight as a shot; do not dilute.",
      "Keep a small bottle in your gym bag for emergencies."
    ],
    "steps": [
      "Acidic vinegar triggers receptors in the back of the throat.",
      "This sends a sensory signal that shuts down alpha motor neuron activity, instantly releasing the muscle cramp.",
      "Sodium and potassium are absorbed to restore electrolyte balance in the blood."
    ],
    "mistakes": [
      "Drinking pickle juice made with artificial yellow dyes and preservatives.",
      "Using it as daily hydration instead of water; it is too high in sodium for general drinking."
    ],
    "proTips": [
      "Drink 2 oz of pickle juice 15 minutes before a long, hot endurance run to preemptively prevent cramping.",
      "Save the juice from your sauerkraut or fermented pickles; it is packed with active probiotics and electrolytes."
    ],
    "conditioning": [
      "Cramp-Relief Shot: 2 oz of chilled fermented pickle juice, taken immediately when a cramp occurs."
    ],
    "combinations": [
      {
        "name": "Instant Cramp Release (Pickle Juice + Pink Salt)",
        "link": "pink-salt"
      }
    ],
    "relatedTechniques": [
      "pink-salt",
      "coconut-water",
      "sauerkraut"
    ]
  }
};
