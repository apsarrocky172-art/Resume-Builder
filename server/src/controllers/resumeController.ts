import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Resume from '../models/Resume';
import User from '../models/User';
import { analyzeResumeAI } from '../config/ai';

export const saveOrUpdateResume = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const resumeData = req.body;

    let resume = await Resume.findOne({ userId });
    if (resume) {
      // Update
      Object.assign(resume, resumeData);
      await resume.save();
    } else {
      // Create new
      resume = new Resume({
        userId,
        ...resumeData
      });
      await resume.save();
    }

    // Update user's skills list from resume
    if (resumeData.skills && Array.isArray(resumeData.skills)) {
      await User.findByIdAndUpdate(userId, { skills: resumeData.skills });
    }

    res.status(200).json(resume);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getResume = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const resume = await Resume.findOne({ userId });
    if (!resume) {
      return res.status(404).json({ message: 'No resume found for this user' });
    }

    res.status(200).json(resume);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const analyzeResume = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const resume = await Resume.findOne({ userId });
    if (!resume) {
      return res.status(404).json({ message: 'Please create and save your resume before analyzing' });
    }

    // Call OpenAI or Simulated AI
    const analysis = await analyzeResumeAI(resume);

    resume.resumeScore = analysis.score;
    resume.atsFeedback = {
      score: analysis.score,
      missingKeywords: analysis.missingKeywords || [],
      layoutRating: analysis.layoutRating || 'Good',
      contentSuggestions: analysis.contentSuggestions || [],
      optimizedSummary: analysis.optimizedSummary || '',
      skillSuggestions: analysis.skillSuggestions || []
    };

    await resume.save();

    res.status(200).json({
      message: 'ATS Analysis complete!',
      atsFeedback: resume.atsFeedback,
      resumeScore: resume.resumeScore
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
