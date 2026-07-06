import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { techniques } from '../src/data/techniques.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputFilePath = path.resolve(__dirname, '../all-technique-prompts.txt');

function buildPrompt(tech) {
  const stanceText = tech.stance === 'southpaw' ? 'Southpaw stance (right foot forward)' : 'Orthodox stance';
  const stepsDescription = tech.steps.map(step => step.toLowerCase().replace(/\.$/, '')).join(', then ');

  return `========================================
ID: ${tech.id}
NAME: ${tech.name}
CATEGORY: ${tech.category}
DIFFICULTY: ${tech.difficulty}
========================================
A static, tripod-mounted full-body shot of a lean, muscular Black male boxer with short buzzed black hair, perfectly centered against a solid, seamless white background. He is shirtless, wearing grey boxing shorts, black boxing boots, and dark red gloves. Clamshell studio lighting illuminates fine skin pores, muscle definitions, sweat, and micro-textures. Shot with a Hasselblad H6D-100c and a 50mm prime lens for biological realism. The boxer stands in ${stanceText} and executes a controlled ${tech.name.toLowerCase()}: he ${stepsDescription}. Static camera, no panning, no zooming. Seamless loop: the video starts and ends in the exact same ready stance.
\n\n`;
}

function main() {
  let fileContent = '';
  const sortedKeys = Object.keys(techniques).sort();

  for (const key of sortedKeys) {
    const tech = techniques[key];
    fileContent += buildPrompt(tech);
  }

  fs.writeFileSync(outputFilePath, fileContent, 'utf8');
  console.log(`Successfully generated prompts for all ${sortedKeys.length} techniques to all-technique-prompts.txt`);
}

main();
