import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Interview from '../models/Interview';
import { getInterviewQuestionAI, gradeInterviewAI } from '../config/ai';

export const startInterview = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { type, roleTopic } = req.body; // type: 'hr' | 'technical' | 'behavioral' | 'system-design'

    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    if (!type || !roleTopic) {
      return res.status(400).json({ message: 'Interview type and role topic are required' });
    }

    const firstQuestion = await getInterviewQuestionAI(type, roleTopic, []);

    const interview = new Interview({
      userId,
      type,
      roleTopic,
      transcript: [{ role: 'ai', text: firstQuestion }],
      status: 'in-progress'
    });

    await interview.save();

    res.status(200).json({
      interviewId: interview._id,
      question: firstQuestion
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const chatInterview = async (req: AuthRequest, res: Response) => {
  try {
    const { interviewId, text } = req.body;
    if (!interviewId || !text) {
      return res.status(400).json({ message: 'interviewId and text are required' });
    }

    const interview = await Interview.findById(interviewId);
    if (!interview || interview.status !== 'in-progress') {
      return res.status(404).json({ message: 'Active interview session not found' });
    }

    // Push User statement to transcript
    interview.transcript.push({ role: 'user', text });

    // Generate Follow-up
    const nextQuestion = await getInterviewQuestionAI(
      interview.type,
      interview.roleTopic,
      interview.transcript
    );

    // Push AI question to transcript
    interview.transcript.push({ role: 'ai', text: nextQuestion });
    await interview.save();

    res.status(200).json({
      question: nextQuestion
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const finalizeInterview = async (req: AuthRequest, res: Response) => {
  try {
    const { interviewId } = req.body;
    if (!interviewId) {
      return res.status(400).json({ message: 'interviewId is required' });
    }

    const interview = await Interview.findById(interviewId);
    if (!interview) {
      return res.status(404).json({ message: 'Interview session not found' });
    }

    // Call LLM grader
    const grading = await gradeInterviewAI(interview.type, interview.roleTopic, interview.transcript);

    interview.scores = grading.scores;
    interview.feedback = grading.feedback;
    interview.status = 'completed';

    await interview.save();

    res.status(200).json({
      message: 'Interview evaluated successfully',
      scores: interview.scores,
      feedback: interview.feedback,
      transcript: interview.transcript
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
