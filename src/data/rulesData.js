/**
 * Nutrition Science & Intake Guidelines Data
 * Redesigned for FoodWiki: Structured reference content for macros, nutritional authorities, feeding fouls, and timing.
 */

export const weightClasses = [
  { division: 'Glycogen Saturation (Runner)', alias: 'Carb Load', limitLbs: 300, limitKg: 10, note: '60-70% total calories from complex carbohydrates.' },
  { division: 'Anabolic Synthesis (Lifter)', alias: 'Protein Build', limitLbs: 220, limitKg: 2.2, note: '1.6g to 2.2g of protein per kg of bodyweight.' },
  { division: 'Ketogenic Performance', alias: 'Fat Adaptation', limitLbs: 50, limitKg: 5, note: '70%+ total calories from healthy fats, <50g carbs.' },
  { division: 'Active Hydration Baseline', alias: 'Isotonic Balance', limitLbs: 100, limitKg: 3.5, note: '35-40ml of fluids per kg of bodyweight daily.' },
  { division: 'Thermic Dieting (Weight Cut)', alias: 'Energy Deficit', limitLbs: 500, limitKg: 1.5, note: 'Moderate 300-500 kcal deficit with high protein density.' },
];

export const sanctioningBodies = [
  { abbr: 'ISSN', name: 'International Society of Sports Nutrition', founded: 2003, hq: 'Florida, USA' },
  { abbr: 'WHO', name: 'World Health Organization', founded: 1948, hq: 'Geneva, Switzerland' },
  { abbr: 'FDA', name: 'Food and Drug Administration', founded: 1906, hq: 'Silver Spring, MD, USA' },
  { abbr: 'USDA', name: 'United States Department of Agriculture', founded: 1862, hq: 'Washington, D.C., USA' },
];

export const fouls = [
  { name: 'Refined Sugar Spike', description: 'Consuming high-fructose corn syrup or table sugar, causing rapid insulin release and energy crashes.', severity: 'Immediate Insulin Spike → Reactive Hypoglycemia' },
  { name: 'Chronic Dehydration', description: 'Failing to replenish mineral electrolytes (sodium, potassium) during high-intensity sweat sessions.', severity: 'Cramping → Reduced Cardiac Output' },
  { name: 'Seed Oil Overload', description: 'Consuming highly processed industrial seed oils (canola, soybean) rich in unstable omega-6 fats.', severity: 'Systemic Inflammation → Oxidative Stress' },
  { name: 'Severe Caloric Crash', description: 'Cutting calories too low (under basal metabolic rate), triggering muscle wasting and downregulating thyroid hormones.', severity: 'Muscle Loss → Metabolic Adaptation' },
  { name: 'Alcohol Intoxication', description: 'Consuming ethanol, which halts protein synthesis and severely dehydrates muscle fibers.', severity: 'Suspended Recovery → Hormone Imbalance' },
  { name: 'Sleep Deprivation', description: 'Getting less than 7 hours of sleep, spiking cortisol levels and lowering growth hormone production.', severity: 'Increased Cortisol → Reduced Muscle Synthesis' },
];

export const scoringRules = {
  system: 'Macro Balancing System',
  description: 'Athletic fueling is evaluated across key pillars of energy density, protein efficiency, and hydration status.',
  criteria: [
    { factor: 'Nutrient Density', description: 'Prioritizing whole, single-ingredient, unprocessed foods packed with vitamins and minerals.', weight: 'Primary' },
    { factor: 'Protein Quality', description: 'Ensuring adequate intake of complete proteins containing all essential amino acids (EAAs).', weight: 'Primary' },
    { factor: 'Digestive Comfort', description: 'Eliminating common allergens and inflammatory inputs to maintain a healthy gut barrier.', weight: 'Secondary' },
    { factor: 'Hydration Strategy', description: 'Balancing water intake with trace minerals (Himalayan salt, potassium) to prevent intracellular fatigue.', weight: 'Tertiary' },
  ],
  roundScoring: [
    { score: 'Optimal', meaning: 'Energy and recovery requirements fully satisfied. Stable blood glucose and digestion.' },
    { score: 'Suboptimal', meaning: 'Minor macronutrient imbalance or minor hydration deficit. Slight afternoon energy dip.' },
    { score: 'Deficient', meaning: 'Inadequate protein or extreme calorie restriction, leading to muscle breakdown.' },
    { score: 'Toxic', meaning: 'High intake of refined sugars, trans-fats, or alcohol, completely disrupting cellular repair.' },
  ],
};

export const amateurRules = {
  title: 'Refeed Guidelines',
  governingBody: 'International Society of Sports Nutrition (ISSN)',
  rounds: '24 to 48 hours in duration',
  restPeriod: 'Conducted every 7-14 days depending on body fat levels',
  gloveSize: 'Focus on high glycemic index complex carbohydrates',
  headgear: 'Moderate protein intake; minimize dietary fats to avoid storage',
  scoring: 'Goal is to upregulate leptin hormone levels and restore depleted glycogen reserves.',
  keyDifferences: [
    'Temporary caloric surplus (maintenance or 10-20% above)',
    'Increases metabolic rate and thyroid activity',
    'Fills flat muscles with glycogen, drawing intracellular water',
    'Psychological break from prolonged dieting deficits',
    'Carbohydrates should be prioritized over fat intake',
  ],
};

export const professionalRules = {
  title: 'Intermittent Fasting',
  governingBodies: 'WHO / Sports Science Institutes',
  rounds: '16 hours fasting / 8 hours feeding window standard',
  restPeriod: 'Zero calorie liquids allowed during fasting (water, black coffee)',
  gloveSize: 'Hydration should include trace sea salts for electrolyte balance',
  headgear: 'Not recommended during heavy glycogen depletion cycles',
  scoring: 'Aims to induce mild ketosis, enhance insulin sensitivity, and promote cellular autophagy.',
  keyDifferences: [
    'Improves insulin sensitivity and glucose clearance',
    'Promotes growth hormone secretion to protect muscle tissue',
    'Allows digestive organs time to clear inflammation',
    'Easier calorie management due to compressed eating window',
    'Must be paired with high nutrient density during feeding window',
  ],
};

export const ringDimensions = {
  size: 'Pre-Workout Window: 2-3 hours before exercise (complex carbs + lean protein)',
  standard: 'Intra-Workout: Electrolytes + simple sugars if duration exceeds 60 minutes',
  ropes: 'Post-Workout: Within 45 minutes (fast-acting protein + insulin-spiking carbs)',
  canvas: 'Sleep Window: 8 hours (avoid heavy meals within 2 hours of bedtime)',
  corners: 'Microbiome Shield: Daily intake of fermented foods (kefir, sauerkraut)',
  apron: 'Thermic Window: High protein meal spacing every 3-4 hours to trigger muscle growth',
};
