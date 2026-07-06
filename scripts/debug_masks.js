import { Jimp } from 'jimp';

const masks = [
  'public/fighters/masks/prospect-gloves.png',
  'public/fighters/masks/prospect-skin.png', 
  'public/fighters/masks/prospect-hair.png',
  'public/fighters/masks/prospect-shoes.png',
];

for (const maskPath of masks) {
  const img = await Jimp.read(maskPath);
  const w = img.bitmap.width;
  const h = img.bitmap.height;
  let white = 0;
  let black = 0;
  let other = 0;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const c = img.getPixelColor(x, y);
      const r = (c >>> 24) & 0xFF;
      const g = (c >>> 16) & 0xFF;
      const b = (c >>> 8) & 0xFF;
      if (r > 200 && g > 200 && b > 200) white++;
      else if (r < 30 && g < 30 && b < 30) black++;
      else other++;
    }
  }
  console.log(maskPath + ': white=' + white + ' black=' + black + ' other=' + other);
}
