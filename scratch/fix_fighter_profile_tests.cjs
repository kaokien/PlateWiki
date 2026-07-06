const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/utils/fighterProfile.test.ts');
if (fs.existsSync(filePath)) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace rank names
  content = content.replace(/['"]Prospect['"]/g, "'Sprout'");
  content = content.replace(/['"]Contender['"]/g, "'Forager'");
  content = content.replace(/['"]Champion['"]/g, "'Gardener'");
  content = content.replace(/['"]Hall of Famer['"]/g, "'Earthy Alchemist'");

  // Replace default name 'Fighter'
  content = content.replace(/['"]Fighter['"]/g, "'Harvest Sprout'");

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully fixed fighterProfile.test.ts');
}
