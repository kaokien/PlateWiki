import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Import content databases using dynamic imports or node style resolution
import { techniques, bodyParts } from '../src/data/techniques.js';
import { fighters } from '../src/data/fighters.js';
import { glossary, toSlug } from '../src/data/glossary.js';
import { programs } from '../src/data/programs.js';
import { articles as localArticles } from '../src/data/articles/index.js';

// Load remote articles manifest
const manifestPath = path.join(rootDir, 'content/articles/manifest.json');
let remoteArticles = [];
if (fs.existsSync(manifestPath)) {
  remoteArticles = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
}

const allArticles = [...localArticles, ...remoteArticles];
const articleIds = new Set(allArticles.map(a => a.id));
const techniqueIds = new Set(Object.keys(techniques));
const bodyPartIds = new Set(Object.keys(bodyParts));

console.log(`Loaded:
- ${techniqueIds.size} Techniques
- ${bodyPartIds.size} Body Parts
- ${fighters.length} Fighters
- ${glossary.length} Glossary Terms
- ${Object.keys(programs).length} Programs
- ${allArticles.length} Articles (${localArticles.length} local, ${remoteArticles.length} remote)
`);

let errors = [];
let warnings = [];

// 1. Audit Techniques
console.log('Auditing Techniques...');
for (const [id, tech] of Object.entries(techniques)) {
  // Check relatedTechniques
  if (tech.relatedTechniques) {
    for (const relId of tech.relatedTechniques) {
      if (!techniqueIds.has(relId)) {
        errors.push(`[Technique: ${id}] Broken relatedTechnique link: '${relId}'`);
      }
    }
  }

  // Check combinations
  if (tech.combinations) {
    for (const combo of tech.combinations) {
      if (!combo.link) {
        errors.push(`[Technique: ${id}] Combination '${combo.name}' is missing 'link' attribute`);
      } else if (!techniqueIds.has(combo.link)) {
        errors.push(`[Technique: ${id}] Broken combination link for '${combo.name}': '${combo.link}'`);
      }
    }
  }

  // Check muscles
  if (tech.muscles) {
    for (const muscleId of tech.muscles) {
      if (!bodyPartIds.has(muscleId)) {
        errors.push(`[Technique: ${id}] References unknown muscle ID: '${muscleId}'`);
      }
    }
  }
}

// 2. Audit Fighters
console.log('Auditing Fighters...');
for (const fighter of fighters) {
  if (fighter.signatureTechniques) {
    for (const techId of fighter.signatureTechniques) {
      if (!techniqueIds.has(techId)) {
        errors.push(`[Fighter: ${fighter.id}] Broken signatureTechnique link: '${techId}'`);
      }
    }
  }
}

// 3. Audit Glossary Terms
console.log('Auditing Glossary...');
for (const entry of glossary) {
  if (entry.relatedTechnique) {
    if (!techniqueIds.has(entry.relatedTechnique)) {
      errors.push(`[Glossary: ${entry.term}] Broken relatedTechnique link: '${entry.relatedTechnique}'`);
    }
  }
}

// 4. Audit Programs
console.log('Auditing Programs...');
for (const [pId, program] of Object.entries(programs)) {
  if (program.days) {
    for (const day of program.days) {
      if (day.tasks) {
        for (const task of day.tasks) {
          if (task.type === 'learn' && task.techniqueId) {
            if (!techniqueIds.has(task.techniqueId)) {
              errors.push(`[Program: ${pId}, Day ${day.day}] Broken learn task techniqueId link: '${task.techniqueId}'`);
            }
          }
        }
      }
    }
  }
}

// 5. Audit Articles
console.log('Auditing Articles...');
for (const article of allArticles) {
  if (article.relatedTechniques) {
    for (const techId of article.relatedTechniques) {
      if (!techniqueIds.has(techId)) {
        errors.push(`[Article: ${article.id}] Broken relatedTechnique link: '${techId}'`);
      }
    }
  }

  if (article.relatedArticles) {
    for (const relArtId of article.relatedArticles) {
      if (!articleIds.has(relArtId)) {
        errors.push(`[Article: ${article.id}] Broken relatedArticle link: '${relArtId}'`);
      }
    }
  }

  // Check call to action links if present
  if (article.callToAction && article.callToAction.link) {
    const link = article.callToAction.link;
    if (link.startsWith('/') && !link.startsWith('/course') && !link.startsWith('/pricing')) {
      // Validate local route if it's dynamic
      if (link.startsWith('/technique/')) {
        const tId = link.replace('/technique/', '');
        if (!techniqueIds.has(tId)) {
          errors.push(`[Article: ${article.id}] CTA points to broken technique link: '${link}'`);
        }
      } else if (link.startsWith('/fighters/')) {
        const fId = link.replace('/fighters/', '');
        const fighterIds = new Set(fighters.map(f => f.id));
        if (!fighterIds.has(fId)) {
          errors.push(`[Article: ${article.id}] CTA points to broken fighter link: '${link}'`);
        }
      }
    }
  }
}

// 6. Check Sitemap coverage
console.log('Checking Sitemap Coverage...');
// Parse sitemap file to see what it handles
const sitemapPath = path.join(rootDir, 'src/app/sitemap.ts');
let sitemapContent = '';
if (fs.existsSync(sitemapPath)) {
  sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
}

// Check which route groups are covered in sitemap
const hasTechniqueSitemap = sitemapContent.includes('techniquePages');
const hasFighterSitemap = sitemapContent.includes('fighterPages');
const hasGlossarySitemap = sitemapContent.includes('glossaryPages');
const hasArticleSitemap = sitemapContent.includes('articlePages');
const hasProgramSitemap = sitemapContent.includes('programPages') || sitemapContent.includes('/program/');
const hasAnatomySitemap = sitemapContent.includes('anatomyPages') || sitemapContent.includes('/anatomy/');
const hasTermsSitemap = sitemapContent.includes('/terms');

if (!hasTechniqueSitemap) errors.push('Sitemap is missing dynamic Technique pages!');
if (!hasFighterSitemap) errors.push('Sitemap is missing dynamic Fighter pages!');
if (!hasGlossarySitemap) errors.push('Sitemap is missing dynamic Glossary pages!');
if (!hasArticleSitemap) errors.push('Sitemap is missing dynamic Article pages!');

if (!hasProgramSitemap) {
  warnings.push('Sitemap is missing dynamic Program pages (/program/[id])!');
}
if (!hasAnatomySitemap) {
  warnings.push('Sitemap is missing dynamic Anatomy pages (/anatomy/[id])!');
}
if (!hasTermsSitemap) {
  warnings.push('Sitemap is missing static Terms of Use page (/terms)!');
}

// Summary
console.log('\n--- AUDIT SUMMARY ---');
console.log(`Errors found: ${errors.length}`);
for (const err of errors) {
  console.log(`\x1b[31m[FAIL]\x1b[0m ${err}`);
}

console.log(`\nWarnings found: ${warnings.length}`);
for (const warn of warnings) {
  console.log(`\x1b[33m[WARN]\x1b[0m ${warn}`);
}

if (errors.length > 0) {
  process.exit(1);
} else {
  console.log('\x1b[32m[PASS]\x1b[0m Link integrity checks completed successfully.');
  process.exit(0);
}
