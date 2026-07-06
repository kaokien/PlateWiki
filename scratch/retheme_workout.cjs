const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/views/WorkoutPage.tsx');
if (fs.existsSync(filePath)) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace PRESETS object completely
  const startIdx = content.indexOf('const PRESETS = {');
  const endIdx = content.indexOf('const WorkoutPage = () => {');

  if (startIdx !== -1 && endIdx !== -1) {
    const replacement = `const PRESETS = {
  'usain-bolt': {
    name: 'Usain Bolt (Endurance Carb Load)',
    description: 'High carb focus: High-volume energy fueling intervals, timed carbohydrate load guidelines and hydration cues.',
    rounds: 5,
    roundDuration: 180,
    restDuration: 30,
    focusMode: 'All',
    signatures: ['sweet-potato', 'oatmeal', 'blueberries', 'coconut-water']
  },
  'arnold-schwarzenegger': {
    name: 'Arnold Schwarzenegger (Anabolic Protein Build)',
    description: 'Strength builder focus: Frequent amino acid intake prompts, protein synthesis cycles, and mineral baseline density.',
    rounds: 8,
    roundDuration: 180,
    restDuration: 60,
    focusMode: 'All',
    signatures: ['whey-isolate', 'eggs', 'salmon', 'spinach', 'pumpkin-seeds']
  },
  'georges-st-pierre': {
    name: 'Georges St-Pierre (Intermittent Fasting & Adaptogens)',
    description: 'Fasting and gut focus: Compressed 16/8 eating windows, probiotic microflora prompts, and stress adaptation.',
    rounds: 6,
    roundDuration: 180,
    restDuration: 45,
    focusMode: 'All',
    signatures: ['kefir', 'ginger', 'ashwagandha', 'lions-mane', 'turmeric']
  },
  'michael-phelps': {
    name: 'Michael Phelps (Endurance Metabolic Fueling)',
    description: 'Endurance athlete focus: Extreme caloric density cycles, simple glycogen hydration, and antioxidant intake.',
    rounds: 12,
    roundDuration: 180,
    restDuration: 60,
    focusMode: 'All',
    signatures: ['oatmeal', 'sweet-potato', 'coconut-water', 'blueberries']
  }
};\n\n`;
    content = content.substring(0, startIdx) + replacement + content.substring(endIdx);
    console.log('Successfully replaced PRESETS in WorkoutPage.tsx');
  }

  // General text replaces
  content = content.split('Round Timer').join('Fasting/Harvest Timer');
  content = content.split('round timer').join('fasting/harvest timer');
  content = content.split('Heavy Bag Timer').join('Interval Fueling Coach');
  content = content.split('Heavy Bag Workout').join('Interval Fueling Session');
  content = content.split('fighterPreset').join('athletePreset');
  content = content.split('Fighter Preset').join('Athlete Preset');
  content = content.split('Fighter preset').join('Athlete preset');
  content = content.split('boxingwiki_voice_callouts').join('foodwiki_voice_callouts');
  content = content.split('boxingwiki_timer_preset').join('foodwiki_timer_preset');
  content = content.split('Round').join('Block');
  content = content.split('round').join('block');
  content = content.split('Rounds').join('Blocks');
  content = content.split('rounds').join('blocks');
  content = content.split('ROUNDS').join('BLOCKS');
  content = content.split('ROUND').join('BLOCK');
  content = content.split('REST').join('DIGESTION');
  content = content.split('Rest').join('Digestion');
  content = content.split('rest').join('digestion');
  content = content.split('Combo').join('Recipe');
  content = content.split('combo').join('recipe');
  content = content.split('Combos').join('Recipes');
  content = content.split('combos').join('recipes');
  content = content.split('Punch').join('Harvest');
  content = content.split('punch').join('harvest');
  content = content.split('Punches').join('Harvests');
  content = content.split('punches').join('harvests');
  content = content.split('boxing').join('nutrition');
  content = content.split('Boxing').join('Nutrition');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Completed WorkoutPage.tsx retheming.');
}
