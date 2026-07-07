import type { Technique } from '../foods';

export const micronutrientsFoods: Record<string, Technique> = {
  "kale": {
    "id": "kale",
    image: '/images/foods/kale.jpg',
    "name": "Kale",
    "category": "Micronutrients",
    "difficulty": "beginner",
    "stance": "both",
    "trainingFormat": [
      "steamed",
      "raw-massaged",
      "baked"
    ],
    "muscles": [
      "heart",
      "quadriceps",
      "gluteal"
    ],
    "description": "A nutrient-dense cruciferous leafy green loaded with Vitamin K, Vitamin A, Vitamin C, calcium, and antioxidants like lutein. Kale supports cardiovascular health, bone density, and immune defense in athletes.",
    "whenToUse": "Eat in daily baseline meals, lightly steamed or massaged with olive oil to maximize absorption.",
    "coachingCues": [
      "Remove the tough woody stems before eating.",
      "Massage raw kale with olive oil and lemon juice to break down tough fibers.",
      "Steam lightly to preserve nutrients and reduce goitrogens."
    ],
    "steps": [
      "Vitamin K1 is absorbed in the small intestine, assisting in blood clotting and bone mineralization.",
      "Lutein and zeaxanthin are absorbed, supporting vision and cognitive function.",
      "Glucosinolates are broken down into isothiocyanates, aiding in cellular detoxification."
    ],
    "mistakes": [
      "Eating raw kale in massive quantities without breaking down the fibers, leading to bloating and gas.",
      "Throwing kale into a high-heat fry, which degrades the Vitamin C and delicate antioxidants."
    ],
    "proTips": [
      "Massage raw kale with extra virgin olive oil and avocado for 5 minutes; this makes the leaves tender and highly digestible.",
      "Toss kale leaves with olive oil and sea salt, and bake at 350F for 15 minutes to make crispy, mineral-dense kale chips."
    ],
    "conditioning": [
      "Massaged Green Salad: 2 cups massaged kale, 1 tbsp olive oil, 1 tbsp lemon juice, topped with pumpkin seeds."
    ],
    "combinations": [
      {
        "name": "Vitamins & Minerals (Kale + Extra Virgin Olive Oil)",
        "link": "extra-virgin-olive-oil"
      }
    ],
    "relatedTechniques": [
      "spinach",
      "broccoli",
      "pumpkin-seeds"
    ]
  },
  "asparagus": {
    "id": "asparagus",
    image: '/images/foods/asparagus.jpg',
    "name": "Asparagus",
    "category": "Micronutrients",
    "difficulty": "beginner",
    "stance": "both",
    "trainingFormat": [
      "roasted",
      "steamed",
      "grilled"
    ],
    "muscles": [
      "abs",
      "calves",
      "heart"
    ],
    "description": "A nutrient-dense spring vegetable rich in folate, chromium, Vitamin K, and the amino acid asparagine. Asparagus acts as a mild natural diuretic, helping to flush excess water and support kidney function and nutrient delivery.",
    "whenToUse": "Eat in recovery meals, particularly during weight-cutting phases or post-fight recovery.",
    "coachingCues": [
      "Snap off the woody bottom ends before cooking.",
      "Roast with garlic and olive oil to enhance nutrient absorption.",
      "Do not overcook; keep a slight crunch."
    ],
    "steps": [
      "Asparagine stimulates kidney function, promoting the excretion of excess water and sodium.",
      "Folate is absorbed to support cellular division and DNA repair.",
      "Chromium assists insulin in transporting glucose into cells."
    ],
    "mistakes": [
      "Overcooking asparagus until mushy and limp, which destroys its folate content.",
      "Smothering in heavy, processed sauces that add unnecessary fats and chemicals."
    ],
    "proTips": [
      "Asparagus is a premier vegetable during weight cuts due to its natural diuretic properties, helping to shed subcutaneous water safely.",
      "Roast asparagus with a drizzle of extra virgin olive oil and a sprinkle of pink salt for a delicious, recovery-focused side dish."
    ],
    "conditioning": [
      "Roasted Recovery Asparagus: Roast 1 bunch of asparagus with 1 tbsp olive oil, minced garlic, and pink salt at 400F for 10 minutes."
    ],
    "combinations": [
      {
        "name": "Diuretic Weight Cut Support (Asparagus + Pink Salt)",
        "link": "pink-salt"
      }
    ],
    "relatedTechniques": [
      "broccoli",
      "sweet-peppers",
      "spinach"
    ]
  },
  "oysters": {
    "id": "oysters",
    image: '/images/foods/oysters.jpg',
    "name": "Oysters",
    "category": "Micronutrients",
    "difficulty": "advanced",
    "stance": "both",
    "trainingFormat": [
      "raw",
      "steamed",
      "canned"
    ],
    "muscles": [
      "chest",
      "triceps",
      "biceps",
      "quadriceps",
      "gluteal"
    ],
    "description": "A marine bivalve mollusk that contains the highest natural concentration of zinc of any food, alongside Vitamin B12, selenium, and copper. Oysters are the ultimate hormone support food, optimizing testosterone synthesis and immune function.",
    "whenToUse": "Consume weekly to maintain testosterone levels, support thyroid function, and boost immune health.",
    "coachingCues": [
      "Eat fresh raw oysters from reputable sources, or high-quality canned options.",
      "Add lemon juice to enhance zinc absorption with Vitamin C.",
      "Avoid eating cooked oysters that did not open."
    ],
    "steps": [
      "Zinc is absorbed in the small intestine, acting as a crucial cofactor for testosterone synthesis and immune cell development.",
      "Vitamin B12 is absorbed via intrinsic factor, supporting nerve function and red blood cell production.",
      "Selenium supports the conversion of thyroid hormones, regulating metabolic rate."
    ],
    "mistakes": [
      "Eating raw oysters from questionable sources, risking foodborne illness.",
      "Consuming heavily battered and deep-fried oysters, which destroys their clean micronutrient profile."
    ],
    "proTips": [
      "Eat 3-4 fresh raw oysters weekly; this provides over 400% of your daily zinc needs to naturally support male and female hormone levels.",
      "Canned smoked oysters packed in olive oil are a fantastic, portable, zinc-dense snack for busy training days."
    ],
    "conditioning": [
      "Hormone Support Plate: 6 raw oysters served with fresh lemon wedges, alongside a side of steamed spinach."
    ],
    "combinations": [
      {
        "name": "Zinc & Iron Optimization (Oysters + Spinach)",
        "link": "spinach"
      }
    ],
    "relatedTechniques": [
      "beef-liver",
      "salmon",
      "sardines"
    ]
  },
  "garlic": {
    "id": "garlic",
    image: '/images/foods/garlic.jpg',
    "name": "Garlic",
    "category": "Micronutrients",
    "difficulty": "beginner",
    "stance": "both",
    "trainingFormat": [
      "raw-crushed",
      "sauteed",
      "roasted"
    ],
    "muscles": [
      "heart",
      "head",
      "abs"
    ],
    "description": "A pungent bulb containing the sulfur compound allicin. Garlic is a potent natural antimicrobial, immunomodulator, and vasodilator, supporting cardiovascular health and defending against training-related infections.",
    "whenToUse": "Consume raw-crushed or cooked daily in main meals to boost immunity and cardiovascular endurance.",
    "coachingCues": [
      "Crush or chop garlic and let sit for 10 minutes before cooking to activate allicin.",
      "Eat raw for maximum immune benefit.",
      "Cook lightly to preserve therapeutic properties."
    ],
    "steps": [
      "Allicin is formed when garlic is crushed, converting alliin to active allicin via the enzyme alliinase.",
      "Allicin relaxes blood vessels and increases nitric oxide production, improving blood flow.",
      "Sulfur compounds stimulate white blood cell production, boosting immune defense."
    ],
    "mistakes": [
      "Cooking garlic immediately after chopping without letting it rest, which prevents allicin from forming.",
      "Using processed garlic powders, which contain very little active allicin."
    ],
    "proTips": [
      "If you feel a cold coming on from heavy training, crush 1 clove of raw garlic, mix with a tsp of raw honey, and swallow.",
      "Rub a cut garlic clove over roasted sprouted bread before drizzling with olive oil for a simple, heart-healthy pre-workout toast."
    ],
    "conditioning": [
      "Immune Booster Tea: Steep 1 crushed garlic clove, 1 inch sliced ginger, and 1 tbsp lemon juice in hot water. Stir in honey."
    ],
    "combinations": [
      {
        "name": "Immune & Circulation Synergy (Garlic + Ginger)",
        "link": "ginger"
      }
    ],
    "relatedTechniques": [
      "ginger",
      "raw-honey",
      "turmeric"
    ]
  },
  "pomegranate": {
    "id": "pomegranate",
    image: '/images/foods/pomegranate.jpg',
    "name": "Pomegranate",
    "category": "Micronutrients",
    "difficulty": "beginner",
    "stance": "both",
    "trainingFormat": [
      "raw-seeds",
      "cold-pressed-juice"
    ],
    "muscles": [
      "heart",
      "quadriceps",
      "gluteal"
    ],
    "description": "A ruby-red fruit packed with punicalagins, anthocyanins, and dietary nitrates. Pomegranate is a premier pre-workout food, boosting nitric oxide synthesis to enhance muscle blood flow and reduce post-exercise muscle soreness.",
    "whenToUse": "Consume 200-250ml of pure pomegranate juice 1-2 hours before training, or eat seeds in baseline meals.",
    "coachingCues": [
      "Choose 100% pure, unsweetened pomegranate juice.",
      "Eat the seeds (arils) raw for extra dietary fiber.",
      "Avoid juice blends containing high-fructose corn syrup."
    ],
    "steps": [
      "Punicalagins act as powerful antioxidants, protecting nitric oxide from oxidative destruction.",
      "Nitrates are converted to nitrite and then active nitric oxide in the bloodstream.",
      "Nitric oxide induces vasodilation, increasing oxygen delivery to active muscles."
    ],
    "mistakes": [
      "Drinking cheap pomegranate juice blends that are mostly apple or grape juice and loaded with sugar.",
      "Spitting out the pomegranate seed center; the seed contains fiber and anti-inflammatory oils."
    ],
    "proTips": [
      "Drink 8 oz of pure pomegranate juice pre-workout for a natural pump and cardiovascular endurance booster.",
      "Sprinkle pomegranate arils over Greek yogurt or oatmeal for a burst of color, texture, and polyphenols."
    ],
    "conditioning": [
      "Nitric Oxide Recovery Bowl: 1 cup Greek yogurt topped with 1/2 cup pomegranate arils, walnuts, and honey."
    ],
    "combinations": [
      {
        "name": "Cardiovascular Nitric Oxide (Pomegranate + Walnuts)",
        "link": "walnuts"
      }
    ],
    "relatedTechniques": [
      "beetroot-juice",
      "blueberries",
      "tart-cherry-juice"
    ]
  },
  "tomatoes": {
    "id": "tomatoes",
    image: '/images/foods/tomatoes.jpg',
    "name": "Tomatoes",
    "category": "Micronutrients",
    "difficulty": "beginner",
    "stance": "both",
    "trainingFormat": [
      "raw",
      "cooked-sauce",
      "roasted"
    ],
    "muscles": [
      "heart",
      "abs",
      "head"
    ],
    "description": "A vibrant red fruit rich in lycopene, Vitamin C, and potassium. Lycopene is a powerful fat-soluble antioxidant that supports prostate health, skin protection against UV rays, and reduces cardiovascular inflammation.",
    "whenToUse": "Eat cooked or raw daily in baseline meals to support heart health and reduce systemic inflammation.",
    "coachingCues": [
      "Cook tomatoes with a healthy fat like olive oil to increase lycopene absorption.",
      "Choose organic vine-ripened tomatoes for maximum nutrients.",
      "Eat skins and seeds for extra fiber."
    ],
    "steps": [
      "Lycopene is released from plant cell walls more effectively when heated.",
      "Dietary fats package lycopene into micelles for absorption in the small intestine.",
      "Lycopene accumulates in prostate, liver, and skin tissues, offering antioxidant defense."
    ],
    "mistakes": [
      "Eating tomatoes completely raw without fat, which minimizes lycopene bioavailability.",
      "Using processed tomato sauces with added refined sugar and inflammatory seed oils."
    ],
    "proTips": [
      "Simmer crushed tomatoes with minced garlic and extra virgin olive oil to make a highly bioavailable, anti-inflammatory sauce.",
      "Pair raw cherry tomatoes with avocado slices for an easy, fat-soluble nutrient snack."
    ],
    "conditioning": [
      "Lycopene Rich Salad: Toss 1 cup cherry tomatoes, 1 sliced avocado, fresh basil, and 1 tbsp olive oil with pink salt."
    ],
    "combinations": [
      {
        "name": "Lycopene Bioavailability (Tomatoes + EVOO)",
        "link": "extra-virgin-olive-oil"
      }
    ],
    "relatedTechniques": [
      "extra-virgin-olive-oil",
      "avocado",
      "spinach"
    ]
  }
};
