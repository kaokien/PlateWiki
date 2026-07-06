const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/views/TechniquesPage.tsx');
if (fs.existsSync(filePath)) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace CATEGORIES
  content = content.replace(
    "const CATEGORIES = ['All', 'Punches', 'Defense', 'Footwork', 'Combinations', 'Ring IQ', 'Conditioning'];",
    "const CATEGORIES = ['All', 'Carbs', 'Proteins', 'Fats & Hydration', 'Vitamins & Minerals', 'Adaptogens', 'Gut Health'];"
  );

  // Replace STANCES
  content = content.replace(
    "const STANCES = ['Any Stance', 'orthodox', 'southpaw', 'both'];",
    "const STANCES = ['Any Goal', 'runner', 'lifter', 'fighter'];"
  );

  // Replace FORMATS
  content = content.replace(
    "const FORMATS = ['Any Format', 'solo', 'bag', 'pads', 'partner'];",
    "const FORMATS = ['Any Form', 'cooked', 'raw', 'powder', 'capsule', 'liquid'];"
  );

  // Replace text
  content = content.replace('TECHNIQUE <span className="text-primary">LIBRARY</span>', 'FOOD & NUTRITION <span className="text-primary">LIBRARY</span>');
  content = content.replace('techniques across', 'whole foods and nutrients across');
  content = content.replace('Search techniques...', 'Search foods & nutrients...');
  content = content.replace('Search techniques', 'Search foods');
  content = content.replace('Random Drill', 'Random Food');
  content = content.replace('Any Stance', 'Any Goal');
  content = content.replace('Any Format', 'Any Form');
  content = content.replace('Training Format', 'Preparation Form');
  content = content.replace('Stance', 'Target Goal');
  content = content.replace('Learn Technique →', 'Learn Food Profile →');
  content = content.replace('No techniques found', 'No foods found');
  content = content.replace('No techniques match', 'No foods match');
  content = content.replace('Clear All Filters', 'Clear All Filters');
  content = content.replace('Browse techniques', 'Browse foods');
  content = content.replace('technique{filtered', 'food{filtered');
  content = content.replace('technique.id', 'tech.id');
  content = content.replace('technique.name', 'tech.name');
  content = content.replace('Save technique', 'Save food');
  content = content.replace('🥊', '🌱');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully rethemed TechniquesPage.tsx');
}
