const fs = require('fs');
let content = fs.readFileSync('src/components/layout/Navbar.tsx', 'utf8');

const importAuth = `import { useAuth } from "../../context/AuthContext"`;
content = content.replace('import { useAppContext } from "../../context/AppContext"', `import { useAppContext } from "../../context/AppContext"\n${importAuth}`);

content = content.replace("export function Navbar() {\n  const location = useLocation()", "export function Navbar() {\n  const location = useLocation()\n  const { user, signOutUser } = useAuth()");

content = content.replace("Alex Sharma", "{user?.displayName || 'Builder'}");
content = content.replace("alex@example.com", "{user?.email || ''}");
content = content.replace(
  '<Link to="/" onClick={() => setShowProfile(false)} className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-sm hover:bg-muted text-left text-red-600">',
  '<button onClick={() => { setShowProfile(false); signOutUser(); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-sm hover:bg-muted text-left text-red-600">'
);
content = content.replace(
  '</Link>\n                    </div>',
  '</button>\n                    </div>'
);

content = content.replace("AS", "{user?.email?.charAt(0).toUpperCase() || 'U'}");

content = content.replace('<Link to="/dashboard">Sign In</Link>', '<Link to="/login">Sign In</Link>');

fs.writeFileSync('src/components/layout/Navbar.tsx', content);
