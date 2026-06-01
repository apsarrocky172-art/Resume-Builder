import { Router } from 'express';
import { saveOrUpdateResume, getResume, analyzeResume } from '../controllers/resumeController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken as any);

router.post('/', saveOrUpdateResume as any);
router.get('/', getResume as any);
router.post('/analyze', analyzeResume as any);

export default router;
