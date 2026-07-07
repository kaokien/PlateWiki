/**
 * FoodWiki Athlete Fueling Profiles
 * Nutritional analysis + signature superfood mapping for legendary athletes.
 * signatureTechniques[] maps to food IDs in foodsData.ts
 */

export const fighters = [
  {
    id: 'usain-bolt',
    name: 'Usain Bolt',
    nickname: 'Lightning Bolt',
    era: '2002–2017',
    record: '8-time Olympic Gold',
    nationality: 'Jamaica',
    stance: 'orthodox', // mapped to runner/endurance
    weightClass: 'Sprinting / Track',
    style: 'High Carb / Glycogen Loading',
    styleTags: ['runner', 'carb-load'],
    signatureTechniques: ['sweet-potato', 'oatmeal', 'blueberries', 'coconut-water'],
    stats: { power: 85, speed: 99, defense: 78, footwork: 90, ringIQ: 92, stamina: 95 },
    analysis: `Usain Bolt's legendary speed was powered by Jamaican whole foods. While social media popularized the myth of him eating chicken nuggets, his actual competitive prep focused heavily on yams, sweet potatoes, and green bananas for clean glycogen storage. These slow-release complex carbohydrates allowed him to maintain a massive muscular frame while sustaining explosive power. His recovery was optimized by antioxidant-rich berries and deep cellular hydration using natural coconut water to prevent cramping on the track.`,
    strengths: ['Massive glycogen storage capacity', 'High insulin sensitivity', 'Rapid ATP regeneration', 'Excellent electrolyte balance'],
    weaknesses: ['Susceptible to gastrointestinal bloating if raw fibers are too high', 'Requires high calorie volume which can lead to digestion fatigue', 'Faded on low-carb diets'],
    quote: '"My diet is simple: lots of yams, sweet potatoes, and clean protein."',
    lastUpdated: '2026-06-12',
  },
  {
    id: 'arnold-schwarzenegger',
    name: 'Arnold Schwarzenegger',
    nickname: 'Austrian Oak',
    era: '1970–1980',
    record: '7-time Mr. Olympia',
    nationality: 'Austria / USA',
    stance: 'southpaw', // mapped to lifter/strength
    weightClass: 'Bodybuilding / Strength',
    style: 'High Protein / Anabolic Build',
    styleTags: ['lifter', 'protein-build'],
    signatureTechniques: ['whey-isolate', 'eggs', 'salmon', 'spinach', 'pumpkin-seeds'],
    stats: { power: 99, speed: 60, defense: 85, footwork: 75, ringIQ: 95, stamina: 80 },
    analysis: `Arnold Schwarzenegger revolutionized hyper-trophic fueling. During his competitive era, he prioritized high-protein density from whole food sources like pasture-raised eggs, wild salmon, and beef, supplemented by milk proteins. He was an early adopter of essential fatty acids for joint lubrication and testosterone support. His fueling protocol focused on maximizing the mTOR pathway via frequent high-leucine meals, keeping cortisol low and protein synthesis continually active.`,
    strengths: ['Maximum protein synthesis pathway activation', 'High nitrogen retention', 'Dense mineral intake for bone strength', 'Excellent lipid profile management'],
    weaknesses: ['Excessive protein intake occasionally put strain on kidney hydration', 'Relied on dairy which caused digestive sensitivity for some', 'Slow fat adaptation baseline'],
    quote: '"You have to build the muscle, and you can only do that with high-quality food."',
    lastUpdated: '2026-06-12',
  },
  {
    id: 'georges-st-pierre',
    name: 'Georges St-Pierre',
    nickname: 'GSP',
    era: '2002–2017',
    record: '26-2 MMA Champion',
    nationality: 'Canada',
    stance: 'both', // hybrid/all-around
    weightClass: 'Mixed Martial Arts',
    style: 'Intermittent Fasting & Adaptogens',
    styleTags: ['fighter', 'adaptogens'],
    signatureTechniques: ['kefir', 'ginger', 'ashwagandha', 'lions-mane', 'turmeric', 'himalayan-salt'],
    stats: { power: 90, speed: 90, defense: 95, footwork: 88, ringIQ: 99, stamina: 95 },
    analysis: `Georges St-Pierre transitioned to a highly scientific anti-inflammatory diet later in his career. To manage gut health and reduce inflammation from years of combat training, GSP adopted strict intermittent fasting (16/8 window). He focused on fermented kefir for gut microflora, wild salmon for omega-3s, and adaptogenic mushrooms like Lion's Mane and Ashwagandha to regulate stress and mental focus. This protocol allowed him to recover faster and enter the cage in peak physical shape.`,
    strengths: ['Elite insulin sensitivity', 'Very low systemic inflammation', 'Exceptional gut microbiome health', 'Superior stress response regulation via adaptogens'],
    weaknesses: ['Difficult to maintain high body mass during fasting windows', 'Requires strict timing compliance', 'Initial keto-adaptation energy dips'],
    quote: '"Fasting and eating organic, clean food completely changed my recovery and performance."',
    lastUpdated: '2026-06-12',
  },
  {
    id: 'michael-phelps',
    name: 'Michael Phelps',
    nickname: 'The Baltimore Bullet',
    era: '2000–2016',
    record: '23-time Olympic Gold',
    nationality: 'USA',
    stance: 'orthodox',
    weightClass: 'Swimming / Endurance',
    style: 'High Volume Isotonic Fueling',
    styleTags: ['runner', 'carb-load'],
    signatureTechniques: ['oatmeal', 'sweet-potato', 'coconut-water', 'blueberries'],
    stats: { power: 85, speed: 95, defense: 75, footwork: 95, ringIQ: 90, stamina: 99 },
    analysis: `Michael Phelps consumed a legendary 10,000 calorie-per-day diet during his peak training cycles. Because his daily training volume exceeded 6 hours in the pool, his metabolism burned carbs at an extreme rate. He relied on slow-digesting oats and sweet potatoes to prevent cellular energy crashes, along with mass quantities of electrolytes (sodium/potassium) to support heart rate efficiency and maintain glycogen saturation.`,
    strengths: ['Super-human metabolic rate', 'Endless aerobic baseline capacity', 'Rapid lactic acid clearing', 'Perfect electrolyte cell hydration'],
    weaknesses: ['Risk of metabolic crash if eating frequency drops', 'High oxidative stress requiring massive antioxidant intake', 'Hard to maintain whole-food density at such high volume'],
    quote: '"Eat, sleep, and swim. That\'s all I can do. You have to put the right fuel in."',
    lastUpdated: '2026-06-12',
  }
];
