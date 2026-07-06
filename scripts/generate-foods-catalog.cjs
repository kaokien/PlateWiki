const fs = require('fs');
const path = require('path');

// Ensure directories exist
const dataDir = path.join(__dirname, '../src/data');
const foodsDir = path.join(dataDir, 'foods');

if (!fs.existsSync(foodsDir)) {
  fs.mkdirSync(foodsDir, { recursive: true });
}

// 1. Define the new foods by category
const macronutrients = {
  'medjool-dates': {
    id: 'medjool-dates',
    name: 'Medjool Dates',
    category: 'Macronutrients',
    difficulty: 'beginner',
    stance: 'both',
    trainingFormat: ['raw', 'stuffed', 'puree'],
    muscles: ['quadriceps', 'gluteal', 'hamstring', 'calves'],
    description: 'A nutrient-dense stone fruit loaded with easily digestible simple sugars, potassium, and soluble fiber. Medjool dates offer a rapid yet sustained release of carbohydrates, making them a perfect pre-workout glycogen booster for high-intensity training.',
    whenToUse: 'Consume 2-3 Medjool dates 30-45 minutes before a workout or sparring session for quick energy.',
    coachingCues: ['Remove the pit before eating.', 'Combine with a small amount of almond butter to slow sugar absorption.', 'Eat organic and unsulfured.'],
    steps: [
      'Simple sugars (glucose and fructose) are quickly absorbed in the upper intestine via GLUT2 and GLUT5 transporters.',
      'Fructose is processed by the liver to replenish hepatic glycogen stores.',
      'Glucose enters the bloodstream directly, raising blood sugar levels to fuel immediate athletic output.'
    ],
    mistakes: [
      'Eating too many (over 4) right before training, which can cause insulin spikes or mild stomach heaviness.',
      'Consuming with high-fat, high-fiber meals, defeating the purpose of rapid carbohydrate delivery.'
    ],
    proTips: [
      'Stuff dates with a pinch of sea salt and a single almond for a perfect, portable pre-workout snack.',
      'Use date puree as a natural sweetener in homemade energy gels and recovery bars.'
    ],
    conditioning: [
      'Pre-Fight Energy Bites: Blend 10 pitted dates, 1/2 cup walnuts, 1 tbsp cacao powder, and a pinch of pink salt. Roll into balls.'
    ],
    combinations: [{ name: 'Pre-Workout Fuel (Medjool Dates + Almonds)', link: 'almonds' }],
    relatedTechniques: ['banana', 'honey', 'almonds']
  },
  'raw-honey': {
    id: 'raw-honey',
    name: 'Raw Honey',
    category: 'Macronutrients',
    difficulty: 'beginner',
    stance: 'both',
    trainingFormat: ['raw', 'drizzle', 'infusion'],
    muscles: ['quadriceps', 'heart', 'abs'],
    description: 'An unpasteurized, enzyme-rich carbohydrate source produced by bees. Raw honey contains a natural ratio of fructose and glucose, along with organic acids and antioxidants that support metabolic efficiency and decrease training-induced oxidative stress.',
    whenToUse: 'Consume 1 tablespoon 15-30 minutes before high-intensity conditioning or immediately after a workout.',
    coachingCues: ['Do not heat above 110F to preserve active enzymes.', 'Choose local, unfiltered honey for immune support.', 'Ideal for fast intra-workout fueling.'],
    steps: [
      'Enzymes in honey (like diastase) aid in carbohydrate digestion.',
      'Fructose and glucose utilize different intestinal transporters, maximizing overall carbohydrate absorption rates.',
      'Antioxidants scavenge free radicals generated during strenuous muscle contractions.'
    ],
    mistakes: [
      'Buying highly processed, clear honey, which is often diluted with corn syrup and stripped of enzymes.',
      'Heating honey in boiling tea, which denatures its active proteins and beneficial enzymes.'
    ],
    proTips: [
      'Take 1 tablespoon of raw honey with a pinch of pink salt before sparring to sustain endurance and prevent cramping.',
      'Drizzle over oatmeal or blend into post-workout recovery shakes to aid in rapid glycogen replenishment.'
    ],
    conditioning: [
      'Intra-Workout Hydration: Mix 1 tbsp raw honey, 16 oz water, 1 tbsp lemon juice, and 1/4 tsp pink salt.'
    ],
    combinations: [{ name: 'Electrolyte Energy (Raw Honey + Pink Salt)', link: 'pink-salt' }],
    relatedTechniques: ['banana', 'pink-salt', 'coconut-water']
  },
  'jasmine-rice': {
    id: 'jasmine-rice',
    name: 'Jasmine Rice',
    category: 'Macronutrients',
    difficulty: 'beginner',
    stance: 'both',
    trainingFormat: ['steamed', 'boiled'],
    muscles: ['quadriceps', 'gluteal', 'hamstring'],
    description: 'An easily digestible, high-glycemic white rice variety. Jasmine rice contains minimal fiber and fat, allowing for rapid gastric emptying and extremely fast conversion into glucose, which is ideal for replenishing depleted muscle glycogen stores post-exercise.',
    whenToUse: 'Eat as part of a post-workout recovery meal within 1-2 hours of finishing training.',
    coachingCues: ['Rinse before cooking to remove excess surface starch.', 'Combine with a lean protein source like chicken breast.', 'Steam or boil without heavy added oils.'],
    steps: [
      'Highly gelatinized starches are quickly hydrolyzed by pancreatic amylase.',
      'Glucose is absorbed rapidly through SGLT1 transporters in the jejunum.',
      'The resultant insulin spike accelerates glycogen synthesis and amino acid transport into muscle cells.'
    ],
    mistakes: [
      'Eating large portions before training, which can cause a rapid rise and subsequent crash in blood sugar.',
      'Adding excessive fat (like heavy cream or butter) post-workout, which slows down the digestion of carbs and protein.'
    ],
    proTips: [
      'Cook Jasmine rice in bone broth instead of water to add amino acids (glycine) and minerals for joint recovery.',
      'Combine with wild tuna or chicken breast for a clean, classic bodybuilder-style recovery meal.'
    ],
    conditioning: [
      'Recovery Rice Bowl: 1 cup steamed Jasmine rice cooked in chicken bone broth, topped with 150g grilled chicken breast and coconut aminos.'
    ],
    combinations: [{ name: 'Anabolic Recovery (Jasmine Rice + Chicken Breast)', link: 'chicken-breast' }],
    relatedTechniques: ['chicken-breast', 'sweet-potato', 'quinoa']
  },
  'buckwheat': {
    id: 'buckwheat',
    name: 'Buckwheat',
    category: 'Macronutrients',
    difficulty: 'beginner',
    stance: 'both',
    trainingFormat: ['boiled', 'porridge', 'baking'],
    muscles: ['quadriceps', 'hamstring', 'calves'],
    description: 'A gluten-free pseudocereal rich in complex carbohydrates, soluble fiber, and the antioxidant rutin. Buckwheat has a low glycemic index, providing sustained energy release while promoting cardiovascular health and vascular integrity.',
    whenToUse: 'Eat 2-3 hours before endurance workouts or as a baseline carbohydrate source in main meals.',
    coachingCues: ['Toast buckwheat groats (kasha) before boiling for a rich flavor.', 'Excellent alternative for individuals sensitive to gluten.', 'High in magnesium for muscle relaxation.'],
    steps: [
      'Complex starches are slowly broken down by digestive enzymes.',
      'Fiber contents slow glucose release into the portal vein, maintaining stable blood sugar.',
      'Rutin supports capillary strength and systemic blood flow.'
    ],
    mistakes: [
      'Overcooking until mushy, which degrades the texture and increases the glycemic load.',
      'Neglecting to rinse raw buckwheat groats, which can leave a bitter saponin taste.'
    ],
    proTips: [
      'Cook buckwheat groats with water and a pinch of salt, then mix with blueberries and almonds for a high-performance breakfast.',
      'Use buckwheat flour to make mineral-dense, gluten-free pancakes for pre-workout meals.'
    ],
    conditioning: [
      'Athletic Buckwheat Porridge: Boil 1/2 cup buckwheat groats, stir in 1 scoop vanilla protein, and top with fresh berries.'
    ],
    combinations: [{ name: 'Cardiovascular Support (Buckwheat + Blueberries)', link: 'blueberries' }],
    relatedTechniques: ['oatmeal', 'quinoa', 'blueberries']
  },
  'pumpkin': {
    id: 'pumpkin',
    name: 'Pumpkin',
    category: 'Macronutrients',
    difficulty: 'beginner',
    stance: 'both',
    trainingFormat: ['roasted', 'steamed', 'puree'],
    muscles: ['quadriceps', 'gluteal', 'hamstring'],
    description: 'A low-calorie, nutrient-dense squash that provides easily digestible complex carbohydrates, potassium, and beta-carotene. Pumpkin is highly soothing to the digestive tract and supports muscle function and cellular hydration.',
    whenToUse: 'Use in pre-workout meals for light carbohydrate fueling or in recovery meals to replenish electrolytes.',
    coachingCues: ['Roast with a light spray of avocado oil.', 'Use unsweetened canned pumpkin puree for quick recipes.', 'Combine with warming spices like ginger and cinnamon.'],
    steps: [
      'Beta-carotene is converted into active Vitamin A in the small intestine.',
      'Potassium ions are absorbed to maintain cellular membrane potential.',
      'Soluble fibers nourish beneficial gut bacteria, promoting digestive comfort.'
    ],
    mistakes: [
      'Consuming sweetened pumpkin pie fillings instead of 100% pure pumpkin.',
      'Boiling pumpkin in excess water, which leaches out valuable potassium and vitamins.'
    ],
    proTips: [
      'Blend pumpkin puree into oatmeal or protein shakes for a creamy, low-calorie nutrient boost.',
      'Roast pumpkin cubes with sea salt and rosemary as a delicious, anti-inflammatory side dish.'
    ],
    conditioning: [
      'Sautéed Power Squash: Sauté 1 cup cubed pumpkin in coconut oil with fresh ginger, baby spinach, and a pinch of pink salt.'
    ],
    combinations: [{ name: 'Anti-Inflammatory Digestion (Pumpkin + Ginger)', link: 'ginger' }],
    relatedTechniques: ['sweet-potato', 'ginger', 'spinach']
  },
  'rice-cakes': {
    id: 'rice-cakes',
    name: 'Rice Cakes',
    category: 'Macronutrients',
    difficulty: 'beginner',
    stance: 'both',
    trainingFormat: ['raw', 'spread', 'crushed'],
    muscles: ['quadriceps', 'gluteal', 'hamstring'],
    description: 'A puffed rice product that serves as an ultra-fast, low-fiber carbohydrate delivery vehicle. Rice cakes are highly digestible and raise insulin quickly, making them an excellent choice for rapid pre-workout energy or post-workout nutrient transport.',
    whenToUse: 'Eat 15-30 minutes before training or immediately after working out.',
    coachingCues: ['Choose plain, unsalted rice cakes to control sodium and sugar.', 'Top with honey for fast energy, or almond butter for sustained release.', 'Keep dry and crisp for best digestion.'],
    steps: [
      'Puffed starches are immediately broken down by salivary amylase.',
      'Glucose is rapidly absorbed in the upper digestive tract.',
      'Insulin secretion is stimulated, transporting nutrients into active muscle tissue.'
    ],
    mistakes: [
      'Using flavored rice cakes (like caramel or chocolate) loaded with artificial chemicals and excess sugar.',
      'Relying on rice cakes as a main food source instead of a strategic supplement vehicle.'
    ],
    proTips: [
      'Spread a thin layer of almond butter and sliced banana on 2 rice cakes for an easily digestible pre-fight snack.',
      'Crush rice cakes and mix with whey isolate and water to make a quick, high-glycemic post-workout pudding.'
    ],
    conditioning: [
      'Pre-Workout Speed Stack: 2 brown rice cakes topped with 1 tbsp raw honey and a sprinkle of cinnamon.'
    ],
    combinations: [{ name: 'Fast Glycogen Replenishment (Rice Cakes + Raw Honey)', link: 'raw-honey' }],
    relatedTechniques: ['raw-honey', 'banana', 'whey-isolate']
  },
  'grass-fed-beef': {
    id: 'grass-fed-beef',
    name: 'Grass-Fed Beef',
    category: 'Macronutrients',
    difficulty: 'beginner',
    stance: 'both',
    trainingFormat: ['grilled', 'seared', 'roasted'],
    muscles: ['chest', 'triceps', 'biceps', 'quadriceps', 'gluteal', 'upper-back'],
    description: 'A premium, nutrient-dense protein source rich in essential amino acids, heme iron, zinc, natural creatine, and conjugated linoleic acid (CLA). Grass-fed beef supports muscle hypertrophy, testosterone production, and oxygen transport in athletes.',
    whenToUse: 'Eat as part of a main recovery meal, ideally 2-4 hours after intense resistance training.',
    coachingCues: ['Opt for lean cuts like sirloin or flank steak.', 'Avoid overcooking to preserve healthy fats and prevent tough texture.', 'Choose grass-finished beef for optimal omega-3 ratios.'],
    steps: [
      'Proteins are broken down in the stomach into polypeptides by pepsin.',
      'Heme iron is absorbed via heme carrier protein 1 (HCP1) with high bioavailability.',
      'Amino acids enter the bloodstream to repair damaged myofibrils.'
    ],
    mistakes: [
      'Buying conventional grain-fed beef, which has a higher ratio of inflammatory omega-6 fatty acids.',
      'Eating heavy beef dishes less than 3 hours before training, which redirects blood flow from muscles to digestion.'
    ],
    proTips: [
      'Marinate flank steak in lime juice and garlic to tenderize the meat and increase iron absorption.',
      'Pair grass-fed beef with broccoli or spinach; the Vitamin C in greens enhances the absorption of the beef\'s iron.'
    ],
    conditioning: [
      'Iron-Rich Beef Bowl: 150g grilled grass-fed flank steak, served over 1 cup quinoa and a side of steamed spinach.'
    ],
    combinations: [{ name: 'Heme Iron Absorption (Grass-Fed Beef + Spinach)', link: 'spinach' }],
    relatedTechniques: ['beef-liver', 'chicken-breast', 'spinach']
  },
  'bison': {
    id: 'bison',
    name: 'Bison',
    category: 'Macronutrients',
    difficulty: 'intermediate',
    stance: 'both',
    trainingFormat: ['seared', 'grilled', 'stewed'],
    muscles: ['chest', 'triceps', 'biceps', 'quadriceps', 'gluteal', 'hamstring'],
    description: 'An exceptionally lean red meat source that is naturally pasture-raised. Bison has less fat and cholesterol than beef but contains higher concentrations of iron, zinc, and B vitamins, making it the ultimate protein source for clean muscle building.',
    whenToUse: 'Eat in post-workout meals or dinner to support muscle recovery and red blood cell production.',
    coachingCues: ['Cook at lower temperatures and for less time than beef, as it is very lean.', 'Excellent alternative for athletes looking to lower systemic inflammation.', 'Rich in selenium to combat oxidative stress.'],
    steps: [
      'Muscle fibers are digested into bioavailable amino acids.',
      'Zinc is absorbed via ZIP transporters, promoting testosterone synthesis.',
      'B vitamins act as coenzymes in cellular energy production.'
    ],
    mistakes: [
      'Overcooking bison, which makes the lean meat extremely dry and tough.',
      'Neglecting to let the meat rest after cooking, which causes it to lose its juices.'
    ],
    proTips: [
      'Make bison patties seasoned with sea salt and garlic, and grill to medium-rare for a clean, nutrient-dense burger.',
      'Slow-cook bison chuck roast with root vegetables for an easily digestible, warming winter recovery meal.'
    ],
    conditioning: [
      'Lean Power Bison Burger: 150g grilled bison patty, served on a sprouted grain bun with avocado slices and tomato.'
    ],
    combinations: [{ name: 'Lean Protein & Zinc (Bison + Avocado)', link: 'avocado' }],
    relatedTechniques: ['grass-fed-beef', 'chicken-breast', 'beef-liver']
  },
  'turkey-breast': {
    id: 'turkey-breast',
    name: 'Turkey Breast',
    category: 'Macronutrients',
    difficulty: 'beginner',
    stance: 'both',
    trainingFormat: ['roasted', 'baked', 'sliced'],
    muscles: ['chest', 'triceps', 'biceps', 'upper-back'],
    description: 'An ultra-lean poultry protein that is exceptionally low in saturated fat and high in tryptophan. Turkey breast provides a clean amino acid profile to support muscle repair while promoting serotonin synthesis for mood and sleep regulation.',
    whenToUse: 'Eat in afternoon or evening recovery meals to support post-workout repair and restorative sleep.',
    coachingCues: ['Bake or roast with herbs like sage and thyme.', 'Avoid highly processed, sodium-laden deli turkey slices.', 'Pair with carbohydrates to enhance tryptophan uptake.'],
    steps: [
      'Proteins are hydrolyzed into free amino acids.',
      'Tryptophan competes with other amino acids to cross the blood-brain barrier.',
      'Carbohydrate intake triggers insulin, clearing competing amino acids and allowing tryptophan to enter the brain.'
    ],
    mistakes: [
      'Consuming packaged deli turkey containing sodium nitrites and artificial preservatives.',
      'Overcooking turkey breast until dry, making it difficult to chew and digest.'
    ],
    proTips: [
      'Pair roasted turkey breast with sweet potato in your evening meal; the carbs will help transport tryptophan into the brain to optimize sleep quality.',
      'Slow-roast a whole turkey breast with garlic and rosemary for a delicious, low-fat protein prep for the week.'
    ],
    conditioning: [
      'Sleep & Recover Bowl: 150g roasted turkey breast, 1 cup muscle-loaded mashed sweet potato, and a side of steamed asparagus.'
    ],
    combinations: [{ name: 'Tryptophan & Sleep Support (Turkey Breast + Sweet Potato)', link: 'sweet-potato' }],
    relatedTechniques: ['chicken-breast', 'sweet-potato', 'eggs']
  },
  'cottage-cheese': {
    id: 'cottage-cheese',
    name: 'Cottage Cheese',
    category: 'Macronutrients',
    difficulty: 'beginner',
    stance: 'both',
    trainingFormat: ['raw', 'blended', 'spread'],
    muscles: ['chest', 'triceps', 'biceps', 'trapezius', 'upper-back'],
    description: 'A fresh cheese curd product that is exceptionally rich in micellar casein—a slow-digesting dairy protein. Cottage cheese provides a steady, multi-hour release of amino acids into the bloodstream, making it the premier muscle-sparing food.',
    whenToUse: 'Consume 30-60 minutes before sleep to prevent muscle breakdown during overnight fasting.',
    coachingCues: ['Choose organic, grass-fed, and full-fat or low-fat options.', 'Avoid cottage cheese with added artificial thickeners or gums.', 'Blend for a smooth, high-protein cream texture.'],
    steps: [
      'Casein protein clots in the acidic environment of the stomach.',
      'This clot delays gastric emptying, slowing protein digestion.',
      'Amino acids are released gradually over 6-8 hours, maintaining an anabolic state.'
    ],
    mistakes: [
      'Consuming cottage cheese loaded with high-sugar fruit toppings.',
      'Eating cottage cheese right before a workout, as the slow digestion can cause stomach cramping.'
    ],
    proTips: [
      'Blend cottage cheese with a pinch of salt and garlic to use as a healthy, high-protein substitute for sour cream or mayo.',
      'Eat 1 cup of cottage cheese topped with pumpkin seeds before bed for a sustained release of amino acids and magnesium.'
    ],
    conditioning: [
      'Overnight Anabolic Bowl: 1 cup cottage cheese, topped with 1 tbsp pumpkin seeds, 1/2 cup blueberries, and a drizzle of raw honey.'
    ],
    combinations: [{ name: 'Overnight Recovery (Cottage Cheese + Pumpkin Seeds)', link: 'pumpkin-seeds' }],
    relatedTechniques: ['greek-yogurt', 'kefir', 'eggs']
  },
  'tempeh': {
    id: 'tempeh',
    name: 'Tempeh',
    category: 'Macronutrients',
    difficulty: 'intermediate',
    stance: 'both',
    trainingFormat: ['sauteed', 'baked', 'steamed'],
    muscles: ['chest', 'triceps', 'biceps', 'quadriceps', 'gluteal'],
    description: 'A traditional Indonesian soy product made from fermented whole soybeans. The fermentation process breaks down phytic acid and increases the bioavailability of proteins and minerals, offering a complete, gut-friendly plant protein.',
    whenToUse: 'Eat in baseline meals or recovery meals to support muscle synthesis and digestive health.',
    coachingCues: ['Steam tempeh for 10 minutes before cooking to remove bitterness.', 'Marinate in tamari, garlic, and ginger before baking.', 'Choose organic, non-GMO tempeh.'],
    steps: [
      'Fermentation by Rhizopus oligosporus breaks down complex soy proteins.',
      'Phytates are reduced, unlocking minerals like iron, calcium, and magnesium.',
      'Isoflavones provide antioxidant support to cardiovascular tissues.'
    ],
    mistakes: [
      'Eating raw, unpasteurized tempeh without cooking, which can cause digestive upset.',
      'Buying pre-marinated commercial tempeh high in processed oils and sodium.'
    ],
    proTips: [
      'Crumble tempeh into a hot skillet with coconut oil and taco seasonings to make a delicious, high-protein plant-based crumble.',
      'Sauté tempeh slices and serve alongside kimchi for a gut-healthy, high-protein recovery meal.'
    ],
    conditioning: [
      'Gut & Muscle Power Stir-Fry: 150g cubed tempeh sautéed in coconut oil, served with broccoli, carrots, and a side of kimchi.'
    ],
    combinations: [{ name: 'Symbiotic Gut & Protein (Tempeh + Kimchi)', link: 'kimchi' }],
    relatedTechniques: ['tofu', 'kimchi', 'lentils']
  },
  'tofu': {
    id: 'tofu',
    name: 'Tofu',
    category: 'Macronutrients',
    difficulty: 'beginner',
    stance: 'both',
    trainingFormat: ['baked', 'sauteed', 'blended'],
    muscles: ['chest', 'triceps', 'biceps', 'quadriceps'],
    description: 'A bean curd product made by coagulating soy milk and pressing the resulting curds into soft white blocks. Tofu is a low-calorie, low-fat source of complete plant protein that easily absorbs the flavors of other ingredients.',
    whenToUse: 'Use in baseline meals or recovery meals for light, plant-based protein fueling.',
    coachingCues: ['Press tofu to remove excess water before baking or sautéing.', 'Choose organic, non-GMO extra-firm tofu for cooking.', 'Use silken tofu for blending into smoothies.'],
    steps: [
      'Soy proteins are digested into essential amino acids.',
      'Calcium (if calcium-set) is absorbed to support bone density and muscle contraction.',
      'Soy isoflavones act as weak phytoestrogens, offering cellular protection.'
    ],
    mistakes: [
      'Not pressing the tofu, which leaves it soggy and prevents it from absorbing marinades.',
      'Deep frying tofu in refined seed oils, destroying its clean profile.'
    ],
    proTips: [
      'Cube extra-firm tofu, toss with nutritional yeast and spices, and bake at 400F for 25 minutes for crispy, high-protein croutons.',
      'Blend silken tofu into fruit smoothies to add creaminess and 10g of clean plant protein without changing the flavor.'
    ],
    conditioning: [
      'Crispy Baked Protein Cubes: Toss 200g cubed tofu in 1 tbsp coconut aminos, 1 tbsp nutritional yeast, and bake until golden.'
    ],
    combinations: [{ name: 'Mineral-Dense Protein (Tofu + Spinach)', link: 'spinach' }],
    relatedTechniques: ['tempeh', 'lentils', 'spinach']
  },
  'hemp-seeds': {
    id: 'hemp-seeds',
    name: 'Hemp Seeds',
    category: 'Macronutrients',
    difficulty: 'beginner',
    stance: 'both',
    trainingFormat: ['raw', 'sprinkled', 'blended'],
    muscles: ['chest', 'triceps', 'biceps', 'heart'],
    description: 'The shelled seeds of the hemp plant (hemp hearts). Hemp seeds are a nutritional powerhouse, offering a complete plant protein rich in edestin and albumin, alongside a perfect 3:1 ratio of omega-6 to omega-3 essential fatty acids.',
    whenToUse: 'Sprinkle over meals or blend into shakes daily to support cellular repair and cardiovascular health.',
    coachingCues: ['Store in the refrigerator to prevent the delicate fats from oxidizing.', 'Eat raw to preserve nutritional value.', 'Easily digestible with no phytic acid.'],
    steps: [
      'Edestin and albumin proteins are easily digested and absorbed.',
      'Alpha-linolenic acid (ALA) is converted to anti-inflammatory compounds.',
      'Magnesium and zinc are absorbed, promoting muscle relaxation and immunity.'
    ],
    mistakes: [
      'Cooking hemp seeds at high heat, which oxidizes the delicate polyunsaturated fats.',
      'Storing hemp seeds in a warm pantry, causing them to go rancid.'
    ],
    proTips: [
      'Add 3 tablespoons of hemp seeds to your oatmeal or yogurt to instantly add 10g of complete protein and 15g of healthy fats.',
      'Blend hemp seeds with water, a date, and vanilla to make a fresh, mineral-rich homemade hemp milk.'
    ],
    conditioning: [
      'Hemp Powered Oats: Stir 3 tbsp hemp seeds and 1/2 cup fresh blueberries into warm oatmeal post-workout.'
    ],
    combinations: [{ name: 'Superfood Fat & Protein (Hemp Seeds + Oatmeal)', link: 'oatmeal' }],
    relatedTechniques: ['pumpkin-seeds', 'oatmeal', 'blueberries']
  },
  'almonds': {
    id: 'almonds',
    name: 'Almonds',
    category: 'Macronutrients',
    difficulty: 'beginner',
    stance: 'both',
    trainingFormat: ['raw', 'soaked', 'butter'],
    muscles: ['heart', 'quadriceps', 'abs'],
    description: 'A nutrient-dense tree nut rich in monounsaturated fats, Vitamin E, magnesium, and dietary fiber. Almonds support cardiovascular health, reduce muscle soreness, and provide sustained energy for long-duration training.',
    whenToUse: 'Eat as a snack between meals or add to pre/post-workout meals.',
    coachingCues: ['Choose raw, unsalted, or sprouted almonds.', 'Soak in water overnight to reduce phytic acid and ease digestion.', 'Limit portion size to 1 handful (approx. 1 oz).'],
    steps: [
      'Monounsaturated fats are digested and support healthy cholesterol profiles.',
      'Vitamin E (alpha-tocopherol) acts as a powerful fat-soluble antioxidant, protecting cell membranes from exercise-induced oxidative damage.',
      'Magnesium is absorbed, aiding in neuromuscular coordination.'
    ],
    mistakes: [
      'Eating roasted almonds coated in vegetable oils and high amounts of refined salt.',
      'Consuming excessive amounts (more than 2 oz daily), which can lead to unwanted calorie surplus.'
    ],
    proTips: [
      'Soak raw almonds in water for 12 hours before eating; this activates enzymes and makes them much easier on the digestive system.',
      'Use raw almond butter as a healthy fat source in smoothies or spread on banana slices before training.'
    ],
    conditioning: [
      'Almond Recovery Snack: 1 handful of sprouted almonds, 1 sliced apple, and a cup of organic green tea.'
    ],
    combinations: [{ name: 'Antioxidant Recovery (Almonds + Green Tea)', link: 'green-tea' }],
    relatedTechniques: ['pumpkin-seeds', 'brazil-nuts', 'banana']
  },
  'walnuts': {
    id: 'walnuts',
    name: 'Walnuts',
    category: 'Macronutrients',
    difficulty: 'beginner',
    stance: 'both',
    trainingFormat: ['raw', 'crushed', 'oil'],
    muscles: ['head', 'heart', 'abs'],
    description: 'A unique tree nut containing exceptionally high amounts of alpha-linolenic acid (ALA)—the plant-based omega-3 essential fatty acid. Walnuts support cognitive function, reduce systemic inflammation, and promote vascular health.',
    whenToUse: 'Add to meals daily to support brain health, joint recovery, and cardiovascular function.',
    coachingCues: ['Choose raw, unsalted walnuts with skins intact.', 'Store in the freezer to keep the polyunsaturated fats fresh.', 'Eat raw to maximize omega-3 benefit.'],
    steps: [
      'Alpha-linolenic acid is converted in the body into EPA and DHA.',
      'Polyphenols in walnuts act as antioxidants to reduce neural inflammation.',
      'Healthy fats support the structural integrity of cellular membranes.'
    ],
    mistakes: [
      'Eating roasted and heavily salted walnuts, which degrades the delicate ALA fats.',
      'Consuming walnuts that have been sitting in a warm pantry and have developed a bitter, rancid taste.'
    ],
    proTips: [
      'Crush raw walnuts and sprinkle over Greek yogurt or salad to add a satisfying crunch and anti-inflammatory fats.',
      'Combine walnuts and dark chocolate for a delicious, polyphenol-rich brain booster snack.'
    ],
    conditioning: [
      'Brain Booster Snack: 1 handful of raw walnuts, 2 squares of organic dark chocolate (85%+ cacao).'
    ],
    combinations: [{ name: 'Brain & Vascular Health (Walnuts + Dark Chocolate)', link: 'dark-chocolate' }],
    relatedTechniques: ['dark-chocolate', 'pumpkin-seeds', 'brazil-nuts']
  },
  'chia-seeds': {
    id: 'chia-seeds',
    name: 'Chia Seeds',
    category: 'Macronutrients',
    difficulty: 'beginner',
    stance: 'both',
    trainingFormat: ['soaked', 'gel', 'raw'],
    muscles: ['abs', 'heart', 'quadriceps'],
    description: 'An ancient Aztec seed packed with soluble fiber, omega-3 fatty acids, calcium, and magnesium. Chia seeds absorb up to 12 times their weight in water, creating a mucilaginous gel that prolongs hydration and slows carbohydrate digestion for sustained energy.',
    whenToUse: 'Consume soaked in liquids (chia pudding) before long-duration training or endurance events.',
    coachingCues: ['Always soak chia seeds in water or milk before consuming to avoid dehydration.', 'Let sit for 15-20 minutes until a gel forms.', 'Excellent source of anti-inflammatory fats.'],
    steps: [
      'Soluble fibers (mucilage) absorb water, forming a thick gel in the stomach.',
      'This gel slows gastric emptying and the breakdown of carbohydrates, providing steady glucose release.',
      'Calcium and magnesium are slowly absorbed to support muscle contraction and hydration.'
    ],
    mistakes: [
      'Eating dry chia seeds without liquid, which can absorb water from your digestive tract and cause blockages.',
      'Swallowing them whole without letting them gel, which reduces their nutrient digestibility.'
    ],
    proTips: [
      'Make a "Chia Charger": Mix 1 tbsp chia seeds in 12 oz water with a squeeze of lemon and honey. Let gel for 20 minutes and drink during long workouts.',
      'Use chia gel as a plant-based egg replacement in high-performance baking.'
    ],
    conditioning: [
      'Sustained Hydration Pudding: Mix 3 tbsp chia seeds with 1 cup unsweetened almond milk and 1/2 tsp vanilla. Refrigerate overnight, top with fresh berries.'
    ],
    combinations: [{ name: 'Endurance & Hydration (Chia Seeds + Coconut Water)', link: 'coconut-water' }],
    relatedTechniques: ['coconut-water', 'oatmeal', 'blueberries']
  },
  'flax-seeds': {
    id: 'flax-seeds',
    name: 'Flax Seeds',
    category: 'Macronutrients',
    difficulty: 'beginner',
    stance: 'both',
    trainingFormat: ['ground', 'soaked', 'oil'],
    muscles: ['abs', 'heart', 'gluteal'],
    description: 'A nutrient-dense seed containing high amounts of soluble fiber, alpha-linolenic acid (ALA), and lignans. Flax seeds support digestion, lower cholesterol, and provide strong antioxidant and anti-inflammatory properties.',
    whenToUse: 'Consume ground flax seeds daily to support cardiovascular and gastrointestinal health.',
    coachingCues: ['Always grind flax seeds; whole seeds pass through the body undigested.', 'Store ground flax in the refrigerator to prevent oxidation.', 'Mix with warm water to create a soothing digestive gel.'],
    steps: [
      'Ground flax fibers form a gel that sweeps the colon, promoting regular digestion.',
      'Lignans are converted by gut bacteria into enterolignans, which possess antioxidant effects.',
      'ALA fatty acids are absorbed to help lower blood pressure and systemic inflammation.'
    ],
    mistakes: [
      'Consuming whole flax seeds, which are not absorbed by the digestive system.',
      'Leaving ground flax seeds exposed to light and air, causing the delicate fats to oxidize.'
    ],
    proTips: [
      'Add 2 tablespoons of freshly ground flax seeds to your morning smoothie or oatmeal for a fiber and omega-3 boost.',
      'Mix 1 tbsp ground flax with 3 tbsp warm water to make a "flax egg" for egg-free baking.'
    ],
    conditioning: [
      'Digestive Recovery Bowl: Stir 2 tbsp ground flax seeds into 1 cup kefir, topped with a dash of cinnamon.'
    ],
    combinations: [{ name: 'Gut & Heart Health (Flax Seeds + Kefir)', link: 'kefir' }],
    relatedTechniques: ['kefir', 'oatmeal', 'pumpkin-seeds']
  },
  'extra-virgin-olive-oil': {
    id: 'extra-virgin-olive-oil',
    name: 'Extra Virgin Olive Oil',
    category: 'Macronutrients',
    difficulty: 'beginner',
    stance: 'both',
    trainingFormat: ['raw', 'drizzle', 'low-heat'],
    muscles: ['heart', 'head', 'abs'],
    description: 'The cold-pressed juice of olives, rich in oleic acid (monounsaturated fat) and polyphenols like oleocanthal. Extra virgin olive oil is a powerful anti-inflammatory fat that supports heart health, joint integrity, and brain function.',
    whenToUse: 'Drizzle raw over salads, cooked grains, or vegetables daily.',
    coachingCues: ['Use raw; do not heat to high temperatures which destroys polyphenols.', 'Choose olive oil in dark glass bottles to protect from light.', 'Look for certified single-origin oils.'],
    steps: [
      'Monounsaturated fatty acids support the health of the endothelial lining of blood vessels.',
      'Oleocanthal inhibits cyclooxygenase (COX) enzymes, mimicking the anti-inflammatory action of ibuprofen.',
      'Polyphenols protect blood lipids from oxidative stress.'
    ],
    mistakes: [
      'Using light or refined olive oils, which are stripped of beneficial antioxidants and polyphenols.',
      'Cooking with extra virgin olive oil at high heat (deep frying), which can exceed its smoke point and create toxic byproducts.'
    ],
    proTips: [
      'Drizzle 1 tablespoon of extra virgin olive oil over your post-workout Jasmine rice and beef to enhance nutrient absorption and joint recovery.',
      'Look for olive oils that produce a peppery sting in the back of the throat; this is a sign of high oleocanthal content.'
    ],
    conditioning: [
      'Mediterranean Recovery Plate: Drizzle 1 tbsp EVOO over steamed broccoli, roasted sweet potatoes, and grilled salmon.'
    ],
    combinations: [{ name: 'Synergistic Joint Recovery (EVOO + Salmon)', link: 'salmon' }],
    relatedTechniques: ['salmon', 'broccoli', 'avocado']
  },
  'coconut-oil': {
    id: 'coconut-oil',
    name: 'Coconut Oil',
    category: 'Macronutrients',
    difficulty: 'beginner',
    stance: 'both',
    trainingFormat: ['raw', 'sauteed', 'blended'],
    muscles: ['heart', 'quadriceps', 'abs'],
    description: 'A saturated fat extracted from coconuts, rich in Medium-Chain Triglycerides (MCTs), particularly lauric acid. MCTs bypass normal fat digestion and are transported directly to the liver, providing a rapid source of clean, ketone-based energy.',
    whenToUse: 'Use as a cooking fat for sautéing or blend into pre-workout beverages for sustained energy.',
    coachingCues: ['Choose organic, virgin, cold-pressed coconut oil.', 'Use for medium-heat cooking (smoke point 350F).', 'Excellent energy source for low-carb or ketogenic athletes.'],
    steps: [
      'MCTs are absorbed directly into the portal vein, bypassing the lymphatic system.',
      'In the liver, MCTs are rapidly converted into ketones.',
      'Ketones cross the blood-brain barrier to provide immediate energy to brain and muscle tissues.'
    ],
    mistakes: [
      'Using hydrogenated or refined coconut oil, which contains trans-fats and lacks lauric acid.',
      'Consuming excessive amounts (more than 2 tbsp) in a single serving, which can cause digestive upset.'
    ],
    proTips: [
      'Add 1 teaspoon of virgin coconut oil to your pre-workout black coffee to create a clean, sustained energy booster.',
      'Use coconut oil to sauté sweet potatoes; the medium-chain fats help absorb the sweet potato\'s beta-carotene.'
    ],
    conditioning: [
      'Ketone Energy Coffee: Blend 8 oz black organic coffee with 1 tsp virgin coconut oil and a pinch of cinnamon.'
    ],
    combinations: [{ name: 'Ketone Pre-Workout (Coconut Oil + Green Tea)', link: 'green-tea' }],
    relatedTechniques: ['green-tea', 'sweet-potato', 'avocado']
  }
};

const hydration = {
  'celery-juice': {
    id: 'celery-juice',
    name: 'Celery Juice',
    category: 'Hydration & Salts',
    difficulty: 'intermediate',
    stance: 'both',
    trainingFormat: ['raw', 'cold-pressed'],
    muscles: ['abs', 'calves', 'heart'],
    description: 'A highly hydrating, cold-pressed green juice rich in organic sodium, potassium, and cluster salts. Celery juice support gastric acid production, flushes toxins, and restores electrolyte balance to prevent muscle cramping.',
    whenToUse: 'Drink on an empty stomach in the morning or 1 hour before training for deep cellular hydration.',
    coachingCues: ['Drink fresh and raw; do not pasteurize.', 'Drink pure celery juice without diluting with other juices.', 'Consume immediately after juicing to prevent oxidation.'],
    steps: [
      'Natural mineral salts support the restoration of the stomach\'s hydrochloric acid.',
      'Organic sodium and potassium regulate cellular fluid balance and blood pressure.',
      'Antioxidants help calm systemic inflammation in the digestive tract.'
    ],
    mistakes: [
      'Buying store-bought, pasteurized celery juices that have lost their active enzymes and vitamin content.',
      'Adding high-sugar fruits (like apples or pineapples) which spikes insulin and dilutes the digestive benefits.'
    ],
    proTips: [
      'Drink 12-16 oz of fresh celery juice on an empty stomach in the morning to optimize digestion and reduce bloating.',
      'Juice raw celery with a small slice of fresh ginger to add a powerful anti-inflammatory and digestion-boosting kick.'
    ],
    conditioning: [
      'Pure Celery Hydrator: Juice 1 bunch of organic celery stalks. Drink immediately on an empty stomach.'
    ],
    combinations: [{ name: 'Anti-Inflammatory Hydration (Celery Juice + Ginger)', link: 'ginger' }],
    relatedTechniques: ['coconut-water', 'pink-salt', 'ginger']
  },
  'cucumber': {
    id: 'cucumber',
    name: 'Cucumber',
    category: 'Hydration & Salts',
    difficulty: 'beginner',
    stance: 'both',
    trainingFormat: ['raw', 'sliced', 'juiced'],
    muscles: ['calves', 'quadriceps', 'abs'],
    description: 'A refreshing vegetable containing 95% water, alongside silica, potassium, and magnesium. Cucumber provides excellent low-calorie hydration and supports joint, skin, and connective tissue recovery in athletes.',
    whenToUse: 'Eat raw as a hydrating snack, add to salads, or juice before and after training.',
    coachingCues: ['Eat with the skin on for extra silica and fiber.', 'Choose organic cucumbers to avoid pesticide residues on the skin.', 'Sprinkle with pink salt for an electrolyte boost.'],
    steps: [
      'High water content provides immediate cellular hydration.',
      'Silica acts as an essential trace mineral to support collagen synthesis in joints.',
      'Potassium and magnesium help regulate fluid balance and prevent cramping.'
    ],
    mistakes: [
      'Peeling the skin off conventional cucumbers, which strips away the majority of the silica and fiber.',
      'Eating cucumbers that are soft and yellowing, indicating they have lost their moisture and nutrients.'
    ],
    proTips: [
      'Slice a whole cucumber, sprinkle with pink salt and lime juice, for a low-calorie, mineral-rich pre-workout hydration snack.',
      'Juice cucumber with lemon and mint for a refreshing, cooling intra-workout drink.'
    ],
    conditioning: [
      'Hydrating Cucumber Salad: Slice 1 cucumber, toss with 1 tsp olive oil, apple cider vinegar, and a pinch of pink salt.'
    ],
    combinations: [{ name: 'Electrolyte Replenishment (Cucumber + Pink Salt)', link: 'pink-salt' }],
    relatedTechniques: ['pink-salt', 'coconut-water', 'celery-juice']
  },
  'mineral-water': {
    id: 'mineral-water',
    name: 'Mineral Water',
    category: 'Hydration & Salts',
    difficulty: 'beginner',
    stance: 'both',
    trainingFormat: ['sparkling', 'still'],
    muscles: ['calves', 'quadriceps', 'heart'],
    description: 'Natural water sourced from underground springs, naturally rich in minerals like calcium, magnesium, and bicarbonate. Mineral water offers highly bioavailable trace minerals to support hydration, bone strength, and muscle function.',
    whenToUse: 'Drink throughout the day and during/after workouts to maintain electrolyte balance.',
    coachingCues: ['Choose water bottled in glass to avoid plastic microparticles.', 'Look for high TDS (Total Dissolved Solids) ratings for more minerals.', 'Bicarbonates help buffer lactic acid.'],
    steps: [
      'Calcium and magnesium ions are absorbed in the small intestine with high bioavailability.',
      'Bicarbonate ions help buffer systemic acidity, including exercise-induced lactic acid.',
      'Fluid volume is restored, maintaining blood pressure and cardiovascular output.'
    ],
    mistakes: [
      'Drinking purified tap waters stripped of all natural minerals.',
      'Relying solely on plain water without electrolytes during heavy sweating, which can lead to hyponatremia.'
    ],
    proTips: [
      'Choose high-mineral sparkling waters (like Gerolsteiner) which contain over 2,500mg of TDS per liter to naturally replenish electrolytes without sugar.',
      'Add a squeeze of lemon and a pinch of pink salt to mineral water for the ultimate clean sports drink.'
    ],
    conditioning: [
      'Electrolyte Buffer: 16 oz sparkling mineral water, a squeeze of fresh lime, and 1/8 tsp pink salt. Drink during training.'
    ],
    combinations: [{ name: 'Lactic Acid Buffer (Mineral Water + Pink Salt)', link: 'pink-salt' }],
    relatedTechniques: ['pink-salt', 'coconut-water', 'celery-juice']
  },
  'pickle-juice': {
    id: 'pickle-juice',
    name: 'Pickle Juice',
    category: 'Hydration & Salts',
    difficulty: 'intermediate',
    stance: 'both',
    trainingFormat: ['raw-shot'],
    muscles: ['calves', 'hamstring', 'quadriceps'],
    description: 'The briny, high-sodium liquid from fermented pickles. Pickle juice contains high concentrations of sodium chloride, vinegar, and potassium, which triggers a reflex in the throat that halts muscle cramps in seconds.',
    whenToUse: 'Take a 2 oz shot immediately at the onset of muscle cramps during intense training or competition.',
    coachingCues: ['Use juice from naturally fermented pickles, not vinegar-brined.', 'Drink straight as a shot; do not dilute.', 'Keep a small bottle in your gym bag for emergencies.'],
    steps: [
      'Acidic vinegar triggers receptors in the back of the throat.',
      'This sends a sensory signal that shuts down alpha motor neuron activity, instantly releasing the muscle cramp.',
      'Sodium and potassium are absorbed to restore electrolyte balance in the blood.'
    ],
    mistakes: [
      'Drinking pickle juice made with artificial yellow dyes and preservatives.',
      'Using it as daily hydration instead of water; it is too high in sodium for general drinking.'
    ],
    proTips: [
      'Drink 2 oz of pickle juice 15 minutes before a long, hot endurance run to preemptively prevent cramping.',
      'Save the juice from your sauerkraut or fermented pickles; it is packed with active probiotics and electrolytes.'
    ],
    conditioning: [
      'Cramp-Relief Shot: 2 oz of chilled fermented pickle juice, taken immediately when a cramp occurs.'
    ],
    combinations: [{ name: 'Instant Cramp Release (Pickle Juice + Pink Salt)', link: 'pink-salt' }],
    relatedTechniques: ['pink-salt', 'coconut-water', 'sauerkraut']
  }
};

const micronutrients = {
  'kale': {
    id: 'kale',
    name: 'Kale',
    category: 'Micronutrients',
    difficulty: 'beginner',
    stance: 'both',
    trainingFormat: ['steamed', 'raw-massaged', 'baked'],
    muscles: ['heart', 'quadriceps', 'gluteal'],
    description: 'A nutrient-dense cruciferous leafy green loaded with Vitamin K, Vitamin A, Vitamin C, calcium, and antioxidants like lutein. Kale supports cardiovascular health, bone density, and immune defense in athletes.',
    whenToUse: 'Eat in daily baseline meals, lightly steamed or massaged with olive oil to maximize absorption.',
    coachingCues: ['Remove the tough woody stems before eating.', 'Massage raw kale with olive oil and lemon juice to break down tough fibers.', 'Steam lightly to preserve nutrients and reduce goitrogens.'],
    steps: [
      'Vitamin K1 is absorbed in the small intestine, assisting in blood clotting and bone mineralization.',
      'Lutein and zeaxanthin are absorbed, supporting vision and cognitive function.',
      'Glucosinolates are broken down into isothiocyanates, aiding in cellular detoxification.'
    ],
    mistakes: [
      'Eating raw kale in massive quantities without breaking down the fibers, leading to bloating and gas.',
      'Throwing kale into a high-heat fry, which degrades the Vitamin C and delicate antioxidants.'
    ],
    proTips: [
      'Massage raw kale with extra virgin olive oil and avocado for 5 minutes; this makes the leaves tender and highly digestible.',
      'Toss kale leaves with olive oil and sea salt, and bake at 350F for 15 minutes to make crispy, mineral-dense kale chips.'
    ],
    conditioning: [
      'Massaged Green Salad: 2 cups massaged kale, 1 tbsp olive oil, 1 tbsp lemon juice, topped with pumpkin seeds.'
    ],
    combinations: [{ name: 'Vitamins & Minerals (Kale + Extra Virgin Olive Oil)', link: 'extra-virgin-olive-oil' }],
    relatedTechniques: ['spinach', 'broccoli', 'pumpkin-seeds']
  },
  'asparagus': {
    id: 'asparagus',
    name: 'Asparagus',
    category: 'Micronutrients',
    difficulty: 'beginner',
    stance: 'both',
    trainingFormat: ['roasted', 'steamed', 'grilled'],
    muscles: ['abs', 'calves', 'heart'],
    description: 'A nutrient-dense spring vegetable rich in folate, chromium, Vitamin K, and the amino acid asparagine. Asparagus acts as a mild natural diuretic, helping to flush excess water and support kidney function and nutrient delivery.',
    whenToUse: 'Eat in recovery meals, particularly during weight-cutting phases or post-fight recovery.',
    coachingCues: ['Snap off the woody bottom ends before cooking.', 'Roast with garlic and olive oil to enhance nutrient absorption.', 'Do not overcook; keep a slight crunch.'],
    steps: [
      'Asparagine stimulates kidney function, promoting the excretion of excess water and sodium.',
      'Folate is absorbed to support cellular division and DNA repair.',
      'Chromium assists insulin in transporting glucose into cells.'
    ],
    mistakes: [
      'Overcooking asparagus until mushy and limp, which destroys its folate content.',
      'Smothering in heavy, processed sauces that add unnecessary fats and chemicals.'
    ],
    proTips: [
      'Asparagus is a premier vegetable during weight cuts due to its natural diuretic properties, helping to shed subcutaneous water safely.',
      'Roast asparagus with a drizzle of extra virgin olive oil and a sprinkle of pink salt for a delicious, recovery-focused side dish.'
    ],
    conditioning: [
      'Roasted Recovery Asparagus: Roast 1 bunch of asparagus with 1 tbsp olive oil, minced garlic, and pink salt at 400F for 10 minutes.'
    ],
    combinations: [{ name: 'Diuretic Weight Cut Support (Asparagus + Pink Salt)', link: 'pink-salt' }],
    relatedTechniques: ['broccoli', 'sweet-peppers', 'spinach']
  },
  'oysters': {
    id: 'oysters',
    name: 'Oysters',
    category: 'Micronutrients',
    difficulty: 'advanced',
    stance: 'both',
    trainingFormat: ['raw', 'steamed', 'canned'],
    muscles: ['chest', 'triceps', 'biceps', 'quadriceps', 'gluteal'],
    description: 'A marine bivalve mollusk that contains the highest natural concentration of zinc of any food, alongside Vitamin B12, selenium, and copper. Oysters are the ultimate hormone support food, optimizing testosterone synthesis and immune function.',
    whenToUse: 'Consume weekly to maintain testosterone levels, support thyroid function, and boost immune health.',
    coachingCues: ['Eat fresh raw oysters from reputable sources, or high-quality canned options.', 'Add lemon juice to enhance zinc absorption with Vitamin C.', 'Avoid eating cooked oysters that did not open.'],
    steps: [
      'Zinc is absorbed in the small intestine, acting as a crucial cofactor for testosterone synthesis and immune cell development.',
      'Vitamin B12 is absorbed via intrinsic factor, supporting nerve function and red blood cell production.',
      'Selenium supports the conversion of thyroid hormones, regulating metabolic rate.'
    ],
    mistakes: [
      'Eating raw oysters from questionable sources, risking foodborne illness.',
      'Consuming heavily battered and deep-fried oysters, which destroys their clean micronutrient profile.'
    ],
    proTips: [
      'Eat 3-4 fresh raw oysters weekly; this provides over 400% of your daily zinc needs to naturally support male and female hormone levels.',
      'Canned smoked oysters packed in olive oil are a fantastic, portable, zinc-dense snack for busy training days.'
    ],
    conditioning: [
      'Hormone Support Plate: 6 raw oysters served with fresh lemon wedges, alongside a side of steamed spinach.'
    ],
    combinations: [{ name: 'Zinc & Iron Optimization (Oysters + Spinach)', link: 'spinach' }],
    relatedTechniques: ['beef-liver', 'salmon', 'sardines']
  },
  'garlic': {
    id: 'garlic',
    name: 'Garlic',
    category: 'Micronutrients',
    difficulty: 'beginner',
    stance: 'both',
    trainingFormat: ['raw-crushed', 'sauteed', 'roasted'],
    muscles: ['heart', 'head', 'abs'],
    description: 'A pungent bulb containing the sulfur compound allicin. Garlic is a potent natural antimicrobial, immunomodulator, and vasodilator, supporting cardiovascular health and defending against training-related infections.',
    whenToUse: 'Consume raw-crushed or cooked daily in main meals to boost immunity and cardiovascular endurance.',
    coachingCues: ['Crush or chop garlic and let sit for 10 minutes before cooking to activate allicin.', 'Eat raw for maximum immune benefit.', 'Cook lightly to preserve therapeutic properties.'],
    steps: [
      'Allicin is formed when garlic is crushed, converting alliin to active allicin via the enzyme alliinase.',
      'Allicin relaxes blood vessels and increases nitric oxide production, improving blood flow.',
      'Sulfur compounds stimulate white blood cell production, boosting immune defense.'
    ],
    mistakes: [
      'Cooking garlic immediately after chopping without letting it rest, which prevents allicin from forming.',
      'Using processed garlic powders, which contain very little active allicin.'
    ],
    proTips: [
      'If you feel a cold coming on from heavy training, crush 1 clove of raw garlic, mix with a tsp of raw honey, and swallow.',
      'Rub a cut garlic clove over roasted sprouted bread before drizzling with olive oil for a simple, heart-healthy pre-workout toast.'
    ],
    conditioning: [
      'Immune Booster Tea: Steep 1 crushed garlic clove, 1 inch sliced ginger, and 1 tbsp lemon juice in hot water. Stir in honey.'
    ],
    combinations: [{ name: 'Immune & Circulation Synergy (Garlic + Ginger)', link: 'ginger' }],
    relatedTechniques: ['ginger', 'raw-honey', 'turmeric']
  },
  'pomegranate': {
    id: 'pomegranate',
    name: 'Pomegranate',
    category: 'Micronutrients',
    difficulty: 'beginner',
    stance: 'both',
    trainingFormat: ['raw-seeds', 'cold-pressed-juice'],
    muscles: ['heart', 'quadriceps', 'gluteal'],
    description: 'A ruby-red fruit packed with punicalagins, anthocyanins, and dietary nitrates. Pomegranate is a premier pre-workout food, boosting nitric oxide synthesis to enhance muscle blood flow and reduce post-exercise muscle soreness.',
    whenToUse: 'Consume 200-250ml of pure pomegranate juice 1-2 hours before training, or eat seeds in baseline meals.',
    coachingCues: ['Choose 100% pure, unsweetened pomegranate juice.', 'Eat the seeds (arils) raw for extra dietary fiber.', 'Avoid juice blends containing high-fructose corn syrup.'],
    steps: [
      'Punicalagins act as powerful antioxidants, protecting nitric oxide from oxidative destruction.',
      'Nitrates are converted to nitrite and then active nitric oxide in the bloodstream.',
      'Nitric oxide induces vasodilation, increasing oxygen delivery to active muscles.'
    ],
    mistakes: [
      'Drinking cheap pomegranate juice blends that are mostly apple or grape juice and loaded with sugar.',
      'Spitting out the pomegranate seed center; the seed contains fiber and anti-inflammatory oils.'
    ],
    proTips: [
      'Drink 8 oz of pure pomegranate juice pre-workout for a natural pump and cardiovascular endurance booster.',
      'Sprinkle pomegranate arils over Greek yogurt or oatmeal for a burst of color, texture, and polyphenols.'
    ],
    conditioning: [
      'Nitric Oxide Recovery Bowl: 1 cup Greek yogurt topped with 1/2 cup pomegranate arils, walnuts, and honey.'
    ],
    combinations: [{ name: 'Cardiovascular Nitric Oxide (Pomegranate + Walnuts)', link: 'walnuts' }],
    relatedTechniques: ['beetroot-juice', 'blueberries', 'tart-cherry-juice']
  },
  'tomatoes': {
    id: 'tomatoes',
    name: 'Tomatoes',
    category: 'Micronutrients',
    difficulty: 'beginner',
    stance: 'both',
    trainingFormat: ['raw', 'cooked-sauce', 'roasted'],
    muscles: ['heart', 'abs', 'head'],
    description: 'A vibrant red fruit rich in lycopene, Vitamin C, and potassium. Lycopene is a powerful fat-soluble antioxidant that supports prostate health, skin protection against UV rays, and reduces cardiovascular inflammation.',
    whenToUse: 'Eat cooked or raw daily in baseline meals to support heart health and reduce systemic inflammation.',
    coachingCues: ['Cook tomatoes with a healthy fat like olive oil to increase lycopene absorption.', 'Choose organic vine-ripened tomatoes for maximum nutrients.', 'Eat skins and seeds for extra fiber.'],
    steps: [
      'Lycopene is released from plant cell walls more effectively when heated.',
      'Dietary fats package lycopene into micelles for absorption in the small intestine.',
      'Lycopene accumulates in prostate, liver, and skin tissues, offering antioxidant defense.'
    ],
    mistakes: [
      'Eating tomatoes completely raw without fat, which minimizes lycopene bioavailability.',
      'Using processed tomato sauces with added refined sugar and inflammatory seed oils.'
    ],
    proTips: [
      'Simmer crushed tomatoes with minced garlic and extra virgin olive oil to make a highly bioavailable, anti-inflammatory sauce.',
      'Pair raw cherry tomatoes with avocado slices for an easy, fat-soluble nutrient snack.'
    ],
    conditioning: [
      'Lycopene Rich Salad: Toss 1 cup cherry tomatoes, 1 sliced avocado, fresh basil, and 1 tbsp olive oil with pink salt.'
    ],
    combinations: [{ name: 'Lycopene Bioavailability (Tomatoes + EVOO)', link: 'extra-virgin-olive-oil' }],
    relatedTechniques: ['extra-virgin-olive-oil', 'avocado', 'spinach']
  }
};

const gut = {
  'kombucha': {
    id: 'kombucha',
    name: 'Kombucha',
    category: 'Gut & Digestion',
    difficulty: 'intermediate',
    stance: 'both',
    trainingFormat: ['raw-beverage'],
    muscles: ['abs', 'heart', 'head'],
    description: 'A fermented, sparkling black or green tea beverage produced by a symbiotic culture of bacteria and yeast (SCOBY). Kombucha is rich in active probiotics, organic acids, and enzymes, supporting gut barrier integrity, joint health, and metabolic recovery.',
    whenToUse: 'Drink 4-8 oz between meals or post-workout to support digestive function.',
    coachingCues: ['Choose raw, unpasteurized kombucha with low sugar (less than 6g per serving).', 'Do not shake the bottle before opening.', 'Drink chilled for best flavor.'],
    steps: [
      'Probiotic strains (like Acetobacter) colonize the intestinal mucosal layer.',
      'Organic acids lower gut pH, inhibiting the growth of pathogenic bacteria.',
      'Antioxidants from tea (like EGCG) reduce gut-level oxidative stress.'
    ],
    mistakes: [
      'Buying highly commercialized kombuchas that are pasteurized (killing the probiotics) and loaded with added sugar.',
      'Drinking a whole bottle (16 oz) at once if you are new to fermented foods, which can cause mild bloating.'
    ],
    proTips: [
      'Drink a small glass of ginger kombucha after a heavy protein meal to stimulate digestion and prevent post-meal sluggishness.',
      'Replace sugary sodas or alcohol with raw kombucha for a healthy, gut-supporting alternative.'
    ],
    conditioning: [
      'Gut Refreshing Drink: Pour 6 oz raw ginger kombucha over ice, with a squeeze of fresh lime juice.'
    ],
    combinations: [{ name: 'Digestive Stimulation (Kombucha + Ginger)', link: 'ginger' }],
    relatedTechniques: ['kefir', 'ginger', 'sauerkraut']
  },
  'natto': {
    id: 'natto',
    name: 'Natto',
    category: 'Gut & Digestion',
    difficulty: 'advanced',
    stance: 'both',
    trainingFormat: ['raw-fermented'],
    muscles: ['heart', 'quadriceps', 'gluteal', 'chest'],
    description: 'A traditional Japanese food made from fermented soybeans. Natto is exceptionally rich in Vitamin K2 (menaquinone-7) and the enzyme nattokinase, offering unparalleled support for bone mineralization and cardiovascular circulation by preventing arterial calcification.',
    whenToUse: 'Eat as a high-performance baseline food, ideally mixed with rice in morning or evening meals.',
    coachingCues: ['Stir vigorously with chopsticks to create a sticky, stringy mucilage before eating.', 'Combine with hot rice, mustard, and green onions.', 'Acknowledge the strong, ammonia-like aroma and slimy texture.'],
    steps: [
      'Fermentation by Bacillus subtilis var. natto produces the active enzyme nattokinase.',
      'Nattokinase breaks down fibrin in blood vessels, promoting healthy blood flow and preventing clots.',
      'Vitamin K2 activates osteocalcin and matrix Gla protein (MGP), directing calcium into bones and away from arteries.'
    ],
    mistakes: [
      'Heating natto to high temperatures, which deactivates the heat-sensitive nattokinase enzyme.',
      'Avoiding natto solely due to its strong smell; it is one of the most powerful functional foods on the planet.'
    ],
    proTips: [
      'Eat 1 serving (approx. 50g) of natto daily to get your entire requirement of Vitamin K2 for bone and cardiovascular health.',
      'Mix natto with warm Jasmine rice, a raw egg yolk, and chopped green onions for a traditional, high-performance Japanese meal.'
    ],
    conditioning: [
      'Ultimate Circulation Bowl: Mix 1 pack of natto, 1 cup warm Jasmine rice, 1 raw pasture-raised egg yolk, and sliced green onions.'
    ],
    combinations: [{ name: 'Bone Mineralization (Natto + Jasmine Rice)', link: 'jasmine-rice' }],
    relatedTechniques: ['eggs', 'jasmine-rice', 'kefir']
  },
  'peppermint': {
    id: 'peppermint',
    name: 'Peppermint',
    category: 'Gut & Digestion',
    difficulty: 'beginner',
    stance: 'both',
    trainingFormat: ['tea-infusion', 'fresh-leaves', 'oil'],
    muscles: ['abs', 'head'],
    description: 'An aromatic herb rich in the active compound menthol. Peppermint acts as a natural antispasmodic, relaxing the smooth muscle of the gastrointestinal tract to relieve bloating, gas, and training-induced gut cramps.',
    whenToUse: 'Drink as a warm tea infusion after large meals or 1 hour before a heavy workout to settle the stomach.',
    coachingCues: ['Steep fresh or dried peppermint leaves covered for 10 minutes to trap essential oils.', 'Excellent caffeine-free soothing drink.', 'Avoid if you suffer from acid reflux (GERD), as it relaxes the esophageal sphincter.'],
    steps: [
      'Menthol blocks calcium channels in the smooth muscle cells of the gut.',
      'This induces relaxation of the intestinal wall, relieving spasms and cramping.',
      'Bile flow is stimulated, promoting the digestion and assimilation of dietary fats.'
    ],
    mistakes: [
      'Drinking commercial peppermint teas containing artificial flavorings and low-quality dust.',
      'Drinking right before bed if you have active acid reflux, as it can worsen heartburn.'
    ],
    proTips: [
      'Drink a cup of hot peppermint tea after a high-fat recovery meal to accelerate digestion and prevent stomach heaviness.',
      'Inhale peppermint essential oil before training; the menthol stimulates the respiratory center and increases alertness.'
    ],
    conditioning: [
      'Digestive Soothing Tea: Steep 2 tbsp organic peppermint leaves in 10 oz boiling water for 10 minutes. Drink warm.'
    ],
    combinations: [{ name: 'Gut Spasm Relief (Peppermint + Ginger)', link: 'ginger' }],
    relatedTechniques: ['ginger', 'acv', 'green-tea']
  },
  'fennel': {
    id: 'fennel',
    name: 'Fennel',
    category: 'Gut & Digestion',
    difficulty: 'beginner',
    stance: 'both',
    trainingFormat: ['raw-sliced', 'roasted', 'seeds'],
    muscles: ['abs', 'heart'],
    description: 'A highly aromatic root vegetable and spice containing anethole. Fennel is a premier carminative, helping to eliminate intestinal gas, stimulate digestive enzymes, and relax gastrointestinal muscles.',
    whenToUse: 'Chew fennel seeds after meals, or include roasted/raw fennel bulb in baseline recovery meals.',
    coachingCues: ['Slice raw fennel bulb thinly for salads.', 'Chew a pinch of fennel seeds after eating to freshen breath and aid digestion.', 'Roast fennel with olive oil and sea salt for a sweet flavor.'],
    steps: [
      'Anethole reduces gut spasms and inflammation.',
      'Dietary fibers increase stool bulk and support bowel motility.',
      'Active enzymes in seeds assist in breaking down food molecules.'
    ],
    mistakes: [
      'Avoiding fennel due to its distinct licorice/anise flavor.',
      'Discarding the green fennel fronds, which are packed with Vitamin C and potassium.'
    ],
    proTips: [
      'Keep a small container of organic fennel seeds in your kitchen; chew 1/2 tsp of seeds after a heavy meal to instantly ease digestion.',
      'Shave raw fennel bulb, toss with orange slices and olive oil, for a refreshing, anti-inflammatory side dish.'
    ],
    conditioning: [
      'Mediterranean Gut Salad: Shaved fennel bulb, sliced cucumber, mint leaves, tossed in EVOO and apple cider vinegar.'
    ],
    combinations: [{ name: 'Gut Motility (Fennel + EVOO)', link: 'extra-virgin-olive-oil' }],
    relatedTechniques: ['extra-virgin-olive-oil', 'cucumber', 'ginger']
  }
};

const superfoods = {
  'matcha': {
    id: 'matcha',
    name: 'Matcha Green Tea',
    category: 'Superfoods & Adaptogens',
    difficulty: 'intermediate',
    stance: 'both',
    trainingFormat: ['whisked-tea', 'latte', 'smoothie'],
    muscles: ['head', 'heart', 'abs'],
    description: 'A finely ground powder of specially grown green tea leaves. Matcha is rich in L-Theanine and Epigallocatechin Gallate (EGCG), providing a calm, focused energy boost (sustained caffeine release) and strong metabolic support.',
    whenToUse: 'Drink 30-60 minutes before training for clean, jitter-free focus and thermogenic fat oxidation.',
    coachingCues: ['Whisk with warm water (not boiling) in a W-shaped motion.', 'Choose ceremonial grade for drinking, culinary grade for baking.', 'Avoid adding processed sugars or dairy milk, which can reduce antioxidant absorption.'],
    steps: [
      'L-Theanine crosses the blood-brain barrier, increasing alpha brain waves for relaxed alertness.',
      'Caffeine binds to adenosine receptors, preventing fatigue without the rapid spike of coffee.',
      'EGCG acts as a powerful antioxidant, stimulating fat metabolism via catechol-O-methyltransferase inhibition.'
    ],
    mistakes: [
      'Using boiling water (over 180F) which burns the matcha, making it bitter and destroying antioxidants.',
      'Buying cheap matcha mixes containing added sugar and milk solids.'
    ],
    proTips: [
      'Whisk ceremonial matcha with hot water and drink 45 minutes before sparring; it provides the mental focus of caffeine without raising your heart rate too high.',
      'Blend matcha with oat milk and a touch of raw honey for a delicious, antioxidant-dense pre-workout latte.'
    ],
    conditioning: [
      'Athletic Matcha Shot: Whisk 1 tsp ceremonial matcha in 2 oz warm water (160F). Drink immediately.'
    ],
    combinations: [{ name: 'Antioxidant Energy (Matcha + Raw Honey)', link: 'raw-honey' }],
    relatedTechniques: ['green-tea', 'raw-honey', 'ashwagandha']
  },
  'ginseng': {
    id: 'ginseng',
    name: 'Panax Ginseng',
    category: 'Superfoods & Adaptogens',
    difficulty: 'advanced',
    stance: 'both',
    trainingFormat: ['extract', 'tea-infusion', 'powder'],
    muscles: ['head', 'heart', 'quadriceps'],
    description: 'A classic Eastern Asian adaptogenic root containing active ginsenosides. Panax Ginseng enhances physical stamina, fights fatigue, improves cognitive reaction times, and supports adrenal health during heavy training volumes.',
    whenToUse: 'Take in the morning or 1 hour before training; cycle usage (e.g., 6 weeks on, 2 weeks off) to prevent adaptation.',
    coachingCues: ['Use standardized extracts containing at least 4% ginsenosides.', 'Take early in the day as it can be highly stimulating.', 'Cycle use regularly.'],
    steps: [
      'Ginsenosides modulate the Hypothalamic-Pituitary-Adrenal (HPA) axis, regulating cortisol output.',
      'Cellular ATP production is stimulated, increasing energy availability.',
      'Nitric oxide pathways are activated, supporting cardiovascular blood flow.'
    ],
    mistakes: [
      'Taking Panax Ginseng right before sleep, which can cause insomnia.',
      'Using low-quality, cheap root powders that contain negligible ginsenoside content.'
    ],
    proTips: [
      'Panax Ginseng is highly synergistic with Cordyceps; taking them together before training provides a stellar boost to aerobic capacity and VO2 max.',
      'If you are in a heavy overreaching training phase, use ginseng to protect your central nervous system from burnout.'
    ],
    conditioning: [
      'Stamina Adaptogen Tea: Steep 1g of red ginseng root extract in hot water with ginger. Drink in the morning.'
    ],
    combinations: [{ name: 'Aerobic Stamina Synergy (Ginseng + Cordyceps)', link: 'cordyceps' }],
    relatedTechniques: ['cordyceps', 'ashwagandha', 'ginger']
  },
  'rhodiola': {
    id: 'rhodiola',
    name: 'Rhodiola Rosea',
    category: 'Superfoods & Adaptogens',
    difficulty: 'intermediate',
    stance: 'both',
    trainingFormat: ['capsule', 'extract', 'tea'],
    muscles: ['head', 'heart', 'abs'],
    description: 'An arctic adaptogenic herb containing rosavins and salidrosides. Rhodiola is highly effective at reducing physical and mental fatigue, improving endurance, and buffering the body against chemical and environmental stress.',
    whenToUse: 'Take 200-400mg in the morning or 45 minutes before exercise, preferably on an empty stomach.',
    coachingCues: ['Choose extracts standardized to 3% rosavins and 1% salidrosides.', 'Take on an empty stomach to enhance absorption.', 'Cycle usage during peak training blocks.'],
    steps: [
      'Salidrosides prevent cell damage and enhance energy metabolism.',
      'Monoamine neurotransmitters (serotonin, dopamine) are optimized in the brain, improving mood and focus.',
      'Lactic acid levels and muscle damage markers (like creatine kinase) are reduced post-exercise.'
    ],
    mistakes: [
      'Taking low-rosavin extracts that are ineffective.',
      'Assuming immediate results; like most adaptogens, Rhodiola works best when taken consistently over 2-3 weeks.'
    ],
    proTips: [
      'Take Rhodiola Rosea on the day of a major fight or race; it helps calm performance anxiety while keeping your central nervous system sharp and fatigue-resistant.',
      'Pair with Ashwagandha to create a powerful anti-stress recovery protocol during intense training camps.'
    ],
    conditioning: [
      'Endurance Adaptogen Shot: Take 300mg standardized Rhodiola extract with a cup of green tea pre-workout.'
    ],
    combinations: [{ name: 'CNS Stress Protection (Rhodiola + Ashwagandha)', link: 'ashwagandha' }],
    relatedTechniques: ['ashwagandha', 'green-tea', 'lions-mane']
  },
  'raw-cacao': {
    id: 'raw-cacao',
    name: 'Raw Cacao',
    category: 'Superfoods & Adaptogens',
    difficulty: 'beginner',
    stance: 'both',
    trainingFormat: ['powder', 'nibs', 'raw-chocolate'],
    muscles: ['heart', 'head', 'quadriceps'],
    description: 'The raw, cold-pressed seed of the cacao tree. Raw cacao is a powerhouse of flavanols, magnesium, iron, and theobromine, promoting vasodilation, cellular hydration, and cognitive focus.',
    whenToUse: 'Add raw cacao powder or nibs to pre-workout meals or eat as a snack (dark chocolate 85%+).',
    coachingCues: ['Use raw cacao powder, not alkalized cocoa powder (Dutch processed) which destroys flavanols.', 'Store in a cool, dark place.', 'Combine with a natural sweetener like honey to offset bitterness.'],
    steps: [
      'Cacao flavanols stimulate nitric oxide synthase, relaxing blood vessels.',
      'Theobromine provides a gentle, long-lasting cardiovascular stimulant effect.',
      'Magnesium relaxes vascular smooth muscle, improving blood pressure and recovery.'
    ],
    mistakes: [
      'Using processed cocoa powders containing milk solids, sugar, and alkali-refined fats.',
      'Over-consuming cacao late at night, as theobromine and small amounts of caffeine can disrupt sleep.'
    ],
    proTips: [
      'Add 1 tablespoon of raw cacao powder and a pinch of pink salt to your oatmeal for a delicious, magnesium-dense chocolate pre-workout bowl.',
      'Eat a few raw cacao nibs before training for a natural, sugar-free energy burst and focus enhancer.'
    ],
    conditioning: [
      'Polyphenol Recovery Shake: Blend 1 scoop chocolate protein, 1 tbsp raw cacao powder, 1 banana, and 1 cup oat milk.'
    ],
    combinations: [{ name: 'Vascular Nitric Oxide (Raw Cacao + Pink Salt)', link: 'pink-salt' }],
    relatedTechniques: ['dark-chocolate', 'pink-salt', 'banana']
  },
  'magnesium-glycinate': {
    id: 'magnesium-glycinate',
    name: 'Magnesium Glycinate',
    category: 'Superfoods & Adaptogens',
    difficulty: 'beginner',
    stance: 'both',
    trainingFormat: ['capsule', 'powder'],
    muscles: ['calves', 'quadriceps', 'hamstring', 'head'],
    description: 'A highly bioavailable form of magnesium chelated with the amino acid glycine. Magnesium glycinate promotes deep muscle relaxation, calms the nervous system, prevents nocturnal cramping, and optimizes sleep quality.',
    whenToUse: 'Take 200-400mg 30-60 minutes before bed to support muscle recovery and deep sleep.',
    coachingCues: ['Opt for pure powder or capsule forms without fillers.', 'Highly gentle on the stomach compared to magnesium citrate or oxide.', 'Take consistently for best recovery benefits.'],
    steps: [
      'Magnesium is absorbed in the ileum via passive and active pathways.',
      'Glycine crosses the blood-brain barrier, acting as an inhibitory neurotransmitter that promotes calm.',
      'Magnesium ions block NMDA receptors in the brain, reducing neuronal excitability and promoting muscle relaxation.'
    ],
    mistakes: [
      'Buying cheap magnesium oxide supplements, which have less than 4% bioavailability and cause digestive distress.',
      'Taking magnesium right before high-intensity workouts, which can cause muscle relaxation when tension is required.'
    ],
    proTips: [
      'Magnesium glycinate is the gold standard for athletic sleep recovery; taking it before bed halts muscle twitches and promotes deep, restorative delta-wave sleep.',
      'If you suffer from calf cramps during sleep or long workouts, combine magnesium glycinate with pink salt hydration.'
    ],
    conditioning: [
      'Rest & Recovery Protocol: Take 300mg of Magnesium Glycinate with a cup of warm chamomile tea 1 hour before sleep.'
    ],
    combinations: [{ name: 'Deep Sleep & Muscle Recovery (Magnesium + Pink Salt)', link: 'pink-salt' }],
    relatedTechniques: ['pink-salt', 'pumpkin-seeds', 'tart-cherry-juice']
  },
  'zinc-picolinate': {
    id: 'zinc-picolinate',
    name: 'Zinc Picolinate',
    category: 'Superfoods & Adaptogens',
    difficulty: 'beginner',
    stance: 'both',
    trainingFormat: ['capsule'],
    muscles: ['chest', 'triceps', 'biceps', 'quadriceps', 'gluteal'],
    description: 'A highly absorbable form of zinc bound to picolinic acid. Zinc is an essential trace mineral that acts as a cofactor for over 300 enzymatic reactions, promoting testosterone synthesis, protein synthesis, and immune cell function.',
    whenToUse: 'Take 15-30mg daily with a meal (never on an empty stomach) to support recovery and hormone balance.',
    coachingCues: ['Take with food to prevent temporary nausea.', 'Do not take at the same time as calcium or iron supplements, as they compete for absorption.', 'Excellent for maintaining immune health during high-volume training blocks.'],
    steps: [
      'Picolinic acid facilitates the transport of zinc ions across the intestinal membrane.',
      'Zinc is transported to cells, where it acts as a structural component of zinc-finger proteins.',
      'Enzymes responsible for protein synthesis and testosterone conversion are activated.'
    ],
    mistakes: [
      'Taking zinc on an empty stomach, which frequently causes intense, temporary nausea.',
      'Megadosing zinc (over 50mg daily) long-term, which can induce a copper deficiency.'
    ],
    proTips: [
      'If you feel run down from heavy training, take zinc picolinate with a meal to support your immune system\'s T-cells.',
      'Zinc is highly synergistic with magnesium; taking them together in your evening routine optimizes hormone support.'
    ],
    conditioning: [
      'Hormone Support Routine: Take 15mg Zinc Picolinate with your evening recovery meal containing red meat or pumpkin seeds.'
    ],
    combinations: [{ name: 'Hormonal Support Synergy (Zinc + Pumpkin Seeds)', link: 'pumpkin-seeds' }],
    relatedTechniques: ['pumpkin-seeds', 'oysters', 'beef-liver']
  },
  'fish-oil': {
    id: 'fish-oil',
    name: 'Fish Oil',
    category: 'Superfoods & Adaptogens',
    difficulty: 'beginner',
    stance: 'both',
    trainingFormat: ['liquid', 'gel-capsule'],
    muscles: ['heart', 'head', 'abs'],
    description: 'A highly concentrated source of the omega-3 fatty acids EPA (eicosapentaenoic acid) and DHA (docosahexaenoic acid). Fish oil is a premier anti-inflammatory supplement, promoting joint recovery, heart health, and cognitive function.',
    whenToUse: 'Take 1-2g of active EPA/DHA daily with a fat-containing meal to maximize absorption.',
    coachingCues: ['Look for molecularly distilled, third-party tested fish oils to avoid heavy metals.', 'Choose liquid forms for high dosage, or enteric-coated gel caps to prevent fishy aftertaste.', 'Store in the refrigerator.'],
    steps: [
      'EPA and DHA are absorbed and incorporated into the phospholipid bilayer of cells.',
      'EPA competes with arachidonic acid, reducing the production of inflammatory eicosanoids.',
      'DHA supports brain health and myelin sheath integrity, improving neural signaling speed.'
    ],
    mistakes: [
      'Buying cheap, oxidized fish oils that smell intensely fishy and cause rancid burps.',
      'Taking fish oil on an empty stomach, which reduces its absorption rate.'
    ],
    proTips: [
      'Take 2g of high-potency liquid fish oil daily during intense sparring or contact sports blocks; EPA/DHA helps protect brain cells and reduce neuroinflammation.',
      'Pair fish oil with Vitamin D3 in the morning; the healthy fats in fish oil maximize the absorption of the fat-soluble Vitamin D3.'
    ],
    conditioning: [
      'Anti-Inflammatory Morning Routine: Take 1 tsp high-quality liquid fish oil with a breakfast containing whole eggs.'
    ],
    combinations: [{ name: 'Fat-Soluble Absorption (Fish Oil + Eggs)', link: 'eggs' }],
    relatedTechniques: ['salmon', 'sardines', 'eggs']
  }
};

// 2. Combine the datasets
const combinedFoods = {
  ...macronutrients,
  ...hydration,
  ...micronutrients,
  ...gut,
  ...superfoods
};

// 3. Write individual files to src/data/foods/
function writeCategoryFile(filename, data) {
  const filePath = path.join(foodsDir, filename);
  const fileContent = `import type { Technique } from '../techniques';

export const ${filename.replace('.ts', '')}Foods: Record<string, Technique> = ${JSON.stringify(data, null, 2)};
`;
  fs.writeFileSync(filePath, fileContent, 'utf8');
  console.log(`Wrote ${filename} with ${Object.keys(data).length} foods.`);
}

writeCategoryFile('macronutrients.ts', macronutrients);
writeCategoryFile('hydration.ts', hydration);
writeCategoryFile('micronutrients.ts', micronutrients);
writeCategoryFile('gut.ts', gut);
writeCategoryFile('superfoods.ts', superfoods);

// 4. Read the existing src/data/foodsData.ts and keep its 46 foods intact, then merge the new foods.
const existingFoodsDataPath = path.join(dataDir, 'foodsData.ts');
let originalDataContent = fs.readFileSync(existingFoodsDataPath, 'utf8');

// Parse original foods using regex to extract they keys and objects.
const startIdx = originalDataContent.indexOf('export const foodsData: Record<string, Technique> = {');
const objectText = originalDataContent.substring(startIdx + 'export const foodsData: Record<string, Technique> = '.length);

const refactoredContent = `import type { Technique } from './techniques';
import { macronutrientsFoods } from './foods/macronutrients';
import { hydrationFoods } from './foods/hydration';
import { micronutrientsFoods } from './foods/micronutrients';
import { gutFoods } from './foods/gut';
import { superfoodsFoods } from './foods/superfoods';

const originalFoodsData: Record<string, Technique> = ${objectText.trim().replace(/;$/, '')}

export const foodsData: Record<string, Technique> = {
  ...originalFoodsData,
  ...macronutrientsFoods,
  ...hydrationFoods,
  ...micronutrientsFoods,
  ...gutFoods,
  ...superfoodsFoods
};
`;

fs.writeFileSync(existingFoodsDataPath, refactoredContent, 'utf8');
console.log('Refactored foodsData.ts successfully merged original and modular foods.');

console.log('Food catalog expansion complete! Total foods added:', Object.keys(combinedFoods).length);
