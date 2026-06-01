import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Award, Zap, BookOpen, MessageSquare, Briefcase, ChevronRight, User as UserIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();

  // Sample analytics history for line charts
  const testHistory = [
    { name: 'Test 1', score: 60 },
    { name: 'Test 2', score: 68 },
    { name: 'Test 3', score: 75 },
    { name: 'Test 4', score: 82 },
    { name: 'Test 5', score: 90 },
  ];

  // Radar metrics showing aptitude, communications, coding
  const readinessMetrics = [
    { subject: 'Quantitative', A: 85, fullMark: 100 },
    { subject: 'Logical Reasoning', A: 92, fullMark: 100 },
    { subject: 'Verbal Ability', A: 78, fullMark: 100 },
    { subject: 'Coding Accuracy', A: 88, fullMark: 100 },
    { subject: 'Oral Communication', A: 80, fullMark: 100 },
  ];

  const recentJobs = [
    { title: 'Front-End React Intern', company: 'Razorpay', location: 'Remote', salary: '₹25,000 / month' },
    { title: 'Associate Software Engineer', company: 'TCS', location: 'Bangalore', salary: '₹4.5 - ₹7.0 LPA' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header card info */}
      <div className="glass-card p-6.5 rounded-3xl border border-slate-200/50 dark:border-slate-800/40 flex flex-col md:flex-row items-center justify-between gap-6 bg-white/50 dark:bg-slate-950/40">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-tr from-indigo-500 to-pink-500 text-white p-4.5 rounded-2xl glow-ring">
            <UserIcon size={24} />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold tracking-tight">Welcome Back, {user?.name || 'Apsara'}!</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Profile Role: <span className="capitalize font-semibold text-indigo-500">{user?.role || 'student'}</span> | Keep coding to maintain your placement readiness score.</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="text-center">
            <div className="text-lg font-extrabold text-indigo-500">89%</div>
            <div className="text-[10px] text-slate-400 font-bold uppercase">ATS score</div>
          </div>
          <div className="border-l border-slate-200 dark:border-slate-800 pl-4 text-center">
            <div className="text-lg font-extrabold text-pink-500">5 Days</div>
            <div className="text-[10px] text-slate-400 font-bold uppercase">Coding Streak</div>
          </div>
        </div>
      </div>

      {/* Primary Analytics grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Stat Widgets & Job Matches */}
        <div className="lg:col-span-2 space-y-8">
          {/* Bento grid widgets */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="glass-card p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 flex items-center gap-3">
              <div className="p-3 bg-pink-100 dark:bg-pink-950/40 text-pink-500 rounded-xl">
                <Award size={18} />
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-bold uppercase">Resume Rating</div>
                <div className="text-sm font-extrabold mt-0.5">89/100</div>
              </div>
            </div>

            <div className="glass-card p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 flex items-center gap-3">
              <div className="p-3 bg-indigo-100 dark:bg-indigo-950/40 text-indigo-500 rounded-xl">
                <BookOpen size={18} />
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-bold uppercase">Mock Exams</div>
                <div className="text-sm font-extrabold mt-0.5">5 Completed</div>
              </div>
            </div>

            <div className="glass-card p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 flex items-center gap-3">
              <div className="p-3 bg-purple-100 dark:bg-purple-950/40 text-purple-500 rounded-xl">
                <MessageSquare size={18} />
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-bold uppercase">AI Interviews</div>
                <div className="text-sm font-extrabold mt-0.5">3 Concluded</div>
              </div>
            </div>
          </div>

          {/* Test Performance Line Chart */}
          <div className="glass-card p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/40">
            <h3 className="font-extrabold text-sm mb-4">Aptitude Score History</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={testHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                  <XAxis dataKey="name" stroke="#9ca3af" fontSize={11} />
                  <YAxis stroke="#9ca3af" fontSize={11} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(15, 23, 42, 0.9)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      fontSize: '11px'
                    }}
                  />
                  <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Smart Job Matchings */}
          <div className="glass-card p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/40 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm flex items-center gap-2">
                <Briefcase size={16} className="text-pink-500" />
                <span>AI Personalized Jobs Matching</span>
              </h3>
              <Link to="/jobs" className="text-xs font-semibold text-indigo-500 flex items-center gap-1">
                <span>View All</span>
                <ChevronRight size={14} />
              </Link>
            </div>
            <div className="divide-y divide-slate-200/50 dark:divide-slate-800/40">
              {recentJobs.map((job, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between first:pt-0 last:pb-0">
                  <div>
                    <h4 className="font-bold text-xs">{job.title}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">{job.company} • {job.location}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-emerald-500">{job.salary}</span>
                    <button className="block text-[9px] bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-md mt-1 font-bold">Apply</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Skill Readiness Chart & Quick Roadmaps */}
        <div className="space-y-8">
          {/* Radar readiness chart */}
          <div className="glass-card p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/40 flex flex-col items-center">
            <h3 className="font-extrabold text-sm mb-4 self-start">Placement Readiness Matrix</h3>
            <div className="h-64 w-full flex justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={readinessMetrics}>
                  <PolarGrid stroke="#9ca3af" opacity={0.2} />
                  <PolarAngleAxis dataKey="subject" stroke="#9ca3af" fontSize={9} />
                  <PolarRadiusAxis stroke="#9ca3af" fontSize={8} />
                  <Radar name="Readiness" dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Core Next Steps Checklist */}
          <div className="glass-card p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/40 space-y-4">
            <h3 className="font-extrabold text-sm flex items-center gap-1.5">
              <Zap size={16} className="text-amber-400" />
              <span>Your Placement To-Do Today</span>
            </h3>
            <ul className="space-y-3.5">
              <li className="flex items-start gap-2.5">
                <input type="checkbox" defaultChecked className="rounded border-slate-300 dark:border-slate-700 bg-transparent text-indigo-600 focus:ring-indigo-500 mt-1" />
                <div>
                  <div className="text-xs font-bold line-through text-slate-400">Complete quantitative reasoning mock test</div>
                  <div className="text-[10px] text-slate-400">Scored 90% (quant post-check correct)</div>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <input type="checkbox" className="rounded border-slate-300 dark:border-slate-700 bg-transparent text-indigo-600 focus:ring-indigo-500 mt-1" />
                <div>
                  <div className="text-xs font-bold">Write code challenge in Two Sum algorithm</div>
                  <div className="text-[10px] text-slate-400">Practicing under Python/JS environments</div>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <input type="checkbox" className="rounded border-slate-300 dark:border-slate-700 bg-transparent text-indigo-600 focus:ring-indigo-500 mt-1" />
                <div>
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-300">Complete stateful technical mock interview round</div>
                  <div className="text-[10px] text-slate-400">Oral speech synthesis mock feedback metrics</div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
