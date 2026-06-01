import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Job from '../models/Job';
import Resume from '../models/Resume';
import { getCompanyRoadmapAI } from '../config/ai';

export const getJobRecommendations = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    // Fetch user's resume skills
    const resume = await Resume.findOne({ userId });
    let skills: string[] = [];

    if (resume && resume.skills) {
      skills = resume.skills;
    }

    let query: any = {};
    if (skills.length > 0) {
      // Find jobs matching ANY of the user's resume skills
      query.skillsRequired = { $in: skills.map(s => new RegExp(`^${s}$`, 'i')) };
    }

    let recommendations = await Job.find(query);

    // If no exact matches, return default job postings
    if (recommendations.length === 0) {
      recommendations = await Job.find({});
    }

    res.status(200).json(recommendations);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getPrepRoadmap = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { company } = req.params;

    if (!company) {
      return res.status(400).json({ message: 'Company parameter is required' });
    }

    // Retrieve skills for personalized roadmap
    let skills: string[] = [];
    if (userId) {
      const resume = await Resume.findOne({ userId });
      if (resume && resume.skills) {
        skills = resume.skills;
      }
    }

    const roadmap = await getCompanyRoadmapAI(company, skills);
    res.status(200).json(roadmap);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
