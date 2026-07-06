const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/views/TechniquePage.tsx');
if (fs.existsSync(filePath)) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace breadcrumbs & title area
  content = content.replace("Reviewed by <strong>Coach Josh</strong>", "Reviewed by <strong>Nutrition Advisory Board</strong>");
  content = content.replace("Technique not found", "Food profile not found");
  content = content.replace("Return to Map", "Return to Anatomy Map");
  content = content.replace("Learn Technique", "Learn Food Profile");
  content = content.replace("Anatomy Map", "Anatomy Map");
  
  // Stance label mapping
  content = content.replace(
    "const stanceLabel = technique.stance === 'both' ? 'Orthodox & Southpaw' : technique.stance === 'orthodox' ? 'Orthodox' : 'Southpaw';",
    "const stanceLabel = technique.stance === 'both' ? 'All Athletes' : technique.stance === 'orthodox' ? 'Runners / Endurance' : 'Lifters / Strength';"
  );

  // Section Headers
  content = content.replace("<h2>When to Use</h2>", "<h2>Recommended Intake & Goals</h2>");
  content = content.replace("<h2>Execution Steps</h2>", "<h2>Intake & Serving Steps</h2>");
  content = content.replace("<h2>Coaching Cues</h2>", "<h2>Nutrition Cues</h2>");
  content = content.replace("<h2>Pro Tips</h2>", "<h2>Preparation Tips</h2>");
  content = content.replace("<h2>Conditioning Drills</h2>", "<h2>Synergistic Foods & Bio-boosts</h2>");
  content = content.replace("Common Mistakes", "Common Pitfalls & Warnings");

  // CTAs
  content = content.replace("Gym Workout:", "Fueling Guide:");
  content = content.replace("Hit the gym and sharpen this technique", "Prepare this food to optimize your fuel intake");
  content = content.replace("Practice on Camera", "Track Harvest on Camera");
  content = content.replace("Use your device camera and real-time motion detection to practice your {technique.name} reps.", "Use your device camera and real-time movement detection to harvest virtual ingredients.");
  content = content.replace("🥊 PRACTICE MODE", "🌱 HARVEST ENGINE");
  content = content.replace("Ready to drill the {technique.name}?", "Ready to harvest {technique.name}?");
  content = content.replace("Jump into a focused workout session built around this technique.", "Start the webcam interactive harvest coach to gather this ingredient.");
  content = content.replace("Start Heavy Bag Workout →", "Launch Harvest Coach →");

  // Sidebar Discord
  content = content.replace("COMMUNITY FEEDBACK", "COMMUNITY KITCHEN");
  content = content.replace("Get Your Form Checked", "Share Your Meal Prep");
  content = content.replace("Unsure if your {parseStanceText(technique.name, isSouthpaw)} technique is correct? Upload a video to get direct feedback from our coaching staff and 400+ fighters.", "Unsure if your macro balance is correct? Upload a photo of your plate to get direct feedback from other bio-athletes.");
  content = content.replace("#corner-work", "#recipe-swap");
  content = content.replace("#ask-the-coach", "#ask-the-nutritionist");
  content = content.replace("Get Form Feedback", "Share Meal Photo");

  // Related lists
  content = content.replace("<h2>Follow-up Techniques</h2>", "<h2>Recipe Combinations</h2>");
  content = content.replace("<h2>Related Techniques</h2>", "<h2>Related Foods</h2>");

  // Gear Sidebar
  content = content.replace("Recommended Gear", "Recommended Kitchen Tools");
  content = content.replace("The equipment every boxer needs. Use code <strong>COACHJOSH</strong> for 15% off at Lead Boxing.", "High-quality kitchen items and organic harvesting tools.");
  content = content.replace("Affiliate partnership with <a href=\"https://leadboxing.com\" target=\"_blank\" rel=\"noopener noreferrer\">Lead Boxing</a>. Use code <strong>COACHJOSH</strong> for 15% off.", "FoodWiki features curated resources to support organic culinary preparation.");

  // General text
  content = content.replace('boxingwiki', 'foodwiki');
  content = content.replace('BoxingWiki', 'FoodWiki');
  content = content.replace('Boxing Wiki', 'Food Wiki');
  content = content.replace('boxing wiki', 'food wiki');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully rethemed TechniquePage.tsx');
}
