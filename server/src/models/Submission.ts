import mongoose, { Schema, Document } from 'mongoose';

export interface ISubmission extends Document {
  userId: mongoose.Types.ObjectId;
  questionId: mongoose.Types.ObjectId;
  code: string;
  language: string;
  status: 'Accepted' | 'Wrong Answer' | 'Runtime Error' | 'Compile Error';
  score?: number;
  createdAt: Date;
  updatedAt: Date;
}

const SubmissionSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    questionId: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
    code: { type: String, required: true },
    language: { type: String, required: true },
    status: { type: String, enum: ['Accepted', 'Wrong Answer', 'Runtime Error', 'Compile Error'], required: true },
    score: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model<ISubmission>('Submission', SubmissionSchema);
