const fs = require('fs');
let content = fs.readFileSync('src/pages/ProjectDetails.tsx', 'utf8');

content = content.replace("import { allProjects } from \"../data/projects\"", "");

const useEffectHooks = `
  const [project, setProject] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(\`/api/projects/\${id}\`);
        if (!res.ok) throw new Error('Project not found');
        const data = await res.json();
        
        // Ensure estHours is mapped correctly for the frontend
        data.estHours = Math.round(data.estimatedMinutes / 60) + 'h';
        // Skills are missing in db schema directly on project, fallback or use tags
        data.skills = data.tags || []; 
        data.fullDescription = data.description; // We don't have a separate fullDescription in DB
        
        setProject(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-screen-md mx-auto px-4 py-24 text-center">
        <p className="text-muted-foreground">Loading project details...</p>
      </div>
    )
  }
`;

content = content.replace("const project = allProjects.find(p => p.id === id)", useEffectHooks);

fs.writeFileSync('src/pages/ProjectDetails.tsx', content);
