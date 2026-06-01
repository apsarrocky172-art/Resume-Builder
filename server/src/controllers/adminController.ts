import { Request, Response } from 'express';
import User from '../models/User';
import Resume from '../models/Resume';
import Interview from '../models/Interview';
import Question from '../models/Question';
import Job from '../models/Job';

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const totalUsers = await User.countDocuments({});
    const totalResumes = await Resume.countDocuments({});
    const totalInterviews = await Interview.countDocuments({ status: 'completed' });
    const totalJobs = await Job.countDocuments({});

    const resumes = await Resume.find({ resumeScore: { $gt: 0 } }).select('resumeScore');
    const averageResumeScore = resumes.length > 0
      ? Math.round(resumes.reduce((acc, curr) => acc + curr.resumeScore, 0) / resumes.length)
      : 0;

    // Aggregate monthly data or dynamic categories for analytical graphs
    const companyAnalytics = [
      { name: 'TCS', placements: 45 },
      { name: 'Razorpay', placements: 28 },
      { name: 'Deloitte', placements: 34 },
      { name: 'Amazon', placements: 18 }
    ];

    res.status(200).json({
      stats: {
        totalUsers,
        totalResumes,
        totalInterviews,
        totalJobs,
        averageResumeScore
      },
      companyAnalytics
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({}).select('-password');
    res.status(200).json(users);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createAptitudeOrCodingQuestion = async (req: Request, res: Response) => {
  try {
    const question = new Question(req.body);
    await question.save();
    res.status(201).json({ message: 'Question created successfully', question });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createJobPosting = async (req: Request, res: Response) => {
  try {
    const job = new Job(req.body);
    await job.save();
    res.status(201).json({ message: 'Job posting added successfully', job });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
