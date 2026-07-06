/**
 * Sitemap Generator for BoxingWiki
 * 
 * Automatically generates sitemap.xml from the techniques and bodyParts data.
 * Run with: node scripts/generate-sitemap.mjs
 * 
 * This ensures every new technique/anatomy page is automatically included
 * without manual sitemap maintenance.
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// We can't import the data modules directly since they use React imports,
// so we parse the source files to extract the keys.

const SITE_URL = 'https://boxingwiki.org';

function extractExportKeys(filePath) {
  const content = readFileSync(filePath, 'utf-8');
  // Match keys like 'jab': {, 'cross': {, etc.
  const keys = [];
  const regex = /['"]?([\w-]+)['"]?\s*:\s*\{/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    // Skip common JS keywords and structural keys
    if (!['name', 'description', 'category', 'muscles', 'steps', 'mistakes', 'combinations', 'difficulty', 'proTips', 'conditioning', 'shortDesc', 'link', 'exercises', 'frequency'].includes(match[1])) {
      keys.push(match[1]);
    }
  }
  return keys;
}

function extractBodyPartKeys(filePath) {
  const content = readFileSync(filePath, 'utf-8');
  // Match the bodyParts export keys
  const bodyPartsSection = content.match(/export const bodyParts\s*=\s*\{([\s\S]*?)^\};/m);
  if (!bodyPartsSection) return [];
  
  const keys = [];
  const regex = /['"]?([\w-]+)['"]?\s*:\s*\{/g;
  let match;
  while ((match = regex.exec(bodyPartsSection[1])) !== null) {
    keys.push(match[1]);
  }
  return keys;
}

// Extract data
const dataDir = resolve(__dirname, '../src/data');
const techniquesFile = resolve(dataDir, 'techniques.js');

// Get body part keys from techniques.js
const bodyPartKeys = extractBodyPartKeys(techniquesFile);

// Get technique keys from all data files
const techniqueFiles = ['punches.js', 'defense.js', 'footwork-combos.js', 'advanced-combos.js', 'ring-strategy.js', 'advanced-conditioning.js'];
const techniqueKeys = [];
for (const file of techniqueFiles) {
  const filePath = resolve(dataDir, file);
  try {
    techniqueKeys.push(...extractExportKeys(filePath));
  } catch (e) {
    console.warn(`Warning: Could not read ${file}: ${e.message}`);
  }
}

// Extract article IDs from article data files
function extractArticleIds(filePath) {
  const content = readFileSync(filePath, 'utf-8');
  const ids = [];
  const regex = /id:\s*['"]([^'"]+)['"]/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    ids.push(match[1]);
  }
  return ids;
}

const articlesDir = resolve(dataDir, 'articles');
const articleFiles = [
  'boxing-fundamentals.js',
  'defense-countering.js',
  'footwork-movement.js',
  'conditioning-fitness.js',
  'nutrition-weight.js',
  'equipment-gear.js',
  'sparring-competition.js',
  'mindset-strategy.js',
];
const articleIds = [];
for (const file of articleFiles) {
  const filePath = resolve(articlesDir, file);
  try {
    articleIds.push(...extractArticleIds(filePath));
  } catch (e) {
    console.warn(`Warning: Could not read articles/${file}: ${e.message}`);
  }
}

// Build sitemap
const today = new Date().toISOString().split('T')[0];

let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Static Pages -->
  <url><loc>${SITE_URL}/</loc><lastmod>${today}</lastmod><priority>1.0</priority><changefreq>weekly</changefreq></url>
  <url><loc>${SITE_URL}/techniques</loc><lastmod>${today}</lastmod><priority>0.9</priority><changefreq>weekly</changefreq></url>
  <url><loc>${SITE_URL}/articles</loc><lastmod>${today}</lastmod><priority>0.9</priority><changefreq>weekly</changefreq></url>
  <url><loc>${SITE_URL}/course</loc><lastmod>${today}</lastmod><priority>0.8</priority><changefreq>monthly</changefreq></url>
  <url><loc>${SITE_URL}/partner</loc><lastmod>${today}</lastmod><priority>0.6</priority><changefreq>monthly</changefreq></url>
  <url><loc>${SITE_URL}/about</loc><lastmod>${today}</lastmod><priority>0.5</priority><changefreq>monthly</changefreq></url>
  <url><loc>${SITE_URL}/privacy</loc><lastmod>${today}</lastmod><priority>0.3</priority><changefreq>monthly</changefreq></url>
  <url><loc>${SITE_URL}/contact</loc><lastmod>${today}</lastmod><priority>0.3</priority><changefreq>monthly</changefreq></url>

  <!-- Anatomy Pages (${bodyPartKeys.length} total) -->
${bodyPartKeys.map(k => `  <url><loc>${SITE_URL}/anatomy/${k}</loc><lastmod>${today}</lastmod><priority>0.8</priority><changefreq>weekly</changefreq></url>`).join('\n')}

  <!-- Technique Pages (${techniqueKeys.length} total) -->
${techniqueKeys.map(k => `  <url><loc>${SITE_URL}/technique/${k}</loc><lastmod>${today}</lastmod><priority>0.9</priority><changefreq>weekly</changefreq></url>`).join('\n')}

  <!-- Article Pages (${articleIds.length} total) -->
${articleIds.map(id => `  <url><loc>${SITE_URL}/articles/${id}</loc><lastmod>${today}</lastmod><priority>0.85</priority><changefreq>weekly</changefreq></url>`).join('\n')}
</urlset>
`;

const outputPath = resolve(__dirname, '../public/sitemap.xml');
writeFileSync(outputPath, xml, 'utf-8');

const staticCount = 8;
console.log(`✅ Sitemap generated: ${outputPath}`);
console.log(`   📄 Static pages: ${staticCount}`);
console.log(`   🏋️ Anatomy pages: ${bodyPartKeys.length}`);
console.log(`   🥊 Technique pages: ${techniqueKeys.length}`);
console.log(`   📰 Article pages: ${articleIds.length}`);
console.log(`   📊 Total URLs: ${staticCount + bodyPartKeys.length + techniqueKeys.length + articleIds.length}`);
