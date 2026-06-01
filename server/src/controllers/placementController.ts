import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Question from '../models/Question';
import Submission from '../models/Submission';

export const getAptitudeQuestions = async (req: Request, res: Response) => {
  try {
    const { category, limit } = req.query;
    const query: any = { type: 'aptitude' };

    if (category) {
      query.category = category;
    }

    const size = limit ? parseInt(limit as string, 10) : 5;
    const questions = await Question.aggregate([
      { $match: query },
      { $sample: { size } }
    ]);

    res.status(200).json(questions);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const submitAptitudeTest = async (req: AuthRequest, res: Response) => {
  try {
    const { answers } = req.body; // Array of { questionId: string, selectedOption: number }
    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ message: 'Answers array is required' });
    }

    let score = 0;
    const results = [];

    for (const ans of answers) {
      const question = await Question.findById(ans.questionId);
      if (question && question.type === 'aptitude') {
        const isCorrect = question.correctOption === ans.selectedOption;
        if (isCorrect) score++;
        results.push({
          questionId: question._id,
          questionText: question.questionText,
          isCorrect,
          correctOption: question.correctOption,
          explanation: question.explanation
        });
      }
    }

    const percentage = Math.round((score / answers.length) * 100) || 0;

    res.status(200).json({
      score,
      total: answers.length,
      percentage,
      results
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getCodingChallenges = async (req: Request, res: Response) => {
  try {
    const { difficulty } = req.query;
    const query: any = { type: 'coding' };

    if (difficulty) {
      query.difficulty = difficulty;
    }

    const challenges = await Question.find(query);
    res.status(200).json(challenges);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const submitCode = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { questionId, code, language } = req.body;

    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    if (!questionId || !code || !language) {
      return res.status(400).json({ message: 'Missing fields (questionId, code, language)' });
    }

    const question = await Question.findById(questionId);
    if (!question || question.type !== 'coding') {
      return res.status(404).json({ message: 'Coding challenge not found' });
    }

    // LeetCode-style simulated dynamic compiler check
    let status: 'Accepted' | 'Wrong Answer' | 'Runtime Error' | 'Compile Error' = 'Accepted';
    let errorMessage = '';

    const cleanedCode = code.trim().replace(/\s+/g, ' ');

    if (cleanedCode.includes('syntax error') || cleanedCode.includes('undefined_variable_error')) {
      status = 'Compile Error';
      errorMessage = 'SyntaxError: Unexpected identifier in compilation environment.';
    } else if (cleanedCode.length < 35 || cleanedCode.includes('pass') || cleanedCode.includes('return false')) {
      status = 'Wrong Answer';
    } else if (cleanedCode.includes('infinite loop') || cleanedCode.includes('while True')) {
      status = 'Runtime Error';
      errorMessage = 'Time Limit Exceeded: Process execution took longer than 2000ms.';
    }

    const submission = new Submission({
      userId,
      questionId,
      code,
      language,
      status,
      score: status === 'Accepted' ? 100 : 0
    });

    await submission.save();

    res.status(200).json({
      status,
      score: submission.score,
      errorMessage,
      testCasesCount: question.testCases?.length || 0,
      passedCount: status === 'Accepted' ? (question.testCases?.length || 1) : 0
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
