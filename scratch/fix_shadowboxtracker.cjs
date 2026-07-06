const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/components/ShadowboxTracker.tsx');
if (fs.existsSync(filePath)) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace interface definition keys
  content = content.replace('right-handed style: number;', 'orthodox: number;');
  content = content.replace('left-handed style: number;', 'southpaw: number;');

  // Replace data keys
  content = content.replace('right-handed style: 3,', 'orthodox: 3,');
  content = content.replace('left-handed style: 5', 'southpaw: 5');
  content = content.replace('right-handed style: 2,', 'orthodox: 2,');
  content = content.replace('left-handed style: 0', 'southpaw: 0');
  content = content.replace('right-handed style: 0,', 'orthodox: 0,');
  content = content.replace('left-handed style: 2', 'southpaw: 2');

  // Replace state type definition and default value
  content = content.replace(
    "const [stance, setStance] = useState<'right-handed style' | 'left-handed style'>('right-handed style');",
    "const [stance, setStance] = useState<'orthodox' | 'southpaw'>('orthodox');"
  );

  // Replace HUD button toggles
  content = content.replace(/['"]right-handed style['"]/g, "'orthodox'");
  content = content.replace(/['"]left-handed style['"]/g, "'southpaw'");

  // Replace any remaining "right-handed style" or "left-handed style" references in the file to orthodox / southpaw
  content = content.split('right-handed style').join('orthodox');
  content = content.split('left-handed style').join('southpaw');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully fixed ShadowboxTracker.tsx');
}
