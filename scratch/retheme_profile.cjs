const fs = require('fs');
const path = require('path');

// Retheme src/utils/fighterProfile.ts
const profilePath = path.join(__dirname, '../src/utils/fighterProfile.ts');
if (fs.existsSync(profilePath)) {
  let content = fs.readFileSync(profilePath, 'utf8');

  // Replace RANK_TIERS names
  content = content.replace("name: 'Prospect'", "name: 'Sprout'");
  content = content.replace("name: 'Contender'", "name: 'Forager'");
  content = content.replace("name: 'Gatekeeper'", "name: 'Cultivator'");
  content = content.replace("name: 'Rising Star'", "name: 'Artisanal Chef'");
  content = content.replace("name: 'Champion'", "name: 'Harvest Master'");
  content = content.replace("name: 'Hall of Famer'", "name: 'Earthy Sage'");

  // Replace DISPLAY NAME default
  content = content.replace("displayName: 'Fighter'", "displayName: 'Harvest Sprout'");

  // Replace luckyPunch -> luckyHarvest
  content = content.split('luckyPunch').join('luckyHarvest');
  content = content.split('Lucky Punch').join('Lucky Harvest');

  fs.writeFileSync(profilePath, content, 'utf8');
  console.log('Successfully rethemed fighterProfile.ts');
}

// Retheme src/context/FighterProfileContext.tsx
const contextPath = path.join(__dirname, '../src/context/FighterProfileContext.tsx');
if (fs.existsSync(contextPath)) {
  let content = fs.readFileSync(contextPath, 'utf8');

  // Replace luckyPunch -> luckyHarvest
  content = content.split('luckyPunch').join('luckyHarvest');
  content = content.split('Lucky Punch').join('Lucky Harvest');

  fs.writeFileSync(contextPath, content, 'utf8');
  console.log('Successfully rethemed FighterProfileContext.tsx');
}
