const fs = require('fs');
let content = fs.readFileSync('src/pages/Explore.tsx', 'utf8');

content = content.replace("import { allProjects } from \"../data/projects\"", "");

const useEffectHooks = `
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setSearchQuery(searchParams.get("q") || "")
  }, [searchParams])

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      setError('');
      try {
        const queryParams = new URLSearchParams();
        if (searchQuery) queryParams.append('search', searchQuery);
        if (activeCategory !== 'All') queryParams.append('category', activeCategory);
        if (activeDifficulty !== 'All') queryParams.append('difficulty', activeDifficulty);
        
        const res = await fetch('/api/projects?' + queryParams.toString());
        if (!res.ok) throw new Error('Failed to load projects');
        const data = await res.json();
        setProjects(data);
      } catch (err: any) {
        setError(err.message || 'Error fetching projects');
      } finally {
        setIsLoading(false);
      }
    };
    
    // Simple debounce
    const timeout = setTimeout(fetchProjects, 300);
    return () => clearTimeout(timeout);
  }, [searchQuery, activeCategory, activeDifficulty]);
`;

content = content.replace(/useEffect\(\(\) => \{\s*setSearchQuery\(searchParams.get\("q"\) \|\| ""\)\s*\}, \[searchParams\]\)/, useEffectHooks);

content = content.replace(/const filteredProjects = useMemo\(\(\) => \{[\s\S]*?\}, \[activeCategory, activeDifficulty, searchQuery\]\)/, "const filteredProjects = projects;");

// Add loading state rendering
const listRendering = `
      {isLoading ? (
        <div className="py-24 text-center">
          <p className="text-muted-foreground">Loading projects...</p>
        </div>
      ) : error ? (
        <div className="py-24 text-center border border-destructive border-dashed rounded-xl bg-destructive/10">
          <h3 className="text-xl font-bold mb-2 text-destructive">Couldn't load projects</h3>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button variant="outline" onClick={() => { setActiveCategory('All'); setActiveDifficulty('All'); setSearchQuery(''); }}>Retry</Button>
        </div>
      ) : filteredProjects.length === 0 ? (
`;
content = content.replace(/\{\s*filteredProjects\.length === 0 \? \(/, listRendering);

fs.writeFileSync('src/pages/Explore.tsx', content);
