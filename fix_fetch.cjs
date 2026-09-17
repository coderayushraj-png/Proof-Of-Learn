const fs = require('fs');
const files = ['src/pages/Dashboard.tsx', 'src/pages/Explore.tsx', 'src/pages/ProjectDetails.tsx', 'src/pages/Workspace.tsx'];

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf8');
  console.log(`Checking ${file}`);
}
