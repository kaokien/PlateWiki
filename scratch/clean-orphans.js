import fs from 'fs';
import path from 'path';

const articlesDir = './content/articles';
const manifestPath = './content/articles/manifest.json';

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const manifestIds = new Set(manifest.map(e => e.id));

const files = fs.readdirSync(articlesDir);
for (const file of files) {
  if (file.endsWith('.md')) {
    const id = path.basename(file, '.md');
    if (!manifestIds.has(id)) {
      console.log(`Deleting orphan: ${file}`);
      fs.unlinkSync(path.join(articlesDir, file));
    }
  }
}
console.log('Cleanup complete.');
