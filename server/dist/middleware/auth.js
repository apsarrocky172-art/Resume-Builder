"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = exports.invalidateTokenCache = exports.tokenCache = void 0;
const db_1 = require("../config/db");
exports.tokenCache = new Map();
const CACHE_TTL_MS = 60 * 1000; // 1 minute cache duration
const invalidateTokenCache = (token) => {
    exports.tokenCache.delete(token);
};
exports.invalidateTokenCache = invalidateTokenCache;
const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Access token missing' });
    }
    // Check cache first
    const cached = exports.tokenCache.get(token);
    if (cached && cached.expiresAt > Date.now()) {
        req.user = cached.user;
        return next();
    }
    try {
        const { data, error } = await db_1.supabase.auth.getUser(token);
        if (error || !data.user) {
            return res.status(403).json({ message: 'Invalid or expired token' });
        }
        const userData = {
            id: data.user.id,
            role: data.user.user_metadata?.role || 'student',
            email: data.user.email || '',
            name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'Unknown'
        };
        // Store in cache
        exports.tokenCache.set(token, {
            user: userData,
            expiresAt: Date.now() + CACHE_TTL_MS
        });
        req.user = userData;
        next();
    }
    catch (error) {
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
};
exports.authenticateToken = authenticateToken;
