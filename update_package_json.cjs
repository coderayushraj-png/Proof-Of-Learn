const fs = require('fs');
let pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

pkg.scripts.dev = "tsx server.ts";
pkg.scripts.build = "vite build && esbuild server.ts --bundle --platform=node --format=cjs --packages=external --sourcemap --outfile=dist/server.cjs";
pkg.scripts.start = "node dist/server.cjs";
pkg.scripts["db:push"] = "drizzle-kit push";
pkg.scripts["db:studio"] = "drizzle-kit studio";

fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
