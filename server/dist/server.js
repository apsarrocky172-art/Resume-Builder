"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const db_1 = require("./config/db");
// Import Routes
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const resumeRoutes_1 = __importDefault(require("./routes/resumeRoutes"));
const placementRoutes_1 = __importDefault(require("./routes/placementRoutes"));
const interviewRoutes_1 = __importDefault(require("./routes/interviewRoutes"));
const jobRoutes_1 = __importDefault(require("./routes/jobRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Connect to Database
(0, db_1.connectDB)();
// Middlewares
app.use((0, cors_1.default)({ origin: '*' })); // Allow all origins for dev/testing
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Request Logger
app.use((req, res, next) => {
    console.log(`[HTTP] ${req.method} ${req.url}`);
    next();
});
// Health Check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', time: new Date() });
});
// Root friendly redirect/landing page
app.get('/', (req, res) => {
    res.status(200).send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>AI Placement API Server</title>
        <style>
          body {
            font-family: system-ui, -apple-system, sans-serif;
            background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
            color: #f8fafc;
            height: 100vh;
            margin: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
          }
          .card {
            background: rgba(30, 41, 59, 0.7);
            backdrop-filter: blur(12px);
            padding: 2.5rem;
            border-radius: 24px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
            border: 1px solid rgba(255, 255, 255, 0.08);
            max-width: 480px;
            width: 90%;
          }
          h2 { margin-top: 0; font-size: 1.5rem; font-weight: 800; background: linear-gradient(to right, #6366f1, #d946ef); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
          p { color: #94a3b8; font-size: 0.95rem; line-height: 1.5; margin: 1rem 0 1.5rem; }
          .btn {
            display: inline-block;
            background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
            color: white;
            padding: 0.75rem 1.5rem;
            border-radius: 12px;
            text-decoration: none;
            font-weight: 700;
            box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.3);
            transition: all 0.2s ease;
          }
          .btn:hover { transform: translateY(-2px); box-shadow: 0 12px 20px -3px rgba(99, 102, 241, 0.4); }
          .footer { margin-top: 2rem; border-top: 1px solid rgba(255, 255, 255, 0.06); padding-top: 1rem; font-size: 0.8rem; color: #64748b; }
          .footer a { color: #6366f1; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="card">
          <h2>🚀 AI Placement API Server is Running</h2>
          <p>This is the backend API service layer. To open the main platform and start building your resume or training, access the Web Client UI:</p>
          <a class="btn" href="http://localhost:3000">Open App (Port 3000)</a>
          <div class="footer">
            API Health: <a href="/health">/health</a>
          </div>
        </div>
      </body>
    </html>
  `);
});
// Map Routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/resumes', resumeRoutes_1.default);
app.use('/api/placement', placementRoutes_1.default);
app.use('/api/interviews', interviewRoutes_1.default);
app.use('/api/jobs', jobRoutes_1.default);
app.use('/api/admin', adminRoutes_1.default);
// Global Error Handler
app.use((err, req, res, next) => {
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
