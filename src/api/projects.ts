import { Router } from 'express';
import { db } from '../db/index.ts';
import { projects, tasks, requirements, resources } from '../db/schema.ts';
import { eq, ilike, and, or, sql } from 'drizzle-orm';

const router = Router();

// GET /api/projects

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
      const q = `%${search}%`;
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

// GET /api/projects/:id
router.get('/:id', async (req, res) => {
  try {
    const proj = await db.select().from(projects).where(eq(projects.id, req.params.id)).limit(1);
    if (!proj.length) return res.status(404).json({ error: 'Project not found' });
    
    // Fetch associated tasks
    const projTasks = await db.select().from(tasks).where(eq(tasks.projectId, req.params.id));
    
    res.json({ ...proj[0], tasks: projTasks });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch project', message: error.message });
  }
});

export default router;
