const fs = require('fs');
let content = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

content = content.replace("import { allProjects } from \"../data/projects\"", "");

const useEffectHooks = `
  const [allProjects, setAllProjects] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => {
        setAllProjects(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Error fetching projects", err);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-screen-xl mx-auto px-4 py-24 text-center">
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }
`;

content = content.replace("export function Dashboard() {\n  const { userState } = useAppContext()", 
"import React from 'react';\n\nexport function Dashboard() {\n  const { userState, user } = useAppContext()\n" + useEffectHooks);

// And we need to fix the name of the user
content = content.replace("Welcome back, Alex", "Welcome back, {user?.displayName || 'Builder'}");

fs.writeFileSync('src/pages/Dashboard.tsx', content);
