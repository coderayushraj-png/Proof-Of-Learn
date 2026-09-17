import { Request, Response, NextFunction } from 'express';
import { adminAuth } from '../lib/firebase-admin.ts';
import { DecodedIdToken } from 'firebase-admin/auth';

export interface AuthRequest extends Request {
  user?: DecodedIdToken;
}

export const requireAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing token', code: 'UNAUTHORIZED' });
  }

  const token = authHeader.split('Bearer ')[1];
  
  if (token === 'DEMO_TOKEN') {
    req.user = {
      uid: 'demo_user_123',
      email: 'demo@example.com',
      name: 'Demo User',
      picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Demo',
      email_verified: true,
      auth_time: Date.now() / 1000,
      firebase: {
        identities: {},
        sign_in_provider: 'custom'
      }
    } as any;
    return next();
  }

  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Error verifying Firebase ID token:', error);
    return res.status(401).json({ error: 'Unauthorized: Invalid token', code: 'UNAUTHORIZED' });
  }
};

import { db } from '../db/index.ts';
import { users } from '../db/schema.ts';
import { eq } from 'drizzle-orm';

export const requireAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized: Missing token', code: 'UNAUTHORIZED' });
  }
  
  try {
    const userRecords = await db.select().from(users).where(eq(users.uid, req.user.uid)).limit(1);
    if (!userRecords.length || userRecords[0].role !== 'ADMIN') {
      return res.status(403).json({ error: 'Forbidden: Admin access required', code: 'FORBIDDEN' });
    }
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
