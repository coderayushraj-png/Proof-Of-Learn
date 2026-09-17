const fs = require('fs');
let content = fs.readFileSync('src/pages/Workspace.tsx', 'utf8');

content = content.replace("import { allProjects } from \"../data/projects\"", "");

const useEffectHooks = `
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(\`/api/projects/\${projectId}\`)
      .then(res => {
        if (!res.ok) throw new Error('Project not found');
        return res.json();
      })
      .then(data => {
        data.estHours = Math.round(data.estimatedMinutes / 60) + 'h';
        data.skills = data.tags || [];
        data.fullDescription = data.description;
        setProject(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, [projectId]);

  useEffect(() => {
    if (project && !activeTaskId && project.tasks && project.tasks.length > 0) {
      const firstUncompleted = project.tasks.find(t => !completedTasks.includes(t.id));
      setActiveTaskId(firstUncompleted ? firstUncompleted.id : project.tasks[0].id);
    }
  }, [project, completedTasks, activeTaskId]);

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground">Loading workspace...</div>
  }

  if (!project) {
    return <div className="p-8 text-center text-muted-foreground">Project not found</div>
  }
`;

content = content.replace(/const project = allProjects.find\(p => p\.id === projectId\)[\s\S]*?if \(\!project\) \{\s*return <div className="p-8 text-center">Project not found<\/div>\s*\}/, useEffectHooks);

fs.writeFileSync('src/pages/Workspace.tsx', content);
