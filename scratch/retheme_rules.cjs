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
  { id: 'scoring', label: 'Nutrition Pillars', Icon: Scale },
  { id: 'amateur', label: 'Refeeds', Icon: Shield },
  { id: 'professional', label: 'Fasting', Icon: Award },
  { id: 'weights', label: 'Macro Profiles', Icon: Ruler },
  { id: 'fouls', label: 'Dietary Fouls', Icon: AlertTriangle },
];`
  );

  // Replace text
  content = content.replace('Judging Criteria (In Order of Priority)', 'Fueling Criteria (In Order of Priority)');
  content = content.replace('Round Scoring', 'Macro Assessment Status');
  content = content.replace('Professional Weight Classes', 'Macro Nutritional Profiles');
  content = content.replace('The 17 official weight divisions in professional boxing, from Minimumweight (105 lbs) to Heavyweight (no limit).', 'Recommended dietary fat, carbohydrate, and protein balances for specific sports goals.');
  content = content.replace('The Ring', 'Optimal Meal Timing Windows');
  content = content.replace('Boxing Fouls', 'Dietary & Fueling Fouls');
  content = content.replace('Illegal actions that result in warnings, point deductions, or disqualification.', 'Actions and nutritional inputs that hinder gut performance, recovery, and energy stability.');
  content = content.replace('RULES & <span className="text-primary">SCORING</span>', 'STANDARDS & <span className="text-primary">FUELING</span>');
  content = content.replace('Everything you need to understand how boxing is officiated, scored, and regulated.', 'Everything you need to understand glycemic timing, dietary fouls, refeed cycles, and macronutrient targets.');
  
  // Table headers in WeightsTab
  content = content.replace('<th>Limit (lbs)</th>', '<th>Macronutrient Focus</th>');
  content = content.replace('<th>Limit (kg)</th>', '<th>Daily Intake Ratio / Guidance</th>');
  content = content.replace('<td>{wc.note || `${wc.limitLbs} lbs`}</td>', '<td>{wc.alias}</td>');
  content = content.replace('<td>{wc.limitKg ? `${wc.limitKg} kg` : \'—\'}</td>', '<td>{wc.note}</td>');
  content = content.replace('<td className="weight-alias">{wc.alias || \'—\'}</td>', '<td className="weight-alias">{wc.division}</td>');
  content = content.replace('<td className="weight-name">{wc.division}</td>', '<td className="weight-name">{wc.division.split(\' (\')[0]}</td>');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully rethemed RulesPage.tsx');
}
