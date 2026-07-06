const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/components/ShadowboxTracker.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Replace PRACTICE_TECHNIQUES definition
const practiceStartIdx = content.indexOf('const PRACTICE_TECHNIQUES: PracticeTechnique[] = [');
const practiceEndIdx = content.indexOf('const renderPunchTrajectorySvg =');

if (practiceStartIdx !== -1 && practiceEndIdx !== -1) {
  const replacement = `const PRACTICE_TECHNIQUES: PracticeTechnique[] = [
  {
    id: 'sweet-potato',
    name: 'Sweet Potatoes',
    type: 'Glycogen Carb Loading',
    instructions: [
      'Reach and harvest sweet potatoes from the lower soil zones.',
      'Keep your core engaged as you bend slightly to reach.',
      'Recover to your upright organic stance.',
      'Exhale and focus on your breathing during the pull.'
    ],
    tips: [
      'Form Check: Keep your hips centered to protect your lower back.',
      'Common Mistake: Grabbing too fast without stabilizing your core.'
    ],
    repCues: [
      'One. Reach down into the soil.',
      'Two. Grab the sweet potato.',
      'Three. Pull it up cleanly.',
      'Four. Exhale as you lift.',
      'Five! Excellent Sweet Potato harvest.'
    ],
    zones: {
      orthodox: 3, // Bottom Left
      southpaw: 5  // Bottom Right
    }
  },
  {
    id: 'whey-isolate',
    name: 'Whey Protein Isolate',
    type: 'Anabolic Repair Block',
    instructions: [
      'Reach high to grab clean whey jars from the top shelves.',
      'Extend your arm fully, stretching your shoulders and traps.',
      'Keep your opposite guard up to maintain balance.',
      'Snap your hand back to your center line immediately.'
    ],
    tips: [
      'Form Check: Extend your arm straight along the line of sight.',
      'Common Mistake: Dropping your guard when reaching.'
    ],
    repCues: [
      'One. Reach for the top shelf.',
      'Two. Grab the protein jar.',
      'Three. Bring it back to center.',
      'Four. Keep your chin tucked.',
      'Five! Perfect protein reach.'
    ],
    zones: {
      orthodox: 2, // Top Right
      southpaw: 0  // Top Left
    }
  },
  {
    id: 'blueberries',
    name: 'Wild Blueberries',
    type: 'Antioxidant Gathering',
    instructions: [
      'Gather fresh wild blueberries from the middle branch zones.',
      'Use horizontal sweeping hand motions to collect the berries.',
      'Keep your elbow bent at 90 degrees as you sweep.',
      'Maintain your posture and turn your hips with the motion.'
    ],
    tips: [
      'Form Check: Align your elbow and hand vertically during the sweep.',
      'Common Mistake: Swinging too wide and losing balance.'
    ],
    repCues: [
      'One. Sweep your arm horizontally.',
      'Two. Keep the elbow bent at ninety degrees.',
      'Three. Ground your feet.',
      'Four. Gather the berries.',
      'Five! Successful blueberry harvest.'
    ],
    zones: {
      orthodox: 2, // Top/Middle Right
      southpaw: 0  // Top/Middle Left
    }
  },
  {
    id: 'ginger',
    name: 'Fresh Ginger Root',
    type: 'Digestive Inflammation Control',
    instructions: [
      'Uproot fresh ginger from the bottom soil zones.',
      'Squat slightly to load power in your legs.',
      'Drive upward and lift the ginger roots cleanly.',
      'Keep your opposite hand guarding your center.'
    ],
    tips: [
      'Form Check: Use leg extension and hip rotation for power, not just arm swing.',
      'Common Mistake: Dropping your head below your waist.'
    ],
    repCues: [
      'One. Squat down slightly.',
      'Two. Reach for the ginger.',
      'Three. Lift upward with your legs.',
      'Four. Rotate your hips.',
      'Five! Solid ginger harvest.'
    ],
    zones: {
      orthodox: 0, // Top Left (Right hand rear)
      southpaw: 2  // Top Right (Left hand rear)
    }
  }
];\n\n`;

  content = content.substring(0, practiceStartIdx) + replacement + content.substring(practiceEndIdx);
  console.log('Successfully replaced PRACTICE_TECHNIQUES');
} else {
  console.error('Failed to locate indices for PRACTICE_TECHNIQUES');
}

// 2. Perform general text substitutions to strip boxing jargon
const substitutions = [
  // Titles & Headings
  ['SHADOWBOX TRACKER', 'EARTHY HARVEST TRACKER'],
  ['Shadowbox Tracker', 'Earthy Harvest Tracker'],
  ['Shadowbox Round Tracker', 'Earthy Harvest Tracker'],
  ['webcam shadowboxer', 'webcam harvester'],
  ['webcam shadowboxing', 'webcam ingredient harvesting'],
  ['Shadowbox Trainer', 'Earthy Harvest Coach'],
  ['Select Combo', 'Select Recipe'],
  ['Select your focus technique', 'Select your target food'],
  ['Practice individual punches', 'Practice harvesting foods'],
  ['Fight Coins', 'Seed Coins'],
  ['fight coins', 'seed coins'],
  ['Gym Shop', 'Kitchen Shop'],
  ['GYM SHOP', 'KITCHEN SHOP'],
  ['customize your fighter', 'customize your avatar'],
  ['Customize Fighter', 'Customize Avatar'],
  ['Fighter Customizer', 'Avatar Customizer'],
  ['Fighter Customization', 'Avatar Customization'],
  ['Create Custom Combo', 'Create Custom Recipe'],
  ['Combo Builder', 'Recipe Builder'],
  ['custom combo', 'custom recipe'],
  ['Custom Combo', 'Custom Recipe'],
  ['Combo Sequence', 'Recipe Sequence'],
  ['Combo progress', 'Recipe progress'],
  ['combos completed', 'recipes completed'],
  ['Combos Completed', 'Recipes Completed'],
  ['Combo limit', 'Recipe limit'],
  ['Save & Train', 'Save & Harvest'],
  ['Practice Mode', 'Harvest Practice'],
  ['Blitz Mode', 'Garden Blitz'],
  ['Total Punches', 'Total Harvests'],
  ['PUNCH SPEED', 'HARVEST SPEED'],
  ['Punches / Min', 'Harvests / Min'],
  ['blitz punch speed', 'blitz harvest speed'],
  ['Punches Hit', 'Foods Harvested'],
  ['Avg Reaction', 'Avg Reaction'],
  ['TSS Score', 'NCS Score'],
  ['TSS generated', 'Nutritional Consistency Score generated'],
  ['PUNCHES LOGGED', 'FOODS HARVESTED'],
  ['orthodox', 'right-handed style'],
  ['southpaw', 'left-handed style'],
  ['ORTHODOX', 'RIGHT-HANDED'],
  ['SOUTHPAW', 'LEFT-HANDED'],
  ['Shadowboxing', 'Gathering'],
  ['shadowboxing', 'gathering'],
  ['punching', 'harvesting'],
  ['boxing stance', 'balanced harvesting stance'],
  ['boxing rounds', 'harvesting blocks'],
  ['Round Timer', 'Fasting/Harvest Timer'],
  ['Listen to Coach Guide', 'Listen to Chef Guide'],
  ['Listen to Coach', 'Listen to Chef'],
  ['Watch Coach', 'Watch Chef'],
  ['coaching guide', 'nutrition guide'],
  ['Coaching Tip', 'Chef Tip'],
  ['BoxingWiki', 'FoodWiki'],
  ['boxingwiki', 'foodwiki'],
  ['Boxing Wiki', 'Food Wiki'],
  ['boxing wiki', 'food wiki'],
  ['boxing-theme', 'earth-crunch-theme'],
  ['Round ', 'Block '],
  ['ROUND ', 'BLOCK '],
  ['round ', 'block '],
  ['Rounds', 'Blocks'],
  ['ROUNDS', 'BLOCKS'],
  ['rounds', 'blocks'],
  ['REST TIME', 'DIGESTION TIME'],
  ['REST_DURATION = 8', 'REST_DURATION = 15'],
  ['Resting...', 'Digesting...'],
  ['Get ready for Round', 'Get ready for Block'],
  ['Get ready to throw', 'Get ready to harvest'],
  ['Throw combinations', 'Harvest ingredients'],
  ['blitz target speed', 'blitz harvest speed'],
  ['combo tracker', 'recipe tracker'],
  ['combo builder', 'recipe builder'],
  ['combo step', 'recipe step'],
  ['combo name', 'recipe name'],
  ['Create a sequence of punches', 'Create a sequence of ingredients'],
  ['Tap moves below', 'Tap ingredients below'],
  ['My Money Combo', 'My Morning Shake'],
  ['Combo Sequence', 'Recipe Sequence']
];

for (const [target, replacement] of substitutions) {
  content = content.split(target).join(replacement);
}

// 3. Fix initialTech mapping in state hook
content = content.replace(
  "const mappedTech = initialTech === 'lead-hook' ? 'hook' : initialTech === 'rear-uppercut' ? 'uppercut' : initialTech;",
  "const mappedTech = initialTech === 'lead-hook' || initialTech === 'blueberries' ? 'blueberries' : initialTech === 'rear-uppercut' || initialTech === 'ginger' ? 'ginger' : initialTech === 'sweet-potato' ? 'sweet-potato' : initialTech === 'whey-isolate' ? 'whey-isolate' : initialTech;"
);

// 4. Update default activePracticeIdx search
content = content.replace(
  "const idx = PRACTICE_TECHNIQUES.findIndex(t => t.id === mappedTech);",
  "const idx = PRACTICE_TECHNIQUES.findIndex(t => t.id === mappedTech || t.id === initialTech);"
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Completed ShadowboxTracker retheming.');
