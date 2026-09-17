const fs = require('fs');
let content = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

content = content.replace("const { userState, user } = useAppContext()", "const { userState } = useAppContext();\n  const { user } = useAuth();");
content = content.replace("import { useAppContext } from \"../context/AppContext\"", "import { useAppContext } from \"../context/AppContext\";\nimport { useAuth } from \"../context/AuthContext\";");

fs.writeFileSync('src/pages/Dashboard.tsx', content);
