import { Router } from 'express';
import { db } from '../db/index.ts';
import { users } from '../db/schema.ts';
import { eq } from 'drizzle-orm';
import { requireAuth, AuthRequest } from '../middleware/auth.ts';

const router = Router();

// Sync user to database after Firebase auth
router.post('/sync', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { uid, email, name, picture } = req.user!;
    
    // In a real app, you might want to pull the name from the request body if not present in token
    const displayName = req.body.name || name || email?.split('@')[0] || 'User';

    const result = await db.insert(users)
      .values({
        uid,
        email: email || '',
        name: displayName,
        avatarUrl: picture,
      })
      .onConflictDoUpdate({
        target: users.uid,
        set: {
          email: email || '',
          avatarUrl: picture,
        },
      })
      .returning();

    res.json(result[0]);
  } catch (error: any) {
    console.error("User sync error", error);
    res.status(500).json({ error: 'Failed to sync user', message: error.message });
  }
});

// GET /api/auth/me
router.get('/me', requireAuth, async (req: AuthRequest, res) => {
  try {
    const user = await db.select().from(users).where(eq(users.uid, req.user!.uid)).limit(1);
    if (!user.length) {
      return res.status(404).json({ error: 'User not found in database' });
    }
    res.json(user[0]);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch user profile', message: error.message });
  }
});

export default router;
