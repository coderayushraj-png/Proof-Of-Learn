const fs = require('fs');
let content = fs.readFileSync('src/api/me.ts', 'utf8');

// Remove export default router; from the middle
content = content.replace("export default router;\n", "");
// Add it to the end
content += "\nexport default router;\n";
content = content.replace("import { eq, and } from 'drizzle-orm';", "import { eq, and, sql } from 'drizzle-orm';");

fs.writeFileSync('src/api/me.ts', content);
