import mongoose, { Schema, Document } from 'mongoose';

export interface IJob extends Document {
  title: string;
  company: string;
  location: string;
  type: 'full-time' | 'internship';
  salary: string;
  description: string;
  skillsRequired: string[];
  link?: string;
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    type: { type: String, enum: ['full-time', 'internship'], required: true },
    salary: { type: String, required: true },
    description: { type: String, required: true },
    skillsRequired: { type: [String], required: true },
    link: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model<IJob>('Job', JobSchema);
