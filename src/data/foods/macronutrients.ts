import type { Technique } from '../techniques';

export const macronutrientsFoods: Record<string, Technique> = {
  "medjool-dates": {
    "id": "medjool-dates",
    image: '/images/foods/medjool-dates.jpg',
    "name": "Medjool Dates",
    "category": "Macronutrients",
    "difficulty": "beginner",
    "stance": "both",
    "trainingFormat": [
      "raw",
      "stuffed",
      "puree"
    ],
    "muscles": [
      "quadriceps",
      "gluteal",
      "hamstring",
      "calves"
    ],
    "description": "A nutrient-dense stone fruit loaded with easily digestible simple sugars, potassium, and soluble fiber. Medjool dates offer a rapid yet sustained release of carbohydrates, making them a perfect pre-workout glycogen booster for high-intensity training.",
    "whenToUse": "Consume 2-3 Medjool dates 30-45 minutes before a workout or sparring session for quick energy.",
    "coachingCues": [
      "Remove the pit before eating.",
      "Combine with a small amount of almond butter to slow sugar absorption.",
      "Eat organic and unsulfured."
    ],
    "steps": [
      "Simple sugars (glucose and fructose) are quickly absorbed in the upper intestine via GLUT2 and GLUT5 transporters.",
      "Fructose is processed by the liver to replenish hepatic glycogen stores.",
      "Glucose enters the bloodstream directly, raising blood sugar levels to fuel immediate athletic output."
    ],
    "mistakes": [
      "Eating too many (over 4) right before training, which can cause insulin spikes or mild stomach heaviness.",
      "Consuming with high-fat, high-fiber meals, defeating the purpose of rapid carbohydrate delivery."
    ],
    "proTips": [
      "Stuff dates with a pinch of sea salt and a single almond for a perfect, portable pre-workout snack.",
      "Use date puree as a natural sweetener in homemade energy gels and recovery bars."
    ],
    "conditioning": [
      "Pre-Fight Energy Bites: Blend 10 pitted dates, 1/2 cup walnuts, 1 tbsp cacao powder, and a pinch of pink salt. Roll into balls."
    ],
    "combinations": [
      {
        "name": "Pre-Workout Fuel (Medjool Dates + Almonds)",
        "link": "almonds"
      }
    ],
    "relatedTechniques": [
      "banana",
      "honey",
      "almonds"
    ]
  },
  "raw-honey": {
    "id": "raw-honey",
    image: '/images/foods/raw-honey.jpg',
    "name": "Raw Honey",
    "category": "Macronutrients",
    "difficulty": "beginner",
    "stance": "both",
    "trainingFormat": [
      "raw",
      "drizzle",
      "infusion"
    ],
    "muscles": [
      "quadriceps",
      "heart",
      "abs"
    ],
    "description": "An unpasteurized, enzyme-rich carbohydrate source produced by bees. Raw honey contains a natural ratio of fructose and glucose, along with organic acids and antioxidants that support metabolic efficiency and decrease training-induced oxidative stress.",
    "whenToUse": "Consume 1 tablespoon 15-30 minutes before high-intensity conditioning or immediately after a workout.",
    "coachingCues": [
      "Do not heat above 110F to preserve active enzymes.",
      "Choose local, unfiltered honey for immune support.",
      "Ideal for fast intra-workout fueling."
    ],
    "steps": [
      "Enzymes in honey (like diastase) aid in carbohydrate digestion.",
      "Fructose and glucose utilize different intestinal transporters, maximizing overall carbohydrate absorption rates.",
      "Antioxidants scavenge free radicals generated during strenuous muscle contractions."
    ],
    "mistakes": [
      "Buying highly processed, clear honey, which is often diluted with corn syrup and stripped of enzymes.",
      "Heating honey in boiling tea, which denatures its active proteins and beneficial enzymes."
    ],
    "proTips": [
      "Take 1 tablespoon of raw honey with a pinch of pink salt before sparring to sustain endurance and prevent cramping.",
      "Drizzle over oatmeal or blend into post-workout recovery shakes to aid in rapid glycogen replenishment."
    ],
    "conditioning": [
      "Intra-Workout Hydration: Mix 1 tbsp raw honey, 16 oz water, 1 tbsp lemon juice, and 1/4 tsp pink salt."
    ],
    "combinations": [
      {
        "name": "Electrolyte Energy (Raw Honey + Pink Salt)",
        "link": "pink-salt"
      }
    ],
    "relatedTechniques": [
      "banana",
      "pink-salt",
      "coconut-water"
    ]
  },
  "jasmine-rice": {
    "id": "jasmine-rice",
    image: '/images/foods/jasmine-rice.jpg',
    "name": "Jasmine Rice",
    "category": "Macronutrients",
    "difficulty": "beginner",
    "stance": "both",
    "trainingFormat": [
      "steamed",
      "boiled"
    ],
    "muscles": [
      "quadriceps",
      "gluteal",
      "hamstring"
    ],
    "description": "An easily digestible, high-glycemic white rice variety. Jasmine rice contains minimal fiber and fat, allowing for rapid gastric emptying and extremely fast conversion into glucose, which is ideal for replenishing depleted muscle glycogen stores post-exercise.",
    "whenToUse": "Eat as part of a post-workout recovery meal within 1-2 hours of finishing training.",
    "coachingCues": [
      "Rinse before cooking to remove excess surface starch.",
      "Combine with a lean protein source like chicken breast.",
      "Steam or boil without heavy added oils."
    ],
    "steps": [
      "Highly gelatinized starches are quickly hydrolyzed by pancreatic amylase.",
      "Glucose is absorbed rapidly through SGLT1 transporters in the jejunum.",
      "The resultant insulin spike accelerates glycogen synthesis and amino acid transport into muscle cells."
    ],
    "mistakes": [
      "Eating large portions before training, which can cause a rapid rise and subsequent crash in blood sugar.",
      "Adding excessive fat (like heavy cream or butter) post-workout, which slows down the digestion of carbs and protein."
    ],
    "proTips": [
      "Cook Jasmine rice in bone broth instead of water to add amino acids (glycine) and minerals for joint recovery.",
      "Combine with wild tuna or chicken breast for a clean, classic bodybuilder-style recovery meal."
    ],
    "conditioning": [
      "Recovery Rice Bowl: 1 cup steamed Jasmine rice cooked in chicken bone broth, topped with 150g grilled chicken breast and coconut aminos."
    ],
    "combinations": [
      {
        "name": "Anabolic Recovery (Jasmine Rice + Chicken Breast)",
        "link": "chicken-breast"
      }
    ],
    "relatedTechniques": [
      "chicken-breast",
      "sweet-potato",
      "quinoa"
    ]
  },
  "buckwheat": {
    "id": "buckwheat",
    image: '/images/foods/buckwheat.jpg',
    "name": "Buckwheat",
    "category": "Macronutrients",
    "difficulty": "beginner",
    "stance": "both",
    "trainingFormat": [
      "boiled",
      "porridge",
      "baking"
    ],
    "muscles": [
      "quadriceps",
      "hamstring",
      "calves"
    ],
    "description": "A gluten-free pseudocereal rich in complex carbohydrates, soluble fiber, and the antioxidant rutin. Buckwheat has a low glycemic index, providing sustained energy release while promoting cardiovascular health and vascular integrity.",
    "whenToUse": "Eat 2-3 hours before endurance workouts or as a baseline carbohydrate source in main meals.",
    "coachingCues": [
      "Toast buckwheat groats (kasha) before boiling for a rich flavor.",
      "Excellent alternative for individuals sensitive to gluten.",
      "High in magnesium for muscle relaxation."
    ],
    "steps": [
      "Complex starches are slowly broken down by digestive enzymes.",
      "Fiber contents slow glucose release into the portal vein, maintaining stable blood sugar.",
      "Rutin supports capillary strength and systemic blood flow."
    ],
    "mistakes": [
      "Overcooking until mushy, which degrades the texture and increases the glycemic load.",
      "Neglecting to rinse raw buckwheat groats, which can leave a bitter saponin taste."
    ],
    "proTips": [
      "Cook buckwheat groats with water and a pinch of salt, then mix with blueberries and almonds for a high-performance breakfast.",
      "Use buckwheat flour to make mineral-dense, gluten-free pancakes for pre-workout meals."
    ],
    "conditioning": [
      "Athletic Buckwheat Porridge: Boil 1/2 cup buckwheat groats, stir in 1 scoop vanilla protein, and top with fresh berries."
    ],
    "combinations": [
      {
        "name": "Cardiovascular Support (Buckwheat + Blueberries)",
        "link": "blueberries"
      }
    ],
    "relatedTechniques": [
      "oatmeal",
      "quinoa",
      "blueberries"
    ]
  },
  "pumpkin": {
    "id": "pumpkin",
    image: '/images/foods/pumpkin.jpg',
    "name": "Pumpkin",
    "category": "Macronutrients",
    "difficulty": "beginner",
    "stance": "both",
    "trainingFormat": [
      "roasted",
      "steamed",
      "puree"
    ],
    "muscles": [
      "quadriceps",
      "gluteal",
      "hamstring"
    ],
    "description": "A low-calorie, nutrient-dense squash that provides easily digestible complex carbohydrates, potassium, and beta-carotene. Pumpkin is highly soothing to the digestive tract and supports muscle function and cellular hydration.",
    "whenToUse": "Use in pre-workout meals for light carbohydrate fueling or in recovery meals to replenish electrolytes.",
    "coachingCues": [
      "Roast with a light spray of avocado oil.",
      "Use unsweetened canned pumpkin puree for quick recipes.",
      "Combine with warming spices like ginger and cinnamon."
    ],
    "steps": [
      "Beta-carotene is converted into active Vitamin A in the small intestine.",
      "Potassium ions are absorbed to maintain cellular membrane potential.",
      "Soluble fibers nourish beneficial gut bacteria, promoting digestive comfort."
    ],
    "mistakes": [
      "Consuming sweetened pumpkin pie fillings instead of 100% pure pumpkin.",
      "Boiling pumpkin in excess water, which leaches out valuable potassium and vitamins."
    ],
    "proTips": [
      "Blend pumpkin puree into oatmeal or protein shakes for a creamy, low-calorie nutrient boost.",
      "Roast pumpkin cubes with sea salt and rosemary as a delicious, anti-inflammatory side dish."
    ],
    "conditioning": [
      "Sautéed Power Squash: Sauté 1 cup cubed pumpkin in coconut oil with fresh ginger, baby spinach, and a pinch of pink salt."
    ],
    "combinations": [
      {
        "name": "Anti-Inflammatory Digestion (Pumpkin + Ginger)",
        "link": "ginger"
      }
    ],
    "relatedTechniques": [
      "sweet-potato",
      "ginger",
      "spinach"
    ]
  },
  "rice-cakes": {
    "id": "rice-cakes",
    image: '/images/foods/rice-cakes.jpg',
    "name": "Rice Cakes",
    "category": "Macronutrients",
    "difficulty": "beginner",
    "stance": "both",
    "trainingFormat": [
      "raw",
      "spread",
      "crushed"
    ],
    "muscles": [
      "quadriceps",
      "gluteal",
      "hamstring"
    ],
    "description": "A puffed rice product that serves as an ultra-fast, low-fiber carbohydrate delivery vehicle. Rice cakes are highly digestible and raise insulin quickly, making them an excellent choice for rapid pre-workout energy or post-workout nutrient transport.",
    "whenToUse": "Eat 15-30 minutes before training or immediately after working out.",
    "coachingCues": [
      "Choose plain, unsalted rice cakes to control sodium and sugar.",
      "Top with honey for fast energy, or almond butter for sustained release.",
      "Keep dry and crisp for best digestion."
    ],
    "steps": [
      "Puffed starches are immediately broken down by salivary amylase.",
      "Glucose is rapidly absorbed in the upper digestive tract.",
      "Insulin secretion is stimulated, transporting nutrients into active muscle tissue."
    ],
    "mistakes": [
      "Using flavored rice cakes (like caramel or chocolate) loaded with artificial chemicals and excess sugar.",
      "Relying on rice cakes as a main food source instead of a strategic supplement vehicle."
    ],
    "proTips": [
      "Spread a thin layer of almond butter and sliced banana on 2 rice cakes for an easily digestible pre-fight snack.",
      "Crush rice cakes and mix with whey isolate and water to make a quick, high-glycemic post-workout pudding."
    ],
    "conditioning": [
      "Pre-Workout Speed Stack: 2 brown rice cakes topped with 1 tbsp raw honey and a sprinkle of cinnamon."
    ],
    "combinations": [
      {
        "name": "Fast Glycogen Replenishment (Rice Cakes + Raw Honey)",
        "link": "raw-honey"
      }
    ],
    "relatedTechniques": [
      "raw-honey",
      "banana",
      "whey-isolate"
    ]
  },
  "grass-fed-beef": {
    "id": "grass-fed-beef",
    image: '/images/foods/grass-fed-beef.jpg',
    "name": "Grass-Fed Beef",
    "category": "Macronutrients",
    "difficulty": "beginner",
    "stance": "both",
    "trainingFormat": [
      "grilled",
      "seared",
      "roasted"
    ],
    "muscles": [
      "chest",
      "triceps",
      "biceps",
      "quadriceps",
      "gluteal",
      "upper-back"
    ],
    "description": "A premium, nutrient-dense protein source rich in essential amino acids, heme iron, zinc, natural creatine, and conjugated linoleic acid (CLA). Grass-fed beef supports muscle hypertrophy, testosterone production, and oxygen transport in athletes.",
    "whenToUse": "Eat as part of a main recovery meal, ideally 2-4 hours after intense resistance training.",
    "coachingCues": [
      "Opt for lean cuts like sirloin or flank steak.",
      "Avoid overcooking to preserve healthy fats and prevent tough texture.",
      "Choose grass-finished beef for optimal omega-3 ratios."
    ],
    "steps": [
      "Proteins are broken down in the stomach into polypeptides by pepsin.",
      "Heme iron is absorbed via heme carrier protein 1 (HCP1) with high bioavailability.",
      "Amino acids enter the bloodstream to repair damaged myofibrils."
    ],
    "mistakes": [
      "Buying conventional grain-fed beef, which has a higher ratio of inflammatory omega-6 fatty acids.",
      "Eating heavy beef dishes less than 3 hours before training, which redirects blood flow from muscles to digestion."
    ],
    "proTips": [
      "Marinate flank steak in lime juice and garlic to tenderize the meat and increase iron absorption.",
      "Pair grass-fed beef with broccoli or spinach; the Vitamin C in greens enhances the absorption of the beef's iron."
    ],
    "conditioning": [
      "Iron-Rich Beef Bowl: 150g grilled grass-fed flank steak, served over 1 cup quinoa and a side of steamed spinach."
    ],
    "combinations": [
      {
        "name": "Heme Iron Absorption (Grass-Fed Beef + Spinach)",
        "link": "spinach"
      }
    ],
    "relatedTechniques": [
      "beef-liver",
      "chicken-breast",
      "spinach"
    ]
  },
  "bison": {
    "id": "bison",
    image: '/images/foods/bison.jpg',
    "name": "Bison",
    "category": "Macronutrients",
    "difficulty": "intermediate",
    "stance": "both",
    "trainingFormat": [
      "seared",
      "grilled",
      "stewed"
    ],
    "muscles": [
      "chest",
      "triceps",
      "biceps",
      "quadriceps",
      "gluteal",
      "hamstring"
    ],
    "description": "An exceptionally lean red meat source that is naturally pasture-raised. Bison has less fat and cholesterol than beef but contains higher concentrations of iron, zinc, and B vitamins, making it the ultimate protein source for clean muscle building.",
    "whenToUse": "Eat in post-workout meals or dinner to support muscle recovery and red blood cell production.",
    "coachingCues": [
      "Cook at lower temperatures and for less time than beef, as it is very lean.",
      "Excellent alternative for athletes looking to lower systemic inflammation.",
      "Rich in selenium to combat oxidative stress."
    ],
    "steps": [
      "Muscle fibers are digested into bioavailable amino acids.",
      "Zinc is absorbed via ZIP transporters, promoting testosterone synthesis.",
      "B vitamins act as coenzymes in cellular energy production."
    ],
    "mistakes": [
      "Overcooking bison, which makes the lean meat extremely dry and tough.",
      "Neglecting to let the meat rest after cooking, which causes it to lose its juices."
    ],
    "proTips": [
      "Make bison patties seasoned with sea salt and garlic, and grill to medium-rare for a clean, nutrient-dense burger.",
      "Slow-cook bison chuck roast with root vegetables for an easily digestible, warming winter recovery meal."
    ],
    "conditioning": [
      "Lean Power Bison Burger: 150g grilled bison patty, served on a sprouted grain bun with avocado slices and tomato."
    ],
    "combinations": [
      {
        "name": "Lean Protein & Zinc (Bison + Avocado)",
        "link": "avocado"
      }
    ],
    "relatedTechniques": [
      "grass-fed-beef",
      "chicken-breast",
      "beef-liver"
    ]
  },
  "turkey-breast": {
    "id": "turkey-breast",
    image: '/images/foods/turkey-breast.jpg',
    "name": "Turkey Breast",
    "category": "Macronutrients",
    "difficulty": "beginner",
    "stance": "both",
    "trainingFormat": [
      "roasted",
      "baked",
      "sliced"
    ],
    "muscles": [
      "chest",
      "triceps",
      "biceps",
      "upper-back"
    ],
    "description": "An ultra-lean poultry protein that is exceptionally low in saturated fat and high in tryptophan. Turkey breast provides a clean amino acid profile to support muscle repair while promoting serotonin synthesis for mood and sleep regulation.",
    "whenToUse": "Eat in afternoon or evening recovery meals to support post-workout repair and restorative sleep.",
    "coachingCues": [
      "Bake or roast with herbs like sage and thyme.",
      "Avoid highly processed, sodium-laden deli turkey slices.",
      "Pair with carbohydrates to enhance tryptophan uptake."
    ],
    "steps": [
      "Proteins are hydrolyzed into free amino acids.",
      "Tryptophan competes with other amino acids to cross the blood-brain barrier.",
      "Carbohydrate intake triggers insulin, clearing competing amino acids and allowing tryptophan to enter the brain."
    ],
    "mistakes": [
      "Consuming packaged deli turkey containing sodium nitrites and artificial preservatives.",
      "Overcooking turkey breast until dry, making it difficult to chew and digest."
    ],
    "proTips": [
      "Pair roasted turkey breast with sweet potato in your evening meal; the carbs will help transport tryptophan into the brain to optimize sleep quality.",
      "Slow-roast a whole turkey breast with garlic and rosemary for a delicious, low-fat protein prep for the week."
    ],
    "conditioning": [
      "Sleep & Recover Bowl: 150g roasted turkey breast, 1 cup muscle-loaded mashed sweet potato, and a side of steamed asparagus."
    ],
    "combinations": [
      {
        "name": "Tryptophan & Sleep Support (Turkey Breast + Sweet Potato)",
        "link": "sweet-potato"
      }
    ],
    "relatedTechniques": [
      "chicken-breast",
      "sweet-potato",
      "eggs"
    ]
  },
  "cottage-cheese": {
    "id": "cottage-cheese",
    image: '/images/foods/cottage-cheese.jpg',
    "name": "Cottage Cheese",
    "category": "Macronutrients",
    "difficulty": "beginner",
    "stance": "both",
    "trainingFormat": [
      "raw",
      "blended",
      "spread"
    ],
    "muscles": [
      "chest",
      "triceps",
      "biceps",
      "trapezius",
      "upper-back"
    ],
    "description": "A fresh cheese curd product that is exceptionally rich in micellar casein—a slow-digesting dairy protein. Cottage cheese provides a steady, multi-hour release of amino acids into the bloodstream, making it the premier muscle-sparing food.",
    "whenToUse": "Consume 30-60 minutes before sleep to prevent muscle breakdown during overnight fasting.",
    "coachingCues": [
      "Choose organic, grass-fed, and full-fat or low-fat options.",
      "Avoid cottage cheese with added artificial thickeners or gums.",
      "Blend for a smooth, high-protein cream texture."
    ],
    "steps": [
      "Casein protein clots in the acidic environment of the stomach.",
      "This clot delays gastric emptying, slowing protein digestion.",
      "Amino acids are released gradually over 6-8 hours, maintaining an anabolic state."
    ],
    "mistakes": [
      "Consuming cottage cheese loaded with high-sugar fruit toppings.",
      "Eating cottage cheese right before a workout, as the slow digestion can cause stomach cramping."
    ],
    "proTips": [
      "Blend cottage cheese with a pinch of salt and garlic to use as a healthy, high-protein substitute for sour cream or mayo.",
      "Eat 1 cup of cottage cheese topped with pumpkin seeds before bed for a sustained release of amino acids and magnesium."
    ],
    "conditioning": [
      "Overnight Anabolic Bowl: 1 cup cottage cheese, topped with 1 tbsp pumpkin seeds, 1/2 cup blueberries, and a drizzle of raw honey."
    ],
    "combinations": [
      {
        "name": "Overnight Recovery (Cottage Cheese + Pumpkin Seeds)",
        "link": "pumpkin-seeds"
      }
    ],
    "relatedTechniques": [
      "greek-yogurt",
      "kefir",
      "eggs"
    ]
  },
  "tempeh": {
    "id": "tempeh",
    image: '/images/foods/tempeh.jpg',
    "name": "Tempeh",
    "category": "Macronutrients",
    "difficulty": "intermediate",
    "stance": "both",
    "trainingFormat": [
      "sauteed",
      "baked",
      "steamed"
    ],
    "muscles": [
      "chest",
      "triceps",
      "biceps",
      "quadriceps",
      "gluteal"
    ],
    "description": "A traditional Indonesian soy product made from fermented whole soybeans. The fermentation process breaks down phytic acid and increases the bioavailability of proteins and minerals, offering a complete, gut-friendly plant protein.",
    "whenToUse": "Eat in baseline meals or recovery meals to support muscle synthesis and digestive health.",
    "coachingCues": [
      "Steam tempeh for 10 minutes before cooking to remove bitterness.",
      "Marinate in tamari, garlic, and ginger before baking.",
      "Choose organic, non-GMO tempeh."
    ],
    "steps": [
      "Fermentation by Rhizopus oligosporus breaks down complex soy proteins.",
      "Phytates are reduced, unlocking minerals like iron, calcium, and magnesium.",
      "Isoflavones provide antioxidant support to cardiovascular tissues."
    ],
    "mistakes": [
      "Eating raw, unpasteurized tempeh without cooking, which can cause digestive upset.",
      "Buying pre-marinated commercial tempeh high in processed oils and sodium."
    ],
    "proTips": [
      "Crumble tempeh into a hot skillet with coconut oil and taco seasonings to make a delicious, high-protein plant-based crumble.",
      "Sauté tempeh slices and serve alongside kimchi for a gut-healthy, high-protein recovery meal."
    ],
    "conditioning": [
      "Gut & Muscle Power Stir-Fry: 150g cubed tempeh sautéed in coconut oil, served with broccoli, carrots, and a side of kimchi."
    ],
    "combinations": [
      {
        "name": "Symbiotic Gut & Protein (Tempeh + Kimchi)",
        "link": "kimchi"
      }
    ],
    "relatedTechniques": [
      "tofu",
      "kimchi",
      "lentils"
    ]
  },
  "tofu": {
    "id": "tofu",
    image: '/images/foods/tofu.jpg',
    "name": "Tofu",
    "category": "Macronutrients",
    "difficulty": "beginner",
    "stance": "both",
    "trainingFormat": [
      "baked",
      "sauteed",
      "blended"
    ],
    "muscles": [
      "chest",
      "triceps",
      "biceps",
      "quadriceps"
    ],
    "description": "A bean curd product made by coagulating soy milk and pressing the resulting curds into soft white blocks. Tofu is a low-calorie, low-fat source of complete plant protein that easily absorbs the flavors of other ingredients.",
    "whenToUse": "Use in baseline meals or recovery meals for light, plant-based protein fueling.",
    "coachingCues": [
      "Press tofu to remove excess water before baking or sautéing.",
      "Choose organic, non-GMO extra-firm tofu for cooking.",
      "Use silken tofu for blending into smoothies."
    ],
    "steps": [
      "Soy proteins are digested into essential amino acids.",
      "Calcium (if calcium-set) is absorbed to support bone density and muscle contraction.",
      "Soy isoflavones act as weak phytoestrogens, offering cellular protection."
    ],
    "mistakes": [
      "Not pressing the tofu, which leaves it soggy and prevents it from absorbing marinades.",
      "Deep frying tofu in refined seed oils, destroying its clean profile."
    ],
    "proTips": [
      "Cube extra-firm tofu, toss with nutritional yeast and spices, and bake at 400F for 25 minutes for crispy, high-protein croutons.",
      "Blend silken tofu into fruit smoothies to add creaminess and 10g of clean plant protein without changing the flavor."
    ],
    "conditioning": [
      "Crispy Baked Protein Cubes: Toss 200g cubed tofu in 1 tbsp coconut aminos, 1 tbsp nutritional yeast, and bake until golden."
    ],
    "combinations": [
      {
        "name": "Mineral-Dense Protein (Tofu + Spinach)",
        "link": "spinach"
      }
    ],
    "relatedTechniques": [
      "tempeh",
      "lentils",
      "spinach"
    ]
  },
  "hemp-seeds": {
    "id": "hemp-seeds",
    image: '/images/foods/hemp-seeds.jpg',
    "name": "Hemp Seeds",
    "category": "Macronutrients",
    "difficulty": "beginner",
    "stance": "both",
    "trainingFormat": [
      "raw",
      "sprinkled",
      "blended"
    ],
    "muscles": [
      "chest",
      "triceps",
      "biceps",
      "heart"
    ],
    "description": "The shelled seeds of the hemp plant (hemp hearts). Hemp seeds are a nutritional powerhouse, offering a complete plant protein rich in edestin and albumin, alongside a perfect 3:1 ratio of omega-6 to omega-3 essential fatty acids.",
    "whenToUse": "Sprinkle over meals or blend into shakes daily to support cellular repair and cardiovascular health.",
    "coachingCues": [
      "Store in the refrigerator to prevent the delicate fats from oxidizing.",
      "Eat raw to preserve nutritional value.",
      "Easily digestible with no phytic acid."
    ],
    "steps": [
      "Edestin and albumin proteins are easily digested and absorbed.",
      "Alpha-linolenic acid (ALA) is converted to anti-inflammatory compounds.",
      "Magnesium and zinc are absorbed, promoting muscle relaxation and immunity."
    ],
    "mistakes": [
      "Cooking hemp seeds at high heat, which oxidizes the delicate polyunsaturated fats.",
      "Storing hemp seeds in a warm pantry, causing them to go rancid."
    ],
    "proTips": [
      "Add 3 tablespoons of hemp seeds to your oatmeal or yogurt to instantly add 10g of complete protein and 15g of healthy fats.",
      "Blend hemp seeds with water, a date, and vanilla to make a fresh, mineral-rich homemade hemp milk."
    ],
    "conditioning": [
      "Hemp Powered Oats: Stir 3 tbsp hemp seeds and 1/2 cup fresh blueberries into warm oatmeal post-workout."
    ],
    "combinations": [
      {
        "name": "Superfood Fat & Protein (Hemp Seeds + Oatmeal)",
        "link": "oatmeal"
      }
    ],
    "relatedTechniques": [
      "pumpkin-seeds",
      "oatmeal",
      "blueberries"
    ]
  },
  "almonds": {
    "id": "almonds",
    image: '/images/foods/almonds.jpg',
    "name": "Almonds",
    "category": "Macronutrients",
    "difficulty": "beginner",
    "stance": "both",
    "trainingFormat": [
      "raw",
      "soaked",
      "butter"
    ],
    "muscles": [
      "heart",
      "quadriceps",
      "abs"
    ],
    "description": "A nutrient-dense tree nut rich in monounsaturated fats, Vitamin E, magnesium, and dietary fiber. Almonds support cardiovascular health, reduce muscle soreness, and provide sustained energy for long-duration training.",
    "whenToUse": "Eat as a snack between meals or add to pre/post-workout meals.",
    "coachingCues": [
      "Choose raw, unsalted, or sprouted almonds.",
      "Soak in water overnight to reduce phytic acid and ease digestion.",
      "Limit portion size to 1 handful (approx. 1 oz)."
    ],
    "steps": [
      "Monounsaturated fats are digested and support healthy cholesterol profiles.",
      "Vitamin E (alpha-tocopherol) acts as a powerful fat-soluble antioxidant, protecting cell membranes from exercise-induced oxidative damage.",
      "Magnesium is absorbed, aiding in neuromuscular coordination."
    ],
    "mistakes": [
      "Eating roasted almonds coated in vegetable oils and high amounts of refined salt.",
      "Consuming excessive amounts (more than 2 oz daily), which can lead to unwanted calorie surplus."
    ],
    "proTips": [
      "Soak raw almonds in water for 12 hours before eating; this activates enzymes and makes them much easier on the digestive system.",
      "Use raw almond butter as a healthy fat source in smoothies or spread on banana slices before training."
    ],
    "conditioning": [
      "Almond Recovery Snack: 1 handful of sprouted almonds, 1 sliced apple, and a cup of organic green tea."
    ],
    "combinations": [
      {
        "name": "Antioxidant Recovery (Almonds + Green Tea)",
        "link": "green-tea"
      }
    ],
    "relatedTechniques": [
      "pumpkin-seeds",
      "brazil-nuts",
      "banana"
    ]
  },
  "walnuts": {
    "id": "walnuts",
    image: '/images/foods/walnuts.jpg',
    "name": "Walnuts",
    "category": "Macronutrients",
    "difficulty": "beginner",
    "stance": "both",
    "trainingFormat": [
      "raw",
      "crushed",
      "oil"
    ],
    "muscles": [
      "head",
      "heart",
      "abs"
    ],
    "description": "A unique tree nut containing exceptionally high amounts of alpha-linolenic acid (ALA)—the plant-based omega-3 essential fatty acid. Walnuts support cognitive function, reduce systemic inflammation, and promote vascular health.",
    "whenToUse": "Add to meals daily to support brain health, joint recovery, and cardiovascular function.",
    "coachingCues": [
      "Choose raw, unsalted walnuts with skins intact.",
      "Store in the freezer to keep the polyunsaturated fats fresh.",
      "Eat raw to maximize omega-3 benefit."
    ],
    "steps": [
      "Alpha-linolenic acid is converted in the body into EPA and DHA.",
      "Polyphenols in walnuts act as antioxidants to reduce neural inflammation.",
      "Healthy fats support the structural integrity of cellular membranes."
    ],
    "mistakes": [
      "Eating roasted and heavily salted walnuts, which degrades the delicate ALA fats.",
      "Consuming walnuts that have been sitting in a warm pantry and have developed a bitter, rancid taste."
    ],
    "proTips": [
      "Crush raw walnuts and sprinkle over Greek yogurt or salad to add a satisfying crunch and anti-inflammatory fats.",
      "Combine walnuts and dark chocolate for a delicious, polyphenol-rich brain booster snack."
    ],
    "conditioning": [
      "Brain Booster Snack: 1 handful of raw walnuts, 2 squares of organic dark chocolate (85%+ cacao)."
    ],
    "combinations": [
      {
        "name": "Brain & Vascular Health (Walnuts + Dark Chocolate)",
        "link": "dark-chocolate"
      }
    ],
    "relatedTechniques": [
      "dark-chocolate",
      "pumpkin-seeds",
      "brazil-nuts"
    ]
  },
  "chia-seeds": {
    "id": "chia-seeds",
    image: '/images/foods/chia-seeds.jpg',
    "name": "Chia Seeds",
    "category": "Macronutrients",
    "difficulty": "beginner",
    "stance": "both",
    "trainingFormat": [
      "soaked",
      "gel",
      "raw"
    ],
    "muscles": [
      "abs",
      "heart",
      "quadriceps"
    ],
    "description": "An ancient Aztec seed packed with soluble fiber, omega-3 fatty acids, calcium, and magnesium. Chia seeds absorb up to 12 times their weight in water, creating a mucilaginous gel that prolongs hydration and slows carbohydrate digestion for sustained energy.",
    "whenToUse": "Consume soaked in liquids (chia pudding) before long-duration training or endurance events.",
    "coachingCues": [
      "Always soak chia seeds in water or milk before consuming to avoid dehydration.",
      "Let sit for 15-20 minutes until a gel forms.",
      "Excellent source of anti-inflammatory fats."
    ],
    "steps": [
      "Soluble fibers (mucilage) absorb water, forming a thick gel in the stomach.",
      "This gel slows gastric emptying and the breakdown of carbohydrates, providing steady glucose release.",
      "Calcium and magnesium are slowly absorbed to support muscle contraction and hydration."
    ],
    "mistakes": [
      "Eating dry chia seeds without liquid, which can absorb water from your digestive tract and cause blockages.",
      "Swallowing them whole without letting them gel, which reduces their nutrient digestibility."
    ],
    "proTips": [
      "Make a \"Chia Charger\": Mix 1 tbsp chia seeds in 12 oz water with a squeeze of lemon and honey. Let gel for 20 minutes and drink during long workouts.",
      "Use chia gel as a plant-based egg replacement in high-performance baking."
    ],
    "conditioning": [
      "Sustained Hydration Pudding: Mix 3 tbsp chia seeds with 1 cup unsweetened almond milk and 1/2 tsp vanilla. Refrigerate overnight, top with fresh berries."
    ],
    "combinations": [
      {
        "name": "Endurance & Hydration (Chia Seeds + Coconut Water)",
        "link": "coconut-water"
      }
    ],
    "relatedTechniques": [
      "coconut-water",
      "oatmeal",
      "blueberries"
    ]
  },
  "flax-seeds": {
    "id": "flax-seeds",
    image: '/images/foods/flax-seeds.jpg',
    "name": "Flax Seeds",
    "category": "Macronutrients",
    "difficulty": "beginner",
    "stance": "both",
    "trainingFormat": [
      "ground",
      "soaked",
      "oil"
    ],
    "muscles": [
      "abs",
      "heart",
      "gluteal"
    ],
    "description": "A nutrient-dense seed containing high amounts of soluble fiber, alpha-linolenic acid (ALA), and lignans. Flax seeds support digestion, lower cholesterol, and provide strong antioxidant and anti-inflammatory properties.",
    "whenToUse": "Consume ground flax seeds daily to support cardiovascular and gastrointestinal health.",
    "coachingCues": [
      "Always grind flax seeds; whole seeds pass through the body undigested.",
      "Store ground flax in the refrigerator to prevent oxidation.",
      "Mix with warm water to create a soothing digestive gel."
    ],
    "steps": [
      "Ground flax fibers form a gel that sweeps the colon, promoting regular digestion.",
      "Lignans are converted by gut bacteria into enterolignans, which possess antioxidant effects.",
      "ALA fatty acids are absorbed to help lower blood pressure and systemic inflammation."
    ],
    "mistakes": [
      "Consuming whole flax seeds, which are not absorbed by the digestive system.",
      "Leaving ground flax seeds exposed to light and air, causing the delicate fats to oxidize."
    ],
    "proTips": [
      "Add 2 tablespoons of freshly ground flax seeds to your morning smoothie or oatmeal for a fiber and omega-3 boost.",
      "Mix 1 tbsp ground flax with 3 tbsp warm water to make a \"flax egg\" for egg-free baking."
    ],
    "conditioning": [
      "Digestive Recovery Bowl: Stir 2 tbsp ground flax seeds into 1 cup kefir, topped with a dash of cinnamon."
    ],
    "combinations": [
      {
        "name": "Gut & Heart Health (Flax Seeds + Kefir)",
        "link": "kefir"
      }
    ],
    "relatedTechniques": [
      "kefir",
      "oatmeal",
      "pumpkin-seeds"
    ]
  },
  "extra-virgin-olive-oil": {
    "id": "extra-virgin-olive-oil",
    image: '/images/foods/extra-virgin-olive-oil.jpg',
    "name": "Extra Virgin Olive Oil",
    "category": "Macronutrients",
    "difficulty": "beginner",
    "stance": "both",
    "trainingFormat": [
      "raw",
      "drizzle",
      "low-heat"
    ],
    "muscles": [
      "heart",
      "head",
      "abs"
    ],
    "description": "The cold-pressed juice of olives, rich in oleic acid (monounsaturated fat) and polyphenols like oleocanthal. Extra virgin olive oil is a powerful anti-inflammatory fat that supports heart health, joint integrity, and brain function.",
    "whenToUse": "Drizzle raw over salads, cooked grains, or vegetables daily.",
    "coachingCues": [
      "Use raw; do not heat to high temperatures which destroys polyphenols.",
      "Choose olive oil in dark glass bottles to protect from light.",
      "Look for certified single-origin oils."
    ],
    "steps": [
      "Monounsaturated fatty acids support the health of the endothelial lining of blood vessels.",
      "Oleocanthal inhibits cyclooxygenase (COX) enzymes, mimicking the anti-inflammatory action of ibuprofen.",
      "Polyphenols protect blood lipids from oxidative stress."
    ],
    "mistakes": [
      "Using light or refined olive oils, which are stripped of beneficial antioxidants and polyphenols.",
      "Cooking with extra virgin olive oil at high heat (deep frying), which can exceed its smoke point and create toxic byproducts."
    ],
    "proTips": [
      "Drizzle 1 tablespoon of extra virgin olive oil over your post-workout Jasmine rice and beef to enhance nutrient absorption and joint recovery.",
      "Look for olive oils that produce a peppery sting in the back of the throat; this is a sign of high oleocanthal content."
    ],
    "conditioning": [
      "Mediterranean Recovery Plate: Drizzle 1 tbsp EVOO over steamed broccoli, roasted sweet potatoes, and grilled salmon."
    ],
    "combinations": [
      {
        "name": "Synergistic Joint Recovery (EVOO + Salmon)",
        "link": "salmon"
      }
    ],
    "relatedTechniques": [
      "salmon",
      "broccoli",
      "avocado"
    ]
  },
  "coconut-oil": {
    "id": "coconut-oil",
    image: '/images/foods/coconut-oil.jpg',
    "name": "Coconut Oil",
    "category": "Macronutrients",
    "difficulty": "beginner",
    "stance": "both",
    "trainingFormat": [
      "raw",
      "sauteed",
      "blended"
    ],
    "muscles": [
      "heart",
      "quadriceps",
      "abs"
    ],
    "description": "A saturated fat extracted from coconuts, rich in Medium-Chain Triglycerides (MCTs), particularly lauric acid. MCTs bypass normal fat digestion and are transported directly to the liver, providing a rapid source of clean, ketone-based energy.",
    "whenToUse": "Use as a cooking fat for sautéing or blend into pre-workout beverages for sustained energy.",
    "coachingCues": [
      "Choose organic, virgin, cold-pressed coconut oil.",
      "Use for medium-heat cooking (smoke point 350F).",
      "Excellent energy source for low-carb or ketogenic athletes."
    ],
    "steps": [
      "MCTs are absorbed directly into the portal vein, bypassing the lymphatic system.",
      "In the liver, MCTs are rapidly converted into ketones.",
      "Ketones cross the blood-brain barrier to provide immediate energy to brain and muscle tissues."
    ],
    "mistakes": [
      "Using hydrogenated or refined coconut oil, which contains trans-fats and lacks lauric acid.",
      "Consuming excessive amounts (more than 2 tbsp) in a single serving, which can cause digestive upset."
    ],
    "proTips": [
      "Add 1 teaspoon of virgin coconut oil to your pre-workout black coffee to create a clean, sustained energy booster.",
      "Use coconut oil to sauté sweet potatoes; the medium-chain fats help absorb the sweet potato's beta-carotene."
    ],
    "conditioning": [
      "Ketone Energy Coffee: Blend 8 oz black organic coffee with 1 tsp virgin coconut oil and a pinch of cinnamon."
    ],
    "combinations": [
      {
        "name": "Ketone Pre-Workout (Coconut Oil + Green Tea)",
        "link": "green-tea"
      }
    ],
    "relatedTechniques": [
      "green-tea",
      "sweet-potato",
      "avocado"
    ]
  }
};
