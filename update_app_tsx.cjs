const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const imports = `import { AuthProvider } from "./context/AuthContext"
import { ProtectedRoute } from "./components/ProtectedRoute"
import { Login } from "./pages/Login"
import { SignUp } from "./pages/SignUp"`;

content = content.replace('import { AppProvider } from "./context/AppContext"', `import { AppProvider } from "./context/AppContext"\n${imports}`);

const appProviderStart = `<AppProvider>`;
const newAppProviderStart = `<AuthProvider><AppProvider>`;

const appProviderEnd = `</AppProvider>`;
const newAppProviderEnd = `</AppProvider></AuthProvider>`;

content = content.replace(appProviderStart, newAppProviderStart);
content = content.replace(appProviderEnd, newAppProviderEnd);

const newRoutes = `<Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/project/:id" element={<ProjectDetails />} />
            <Route path="/portfolio" element={<ProtectedRoute><Portfolio /></ProtectedRoute>} />
            <Route path="/skills" element={<ProtectedRoute><Skills /></ProtectedRoute>} />`;

content = content.replace(/<Route path="\/" element=\{<Landing \/>\} \/>.*<Route path="\/skills" element=\{<Skills \/>\} \/>/s, newRoutes);
content = content.replace(/<Route path="\/workspace\/:id" element=\{<Workspace \/>\} \/>/, `<Route path="/workspace/:id" element={<ProtectedRoute><Workspace /></ProtectedRoute>} />`);

fs.writeFileSync('src/App.tsx', content);
