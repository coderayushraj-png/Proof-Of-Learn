const fs = require('fs');
let content = fs.readFileSync('src/pages/Portfolio.tsx', 'utf8');

content = content.replace("import { allProjects } from \"../data/projects\"", "");
content = content.replace("import { useAppContext } from \"../context/AppContext\"", "import { useAppContext } from \"../context/AppContext\";\nimport React, { useState, useEffect } from 'react';\nimport { fetchWithAuth } from '../lib/api';");

const useEffectHooks = `
  const [completedProjects, setCompletedProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchWithAuth('/api/me/portfolio')
      .then(data => {
        setCompletedProjects(data || []);
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
        <p className="text-muted-foreground">Loading portfolio...</p>
      </div>
    );
  }
`;

content = content.replace("export function Portfolio() {\n  const { userState } = useAppContext()\n  \n  const completedProjects = userState.completedProjects.map(id => \n    allProjects.find(p => p.id === id)\n  ).filter(Boolean)", 
"export function Portfolio() {\n  const { userState } = useAppContext();\n" + useEffectHooks);

content = content.replace("proj.fullDescription", "proj.submission?.description || proj.description");
content = content.replace("proj.tags.map", "(proj.submission?.technologies || proj.tags || []).map");

content = content.replace('<Button variant="outline" className="flex-1">\n                    <ExternalLink className="w-4 h-4 mr-2" /> View Code\n                  </Button>', 
`{proj.submission?.githubUrl && (
                    <Button variant="outline" className="flex-1" asChild>
                      <a href={proj.submission.githubUrl} target="_blank" rel="noreferrer"><ExternalLink className="w-4 h-4 mr-2" /> View Code</a>
                    </Button>
                  )}`);
                  
content = content.replace('<Button variant="outline" className="flex-1">\n                    <ExternalLink className="w-4 h-4 mr-2" /> Live Demo\n                  </Button>',
`{proj.submission?.demoUrl && (
                    <Button variant="outline" className="flex-1" asChild>
                      <a href={proj.submission.demoUrl} target="_blank" rel="noreferrer"><ExternalLink className="w-4 h-4 mr-2" /> Live Demo</a>
                    </Button>
                  )}`);


fs.writeFileSync('src/pages/Portfolio.tsx', content);
