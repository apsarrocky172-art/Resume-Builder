import { Router } from 'express';
import { register, login, forgotPassword, getMe, updateProfile } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.get('/me', authenticateToken as any, getMe as any);
router.put('/profile', authenticateToken as any, updateProfile as any);

export default router;
