import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: 'student' | 'recruiter' | 'admin';
  skills: string[];
  education: Array<{
    institution: string;
    degree: string;
    year: string;
    gpa?: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String },
    role: { type: String, enum: ['student', 'recruiter', 'admin'], default: 'student' },
    skills: { type: [String], default: [] },
    education: [
      {
        institution: { type: String, required: true },
        degree: { type: String, required: true },
        year: { type: String, required: true },
        gpa: { type: String }
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('User', UserSchema);
