const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/views/FighterPage.tsx');
if (fs.existsSync(filePath)) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace text
  content = content.replace('feature="Your Fighter"', 'feature="Your Avatar"');
  content = content.replace('Every technique, workout, and article earns XP that transforms your fighter.', 'Every food profile, recipe, and article earns XP that transforms your avatar.');
  content = content.replace('🛍️ Visit Gym Shop', '🛍️ Visit Kitchen Shop');
  content = content.replace('technique_studied:   { label: \'Technique\',      icon: Swords },', 'technique_studied:   { label: \'Food Profile\',      icon: BookOpen },');
  content = content.replace('<div className="stat-card__label">Workouts</div>', '<div className="stat-card__label">Recipes</div>');
  content = content.replace('<div className="stat-card__label">Techniques</div>', '<div className="stat-card__label">Foods</div>');
  content = content.replace('<div className="stat-card__label">Timer Sessions</div>', '<div className="stat-card__label">Fasting/Harvest Sessions</div>');
  content = content.replace('Start Training', 'Start Harvesting');
  content = content.replace('FighterPage', 'AthletePage');
  content = content.replace('fighter-page', 'athlete-page');
  content = content.replace('fighter-hero', 'athlete-hero');
  content = content.replace('fighter-xp-bar', 'athlete-xp-bar');
  content = content.replace('fighter-customizer-section', 'athlete-customizer-section');
  content = content.replace('fighter-shop-cta', 'athlete-shop-cta');
  content = content.replace('fighter-evolution', 'athlete-evolution');
  content = content.replace('fighter-section-title', 'athlete-section-title');
  content = content.replace('fighter-earn', 'athlete-earn');
  content = content.replace('fighter-stats', 'athlete-stats');
  content = content.replace('fighter-cta-section', 'athlete-cta-section');
  content = content.replace('fighter-train-cta', 'athlete-train-cta');
  content = content.replace('fighterName:', 'fighterName:');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully rethemed FighterPage.tsx');
}
