const fs = require('fs');
let content = fs.readFileSync('src/pages/Skills.tsx', 'utf8');

content = content.replace("import { allProjects } from \"../data/projects\"", "");
content = content.replace("import { useAppContext } from \"../context/AppContext\"", "import { useAppContext } from \"../context/AppContext\";\nimport React, { useState, useEffect } from 'react';\nimport { fetchWithAuth } from '../lib/api';");

const useEffectHooks = `
  const [skillProgress, setSkillProgress] = useState<Record<string, { total: number, completed: number }>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchWithAuth('/api/me/skills')
      .then(data => {
        setSkillProgress(data || {});
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-screen-xl mx-auto px-4 py-24 text-center">
        <p className="text-muted-foreground">Loading skills...</p>
      </div>
    );
  }
`;

content = content.replace(/const skillProgress: Record<string, \{ total: number, completed: number \}> = \{\}[\s\S]*?\}\)/, useEffectHooks);

fs.writeFileSync('src/pages/Skills.tsx', content);
