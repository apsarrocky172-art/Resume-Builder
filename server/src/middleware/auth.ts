import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/db';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: 'student' | 'recruiter' | 'admin';
    email: string;
    name: string;
  };
}

// In-memory cache for authenticated users to avoid round-trip latency to Supabase
interface CachedUser {
  user: {
    id: string;
    role: 'student' | 'recruiter' | 'admin';
    email: string;
    name: string;
  };
  expiresAt: number;
}

export const tokenCache = new Map<string, CachedUser>();
const CACHE_TTL_MS = 60 * 1000; // 1 minute cache duration

export const invalidateTokenCache = (token: string) => {
  tokenCache.delete(token);
};

export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token missing' });
  }

  // Check cache first
  const cached = tokenCache.get(token);
  if (cached && cached.expiresAt > Date.now()) {
    req.user = cached.user;
    return next();
  }

  try {
    const { data, error } = await supabase.auth.getUser(token);
    
    if (error || !data.user) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }

    const userData: {
      id: string;
      role: 'student' | 'recruiter' | 'admin';
      email: string;
      name: string;
    } = { 
      id: data.user.id, 
      role: (data.user.user_metadata?.role as any) || 'student',
      email: data.user.email || '',
      name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'Unknown'
    };

    // Store in cache
    tokenCache.set(token, {
      user: userData,
      expiresAt: Date.now() + CACHE_TTL_MS
    });

    req.user = userData;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};
