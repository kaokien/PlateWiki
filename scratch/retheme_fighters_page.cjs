const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/views/FightersPage.tsx');
if (fs.existsSync(filePath)) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace STYLE_FILTERS and STANCE_FILTERS
  content = content.replace(
    `const STYLE_FILTERS = [
  { label: 'All Styles', value: 'all' },
  { label: 'Swarmer', value: 'swarmer' },
  { label: 'Outboxer', value: 'outboxer' },
  { label: 'Counter-Puncher', value: 'counter-puncher' },
  { label: 'Boxer-Puncher', value: 'boxer-puncher' },
  { label: 'Pressure', value: 'pressure' },
  { label: 'Movement', value: 'movement' },
  { label: 'Technical', value: 'technical' },
];`,
    `const STYLE_FILTERS = [
  { label: 'All Goals', value: 'all' },
  { label: 'Runners / Endurance', value: 'runner' },
  { label: 'Lifters / Strength', value: 'lifter' },
  { label: 'Fighters / Adaptogens', value: 'fighter' },
];`
  );

  content = content.replace(
    "const STANCE_FILTERS = ['All Stances', 'orthodox', 'southpaw'];",
    "const STANCE_FILTERS = ['All Goals', 'orthodox', 'southpaw'];"
  );

  // Replace header & subtitles
  content = content.replace('FIGHTER <span className="text-primary">STYLES</span>', 'ATHLETE <span className="text-primary">FUEL PROFILES</span>');
  content = content.replace('Study how the greats fought. Each profile breaks down their style, maps their signature techniques, and shows you what to train.', 'Study how the elite fuel. Each profile breaks down their sports nutrition, maps their signature foods, and shows you what to prepare.');
  content = content.replace('Search fighters...', 'Search athlete profiles...');
  content = content.replace('Search fighters', 'Search athletes');
  content = content.replace('fighters-page', 'athletes-page');
  content = content.replace('fighters-header', 'athletes-header');
  content = content.replace('fighters-subtitle', 'athletes-subtitle');
  content = content.replace('fighters-controls', 'athletes-controls');
  content = content.replace('fighters-search-wrap', 'athletes-search-wrap');
  content = content.replace('fighters-filter-row', 'athletes-filter-row');
  
  // Stat bar label translation
  content = content.replace("label={label}", "label={label === 'power' ? 'Power & Strength' : label === 'speed' ? 'Speed & Metabolism' : label === 'defense' ? 'Gut Shield & Digestion' : label === 'footwork' ? 'Hydration Status' : label === 'ringIQ' ? 'Nutritional IQ' : 'Endurance & Glycogen'}");

  // Grid / Cards
  content = content.replace('Record: {f.record}', 'Achievement: {f.record}');
  content = content.replace('Style: {f.style}', 'Fueling Strategy: {f.style}');
  content = content.replace('Stance: {f.stance}', 'Goal Stance: {f.stance === "both" ? "Hybrid" : f.stance === "orthodox" ? "Endurance" : "Strength"}');
  content = content.replace('View Stance & Techniques', 'View Fuel Profile');
  content = content.replace('/fighter/', '/athletes/'); // wait, route for single fighter is `/fighter/[id]`. Let's see: the route in Next.js pages might be `/fighter/[id]`. Let's keep it as `/fighter/` to avoid next.js router mismatches, but change the display label!

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully rethemed FightersPage.tsx');
}
