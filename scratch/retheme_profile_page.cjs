const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/views/FighterProfilePage.tsx');
if (fs.existsSync(filePath)) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace text
  content = content.replace('feature="Fighter Profile"', 'feature="Athlete Profile"');
  content = content.replace('Fighter Profile', 'Athlete Profile');
  content = content.replace('FIGHTER PROFILE', 'ATHLETE PROFILE');
  content = content.replace('Fighter Customizer', 'Avatar Customizer');
  content = content.replace('Fighter Customization', 'Avatar Customization');
  content = content.replace('DisplayName', 'displayName');
  content = content.replace('Workouts Completed', 'Recipes Completed');
  content = content.replace('Techniques Studied', 'Foods Studied');
  content = content.replace('Timer Sessions', 'Fasting/Harvest Sessions');
  content = content.replace('boxing', 'nutrition');
  content = content.replace('gym', 'kitchen');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully rethemed FighterProfilePage.tsx');
}
