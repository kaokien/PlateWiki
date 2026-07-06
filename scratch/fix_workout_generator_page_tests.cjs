const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/views/WorkoutGeneratorPage.test.ts');
if (fs.existsSync(filePath)) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace GOAL_CATEGORY_MAP
  const targetMap = `const GOAL_CATEGORY_MAP: Record<string, string[]> = {
  power: ['Proteins', 'Vitamins & Minerals', 'Gut Health'],
  speed: ['Carbs', 'Fats & Hydration'],
  defense: ['Adaptogens', 'Gut Health', 'Vitamins & Minerals'],
  conditioning: ['Carbs', 'Proteins', 'Fats & Hydration'],
  'all-around': ['Carbs', 'Proteins', 'Fats & Hydration', 'Vitamins & Minerals', 'Adaptogens', 'Gut Health'],
};`;

  const replacementMap = `const GOAL_CATEGORY_MAP: Record<string, string[]> = {
  power: ['Macronutrients', 'Micronutrients'],
  speed: ['Macronutrients', 'Hydration & Salts'],
  defense: ['Superfoods & Adaptogens', 'Gut & Digestion', 'Micronutrients'],
  conditioning: ['Macronutrients', 'Hydration & Salts', 'Gut & Digestion'],
  'all-around': ['Macronutrients', 'Hydration & Salts', 'Micronutrients', 'Gut & Digestion', 'Superfoods & Adaptogens'],
};`;

  content = content.replace(targetMap, replacementMap);

  // Replace test descriptions/assertions for power and defense goals
  content = content.replace(
    "power goal should filter to Proteins, Vitamins & Minerals, Gut Health categories",
    "power goal should filter to Macronutrients and Micronutrients categories"
  );
  content = content.replace(
    "defense goal should filter to Adaptogens, Gut Health, Vitamins & Minerals",
    "defense goal should filter to Superfoods & Adaptogens, Gut & Digestion, and Micronutrients"
  );

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully fixed WorkoutGeneratorPage.test.ts');
}
