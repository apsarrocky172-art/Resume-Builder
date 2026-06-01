import { Router } from 'express';
import { getAptitudeQuestions, submitAptitudeTest, getCodingChallenges, submitCode } from '../controllers/placementController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken as any);

router.get('/questions', getAptitudeQuestions as any);
router.post('/questions/submit', submitAptitudeTest as any);
router.get('/coding/challenges', getCodingChallenges as any);
router.post('/coding/submit', submitCode as any);

export default router;
