import mongoose, { Schema, Document } from 'mongoose';

export interface IQuestion extends Document {
  type: 'aptitude' | 'coding';
  category: string; // Aptitude: 'quantitative' | 'logical' | 'verbal' | 'data-interpretation'. Coding: 'python' | 'java' | 'cpp' | 'sql' | 'javascript'
  difficulty: 'easy' | 'medium' | 'hard';
  questionText: string;
  options?: string[]; // Only for Aptitude (4 options)
  correctOption?: number; // Only for Aptitude (0-3)
  codeTemplate?: string; // Only for Coding (starter template code)
  testCases?: Array<{
    input: string;
    output: string;
  }>; // Only for Coding
  explanation?: string;
  companyTags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema: Schema = new Schema(
  {
    type: { type: String, enum: ['aptitude', 'coding'], required: true },
    category: { type: String, required: true },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
    questionText: { type: String, required: true },
    options: { type: [String], default: [] },
    correctOption: { type: Number },
    codeTemplate: { type: String },
    testCases: [
      {
        input: { type: String },
        output: { type: String }
      }
    ],
    explanation: { type: String },
    companyTags: { type: [String], default: [] }
  },
  { timestamps: true }
);

export default mongoose.model<IQuestion>('Question', QuestionSchema);
