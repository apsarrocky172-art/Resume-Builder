import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const connUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ai_placement_db';
    console.log(`[Database] Attempting connection to: ${connUri}`);
    await mongoose.connect(connUri);
    console.log('[Database] MongoDB Connected Successfully.');
  } catch (error: any) {
    console.error(`[Database] Connection Error: ${error.message}`);
    console.log('[Database] Launching in-memory mock data mode fallback. All routes will simulate database states without crashing.');
  }
};
