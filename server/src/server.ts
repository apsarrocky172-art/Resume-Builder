import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';

// Import Routes
import authRoutes from './routes/authRoutes';
import resumeRoutes from './routes/resumeRoutes';
import placementRoutes from './routes/placementRoutes';
import interviewRoutes from './routes/interviewRoutes';
import jobRoutes from './routes/jobRoutes';
import adminRoutes from './routes/adminRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Middlewares
app.use(cors({ origin: '*' })); // Allow all origins for dev/testing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', time: new Date() });
});

// Map Routes
app.use('/api/auth', authRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/placement', placementRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/admin', adminRoutes);

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('[Global Error]', err.stack || err);
  res.status(500).json({
    message: err.message || 'An unexpected server error occurred'
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`========================================`);
  console.log(` AI Placement Platform Server Running `);
  console.log(` Port: http://localhost:${PORT}        `);
  console.log(`========================================`);
});
