import { Router } from 'express';
import { getDashboardStats, getAllUsers, createAptitudeOrCodingQuestion, createJobPosting } from '../controllers/adminController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken as any);

router.get('/stats', getDashboardStats as any);
router.get('/users', getAllUsers as any);
router.post('/questions', createAptitudeOrCodingQuestion as any);
router.post('/jobs', createJobPosting as any);

export default router;
