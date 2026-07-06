import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { supabase } from '../config/db';
import { getCompanyRoadmapAI } from '../config/ai';

const mapToClient = (job: any) => {
  if (!job) return null;
  return {
    id: job.id,
    title: job.title,
    company: job.company,
    location: job.location,
    type: job.type,
    salary: job.salary,
    description: job.description,
    skillsRequired: job.skills_required,
    link: job.link,
    createdAt: job.created_at,
    updatedAt: job.updated_at
  };
};

export const getJobRecommendations = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    // Fetch user's resume skills
    const { data: resume } = await supabase
      .from('resumes')
      .select('skills')
      .eq('user_id', userId)
      .maybeSingle();

    let skills: string[] = [];
    if (resume && resume.skills) {
      skills = resume.skills;
    }

    let query = supabase.from('jobs').select('*');
    if (skills.length > 0) {
      // Find jobs matching ANY of the user's resume skills using Postgres overlap
      query = query.overlaps('skills_required', skills);
    }

    let { data: recommendations, error } = await query;

    // If no exact matches, return default job postings
    if (error || !recommendations || recommendations.length === 0) {
      const { data: defaultJobs } = await supabase.from('jobs').select('*');
      recommendations = defaultJobs;
    }

    res.status(200).json(recommendations?.map(mapToClient) || []);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getPrepRoadmap = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { company } = req.params;
    const role = (req.query.role as string) || 'Software Engineer';

    if (!company) {
      return res.status(400).json({ message: 'Company parameter is required' });
    }

    // Retrieve skills for personalized roadmap
    let skills: string[] = [];
    if (userId) {
      const { data: resume } = await supabase
        .from('resumes')
        .select('skills')
        .eq('user_id', userId)
        .maybeSingle();

      if (resume && resume.skills) {
        skills = resume.skills;
      }
    }

    const roadmap = await getCompanyRoadmapAI(company, role, skills);
    res.status(200).json(roadmap);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
