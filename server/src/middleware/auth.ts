import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: 'student' | 'recruiter' | 'admin';
  };
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token missing' });
  }

  try {
    const secret = process.env.JWT_SECRET || 'supersecret_key_12345_for_local_development';
    const decoded = jwt.verify(token, secret) as { id: string; role: 'student' | 'recruiter' | 'admin' };
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};
