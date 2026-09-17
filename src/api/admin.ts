import { Router } from 'express';
import { db } from '../db/index.ts';
import { projects, tasks, requirements, resources } from '../db/schema.ts';
import { eq } from 'drizzle-orm';
import { requireAuth, requireAdmin, AuthRequest } from '../middleware/auth.ts';

const router = Router();
router.use(requireAuth);
router.use(requireAdmin);

// POST /api/admin/projects
router.post('/projects', async (req: AuthRequest, res) => {
  try {
    const proj = req.body;
    const result = await db.insert(projects).values({
      id: proj.id,
      title: proj.title,
      slug: proj.slug || proj.id,
      description: proj.description,
      category: proj.category,
      difficulty: proj.difficulty,
      estimatedMinutes: proj.estimatedMinutes,
      featured: proj.featured || false,
      tags: proj.tags || []
    }).returning();
    res.json(result[0]);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to create project', message: error.message });
  }
});

// PUT /api/admin/projects/:id
router.put('/projects/:id', async (req: AuthRequest, res) => {
  try {
    const proj = req.body;
    const result = await db.update(projects).set({
      title: proj.title,
      slug: proj.slug,
      description: proj.description,
      category: proj.category,
      difficulty: proj.difficulty,
      estimatedMinutes: proj.estimatedMinutes,
      featured: proj.featured,
      tags: proj.tags,
      updatedAt: new Date()
    }).where(eq(projects.id, req.params.id)).returning();
    res.json(result[0]);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to update project', message: error.message });
  }
});

// DELETE /api/admin/projects/:id
router.delete('/projects/:id', async (req: AuthRequest, res) => {
  try {
    await db.delete(projects).where(eq(projects.id, req.params.id));
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to delete project', message: error.message });
  }
});

// POST /api/admin/projects/:id/tasks
router.post('/projects/:id/tasks', async (req: AuthRequest, res) => {
  try {
    const t = req.body;
    const result = await db.insert(tasks).values({
      id: t.id,
      projectId: req.params.id,
      title: t.title,
      description: t.description,
      objective: t.objective,
      position: t.position,
      required: t.required !== undefined ? t.required : true
    }).returning();
    res.json(result[0]);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to create task', message: error.message });
  }
});

// PUT /api/admin/tasks/:id
router.put('/tasks/:id', async (req: AuthRequest, res) => {
  try {
    const t = req.body;
    const result = await db.update(tasks).set({
      title: t.title,
      description: t.description,
      objective: t.objective,
      position: t.position,
      required: t.required
    }).where(eq(tasks.id, req.params.id)).returning();
    res.json(result[0]);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to update task', message: error.message });
  }
});

// DELETE /api/admin/tasks/:id
router.delete('/tasks/:id', async (req: AuthRequest, res) => {
  try {
    await db.delete(tasks).where(eq(tasks.id, req.params.id));
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to delete task', message: error.message });
  }
});

export default router;
