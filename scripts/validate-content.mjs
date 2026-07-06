import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';
import { techniques } from '../src/data/techniques.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const manifestPath = path.join(rootDir, 'content/articles/manifest.json');
const articlesDir = path.join(rootDir, 'content/articles');

const VALID_CATEGORIES = new Set([
  'Boxing Fundamentals',
  'Defense & Countering',
  'Footwork & Movement',
  'Conditioning & Fitness',
  'Nutrition & Weight',
  'Equipment & Gear',
  'Sparring & Competition',
  'Mindset & Strategy'
]);

function logError(msg) {
  console.error(`\x1b[31m[ERROR]\x1b[0m ${msg}`);
}

function logSuccess(msg) {
  console.log(`\x1b[32m[SUCCESS]\x1b[0m ${msg}`);
}

function validate() {
  let hasErrors = false;

  if (!fs.existsSync(manifestPath)) {
    logError(`manifest.json not found at ${manifestPath}`);
    process.exit(1);
  }

  let manifest;
  try {
    manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  } catch (err) {
    logError(`Failed to parse manifest.json: ${err.message}`);
    process.exit(1);
  }

  if (!Array.isArray(manifest)) {
    logError(`manifest.json must be a JSON array`);
    process.exit(1);
  }

  const manifestIds = new Set();

  for (const entry of manifest) {
    const { id } = entry;
    if (!id) {
      logError(`Manifest entry is missing 'id'`);
      hasErrors = true;
      continue;
    }
    manifestIds.add(id);

    const articlePath = path.join(articlesDir, `${id}.md`);
    if (!fs.existsSync(articlePath)) {
      logError(`Article file ${id}.md not found in content/articles/`);
      hasErrors = true;
      continue;
    }

    let fileContent;
    try {
      fileContent = fs.readFileSync(articlePath, 'utf8');
    } catch (err) {
      logError(`Failed to read ${id}.md: ${err.message}`);
      hasErrors = true;
      continue;
    }

    let parsed;
    try {
      parsed = matter(fileContent);
    } catch (err) {
      logError(`Failed to parse frontmatter for ${id}.md: ${err.message}`);
      hasErrors = true;
      continue;
    }

    const { data } = parsed;

    // Validate required frontmatter fields
    const requiredFields = ['title', 'subtitle', 'category', 'tags', 'date', 'author', 'readTime'];
    for (const field of requiredFields) {
      if (data[field] === undefined || data[field] === null || data[field] === '') {
        logError(`Article ${id}.md is missing frontmatter field: '${field}'`);
        hasErrors = true;
      }
    }

    // Validate category
    if (data.category && !VALID_CATEGORIES.has(data.category)) {
      logError(`Article ${id}.md has invalid category: '${data.category}'. Allowed categories: ${[...VALID_CATEGORIES].join(', ')}`);
      hasErrors = true;
    }

    // Validate date format YYYY-MM-DD
    if (data.date && !/^\d{4}-\d{2}-\d{2}$/.test(data.date)) {
      logError(`Article ${id}.md has invalid date format: '${data.date}'. Expected YYYY-MM-DD`);
      hasErrors = true;
    }

    // Validate tags
    if (data.tags && !Array.isArray(data.tags)) {
      logError(`Article ${id}.md frontmatter 'tags' must be an array`);
      hasErrors = true;
    }

    // Validate relatedTechniques
    if (data.relatedTechniques) {
      if (!Array.isArray(data.relatedTechniques)) {
        logError(`Article ${id}.md frontmatter 'relatedTechniques' must be an array`);
        hasErrors = true;
      } else {
        for (const techId of data.relatedTechniques) {
          if (!techniques[techId]) {
            logError(`Article ${id}.md references unknown technique ID: '${techId}'`);
            hasErrors = true;
          }
        }
      }
    }

    // Validate alignment between manifest and frontmatter
    const checkFields = ['title', 'subtitle', 'category', 'author', 'readTime', 'date'];
    for (const field of checkFields) {
      if (entry[field] !== undefined && entry[field] !== data[field]) {
        logError(`Mismatched field '${field}' for article '${id}': manifest has '${entry[field]}', markdown frontmatter has '${data[field]}'`);
        hasErrors = true;
      }
    }
  }

  // Check for orphaned markdown files that are not in the manifest
  try {
    const files = fs.readdirSync(articlesDir);
    for (const file of files) {
      if (file.endsWith('.md')) {
        const id = path.basename(file, '.md');
        if (!manifestIds.has(id)) {
          logError(`Orphaned article file '${file}' is not declared in manifest.json`);
          hasErrors = true;
        }
      }
    }
  } catch (err) {
    logError(`Failed to read articles directory: ${err.message}`);
    hasErrors = true;
  }

  if (hasErrors) {
    logError('Validation failed with errors.');
    process.exit(1);
  } else {
    logSuccess('All articles and manifest are valid!');
    process.exit(0);
  }
}

validate();
