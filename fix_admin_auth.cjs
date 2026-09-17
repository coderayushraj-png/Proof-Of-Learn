const fs = require('fs');
let content = fs.readFileSync('src/middleware/auth.ts', 'utf8');

const updatedRequireAdmin = `
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
`;

content = content.replace(/export const requireAdmin = async \([\s\S]*\}\;/m, updatedRequireAdmin);

fs.writeFileSync('src/middleware/auth.ts', content);
