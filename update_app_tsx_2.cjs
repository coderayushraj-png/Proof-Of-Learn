const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const imports = `import { ForgotPassword } from "./pages/ForgotPassword"`;

content = content.replace('import { SignUp } from "./pages/SignUp"', `import { SignUp } from "./pages/SignUp"\n${imports}`);

const newRoutes = `<Route path="/forgot-password" element={<ForgotPassword />} />`;

content = content.replace('<Route path="/login" element={<Login />} />', `<Route path="/login" element={<Login />} />\n            ${newRoutes}`);

fs.writeFileSync('src/App.tsx', content);
