const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

content = content.replace(
  'import meRoutes from "./src/api/me.ts";',
  'import meRoutes from "./src/api/me.ts";\nimport adminRoutes from "./src/api/admin.ts";'
);

content = content.replace(
  'app.use("/api/me", meRoutes);',
  'app.use("/api/me", meRoutes);\n  app.use("/api/admin", adminRoutes);'
);

fs.writeFileSync('server.ts', content);
