"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const placementController_1 = require("../controllers/placementController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Allow guests to chat with the bot
router.post('/bot-chat', placementController_1.botChat);
router.use(auth_1.authenticateToken);
router.get('/questions', placementController_1.getAptitudeQuestions);
router.post('/questions/submit', placementController_1.submitAptitudeTest);
router.get('/coding/challenges', placementController_1.getCodingChallenges);
router.post('/coding/submit', placementController_1.submitCode);
router.get('/technical-quiz/questions', placementController_1.getTechnicalQuizQuestions);
router.post('/technical-quiz/submit', placementController_1.submitTechnicalQuiz);
router.get('/dashboard-stats', placementController_1.getDashboardStatsForUser);
exports.default = router;
