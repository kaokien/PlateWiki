const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/components/HomeFighterModule.tsx');
if (fs.existsSync(filePath)) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace PATH_STAGES
  content = content.replace(
    `const PATH_STAGES = [
  {
    id: 0,
    title: 'Fundamentals & Footwork',
    desc: 'Master the foundation of balance, stance choice, and basic movement steps.',
    category: 'Footwork',
    icon: Move,
    url: '/techniques/footwork',
    minTechs: 0,
    maxTechs: 5,
  },
  {
    id: 1,
    title: 'Offensive Arsenal',
    desc: 'Learn standard punches, rotational power, and basic combination flows.',
    category: 'Punches',
    icon: Crosshair,
    url: '/techniques/punches',
    minTechs: 5,
    maxTechs: 15,
  },
  {
    id: 2,
    title: 'Defensive Cover',
    desc: 'Protect yourself with high guards, slip head movement, and ducks.',
    category: 'Defense',
    icon: Shield,
    url: '/techniques/defense',
    minTechs: 15,
    maxTechs: 30,
  },
  {
    id: 3,
    title: 'Ring Strategy & IQ',
    desc: 'Understand ring generalship, distance control, and sparring strategies.',
    category: 'Ring IQ',
    icon: Brain,
    url: '/techniques/ring-iq',
    minTechs: 30,
    maxTechs: 50,
  },
  {
    id: 4,
    title: 'Conditioning & Bag Work',
    desc: 'Build boxing cardio, speed endurance, and heavy bag power rounds.',
    category: 'Conditioning',
    icon: Dumbbell,
    url: '/techniques/conditioning',
    minTechs: 50,
    maxTechs: 100,
  },
];`,
    `const PATH_STAGES = [
  {
    id: 0,
    title: 'Energy & Carbs',
    desc: 'Master the foundation of glycogen restoration and slow/fast carb load timing.',
    category: 'Carbs',
    icon: Move,
    url: '/techniques/carbs',
    minTechs: 0,
    maxTechs: 4,
  },
  {
    id: 1,
    title: 'Muscle & Proteins',
    desc: 'Learn essential amino acid profiles, whey protein isolate, and recovery foods.',
    category: 'Proteins',
    icon: Crosshair,
    url: '/techniques/proteins',
    minTechs: 4,
    maxTechs: 8,
  },
  {
    id: 2,
    title: 'Fats & Hydration',
    desc: 'Support joint lubrication, cellular balance, and trace salt electrolytes.',
    category: 'Fats & Hydration',
    icon: Shield,
    url: '/techniques/fats-hydration',
    minTechs: 8,
    maxTechs: 12,
  },
  {
    id: 3,
    title: 'Stress & Adaptogens',
    desc: 'Regulate cortisol and improve focus with ashwagandha and medicinal mushrooms.',
    category: 'Adaptogens',
    icon: Brain,
    url: '/techniques/adaptogens',
    minTechs: 12,
    maxTechs: 15,
  },
  {
    id: 4,
    title: 'Microbiome & Gut',
    desc: 'Build a solid gut barrier and absorb nutrients with fermented kefir and probiotics.',
    category: 'Gut Health',
    icon: Dumbbell,
    url: '/techniques/gut-health',
    minTechs: 15,
    maxTechs: 18,
  },
];`
  );

  // Replace text
  content = content.replace("displayName || 'Fighter'", "displayName || 'Harvest Sprout'");
  content = content.replace('Next Training', 'Next Up');
  content = content.replace('Techs', 'Foods');
  content = content.replace('Resume Training', 'Resume Fueling');
  content = content.replace('Training is better together', 'Fueling is better together');
  content = content.replace('Join 400+ fighters in our Discord: ask questions, share sparring footage, and learn together.', 'Join 400+ athletes in our Discord: ask questions, share meal prep photos, and learn together.');
  content = content.replace('Enter Locker Room', 'Enter Kitchen Community');
  content = content.replace('RECOMMENDED SEQUENCE FOR BOXERS', 'RECOMMENDED NUTRITIONAL SEQUENCE');
  content = content.replace('Review category', 'Review category');
  content = content.replace('Resume training', 'Resume fueling');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully rethemed HomeFighterModule.tsx');
}
