const fs = require('fs');
const files = ['src/pages/Dashboard.tsx', 'src/pages/Explore.tsx', 'src/pages/ProjectDetails.tsx', 'src/pages/Workspace.tsx'];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes('import { fetchWithAuth }')) {
    content = 'import { fetchWithAuth } from "../lib/api";\n' + content;
    fs.writeFileSync(file, content);
  }
}
