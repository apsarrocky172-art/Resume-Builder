import { Router } from 'express';
import { getAptitudeQuestions, submitAptitudeTest, getCodingChallenges, submitCode, botChat, getDashboardStatsForUser, getTechnicalQuizQuestions, submitTechnicalQuiz } from '../controllers/placementController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Allow guests to chat with the bot
router.post('/bot-chat', botChat as any);

router.use(authenticateToken as any);

router.get('/questions', getAptitudeQuestions as any);
router.post('/questions/submit', submitAptitudeTest as any);
router.get('/coding/challenges', getCodingChallenges as any);
router.post('/coding/submit', submitCode as any);
router.get('/technical-quiz/questions', getTechnicalQuizQuestions as any);
router.post('/technical-quiz/submit', submitTechnicalQuiz as any);
router.get('/dashboard-stats', getDashboardStatsForUser as any);

export default router;

