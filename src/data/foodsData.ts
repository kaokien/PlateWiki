import type { Technique } from './foods';
import { macronutrientsFoods } from './foods/macronutrients';
import { hydrationFoods } from './foods/hydration';
import { micronutrientsFoods } from './foods/micronutrients';
import { gutFoods } from './foods/gut';
import { superfoodsFoods } from './foods/superfoods';

const originalFoodsData: Record<string, Technique> = {
  'sweet-potato': {
    id: 'sweet-potato',
    image: '/images/foods/sweet-potato.jpg',
    name: 'Sweet Potatoes',
    category: 'Macronutrients',
    difficulty: 'beginner',
    stance: 'both',
    trainingFormat: ['baked', 'steamed', 'roasted'],
    muscles: ['quadriceps', 'gluteal', 'hamstring', 'calves'],
    description: 'A nutrient-dense root vegetable packed with complex carbohydrates, dietary fiber, and beta-carotene. Sweet potatoes provide a steady release of glucose into the bloodstream, making them the ultimate fuel source for maintaining high glycogen levels during long runs, heavy lifts, or high-intensity fight training.',
    whenToUse: 'Consume 2-3 hours before a demanding training session or as part of a post-workout recovery meal to replenish depleted muscle glycogen stores.',
    coachingCues: ['Eat organic with skin intact for extra fiber.', 'Combine with a healthy fat like coconut oil to increase beta-carotene absorption.', 'Do not over-boil; roasting keeps nutrients locked in.'],
    steps: [
      'Ingested starch is broken down by salivary and pancreatic amylase into simpler maltose and glucose molecules.',
      'Glucose is absorbed through the small intestine wall via active transport (SGLT1 protein) and enters the portal vein.',
      'The pancreas secretes insulin, promoting glucose uptake into skeletal muscle cells via GLUT4 transporters.',
      'Glucose molecules are chained together via glycogen synthase to form glycogen, stored directly in the liver and active muscles.'
    ],
    mistakes: [
      'Consuming with large amounts of fat right before training, which delays gastric emptying and causes gut distress.',
      'Replacing all complex carbs with simple sugars, leading to insulin spikes and mid-workout energy crashes.',
      'Throwing away the skin, which contains a high concentration of fiber and micronutrients.'
    ],
    proTips: [
      'Mash roasted sweet potato with a pinch of sea salt and cinnamon for an easily digestible pre-fight fueling meal.',
      'Use as a glycogen loading agent 24-48 hours before an endurance event (like a half marathon) to maximize leg muscle glycogen saturation.'
    ],
    conditioning: [
      'Earthy Roasted Fuel Bowl: Cube 1 sweet potato, toss with 1 tbsp avocado oil, sea salt, rosemary, and roast at 400F for 25 minutes. Serve with spinach and organic soft-boiled eggs.'
    ],
    combinations: [{ name: 'Protein-Glycogen Recovery (Sweet Potato + Whey Isolate)', link: 'whey-isolate' }],
    relatedTechniques: ['whey-isolate', 'oatmeal', 'salmon'],
    citations: [
      { title: 'Muscle Glycogen Synthesis After Exercise: Effect of Time of Carbohydrate Ingestion', source: 'Journal of Applied Physiology', link: 'https://pubmed.ncbi.nlm.nih.gov/3132449/' },
      { title: 'International Society of Sports Nutrition Position Stand: Nutritional Considerations for Single-Stage Ultra-Marathon Training and Racing', source: 'JISSN', link: 'https://pubmed.ncbi.nlm.nih.gov/31102928/' }
    ]
  },
  'whey-isolate': {
    id: 'whey-isolate',
    image: '/images/foods/whey-isolate.jpg',
    name: 'Whey Protein Isolate',
    category: 'Macronutrients',
    difficulty: 'beginner',
    stance: 'both',
    trainingFormat: ['shake', 'smoothie', 'baking'],
    muscles: ['chest', 'triceps', 'biceps', 'forearm', 'upper-back', 'trapezius'],
    description: 'A rapidly digesting, highly bioavailable protein source derived from milk. Whey isolate undergoes advanced filtration to remove almost all lactose and fat, yielding a 90%+ pure protein content rich in Branched-Chain Amino Acids (BCAAs), particularly Leucine, which triggers Muscle Protein Synthesis (MPS) via the mTOR pathway.',
    whenToUse: 'Take within 45 minutes post-workout to kickstart recovery and repair micro-tears in muscle fibers caused by heavy resistance training.',
    coachingCues: ['Mix with cold water for fastest absorption.', 'Look for cold-processed, grass-fed whey to avoid denatured proteins.', 'Avoid added artificial sweeteners which can disrupt gut microflora.'],
    steps: [
      'Whey protein enters the stomach, where hydrochloric acid and pepsin break it down into smaller polypeptides.',
      'In the duodenum, pancreatic enzymes (trypsin and chymotrypsin) further cleave peptides into free amino acids.',
      'Amino acids are rapidly absorbed in the jejunum via sodium-dependent active transport systems.',
      'High concentration of blood leucine triggers the mTORC1 pathway in muscle cells, activating ribosomes for muscle protein synthesis.'
    ],
    mistakes: [
      'Using whey isolate as a meal replacement rather than a supplement; it lacks essential micronutrients and fibers found in whole foods.',
      'Consuming too much protein in a single serving (over 50g), which saturates amino acid transporters and gets oxidized for energy rather than used for repair.',
      'Drinking immediately before a high-intensity session, which can cause mild nausea as blood is diverted from digestion to muscles.'
    ],
    proTips: [
      'Pair whey isolate with 50g of fast-acting carbs (like a banana or honey) post-workout; the insulin spike accelerates amino acid transport into muscle cells.',
      'Consuming whey isolate with tart cherry juice post-exercise synergizes muscle repair with rapid systemic inflammation reduction.'
    ],
    conditioning: [
      'Earthy Recovery Shake: Blend 1 scoop grass-fed whey isolate, 1 ripe banana, 1 tbsp organic almond butter, 1 cup unsweetened oat milk, and a pinch of ground cinnamon.'
    ],
    combinations: [{ name: 'Anabolic Recovery Combo (Whey Isolate + Sweet Potato)', link: 'sweet-potato' }],
    relatedTechniques: ['sweet-potato', 'eggs', 'salmon'],
    citations: [
      { title: 'International Society of Sports Nutrition Position Stand: Protein and Exercise', source: 'JISSN', link: 'https://pubmed.ncbi.nlm.nih.gov/28642684/' },
      { title: 'Stimulus of Muscle Protein Synthesis by Leucine Ingestion', source: 'The Journal of Nutrition', link: 'https://pubmed.ncbi.nlm.nih.gov/11015482/' }
    ]
  },
  'beetroot-juice': {
    id: 'beetroot-juice',
    image: '/images/foods/beetroot-juice.jpg',
    name: 'Beetroot Juice',
    category: 'Hydration & Salts',
    difficulty: 'intermediate',
    stance: 'both',
    trainingFormat: ['raw', 'infusion', 'powder'],
    muscles: ['calves', 'quadriceps', 'hamstring', 'head'],
    description: 'A vibrant red vegetable extract that is exceptionally high in inorganic nitrates (NO3-). Inside the body, these nitrates are reduced to nitric oxide (NO), a powerful vasodilator that relaxes blood vessels, increases oxygen delivery to active skeletal muscles, and enhances mitochondrial efficiency during aerobic and anaerobic workloads.',
    whenToUse: 'Drink 500ml of beetroot juice 2-3 hours before a race, training session, or high-repetition workout to allow peak nitric oxide concentration in the blood.',
    coachingCues: ['Do not use antiseptic mouthwash after drinking, as oral bacteria are required to convert nitrates.', 'Consume consistently for 3-5 days leading up to competition for maximum performance benefit.', 'Be prepared for harmless red discoloration of urine (beeturia).'],
    steps: [
      'Inorganic nitrates are ingested and absorbed in the upper gastrointestinal tract.',
      'Roughly 25% of absorbed nitrate is concentrated in the salivary glands and secreted into the mouth.',
      'Symbiotic bacteria on the tongue reduce nitrate (NO3-) to nitrite (NO2-).',
      'Swallowed nitrite is absorbed in the stomach and converted to active nitric oxide (NO) in the bloodstream under acidic/hypoxic conditions, inducing vasodilation.'
    ],
    mistakes: [
      'Brushing teeth or using mouthwash immediately after drinking beetroot juice, which kills the essential tongue bacteria that convert nitrates.',
      'Drinking it too close to training (less than 30 minutes), which does not give the body enough time to synthesize nitric oxide.',
      'Using low-nitrate, highly pasteurized commercial juices that have lost their active enzymatic properties.'
    ],
    proTips: [
      'Combine beetroot juice with 6-8g of Citrulline Malate to maximize the nitric oxide pathway and achieve stellar cardiovascular endurance.',
      'Excellent for high-altitude training where oxygen availability is limited, as nitric oxide increases oxygen delivery efficiency.'
    ],
    conditioning: [
      'Nitric Oxide Booster Shot: Juiced raw beetroot, half an apple, 1 inch of fresh ginger root, and a squeeze of lemon juice. Drink chilled.'
    ],
    combinations: [{ name: 'Endurance Fuel Combo (Beetroot Juice + Oatmeal)', link: 'oatmeal' }],
    relatedTechniques: ['oatmeal', 'coconut-water', 'spinach'],
    citations: [
      { title: 'Dietary Nitrate Supplementation and Exercise Performance', source: 'Sports Medicine', link: 'https://pubmed.ncbi.nlm.nih.gov/22242543/' },
      { title: 'Beetroot Juice Supplementation Speed-up Oxygen Uptake Kinetics in Athletes', source: 'Journal of Applied Physiology', link: 'https://pubmed.ncbi.nlm.nih.gov/19661447/' }
    ]
  },
  'eggs': {
    id: 'eggs',
    image: '/images/foods/eggs.jpg',
    name: 'Pasture-Raised Eggs',
    category: 'Macronutrients',
    difficulty: 'beginner',
    stance: 'both',
    trainingFormat: ['boiled', 'scrambled', 'poached'],
    muscles: ['head', 'chest', 'biceps', 'upper-back', 'gluteal'],
    description: 'The ultimate whole food protein source. Eggs contain all nine essential amino acids with a perfect Digestible Indispensable Amino Acid Score (DIAAS). The yolk is exceptionally rich in choline (for cognitive function), healthy fats, vitamin D, and lutein, making it a foundation for muscle repair and neural health.',
    whenToUse: 'Eat as a primary protein source for breakfast or in post-workout meals to repair muscle fibers and support hormone production.',
    coachingCues: ['Choose pasture-raised eggs for higher Omega-3 and vitamin D content.', 'Keep the yolk soft/runny to preserve heat-sensitive antioxidants.', 'Combine with avocados or leafy greens for fat-soluble vitamin absorption.'],
    steps: [
      'Egg proteins (ovalbumin and conalbumin) are denatured by gastric acids, uncoiling their structures.',
      'Pepsin breaks the amino chains into smaller peptides, which enter the duodenum.',
      'Pancreatic enzymes hydrolyze peptides into individual amino acids and small di/tri-peptides.',
      'Nutrients are absorbed via active transport in the microvilli, fueling systemic repair and hormone synthesis.'
    ],
    mistakes: [
      'Eating only the whites; the yolk contains 100% of the fat-soluble vitamins, choline, and half the protein.',
      'Overcooking yolks until dry, which oxidizes cholesterol and degrades beneficial fatty acids.',
      'Consuming raw egg whites, which contain avidin—a protein that binds to biotin and prevents its absorption.'
    ],
    proTips: [
      'A breakfast of 3 soft-boiled pasture-raised eggs provides 750mg of choline, optimizing neurotransmitter synthesis for focus and reaction time.',
      'Consuming whole eggs leads to 40% greater muscle protein synthesis post-workout than consuming equivalent protein from whites alone.'
    ],
    conditioning: [
      'athlete\'s Scramble: Whisk 3 eggs, scramble in 1 tsp grass-fed butter, fold in a handful of fresh spinach, cherry tomatoes, and serve alongside a sliced avocado.'
    ],
    combinations: [{ name: 'Choline-Brain Stack (Eggs + Salmon)', link: 'salmon' }],
    relatedTechniques: ['salmon', 'spinach', 'whey-isolate']
  },
  'salmon': {
    id: 'salmon',
    image: '/images/foods/salmon.jpg',
    name: 'Wild-Caught Salmon',
    category: 'Macronutrients',
    difficulty: 'beginner',
    stance: 'both',
    trainingFormat: ['grilled', 'baked', 'pan-seared'],
    muscles: ['head', 'neck', 'lower-back', 'abs'],
    description: 'A premium oily fish rich in long-chain Omega-3 fatty acids (EPA and DHA), high-quality complete protein, and astaxanthin (a powerful antioxidant). Omega-3s are critical for reducing muscle soreness, supporting cardiovascular health, improving joint mobility, and enhancing neuroprotection in combat athletes.',
    whenToUse: 'Consume 2-3 times per week to build cellular membrane fluidity, reduce chronic inflammation, and protect the brain from impact stress.',
    coachingCues: ['Always buy wild-caught salmon to avoid the antibiotics and synthetic colorants found in farmed fish.', 'Cook skin-side down first to protect the delicate fats from oxidizing under direct heat.', 'Season with turmeric and black pepper to double its anti-inflammatory effects.'],
    steps: [
      'Omega-3 fatty acids are emulsified by bile salts in the small intestine into micelles.',
      'Pancreatic lipase cleaves fatty acids from glycerol, enabling absorption into enterocytes.',
      'Fatty acids are re-esterified into triglycerides and packaged into chylomicrons, entering the lymphatic system.',
      'EPA and DHA are incorporated into cell membranes (especially in brain and heart tissue) and act as precursors to anti-inflammatory eicosanoids.'
    ],
    mistakes: [
      'Deep frying salmon, which destroys the delicate Omega-3 bonds and introduces inflammatory oxidized seed oils.',
      'Buying farmed salmon, which has a higher ratio of inflammatory Omega-6 fats and lower levels of astaxanthin.',
      'Cooking to well-done; salmon is best enjoyed medium-rare to medium to preserve healthy fats and moisture.'
    ],
    proTips: [
      'Wild salmon is a top source of Astaxanthin, a carotenoid that improves skin health, visual acuity, and muscle endurance in athletes.',
      'Pairing wild salmon with fresh ginger or turmeric creates an incredibly potent natural anti-inflammatory recovery meal.'
    ],
    conditioning: [
      'Earthy Cedar Plank Salmon: Place wild salmon fillet on a pre-soaked cedar plank, brush with olive oil and sea salt, and grill over medium heat for 12-15 minutes.'
    ],
    combinations: [{ name: 'Anti-Inflammatory Shield (Salmon + Turmeric)', link: 'turmeric' }],
    relatedTechniques: ['eggs', 'turmeric', 'spinach']
  },
  'oatmeal': {
    id: 'oatmeal',
    image: '/images/foods/oatmeal.jpg',
    name: 'Sprouted Oatmeal',
    category: 'Macronutrients',
    difficulty: 'beginner',
    stance: 'both',
    trainingFormat: ['porridge', 'overnight-oats', 'baked'],
    muscles: ['quadriceps', 'gluteal', 'hamstring', 'calves'],
    description: 'A slow-digesting complex carbohydrate source rich in beta-glucan (a soluble fiber that improves gut health and immune function). Oatmeal provides sustained energy release without blood sugar spikes, making it an ideal pre-workout foundation for endurance athletes and powerlifters.',
    whenToUse: 'Eat 1.5-2 hours before long training sessions to prime glycogen storage and stabilize blood sugar.',
    coachingCues: ['Opt for sprouted oats to reduce phytic acid and improve mineral bioavailability.', 'Avoid instant oatmeal packets with added sugars.', 'Stir in chia seeds or flaxseed for healthy fats.'],
    steps: [
      'Soluble beta-glucans form a viscous gel in the stomach, slowing gastric emptying.',
      'Carbohydrates are slowly hydrolyzed into glucose in the small intestine, resulting in a gentle insulin response.',
      'Glucose is transported into muscle and liver tissue, steadily rebuilding glycogen levels.',
      'Undigested oat fibers reach the colon, feeding beneficial gut bacteria which produce short-chain fatty acids (SCFAs).'
    ],
    mistakes: [
      'Eating instant oatmeal loaded with sugar, causing a rapid insulin spike followed by a mid-training crash.',
      'Consuming a large bowl right before training (under 30 minutes), resulting in heavy digestion and stomach cramps during exercise.',
      'Not adding a protein source, which can leave you feeling hungry shortly after due to rapid carbohydrate clearance.'
    ],
    proTips: [
      'Make overnight oats with kefir or Greek yogurt to combine slow-release carbs with probiotics and high-quality protein.',
      'Spiced oats with ginger and cinnamon improve insulin sensitivity and reduce muscle inflammation.'
    ],
    conditioning: [
      'Earthy Sprouted Porridge: Simmer sprouted rolled oats in coconut milk, stir in ground flax, pumpkin seeds, and top with fresh blueberries and raw honey.'
    ],
    combinations: [{ name: 'Sustained Glycogen Stack (Oatmeal + Beetroot Juice)', link: 'beetroot-juice' }],
    relatedTechniques: ['sweet-potato', 'blueberries', 'kefir']
  },
  'spinach': {
    id: 'spinach',
    image: '/images/foods/spinach.jpg',
    name: 'Organic Spinach',
    category: 'Micronutrients',
    difficulty: 'beginner',
    stance: 'both',
    trainingFormat: ['raw', 'steamed', 'sautéed'],
    muscles: ['quadriceps', 'chest', 'triceps', 'forearm'],
    description: 'A nutrient-dense leafy green rich in non-heme iron, calcium, magnesium, vitamins A, C, K1, and dietary nitrates. Spinach supports muscular contraction, bone density, oxygen transport, and cardiovascular efficiency, functioning as an essential daily foundation for athletic performance.',
    whenToUse: 'Incorporate into meals daily, either raw in smoothies/salads or lightly steamed to reduce oxalates.',
    coachingCues: ['Squeeze lemon juice on spinach; vitamin C increases iron absorption.', 'Lightly cook spinach to neutralize oxalates that block calcium and iron absorption.', 'Purchase organic to avoid heavy pesticide residues.'],
    steps: [
      'Plant nitrates in spinach are converted into nitric oxide in the blood, relaxing arterial walls.',
      'Magnesium is absorbed in the small intestine, acting as a cofactor for over 300 enzymatic reactions.',
      'Non-heme iron binds to transferrin in the bloodstream, transporting oxygen to muscle mitochondria.',
      'Phytochemicals neutralize free radicals generated during high-intensity training, accelerating recovery.'
    ],
    mistakes: [
      'Eating massive quantities of raw spinach daily; high oxalates can bind to minerals and potentially contribute to kidney stones.',
      'Boiling spinach and throwing away the water, which leaches out all water-soluble vitamins.',
      'Eating spinach without a fat source, which prevents the absorption of fat-soluble vitamins (A and K).'
    ],
    proTips: [
      'Sauté spinach in extra virgin olive oil with garlic to maximize nutrient absorption and taste.',
      'Add a cup of spinach to your protein shake; it blends completely and adds a massive dose of chlorophyll and magnesium.'
    ],
    conditioning: [
      'Earthy Sautéed Greens: Sauté 3 cups organic spinach in 1 tsp olive oil, minced garlic, sea salt, and a squeeze of fresh lemon juice for 2 minutes.'
    ],
    combinations: [{ name: 'Iron-Absorption Boost (Spinach + Lemon/C-Source)', link: 'blueberries' }],
    relatedTechniques: ['blueberries', 'salmon', 'eggs']
  },
  'pumpkin-seeds': {
    id: 'pumpkin-seeds',
    image: '/images/foods/pumpkin-seeds.jpg',
    name: 'Raw Pumpkin Seeds (Pepitas)',
    category: 'Micronutrients',
    difficulty: 'beginner',
    stance: 'both',
    trainingFormat: ['raw', 'sprouted', 'roasted'],
    muscles: ['calves', 'abs', 'lower-back', 'heart'],
    description: 'An exceptional source of plant-based magnesium, zinc, iron, healthy fats, and protein. Magnesium is critical for muscle relaxation, ATP (energy) production, and sleep regulation, while zinc supports testosterone synthesis and immune function.',
    whenToUse: 'Eat a handful daily as a snack or sprinkle on meals to maintain optimal mineral status.',
    coachingCues: ['Choose raw or sprouted seeds to avoid inflammatory seed oils used in roasted brands.', 'Combine with a zinc-rich diet to naturally support hormone levels.', 'Salt lightly with mineral-rich pink salt.'],
    steps: [
      'Magnesium is absorbed in the ileum, entering the bloodstream to maintain cellular electrolyte balance.',
      'Zinc binds to albumin in the blood, traveling to tissues to support cellular growth, repair, and immune cells.',
      'Healthy monounsaturated and polyunsaturated fats are digested, supporting cell membrane structures.',
      'L-tryptophan is converted to serotonin and melatonin, promoting deep muscle-relaxing sleep.'
    ],
    mistakes: [
      'Eating seeds roasted in industrial seed oils (like canola or sunflower oil), which promotes systemic inflammation.',
      'Consuming excessive amounts (over 2 ounces per serving) before training, as the high fat and fiber content can weigh down your stomach.',
      'Choosing heavily sweetened pumpkin seed granolas.'
    ],
    proTips: [
      'Eat 1-2 ounces of pumpkin seeds before bed; the natural combination of magnesium and tryptophan acts as a potent sleep and recovery aid.',
      'Sprouting pumpkin seeds by soaking them in water for 6 hours neutralizes phytic acid, unlocking maximum mineral absorption.'
    ],
    conditioning: [
      'Sprouted Pepitas: Soak raw pumpkin seeds in water with a pinch of sea salt for 6 hours, rinse, and dehydrate or bake at 150F until dry.'
    ],
    combinations: [{ name: 'Mineral Sleep Stack (Pumpkin Seeds + Magnesium)', link: 'kefir' }],
    relatedTechniques: ['kefir', 'oatmeal', 'blueberries']
  },
  'blueberries': {
    id: 'blueberries',
    image: '/images/foods/blueberries.jpg',
    name: 'Wild Blueberries',
    category: 'Micronutrients',
    difficulty: 'beginner',
    stance: 'both',
    trainingFormat: ['raw', 'frozen', 'smoothie'],
    muscles: ['head', 'heart', 'neck', 'lower-back'],
    description: 'A powerful antioxidant fruit packed with anthocyanins, manganese, and vitamins C and K. Wild blueberries have double the antioxidant capacity of regular blueberries, helping to neutralize oxidative stress, reduce muscle soreness, and support brain health.',
    whenToUse: 'Eat daily, especially in post-workout smoothies, to accelerate recovery and reduce muscle inflammation.',
    coachingCues: ['Choose wild blueberries over cultivated ones; they are smaller but pack a far higher antioxidant punch.', 'Keep frozen on hand; freezing locks in the anthocyanins.', 'Mix with a source of healthy fats (like yogurt or almond butter) for fat-soluble absorption.'],
    steps: [
      'Anthocyanins are absorbed in the stomach and small intestine, entering circulation rapidly.',
      'Antioxidants cross the blood-brain barrier, protecting neurons from oxidative damage and support cognitive function.',
      'Manganese is utilized by mitochondria to synthesize antioxidant enzymes (SOD).',
      'Vitamin C supports collagen synthesis in connective tissues, repairing joints and tendons.'
    ],
    mistakes: [
      'Buying conventional blueberries which are heavily sprayed with synthetic pesticides.',
      'Heating blueberries to high temperatures, which can degrade vitamin C and delicate phytonutrients.',
      'Consuming with high-protein dairy if looking for maximum antioxidant absorption, as some research suggests dairy proteins can bind to polyphenols.'
    ],
    proTips: [
      'Blend wild blueberries into your recovery shake; the polyphenols directly mitigate the muscle damage caused by eccentric lifting or heavy workouts.',
      'Consuming blueberries pre-workout has been shown to support fat oxidation and maintain cellular integrity during endurance training.'
    ],
    conditioning: [
      'Earthy Antioxidant Bowl: 1 cup wild blueberries, 1 cup unsweetened coconut yogurt, topped with raw pumpkin seeds and a drizzle of raw manuka honey.'
    ],
    combinations: [{ name: 'Vascular Protection (Blueberries + Spinach)', link: 'spinach' }],
    relatedTechniques: ['spinach', 'oatmeal', 'kefir']
  },
  'coconut-water': {
    id: 'coconut-water',
    image: '/images/foods/coconut-water.jpg',
    name: 'Raw Coconut Water',
    category: 'Hydration & Salts',
    difficulty: 'beginner',
    stance: 'both',
    trainingFormat: ['raw', 'chilled'],
    muscles: ['calves', 'quadriceps', 'hamstring', 'forearm'],
    description: 'Nature\'s ultimate isotonic beverage. Coconut water is packed with natural potassium, sodium, magnesium, and calcium. It rapidly restores intracellular hydration, prevents muscle cramping, and replenishes electrolytes lost through heavy sweating without added refined sugars.',
    whenToUse: 'Drink during high-intensity training sessions or immediately post-workout to rehydrate cells and restore fluid balance.',
    coachingCues: ['Look for 100% pure coconut water, never from concentrate, with no added sugar.', 'Drink chilled for maximum palatability and rapid absorption.', 'Add a pinch of pink salt to increase the sodium content for heavy sweat sessions.'],
    steps: [
      'Isotonic fluids pass rapidly through the stomach into the duodenum.',
      'Potassium and sodium are absorbed, maintaining the osmotic pressure of body fluids.',
      'Water molecules follow the electrolyte gradient, entering muscle cells to restore full hydration.',
      'Magnesium and calcium ions support nerve transmission and smooth muscle relaxation, preventing cramping.'
    ],
    mistakes: [
      'Drinking pasteurized coconut water that contains added preservatives and refined sugars.',
      'Relying solely on coconut water for sodium; it is high in potassium but relatively low in sodium, requiring a pinch of salt for extreme sweating.',
      'Drinking warm coconut water, which can be unpalatable and reduce fluid intake.'
    ],
    proTips: [
      'Add 1/4 tsp of Himalayan pink salt to 500ml of coconut water to create the perfect natural intra-workout electrolyte drink for athletes.',
      'Ideal for rapid rehydration after making weight or undergoing a grueling weight cut.'
    ],
    conditioning: [
      'Isotonic Rehydration Elixir: 500ml raw coconut water, 1/4 tsp Himalayan pink salt, a squeeze of fresh lime, and 1 tsp raw honey. Shake well.'
    ],
    combinations: [{ name: 'Isotonic Electrolyte Stack (Coconut Water + Pink Salt)', link: 'pink-salt' }],
    relatedTechniques: ['pink-salt', 'beetroot-juice', 'ginger']
  },
  'pink-salt': {
    id: 'pink-salt',
    image: '/images/foods/pink-salt.jpg',
    name: 'Himalayan Pink Salt',
    category: 'Hydration & Salts',
    difficulty: 'beginner',
    stance: 'both',
    trainingFormat: ['raw', 'dissolved'],
    muscles: ['heart', 'calves', 'quadriceps', 'abs'],
    description: 'An unrefined mineral salt mined from ancient sea beds. Pink salt contains 84+ trace minerals, including potassium, magnesium, and calcium, alongside sodium chloride. It is essential for maintaining blood volume, nerve transmission, muscle contraction, and preventing hyponatremia during prolonged exercise.',
    whenToUse: 'Add a pinch to your pre-workout or intra-workout hydration fluids, especially in hot environments or during long endurance training.',
    coachingCues: ['Use unrefined pink or Celtic sea salt rather than bleached table salt.', 'Add a tiny pinch (1/8 tsp) to your water bottle.', 'Combine with potassium-rich foods to maintain the sodium-potassium pump.'],
    steps: [
      'Sodium and chloride ions dissociate in water and are absorbed in the small intestine.',
      'Sodium enters extracellular fluid, drawing water into the bloodstream to expand blood volume.',
      'The sodium-potassium pump maintains the electrical gradient across cell membranes, enabling nerve impulses.',
      'Intracellular electrolyte levels are stabilized, facilitating powerful muscular contractions.'
    ],
    mistakes: [
      'Using processed table salt, which is stripped of trace minerals and contains anti-caking agents.',
      'Consuming excessive amounts of salt without adequate water, leading to cellular dehydration.',
      'Avoiding salt entirely; low sodium levels lead to cramping, brain fog, and severe drops in athletic performance.'
    ],
    proTips: [
      'Take a pinch of pink salt with 500ml of water 30 minutes before training to increase blood volume, resulting in an incredible muscle pump and higher endurance.',
      'Essential for athletes on low-carb diets, as the body excretes sodium at a higher rate when insulin levels are low.'
    ],
    conditioning: [
      'Pre-Workout Pump Drink: 500ml water, 1/4 tsp pink salt, 1 tbsp organic lemon juice, and 5g of L-Citrulline.'
    ],
    combinations: [{ name: 'Hyper-Hydration (Pink Salt + Coconut Water)', link: 'coconut-water' }],
    relatedTechniques: ['coconut-water', 'beetroot-juice', 'ginger']
  },
  'kefir': {
    id: 'kefir',
    image: '/images/foods/kefir.jpg',
    name: 'Grass-Fed Milk Kefir',
    category: 'Gut & Digestion',
    difficulty: 'intermediate',
    stance: 'both',
    trainingFormat: ['raw', 'smoothie'],
    muscles: ['abs', 'lower-back', 'head'],
    description: 'A fermented dairy beverage cultured with kefir grains. It contains up to 30-50 unique strains of beneficial bacteria and yeasts, making it a gut health powerhouse. Kefir improves lactose digestion, supports immune function, reduces systemic inflammation, and optimizes nutrient absorption in the gut.',
    whenToUse: 'Drink a cup daily, preferably in the morning or as a base for post-workout smoothies to support gut colonization and protein delivery.',
    coachingCues: ['Choose unsweetened, grass-fed organic milk kefir or coconut water kefir.', 'Drink raw; pasteurizing after fermentation kills the beneficial bacteria.', 'Introduce slowly if your gut is not used to fermented foods.'],
    steps: [
      'Kefir microorganisms survive the stomach acid barrier and reach the small and large intestines.',
      'Beneficial bacteria colonize the gut wall, strengthening the tight junctions of the intestinal lining.',
      'Bacterial enzymes break down lactose, preventing bloating and digestive discomfort.',
      'Gut microbes synthesize vitamins (K2, B12) and produce short-chain fatty acids, reducing systemic inflammation.'
    ],
    mistakes: [
      'Buying fruit-flavored kefirs that contain massive amounts of added sugars, which feed harmful gut yeasts.',
      'Heating kefir, which pasteurizes the drink and destroys all the living probiotics.',
      'Consuming large amounts immediately before a workout, as the active cultures and dairy can cause digestive movement.'
    ],
    proTips: [
      'Use kefir as the liquid base for your post-workout protein shakes; it contains highly bioavailable whey and casein alongside active cultures that aid protein absorption.',
      'Drinking kefir regularly improves the gut-brain axis, naturally lowering anxiety and cortisol levels.'
    ],
    conditioning: [
      'Earthy Kefir Smoothie: 1 cup raw milk kefir, 1/2 cup wild blueberries, 1 tbsp sprouted pumpkin seeds, and 1 tsp raw honey. Blend lightly.'
    ],
    combinations: [{ name: 'Synbiotic Gut Stack (Kefir + Oatmeal/Oats)', link: 'oatmeal' }],
    relatedTechniques: ['oatmeal', 'blueberries', 'pumpkin-seeds']
  },
  'ginger': {
    id: 'ginger',
    image: '/images/foods/ginger.jpg',
    name: 'Fresh Ginger Root',
    category: 'Gut & Digestion',
    difficulty: 'beginner',
    stance: 'both',
    trainingFormat: ['raw', 'tea', 'juice'],
    muscles: ['abs', 'neck', 'forearm', 'lower-back'],
    description: 'A pungent rhizome containing highly active gingerols and shogaols. Ginger is a natural prokinetic (accelerates gastric emptying), reduces nausea, acts as a potent anti-inflammatory, and improves overall digestion by stimulating bile and digestive enzyme production.',
    whenToUse: 'Consume daily, either as a warm tea before meals or juiced into smoothies, to maintain digestive comfort and soothe muscle soreness.',
    coachingCues: ['Use fresh ginger root rather than dried ginger powder for maximum enzymatic activity.', 'Steep in hot water for 10 minutes to make a soothing digestive tea.', 'Combine with lemon and honey to boost immune support.'],
    steps: [
      'Ginger compounds stimulate salivary glands and stomach lining, increasing the flow of digestive enzymes.',
      'Gingerols act on serotonin receptors in the gut, accelerating stomach emptying and relieving bloating.',
      'Anti-inflammatory molecules inhibit the COX-2 pathway, reducing systemic inflammation and muscle pain.',
      'Compounds promote bile production in the liver, enhancing fat digestion and nutrient assimilation.'
    ],
    mistakes: [
      'Consuming sweet ginger beers or sugary ginger candies, which cause gut fermentation and bloating.',
      'Consuming excessive amounts (more than 4 grams of raw ginger daily), which can cause mild heartburn or throat irritation.',
      'Using processed ginger supplements filled with artificial binders.'
    ],
    proTips: [
      'Drink a cup of warm ginger tea 30 minutes before a heavy meal to prime your digestive system and prevent bloating.',
      'Ginger has been shown to reduce muscle pain and soreness after eccentric exercise as effectively as NSAIDs, without damaging the stomach lining.'
    ],
    conditioning: [
      'Warm Digestion Tea: Slice 1 inch of fresh ginger root, simmer in 2 cups of water for 10 minutes, add a squeeze of lemon and 1 tsp raw honey.'
    ],
    combinations: [{ name: 'Digestive Fire Stack (Ginger + Apple Cider Vinegar)', link: 'acv' }],
    relatedTechniques: ['acv', 'kefir', 'turmeric']
  },
  'acv': {
    id: 'acv',
    image: '/images/foods/acv.jpg',
    name: 'Apple Cider Vinegar (with the Mother)',
    category: 'Gut & Digestion',
    difficulty: 'beginner',
    stance: 'both',
    trainingFormat: ['raw', 'diluted'],
    muscles: ['abs', 'neck', 'gluteal'],
    description: 'Raw, unfiltered vinegar containing acetic acid, beneficial enzymes, and probiotic bacteria (the Mother). ACV increases stomach acidity (aiding protein breakdown), improves insulin sensitivity, and helps manage post-meal blood sugar levels.',
    whenToUse: 'Take 1-2 tbsp diluted in water 15-20 minutes before high-protein or high-carbohydrate meals.',
    coachingCues: ['Always dilute in at least 8oz of water to protect tooth enamel.', 'Choose raw, organic, unfiltered vinegar with a cloudy appearance.', 'Drink through a straw if concerned about sensitive teeth.'],
    steps: [
      'Diluted acetic acid lowers stomach pH, optimizing the activation of pepsin for protein breakdown.',
      'ACV delays gastric emptying slightly, leading to a slower and more sustained release of glucose into the blood.',
      'Acetic acid enhances the uptake of glucose by skeletal muscle cells, improving insulin sensitivity.',
      'Beneficial enzymes support gut flora, reducing bloating and gas.'
    ],
    mistakes: [
      'Drinking ACV straight/undiluted, which can burn the esophagus and damage tooth enamel.',
      'Using pasteurized white vinegar, which has no probiotic activity or active enzymes.',
      'Taking it immediately after a meal; it is far more effective when consumed before eating.'
    ],
    proTips: [
      'ACV taken before a high-carbohydrate meal (like sweet potatoes or oats) can reduce the glycemic impact by up to 30%, keeping your energy levels stable.',
      'Excellent for weight management and body composition goals in athletes.'
    ],
    conditioning: [
      'ACV Tonic: 1 tbsp raw apple cider vinegar, 250ml warm water, a pinch of cinnamon, and 1 tsp raw honey. Stir well.'
    ],
    combinations: [{ name: 'Pre-Meal Tonic (ACV + Ginger)', link: 'ginger' }],
    relatedTechniques: ['ginger', 'kefir', 'oatmeal']
  },
  'ashwagandha': {
    id: 'ashwagandha',
    image: '/images/foods/ashwagandha.jpg',
    name: 'Ashwagandha (KSM-66)',
    category: 'Superfoods & Adaptogens',
    difficulty: 'intermediate',
    stance: 'both',
    trainingFormat: ['powder', 'capsule'],
    muscles: ['head', 'neck', 'upper-back', 'lower-back'],
    description: 'A powerful adaptogenic herb that helps the body manage physical and mental stress. Ashwagandha (specifically KSM-66 extract) has been shown to significantly reduce cortisol levels, support testosterone production, increase cardiorespiratory endurance (VO2 max), and improve sleep quality.',
    whenToUse: 'Take daily, preferably in the evening or split between morning and night, to modulate cortisol and support recovery.',
    coachingCues: ['Look for KSM-66 or Shoden standardized extracts for reliable active withanolide content.', 'Cycle ashwagandha: take for 8-12 weeks followed by a 2-4 week break.', 'Consume with a meal containing fat to enhance absorption.'],
    steps: [
      'Active withanolides modulate the hypothalamic-pituitary-adrenal (HPA) axis.',
      'Cortisol secretion by the adrenal glands is down-regulated, buffering the stress response.',
      'Reduced cortisol protects muscle tissue from catabolism and elevates natural testosterone production.',
      'Deep sleep duration is enhanced, allowing optimal growth hormone release and nervous system recovery.'
    ],
    mistakes: [
      'Expecting instant results; adaptogens require 2-4 weeks of consistent daily usage to build up in the system.',
      'Taking extremely high doses, which can cause mild drowsiness or emotional blunting in sensitive individuals.',
      'Buying low-quality extracts with no standardized withanolide percentage.'
    ],
    proTips: [
      'Taking ashwagandha post-workout helps shift the body rapidly from a sympathetic (fight-or-flight) state into a parasympathetic (rest-and-digest) recovery state.',
      'Highly beneficial during heavy loading training blocks (Week 3 of cycles) to prevent overreaching and burnout.'
    ],
    conditioning: [
      'Earthy Moon Milk: Warm 1 cup oat milk, whisk in 1/2 tsp ashwagandha powder, 1/2 tsp cinnamon, 1/2 tsp nutmeg, and 1 tsp raw honey. Drink before sleep.'
    ],
    combinations: [{ name: 'Deep Sleep Recovery (Ashwagandha + Magnesium)', link: 'pumpkin-seeds' }],
    relatedTechniques: ['pumpkin-seeds', 'lions-mane', 'turmeric']
  },
  'lions-mane': {
    id: 'lions-mane',
    image: '/images/foods/lions-mane.jpg',
    name: 'Lion\'s Mane Mushroom',
    category: 'Superfoods & Adaptogens',
    difficulty: 'intermediate',
    stance: 'both',
    trainingFormat: ['powder', 'infusion', 'capsule'],
    muscles: ['head', 'neck', 'forearm'],
    description: 'A medicinal mushroom containing active hericenones and erinacines. Lion\'s Mane stimulates Nerve Growth Factor (NGF) synthesis, promoting neuroplasticity, cognitive function, focus, memory, and nerve repair. It is a vital supplement for neuroprotection and mental acuity in combat and coordination-heavy sports.',
    whenToUse: 'Take in the morning or early afternoon with coffee, tea, or a smoothie to support cognitive function and focus during training.',
    coachingCues: ['Use hot-water/dual-extracted mushroom powders to ensure bioavailable beta-glucans and active compounds.', 'Incorporate into your morning routine for sharp mental focus.', 'Avoid cheap mycelium-on-grain powders which are mostly starch.'],
    steps: [
      'Active erinacines easily cross the blood-brain barrier.',
      'Compounds stimulate astrocytes in the brain to produce Nerve Growth Factor (NGF).',
      'NGF promotes the growth, maintenance, and myelination of brain neurons, enhancing signal speed.',
      'Visual processing, reaction time, and spatial memory are optimized during training.'
    ],
    mistakes: [
      'Buying products containing mycelium grown on grain (grain starch) rather than 100% organic fruiting bodies.',
      'Taking right before bed if sensitive, as the neural stimulation can sometimes delay sleep.',
      'Using only occasionally; NGF synthesis requires consistent daily intake.'
    ],
    proTips: [
      'Mix Lion\'s Mane extract directly into your morning coffee or green tea; the caffeine synergizes with the mushroom to produce clean, jitter-free focus.',
      'An essential recovery tool for athletes to protect and repair brain tissue after hard training or head impact.'
    ],
    conditioning: [
      'Mushroom Focus Coffee: Brew organic coffee, stir in 1/2 tsp dual-extracted Lion\'s Mane powder, 1 tsp MCT oil, and a dash of cinnamon. Blend until frothy.'
    ],
    combinations: [{ name: 'Cognitive Synergy (Lion\'s Mane + L-Theanine/Matcha)', link: 'blueberries' }],
    relatedTechniques: ['blueberries', 'ashwagandha', 'cordyceps']
  },
  'cordyceps': {
    id: 'cordyceps',
    image: '/images/foods/cordyceps.jpg',
    name: 'Cordyceps Militaris',
    category: 'Superfoods & Adaptogens',
    difficulty: 'advanced',
    stance: 'both',
    trainingFormat: ['powder', 'capsule'],
    muscles: ['heart', 'calves', 'quadriceps', 'hamstring'],
    description: 'A medicinal mushroom famed for boosting energy, aerobic capacity, and respiratory efficiency. Cordyceps increases ATP (cellular energy) production via mitochondrial pathways and enhances oxygen utilization (VO2 max) by expanding lung ventilation capacity.',
    whenToUse: 'Take 45-60 minutes before aerobic training, training, or intense lifting to maximize oxygen delivery and delay threshold fatigue.',
    coachingCues: ['Ensure the product is cordyceps extract with standardized cordycepin levels.', 'Best taken pre-workout to harness its immediate oxygenation benefits.', 'Cycle or take consistently for cumulative respiratory gains.'],
    steps: [
      'Cordycepin and active adenosine analogs bind to cellular receptors.',
      'Mitochondrial ATP synthesis is stimulated, increasing baseline cellular energy.',
      'Lung bronchodilation is promoted, increasing oxygen saturation in blood.',
      'Lactic acid threshold is delayed, allowing longer sustained athletic output.'
    ],
    mistakes: [
      'Taking cordyceps late at night; the ATP stimulation can interfere with falling asleep.',
      'Using non-extracted cordyceps powder, which has poor bioavailability due to indigestible chitin cell walls.',
      'Expecting energy spikes like caffeine; cordyceps increases cellular aerobic efficiency, not nervous system stimulation.'
    ],
    proTips: [
      'Combine Cordyceps with Beetroot Juice pre-run or pre-fight for an incredibly potent, stimulant-free endurance stack that expands both lung and vascular capacity.',
      'Excellent for weightlifters to shorten recovery times between heavy sets.'
    ],
    conditioning: [
      'Pre-Workout Cordyceps Tonic: Mix 1/2 tsp Cordyceps Militaris extract in warm water, add a squeeze of lemon, and 1 tsp raw honey. Drink 45 minutes before exercise.'
    ],
    combinations: [{ name: 'Intracellular Energy Stack (Cordyceps + Beetroot Juice)', link: 'beetroot-juice' }],
    relatedTechniques: ['beetroot-juice', 'coconut-water', 'lions-mane']
  },
  'turmeric': {
    id: 'turmeric',
    image: '/images/foods/turmeric.jpg',
    name: 'Organic Turmeric Root',
    category: 'Superfoods & Adaptogens',
    difficulty: 'beginner',
    stance: 'both',
    trainingFormat: ['raw', 'juice', 'latte', 'powder'],
    muscles: ['lower-back', 'upper-back', 'neck', 'abs'],
    description: 'A bright yellow root containing the highly active polyphenol curcumin. Turmeric is a natural anti-inflammatory agent that inhibits inflammatory enzymes (like COX-2). It supports joint health, reduces muscle damage, and accelerates systemic recovery without the negative gut side effects of NSAIDs.',
    whenToUse: 'Consume daily, ideally post-workout or in evening meals, to manage joint inflammation and muscle soreness.',
    coachingCues: ['Always consume turmeric with black pepper (piperine); pepper increases curcumin absorption by 2000%.', 'Combine with a healthy fat, as curcumin is fat-soluble.', 'Choose organic fresh root or concentrated extracts.'],
    steps: [
      'Curcumin is ingested and absorbed in the gut (enhanced by piperine).',
      'Molecules enter the bloodstream, inhibiting pro-inflammatory cytokines (IL-6, TNF-alpha) and COX-2 enzymes.',
      'Oxidative stress in joint tissues and muscle beds is mitigated, reducing post-exercise swelling.',
      'Systemic recovery is accelerated, helping prevent chronic tendonitis and joint wear.'
    ],
    mistakes: [
      'Consuming turmeric without black pepper or fat, resulting in almost zero absorption (curcumin is rapidly metabolized and excreted).',
      'Using cheap, heavily processed grocery store turmeric powder that has very low curcumin concentrations.',
      'Expecting immediate relief from acute injury; turmeric works cumulatively over days and weeks.'
    ],
    proTips: [
      'Cook wild salmon with a turmeric-black-pepper rub to create the ultimate joint-recovery, anti-inflammatory main dish.',
      'Drink "Golden Milk" in the evening to soothe sore muscles, lower cortisol, and promote deep, restorative sleep.'
    ],
    conditioning: [
      'Golden Recovery Milk: Warm 1 cup coconut milk, whisk in 1/2 tsp turmeric powder, a pinch of black pepper, 1/2 tsp ginger, 1/2 tsp cinnamon, and 1 tsp raw honey.'
    ],
    combinations: [{ name: 'Synergistic Recovery Block (Turmeric + Salmon)', link: 'salmon' }],
    relatedTechniques: ['salmon', 'ginger', 'ashwagandha']
  },
  'chicken-breast': {
    id: 'chicken-breast',
    image: '/images/foods/chicken-breast.jpg',
    name: 'Chicken Breast',
    category: 'Macronutrients',
    difficulty: 'beginner',
    stance: 'both',
    trainingFormat: ['grilled', 'baked', 'poached'],
    muscles: ['chest', 'triceps', 'biceps', 'upper-back'],
    description: 'The leanest mainstream complete protein source, delivering roughly 31g of protein per 100g with minimal fat. Chicken breast provides the highest protein density per calorie of any common whole food, making it the cornerstone of hypertrophy and body-recomposition diets for athletes across every discipline.',
    whenToUse: 'Eat as a primary protein source in post-workout meals or any meal where lean protein intake needs to be maximized without excess dietary fat.',
    coachingCues: ['Brine in salt water for 30 minutes before cooking to lock in moisture and prevent dryness.', 'Use a meat thermometer—pull at 165°F internal to avoid overcooking.', 'Choose organic, pasture-raised chicken to avoid antibiotic residues and improve Omega-3 content.'],
    steps: [
      'Gastric acid and pepsin denature chicken proteins, unfolding their tightly coiled structures into linear peptide chains.',
      'Pancreatic proteases (trypsin, chymotrypsin, elastase) hydrolyze peptides into free amino acids and di/tri-peptides in the duodenum.',
      'Amino acids are absorbed via active transport in the jejunum, entering the hepatic portal vein for systemic distribution.',
      'High leucine content activates the mTORC1 signaling cascade in skeletal muscle, initiating ribosomal assembly for muscle protein synthesis.'
    ],
    mistakes: [
      'Overcooking until dry and rubbery, which denatures proteins excessively and makes the meat harder to digest.',
      'Relying exclusively on chicken breast while ignoring organ meats and fatty fish that provide essential micronutrients chicken lacks.',
      'Eating processed chicken products (nuggets, deli slices) loaded with sodium, fillers, and inflammatory seed oils.'
    ],
    proTips: [
      'Butterfly and pound chicken breast to an even thickness before cooking for perfectly uniform doneness and maximum tenderness.',
      'Marinate in Greek yogurt with turmeric and garlic for 2+ hours—the lactic acid tenderizes while adding probiotics and anti-inflammatory compounds.'
    ],
    conditioning: [
      'Athlete\'s Grilled Chicken Bowl: Grill 6oz chicken breast seasoned with smoked paprika, garlic powder, and sea salt. Slice over brown rice, steamed broccoli, and a drizzle of extra virgin olive oil.'
    ],
    combinations: [{ name: 'Lean Protein + Slow Carb Recovery (Chicken + Brown Rice)', link: 'brown-rice' }],
    relatedTechniques: ['eggs', 'whey-isolate', 'wild-tuna']
  },
  'greek-yogurt': {
    id: 'greek-yogurt',
    image: '/images/foods/greek-yogurt.jpg',
    name: 'Greek Yogurt',
    category: 'Macronutrients',
    difficulty: 'beginner',
    stance: 'both',
    trainingFormat: ['raw', 'smoothie', 'bowl'],
    muscles: ['abs', 'upper-back', 'biceps', 'lower-back'],
    description: 'A strained dairy product rich in casein protein, which digests slowly over 6-8 hours, providing a sustained drip-feed of amino acids to recovering muscles. Greek yogurt also contains live probiotic cultures (Lactobacillus, Streptococcus) that strengthen gut barrier integrity and improve overall nutrient absorption.',
    whenToUse: 'Consume before bed to fuel overnight muscle protein synthesis via slow casein release, or as a post-workout base mixed with fast carbs.',
    coachingCues: ['Choose full-fat, plain, unsweetened varieties—flavored versions are loaded with sugar.', 'Look for "live and active cultures" on the label for probiotic benefit.', 'Pair with berries or honey for natural sweetness instead of artificial sweeteners.'],
    steps: [
      'Casein protein forms a gel-like clot in the acidic stomach environment, dramatically slowing gastric emptying.',
      'Slow-released peptides are gradually cleaved by pancreatic proteases over 6-8 hours, providing sustained aminoacidemia.',
      'Calcium and phosphorus are absorbed in the small intestine, reinforcing bone mineral density and muscle contraction capacity.',
      'Live probiotic cultures colonize the large intestine, producing short-chain fatty acids (butyrate) that reduce gut inflammation and improve immune signaling.'
    ],
    mistakes: [
      'Buying flavored Greek yogurt with 15-20g of added sugar per serving, which negates the metabolic benefits.',
      'Choosing fat-free versions—the removal of fat reduces satiety and impairs absorption of fat-soluble vitamins A, D, and K2.',
      'Heating Greek yogurt in cooking, which kills the live probiotic cultures that provide gut health benefits.'
    ],
    proTips: [
      'Mix Greek yogurt with whey isolate and frozen berries for a dessert-like recovery meal that delivers both fast (whey) and slow (casein) protein streams.',
      'Use as overnight oats base: combine with rolled oats, chia seeds, and honey the night before for a pre-made slow-release breakfast.'
    ],
    conditioning: [
      'Anabolic Night Bowl: 200g full-fat plain Greek yogurt, 1 tbsp raw honey, 2 tbsp crushed walnuts, a handful of wild blueberries, and a sprinkle of cinnamon.'
    ],
    combinations: [{ name: 'Dual-Protein Recovery (Greek Yogurt + Whey Isolate)', link: 'whey-isolate' }],
    relatedTechniques: ['whey-isolate', 'oatmeal', 'blueberries']
  },
  'quinoa': {
    id: 'quinoa',
    image: '/images/foods/quinoa.jpg',
    name: 'Quinoa',
    category: 'Macronutrients',
    difficulty: 'beginner',
    stance: 'both',
    trainingFormat: ['boiled', 'steamed', 'baked'],
    muscles: ['quadriceps', 'gluteal', 'hamstring', 'abs'],
    description: 'A pseudo-cereal seed that is one of the rare plant foods containing all nine essential amino acids, making it a complete protein. Quinoa delivers complex carbohydrates, dietary fiber, iron, magnesium, and B-vitamins in a single food, making it the premier grain alternative for plant-based athletes seeking muscle recovery and sustained energy.',
    whenToUse: 'Use as a carbohydrate and protein base in pre- or post-workout meals, especially for plant-based athletes who need complete amino acid profiles without animal products.',
    coachingCues: ['Rinse quinoa thoroughly before cooking to remove bitter saponin coating.', 'Toast dry quinoa in a pan for 2 minutes before boiling to enhance nutty flavor.', 'Combine with a legume like lentils to further boost the amino acid profile.'],
    steps: [
      'Complex starches are broken down by salivary and pancreatic amylase into maltose and glucose for steady energy release.',
      'Complete protein is hydrolyzed into all nine essential amino acids, absorbed via active transport in the jejunum.',
      'Non-heme iron and magnesium are absorbed in the duodenum, supporting oxygen transport and enzymatic ATP production.',
      'Insoluble fiber reaches the colon intact, feeding beneficial Bifidobacteria and promoting healthy bowel motility.'
    ],
    mistakes: [
      'Skipping the rinse step, leaving bitter saponins on the surface that cause digestive discomfort and an unpleasant taste.',
      'Treating quinoa as a pure carb—it contains significant protein (8g per cup cooked) and should be factored into protein totals.',
      'Cooking with too much water, resulting in mushy texture and nutrient leaching into discarded liquid.'
    ],
    proTips: [
      'Cook quinoa in bone broth instead of water to dramatically increase the mineral and collagen content of the dish.',
      'Batch-cook a large pot at the start of the week and refrigerate—cold quinoa develops resistant starch, which feeds gut bacteria and blunts blood sugar response.'
    ],
    conditioning: [
      'Power Grain Bowl: 1 cup cooked quinoa, 1/2 diced avocado, 4oz grilled chicken breast, roasted sweet potato cubes, a squeeze of lime, and a drizzle of tahini.'
    ],
    combinations: [{ name: 'Complete Plant Protein Stack (Quinoa + Lentils)', link: 'lentils' }],
    relatedTechniques: ['lentils', 'sweet-potato', 'avocado']
  },
  'brown-rice': {
    id: 'brown-rice',
    image: '/images/foods/brown-rice.jpg',
    name: 'Brown Rice',
    category: 'Macronutrients',
    difficulty: 'beginner',
    stance: 'both',
    trainingFormat: ['boiled', 'steamed', 'stir-fried'],
    muscles: ['quadriceps', 'hamstring', 'gluteal', 'calves'],
    description: 'A whole-grain complex carbohydrate that retains its bran and germ layers, providing sustained glucose release, B-vitamins, manganese, selenium, and magnesium. Brown rice is the classic slow-burn fuel for endurance athletes and bodybuilders, delivering steady glycogen replenishment without the insulin volatility of refined grains.',
    whenToUse: 'Consume 2-3 hours before training for sustained energy or post-workout alongside a lean protein source to replenish depleted muscle glycogen.',
    coachingCues: ['Soak brown rice for 30 minutes before cooking to reduce phytic acid and improve mineral absorption.', 'Rinse thoroughly in multiple water changes to reduce inorganic arsenic content.', 'Cook with a higher water ratio (2.5:1) and drain excess water to further reduce arsenic.'],
    steps: [
      'Amylase enzymes in saliva and pancreas break down the intact starch granules into maltose and glucose over a prolonged period.',
      'Glucose is absorbed gradually via SGLT1 transporters, producing a moderate and sustained insulin response.',
      'Insulin drives glucose into muscle cells via GLUT4 transporters, where glycogen synthase chains it into stored glycogen.',
      'Bran fiber passes to the colon, where bacterial fermentation produces butyrate—a short-chain fatty acid that maintains colon health.'
    ],
    mistakes: [
      'Cooking brown rice without rinsing, which fails to remove surface arsenic that concentrates in the bran layer.',
      'Substituting white rice entirely—while white rice has its place post-workout for fast glycogen, brown rice is superior for sustained energy meals.',
      'Eating large portions immediately before training, as the high fiber content slows digestion and can cause bloating mid-session.'
    ],
    proTips: [
      'Cook brown rice, cool it completely, and reheat—this process increases resistant starch content by up to 50%, lowering the glycemic impact and feeding gut microbiota.',
      'Pair with wild-caught salmon and steamed broccoli for the classic bodybuilder meal that optimizes protein synthesis and glycogen replenishment simultaneously.'
    ],
    conditioning: [
      'Athlete\'s Rice Bowl: 1 cup cooked brown rice, 5oz grilled chicken breast, steamed broccoli, a drizzle of sesame oil, tamari, and toasted sesame seeds.'
    ],
    combinations: [{ name: 'Glycogen + Lean Protein (Brown Rice + Chicken Breast)', link: 'chicken-breast' }],
    relatedTechniques: ['chicken-breast', 'sweet-potato', 'lentils']
  },
  'avocado': {
    id: 'avocado',
    image: '/images/foods/avocado.jpg',
    name: 'Avocado',
    category: 'Macronutrients',
    difficulty: 'beginner',
    stance: 'both',
    trainingFormat: ['raw', 'blended', 'baked'],
    muscles: ['abs', 'lower-back', 'gluteal', 'chest'],
    description: 'A nutrient-dense fruit exceptionally rich in monounsaturated oleic acid (the same healthy fat found in olive oil), potassium (more than a banana), fiber, and fat-soluble vitamins E and K. Avocado supports hormone production (especially testosterone), cardiovascular health, and dramatically improves absorption of fat-soluble nutrients from other foods eaten alongside it.',
    whenToUse: 'Include in meals throughout the day, especially alongside nutrient-dense vegetables, to enhance fat-soluble vitamin absorption and support hormonal balance.',
    coachingCues: ['Eat with meals containing fat-soluble vitamins (A, D, E, K) to boost absorption by up to 5x.', 'Choose ripe avocados that yield slightly to gentle pressure for optimal nutrient availability.', 'Do not heat avocado at high temperatures—the delicate fats oxidize quickly.'],
    steps: [
      'Monounsaturated oleic acid is emulsified by bile salts and cleaved by pancreatic lipase in the small intestine.',
      'Free fatty acids are absorbed into enterocytes, re-esterified into triglycerides, and packaged into chylomicrons for lymphatic transport.',
      'Oleic acid is incorporated into cell membranes, increasing membrane fluidity and improving receptor sensitivity for hormones like insulin and testosterone.',
      'Potassium enters cells via Na+/K+-ATPase pumps, maintaining electrical gradients essential for muscle contraction and heart rhythm stability.'
    ],
    mistakes: [
      'Avoiding avocado due to high calorie content—the fats are essential for hormone production and do not promote fat storage when eaten in appropriate portions.',
      'Pairing avocado exclusively with refined carbs (like white toast) rather than with nutrient-dense meals where it amplifies vitamin absorption.',
      'Storing cut avocado improperly, allowing rapid oxidation that degrades beneficial fats and turns flesh brown.'
    ],
    proTips: [
      'Eating half an avocado with your salad increases absorption of carotenoids (like beta-carotene and lycopene) from vegetables by 2-5 times.',
      'Blend half an avocado into your post-workout shake for a creamy texture that adds 15g of healthy fats and 450mg of potassium without any dairy.'
    ],
    conditioning: [
      'Recovery Guacamole Bowl: Mash 1 ripe avocado with lime juice, sea salt, diced tomato, cilantro, and minced jalapeño. Serve with baked sweet potato wedges.'
    ],
    combinations: [{ name: 'Fat-Soluble Vitamin Amplifier (Avocado + Eggs)', link: 'eggs' }],
    relatedTechniques: ['eggs', 'salmon', 'spinach']
  },
  'beef-liver': {
    id: 'beef-liver',
    image: '/images/foods/beef-liver.jpg',
    name: 'Grass-Fed Beef Liver',
    category: 'Macronutrients',
    difficulty: 'intermediate',
    stance: 'both',
    trainingFormat: ['pan-seared', 'pâté', 'capsule'],
    muscles: ['upper-back', 'biceps', 'forearm', 'head'],
    description: 'Nature\'s most nutrient-dense food. Beef liver delivers bioavailable retinol (preformed vitamin A), heme iron, B12, folate, copper, and high-quality complete protein in concentrations unmatched by any other single food. It is the ancestral superfood for combating iron-deficiency anemia, supporting red blood cell production, and fueling intense athletic output.',
    whenToUse: 'Consume 3-4oz servings 1-2 times per week to maintain optimal iron stores, B-vitamin status, and overall micronutrient density.',
    coachingCues: ['Source only from 100% grass-fed, pasture-raised cattle to avoid toxin accumulation.', 'Soak in milk or lemon juice for 30 minutes before cooking to mellow the strong flavor.', 'Do not overcook—liver becomes grainy and bitter when cooked past medium.'],
    steps: [
      'Heme iron is absorbed directly by enterocytes in the duodenum via the HCP1 transporter, bypassing the inhibitors that block plant-based iron.',
      'Retinol (preformed vitamin A) is absorbed with dietary fat and stored in the liver, supporting immune function, vision, and gene expression.',
      'Vitamin B12 binds to intrinsic factor in the stomach and is absorbed in the ileum, fueling red blood cell synthesis and myelin nerve sheath repair.',
      'Folate and copper enter systemic circulation, supporting DNA synthesis for rapid muscle cell turnover and iron metabolism via ceruloplasmin.'
    ],
    mistakes: [
      'Eating liver daily—vitamin A is fat-soluble and accumulates; overconsumption (more than 3 servings/week) can lead to hypervitaminosis A.',
      'Sourcing liver from conventionally raised, grain-fed cattle, which concentrates pesticides and hormones in the organ.',
      'Cooking liver until well-done, which destroys heat-sensitive B-vitamins and creates a tough, unpalatable texture.'
    ],
    proTips: [
      'Freeze liver for 14 days, then grate it frozen directly into ground beef (1:4 ratio) for burgers—you get the micronutrient density without tasting it.',
      'Desiccated grass-fed liver capsules are an excellent alternative for athletes who cannot tolerate the taste but need the micronutrient payload.'
    ],
    conditioning: [
      'Iron-Rich Liver & Onions: Pan-sear 4oz sliced grass-fed liver in grass-fed butter with caramelized onions, fresh thyme, and a splash of balsamic vinegar. Serve with sautéed spinach.'
    ],
    combinations: [{ name: 'Iron Absorption Maximizer (Beef Liver + Spinach)', link: 'spinach' }],
    relatedTechniques: ['spinach', 'eggs', 'salmon']
  },
  'lentils': {
    id: 'lentils',
    image: '/images/foods/lentils.jpg',
    name: 'Lentils',
    category: 'Macronutrients',
    difficulty: 'beginner',
    stance: 'both',
    trainingFormat: ['boiled', 'stew', 'sprouted'],
    muscles: ['quadriceps', 'gluteal', 'abs', 'hamstring'],
    description: 'A plant-based protein and complex carbohydrate powerhouse that delivers 18g of protein and 40g of carbohydrates per cooked cup, alongside resistant starch, folate, iron, and potassium. Lentils produce a uniquely low glycemic response due to their high resistant starch content, making them ideal for blood sugar stability and sustained athletic energy.',
    whenToUse: 'Use as a base for pre-training meals 2-3 hours before exercise, or as a post-workout carb-protein combination for plant-based athletes.',
    coachingCues: ['Soak lentils for 2-4 hours before cooking to reduce lectins and improve digestibility.', 'Red lentils cook fastest (15 min) and are easiest on the gut; green and black lentils hold shape better in salads.', 'Pair with a vitamin C source like lemon juice to dramatically increase non-heme iron absorption.'],
    steps: [
      'Complex carbohydrates and resistant starch are slowly hydrolyzed by amylase enzymes, producing a gradual glucose release with minimal insulin spike.',
      'Plant proteins are broken down into amino acids; while not individually complete, lentils are rich in lysine—the amino acid most grains lack.',
      'Non-heme iron and folate are absorbed in the small intestine, supporting red blood cell production and oxygen delivery to working muscles.',
      'Resistant starch and soluble fiber reach the colon intact, feeding Bifidobacteria which produce butyrate—a key anti-inflammatory short-chain fatty acid.'
    ],
    mistakes: [
      'Eating lentils without soaking or rinsing, which leaves lectins and phytic acid intact, causing bloating and reducing mineral absorption.',
      'Not pairing with a complementary protein source (rice or quinoa) in plant-based diets, missing out on complete amino acid coverage.',
      'Consuming a large portion immediately before high-intensity training, as the high fiber content can cause gastrointestinal distress.'
    ],
    proTips: [
      'Sprouting lentils for 2-3 days increases bioavailable protein by up to 30% and dramatically reduces anti-nutrients like phytic acid.',
      'Cook a large batch of lentil soup at the start of the week—lentils improve in flavor and resistant starch content when cooled and reheated.'
    ],
    conditioning: [
      'athlete\'s Lentil Stew: Simmer 1 cup dried red lentils with diced sweet potato, cumin, turmeric, garlic, and a can of diced tomatoes for 25 minutes. Finish with fresh lemon juice and a drizzle of olive oil.'
    ],
    combinations: [{ name: 'Complete Plant Protein (Lentils + Quinoa)', link: 'quinoa' }],
    relatedTechniques: ['quinoa', 'brown-rice', 'sweet-potato']
  },
  'wild-tuna': {
    id: 'wild-tuna',
    image: '/images/foods/wild-tuna.jpg',
    name: 'Wild-Caught Tuna',
    category: 'Macronutrients',
    difficulty: 'intermediate',
    stance: 'both',
    trainingFormat: ['seared', 'canned', 'raw'],
    muscles: ['chest', 'upper-back', 'biceps', 'triceps'],
    description: 'A high-density protein source delivering 30g of protein per 100g alongside selenium, niacin, and long-chain Omega-3 fatty acids (EPA/DHA). Tuna is prized by athletes for its lean protein profile and convenience, though mercury content requires strategic consumption limits to ensure safety and maximize benefits.',
    whenToUse: 'Consume 2-3 servings per week as a convenient lean protein source in post-workout meals or meal-prep rotations. Limit to avoid methylmercury accumulation.',
    coachingCues: ['Choose skipjack or tongol tuna over albacore—smaller species accumulate significantly less mercury.', 'Select BPA-free canned tuna packed in olive oil or water, never soybean oil.', 'Pair with selenium-rich foods like Brazil nuts, which bind to mercury and aid its excretion.'],
    steps: [
      'Tuna protein is rapidly denatured by gastric acid and cleaved by pepsin into polypeptide fragments.',
      'Pancreatic proteases complete hydrolysis into free amino acids, which are absorbed via active transport in the jejunum with high bioavailability.',
      'Selenium binds to selenoprotein P in the blood, protecting tissues from oxidative damage and directly chelating methylmercury for safe excretion.',
      'Omega-3 EPA and DHA are incorporated into muscle cell membranes, improving membrane fluidity and reducing exercise-induced inflammatory signaling.'
    ],
    mistakes: [
      'Eating large tuna steaks (bigeye, bluefin) daily, which accumulates dangerous methylmercury levels over time.',
      'Buying tuna packed in inflammatory soybean oil, which negates the anti-inflammatory benefits of the Omega-3 content.',
      'Overcooking tuna steaks to well-done, destroying the delicate Omega-3 fatty acids and creating a dry, tough texture.'
    ],
    proTips: [
      'Sear ahi tuna for 60-90 seconds per side to keep the center rare—this preserves maximum Omega-3 integrity and delivers a restaurant-quality protein source.',
      'Eat 1-2 Brazil nuts alongside canned tuna; the selenium content creates a 1:1 molar ratio with mercury, facilitating safe excretion via bile.'
    ],
    conditioning: [
      'Sesame-Crusted Tuna Bowl: Coat 5oz ahi tuna steak in black and white sesame seeds, sear 90 seconds per side. Slice over brown rice, edamame, pickled ginger, and a drizzle of tamari.'
    ],
    combinations: [{ name: 'Omega-3 Protein Rotation (Wild Tuna + Salmon)', link: 'salmon' }],
    relatedTechniques: ['salmon', 'chicken-breast', 'eggs']
  },
  'banana': {
    id: 'banana',
    image: '/images/foods/banana.jpg',
    name: 'Banana',
    category: 'Macronutrients',
    difficulty: 'beginner',
    stance: 'both',
    trainingFormat: ['raw', 'smoothie', 'baked'],
    muscles: ['calves', 'quadriceps', 'hamstring', 'forearm'],
    description: 'A rapidly digestible, potassium-rich fruit that serves as the quintessential pre- and post-workout fuel. Ripe bananas provide fast-acting simple sugars (glucose and fructose) for immediate glycogen replenishment, while their high potassium content (422mg per medium banana) prevents muscle cramping and supports nerve signaling during intense exercise.',
    whenToUse: 'Eat 15-30 minutes before training for quick energy or immediately post-workout blended with protein to spike insulin and accelerate amino acid uptake.',
    coachingCues: ['Use ripe (spotted) bananas pre/post workout for fast sugar; use greener bananas in meals for more resistant starch and slower digestion.', 'Freeze ripe bananas for smoothies—they blend into a creamy, ice-cream-like texture.', 'Pair with a protein source post-workout to maximize the insulin-mediated amino acid shuttle.'],
    steps: [
      'Simple sugars (glucose and fructose) are rapidly absorbed in the small intestine without significant enzymatic breakdown.',
      'Glucose triggers an insulin response that activates GLUT4 transporters, driving glucose directly into depleted muscle cells for glycogen resynthesis.',
      'Fructose is metabolized in the liver, replenishing hepatic glycogen stores that maintain stable blood sugar between meals.',
      'Potassium is absorbed and distributed via Na+/K+-ATPase pumps, restoring the electrochemical gradient across muscle cell membranes to prevent cramping.'
    ],
    mistakes: [
      'Eating a banana as a standalone snack far from training—the fast sugar spike without protein or fat leads to a rapid blood sugar crash.',
      'Using unripe (green) bananas before training expecting quick energy; their starch has not yet converted to sugar and digests slowly.',
      'Relying solely on bananas for potassium while ignoring other electrolytes like sodium and magnesium needed for complete hydration.'
    ],
    proTips: [
      'Blend a frozen banana with whey isolate immediately post-workout—the insulin spike from the banana\'s sugar accelerates amino acid transport into muscle cells by up to 30%.',
      'Mash a ripe banana into oatmeal before a long training session for a dual-speed carbohydrate source: fast glucose from banana + slow glucose from oats.'
    ],
    conditioning: [
      'Pre-Workout Power Shake: Blend 1 ripe banana, 1 scoop whey isolate, 1 tbsp almond butter, 1 cup oat milk, and a pinch of cinnamon until smooth. Drink 20 minutes before training.'
    ],
    combinations: [{ name: 'Insulin Shuttle Recovery (Banana + Whey Isolate)', link: 'whey-isolate' }],
    relatedTechniques: ['whey-isolate', 'oatmeal', 'sweet-potato']
  },
  'watermelon': {
    id: 'watermelon',
    image: '/images/foods/watermelon.jpg',
    name: 'Watermelon',
    category: 'Hydration & Salts',
    difficulty: 'beginner',
    stance: 'both',
    trainingFormat: ['raw', 'juiced', 'frozen'],
    muscles: ['calves', 'quadriceps', 'hamstring', 'forearm'],
    description: 'A hydrating fruit composed of 92% water that is uniquely rich in L-citrulline—an amino acid the kidneys convert to L-arginine, boosting nitric oxide production for vasodilation and improved blood flow. Watermelon also provides natural electrolytes (potassium, magnesium), lycopene (a powerful antioxidant), and fast-acting sugars for rapid rehydration.',
    whenToUse: 'Consume pre-workout for nitric oxide-boosted blood flow or post-workout for rapid rehydration and natural electrolyte replenishment.',
    coachingCues: ['Eat the white rind closest to the skin—it contains the highest concentration of L-citrulline.', 'Juice watermelon and add a pinch of salt for a natural intra-workout hydration drink.', 'Choose deep-red, ripe watermelon for maximum lycopene content.'],
    steps: [
      'L-citrulline is absorbed in the small intestine and transported to the kidneys via the bloodstream.',
      'Renal enzymes convert L-citrulline to L-arginine, which is then used by nitric oxide synthase (NOS) to produce nitric oxide (NO).',
      'Nitric oxide relaxes vascular smooth muscle, dilating arteries and increasing blood flow and oxygen delivery to active muscles.',
      'Natural sugars rapidly restore blood glucose while potassium and magnesium replenish intracellular electrolyte stores lost through sweat.'
    ],
    mistakes: [
      'Discarding the rind, which contains 60% more citrulline than the red flesh.',
      'Drinking watermelon juice with added sugar, which negates the natural hydration benefits with unnecessary insulin spikes.',
      'Consuming large amounts immediately before intense exercise—the high water and fiber content can cause sloshing and GI discomfort.'
    ],
    proTips: [
      'Blend watermelon (including some rind) with a pinch of pink salt and fresh lime for a natural pre-workout vasodilator drink that rivals synthetic citrulline supplements.',
      'Freeze watermelon cubes and use them as hydrating "ice" in your intra-workout water bottle for slow electrolyte release throughout training.'
    ],
    conditioning: [
      'Nitric Oxide Hydrator: Blend 2 cups watermelon (with some white rind), juice of 1 lime, 1/4 tsp Himalayan pink salt, and fresh mint leaves. Serve over ice.'
    ],
    combinations: [{ name: 'Vasodilation Stack (Watermelon + Beetroot Juice)', link: 'beetroot-juice' }],
    relatedTechniques: ['beetroot-juice', 'coconut-water', 'pink-salt']
  },
  'bone-broth': {
    id: 'bone-broth',
    image: '/images/foods/bone-broth.jpg',
    name: 'Bone Broth',
    category: 'Hydration & Salts',
    difficulty: 'intermediate',
    stance: 'both',
    trainingFormat: ['sipped', 'soup-base', 'cooked'],
    muscles: ['lower-back', 'neck', 'forearm', 'calves'],
    description: 'A mineral-rich liquid made by simmering animal bones for 12-24+ hours, extracting collagen peptides, glycine, proline, hyaluronic acid, glucosamine, chondroitin, and bioavailable minerals (calcium, magnesium, phosphorus). Bone broth is the premier whole-food joint recovery and gut-healing agent, providing the raw materials for connective tissue repair and intestinal lining integrity.',
    whenToUse: 'Drink 1-2 cups daily, especially post-training or before bed, to support joint recovery, gut lining repair, and deep sleep via glycine.',
    coachingCues: ['Simmer bones for a minimum of 12 hours (24 for beef bones) to fully extract collagen and minerals.', 'Add 2 tbsp apple cider vinegar during cooking to draw minerals from bones into the liquid.', 'Use a mix of joint bones, marrow bones, and knuckles for the most complete collagen profile.'],
    steps: [
      'Collagen peptides (proline, glycine, hydroxyproline) are absorbed as di- and tri-peptides in the small intestine via PepT1 transporters.',
      'Glycine acts as an inhibitory neurotransmitter in the brain, lowering core body temperature and promoting deep restorative sleep.',
      'Proline and hydroxyproline are transported to fibroblasts in tendons, ligaments, and cartilage, serving as direct building blocks for new collagen synthesis.',
      'Glucosamine and chondroitin sulfate are absorbed and concentrated in synovial fluid, reducing joint friction and inflammatory degradation of cartilage.'
    ],
    mistakes: [
      'Simmering for less than 8 hours, which extracts flavor but fails to break down collagen into bioavailable peptides.',
      'Using bones from conventionally raised animals that may contain antibiotic residues and heavy metals.',
      'Adding excessive salt during cooking—the broth naturally contains sodium; over-salting creates an imbalanced electrolyte profile.'
    ],
    proTips: [
      'Drink a warm cup of bone broth 30 minutes before bed—the 3g+ of glycine per cup acts as a natural sleep aid and accelerates joint recovery overnight.',
      'Use bone broth as the cooking liquid for rice and quinoa to infuse every grain with collagen peptides and trace minerals.'
    ],
    conditioning: [
      'Restorative Bone Broth: Simmer 2 lbs grass-fed beef marrow and knuckle bones with 2 tbsp ACV, 1 onion, 2 carrots, 3 celery stalks, peppercorns, and bay leaves in 12 cups water for 24 hours. Strain and season with sea salt.'
    ],
    combinations: [{ name: 'Joint Recovery Protocol (Bone Broth + Turmeric)', link: 'turmeric' }],
    relatedTechniques: ['turmeric', 'coconut-water', 'pink-salt']
  },
  'tart-cherry-juice': {
    id: 'tart-cherry-juice',
    image: '/images/foods/tart-cherry-juice.jpg',
    name: 'Tart Cherry Juice',
    category: 'Hydration & Salts',
    difficulty: 'beginner',
    stance: 'both',
    trainingFormat: ['raw', 'concentrate', 'smoothie'],
    muscles: ['hamstring', 'quadriceps', 'calves', 'lower-back'],
    description: 'A potent recovery beverage derived from Montmorency tart cherries, rich in anthocyanins, natural melatonin, and phenolic compounds. Clinical studies show tart cherry juice significantly reduces Delayed Onset Muscle Soreness (DOMS), accelerates strength recovery after eccentric exercise, and improves sleep quality and duration through its natural melatonin content.',
    whenToUse: 'Drink 8-12oz of tart cherry juice (or 1oz concentrate) twice daily—morning and 30 minutes before bed—during heavy training blocks to reduce DOMS and improve sleep.',
    coachingCues: ['Use 100% pure tart cherry juice or concentrate with no added sugars.', 'Montmorency variety has the highest anthocyanin and melatonin content—check the label.', 'Begin supplementing 4-5 days before a major competition or heavy training block for cumulative benefit.'],
    steps: [
      'Anthocyanin pigments are absorbed in the stomach and small intestine, entering circulation and concentrating in muscle and joint tissues.',
      'Anthocyanins inhibit COX-1 and COX-2 inflammatory enzymes, reducing prostaglandin-mediated inflammation and muscle soreness (DOMS).',
      'Natural melatonin crosses the blood-brain barrier and binds to MT1/MT2 receptors in the suprachiasmatic nucleus, regulating circadian rhythm and promoting deep sleep onset.',
      'Phenolic acids act as systemic antioxidants, neutralizing exercise-induced reactive oxygen species (ROS) and accelerating muscle fiber repair between sessions.'
    ],
    mistakes: [
      'Buying sweetened cherry juice cocktails with added sugar that cause inflammation and negate the anti-inflammatory benefits.',
      'Drinking only on the day of a hard workout—tart cherry juice works cumulatively and needs 3-5 days of consistent use for full effect.',
      'Using tart cherry juice as an NSAID replacement for acute injury; it reduces soreness but does not treat structural damage.'
    ],
    proTips: [
      'Mix 1oz tart cherry concentrate with 8oz of casein protein shake before bed for the ultimate sleep-and-recovery protocol: melatonin for sleep + slow-release protein for overnight MPS.',
      'Consuming tart cherry juice consistently during a peaking phase (5-7 days pre-competition) has been shown to reduce perceived exertion and maintain power output in repeated sprint efforts.'
    ],
    conditioning: [
      'Nighttime Recovery Elixir: Mix 1oz Montmorency tart cherry concentrate, 8oz warm water, 1/2 tsp raw honey, and a pinch of cinnamon. Drink 30 minutes before sleep.'
    ],
    combinations: [{ name: 'Anti-DOMS Sleep Stack (Tart Cherry + Greek Yogurt)', link: 'greek-yogurt' }],
    relatedTechniques: ['greek-yogurt', 'whey-isolate', 'blueberries']
  },
  'green-tea': {
    id: 'green-tea',
    image: '/images/foods/green-tea.jpg',
    name: 'Green Tea',
    category: 'Hydration & Salts',
    difficulty: 'beginner',
    stance: 'both',
    trainingFormat: ['brewed', 'matcha', 'cold-brew'],
    muscles: ['head', 'abs', 'quadriceps', 'calves'],
    description: 'A minimally oxidized tea leaf rich in catechins (especially EGCG—epigallocatechin gallate) and L-theanine. EGCG enhances fat oxidation during exercise by inhibiting catechol-O-methyltransferase (COMT), prolonging norepinephrine activity. L-theanine simultaneously promotes alpha brainwave activity, creating a state of calm, focused alertness without the jitters of pure caffeine.',
    whenToUse: 'Drink 1-2 cups 30-60 minutes before training for enhanced fat oxidation and calm focus, or throughout the morning as a sustained low-caffeine cognitive enhancer.',
    coachingCues: ['Brew at 160-175°F (not boiling) for 2-3 minutes to extract catechins without excessive bitterness.', 'Add a squeeze of lemon—vitamin C stabilizes catechins in the gut and increases absorption.', 'Choose ceremonial-grade matcha for the highest EGCG and L-theanine concentration per serving.'],
    steps: [
      'EGCG catechins are absorbed in the small intestine and enter the bloodstream, where they inhibit COMT enzyme activity.',
      'COMT inhibition prolongs the half-life of norepinephrine, sustaining its activation of lipase enzymes that release stored fatty acids from adipose tissue for oxidation.',
      'L-theanine crosses the blood-brain barrier and increases alpha brainwave activity, promoting relaxed focus without drowsiness.',
      'Caffeine and L-theanine synergize: caffeine provides alertness while theanine smooths the stimulant curve, eliminating jitters and crash.'
    ],
    mistakes: [
      'Brewing green tea with boiling water, which denatures delicate catechins and produces an excessively bitter, astringent brew.',
      'Adding milk or cream—casein proteins bind to catechins and significantly reduce their bioavailability and antioxidant activity.',
      'Drinking on an empty stomach in large quantities, which can cause nausea due to tannin-induced stomach acid stimulation.'
    ],
    proTips: [
      'Replace your pre-workout coffee with ceremonial-grade matcha: you get the caffeine boost plus 10x the EGCG of regular green tea and sustained L-theanine focus without an energy crash.',
      'Cold-brew green tea overnight (8-12 hours in the fridge) for a smoother, less bitter drink with higher L-theanine extraction and lower caffeine release.'
    ],
    conditioning: [
      'Focus Fuel Matcha Latte: Whisk 1 tsp ceremonial-grade matcha with 2oz hot water until frothy, then pour over 8oz steamed oat milk with 1/2 tsp raw honey and a pinch of cinnamon.'
    ],
    combinations: [{ name: 'Calm Focus Protocol (Green Tea + Lion\'s Mane)', link: 'lions-mane' }],
    relatedTechniques: ['lions-mane', 'blueberries', 'turmeric']
  },
  'sweet-peppers': {
    id: 'sweet-peppers',
    image: '/images/foods/sweet-peppers.jpg',
    name: 'Sweet Peppers',
    category: 'Micronutrients',
    difficulty: 'beginner',
    stance: 'both',
    trainingFormat: ['raw', 'roasted', 'stir-fried'],
    muscles: ['abs', 'forearm', 'front-deltoids'],
    description: 'Bell peppers are among the most vitamin-C-dense foods on the planet, delivering nearly 3x the ascorbic acid of an orange per gram. Red varieties also contain capsanthin and beta-cryptoxanthin carotenoids that support eye health and systemic antioxidant defense. The trace capsaicin in sweet varieties mildly stimulates thermogenesis and metabolic rate without the intense heat of chili peppers.',
    whenToUse: 'Eat 1 medium raw bell pepper daily as a snack or sliced into salads and wraps to hit your full daily vitamin C requirement in a single serving.',
    coachingCues: ['Choose red over green—red peppers have 1.5x more vitamin C and 11x more beta-carotene.', 'Eat raw when possible; cooking degrades heat-sensitive vitamin C by 25-30%.', 'Pair with a fat source like hummus or olive oil to maximize carotenoid absorption.'],
    steps: [
      'Ascorbic acid (vitamin C) is absorbed in the small intestine via SVCT1 transporters and enters the bloodstream as a water-soluble antioxidant.',
      'Vitamin C acts as a cofactor for prolyl hydroxylase and lysyl hydroxylase, essential enzymes in collagen synthesis for tendon, ligament, and skin repair.',
      'Capsanthin and beta-cryptoxanthin carotenoids are incorporated into cell membranes where they quench lipid peroxyl radicals, protecting against oxidative damage.',
      'Trace capsaicin binds TRPV1 receptors, mildly activating sympathetic nervous system thermogenesis and increasing resting metabolic rate by 4-5%.'
    ],
    mistakes: [
      'Cooking peppers at high heat for too long, destroying up to 50% of their vitamin C content through thermal degradation.',
      'Only eating green peppers—they are unripe and contain significantly less vitamin C, carotenoids, and sweetness than red or yellow varieties.',
      'Discarding the white pith and seeds, which contain quercetin and additional bioflavonoids that enhance vitamin C absorption.'
    ],
    proTips: [
      'Eat a raw red bell pepper 60 minutes before training: the massive vitamin C dose supports cortisol regulation during high-intensity exercise, blunting excessive stress hormone response.',
      'Combine diced red pepper with iron-rich foods like spinach or lentils—vitamin C converts non-heme iron to its ferrous (Fe²⁺) form, boosting absorption by up to 6x.'
    ],
    conditioning: [
      'Athlete\'s Recovery Crunch Wrap: Slice 1 large red bell pepper into strips, fill with 4oz grilled chicken, 2 tbsp hummus, diced cucumber, and a squeeze of lemon. Roll in a whole-grain tortilla.'
    ],
    combinations: [{ name: 'Iron Absorption Stack (Sweet Peppers + Spinach)', link: 'spinach' }],
    relatedTechniques: ['spinach', 'broccoli', 'turmeric']
  },
  'broccoli': {
    id: 'broccoli',
    image: '/images/foods/broccoli.jpg',
    name: 'Broccoli',
    category: 'Micronutrients',
    difficulty: 'beginner',
    stance: 'both',
    trainingFormat: ['steamed', 'roasted', 'raw'],
    muscles: ['abs', 'chest', 'quadriceps'],
    description: 'A cruciferous powerhouse containing sulforaphane, a potent activator of the Nrf2 antioxidant pathway, and diindolylmethane (DIM), which promotes healthy estrogen metabolism by favoring 2-hydroxy estrone over the more proliferative 16-alpha-hydroxy estrone. Broccoli also delivers substantial vitamin K1, folate, and chromium for insulin sensitivity support.',
    whenToUse: 'Consume 1-2 cups of lightly steamed broccoli daily with protein meals to support detox pathways, estrogen balance, and micronutrient density.',
    coachingCues: ['Chop broccoli and let it sit 5-10 minutes before cooking to activate myrosinase and maximize sulforaphane formation.', 'Steam lightly (3-4 minutes) rather than boiling—boiling leaches up to 70% of glucosinolates into water.', 'Add a pinch of mustard seed powder to cooked broccoli to restore myrosinase activity destroyed by heat.'],
    steps: [
      'Chewing or chopping breaks broccoli cell walls, allowing myrosinase enzyme to convert glucoraphanin into sulforaphane.',
      'Sulforaphane activates the Nrf2 transcription factor, which translocates to the nucleus and upregulates Phase II detoxification enzymes (glutathione S-transferase, NQO1).',
      'DIM is formed from indole-3-carbinol in the stomach and modulates cytochrome P450 enzymes, shifting estrogen metabolism toward the protective 2-hydroxy pathway.',
      'Vitamin K1 is absorbed in the jejunum and serves as a cofactor for gamma-glutamyl carboxylase, activating osteocalcin and matrix Gla protein for bone mineralization.'
    ],
    mistakes: [
      'Boiling broccoli for extended periods, which destroys myrosinase and leaches sulforaphane precursors into the cooking water.',
      'Microwaving at high power without water, which can degrade glucosinolates more aggressively than gentle steaming.',
      'Ignoring the stalks—broccoli stems contain the same glucosinolates as florets and are equally nutritious when peeled and cooked.'
    ],
    proTips: [
      'Add 1/2 tsp of mustard seed powder to your broccoli after cooking: the exogenous myrosinase restores sulforaphane conversion lost during heating, increasing yield by up to 4x.',
      'Eat broccoli with your post-workout protein meal—the chromium content enhances insulin receptor sensitivity, improving glucose uptake into recovering muscle cells.'
    ],
    conditioning: [
      'Anabolic Green Bowl: Steam 2 cups broccoli florets for 4 minutes, toss with 1 tbsp olive oil, 1 clove minced garlic, squeeze of lemon, pinch of mustard powder, and serve over 1 cup brown rice with 6oz grilled salmon.'
    ],
    combinations: [{ name: 'Detox Cruciferous Stack (Broccoli + Sweet Peppers)', link: 'sweet-peppers' }],
    relatedTechniques: ['sweet-peppers', 'spinach', 'sweet-potato']
  },
  'brazil-nuts': {
    id: 'brazil-nuts',
    image: '/images/foods/brazil-nuts.jpg',
    name: 'Brazil Nuts',
    category: 'Micronutrients',
    difficulty: 'beginner',
    stance: 'both',
    trainingFormat: ['raw', 'dry-roasted', 'blended'],
    muscles: ['trapezius', 'neck', 'forearm'],
    description: 'The single most concentrated dietary source of selenium on Earth—a single Brazil nut can contain 70-90 mcg, exceeding the RDA. Selenium is essential for thyroid hormone conversion (T4 to active T3), glutathione peroxidase antioxidant activity, and selenoprotein P synthesis for systemic antioxidant defense. They also provide substantial magnesium, phosphorus, and healthy monounsaturated fats.',
    whenToUse: 'Eat 2-3 Brazil nuts daily (no more) to meet your full selenium requirement and support thyroid function, testosterone production, and antioxidant defense.',
    coachingCues: ['Limit intake to 2-3 nuts per day—selenium toxicity (selenosis) can occur at sustained intakes above 400 mcg/day.', 'Store in the refrigerator to prevent the high polyunsaturated fat content from going rancid.', 'Buy shelled, whole nuts and check for a fresh, slightly sweet smell—rancid nuts taste bitter and lose nutritional value.'],
    steps: [
      'Selenomethionine from Brazil nuts is absorbed in the small intestine via methionine transporters and enters the selenium metabolic pool.',
      'The liver converts selenomethionine into selenocysteine, the 21st amino acid, which is incorporated into 25 different selenoproteins including glutathione peroxidase (GPx).',
      'GPx enzymes catalyze the reduction of hydrogen peroxide and lipid hydroperoxides to water and alcohols, protecting cell membranes from oxidative damage.',
      'Type I iodothyronine deiodinase, a selenoenzyme, converts inactive thyroid hormone T4 to active T3 in peripheral tissues, regulating basal metabolic rate and thermogenesis.'
    ],
    mistakes: [
      'Eating a handful (10+) of Brazil nuts daily, risking selenium toxicity with symptoms including hair loss, nail brittleness, garlic breath, and neurological issues.',
      'Buying pre-chopped or sliced Brazil nuts that have oxidized—whole nuts in the shell retain selenium and fats much longer.',
      'Assuming all nuts are equivalent for selenium; other tree nuts contain negligible selenium compared to Brazil nuts.'
    ],
    proTips: [
      'Eat your 2-3 Brazil nuts alongside a meal containing iodine (seaweed, fish) to synergistically support both thyroid hormone production (iodine) and activation (selenium-dependent deiodinase).',
      'Blend 2 Brazil nuts into your morning smoothie for a creamy texture plus the full daily selenium dose without the need for any supplement.'
    ],
    conditioning: [
      'Thyroid Support Trail Mix: Combine 3 Brazil nuts (halved), 10 raw almonds, 2 tbsp pumpkin seeds, 2 tbsp dried goji berries, and 1 tbsp dark chocolate chips. Portion into a small container for daily snacking.'
    ],
    combinations: [{ name: 'Thyroid Activation Stack (Brazil Nuts + Sardines)', link: 'sardines' }],
    relatedTechniques: ['sardines', 'sweet-peppers', 'spinach']
  },
  'sardines': {
    id: 'sardines',
    image: '/images/foods/sardines.jpg',
    name: 'Sardines',
    category: 'Micronutrients',
    difficulty: 'beginner',
    stance: 'both',
    trainingFormat: ['canned', 'grilled', 'smoked'],
    muscles: ['upper-back', 'calves', 'head'],
    description: 'One of the most nutrient-dense foods available—sardines deliver bioavailable calcium from edible bones, preformed vitamin D3, EPA/DHA omega-3 fatty acids, and complete protein in a single small, sustainable fish. Their position low on the food chain means negligible mercury accumulation compared to larger predatory fish like tuna or swordfish.',
    whenToUse: 'Eat one 3.75oz can of sardines 3-4 times per week as a protein source to simultaneously cover calcium, vitamin D, and omega-3 needs without mercury concern.',
    coachingCues: ['Choose sardines packed in olive oil for additional monounsaturated fat and better flavor, or in water for a leaner option.', 'Eat the bones—they are soft, edible, and provide 35% of your daily calcium per can.', 'Wild-caught sardines are always preferable; they are inherently low in contaminants due to short lifespan and low food chain position.'],
    steps: [
      'EPA and DHA omega-3 fatty acids are absorbed in the small intestine and incorporated into cell membrane phospholipids throughout the body.',
      'EPA competes with arachidonic acid as a substrate for COX and LOX enzymes, producing anti-inflammatory series-3 prostaglandins and series-5 leukotrienes that resolve exercise-induced inflammation.',
      'Calcium hydroxyapatite from sardine bones is absorbed in the duodenum via vitamin D-dependent calbindin transport and deposited into bone matrix by osteoblasts.',
      'Preformed vitamin D3 (cholecalciferol) bypasses the UV-dependent skin synthesis step, directly entering hepatic 25-hydroxylation for systemic calcium regulation and immune modulation.'
    ],
    mistakes: [
      'Discarding the bones by buying boneless fillets—this eliminates the primary calcium benefit that makes sardines uniquely valuable.',
      'Choosing sardines packed in soybean or cottonseed oil, which adds excess omega-6 and negates the anti-inflammatory omega-3 ratio benefit.',
      'Eating sardines only occasionally—the omega-3 and vitamin D benefits require consistent intake 3-4 times per week to maintain tissue levels.'
    ],
    proTips: [
      'Mash canned sardines (bones included) with avocado, lemon juice, and diced red onion for a high-protein, calcium-rich "sardine guac" that makes the bones completely undetectable.',
      'Pair sardines with a vitamin K2-rich food like natto or hard cheese: vitamin D enhances calcium absorption while K2 directs calcium into bones and away from arteries.'
    ],
    conditioning: [
      'Mediterranean Sardine Power Plate: Drain 1 can sardines in olive oil, arrange on a plate with 1/2 sliced avocado, 10 cherry tomatoes, 1/4 cup olives, 2 tbsp capers, and a drizzle of lemon-herb vinaigrette. Serve with sourdough toast.'
    ],
    combinations: [{ name: 'Bone Density Stack (Sardines + Greek Yogurt)', link: 'greek-yogurt' }],
    relatedTechniques: ['brazil-nuts', 'greek-yogurt', 'salmon']
  },
  'dark-chocolate': {
    id: 'dark-chocolate',
    image: '/images/foods/dark-chocolate.jpg',
    name: 'Dark Chocolate',
    category: 'Micronutrients',
    difficulty: 'beginner',
    stance: 'both',
    trainingFormat: ['raw', 'melted', 'blended'],
    muscles: ['head', 'biceps', 'calves'],
    description: 'High-cacao dark chocolate (70%+) is a concentrated source of theobromine, a mild vasodilator and bronchodilator that enhances blood flow without the jittery stimulation of caffeine. It also delivers significant magnesium (64mg per oz), iron, and flavanol antioxidants (epicatechin) that stimulate nitric oxide production and improve endothelial function for sustained cardiovascular performance.',
    whenToUse: 'Consume 1-1.5oz of 70-85% dark chocolate daily as an afternoon snack or post-dinner treat to support blood flow, magnesium intake, and mood via serotonin precursor delivery.',
    coachingCues: ['Choose 70% cacao or higher—milk chocolate has negligible flavanol content and excessive sugar.', 'Look for "bean-to-bar" or minimally processed chocolate that retains more epicatechin flavanols.', 'Avoid "Dutch-processed" or alkalized cocoa—the alkalizing process destroys up to 90% of beneficial flavanols.'],
    steps: [
      'Theobromine is absorbed in the small intestine and acts as a phosphodiesterase inhibitor, increasing intracellular cAMP and relaxing vascular smooth muscle for vasodilation.',
      'Epicatechin flavanols stimulate endothelial nitric oxide synthase (eNOS), increasing nitric oxide production and improving blood vessel dilation and oxygen delivery to working muscles.',
      'Magnesium ions are absorbed and serve as cofactors for 300+ enzymatic reactions including ATP synthesis, muscle relaxation (SERCA pump function), and nervous system regulation.',
      'Tryptophan and phenylethylamine in cacao cross the blood-brain barrier, supporting serotonin and dopamine synthesis for mood elevation and stress resilience.'
    ],
    mistakes: [
      'Choosing milk chocolate or chocolate with less than 70% cacao, which is high in sugar and contains minimal theobromine or flavanols.',
      'Consuming Dutch-processed cocoa thinking it is equivalent to natural cocoa—alkalization destroys the majority of polyphenol antioxidants.',
      'Eating dark chocolate close to bedtime in large amounts—theobromine has a 7-hour half-life and can disrupt sleep in sensitive individuals.'
    ],
    proTips: [
      'Melt 1oz of 85% dark chocolate and drizzle over frozen banana slices with a sprinkle of sea salt for a magnesium-rich, vasodilating post-workout dessert.',
      'Pair dark chocolate with a handful of almonds: the magnesium in both compounds synergistically, and the fat in almonds slows absorption for sustained epicatechin delivery to the endothelium.'
    ],
    conditioning: [
      'Performance Cacao Smoothie: Blend 1 tbsp raw cacao powder, 1 frozen banana, 1 scoop whey protein, 1 tbsp almond butter, 8oz oat milk, and 1/2 tsp cinnamon until smooth.'
    ],
    combinations: [{ name: 'Vasodilation Stack (Dark Chocolate + Beet Juice)', link: 'beet-juice' }],
    relatedTechniques: ['beet-juice', 'blueberries', 'green-tea']
  },
  'sauerkraut': {
    id: 'sauerkraut',
    image: '/images/foods/sauerkraut.jpg',
    name: 'Sauerkraut',
    category: 'Gut & Digestion',
    difficulty: 'intermediate',
    stance: 'both',
    trainingFormat: ['raw', 'fermented', 'side-dish'],
    muscles: ['abs', 'obliques'],
    description: 'Raw fermented cabbage and the undisputed Lactobacillus density champion among whole foods, containing up to 10 billion CFU per serving of diverse probiotic strains including L. plantarum, L. brevis, and L. mesenteroides. The lacto-fermentation process also produces organic acids, vitamin C, vitamin K2, and bioavailable B-vitamins while pre-digesting fiber for enhanced gut tolerance.',
    whenToUse: 'Eat 2-4 tablespoons of raw, unpasteurized sauerkraut with meals daily to establish and maintain a diverse gut microbiome and improve digestive efficiency.',
    coachingCues: ['Always choose raw, unpasteurized sauerkraut from the refrigerated section—shelf-stable versions are heat-treated and contain zero live probiotics.', 'Start with 1 tablespoon per day and increase gradually to avoid gas and bloating from rapid microbiome shifts.', 'Add sauerkraut to meals after cooking—heat kills the beneficial bacteria.'],
    steps: [
      'Lactobacillus bacteria from sauerkraut survive stomach acid (pH 1.5-3.5) and colonize the intestinal mucosa, competing with pathogenic bacteria for adhesion sites.',
      'Established Lactobacillus colonies produce lactic acid that lowers intestinal pH, creating an environment hostile to harmful bacteria like Clostridium and E. coli.',
      'Short-chain fatty acids (SCFAs—butyrate, propionate, acetate) are produced by bacterial fermentation of sauerkraut fiber, nourishing colonocytes and strengthening the intestinal barrier.',
      'Vitamin K2 (menaquinone) produced during fermentation activates osteocalcin for bone calcium deposition and matrix Gla protein for arterial calcification prevention.'
    ],
    mistakes: [
      'Buying pasteurized sauerkraut from the shelf-stable aisle—pasteurization kills all probiotic bacteria and eliminates the primary gut health benefit.',
      'Cooking sauerkraut at high heat before eating, which destroys the live Lactobacillus cultures and heat-sensitive vitamins.',
      'Starting with large servings immediately, causing gas, bloating, and discomfort as the existing microbiome adjusts to the influx of new bacterial strains.'
    ],
    proTips: [
      'Drink 1-2 tablespoons of sauerkraut brine (the liquid in the jar) on an empty stomach each morning—it is loaded with concentrated probiotics and organic acids that prime digestive enzyme secretion.',
      'Layer sauerkraut on top of meals after plating (never cook it into the dish) to preserve maximum live culture count and enzymatic activity.'
    ],
    conditioning: [
      'Probiotic Power Bowl: Top 1 cup cooked quinoa with 4oz grilled chicken, 1/4 cup raw sauerkraut, 1/2 sliced avocado, drizzle of tahini, and a sprinkle of sesame seeds.'
    ],
    combinations: [{ name: 'Gut Restoration Protocol (Sauerkraut + Kimchi)', link: 'kimchi' }],
    relatedTechniques: ['kimchi', 'miso', 'greek-yogurt']
  },
  'kimchi': {
    id: 'kimchi',
    image: '/images/foods/kimchi.jpg',
    name: 'Kimchi',
    category: 'Gut & Digestion',
    difficulty: 'intermediate',
    stance: 'both',
    trainingFormat: ['raw', 'fermented', 'side-dish'],
    muscles: ['abs', 'obliques', 'quadriceps'],
    description: 'Korea\'s legendary spicy fermented vegetable medley—typically napa cabbage with gochugaru chili, garlic, ginger, and fish sauce—harboring diverse probiotic strains including Lactobacillus kimchii (unique to this ferment). The capsaicin from chili flakes boosts thermogenesis, while the garlic provides allicin for antimicrobial defense. Kimchi also delivers substantial vitamin K, vitamin C, and prebiotic fiber.',
    whenToUse: 'Consume 1/4 to 1/2 cup of traditionally fermented kimchi daily with meals to diversify gut flora, enhance digestion, and deliver capsaicin thermogenic benefits.',
    coachingCues: ['Look for traditionally fermented kimchi with live cultures—avoid brands that use vinegar shortcuts instead of natural lacto-fermentation.', 'The spicier and more aged the kimchi, the higher the probiotic diversity and organic acid content.', 'Pair with rice or protein to buffer the capsaicin and acidity if you have a sensitive stomach.'],
    steps: [
      'Diverse Lactobacillus strains (L. kimchii, L. plantarum, Leuconostoc mesenteroides) colonize the gut, producing bacteriocins that inhibit pathogenic overgrowth.',
      'Capsaicin from gochugaru binds TRPV1 receptors in the GI tract, increasing gastric motility and mucus production while mildly stimulating thermogenesis via sympathetic activation.',
      'Allicin from fermented garlic is converted to ajoene and S-allylcysteine, which exhibit broad-spectrum antimicrobial activity against harmful gut bacteria and Candida species.',
      'Prebiotic fiber from napa cabbage feeds beneficial Bifidobacterium in the colon, producing butyrate that maintains tight junction integrity and reduces intestinal permeability.'
    ],
    mistakes: [
      'Buying "quick kimchi" made with vinegar instead of natural fermentation—it has no live probiotics and misses the entire point of this food.',
      'Heating kimchi in stir-fries or soups before serving, which kills the beneficial bacteria (add it after cooking or eat as a raw side dish).',
      'Consuming excessive amounts when first starting, leading to gas and digestive distress from the rapid introduction of novel bacterial strains and capsaicin.'
    ],
    proTips: [
      'The brine at the bottom of a mature kimchi jar is a probiotic concentrate—use 1 tbsp as a salad dressing base or dilute with water for a potent morning gut tonic.',
      'Combine kimchi with a prebiotic fiber source like cooked-and-cooled rice (resistant starch): the prebiotics feed the probiotics you just consumed, dramatically improving colonization rates.'
    ],
    conditioning: [
      'Korean Athlete Bowl: Serve 1 cup cooked-and-cooled jasmine rice topped with 4oz bulgogi beef, 1/3 cup aged kimchi, 1 fried egg, sliced cucumber, and a drizzle of sesame oil with toasted sesame seeds.'
    ],
    combinations: [{ name: 'Microbiome Diversity Stack (Kimchi + Sauerkraut)', link: 'sauerkraut' }],
    relatedTechniques: ['sauerkraut', 'miso', 'turmeric']
  },
  'psyllium-husk': {
    id: 'psyllium-husk',
    image: '/images/foods/psyllium-husk.jpg',
    name: 'Psyllium Husk',
    category: 'Gut & Digestion',
    difficulty: 'beginner',
    stance: 'both',
    trainingFormat: ['powder', 'capsule', 'mixed'],
    muscles: ['abs', 'obliques'],
    description: 'A soluble fiber supplement derived from Plantago ovata seed husks that forms a viscous gel in the GI tract, dramatically improving intestinal transit time, binding cholesterol and bile acids for excretion, and promoting prolonged satiety through gastric distension. Psyllium is clinically proven to reduce LDL cholesterol by 5-10% and is the only fiber supplement with an FDA-approved heart health claim.',
    whenToUse: 'Take 1-2 teaspoons (5-10g) of psyllium husk mixed in 12-16oz of water 30 minutes before meals, 1-2 times daily, to improve satiety, regulate digestion, and support cholesterol management.',
    coachingCues: ['Always drink at least 12oz of water with each psyllium dose—insufficient water can cause esophageal or intestinal blockage.', 'Start with 1 teaspoon daily and increase gradually over 1-2 weeks to avoid gas and bloating.', 'Take psyllium 2 hours apart from medications, as the gel can bind to and reduce absorption of some drugs.'],
    steps: [
      'Psyllium husk absorbs 10-20x its weight in water within the stomach, forming a thick mucilaginous gel that slows gastric emptying and triggers stretch receptors for satiety signaling.',
      'The viscous gel traps bile acids in the small intestine, preventing their reabsorption and forcing the liver to pull LDL cholesterol from the blood to synthesize new bile acids.',
      'In the colon, psyllium gel normalizes stool consistency—adding bulk to loose stools and softening hard stools by retaining water, regulating transit time in both directions.',
      'Partial bacterial fermentation of psyllium in the colon produces short-chain fatty acids (SCFAs) that nourish colonocytes and reduce colonic pH, inhibiting pathogenic bacterial growth.'
    ],
    mistakes: [
      'Taking psyllium without adequate water, risking choking hazard or intestinal obstruction from the rapidly expanding gel.',
      'Mixing psyllium into a drink and letting it sit too long—it will gel into an undrinkable mass; drink immediately after mixing.',
      'Taking psyllium at the same time as medications or other supplements, as the gel matrix can bind to and reduce their bioavailability.'
    ],
    proTips: [
      'Mix 1 tsp psyllium into your pre-meal water 20 minutes before a large meal: the gel expands in your stomach, activating stretch-receptor satiety signals that naturally reduce caloric intake by 10-15%.',
      'Add 1 tbsp psyllium husk to overnight oats the night before—it absorbs moisture, thickens the oats perfectly, and adds 5g of cholesterol-binding soluble fiber.'
    ],
    conditioning: [
      'Satiety Super Drink: Stir 1 tsp psyllium husk powder into 16oz cold water with a squeeze of fresh lemon and a pinch of sea salt. Drink immediately before the mixture gels (within 30 seconds of stirring).'
    ],
    combinations: [{ name: 'Digestive Regulation Stack (Psyllium + Apple Cider Vinegar)', link: 'apple-cider-raw' }],
    relatedTechniques: ['apple-cider-raw', 'sauerkraut', 'oats']
  },
  'apple-cider-raw': {
    id: 'apple-cider-raw',
    image: '/images/foods/apple-cider-raw.jpg',
    name: 'Raw Apple Cider Vinegar',
    category: 'Gut & Digestion',
    difficulty: 'beginner',
    stance: 'both',
    trainingFormat: ['diluted', 'dressing', 'tonic'],
    muscles: ['abs', 'obliques'],
    description: 'Raw, unfiltered apple cider vinegar with "the mother"—a colony of acetic acid bacteria and cellulose strands visible as cloudy sediment. The acetic acid (5-6%) has been clinically shown to reduce post-meal blood glucose spikes by 20-30% by inhibiting disaccharidase enzymes, slowing starch digestion. The mother provides Acetobacter and other beneficial bacteria, while malic acid supports mitochondrial energy production.',
    whenToUse: 'Dilute 1-2 tablespoons in 8oz of water and drink 15-20 minutes before carbohydrate-heavy meals to blunt blood sugar spikes and support digestive acid production.',
    coachingCues: ['Always dilute in water—undiluted ACV can erode tooth enamel and burn the esophageal lining.', 'Shake the bottle before use to distribute the mother culture evenly.', 'Use a straw to minimize contact with tooth enamel, and rinse your mouth with plain water afterward.'],
    steps: [
      'Acetic acid inhibits salivary and pancreatic alpha-amylase enzymes, slowing the hydrolysis of complex starches into glucose in the upper GI tract.',
      'Delayed carbohydrate digestion reduces the rate of glucose absorption in the small intestine, flattening the post-prandial blood glucose curve by 20-30%.',
      'Malic acid enters the mitochondrial citric acid cycle as malate, supporting ATP production and reducing the metabolic burden of rapid glucose disposal.',
      'Acetobacter cultures from the mother colonize the upper GI tract, producing additional organic acids that lower gastric pH and support protein digestion via pepsin activation.'
    ],
    mistakes: [
      'Drinking undiluted apple cider vinegar, which can cause esophageal burns, tooth enamel erosion, and stomach lining irritation.',
      'Using pasteurized, filtered ACV without the mother—it lacks live cultures and has reduced enzymatic activity.',
      'Expecting ACV to replace diabetes medication or significantly lower fasting blood sugar; its effect is primarily on post-meal glucose spikes.'
    ],
    proTips: [
      'Create a pre-meal ritual: 1 tbsp ACV in 8oz water with 1/2 tsp cinnamon 15 minutes before your largest carbohydrate meal. Cinnamon independently improves insulin sensitivity, compounding the glucose-lowering effect.',
      'Use raw ACV as a base for salad dressings (2 tbsp ACV + 1 tbsp olive oil + herbs)—you get the blood sugar benefits without the unpleasant taste of drinking it straight.'
    ],
    conditioning: [
      'Morning Metabolic Tonic: Mix 1 tbsp raw unfiltered apple cider vinegar, 8oz warm water, 1 tsp raw honey, 1/4 tsp cinnamon, and a squeeze of fresh lemon. Sip 15 minutes before breakfast.'
    ],
    combinations: [{ name: 'Blood Sugar Control Stack (ACV + Psyllium Husk)', link: 'psyllium-husk' }],
    relatedTechniques: ['psyllium-husk', 'sauerkraut', 'green-tea']
  },
  'miso': {
    id: 'miso',
    image: '/images/foods/miso.jpg',
    name: 'Miso',
    category: 'Gut & Digestion',
    difficulty: 'intermediate',
    stance: 'both',
    trainingFormat: ['soup', 'paste', 'marinade'],
    muscles: ['abs', 'head', 'neck'],
    description: 'A traditional Japanese fermented soybean paste aged for months to years with Aspergillus oryzae koji mold, producing a dense ecosystem of beneficial bacteria, digestive enzymes (proteases, lipases, amylases), and bioavailable isoflavones. Longer-aged misos (red/hatcho) develop higher concentrations of melanoidins with potent antioxidant activity. Miso also provides naturally occurring MSG (glutamate) for umami depth and sodium for electrolyte balance.',
    whenToUse: 'Consume 1-2 cups of miso soup daily, especially pre-meal or with breakfast, to prime digestive enzyme production and deliver electrolytes and probiotics simultaneously.',
    coachingCues: ['Never boil miso—add it to warm (not boiling) broth to preserve live enzymes and probiotic cultures.', 'Choose darker, longer-fermented miso (red or hatcho) for higher antioxidant melanoidin content and probiotic diversity.', 'Dissolve miso paste thoroughly in a small amount of warm water before adding to soup to ensure even distribution.'],
    steps: [
      'Aspergillus oryzae koji enzymes (proteases, amylases) pre-digest soy proteins and starches during fermentation, producing free amino acids and simple sugars that are immediately bioavailable.',
      'Lactobacillus and Tetragenococcus bacteria developed during fermentation colonize the intestinal mucosa and produce bacteriocins that suppress pathogenic bacteria.',
      'Isoflavones (genistein, daidzein) are converted to their bioactive aglycone forms during fermentation, enabling direct absorption and interaction with estrogen receptors for hormonal balance.',
      'Natural glutamate (MSG) stimulates gastric T1R1/T1R3 umami receptors, triggering cephalic-phase digestive enzyme secretion and preparing the GI tract for efficient nutrient processing.'
    ],
    mistakes: [
      'Boiling miso in soup, which kills the live probiotic cultures and denatures the heat-sensitive digestive enzymes that are its primary benefit.',
      'Using only white (shiro) miso—while milder, it has significantly fewer probiotics and melanoidins than red (aka) or hatcho miso aged 1-3 years.',
      'Ignoring sodium content; while miso sodium is buffered by potassium and probiotics, individuals with severe hypertension should monitor total intake.'
    ],
    proTips: [
      'Make a quick electrolyte recovery drink: dissolve 1 tbsp red miso in 8oz warm water with a squeeze of lemon after training for sodium, potassium, probiotics, and digestive enzymes in one cup.',
      'Use miso paste as a marinade base for proteins (chicken, salmon, tofu): the proteolytic enzymes from koji pre-tenderize the meat while infusing umami flavor over 4-12 hours.'
    ],
    conditioning: [
      'Athlete\'s Recovery Miso Soup: Heat 2 cups dashi broth to a gentle simmer (not boiling), remove from heat, dissolve 2 tbsp red miso paste, add cubed silken tofu, sliced green onions, and a sheet of torn nori seaweed.'
    ],
    combinations: [{ name: 'Japanese Gut Protocol (Miso + Kimchi)', link: 'kimchi' }],
    relatedTechniques: ['kimchi', 'sauerkraut', 'green-tea']
  },
  'spirulina': {
    id: 'spirulina',
    image: '/images/foods/spirulina.jpg',
    name: 'Spirulina',
    category: 'Superfoods & Adaptogens',
    difficulty: 'intermediate',
    stance: 'both',
    trainingFormat: ['powder', 'tablet', 'smoothie'],
    muscles: ['head', 'chest', 'biceps'],
    description: 'A blue-green cyanobacterium (Arthrospira platensis) that is 55-70% complete protein by dry weight—the highest protein density of any whole food. Spirulina\'s signature blue pigment, phycocyanin, is a potent antioxidant and anti-inflammatory compound that inhibits NADPH oxidase and scavenges peroxyl radicals. It also delivers highly bioavailable iron (non-heme iron enhanced by its own vitamin C), B-vitamins, and gamma-linolenic acid (GLA).',
    whenToUse: 'Add 1-2 teaspoons (3-6g) of spirulina powder to smoothies or water daily for a concentrated dose of bioavailable protein, iron, and phycocyanin antioxidant support.',
    coachingCues: ['Start with 1/2 teaspoon and increase gradually—spirulina can cause nausea or digestive upset at higher initial doses.', 'Buy from reputable sources that test for heavy metals (lead, mercury) and microcystins—contaminated spirulina is a real risk.', 'Mix into cold smoothies or juices; high heat degrades phycocyanin pigment and reduces antioxidant potency.'],
    steps: [
      'Phycocyanin is absorbed intact through the intestinal wall and enters systemic circulation, where it inhibits NADPH oxidase—the primary enzyme generating superoxide radicals during intense exercise.',
      'Spirulina\'s complete amino acid profile (all essential amino acids) provides rapidly digestible protein with a PDCAAS comparable to animal sources, supporting muscle protein synthesis.',
      'Iron from spirulina is absorbed as non-heme iron, but spirulina\'s intrinsic vitamin C and organic acids enhance conversion to the ferrous (Fe²⁺) form, increasing bioavailability.',
      'Gamma-linolenic acid (GLA) is converted to DGLA (dihomo-gamma-linolenic acid), which competes with arachidonic acid in the COX pathway, producing anti-inflammatory series-1 prostaglandins.'
    ],
    mistakes: [
      'Buying cheap spirulina from unverified sources—it may contain toxic microcystins or heavy metals from contaminated water sources.',
      'Taking large doses (10g+) without acclimation, which can cause nausea, headaches, and digestive distress from rapid detoxification effects.',
      'Assuming spirulina is a reliable source of vitamin B12—it primarily contains pseudovitamin B12 (cobamide analogs) which are biologically inactive in humans.'
    ],
    proTips: [
      'Combine 1 tsp spirulina with 1/2 tsp vitamin C powder in your smoothie: the exogenous ascorbic acid dramatically enhances non-heme iron absorption and protects the phycocyanin from oxidation.',
      'Use spirulina as a natural pre-workout: 5g taken 60 minutes before training has been shown to increase time-to-exhaustion by 10% through enhanced fat oxidation and reduced exercise-induced oxidative stress.'
    ],
    conditioning: [
      'Blue-Green Power Smoothie: Blend 1 tsp spirulina powder, 1 frozen banana, 1/2 cup frozen mango, 1 scoop vanilla protein powder, 1 tbsp almond butter, 8oz coconut water, and a squeeze of lime until smooth.'
    ],
    combinations: [{ name: 'Superfood Iron Stack (Spirulina + Sweet Peppers)', link: 'sweet-peppers' }],
    relatedTechniques: ['maca-root', 'reishi-mushroom', 'green-tea']
  },
  'maca-root': {
    id: 'maca-root',
    image: '/images/foods/maca-root.jpg',
    name: 'Maca Root',
    category: 'Superfoods & Adaptogens',
    difficulty: 'intermediate',
    stance: 'both',
    trainingFormat: ['powder', 'capsule', 'gelatinized'],
    muscles: ['gluteal', 'trapezius', 'adductor'],
    description: 'A Peruvian cruciferous root vegetable (Lepidium meyenii) grown above 4,000m altitude, traditionally used as an adaptogen for energy, libido, and hormonal balance. Maca contains unique macamides and macaenes that modulate the hypothalamic-pituitary-adrenal (HPA) axis without containing hormones themselves. Gelatinized (pre-cooked) maca is more digestible and concentrated than raw, with clinical evidence supporting improved sexual function, mood, and exercise endurance.',
    whenToUse: 'Take 1.5-3g of gelatinized maca powder daily in smoothies or warm beverages, consistently for 6-8 weeks, to experience adaptogenic effects on energy, libido, and hormonal balance.',
    coachingCues: ['Choose gelatinized maca over raw—the starch removal process makes it 4x more concentrated and eliminates the digestive issues raw maca can cause.', 'Cycle maca: 5 days on, 2 days off (or 4 weeks on, 1 week off) to maintain HPA axis sensitivity.', 'Red maca is best for bone density and prostate health; black maca for energy and libido; yellow maca is the most common and well-rounded.'],
    steps: [
      'Macamides and macaenes are absorbed in the small intestine and modulate the hypothalamic-pituitary axis, influencing the release of LH (luteinizing hormone) and FSH (follicle-stimulating hormone).',
      'HPA axis modulation normalizes cortisol rhythms—reducing excess cortisol during chronic stress without suppressing the acute cortisol response needed for training adaptation.',
      'Glucosinolates in maca support Phase II liver detoxification, improving the metabolism and clearance of xenoestrogens and environmental endocrine disruptors.',
      'Polysaccharide and alkaloid compounds enhance mitochondrial bioenergetics, increasing cellular ATP production and contributing to the subjective experience of sustained energy without stimulant effects.'
    ],
    mistakes: [
      'Using raw maca powder, which contains starch and goitrogens that can cause bloating, gas, and thyroid disruption in sensitive individuals.',
      'Expecting immediate results—maca is an adaptogen that requires 4-8 weeks of consistent use before hormonal and energy effects become noticeable.',
      'Taking mega-doses (10g+) thinking more is better; clinical studies show 1.5-3g daily is the effective and safe dose range.'
    ],
    proTips: [
      'Add gelatinized maca to your post-workout smoothie with cacao and banana: the malty flavor blends perfectly, and the HPA axis support helps normalize the cortisol spike from intense training.',
      'Stack black maca with ashwagandha for a synergistic adaptogenic protocol: maca modulates the HPG axis (reproductive hormones) while ashwagandha targets the HPA axis (stress hormones) for comprehensive endocrine support.'
    ],
    conditioning: [
      'Andean Energy Elixir: Blend 1 tsp gelatinized maca powder, 1 tbsp raw cacao powder, 1 frozen banana, 1 tbsp peanut butter, 1 tsp honey, 8oz warm oat milk, and a pinch of cinnamon.'
    ],
    combinations: [{ name: 'Adaptogen Synergy Stack (Maca + Reishi Mushroom)', link: 'reishi-mushroom' }],
    relatedTechniques: ['reishi-mushroom', 'spirulina', 'dark-chocolate']
  },
  'reishi-mushroom': {
    id: 'reishi-mushroom',
    image: '/images/foods/reishi-mushroom.jpg',
    name: 'Reishi Mushroom',
    category: 'Superfoods & Adaptogens',
    difficulty: 'intermediate',
    stance: 'both',
    trainingFormat: ['powder', 'extract', 'tea'],
    muscles: ['head', 'trapezius', 'neck'],
    description: 'The "mushroom of immortality" (Ganoderma lucidum), used for over 2,000 years in Traditional Chinese Medicine. Reishi contains over 400 bioactive compounds including triterpenes (ganoderic acids) that modulate immune cytokine production, beta-glucan polysaccharides that train innate immune cells via Dectin-1 receptor activation, and compounds that enhance deep sleep by modulating GABAergic neurotransmission.',
    whenToUse: 'Take 1-2g of dual-extracted reishi (hot water + alcohol extraction) 1-2 hours before bed daily for immune modulation and deep sleep enhancement, or during high-stress training blocks for cortisol management.',
    coachingCues: ['Choose dual-extracted reishi (both hot water AND alcohol extraction) to get both the water-soluble beta-glucans and alcohol-soluble triterpenes.', 'Take reishi in the evening—its GABAergic and sleep-promoting effects make it suboptimal as a morning supplement.', 'Look for products standardized to beta-glucan content (>20%) and triterpene content (>4%) for therapeutic potency.'],
    steps: [
      'Beta-glucan polysaccharides bind to Dectin-1 receptors on macrophages and dendritic cells, triggering innate immune "training" that enhances pathogen recognition without causing inflammatory overshoot.',
      'Ganoderic acids (triterpenes) modulate NF-κB signaling, downregulating pro-inflammatory cytokines (TNF-α, IL-6) while upregulating anti-inflammatory IL-10, creating balanced immune surveillance.',
      'Triterpenoid compounds enhance GABAergic neurotransmission by potentiating GABA-A receptor activity, promoting relaxation and increasing slow-wave (deep) sleep duration.',
      'Adenosine analogs in reishi accumulate throughout the day and bind to A1 adenosine receptors, compounding with natural adenosine to create a deeper, more restorative sleep drive in the evening.'
    ],
    mistakes: [
      'Using reishi products made from mycelium grown on grain (myceliated grain) instead of actual fruiting body extract—grain filler dilutes the active compounds dramatically.',
      'Taking reishi in the morning and expecting stimulant effects—it is calming and sleep-promoting, the opposite of an energizer.',
      'Choosing a single-extraction product (hot water only), which misses the alcohol-soluble triterpenes that are responsible for anti-inflammatory and immune-modulating effects.'
    ],
    proTips: [
      'Create an evening "sleep stack": 1g reishi dual-extract + 200mg magnesium glycinate + chamomile tea, consumed 90 minutes before bed for synergistic GABAergic sleep promotion.',
      'During heavy training blocks or competition travel, double your reishi dose (2-3g/day) to maintain immune resilience—the beta-glucan immune training effect helps prevent the immunosuppression common during overreaching phases.'
    ],
    conditioning: [
      'Nightcap Reishi Latte: Heat 8oz oat milk to steaming (not boiling), whisk in 1/2 tsp reishi dual-extract powder, 1/2 tsp raw cacao, 1/2 tsp ashwagandha, 1 tsp honey, and a pinch of nutmeg.'
    ],
    combinations: [{ name: 'Deep Sleep Protocol (Reishi + Tart Cherry)', link: 'tart-cherry-juice' }],
    relatedTechniques: ['maca-root', 'spirulina', 'tart-cherry-juice']
  },
  'creatine-mono': {
    id: 'creatine-mono',
    image: '/images/foods/creatine-mono.jpg',
    name: 'Creatine Monohydrate',
    category: 'Superfoods & Adaptogens',
    difficulty: 'beginner',
    stance: 'both',
    trainingFormat: ['powder', 'capsule', 'mixed'],
    muscles: ['chest', 'triceps', 'quadriceps', 'gluteal'],
    description: 'The most researched and evidence-backed ergogenic supplement in sports nutrition history, with over 500 peer-reviewed studies confirming its safety and efficacy. Creatine monohydrate increases intramuscular phosphocreatine stores by 20-40%, directly enhancing the ATP-PC energy system for explosive, high-intensity efforts lasting 2-10 seconds. Beyond performance, creatine supports cognitive function, bone density, and may have neuroprotective properties.',
    whenToUse: 'Take 3-5g of creatine monohydrate daily with a meal (timing is not critical), consistently every day including rest days, to saturate intramuscular phosphocreatine stores within 3-4 weeks.',
    coachingCues: ['Skip the loading phase—5g daily for 3-4 weeks achieves the same saturation as 20g/day for 5 days, without the GI distress.', 'Creatine monohydrate is the gold standard; other forms (HCL, ethyl ester, buffered) have no proven advantage despite higher prices.', 'Drink plenty of water (3-4L daily) when supplementing creatine to support intramuscular water retention and prevent cramping.'],
    steps: [
      'Creatine monohydrate is absorbed in the small intestine via SLC6A8 transporters and enters the bloodstream, where it is taken up by skeletal muscle cells against a concentration gradient.',
      'Inside muscle cells, creatine kinase phosphorylates creatine to phosphocreatine (PCr), which is stored at concentrations 3-4x higher than ATP itself.',
      'During explosive efforts (sprints, heavy lifts), phosphocreatine donates its phosphate group to ADP via the creatine kinase reaction, rapidly regenerating ATP in 1-2 seconds—faster than any other energy pathway.',
      'Increased PCr stores extend the duration of the ATP-PC system from ~6 seconds to ~10 seconds, delaying reliance on glycolysis and its fatigue-inducing byproducts (H⁺ ions, lactate).'
    ],
    mistakes: [
      'Cycling on and off creatine—there is no physiological reason to cycle; daily supplementation maintains saturated stores and consistent performance benefits.',
      'Using fancy creatine variants (HCL, buffered, liquid) that cost 5-10x more than monohydrate with zero additional proven benefit.',
      'Expecting creatine to work immediately—it requires 3-4 weeks of daily use to fully saturate intramuscular phosphocreatine stores.'
    ],
    proTips: [
      'Take creatine with your post-workout carbohydrate and protein meal: the insulin spike from carbohydrates enhances creatine uptake into muscle cells via insulin-stimulated SLC6A8 transporter activity.',
      'Creatine is also a cognitive enhancer—5g daily has been shown to improve working memory and reduce mental fatigue during sleep deprivation, making it valuable during intense study or travel periods.'
    ],
    conditioning: [
      'Post-Workout Creatine Shake: Blend 1 scoop whey protein, 5g creatine monohydrate, 1 banana, 1 tbsp honey, 8oz milk, and a handful of ice. Consume within 30 minutes post-training.'
    ],
    combinations: [{ name: 'Power Output Stack (Creatine + Whey Protein)', link: 'whey-isolate' }],
    relatedTechniques: ['whey-isolate', 'beet-juice', 'sweet-potato']
  },
  'collagen-peptides': {
    id: 'collagen-peptides',
    image: '/images/foods/collagen-peptides.jpg',
    name: 'Collagen Peptides',
    category: 'Superfoods & Adaptogens',
    difficulty: 'beginner',
    stance: 'both',
    trainingFormat: ['powder', 'capsule', 'mixed'],
    muscles: ['hamstring', 'calves', 'forearm', 'abs'],
    description: 'Hydrolyzed Type I and Type III collagen peptides—enzymatically broken down into di- and tri-peptide fragments (primarily hydroxyproline-proline and glycine-proline-hydroxyproline) that are absorbed intact and stimulate fibroblast collagen synthesis in tendons, ligaments, skin, and the gut lining. Clinical studies show 15g daily with vitamin C significantly increases collagen synthesis rate in tendons and reduces injury risk in athletes.',
    whenToUse: 'Take 15-20g of collagen peptides with 50mg vitamin C, 30-60 minutes before training or physical therapy, to maximize collagen synthesis in connective tissues during the mechanotransduction window.',
    coachingCues: ['Always pair collagen with vitamin C—ascorbic acid is a required cofactor for prolyl hydroxylase, without which collagen fibers cannot cross-link properly.', 'Take collagen 30-60 minutes before exercise so that peptides peak in the blood during mechanical loading of tendons and ligaments.', 'Collagen is NOT a replacement for complete protein—it lacks tryptophan and is low in BCAAs; use it in addition to whey or whole food protein.'],
    steps: [
      'Hydrolyzed collagen peptides (2-5 kDa) are absorbed largely intact in the small intestine via PepT1 transporters, bypassing the need for full enzymatic digestion.',
      'Bioactive di- and tri-peptides (Pro-Hyp, Gly-Pro-Hyp) accumulate in connective tissues and stimulate fibroblast proliferation and collagen Type I/III mRNA expression.',
      'Vitamin C (ascorbic acid) activates prolyl-4-hydroxylase, which hydroxylates proline residues on procollagen chains—a mandatory step for proper triple-helix formation and cross-linking.',
      'Mechanical loading during exercise creates piezoelectric signals in tendons that synergize with circulating collagen peptides, directing new collagen deposition along lines of force for functional tissue remodeling.'
    ],
    mistakes: [
      'Taking collagen without vitamin C, which renders the hydroxylation step impossible and results in weak, poorly cross-linked collagen fibers.',
      'Using collagen as a primary protein source—it has an incomplete amino acid profile (no tryptophan, low BCAA) and a PDCAAS of 0, making it useless for muscle protein synthesis.',
      'Expecting overnight results; collagen remodeling is slow—tendons and ligaments require 6-12 weeks of consistent supplementation to show measurable structural improvements.'
    ],
    proTips: [
      'The "Baar Protocol": Take 15g collagen peptides + 50mg vitamin C exactly 60 minutes before a 6-minute isometric loading session of the target tendon. This protocol has been shown to double collagen synthesis rate in ACL and Achilles tendons.',
      'Add collagen peptides to your morning coffee—they dissolve completely in hot liquid with no taste or texture change, making compliance effortless. Just add a vitamin C tablet or squeeze of lemon on the side.'
    ],
    conditioning: [
      'Tendon Repair Smoothie: Blend 15g collagen peptides, 1/2 cup frozen strawberries (vitamin C source), 1 scoop vanilla protein, 1 tbsp honey, 8oz water or milk. Drink 45 minutes before training.'
    ],
    combinations: [{ name: 'Connective Tissue Repair Stack (Collagen + Tart Cherry)', link: 'tart-cherry-juice' }],
    relatedTechniques: ['tart-cherry-juice', 'whey-isolate', 'greek-yogurt']
  }
}

export const foodsData: Record<string, Technique> = {
  ...originalFoodsData,
  ...macronutrientsFoods,
  ...hydrationFoods,
  ...micronutrientsFoods,
  ...gutFoods,
  ...superfoodsFoods
};
