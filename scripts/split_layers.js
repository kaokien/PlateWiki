import { Jimp } from 'jimp';
import fs from 'fs';
import path from 'path';

const STAGES = ['prospect', 'contender', 'gatekeeper', 'rising-star', 'champion', 'hall-of-famer'];
const GENDERS = ['', 'female-'];
const ZONES = ['skin', 'hair', 'gloves', 'shoes', 'top'];

const srcDir = path.resolve('public/fighters');
const destDir = path.resolve('public/fighters/layers');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Function to convert RGB to grayscale luminance
function getLuminance(r, g, b) {
  return Math.round(0.2126 * r + 0.7152 * g + 0.0722 * b);
}

// Helper to decode RGBA from 32-bit int
function intToRGBA(color) {
  return {
    r: (color >>> 24) & 0xFF,
    g: (color >>> 16) & 0xFF,
    b: (color >>> 8) & 0xFF,
    a: color & 0xFF
  };
}

// Helper to encode RGBA to 32-bit int
function rgbaToInt(r, g, b, a) {
  return ((r << 24) | (g << 16) | (b << 8) | a) >>> 0;
}

async function processSprite(gender, stage) {
  const key = `${gender}${stage}`;
  const baseImgPath = path.join(srcDir, `${key}.png`);
  if (!fs.existsSync(baseImgPath)) {
    console.log(`Base image not found: ${baseImgPath}`);
    return;
  }

  console.log(`Processing: ${key}`);
  const baseImg = await Jimp.read(baseImgPath);
  const width = baseImg.bitmap.width;
  const height = baseImg.bitmap.height;

  // Create clean blank images for each zone
  const zoneImages = {};
  for (const zone of ZONES) {
    const maskPath = path.join(srcDir, 'masks', `${key}-${zone}.png`);
    if (fs.existsSync(maskPath)) {
      zoneImages[zone] = {
        mask: await Jimp.read(maskPath),
        output: new Jimp({ width, height })
      };
    }
  }

  // Create a base output image (copy of baseImg)
  const baseOutput = baseImg.clone();

  // Loop through pixels
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const baseColor = baseOutput.getPixelColor(x, y);
      const { r, g, b, a } = intToRGBA(baseColor);

      if (a < 8) continue; // Skip transparent

      // Check if this pixel matches any zone mask
      let matchedZone = null;
      for (const zone of Object.keys(zoneImages)) {
        const maskColor = zoneImages[zone].mask.getPixelColor(x, y);
        const maskR = (maskColor >>> 24) & 0xFF;
        const maskG = (maskColor >>> 16) & 0xFF;
        const maskB = (maskColor >>> 8) & 0xFF;
        // Masks use white=zone, black=not-zone (fully opaque)
        const brightness = (maskR + maskG + maskB) / 3;
        if (brightness >= 128) {
          matchedZone = zone;
          break;
        }
      }

      if (matchedZone) {
        // Write a white pixel with original alpha — PixiJS tint will
        // multiply white (0xFFFFFF) × tintColor = exact tintColor
        const newColor = rgbaToInt(255, 255, 255, a);
        
        // Write to zone image
        zoneImages[matchedZone].output.setPixelColor(newColor, x, y);
        // Erase from base output
        baseOutput.setPixelColor(rgbaToInt(0, 0, 0, 0), x, y);
      }
    }
  }

  // Save the modified base image
  await baseOutput.write(path.join(destDir, `${key}-base.png`));
  console.log(`  Saved base: ${key}-base.png`);

  // Save the zone images
  for (const zone of Object.keys(zoneImages)) {
    await zoneImages[zone].output.write(path.join(destDir, `${key}-${zone}.png`));
    console.log(`  Saved layer: ${key}-${zone}.png`);
  }
}

async function main() {
  for (const gender of GENDERS) {
    for (const stage of STAGES) {
      await processSprite(gender, stage);
    }
  }
  console.log('Done!');
}

main().catch(console.error);
