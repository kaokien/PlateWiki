const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/components/layout/Header.tsx');
if (fs.existsSync(filePath)) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace NAV_GROUPS & NAV_SINGLES
  const startIdx = content.indexOf('const NAV_GROUPS: NavGroup[]');
  const endIdx = content.indexOf('const NAV_SINGLES: NavItem[]');

  if (startIdx !== -1 && endIdx !== -1) {
    const replacement = `const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Learn',
    items: [
      { href: '/', label: 'Anatomy Map', icon: Map },
      { href: '/techniques', label: 'Foods', icon: Crosshair },
      { href: '/articles', label: 'Articles', icon: Newspaper },
      { href: '/glossary', label: 'Glossary', icon: BookOpen },
      { href: '/rules', label: 'Dietary Rules', icon: Scale },
      { href: '/course', label: 'Earthy Blueprint', icon: GraduationCap },
    ],
  },
  {
    label: 'Prep & Fuel',
    items: [
      { href: '/workouts', label: 'Recipes', icon: Target },
      { href: '/exercises', label: 'Nutrients', icon: Dumbbell },
      { href: '/programs', label: 'Programs', icon: CalendarDays },
      { href: '/workout-generator', label: 'Meal Planner', icon: Wand2 },
      { href: '/workout', label: 'Fasting Timer', icon: Timer },
      { href: '/watch', label: 'Nutrition Videos', icon: Play },
    ],
  },
  {
    label: 'Community',
    items: [
      { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
      { href: 'https://discord.gg/Vhygw7DpVM', label: 'Join the Discord', icon: MessageCircle, external: true },
      { href: '/about', label: 'About', icon: Info },
    ],
  },
  {
    label: 'Shop',
    items: [
      { href: '/shop', label: 'Kitchen Shop', icon: ShoppingBag },
      { href: '/merch', label: 'Merch', icon: Shirt },
    ],
  },
];\n\n`;
    content = content.substring(0, startIdx) + replacement + content.substring(endIdx);
  }

  // Replace NAV_SINGLES
  content = content.replace(
    `const NAV_SINGLES: NavItem[] = [
  { href: '/fighters', label: 'Fighters', icon: Users },
  { href: '/favorites', label: 'Saved', icon: Heart },
];`,
    `const NAV_SINGLES: NavItem[] = [
  { href: '/fighters', label: 'Athletes', icon: Users },
  { href: '/favorites', label: 'Saved', icon: Heart },
];`
  );

  // Replace utilityControls
  content = content.replace(
    `<button
        className="stance-toggle-btn"
        onClick={toggleStance}
        aria-label={\`Switch to \${stance === 'orthodox' ? 'southpaw' : 'orthodox'} stance\`}
      >
        <BoxingGloveIcon size={16} className="nav-icon" /> {stance === 'orthodox' ? 'Orthodox' : 'Southpaw'}
      </button>`,
    `<button
        className="stance-toggle-btn"
        onClick={toggleStance}
        aria-label={\`Switch to \${stance === 'orthodox' ? 'southpaw' : 'orthodox'} goal\`}
      >
        <Target size={16} className="nav-icon" /> {stance === 'orthodox' ? 'Endurance Goal' : 'Strength Goal'}
      </button>`
  );

  // Coins emoji
  content = content.replace('🥊', '🌱');

  // Logo
  content = content.replace('<span className="logo-accent">BOXING</span>WIKI', '<span className="logo-accent">FOOD</span>WIKI');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully rethemed Header.tsx');
}
