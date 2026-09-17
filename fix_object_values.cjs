const fs = require('fs');

let dashboard = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');
dashboard = dashboard.replace(
  "Object.values(userState.completedTasks).flat().length",
  "Object.values(userState.completedTasks || {}).flat().length"
);
fs.writeFileSync('src/pages/Dashboard.tsx', dashboard);
