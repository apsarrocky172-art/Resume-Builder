import mongoose, { Schema, Document } from 'mongoose';

export interface IResume extends Document {
  userId: mongoose.Types.ObjectId;
  templateId: string;
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    linkedin?: string;
    portfolio?: string;
    careerObjective?: string;
    summary?: string;
  };
  education: Array<{
    institution: string;
    degree: string;
    year: string;
    gpa?: string;
  }>;
  experience: Array<{
    company: string;
    role: string;
    duration: string;
    description: string;
  }>;
  projects: Array<{
    title: string;
    description: string;
    technologies: string[];
    link?: string;
  }>;
  skills: string[];
  certifications: string[];
  achievements: string[];
  resumeScore: number;
  atsFeedback?: {
    score: number;
    missingKeywords: string[];
    layoutRating: string;
    contentSuggestions: string[];
    optimizedSummary?: string;
    skillSuggestions?: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const ResumeSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    templateId: { type: String, default: 'modern' },
    personalInfo: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      linkedin: { type: String },
      portfolio: { type: String },
      careerObjective: { type: String },
      summary: { type: String }
    },
    education: [
      {
        institution: { type: String, required: true },
        degree: { type: String, required: true },
        year: { type: String, required: true },
        gpa: { type: String }
      }
    ],
    experience: [
      {
        company: { type: String },
        role: { type: String },
        duration: { type: String },
        description: { type: String }
      }
    ],
    projects: [
      {
        title: { type: String },
        description: { type: String },
        technologies: { type: [String] },
        link: { type: String }
      }
    ],
    skills: { type: [String], default: [] },
    certifications: { type: [String], default: [] },
    achievements: { type: [String], default: [] },
    resumeScore: { type: Number, default: 0 },
    atsFeedback: {
      score: { type: Number, default: 0 },
      missingKeywords: { type: [String], default: [] },
      layoutRating: { type: String, default: 'N/A' },
      contentSuggestions: { type: [String], default: [] },
      optimizedSummary: { type: String },
      skillSuggestions: { type: [String], default: [] }
    }
  },
  { timestamps: true }
);

export default mongoose.model<IResume>('Resume', ResumeSchema);
