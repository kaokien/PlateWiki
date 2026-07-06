const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/components/ShadowboxTracker.tsx');
if (fs.existsSync(filePath)) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Fix beginRound and endRound calls
  content = content.replace('beginRound(1);', 'beginBlock(1);');
  content = content.replace('endRound(roundNum);', 'endBlock(roundNum);');
  content = content.replace('beginRound(roundNum + 1);', 'beginBlock(roundNum + 1);');

  // Fix block + 1 variables
  content = content.replace('Block {block + 1} starting...', 'Block {round + 1} starting...');
  content = content.replace('Block {block + 1} starting...', 'Block {round + 1} starting...'); // replace both

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully fixed ShadowboxTracker.tsx syntax errors');
}
