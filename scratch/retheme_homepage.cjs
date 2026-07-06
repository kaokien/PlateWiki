const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/views/HomePage.tsx');
if (fs.existsSync(filePath)) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace CATEGORY_CARDS
  content = content.replace(
    `const CATEGORY_CARDS = [
  { name: 'Punches', Icon: Crosshair, path: '/techniques/punches', countKey: 'Punches', unit: 'fundamental punches' },
  { name: 'Defense', Icon: Shield, path: '/techniques/defense', countKey: 'Defense', unit: 'defensive techniques' },
  { name: 'Footwork', Icon: Move, path: '/techniques/footwork', countKey: 'Footwork', unit: 'movement patterns' },
  { name: 'Combos', Icon: Zap, path: '/techniques/combinations', countKey: 'Combinations', unit: 'key combinations' },
  { name: 'Conditioning', Icon: Dumbbell, path: '/techniques/conditioning', countKey: 'Conditioning', unit: 'training drills' },
  { name: 'Ring IQ', Icon: Brain, path: '/techniques/ring-iq', countKey: 'Ring IQ', unit: 'strategy concepts' },
];`,
    `const CATEGORY_CARDS = [
  { name: 'Carbs', Icon: Crosshair, path: '/techniques/carbs', countKey: 'Carbs', unit: 'energy sources' },
  { name: 'Proteins', Icon: Shield, path: '/techniques/proteins', countKey: 'Proteins', unit: 'building blocks' },
  { name: 'Fats & Hydration', Icon: Move, path: '/techniques/fats-hydration', countKey: 'Fats & Hydration', unit: 'essential lipids' },
  { name: 'Micronutrients', Icon: Zap, path: '/techniques/vitamins-minerals', countKey: 'Vitamins & Minerals', unit: 'trace minerals' },
  { name: 'Adaptogens', Icon: Dumbbell, path: '/techniques/adaptogens', countKey: 'Adaptogens', unit: 'functional herbs' },
  { name: 'Gut Health', Icon: Brain, path: '/techniques/gut-health', countKey: 'Gut Health', unit: 'microbiome staples' },
];`
  );

  // Replace PROGRAM_DAYS
  content = content.replace(
    `const PROGRAM_DAYS = [
  { day: 1, name: 'The Jab', focus: 'Lead hand power' },
  { day: 2, name: 'The Cross', focus: 'Rear hand mechanics' },
  { day: 3, name: 'The Hook', focus: 'Close range power' },
  { day: 4, name: 'Basic Defense', focus: 'Guard & slips' },
  { day: 5, name: 'Footwork', focus: 'Movement patterns' },
  { day: 6, name: 'Combos', focus: '2-3 punch combos' },
  { day: 7, name: 'Putting It Together', focus: 'Shadow round' },
];`,
    `const PROGRAM_DAYS = [
  { day: 1, name: 'Carb Loading', focus: 'Sweet potatoes & oats' },
  { day: 2, name: 'Protein Repair', focus: 'Egg yolk & whey isolate' },
  { day: 3, name: 'Antioxidants', focus: 'Blueberries & ginger' },
  { day: 4, name: 'Hydration', focus: 'Coconut water & salts' },
  { day: 5, name: 'Stress Adaptogens', focus: 'Ashwagandha & mane' },
  { day: 6, name: 'Gut Restoration', focus: 'Kefir & probiotics' },
  { day: 7, name: 'Full Integration', focus: 'Synergistic recovery meal' },
];`
  );

  // General text replaces
  content = content.replace('MASTER THE <span className="text-primary">SWEET SCIENCE</span>', 'MASTER SPORT <span className="text-primary">NUTRITION</span>');
  content = content.replace('The free, interactive boxing encyclopedia. {totalTechniques} techniques across punches, defense, footwork, combinations, and conditioning.', 'The free, interactive food science encyclopedia. {totalTechniques} whole foods and nutrients targeted by muscle group and metabolic function.');
  content = content.replace('Start Training Free', 'Start Fueling Free');
  content = content.replace('Browse Techniques', 'Browse Foods');
  content = content.replace('INTERACTIVE <span className="text-primary">BODY MAP</span>', 'INTERACTIVE <span className="text-primary">ANATOMY MAP</span>');
  content = content.replace('Build My Workout', 'Build My Fuel Plan');
  content = content.replace('CONTINUE <span className="text-primary">LEARNING</span>', 'CONTINUE <span className="text-primary">FUELING</span>');
  content = content.replace('New to Boxing?', 'New to Performance Fueling?');
  content = content.replace('Begin with our 7-Day Fundamentals program. Learn the jab, cross, hook, and basic defense — one day at a time.', 'Begin with our 7-Day Clean Fueling program. Learn glycogen loading, protein repair, hydration balance, and stress adaptation.');
  content = content.replace('Start 7-Day Program', 'Start 7-Day Program');
  content = content.replace('ONLINE GYM', 'ONLINE KITCHEN');
  content = content.replace('Join Our Training Discord', 'Join Our Fueling Discord');
  content = content.replace('Welcome to the Gym', 'Welcome to the Kitchen');
  content = content.replace('Jump right back in to track your roadwork, submit form feedback, or chat with the community.', 'Jump right back in to track your macro goals, share recipe photos, and chat with the community.');
  content = content.replace('Train, log your progress, and get direct feedback on your form with 400+ fighters worldwide.', 'Fuel, log your daily intake, and get feedback on your sports nutrition plan with 400+ athletes worldwide.');
  content = content.replace('🥊 The Work', '🌱 The Fuel');
  content = content.replace('#road-work', '#macro-goals');
  content = content.replace('#corner-work', '#recipe-swap');
  content = content.replace('#fight-fuel', '#athlete-fuel');
  content = content.replace('#ask-the-coach', '#ask-the-nutritionist');
  content = content.replace('#outside-the-ring', '#lifestyle');
  content = content.replace('Enter the Locker Room', 'Enter the Kitchen Community');
  content = content.replace('ESSENTIAL <span className="text-primary">GEAR</span>', 'ESSENTIAL <span className="text-primary">TOOLS & APPAREL</span>');
  content = content.replace('The equipment every boxer needs. Use code <strong>COACHJOSH</strong> for 15% off at Lead Boxing.', 'The tools and apparel every health enthusiast needs to build a vibrant lifestyle.');
  content = content.replace('Affiliate partnership with <a href="https://leadboxing.com" target="_blank" rel="noopener noreferrer">Lead Boxing</a>. We may earn a small commission at no extra cost to you. Use code <strong>COACHJOSH</strong> at checkout for 15% off.', 'FoodWiki features recommended products to support organic cooking and clean harvesting.');
  content = content.replace("WHAT YOU'LL <span className=\"text-primary\">LEARN</span>", "WHAT YOU'LL <span className=\"text-primary\">MASTER</span>");
  content = content.replace('{totalTechniques}-Technique Library', '{totalTechniques}-Food Library');
  content = content.replace('Every technique page includes step-by-step instructions, coaching cues, common mistakes, pro tips, and the specific\n              conditioning drills you need to build the physical attributes behind each movement.', 'Every food page includes complete nutrient profiles, preparation tips, common pitfalls, target muscle groups, and meal prep combinations to build physical attributes.');
  content = content.replace('Stance-Aware Instructions', 'Goal-Aware Guidelines');
  content = content.replace('Toggle between orthodox and southpaw and every description updates to match your fighting stance.\n              From basic punches through advanced combinations and ring strategy.', 'Toggle between athlete types (runner, lifter, fighter) to adapt macro targets and intake guidelines to your sport.');
  content = content.replace('Anatomy Integration', 'Anatomy Target Mapping');
  content = content.replace('Our interactive anatomical body map connects each muscle group to the boxing techniques that depend\n              on it, so you understand not just <em>how</em> to throw a punch but <em>why</em> your body moves the\n              way it does.', 'Our interactive anatomical map connects each muscle group to the whole foods that feed it, so you understand not just what to eat but exactly how it supports cell function.');
  content = content.replace('BoxingWiki is an independent project', 'FoodWiki is an independent project');
  content = content.replace('Is BoxingWiki free to use?', 'Is FoodWiki free to use?');
  content = content.replace('The entire technique library — all {totalTechniques} techniques with step-by-step breakdowns,\n              coaching cues, common mistakes, and conditioning drills — is free and always will be. We also offer\n              free tools including a boxing round timer, workout generator, and AI-powered shadowbox trainer.', 'The entire food library — all {totalTechniques} nutrients with breakdowns, tips, pitfalls, and combinations — is free and always will be. We also offer free tools including fasting/digestion timers, meal customizers, and an AI-powered webcam harvest coach.');
  content = content.replace('Can I learn boxing from a website?', 'Can I optimize my nutrition from a website?');
  content = content.replace('A website cannot replace a coach who watches your form and gives real-time feedback. However,\n              BoxingWiki serves as an excellent supplement to gym training — a reference you can review before\n              or after class to reinforce what you learned.', 'A website cannot replace a customized clinical diet plan, but FoodWiki serves as an excellent daily guide — a reference you can review during meal prepping or grocery shopping to reinforce healthy choices.');
  content = content.replace('What makes BoxingWiki different from YouTube tutorials?', 'What makes FoodWiki different from YouTube cooking channels?');
  content = content.replace('YouTube is great for visual demonstrations, but the information is scattered across thousands of\n              channels with varying quality and contradictory advice. BoxingWiki organizes every technique into\n              a structured database where each entry includes the same comprehensive format: steps, muscles\n              involved, mistakes to avoid, pro tips, conditioning drills, and links to related techniques.', 'YouTube has great cooking shows, but the science is scattered and contradictory. FoodWiki organizes sports nutrition into a structured database where each food page contains a consistent format: steps, muscles targeted, pitfalls, and meal prep combos.');
  content = content.replace('Do I need equipment to use BoxingWiki?', 'Do I need a kitchen scale to use FoodWiki?');
  content = content.replace('No equipment is required to start learning. Many techniques can be practiced through shadow boxing\n              with nothing but space to move.', 'No complex equipment is required to start fueling. Many concepts can be applied with simple, whole foods available at local farmers\' markets.');
  content = content.replace('Who writes the technique content?', 'Who writes the food and nutrition content?');
  content = content.replace('All technique pages are written and reviewed with input from experienced boxing coaches, including\n              our featured creator Coach Josh, who has 6+ years of coaching experience and has trained over 200\n              athletes. We cross-reference multiple coaching sources and update content based on community\n              feedback to ensure accuracy.', 'All pages are curated with input from experienced coaches and sports nutrition studies. We cross-reference scientific consensus and update content based on community feedback to ensure accuracy.');
  content = content.replace('boxing-theme', 'earth-crunch-theme');
  content = content.replace('BoxingWiki', 'FoodWiki');
  content = content.replace('boxingwiki', 'foodwiki');
  content = content.replace('Boxing Wiki', 'Food Wiki');
  content = content.replace('boxing wiki', 'food wiki');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully rethemed HomePage.tsx');
}
