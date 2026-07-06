import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const rootDir = process.cwd();
const manifestPath = path.join(rootDir, 'content/articles/manifest.json');
const articlesDir = path.join(rootDir, 'content/articles');

if (!fs.existsSync(manifestPath)) {
  console.error('manifest.json not found');
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

for (const entry of manifest) {
  const articlePath = path.join(articlesDir, `${entry.id}.md`);
  if (fs.existsSync(articlePath)) {
    const fileContent = fs.readFileSync(articlePath, 'utf8');
    const { data } = matter(fileContent);
    if (data.date) {
      entry.date = data.date;
    } else {
      console.warn(`No date found in frontmatter for ${entry.id}.md`);
    }
  } else {
    console.error(`Article file ${entry.id}.md not found`);
  }
}

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
console.log('Successfully updated manifest.json with date fields!');
