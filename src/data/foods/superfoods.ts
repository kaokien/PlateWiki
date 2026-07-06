import type { Technique } from '../techniques';

export const superfoodsFoods: Record<string, Technique> = {
  "matcha": {
    "id": "matcha",
    "name": "Matcha Green Tea",
    "category": "Superfoods & Adaptogens",
    "difficulty": "intermediate",
    "stance": "both",
    "trainingFormat": [
      "whisked-tea",
      "latte",
      "smoothie"
    ],
    "muscles": [
      "head",
      "heart",
      "abs"
    ],
    "description": "A finely ground powder of specially grown green tea leaves. Matcha is rich in L-Theanine and Epigallocatechin Gallate (EGCG), providing a calm, focused energy boost (sustained caffeine release) and strong metabolic support.",
    "whenToUse": "Drink 30-60 minutes before training for clean, jitter-free focus and thermogenic fat oxidation.",
    "coachingCues": [
      "Whisk with warm water (not boiling) in a W-shaped motion.",
      "Choose ceremonial grade for drinking, culinary grade for baking.",
      "Avoid adding processed sugars or dairy milk, which can reduce antioxidant absorption."
    ],
    "steps": [
      "L-Theanine crosses the blood-brain barrier, increasing alpha brain waves for relaxed alertness.",
      "Caffeine binds to adenosine receptors, preventing fatigue without the rapid spike of coffee.",
      "EGCG acts as a powerful antioxidant, stimulating fat metabolism via catechol-O-methyltransferase inhibition."
    ],
    "mistakes": [
      "Using boiling water (over 180F) which burns the matcha, making it bitter and destroying antioxidants.",
      "Buying cheap matcha mixes containing added sugar and milk solids."
    ],
    "proTips": [
      "Whisk ceremonial matcha with hot water and drink 45 minutes before sparring; it provides the mental focus of caffeine without raising your heart rate too high.",
      "Blend matcha with oat milk and a touch of raw honey for a delicious, antioxidant-dense pre-workout latte."
    ],
    "conditioning": [
      "Athletic Matcha Shot: Whisk 1 tsp ceremonial matcha in 2 oz warm water (160F). Drink immediately."
    ],
    "combinations": [
      {
        "name": "Antioxidant Energy (Matcha + Raw Honey)",
        "link": "raw-honey"
      }
    ],
    "relatedTechniques": [
      "green-tea",
      "raw-honey",
      "ashwagandha"
    ]
  },
  "ginseng": {
    "id": "ginseng",
    "name": "Panax Ginseng",
    "category": "Superfoods & Adaptogens",
    "difficulty": "advanced",
    "stance": "both",
    "trainingFormat": [
      "extract",
      "tea-infusion",
      "powder"
    ],
    "muscles": [
      "head",
      "heart",
      "quadriceps"
    ],
    "description": "A classic Eastern Asian adaptogenic root containing active ginsenosides. Panax Ginseng enhances physical stamina, fights fatigue, improves cognitive reaction times, and supports adrenal health during heavy training volumes.",
    "whenToUse": "Take in the morning or 1 hour before training; cycle usage (e.g., 6 weeks on, 2 weeks off) to prevent adaptation.",
    "coachingCues": [
      "Use standardized extracts containing at least 4% ginsenosides.",
      "Take early in the day as it can be highly stimulating.",
      "Cycle use regularly."
    ],
    "steps": [
      "Ginsenosides modulate the Hypothalamic-Pituitary-Adrenal (HPA) axis, regulating cortisol output.",
      "Cellular ATP production is stimulated, increasing energy availability.",
      "Nitric oxide pathways are activated, supporting cardiovascular blood flow."
    ],
    "mistakes": [
      "Taking Panax Ginseng right before sleep, which can cause insomnia.",
      "Using low-quality, cheap root powders that contain negligible ginsenoside content."
    ],
    "proTips": [
      "Panax Ginseng is highly synergistic with Cordyceps; taking them together before training provides a stellar boost to aerobic capacity and VO2 max.",
      "If you are in a heavy overreaching training phase, use ginseng to protect your central nervous system from burnout."
    ],
    "conditioning": [
      "Stamina Adaptogen Tea: Steep 1g of red ginseng root extract in hot water with ginger. Drink in the morning."
    ],
    "combinations": [
      {
        "name": "Aerobic Stamina Synergy (Ginseng + Cordyceps)",
        "link": "cordyceps"
      }
    ],
    "relatedTechniques": [
      "cordyceps",
      "ashwagandha",
      "ginger"
    ]
  },
  "rhodiola": {
    "id": "rhodiola",
    "name": "Rhodiola Rosea",
    "category": "Superfoods & Adaptogens",
    "difficulty": "intermediate",
    "stance": "both",
    "trainingFormat": [
      "capsule",
      "extract",
      "tea"
    ],
    "muscles": [
      "head",
      "heart",
      "abs"
    ],
    "description": "An arctic adaptogenic herb containing rosavins and salidrosides. Rhodiola is highly effective at reducing physical and mental fatigue, improving endurance, and buffering the body against chemical and environmental stress.",
    "whenToUse": "Take 200-400mg in the morning or 45 minutes before exercise, preferably on an empty stomach.",
    "coachingCues": [
      "Choose extracts standardized to 3% rosavins and 1% salidrosides.",
      "Take on an empty stomach to enhance absorption.",
      "Cycle usage during peak training blocks."
    ],
    "steps": [
      "Salidrosides prevent cell damage and enhance energy metabolism.",
      "Monoamine neurotransmitters (serotonin, dopamine) are optimized in the brain, improving mood and focus.",
      "Lactic acid levels and muscle damage markers (like creatine kinase) are reduced post-exercise."
    ],
    "mistakes": [
      "Taking low-rosavin extracts that are ineffective.",
      "Assuming immediate results; like most adaptogens, Rhodiola works best when taken consistently over 2-3 weeks."
    ],
    "proTips": [
      "Take Rhodiola Rosea on the day of a major fight or race; it helps calm performance anxiety while keeping your central nervous system sharp and fatigue-resistant.",
      "Pair with Ashwagandha to create a powerful anti-stress recovery protocol during intense training camps."
    ],
    "conditioning": [
      "Endurance Adaptogen Shot: Take 300mg standardized Rhodiola extract with a cup of green tea pre-workout."
    ],
    "combinations": [
      {
        "name": "CNS Stress Protection (Rhodiola + Ashwagandha)",
        "link": "ashwagandha"
      }
    ],
    "relatedTechniques": [
      "ashwagandha",
      "green-tea",
      "lions-mane"
    ]
  },
  "raw-cacao": {
    "id": "raw-cacao",
    "name": "Raw Cacao",
    "category": "Superfoods & Adaptogens",
    "difficulty": "beginner",
    "stance": "both",
    "trainingFormat": [
      "powder",
      "nibs",
      "raw-chocolate"
    ],
    "muscles": [
      "heart",
      "head",
      "quadriceps"
    ],
    "description": "The raw, cold-pressed seed of the cacao tree. Raw cacao is a powerhouse of flavanols, magnesium, iron, and theobromine, promoting vasodilation, cellular hydration, and cognitive focus.",
    "whenToUse": "Add raw cacao powder or nibs to pre-workout meals or eat as a snack (dark chocolate 85%+).",
    "coachingCues": [
      "Use raw cacao powder, not alkalized cocoa powder (Dutch processed) which destroys flavanols.",
      "Store in a cool, dark place.",
      "Combine with a natural sweetener like honey to offset bitterness."
    ],
    "steps": [
      "Cacao flavanols stimulate nitric oxide synthase, relaxing blood vessels.",
      "Theobromine provides a gentle, long-lasting cardiovascular stimulant effect.",
      "Magnesium relaxes vascular smooth muscle, improving blood pressure and recovery."
    ],
    "mistakes": [
      "Using processed cocoa powders containing milk solids, sugar, and alkali-refined fats.",
      "Over-consuming cacao late at night, as theobromine and small amounts of caffeine can disrupt sleep."
    ],
    "proTips": [
      "Add 1 tablespoon of raw cacao powder and a pinch of pink salt to your oatmeal for a delicious, magnesium-dense chocolate pre-workout bowl.",
      "Eat a few raw cacao nibs before training for a natural, sugar-free energy burst and focus enhancer."
    ],
    "conditioning": [
      "Polyphenol Recovery Shake: Blend 1 scoop chocolate protein, 1 tbsp raw cacao powder, 1 banana, and 1 cup oat milk."
    ],
    "combinations": [
      {
        "name": "Vascular Nitric Oxide (Raw Cacao + Pink Salt)",
        "link": "pink-salt"
      }
    ],
    "relatedTechniques": [
      "dark-chocolate",
      "pink-salt",
      "banana"
    ]
  },
  "magnesium-glycinate": {
    "id": "magnesium-glycinate",
    "name": "Magnesium Glycinate",
    "category": "Superfoods & Adaptogens",
    "difficulty": "beginner",
    "stance": "both",
    "trainingFormat": [
      "capsule",
      "powder"
    ],
    "muscles": [
      "calves",
      "quadriceps",
      "hamstring",
      "head"
    ],
    "description": "A highly bioavailable form of magnesium chelated with the amino acid glycine. Magnesium glycinate promotes deep muscle relaxation, calms the nervous system, prevents nocturnal cramping, and optimizes sleep quality.",
    "whenToUse": "Take 200-400mg 30-60 minutes before bed to support muscle recovery and deep sleep.",
    "coachingCues": [
      "Opt for pure powder or capsule forms without fillers.",
      "Highly gentle on the stomach compared to magnesium citrate or oxide.",
      "Take consistently for best recovery benefits."
    ],
    "steps": [
      "Magnesium is absorbed in the ileum via passive and active pathways.",
      "Glycine crosses the blood-brain barrier, acting as an inhibitory neurotransmitter that promotes calm.",
      "Magnesium ions block NMDA receptors in the brain, reducing neuronal excitability and promoting muscle relaxation."
    ],
    "mistakes": [
      "Buying cheap magnesium oxide supplements, which have less than 4% bioavailability and cause digestive distress.",
      "Taking magnesium right before high-intensity workouts, which can cause muscle relaxation when tension is required."
    ],
    "proTips": [
      "Magnesium glycinate is the gold standard for athletic sleep recovery; taking it before bed halts muscle twitches and promotes deep, restorative delta-wave sleep.",
      "If you suffer from calf cramps during sleep or long workouts, combine magnesium glycinate with pink salt hydration."
    ],
    "conditioning": [
      "Rest & Recovery Protocol: Take 300mg of Magnesium Glycinate with a cup of warm chamomile tea 1 hour before sleep."
    ],
    "combinations": [
      {
        "name": "Deep Sleep & Muscle Recovery (Magnesium + Pink Salt)",
        "link": "pink-salt"
      }
    ],
    "relatedTechniques": [
      "pink-salt",
      "pumpkin-seeds",
      "tart-cherry-juice"
    ]
  },
  "zinc-picolinate": {
    "id": "zinc-picolinate",
    "name": "Zinc Picolinate",
    "category": "Superfoods & Adaptogens",
    "difficulty": "beginner",
    "stance": "both",
    "trainingFormat": [
      "capsule"
    ],
    "muscles": [
      "chest",
      "triceps",
      "biceps",
      "quadriceps",
      "gluteal"
    ],
    "description": "A highly absorbable form of zinc bound to picolinic acid. Zinc is an essential trace mineral that acts as a cofactor for over 300 enzymatic reactions, promoting testosterone synthesis, protein synthesis, and immune cell function.",
    "whenToUse": "Take 15-30mg daily with a meal (never on an empty stomach) to support recovery and hormone balance.",
    "coachingCues": [
      "Take with food to prevent temporary nausea.",
      "Do not take at the same time as calcium or iron supplements, as they compete for absorption.",
      "Excellent for maintaining immune health during high-volume training blocks."
    ],
    "steps": [
      "Picolinic acid facilitates the transport of zinc ions across the intestinal membrane.",
      "Zinc is transported to cells, where it acts as a structural component of zinc-finger proteins.",
      "Enzymes responsible for protein synthesis and testosterone conversion are activated."
    ],
    "mistakes": [
      "Taking zinc on an empty stomach, which frequently causes intense, temporary nausea.",
      "Megadosing zinc (over 50mg daily) long-term, which can induce a copper deficiency."
    ],
    "proTips": [
      "If you feel run down from heavy training, take zinc picolinate with a meal to support your immune system's T-cells.",
      "Zinc is highly synergistic with magnesium; taking them together in your evening routine optimizes hormone support."
    ],
    "conditioning": [
      "Hormone Support Routine: Take 15mg Zinc Picolinate with your evening recovery meal containing red meat or pumpkin seeds."
    ],
    "combinations": [
      {
        "name": "Hormonal Support Synergy (Zinc + Pumpkin Seeds)",
        "link": "pumpkin-seeds"
      }
    ],
    "relatedTechniques": [
      "pumpkin-seeds",
      "oysters",
      "beef-liver"
    ]
  },
  "fish-oil": {
    "id": "fish-oil",
    "name": "Fish Oil",
    "category": "Superfoods & Adaptogens",
    "difficulty": "beginner",
    "stance": "both",
    "trainingFormat": [
      "liquid",
      "gel-capsule"
    ],
    "muscles": [
      "heart",
      "head",
      "abs"
    ],
    "description": "A highly concentrated source of the omega-3 fatty acids EPA (eicosapentaenoic acid) and DHA (docosahexaenoic acid). Fish oil is a premier anti-inflammatory supplement, promoting joint recovery, heart health, and cognitive function.",
    "whenToUse": "Take 1-2g of active EPA/DHA daily with a fat-containing meal to maximize absorption.",
    "coachingCues": [
      "Look for molecularly distilled, third-party tested fish oils to avoid heavy metals.",
      "Choose liquid forms for high dosage, or enteric-coated gel caps to prevent fishy aftertaste.",
      "Store in the refrigerator."
    ],
    "steps": [
      "EPA and DHA are absorbed and incorporated into the phospholipid bilayer of cells.",
      "EPA competes with arachidonic acid, reducing the production of inflammatory eicosanoids.",
      "DHA supports brain health and myelin sheath integrity, improving neural signaling speed."
    ],
    "mistakes": [
      "Buying cheap, oxidized fish oils that smell intensely fishy and cause rancid burps.",
      "Taking fish oil on an empty stomach, which reduces its absorption rate."
    ],
    "proTips": [
      "Take 2g of high-potency liquid fish oil daily during intense sparring or contact sports blocks; EPA/DHA helps protect brain cells and reduce neuroinflammation.",
      "Pair fish oil with Vitamin D3 in the morning; the healthy fats in fish oil maximize the absorption of the fat-soluble Vitamin D3."
    ],
    "conditioning": [
      "Anti-Inflammatory Morning Routine: Take 1 tsp high-quality liquid fish oil with a breakfast containing whole eggs."
    ],
    "combinations": [
      {
        "name": "Fat-Soluble Absorption (Fish Oil + Eggs)",
        "link": "eggs"
      }
    ],
    "relatedTechniques": [
      "salmon",
      "sardines",
      "eggs"
    ]
  }
};
