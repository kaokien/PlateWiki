const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/utils/fighterProfile.test.ts');
if (fs.existsSync(filePath)) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace rank names to match fighterProfile.ts
  content = content.replace(/['"]Gardener['"]/g, "'Harvest Master'");
  content = content.replace(/['"]Earthy Alchemist['"]/g, "'Earthy Sage'");

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully aligned fighterProfile.test.ts expectations');
}
