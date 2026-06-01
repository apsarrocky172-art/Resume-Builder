import mongoose, { Schema, Document } from 'mongoose';

export interface IInterview extends Document {
  userId: mongoose.Types.ObjectId;
  type: 'hr' | 'technical' | 'behavioral' | 'system-design';
  roleTopic: string; // e.g. 'Software Engineer', 'Front-End React Dev'
  transcript: Array<{
    role: 'ai' | 'user';
    text: string;
  }>;
  scores?: {
    technical: number;
    communication: number;
    confidence: number;
    overall: number;
  };
  feedback?: {
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
    detailedAnalysis: string;
  };
  status: 'in-progress' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

const InterviewSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['hr', 'technical', 'behavioral', 'system-design'], required: true },
    roleTopic: { type: String, required: true },
    transcript: [
      {
        role: { type: String, enum: ['ai', 'user'], required: true },
        text: { type: String, required: true }
      }
    ],
    scores: {
      technical: { type: Number, default: 0 },
      communication: { type: Number, default: 0 },
      confidence: { type: Number, default: 0 },
      overall: { type: Number, default: 0 }
    },
    feedback: {
      strengths: { type: [String], default: [] },
      weaknesses: { type: [String], default: [] },
      suggestions: { type: [String], default: [] },
      detailedAnalysis: { type: String }
    },
    status: { type: String, enum: ['in-progress', 'completed'], default: 'in-progress' }
  },
  { timestamps: true }
);

export default mongoose.model<IInterview>('Interview', InterviewSchema);
