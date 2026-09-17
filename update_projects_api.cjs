const fs = require('fs');
let content = fs.readFileSync('src/api/projects.ts', 'utf8');

content = content.replace("import { eq } from 'drizzle-orm';", "import { eq, ilike, and, or, sql } from 'drizzle-orm';");

const getProjectsImpl = `
router.get('/', async (req, res) => {
  try {
    const { search, category, difficulty } = req.query;
    
    let conditions = [];
    
    if (category && category !== 'All') {
      conditions.push(eq(projects.category, String(category)));
    }
    
    if (difficulty && difficulty !== 'All') {
      conditions.push(eq(projects.difficulty, String(difficulty)));
    }
    
    if (search) {
      const q = \`%\${search}%\`;
      conditions.push(
        or(
          ilike(projects.title, q),
          ilike(projects.description, q),
          ilike(projects.category, q)
        )
      );
    }
    
    let allProjects;
    if (conditions.length > 0) {
      allProjects = await db.select().from(projects).where(and(...conditions));
    } else {
      allProjects = await db.select().from(projects);
    }
    
    // Add estHours for compatibility with frontend
    const mappedProjects = allProjects.map(p => ({
      ...p,
      estHours: Math.round(p.estimatedMinutes / 60) + 'h'
    }));
    
    res.json(mappedProjects);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch projects', message: error.message });
  }
});
`;

content = content.replace(/router\.get\('\/', async \(req, res\) => \{[\s\S]*?\}\);/, getProjectsImpl);

fs.writeFileSync('src/api/projects.ts', content);
