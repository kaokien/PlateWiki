const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/views/GymShopPage.tsx');
if (fs.existsSync(filePath)) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace text
  content = content.split('🥊').join('🌱');
  content = content.split('Fight Coins').join('Seed Coins');
  content = content.split('FIGHT COINS').join('SEED COINS');
  content = content.split('GYM SHOP').join('KITCHEN SHOP');
  content = content.split('THE GYM SHOP').join('THE KITCHEN SHOP');
  content = content.split('SPEND EARNED FIGHT COINS TO UNLOCK COSMETIC GEAR AND BOOSTS').join('SPEND EARNED SEED COINS TO UNLOCK COSMETIC APPAREL AND BOOSTS');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully rethemed GymShopPage.tsx');
}
