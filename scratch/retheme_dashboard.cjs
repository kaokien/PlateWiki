const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/views/DashboardPage.tsx');
if (fs.existsSync(filePath)) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace PATH_STAGES
  content = content.replace(
    `const PATH_STAGES: {
  id: number;
  title: string;
  category: string;
  icon: typeof Crosshair;
  url: string;
  desc: string;
}[] = [
  { id: 0, title: 'Stance & Footwork',   category: 'Footwork',      icon: Move,      url: '/techniques/footwork',      desc: 'Balance, movement, and ring positioning.' },
  { id: 1, title: 'Offensive Arsenal',   category: 'Punches',       icon: Crosshair, url: '/techniques/punches',        desc: 'Jab, cross, hooks, uppercuts.' },
  { id: 2, title: 'Defensive Craft',     category: 'Defense',       icon: Shield,    url: '/techniques/defense',        desc: 'Slips, rolls, guards, and blocks.' },
  { id: 3, title: 'Combination Work',    category: 'Combinations',  icon: Zap,       url: '/techniques/combinations',   desc: 'Putting punches together.' },
  { id: 4, title: 'Conditioning',        category: 'Conditioning',  icon: Dumbbell,  url: '/techniques/conditioning',   desc: 'Cardio, power, and endurance.' },
  { id: 5, title: 'Ring IQ & Strategy',  category: 'Ring IQ',       icon: Brain,     url: '/techniques/ring-iq',        desc: 'Distance, timing, and fight planning.' },
];`,
    `const PATH_STAGES: {
  id: number;
  title: string;
  category: string;
  icon: typeof Crosshair;
  url: string;
  desc: string;
}[] = [
  { id: 0, title: 'Energy & Carbs',      category: 'Carbs',         icon: Move,      url: '/techniques/carbs',          desc: 'Slow & fast carbs for glycogen load.' },
  { id: 1, title: 'Muscle & Proteins',   category: 'Proteins',      icon: Crosshair, url: '/techniques/proteins',       desc: 'Amino profiles, whey, eggs, salmon.' },
  { id: 2, title: 'Fats & Hydration',    category: 'Fats & Hydration', icon: Shield, url: '/techniques/fats-hydration',   desc: 'Healthy lipids, salts, and coconut water.' },
  { id: 3, title: 'Micronutrients',      category: 'Vitamins & Minerals', icon: Zap, url: '/techniques/vitamins-minerals', desc: 'Iron, zinc, magnesium, and trace salts.' },
  { id: 4, title: 'Stress & Adaptogens',  category: 'Adaptogens',    icon: Dumbbell,  url: '/techniques/adaptogens',     desc: 'Ashwagandha, lion\\'s mane, cordyceps.' },
  { id: 5, title: 'Microbiome & Gut',    category: 'Gut Health',    icon: Brain,     url: '/techniques/gut-health',      desc: 'Probiotics, kefir, and digestion efficiency.' },
];`
  );

  // Replace CATEGORIES
  content = content.replace(
    "const CATEGORIES = ['Punches', 'Defense', 'Footwork', 'Combinations', 'Conditioning', 'Ring IQ'] as const;",
    "const CATEGORIES = ['Carbs', 'Proteins', 'Fats & Hydration', 'Vitamins & Minerals', 'Adaptogens', 'Gut Health'] as const;"
  );

  // Replace QUICK_ACTIONS
  content = content.replace(
    `const QUICK_ACTIONS = [
  { label: 'Techniques',    icon: Crosshair,  href: '/techniques',          desc: 'Browse the full library' },
  { label: 'Body Map',      icon: Activity,   href: '#body-map',            desc: 'Explore by muscle group' },
  { label: 'Workouts',      icon: Dumbbell,   href: '/workouts',            desc: 'Structured gym sessions' },
  { label: 'Film Room',     icon: Play,       href: '/watch',               desc: 'Watch breakdowns & fights' },
  { label: 'Gym Shop',      icon: ShoppingBag, href: '/shop',                desc: 'Unlock gear with Fight Coins' },
  { label: 'Round Timer',   icon: Timer,      href: '/timer',               desc: 'Customizable timer' },
  { label: 'Articles',      icon: BookOpen,   href: '/articles',            desc: 'Strategy & theory' },
  { label: 'Programs',      icon: Target,     href: '/programs',            desc: 'Multi-day plans' },
];`,
    `const QUICK_ACTIONS = [
  { label: 'Foods',         icon: Crosshair,  href: '/techniques',          desc: 'Browse the full food library' },
  { label: 'Anatomy Map',   icon: Activity,   href: '#body-map',            desc: 'Explore by muscle target' },
  { label: 'Recipes',       icon: Dumbbell,   href: '/workouts',            desc: 'Structured recipe guides' },
  { label: 'Glossary',      icon: BookOpen,   href: '/glossary',            desc: 'Quick vocabulary reference' },
  { label: 'Kitchen Shop',  icon: ShoppingBag, href: '/shop',                desc: 'Unlock apparel with Seed Coins' },
  { label: 'Fasting Timer', icon: Timer,      href: '/timer',               desc: 'Customizable fasting timer' },
  { label: 'Articles',      icon: BookOpen,   href: '/articles',            desc: 'Nutrition science articles' },
  { label: 'Programs',      icon: Target,     href: '/programs',            desc: 'Multi-day fuel plans' },
];`
  );

  // General text replaces
  content = content.replace('Training Dashboard', 'Fueling Dashboard');
  content = content.replace('Sign in to access your personalized boxing training path, progress tracking, and workout recommendations.', 'Sign in to access your personalized clean fueling path, progress tracking, and recipe recommendations.');
  content = content.replace("displayName || user?.firstName || 'Fighter'", "displayName || user?.firstName || 'Harvest Sprout'");
  content = content.replace('🥊', '🌱');
  content = content.replace('Fighter Profile', 'Athlete Profile');
  content = content.replace('Workouts completed', 'Recipes completed');
  content = content.replace('WorkoutsCompleted', 'workoutsCompleted');
  content = content.replace('workoutsCompleted}</span>\n              <span className="dash-record-inline__lbl">Workouts</span>', 'workoutsCompleted}</span>\n              <span className="dash-record-inline__lbl">Recipes</span>');
  content = content.replace('techniquesStudied}</span>\n              <span className="dash-record-inline__lbl">Techniques</span>', 'techniquesStudied}</span>\n              <span className="dash-record-inline__lbl">Foods</span>');
  content = content.replace("Begin your boxing journey — learn proper stance and footwork first.", "Begin your clean fueling journey — explore energy and carbs first.");
  content = content.replace("You've cleared The Path. Keep sharpening your skills across all disciplines.", "You've cleared The Path. Keep balancing your nutrition across all categories.");
  content = content.replace("{status === 'completed' ? 'Review' : 'Train'}", "{status === 'completed' ? 'Review' : 'Fuel'}");
  content = content.replace('Build Custom Workout', 'Build Custom Fueling Plan');
  content = content.replace("FIGHT COINS", "SEED COINS");
  content = content.replace("(profile.fightCoins || 0)", "(profile.fightCoins || 0)");

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully rethemed DashboardPage.tsx');
}
