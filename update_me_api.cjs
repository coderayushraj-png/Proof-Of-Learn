const fs = require('fs');
let content = fs.readFileSync('src/api/me.ts', 'utf8');

const syncCode = `
// GET /api/me/sync
router.get('/sync', async (req: AuthRequest, res) => {
  try {
    const uid = req.user!.uid;
    const myProjects = await db.select().from(userProjects).where(eq(userProjects.userId, uid));
    const myTasks = await db.select().from(userTasks).where(eq(userTasks.userId, uid));
    const myTests = await db.select().from(testRuns).where(eq(testRuns.userId, uid));
    const mySubmissions = await db.select().from(submissions).where(eq(submissions.userId, uid));
    const myNotifications = await db.select().from(notifications).where(eq(notifications.userId, uid));

    const startedProjects = myProjects.map(p => p.projectId);
    const completedProjects = mySubmissions.map(s => s.projectId); // simple logic for MVP

    const completedTasks: Record<string, string[]> = {};
    const taskDefs = await db.select().from(tasks);
    const taskMap = new Map(taskDefs.map(t => [t.id, t.projectId]));
    
    for (const t of myTasks) {
      if (t.status === 'COMPLETED') {
        const pId = taskMap.get(t.taskId);
        if (pId) {
          if (!completedTasks[pId]) completedTasks[pId] = [];
          completedTasks[pId].push(t.taskId);
        }
      }
    }

    const testHistory: Record<string, any[]> = {};
    for (const tr of myTests) {
      if (!testHistory[tr.projectId]) testHistory[tr.projectId] = [];
      testHistory[tr.projectId].push(tr);
    }

    const submissionsDict: Record<string, any> = {};
    for (const s of mySubmissions) {
      submissionsDict[s.projectId] = s;
    }

    res.json({
      startedProjects,
      completedTasks,
      taskAnalytics: {},
      testHistory,
      submissions: submissionsDict,
      completedProjects,
      notifications: myNotifications
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to sync user state', message: error.message });
  }
});
`;

content = content.replace("router.use(requireAuth);", "router.use(requireAuth);\n" + syncCode);

fs.writeFileSync('src/api/me.ts', content);
