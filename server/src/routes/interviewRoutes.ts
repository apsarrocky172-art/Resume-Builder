import { Router } from 'express';
import { startInterview, chatInterview, finalizeInterview } from '../controllers/interviewController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken as any);

router.post('/start', startInterview as any);
router.post('/chat', chatInterview as any);
router.post('/finalize', finalizeInterview as any);

export default router;
