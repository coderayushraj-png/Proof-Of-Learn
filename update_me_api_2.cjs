const fs = require('fs');
let content = fs.readFileSync('src/api/me.ts', 'utf8');

const additionalCode = `
// POST /api/me/projects/:projectId/tests
router.post('/projects/:projectId/tests', async (req: AuthRequest, res) => {
  try {
    const { projectId } = req.params;
    const testRun = req.body;
    
    await db.insert(testRuns).values({
      id: testRun.id,
      userId: req.user!.uid,
      projectId,
      passedCount: testRun.passedCount,
      totalCount: testRun.totalCount
    });
    
    // For MVP we won't insert individual test_results here, but you would normally
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to record test', message: error.message });
  }
});

// POST /api/me/projects/:projectId/submit
router.post('/projects/:projectId/submit', async (req: AuthRequest, res) => {
  try {
    const { projectId } = req.params;
    const sub = req.body;
    
    const result = await db.insert(submissions).values({
      userId: req.user!.uid,
      projectId,
      githubUrl: sub.githubUrl,
      demoUrl: sub.demoUrl,
      description: sub.description,
      technologies: sub.technologies,
      status: 'VERIFIED'
    }).returning();
    
    res.json(result[0]);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to submit project', message: error.message });
  }
});
`;

content += additionalCode;

fs.writeFileSync('src/api/me.ts', content);
