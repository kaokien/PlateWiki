const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/views/RulesPage.tsx');
if (fs.existsSync(filePath)) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace TABS
  content = content.replace(
    `const TABS = [
  { id: 'scoring', label: 'Scoring', Icon: Scale },
  { id: 'amateur', label: 'Amateur', Icon: Shield },
  { id: 'professional', label: 'Professional', Icon: Award },
  { id: 'weights', label: 'Weight Classes', Icon: Ruler },
  { id: 'fouls', label: 'Fouls', Icon: AlertTriangle },
];`,
    `const TABS = [
  { id: 'scoring', label: 'Macro Assessment', Icon: Scale },
  { id: 'amateur', label: 'Refeed Guide', Icon: Shield },
  { id: 'professional', label: 'Fasting Guide', Icon: Award },
  { id: 'weights', label: 'Macro Ratios', Icon: Ruler },
  { id: 'fouls', label: 'Dietary Fouls', Icon: AlertTriangle },
];`
  );

  // Replace labels inside RulesTab
  content = content.replace(
    `<span className="rules-detail__label">Governing Body</span>`,
    `<span className="rules-detail__label">Authority</span>`
  );
  content = content.replace(
    `<span className="rules-detail__label">Rounds</span>`,
    `<span className="rules-detail__label">Cycle Duration</span>`
  );
  content = content.replace(
    `<span className="rules-detail__label">Rest Period</span>`,
    `<span className="rules-detail__label">Fasting Period</span>`
  );
  content = content.replace(
    `<span className="rules-detail__label">Glove Size</span>`,
    `<span className="rules-detail__label">Guidelines</span>`
  );
  content = content.replace(
    `<span className="rules-detail__label">Headgear</span>`,
    `<span className="rules-detail__label">Intake Balance</span>`
  );
  content = content.replace(
    `<span className="rules-detail__label">Scoring</span>`,
    `<span className="rules-detail__label">Aims & Purpose</span>`
  );

  // Replace labels in WeightsTab
  content = content.replace(
    `<span className="rules-detail__label">Size</span>`,
    `<span className="rules-detail__label">Pre-Workout Window</span>`
  );
  content = content.replace(
    `<span className="rules-detail__label">Standard</span>`,
    `<span className="rules-detail__label">Intra-Workout Window</span>`
  );
  content = content.replace(
    `<span className="rules-detail__label">Ropes</span>`,
    `<span className="rules-detail__label">Post-Workout Window</span>`
  );
  content = content.replace(
    `<span className="rules-detail__label">Canvas</span>`,
    `<span className="rules-detail__label">Sleep Window</span>`
  );
  content = content.replace(
    `<span className="rules-detail__label">Corners</span>`,
    `<span className="rules-detail__label">Microbiome Shield</span>`
  );
  content = content.replace(
    `<span className="rules-detail__label">Apron</span>`,
    `<span className="rules-detail__label">Thermic Spacing</span>`
  );

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully rethemed RulesPage.tsx');
}
