/**
 * Nutrition Glossary — A-Z dictionary of nutrition terminology.
 * Each entry: { term, slug, definition, category?, relatedTechnique? }
 * Categories: Macronutrients, Micronutrients, Physiology, Digestion, Timing, Hormones, Superfoods
 */

/** Convert a term name into a URL-safe slug */
export const toSlug = (term) => term.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export const glossary = [
  { term: 'Amino Acids', definition: 'The organic building blocks of proteins. Nine of these are "essential" and must be obtained from food (e.g., pasture-raised eggs, wild salmon) because the body cannot synthesize them.', category: 'Macronutrients', relatedTechnique: 'whey-isolate' },
  { term: 'Anabolism', definition: 'The metabolic state of building or repairing muscle tissue. Triggered by adequate protein intake, resistance training, and low systemic stress.', category: 'Physiology' },
  { term: 'Antioxidants', definition: 'Compounds that inhibit oxidation, neutralising free radicals that cause cellular damage. Found in high concentrations in wild blueberries and turmeric.', category: 'Superfoods', relatedTechnique: 'blueberries' },
  { term: 'Autophagy', definition: 'A natural cellular self-clearing process where the body breaks down and recycles damaged proteins and cellular components. Promoted by intermittent fasting.', category: 'Physiology' },
  { term: 'BCAAs', definition: 'Branched-Chain Amino Acids (leucine, isoleucine, and valine), which are critical for muscle protein synthesis and reducing workout-induced fatigue.', category: 'Macronutrients', relatedTechnique: 'whey-isolate' },
  { term: 'Bioavailability', definition: 'The rate and extent to which a nutrient is absorbed and becomes available for physiological use by the body. Animal proteins generally have higher bioavailability than raw plant proteins.', category: 'Digestion' },
  { term: 'Carbohydrates', definition: 'The body\'s primary source of glucose. Divided into simple sugars (fast-burning) and complex carbs (slow-burning, like sweet potatoes or sprouted oats).', category: 'Macronutrients', relatedTechnique: 'sweet-potato' },
  { term: 'Catabolism', definition: 'The metabolic state of breaking down complex molecules into simpler ones, often resulting in muscle tissue loss during extreme calorie deficits or chronic stress.', category: 'Physiology' },
  { term: 'Choline', definition: 'An essential nutrient found in high amounts in pasture-raised egg yolks that supports cognitive function, neurotransmitter synthesis, and liver health.', category: 'Micronutrients', relatedTechnique: 'eggs' },
  { term: 'Cortisol', definition: 'A primary stress hormone that, when chronically elevated, blocks muscle synthesis, impairs digestion, and promotes visceral fat storage.', category: 'Hormones' },
  { term: 'Electrolytes', definition: 'Minerals (sodium, potassium, magnesium) that carry electrical charges. Essential for muscle contractions, nervous system function, and intracellular hydration.', category: 'Micronutrients', relatedTechnique: 'coconut-water' },
  { term: 'Fasting', definition: 'Abstaining from caloric intake for a set period. Upregulates growth hormone, increases insulin sensitivity, and triggers cellular repair mechanisms.', category: 'Timing' },
  { term: 'Fermented Foods', definition: 'Foods processed via microbial activity (e.g., kefir, sauerkraut), rich in probiotics that support gut microflora and nutrient absorption.', category: 'Digestion', relatedTechnique: 'kefir' },
  { term: 'Glycemic Index', definition: 'A relative ranking of how quickly carbohydrates increase blood glucose levels. Lower glycemic index carbs provide sustained, non-spiking energy.', category: 'Timing', relatedTechnique: 'sweet-potato' },
  { term: 'Glycogen', definition: 'The storage form of glucose in muscle and liver tissue. Crucial for supplying explosive energy during high-intensity athletic performance.', category: 'Physiology', relatedTechnique: 'sweet-potato' },
  { term: 'Gut Microbiome', definition: 'The complex ecosystem of trillions of microbes residing in the digestive tract, responsible for producing vitamins, managing immune response, and extracting nutrients.', category: 'Digestion', relatedTechnique: 'kefir' },
  { term: 'Insulin Sensitivity', definition: 'How responsive cells are to insulin. High sensitivity allows glucose to enter cells efficiently, reducing fat storage and improving muscle fueling.', category: 'Physiology' },
  { term: 'Ketosis', definition: 'A metabolic state where the liver converts fats into ketones to use as energy when glycogen stores are depleted.', category: 'Physiology' },
  { term: 'Leptin', definition: 'A hormone produced by fat cells that regulates energy balance by inhibiting hunger, signaling the brain that the body has sufficient energy reserves.', category: 'Hormones' },
  { term: 'Lipids', definition: 'Dietary fats, vital for hormone production, brain health, and joint lubrication. Sources include wild salmon, avocados, and pasture-raised eggs.', category: 'Macronutrients', relatedTechnique: 'salmon' },
  { term: 'mTOR Pathway', definition: 'The mammalian target of rapamycin. The primary cellular pathway that regulates protein synthesis and muscle hypertrophy, triggered by leucine and lifting.', category: 'Physiology', relatedTechnique: 'whey-isolate' },
  { term: 'Nitrates', definition: 'Naturally occurring compounds in beetroot juice that convert to nitric oxide, dilating blood vessels and improving oxygen delivery to working muscles.', category: 'Micronutrients', relatedTechnique: 'beetroot-juice' },
  { term: 'Omega-3 Fatty Acids', definition: 'Essential polyunsaturated fatty acids (EPA/DHA) that act as powerful anti-inflammatories and compose brain cell membranes. Sourced from wild salmon.', category: 'Macronutrients', relatedTechnique: 'salmon' },
  { term: 'Probiotics', definition: 'Live beneficial bacteria that colonize the digestive tract and strengthen the gut microbiome, found in abundance in fermented kefir.', category: 'Digestion', relatedTechnique: 'kefir' },
  { term: 'Protein Density', definition: 'The ratio of protein content relative to total calories. High protein density foods maximize muscle repair while managing energy intake.', category: 'Macronutrients', relatedTechnique: 'eggs' },
  { term: 'Refeed Day', definition: 'A planned temporary increase in caloric intake (predominantly carbohydrates) to restore leptin, fill glycogen, and kickstart metabolic rate.', category: 'Timing' },
  { term: 'Sprouting', definition: 'The practice of germinating grains or seeds (e.g. sprouted oats) before consumption, neutralizing anti-nutrients like phytic acid to improve digestibility.', category: 'Digestion', relatedTechnique: 'oatmeal' },
  { term: 'Thermic Effect of Food', definition: 'The energy expended by the body to digest, absorb, and process nutrients. Protein has the highest TEF, burning up to 30% of its caloric value during digestion.', category: 'Physiology' },
  { term: 'Water Intracellular', definition: 'Water stored inside muscle cells, crucial for hydration, muscle volume, and electrolyte exchange. Facilitated by sodium, potassium, and creatine.', category: 'Physiology', relatedTechnique: 'coconut-water' },

  /* ── New entries (batch 2) ── */
  { term: 'Adaptogens', definition: 'A class of bioactive plant compounds—such as withanolides in ashwagandha—that modulate the hypothalamic-pituitary-adrenal axis, helping the body resist physiological stress and improve recovery capacity.', category: 'Superfoods', relatedTechnique: 'ashwagandha' },
  { term: 'Beta-Glucans', definition: 'Soluble polysaccharide fibers found in oats and barley that form a viscous gel in the gut, slowing glucose absorption and supporting sustained energy during endurance activity.', category: 'Macronutrients', relatedTechnique: 'oatmeal' },
  { term: 'Capsaicin', definition: 'The active vanilloid compound in chili peppers that binds TRPV1 receptors, increasing thermogenesis and metabolic rate while promoting endorphin release during exercise.', category: 'Micronutrients' },
  { term: 'Circadian Eating', definition: 'An eating pattern aligned to the body\'s 24-hour circadian clock, concentrating caloric intake during daylight hours when insulin sensitivity and digestive enzyme output peak.', category: 'Timing' },
  { term: 'Collagen', definition: 'The most abundant structural protein in connective tissue, composed primarily of glycine, proline, and hydroxyproline. Supplemental collagen peptides support tendon, ligament, and joint integrity under athletic load.', category: 'Macronutrients' },
  { term: 'Creatine Phosphate', definition: 'A high-energy phosphagen stored in skeletal muscle that rapidly regenerates ATP during short-burst, high-intensity efforts such as sprints and heavy lifts.', category: 'Physiology' },
  { term: 'DOMS', definition: 'Delayed Onset Muscle Soreness, the micro-inflammatory response peaking 24–72 hours after eccentric-heavy training. Driven by mechanical disruption of sarcomeres and subsequent neutrophil infiltration.', category: 'Physiology' },
  { term: 'EGCG', definition: 'Epigallocatechin gallate, a catechin polyphenol concentrated in green tea that inhibits catechol-O-methyltransferase, prolonging norepinephrine signaling to increase fat oxidation during exercise.', category: 'Micronutrients' },
  { term: 'Essential Fatty Acids', definition: 'Linoleic acid (omega-6) and alpha-linolenic acid (omega-3) are polyunsaturated fats the body cannot synthesize. They serve as precursors to eicosanoids that regulate inflammation and vascular tone.', category: 'Macronutrients', relatedTechnique: 'salmon' },
  { term: 'Flavonoids', definition: 'A diverse group of plant polyphenolic metabolites—including anthocyanins in blueberries—that reduce exercise-induced oxidative stress and improve endothelial nitric oxide production.', category: 'Micronutrients', relatedTechnique: 'blueberries' },
  { term: 'FODMAP', definition: 'Fermentable Oligosaccharides, Disaccharides, Monosaccharides, and Polyols—short-chain carbohydrates that can trigger osmotic diarrhea and bloating in sensitive athletes when consumed pre-training.', category: 'Digestion' },
  { term: 'Gluconeogenesis', definition: 'A hepatic metabolic pathway that synthesizes glucose from non-carbohydrate substrates such as lactate, glycerol, and glucogenic amino acids during prolonged fasting or exhaustive exercise.', category: 'Physiology' },
  { term: 'HCl (Stomach Acid)', definition: 'Hydrochloric acid secreted by parietal cells in the stomach, essential for denaturing dietary proteins and activating pepsinogen into pepsin for efficient protein digestion.', category: 'Digestion', relatedTechnique: 'acv' },
  { term: 'Histamine Intolerance', definition: 'A condition caused by diamine oxidase (DAO) enzyme insufficiency, leading to excess histamine accumulation from fermented or aged foods and manifesting as GI distress, headaches, or skin flushing.', category: 'Digestion' },
  { term: 'Leucine Threshold', definition: 'The minimum leucine dose (approximately 2.5–3 g per meal) required to maximally stimulate the mTOR pathway and initiate skeletal muscle protein synthesis.', category: 'Physiology', relatedTechnique: 'whey-isolate' },
  { term: 'Metabolic Flexibility', definition: 'The ability of mitochondria to efficiently switch between oxidizing carbohydrates and fatty acids based on substrate availability, exercise intensity, and hormonal signaling.', category: 'Physiology' },
  { term: 'Microbiome Diversity', definition: 'The species richness and evenness of gut microbial communities. Greater diversity correlates with improved nutrient extraction, immune resilience, and reduced systemic inflammation in athletes.', category: 'Digestion', relatedTechnique: 'kefir' },
  { term: 'Nitrogen Balance', definition: 'The difference between dietary nitrogen intake (from protein) and nitrogen excretion. A positive nitrogen balance is required for net muscle protein accretion during training phases.', category: 'Physiology', relatedTechnique: 'eggs' },
  { term: 'Phytonutrients', definition: 'Bioactive non-essential plant compounds—including carotenoids, glucosinolates, and flavonoids—that modulate detoxification enzymes, reduce oxidative damage, and support recovery.', category: 'Micronutrients', relatedTechnique: 'spinach' },
  { term: 'Polyphenols', definition: 'A broad class of phenolic secondary metabolites found in fruits, tea, and dark chocolate that exert antioxidant, anti-inflammatory, and prebiotic effects beneficial for post-exercise recovery.', category: 'Micronutrients', relatedTechnique: 'blueberries' },
  { term: 'Resistant Starch', definition: 'A type of starch that escapes small-intestine digestion and ferments in the colon, producing short-chain fatty acids like butyrate that fuel colonocytes and improve insulin sensitivity.', category: 'Macronutrients', relatedTechnique: 'sweet-potato' },
  { term: 'Satiety Index', definition: 'A measure of how effectively a food suppresses hunger relative to its caloric content. High-satiety foods like eggs reduce total energy intake, aiding body composition goals.', category: 'Timing', relatedTechnique: 'eggs' },
  { term: 'Selenium', definition: 'A trace mineral and essential cofactor for glutathione peroxidase, a key antioxidant enzyme that protects muscle cell membranes from exercise-induced lipid peroxidation.', category: 'Micronutrients' },
  { term: 'Sulforaphane', definition: 'An isothiocyanate derived from glucoraphanin in cruciferous vegetables that activates the Nrf2 pathway, upregulating the body\'s endogenous antioxidant and phase-II detoxification enzymes.', category: 'Micronutrients' },
  { term: 'Thermic Advantage', definition: 'The disproportionately high energy cost of digesting protein compared to fats or carbohydrates, making high-protein foods metabolically favorable for lean mass retention during caloric deficits.', category: 'Physiology', relatedTechnique: 'whey-isolate' },
  { term: 'VO2 Max Nutrition', definition: 'Dietary strategies—particularly dietary nitrate from beetroot juice—that enhance maximal oxygen uptake by improving mitochondrial efficiency and reducing the oxygen cost of submaximal exercise.', category: 'Physiology', relatedTechnique: 'beetroot-juice' },
];

/**
 * Get all unique first letters for the A-Z jump nav
 */
export const getGlossaryLetters = () => {
  const letters = new Set(glossary.map(g => g.term.charAt(0).toUpperCase()));
  return Array.from(letters).sort();
};

/**
 * Get all unique categories
 */
export const getGlossaryCategories = () => {
  const cats = new Set(glossary.filter(g => g.category).map(g => g.category));
  return ['All', ...Array.from(cats).sort()];
};

/**
 * Look up a single glossary entry by its URL slug
 */
export const getGlossaryBySlug = (slug) => {
  return glossary.find(g => toSlug(g.term) === slug) || null;
};

/**
 * Get terms in the same category (excluding the current term)
 */
export const getRelatedTerms = (term, limit = 6) => {
  const entry = glossary.find(g => g.term === term);
  if (!entry || !entry.category) return [];
  return glossary
    .filter(g => g.category === entry.category && g.term !== term)
    .slice(0, limit);
};
