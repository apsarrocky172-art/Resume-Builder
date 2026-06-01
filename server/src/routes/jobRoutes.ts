import { Router } from 'express';
import { getJobRecommendations, getPrepRoadmap } from '../controllers/jobController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken as any);

router.get('/recommendations', getJobRecommendations as any);
router.get('/roadmap/:company', getPrepRoadmap as any);

export default router;
