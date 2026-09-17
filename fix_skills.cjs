const fs = require('fs');
let content = fs.readFileSync('src/pages/Skills.tsx', 'utf8');

content = content.replace(
  "const skillsList = Object.entries(skillProgress)\n    .map(([name, data]) => ({",
  "const skillsList = Object.entries(skillProgress)\n    .map(([name, data]: [string, any]) => ({"
);

fs.writeFileSync('src/pages/Skills.tsx', content);
