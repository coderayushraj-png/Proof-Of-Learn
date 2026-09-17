const fs = require('fs');
let content = fs.readFileSync('src/api/me.ts', 'utf8');

const additionalCode = `
// GET /api/me/skills
router.get('/skills', async (req: AuthRequest, res) => {
  try {
    const uid = req.user!.uid;
    // For MVP, return some aggregated skills based on tags from user's started and submitted projects
    const myProjects = await db.select().from(userProjects).where(eq(userProjects.userId, uid));
    const projectIds = myProjects.map(p => p.projectId);
    
    let projs = [];
    if (projectIds.length > 0) {
      projs = await db.select().from(projects).where(sql\`id = ANY(ARRAY[\${sql.join(projectIds.map(id => sql\`\${id}\`), sql\`, \`)}])\`);
    }
    
    const myTasks = await db.select().from(userTasks).where(eq(userTasks.userId, uid));
    
    // Aggregate skills
    const skillProgress: Record<string, { total: number, completed: number }> = {};
    
    // For simple MVP we aggregate across all available projects for "total" and use myTasks for "completed"
    const allProjs = await db.select().from(projects);
    const allProjTasks = await db.select().from(tasks);
    
    for (const p of allProjs) {
      const pTasks = allProjTasks.filter(t => t.projectId === p.id);
      const tags = p.tags || [];
      for (const skill of tags) {
        if (!skillProgress[skill]) skillProgress[skill] = { total: 0, completed: 0 };
        skillProgress[skill].total += pTasks.length;
      }
    }
    
    // Add completed points
    for (const t of myTasks) {
      if (t.status === 'COMPLETED') {
        const taskDef = allProjTasks.find(x => x.id === t.taskId);
        if (taskDef) {
          const p = allProjs.find(x => x.id === taskDef.projectId);
          if (p) {
            const tags = p.tags || [];
            for (const skill of tags) {
              if (skillProgress[skill]) skillProgress[skill].completed += 1;
            }
          }
        }
      }
    }
    
    res.json(skillProgress);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch skills', message: error.message });
  }
});
`;

content += additionalCode;
fs.writeFileSync('src/api/me.ts', content);
