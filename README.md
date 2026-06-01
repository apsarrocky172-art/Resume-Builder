# AI Placement Trainer & Resume Builder 🚀

A premium, state-of-the-art full-stack SaaS platform designed for students, freshers, and job seekers to accelerate their careers. It combines features inspired by LinkedIn, Internshala, Canva, and LeetCode, powered by a sophisticated, fail-safe AI system.

---

## 🌟 Premium Features

### 1. 📝 AI Resume Builder
* **Multi-Step Form**: Seamless user experience to enter education, projects, skills, certifications, and experience.
* **4 Canva-inspired Styling Templates**: Modern, Corporate, Minimal, and Creative styles.
* **Live Layout Preview**: Real-time styling shifts and immediate preview of adjustments.
* **Print-Ready PDF Export**: Tailored print-media styling so exports render as flawless high-fidelity single-page documents.
* **AI ATS Scoring & Feedback**: Estimates ATS keywords matches, score out of 100, and gives recommendations.

### 2. ⚡ AI Placement Trainer
* **Aptitude Section**: Timed tests in Quantitative Reasoning, Logical Reasoning, and Verbal Ability, featuring mathematical, step-by-step explanations.
* **Coding Sandbox Editor**: Live compiler sandbox supporting **Python, Java, C, C++, JavaScript, and SQL** with run-time execution simulations and test case matching.
* **Data Structures & Algorithms (DSA) Sheet**: Standard tracking roadmap categorized by topic, difficulty tags, and top-tier company tags.

### 3. 🎙️ AI Mock Interview Simulator
* **Speech Synthesis & Speech Recognition**: Real-time voice-to-text input (dictation) and spoken audio questions (synthesized voices) for fully conversational mock interview rounds.
* **Flexible Modes**: Technical, HR, and Behavioral question templates.
* **AI Performance Analytics**: Produces thorough performance reviews mapping Communication, Confidence, and Technical scores with improvement plans.

### 4. 💼 Job Matching & Roadmaps
* **Smart Matching**: Suggests internships and full-time listings tailored to resume keywords and aptitude stats.
* **Company-Wise roadmaps**: Visually rich preparation tracks detailing preparation checklists for tech titans (e.g., Google, Amazon, TCS, Razorpay).

### 5. 📊 Student & Admin Dashboards
* **Student Dashboard**: Streak counter, interactive Recharts progress graphs, polar radar placement readiness matrix, and customized notifications.
* **Admin Dashboard**: Manage global platform statistics, append coding/aptitude questions, register jobs, and track users.

### 6. 🔐 Auth System & AI Assistant
* **Role-Based JWT Access**: Differentiated portals for `student`, `recruiter`, and `admin` roles.
* **Floating Glassmorphism AI Bot**: An interactive assistant with real-time typing animation and speech-to-text dictation, offering instant resume advice and interview tips.

---

## 💻 Tech Stack

### Frontend (`/client`)
* **Core**: React.js with TypeScript & Vite (Ultra-fast, stable build cycle)
* **Styling**: Tailwind CSS with custom glassmorphism utilities & CSS variables (Dark/Light mode)
* **Animations**: Framer Motion (premium page transitions and interactive micro-interactions)
* **Analytics**: Recharts (dynamic score history lines & polar radar matrices)
* **Icons**: Lucide React

### Backend (`/server`)
* **Core**: Node.js & Express.js with TypeScript (Strict type safety and MVC organization)
* **Auth**: JWT Authentication (JSON Web Tokens) & Bcrypt (password hashing)
* **Database**: MongoDB & Mongoose ORM (Robust models for schemas)
* **AI Engine**: Node OpenAI SDK (equipped with a **dual-mode fail-safe system** that seamlessly simulates realistic AI answers if no API key is specified).

---

## 📁 Directory Structure

```
Resume Builder/
├── client/
│   ├── src/
│   │   ├── components/      # Common layout blocks (Navbar, ThemeToggle, Toast, FloatingBot)
│   │   ├── pages/           # Pages (Home, About, Features, ResumeBuilder, PlacementTrainer, MockInterview, Dashboard, Jobs, Admin, Pricing, Contact, LoginRegister)
│   │   ├── context/         # React Contexts (AuthContext, ThemeContext)
│   │   ├── index.css        # Styling system, Custom glassmorphic styles
│   │   └── App.tsx          # Main routing & guards
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   └── Dockerfile
├── server/
│   ├── src/
│   │   ├── config/          # DB config, OpenAI client, Seed scripts
│   │   ├── controllers/     # Route logic handlers (Auth, Resume, Placement, Interview, Job, Admin)
│   │   ├── middleware/      # Auth JWT guards, central error handling
│   │   ├── models/          # Mongoose Schemas (User, Resume, Interview, Job, Question, Submission)
│   │   └── server.ts        # App Entrypoint
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml       # Production-ready orchestration
└── README.md                # System documentation
```

---

## 🚀 Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/) (v18 or higher recommended)
* [MongoDB](https://www.mongodb.com/) (Running locally or a MongoDB Atlas URI)
* [Git](https://git-scm.com/download/win) (Required for platform branch synchronization and version control)

### Environment Variables Setup

#### Backend Environment (`/server/.env`)
Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ai_placement_db
JWT_SECRET=supersecret_key_12345_for_local_development
OPENAI_API_KEY=your_openai_api_key_here
```
*Note: If `OPENAI_API_KEY` is left blank, the platform automatically engages its **AI Simulation Mode**, returning high-fidelity mocked evaluations so you can test all features without API costs.*

---

## 🛠️ Installation & Running Locally

### Step 1: Install and Run the Backend Server
1. Navigate to the server folder:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Seed sample aptitude questions, coding challenges, and corporate job postings:
   ```bash
   npm run seed
   ```
4. Start the server in hot-reload development mode:
   ```bash
   npm run dev
   ```
   *The server runs on http://localhost:5000.*

### Step 2: Install and Run the Frontend Client
1. Open a new terminal and navigate to the client folder:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite React client:
   ```bash
   npm run dev
   ```
   *The client runs on http://localhost:3000.*

---

## 🐳 Docker Deployment Setup

We have provided a premium Docker orchestration setup that binds the entire multi-tier SaaS cluster (MongoDB database, Express API server, and Vite React UI client) within a single isolated network.

### Steps to Run with Docker Compose:

1. Ensure **Docker Desktop** is running on your machine.
2. In the root workspace directory, run:
   ```bash
   docker-compose up --build
   ```
3. Docker will automatically assemble the backend server, compile the TypeScript files, download the MongoDB image, and launch the React client.
4. **Access the application**:
   * **Vite React UI Client**: [http://localhost:3000](http://localhost:3000)
   * **Express API Server**: [http://localhost:5000](http://localhost:5000)
5. To shut down the cluster:
   ```bash
   docker-compose down
   ```

---

## 🔐 Admin & Recruiter Fast Login

For demonstration and testing purposes:
* **Admin Mode**: Log in with the email `admin@placement.edu` (any password). The platform will grant full access to the **Admin Dashboard** allowing you to review users, inspect resume scores, and append questions.
* **Student Mock Session**: Logging in with any student email automatically spins up a local session equipped with active mock stats, streaks, and progress history, even if your local database is not connected.
* **Voice Features**: The Voice Mock Interviewer utilizes standard HTML5 browser SpeechSynthesis and Web Speech Recognition. Use a modern browser (Google Chrome, MS Edge, Safari) and grant microphone access when prompted!

---

## 🛡️ Git Installation Notice

If you encounter branch synchronization errors during local development such as:
`Error: exec: "git": executable file not found in %PATH%`

This occurs because the IDE platform's branch orchestration relies on your host machine's Git path to coordinate worktree checkouts. To resolve this:
1. Download and install Git from the official site: [https://git-scm.com/download/win](https://git-scm.com/download/win).
2. During installation, select **"Add Git to PATH"**.
3. **Restart your terminal and editor** to apply the new environment variables, then retry the sync action.
