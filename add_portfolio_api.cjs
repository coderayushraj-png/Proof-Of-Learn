const fs = require('fs');
let content = fs.readFileSync('src/api/me.ts', 'utf8');

const additionalCode = `
// GET /api/me/portfolio
router.get('/portfolio', async (req: AuthRequest, res) => {
  try {
    const uid = req.user!.uid;
    const mySubmissions = await db.select().from(submissions).where(eq(submissions.userId, uid));
    
    const projectIds = mySubmissions.map(s => s.projectId);
    
    let verifiedProjects = [];
    if (projectIds.length > 0) {
      const projs = await db.select().from(projects).where(sql\`id = ANY(ARRAY[\${sql.join(projectIds.map(id => sql\`\${id}\`), sql\`, \`)}])\`);
      
      verifiedProjects = projs.map(p => {
        const sub = mySubmissions.find(s => s.projectId === p.id);
        return {
          ...p,
          submission: sub
        };
      });
    }
    
    res.json(verifiedProjects);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch portfolio', message: error.message });
  }
});
`;

content += additionalCode;
fs.writeFileSync('src/api/me.ts', content);
