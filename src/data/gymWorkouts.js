// Nutrition preparation routines mapped to food IDs.
// Each entry represents a prep method or meal workout to optimize bioavailability.

export const workoutsByCategory = {
  'sweet-potato': {
    title: 'Slow-Release Starch Prep',
    duration: '30 min',
    focus: 'Roasting, fiber retention, starch gelatinization',
    warmup: 'Clean and scrub root skins',
    exercises: [
      { name: 'Oven Roasted Sweet Potato Cubes', sets: 1, reps: '25 min', rest: 'none', note: 'Roast at 400F with avocado oil' },
      { name: 'Stove Steamed Mash', sets: 1, reps: '20 min', rest: 'none', note: 'Steam until soft, mash with cinnamon' }
    ]
  },
  'whey-isolate': {
    title: 'Post-Workout Protein Solubilization',
    duration: '5 min',
    focus: 'Rapid absorption, hydration, mTOR pathway activation',
    warmup: 'Prepare shaker bottle with cold water',
    exercises: [
      { name: 'Blended Whey Shake', sets: 1, reps: '2 min', rest: 'none', note: 'Blend whey with banana and almond butter' },
      { name: 'Shaker Cup Mixing', sets: 1, reps: '60s', rest: 'none', note: 'Shake vigorously to dissolve clumps' }
    ]
  },
  'beetroot-juice': {
    title: 'Nitric Oxide Extraction',
    duration: '15 min',
    focus: 'Nitrate retention, vasodilation priming',
    warmup: 'Wash and peel raw beetroots',
    exercises: [
      { name: 'Juiced Ginger Beet Shot', sets: 1, reps: '5 min', rest: 'none', note: 'Juice beet with ginger and lemon' },
      { name: 'Beetroot Infusion', sets: 1, reps: '10 min', rest: 'none', note: 'Steep sliced beets in cold water' }
    ]
  },
  'eggs': {
    title: 'Bioavailable Choline Scramble',
    duration: '10 min',
    focus: 'Lutein retention, lipid emulsification',
    warmup: 'Whisk eggs in bowl with pinch of salt',
    exercises: [
      { name: 'Stove Fried Eggs', sets: 1, reps: '5 min', rest: 'none', note: 'Cook in grass-fed butter on low heat' },
      { name: 'Soft-Boiled Egg Simmer', sets: 1, reps: '6 min', rest: 'none', note: 'Boil for runny yolk nutrient retention' }
    ]
  },
  'salmon': {
    title: 'Omega-3 Lipid Infusion',
    duration: '20 min',
    focus: 'Astaxanthin preservation, essential fatty acids',
    warmup: 'Pat salmon skin dry, season with sea salt',
    exercises: [
      { name: 'Pan Seared Salmon', sets: 1, reps: '8 min', rest: 'none', note: 'Sear skin-side down in olive oil' },
      { name: 'Oven Baked Fillet', sets: 1, reps: '15 min', rest: 'none', note: 'Bake at 375F with lemon slices' }
    ]
  },
  'kefir': {
    title: 'Probiotic Culturing & Ingestion',
    duration: '5 min',
    focus: 'Lactobacillus colonization, gut microbiome enrichment',
    warmup: 'Gently swirl kefir bottle',
    exercises: [
      { name: 'Raw Kefir Ingestion', sets: 1, reps: '2 min', rest: 'none', note: 'Drink cold on an empty stomach' },
      { name: 'Kefir Probiotic Smoothie', sets: 1, reps: '3 min', rest: 'none', note: 'Blend kefir with blueberries and honey' }
    ]
  },
  'ashwagandha': {
    title: 'Cortisol Suppression Dosage',
    duration: '2 min',
    focus: 'Withanolides standardization, adrenal support',
    warmup: 'Prepare warm milk or water',
    exercises: [
      { name: 'Ashwagandha Elixir Mix', sets: 1, reps: '60s', rest: 'none', note: 'Stir organic ashwagandha powder into warm milk' }
    ]
  },
  'lions-mane': {
    title: 'Nerve Growth Factor Activation',
    duration: '10 min',
    focus: 'Hericenones extract, cognitive focus priming',
    warmup: 'Heat water to 195F',
    exercises: [
      { name: 'Lions Mane Tea Steeping', sets: 1, reps: '5 min', rest: 'none', note: 'Steep organic mushroom powder in hot water' }
    ]
  },
  'ginger': {
    title: 'Gingerol Anti-Inflammatory Shot',
    duration: '10 min',
    focus: 'Digestive enzyme activation, muscle soreness reduction',
    warmup: 'Peel raw ginger root',
    exercises: [
      { name: 'Juicer Ginger Shot', sets: 1, reps: '2 min', rest: 'none', note: 'Juice ginger with lemon and cayenne pepper' }
    ]
  },
  'turmeric': {
    title: 'Curcuminoid Bioavailability Prime',
    duration: '10 min',
    focus: 'NF-kB pathway inhibition, inflammation control',
    warmup: 'Combine turmeric with black pepper to boost absorption by 2000%',
    exercises: [
      { name: 'Turmeric Golden Milk', sets: 1, reps: '5 min', rest: 'none', note: 'Simmer turmeric, pepper, and coconut milk' }
    ]
  },
  'blueberries': {
    title: 'Polyphenol Anthocyanin Load',
    duration: '5 min',
    focus: 'Oxidative stress clearance, vascular function',
    warmup: 'Rinse fresh wild blueberries',
    exercises: [
      { name: 'Raw Blueberry Handfuls', sets: 1, reps: '2 min', rest: 'none', note: 'Consume raw for peak vitamin C' }
    ]
  },
  'spinach': {
    title: 'Phytoecdysteroid Iron Wilting',
    duration: '8 min',
    focus: 'Nitrate absorption, thylakoid satiety activation',
    warmup: 'Wash organic spinach leaves thoroughly',
    exercises: [
      { name: 'Stove Lightly Wilted Spinach', sets: 1, reps: '3 min', rest: 'none', note: 'Sauté in garlic and olive oil until just wilted' }
    ]
  },
  'pumpkin-seeds': {
    title: 'Zinc & Magnesium Mineral Load',
    duration: '2 min',
    focus: 'Testosterone support, muscle contraction regulation',
    warmup: 'Measure 30g portion',
    exercises: [
      { name: 'Raw Pumpkin Seeds Handful', sets: 1, reps: '60s', rest: 'none', note: 'Eat raw or lightly dry-roasted' }
    ]
  },
  'coconut-water': {
    title: 'Isotonic Electrolyte Hydration',
    duration: '2 min',
    focus: 'Intracellular fluid replacement, cramping prevention',
    warmup: 'Chill coconut water',
    exercises: [
      { name: 'Isotonic Hydration Sip', sets: 1, reps: '2 min', rest: 'none', note: 'Drink during or immediately after training' }
    ]
  },
  'oatmeal': {
    title: 'Sprouted Beta-Glucan Simmer',
    duration: '15 min',
    focus: 'Sustained energy release, prebiotic fiber delivery',
    warmup: 'Soak oats overnight to reduce phytic acid',
    exercises: [
      { name: 'Stove Simmered Oatmeal', sets: 1, reps: '10 min', rest: 'none', note: 'Cook sprouted oats in water or almond milk' }
    ]
  },
  'himalayan-salt': {
    title: 'Sodium Hydration Priming',
    duration: '2 min',
    focus: 'Blood volume expansion, muscle pump enhancement',
    warmup: 'Prepare 500ml water bottle',
    exercises: [
      { name: 'Pre-Workout Salt Water Sip', sets: 1, reps: '60s', rest: 'none', note: 'Dissolve 1/4 tsp pink salt in water and drink 30m pre-workout' }
    ]
  },

  // ── New Macronutrient Preps ──

  'chicken-breast': {
    title: 'Lean Protein Searing',
    duration: '20 min',
    focus: 'High-heat sear, protein density maximization',
    warmup: 'Pat chicken dry with paper towels for best sear',
    exercises: [
      { name: 'Pan-Seared Chicken Breast', sets: 1, reps: '12 min', rest: 'none', note: 'Sear 6 min per side in avocado oil on medium-high' },
      { name: 'Oven-Finished Chicken', sets: 1, reps: '15 min', rest: 'none', note: 'Sear both sides, finish in 375°F oven until 165°F internal' }
    ]
  },
  'greek-yogurt': {
    title: 'Casein Protein Bowl Assembly',
    duration: '5 min',
    focus: 'Slow-release amino acid delivery, gut priming',
    warmup: 'Ensure yogurt is at refrigerator temperature',
    exercises: [
      { name: 'Layered Parfait Build', sets: 1, reps: '3 min', rest: 'none', note: 'Layer yogurt, berries, granola, and seeds in a jar' },
      { name: 'Protein Smoothie Base', sets: 1, reps: '2 min', rest: 'none', note: 'Blend yogurt with frozen fruit and collagen' }
    ]
  },
  'quinoa': {
    title: 'Complete Plant Protein Simmer',
    duration: '20 min',
    focus: 'Saponin removal, amino acid profile completion',
    warmup: 'Rinse quinoa under cold water to remove bitter saponins',
    exercises: [
      { name: 'Stovetop Quinoa Simmer', sets: 1, reps: '15 min', rest: 'none', note: 'Simmer 1:2 ratio with water until fluffy' },
      { name: 'Quinoa Bowl Assembly', sets: 1, reps: '5 min', rest: 'none', note: 'Fluff with fork and top with protein and vegetables' }
    ]
  },
  'brown-rice': {
    title: 'Arsenic-Safe Complex Carb Cook',
    duration: '35 min',
    focus: 'Starch gelatinization, resistant starch formation',
    warmup: 'Soak rice in excess water for 30 minutes and drain to reduce arsenic',
    exercises: [
      { name: 'Absorption Method Rice', sets: 1, reps: '30 min', rest: 'none', note: 'Cook in 6:1 water ratio, drain, and steam dry' },
      { name: 'Cool-and-Reheat Protocol', sets: 1, reps: '5 min', rest: 'none', note: 'Refrigerate overnight to form resistant starch, then reheat' }
    ]
  },
  'avocado': {
    title: 'Monounsaturated Fat Preparation',
    duration: '5 min',
    focus: 'Oleic acid preservation, fat-soluble vitamin pairing',
    warmup: 'Select ripe avocado (yields to gentle pressure)',
    exercises: [
      { name: 'Smashed Avocado Toast', sets: 1, reps: '3 min', rest: 'none', note: 'Mash with fork, season with salt, pepper, and lemon' },
      { name: 'Cubed Avocado Bowl Topper', sets: 1, reps: '2 min', rest: 'none', note: 'Dice and add to any grain bowl for healthy fats' }
    ]
  },
  'beef-liver': {
    title: 'Organ Meat Detox Prep',
    duration: '30 min',
    focus: 'Retinol preservation, heme iron bioavailability',
    warmup: 'Soak liver in milk for 30 minutes to reduce metallic flavor',
    exercises: [
      { name: 'Pan-Fried Liver with Onions', sets: 1, reps: '8 min', rest: 'none', note: 'Cook quickly on high heat — overcooking makes it rubbery' },
      { name: 'Liver Pâté Processing', sets: 1, reps: '20 min', rest: 'none', note: 'Sauté with shallots, blend in food processor with butter' }
    ]
  },
  'lentils': {
    title: 'Resistant Starch Simmer',
    duration: '25 min',
    focus: 'Prebiotic fiber delivery, plant protein completion',
    warmup: 'Rinse lentils and pick out any debris',
    exercises: [
      { name: 'Red Lentil Dal', sets: 1, reps: '20 min', rest: 'none', note: 'Simmer with turmeric and cumin until creamy' },
      { name: 'French Green Lentil Salad', sets: 1, reps: '25 min', rest: 'none', note: 'Cook until tender but firm, toss with vinaigrette' }
    ]
  },
  'wild-tuna': {
    title: 'Selenium-Rich Protein Prep',
    duration: '15 min',
    focus: 'Omega-3 preservation, mercury safety',
    warmup: 'Select sushi-grade flash-frozen tuna for raw preparations',
    exercises: [
      { name: 'Seared Tuna Steak', sets: 1, reps: '4 min', rest: 'none', note: 'Sear 60-90 seconds per side, leave center rare' },
      { name: 'Poke Bowl Cube Cut', sets: 1, reps: '10 min', rest: 'none', note: 'Dice into 1cm cubes and marinate in soy-sesame' }
    ]
  },
  'banana': {
    title: 'Fast Glycogen Replenishment',
    duration: '2 min',
    focus: 'Rapid fructose-glucose delivery, potassium loading',
    warmup: 'Select yellow with brown spots for highest sugar content',
    exercises: [
      { name: 'Pre-Workout Banana Eat', sets: 1, reps: '60s', rest: 'none', note: 'Eat 30 minutes before training for quick energy' },
      { name: 'Frozen Banana Smoothie Blend', sets: 1, reps: '2 min', rest: 'none', note: 'Freeze ripe bananas for thick smoothie base' }
    ]
  },

  // ── New Hydration & Salts Preps ──

  'watermelon': {
    title: 'Citrulline Hydration Extraction',
    duration: '5 min',
    focus: 'L-citrulline for nitric oxide, natural electrolyte delivery',
    warmup: 'Chill watermelon before preparation',
    exercises: [
      { name: 'Watermelon Electrolyte Slush', sets: 1, reps: '3 min', rest: 'none', note: 'Blend frozen watermelon with lime and pink salt' },
      { name: 'Cubed Watermelon Snack', sets: 1, reps: '2 min', rest: 'none', note: 'Cube and sprinkle with sea salt for enhanced fluid absorption' }
    ]
  },
  'bone-broth': {
    title: 'Collagen Peptide Extraction',
    duration: '12-24 hours',
    focus: 'Type I/III collagen leaching, glycine synthesis',
    warmup: 'Collect pasture-raised bones, add 1 tbsp apple cider vinegar',
    exercises: [
      { name: 'Slow Cooker Bone Broth', sets: 1, reps: '24 hours', rest: 'none', note: 'Simmer bones with ACV, onion, celery, and peppercorns on low' },
      { name: 'Stovetop Rapid Broth', sets: 1, reps: '4 hours', rest: 'none', note: 'Pressure cook bones for faster collagen extraction' }
    ]
  },
  'tart-cherry-juice': {
    title: 'Melatonin & Anthocyanin Concentrate',
    duration: '2 min',
    focus: 'DOMS reduction, sleep quality optimization',
    warmup: 'Shake concentrate bottle well',
    exercises: [
      { name: 'Diluted Recovery Shot', sets: 1, reps: '60s', rest: 'none', note: 'Mix 30ml concentrate with 60ml water, drink before bed' }
    ]
  },
  'green-tea': {
    title: 'EGCG Catechin Steeping',
    duration: '5 min',
    focus: 'Fat oxidation activation, L-theanine calm focus',
    warmup: 'Heat water to 175°F — never use boiling water',
    exercises: [
      { name: 'Proper Green Tea Steep', sets: 1, reps: '3 min', rest: 'none', note: 'Steep loose-leaf tea at 175°F for exactly 2-3 minutes' },
      { name: 'Cold Brew Green Tea', sets: 1, reps: '8 hours', rest: 'none', note: 'Steep in cold water overnight for smoother, higher L-theanine' }
    ]
  },

  // ── New Micronutrient Preps ──

  'sweet-peppers': {
    title: 'Vitamin C Preservation Cook',
    duration: '10 min',
    focus: 'Ascorbic acid retention, capsaicin thermogenesis',
    warmup: 'Wash and deseed peppers',
    exercises: [
      { name: 'Raw Pepper Strips', sets: 1, reps: '2 min', rest: 'none', note: 'Slice raw for maximum vitamin C — heat destroys it' },
      { name: 'Quick Stir-Fry Peppers', sets: 1, reps: '3 min', rest: 'none', note: 'Flash-cook on high heat to retain crunch and nutrients' }
    ]
  },
  'broccoli': {
    title: 'Sulforaphane Activation',
    duration: '10 min',
    focus: 'Nrf2 pathway activation, DIM formation',
    warmup: 'Cut broccoli and let sit 5 minutes to activate myrosinase enzyme',
    exercises: [
      { name: 'Lightly Steamed Broccoli', sets: 1, reps: '4 min', rest: 'none', note: 'Steam until bright green and crisp-tender — never boil' },
      { name: 'Raw Broccoli Sprout Addition', sets: 1, reps: '2 min', rest: 'none', note: 'Add raw sprouts to salads for 50x more sulforaphane' }
    ]
  },
  'brazil-nuts': {
    title: 'Selenium Microdose Protocol',
    duration: '1 min',
    focus: 'Thyroid optimization, glutathione peroxidase cofactor',
    warmup: 'Count out exactly 2-3 nuts (daily selenium limit)',
    exercises: [
      { name: 'Daily Selenium Dose', sets: 1, reps: '30s', rest: 'none', note: 'Eat 2-3 raw brazil nuts daily — never exceed 4 due to selenium toxicity' }
    ]
  },
  'sardines': {
    title: 'Whole-Fish Nutrient Loading',
    duration: '5 min',
    focus: 'Calcium from bones, vitamin D, omega-3 EPA/DHA',
    warmup: 'Select wild-caught sardines packed in olive oil',
    exercises: [
      { name: 'Sardine Toast Assembly', sets: 1, reps: '3 min', rest: 'none', note: 'Arrange on rye toast with arugula and lemon' },
      { name: 'Sardine Salad Mix', sets: 1, reps: '5 min', rest: 'none', note: 'Mash with avocado, lemon, and capers for a tuna-salad alternative' }
    ]
  },
  'dark-chocolate': {
    title: 'Theobromine Vasodilation Dose',
    duration: '2 min',
    focus: 'Magnesium loading, flavanol endothelial support',
    warmup: 'Select 85%+ cacao dark chocolate',
    exercises: [
      { name: 'Post-Dinner Chocolate Square', sets: 1, reps: '60s', rest: 'none', note: 'Eat 20-30g of 85%+ dark chocolate slowly after dinner' },
      { name: 'Melted Chocolate Bark', sets: 1, reps: '15 min', rest: 'none', note: 'Melt and spread on parchment, top with seeds and sea salt' }
    ]
  },

  // ── New Gut & Digestion Preps ──

  'sauerkraut': {
    title: 'Live Probiotic Serving',
    duration: '2 min',
    focus: 'Lactobacillus plantarum colonization, gut barrier repair',
    warmup: 'Ensure sauerkraut is raw and unpasteurized (refrigerated section)',
    exercises: [
      { name: 'Raw Sauerkraut Side', sets: 1, reps: '60s', rest: 'none', note: 'Serve cold alongside protein — never heat or cook' }
    ]
  },
  'kimchi': {
    title: 'Fermented Capsaicin Probiotic Dose',
    duration: '5 min',
    focus: 'Lactobacillus diversity, thermogenic capsaicin delivery',
    warmup: 'Use aged kimchi (2+ weeks) for maximum probiotic count',
    exercises: [
      { name: 'Raw Kimchi Side Dish', sets: 1, reps: '60s', rest: 'none', note: 'Serve 1/4 cup alongside any meal for gut support' },
      { name: 'Kimchi Fried Rice Stir-Fry', sets: 1, reps: '5 min', rest: 'none', note: 'Caramelize kimchi in sesame oil before adding rice' }
    ]
  },
  'psyllium-husk': {
    title: 'Soluble Fiber Hydration Protocol',
    duration: '2 min',
    focus: 'Intestinal transit regulation, cholesterol binding',
    warmup: 'Prepare a full glass of water — psyllium must be fully hydrated',
    exercises: [
      { name: 'Psyllium Water Mix', sets: 1, reps: '60s', rest: 'none', note: 'Stir 1 tsp into a full glass of water, drink immediately before it gels' }
    ]
  },
  'apple-cider-raw': {
    title: 'Acetic Acid Blood Sugar Protocol',
    duration: '2 min',
    focus: 'Insulin sensitivity enhancement, digestive priming',
    warmup: 'Always dilute — never drink undiluted ACV',
    exercises: [
      { name: 'Pre-Meal ACV Tonic', sets: 1, reps: '60s', rest: 'none', note: 'Mix 1 tbsp raw ACV in 250ml water, drink 15 min before meals' }
    ]
  },
  'miso': {
    title: 'Enzyme-Rich Fermented Paste Prep',
    duration: '10 min',
    focus: 'Digestive enzyme activation, isoflavone delivery',
    warmup: 'Heat water to below boiling — never boil miso',
    exercises: [
      { name: 'Morning Miso Soup', sets: 1, reps: '8 min', rest: 'none', note: 'Dissolve miso paste in warm (not boiling) water with tofu and seaweed' },
      { name: 'Miso Glaze for Fish', sets: 1, reps: '5 min', rest: 'none', note: 'Mix miso with mirin and honey, brush on fish before broiling' }
    ]
  },

  // ── New Superfood & Adaptogen Preps ──

  'spirulina': {
    title: 'Phycocyanin Antioxidant Loading',
    duration: '5 min',
    focus: 'Iron density, complete algae protein, anti-inflammatory pigment',
    warmup: 'Use organic spirulina powder from a certified source',
    exercises: [
      { name: 'Spirulina Smoothie Boost', sets: 1, reps: '2 min', rest: 'none', note: 'Add 1 tsp to any smoothie — start small for taste adjustment' },
      { name: 'Spirulina Energy Ball Mix', sets: 1, reps: '15 min', rest: 'none', note: 'Mix with oats, honey, and nut butter, roll into balls' }
    ]
  },
  'maca-root': {
    title: 'Hormonal Adaptogen Dose',
    duration: '3 min',
    focus: 'Endocrine system balancing, stamina enhancement',
    warmup: 'Use gelatinized maca for better digestibility',
    exercises: [
      { name: 'Maca Smoothie Addition', sets: 1, reps: '2 min', rest: 'none', note: 'Blend 1 tsp gelatinized maca with banana and cacao' }
    ]
  },
  'reishi-mushroom': {
    title: 'Triterpene Immune Modulation',
    duration: '10 min',
    focus: 'Beta-glucan immune activation, cortisol modulation',
    warmup: 'Heat water to 195°F for optimal extraction',
    exercises: [
      { name: 'Reishi Tea Steeping', sets: 1, reps: '8 min', rest: 'none', note: 'Steep reishi powder in hot water for 5-8 minutes' },
      { name: 'Reishi Nightcap Elixir', sets: 1, reps: '5 min', rest: 'none', note: 'Mix with warm milk, honey, and cinnamon before bed' }
    ]
  },
  'creatine-mono': {
    title: 'Phosphocreatine Saturation',
    duration: '2 min',
    focus: 'ATP regeneration, Type II fiber phosphocreatine stores',
    warmup: 'Use micronized creatine monohydrate for best solubility',
    exercises: [
      { name: 'Post-Workout Creatine Mix', sets: 1, reps: '60s', rest: 'none', note: 'Dissolve 5g in grape juice post-workout for insulin-driven uptake' }
    ]
  },
  'collagen-peptides': {
    title: 'Connective Tissue Repair Dose',
    duration: '3 min',
    focus: 'Type I/III collagen synthesis, tendon and gut repair',
    warmup: 'Pair with vitamin C source for enhanced collagen synthesis',
    exercises: [
      { name: 'Collagen Coffee Stir', sets: 1, reps: '60s', rest: 'none', note: 'Dissolve 10g hydrolyzed collagen peptides in hot coffee' },
      { name: 'Collagen Smoothie Add', sets: 1, reps: '2 min', rest: 'none', note: 'Blend into any smoothie — tasteless and odorless' }
    ]
  }
};

export function getWorkoutForTechnique(id) {
  return workoutsByCategory[id] || null;
}
