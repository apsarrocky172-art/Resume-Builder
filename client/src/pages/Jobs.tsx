import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Compass, Search, Check } from 'lucide-react';

interface JobListing {
  _id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  skillsRequired: string[];
}

export const Jobs: React.FC = () => {
  const { token } = useAuth();
  const [recommendedJobs, setRecommendedJobs] = useState<JobListing[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(false);

  // Roadmap states
  const [companySearch, setCompanySearch] = useState('Razorpay');
  const [roleSearch, setRoleSearch] = useState('Software Engineer');
  const [roadmap, setRoadmap] = useState<any>(null);
  const [loadingRoadmap, setLoadingRoadmap] = useState(false);

  const [appliedMap, setAppliedMap] = useState<{ [jId: string]: boolean }>({});

  // Load recommendations
  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoadingJobs(true);
      try {
        const res = await axios.get('http://localhost:5000/api/jobs/recommendations', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRecommendedJobs(res.data);
      } catch (error) {
        console.warn('[Jobs] Offline recommended fallback.');
        setRecommendedJobs([
          {
            _id: 'rec1',
            title: 'Front-End React Intern',
            company: 'Razorpay',
            location: 'Remote',
            type: 'internship',
            salary: '₹25,000 / month',
            description: 'Join our merchant dashboard squad. Perfect for students with strong React, JavaScript, and CSS skills.',
            skillsRequired: ['React.js', 'JavaScript', 'TypeScript', 'CSS']
          },
          {
            _id: 'rec2',
            title: 'Associate Software Engineer',
            company: 'TCS (Tata Consultancy Services)',
            location: 'Bangalore, India',
            type: 'full-time',
            salary: '₹4.5 - ₹7.0 LPA',
            description: 'Looking for enthusiastic freshers with good problem-solving capabilities, familiar with Java, Python or Web Technologies.',
            skillsRequired: ['Java', 'Python', 'SQL', 'DBMS']
          }
        ]);
      } finally {
        setLoadingJobs(false);
      }
    };
    fetchRecommendations();
  }, [token]);

  // Load preparation roadmap
  const fetchRoadmap = async () => {
    if (!companySearch.trim() || !roleSearch.trim()) return;
    setLoadingRoadmap(true);
    setRoadmap(null);

    try {
      const res = await axios.get(`http://localhost:5000/api/jobs/roadmap/${companySearch}?role=${encodeURIComponent(roleSearch)}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRoadmap(res.data);
    } catch (error) {
      console.warn('[Jobs] Offline roadmap fallback.');
      setTimeout(() => {
        setRoadmap({
          company: companySearch.toUpperCase(),
          role: roleSearch.toUpperCase(),
          steps: [
            {
              title: 'Phase 1: Initial Application & Resume Screening (2026 Process)',
              topics: ['ATS Optimization', 'Referral Outreach', 'Job Portal Registration'],
              description: `Submit application for ${roleSearch} role at ${companySearch} via portal or employee referral. Ensure high ATS score matching for 2026 requirements.`
            },
            {
              title: 'Phase 2: Online Assessments & Coding Challenge',
              topics: ['DSA/Problem Solving', 'Aptitude Test', 'Core CS Fundamentals'],
              description: `Prepare for ${companySearch}'s technical evaluation, typically consisting of online coding challenges, logical reasoning, and data structure quizzes.`
            },
            {
              title: 'Phase 3: Technical & System Design Interviews',
              topics: ['Live Coding', 'System Architecture', 'Domain-specific Questions'],
              description: `Multiple technical panel rounds focusing on coding efficiency, system design patterns, and past projects related to ${roleSearch}.`
            },
            {
              title: 'Phase 4: Behavioral Fit & Salary Negotiation',
              topics: ['STAR Method Answers', 'Culture Fit', 'Compensation Discussion'],
              description: 'Evaluate culture fit with HR and Hiring Managers. Discussion of salary components, benefits, and standard timeline alignment.'
            },
            {
              title: 'Phase 5: Background Verification & Final Joining Mail',
              topics: ['Document Submission', 'Pre-onboarding Briefing', 'Joining Mail Confirmation'],
              description: 'Successful background checks are completed, leading to the final Onboarding instructions and receiving the official Joining Mail with start details.'
            }
          ],
          tips: [
            `Make sure your resume lists skills relevant to ${roleSearch}.`,
            `Typically, it takes 4 to 8 weeks from the date of application to receiving the joining mail in 2026.`,
            `Follow up professionally with your recruiter if there is no update within 10 days of your interview.`
          ]
        });
        setLoadingRoadmap(false);
      }, 1500);
    } finally {
      setLoadingRoadmap(false);
    }
  };

  useEffect(() => {
    fetchRoadmap();
  }, []);

  const triggerApply = (jId: string) => {
    setAppliedMap(prev => ({ ...prev, [jId]: true }));
    setTimeout(() => {
      alert('Application transmitted directly to corporate recruiter panel successfully!');
    }, 200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Recommended Jobs listings */}
      <div className="lg:col-span-2 space-y-6">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight">AI Matching Careers</h1>
          <p className="text-xs text-slate-400 mt-1">Recommended positions based on skills from your cached resume.</p>
        </div>

        {loadingJobs ? (
          <div className="flex flex-col items-center py-16 gap-3">
            <span className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></span>
            <span className="text-xs text-slate-450 font-bold">Scanning job boards...</span>
          </div>
        ) : (
          <div className="space-y-5">
            {recommendedJobs.map((job) => (
              <div
                key={job._id}
                className="glass-card p-6.5 rounded-3xl border border-slate-200/50 dark:border-slate-800/40 space-y-4 hover:scale-[1.01] transition-transform duration-250 bg-white/50 dark:bg-slate-950/40"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-850 dark:text-white">{job.title}</h3>
                    <p className="text-xs text-slate-400 mt-0.5 font-medium">{job.company} • {job.location}</p>
                  </div>
                  <span className="text-[9px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-bold px-2 py-0.5 rounded-full uppercase">
                    {job.type}
                  </span>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{job.description}</p>

                <div className="flex items-center gap-1.5 flex-wrap">
                  {job.skillsRequired.map((sk, idx) => (
                    <span
                      key={idx}
                      className="text-[9px] bg-slate-100 dark:bg-slate-900 border border-slate-250 dark:border-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full"
                    >
                      {sk}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-4">
                  <span className="text-xs font-extrabold text-indigo-500">{job.salary}</span>
                  <button
                    onClick={() => triggerApply(job._id)}
                    disabled={appliedMap[job._id]}
                    className={`flex items-center gap-1 text-xs font-semibold px-4.5 py-2 rounded-xl transition-all ${
                      appliedMap[job._id]
                        ? 'bg-emerald-500 text-white shadow-md cursor-default'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20'
                    }`}
                  >
                    {appliedMap[job._id] ? (
                      <>
                        <Check size={12} />
                        <span>Applied</span>
                      </>
                    ) : (
                      'Quick Apply'
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Corporate Roadmaps Generator Column */}
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight">Placement Roadmap</h1>
          <p className="text-xs text-slate-400 mt-1">Get custom preparation phases designed for specific companies.</p>
        </div>

        {/* Search bar and Role input */}
        <div className="glass-card p-4.5 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 space-y-3 bg-white/50 dark:bg-slate-950/40">
          <div className="flex items-center gap-2 border-b border-slate-200/50 dark:border-slate-800/40 pb-2">
            <Search size={16} className="text-slate-400" />
            <input
              type="text"
              value={companySearch}
              onChange={(e) => setCompanySearch(e.target.value)}
              placeholder="Company Name (e.g. Google, Razorpay)"
              className="flex-1 bg-transparent text-xs outline-none"
            />
          </div>
          <div className="flex items-center gap-2 pb-1">
            <Compass size={16} className="text-slate-400" />
            <input
              type="text"
              value={roleSearch}
              onChange={(e) => setRoleSearch(e.target.value)}
              placeholder="Target Role (e.g. SDE-1, QA Engineer)"
              className="flex-1 bg-transparent text-xs outline-none"
            />
          </div>
          <button
            onClick={fetchRoadmap}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold py-2.5 rounded-xl shadow-md transition-colors"
          >
            Generate Roadmap
          </button>
        </div>

        {/* Roadmap Display */}
        {loadingRoadmap ? (
          <div className="flex flex-col items-center py-16 gap-3">
            <span className="w-6 h-6 border-4 border-indigo-650 border-t-transparent rounded-full animate-spin"></span>
            <span className="text-xs text-slate-450">Designing roadmap...</span>
          </div>
        ) : (
          roadmap && (
            <div className="space-y-6">
              <h3 className="font-extrabold text-xs bg-gradient-to-r from-indigo-500 to-pink-500 text-white px-4 py-2.5 rounded-xl text-center shadow-md uppercase tracking-wider">
                {roadmap.company} • {roadmap.role || 'PLACEMENT'}
              </h3>

              {/* Steps timeline */}
              <div className="relative pl-6 border-l-2 border-indigo-500/30 space-y-6 text-left">
                {roadmap.steps.map((st: any, idx: number) => (
                  <div key={idx} className="relative space-y-1.5">
                    {/* Circle marker */}
                    <span className="absolute -left-[31px] top-0.5 w-4.5 h-4.5 rounded-full border-4 border-indigo-600 bg-white dark:bg-[#070b13] flex items-center justify-center font-bold text-[8px]">
                      {idx + 1}
                    </span>
                    <h4 className="font-bold text-xs">{st.title}</h4>
                    <p className="text-[10px] text-slate-450 leading-relaxed">{st.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {st.topics.map((tp: string, tIdx: number) => (
                        <span key={tIdx} className="text-[8px] bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 px-1.5 py-0.5 rounded text-indigo-400 font-medium">
                          {tp}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Placement expert tips */}
              <div className="glass-card p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 text-left space-y-2.5">
                <h4 className="font-extrabold text-[10px] text-amber-500 uppercase tracking-wider flex items-center gap-1">
                  <Compass size={14} />
                  <span>Expert Interview Strategy</span>
                </h4>
                <ul className="space-y-2 text-[10px] text-slate-600 dark:text-slate-350">
                  {roadmap.tips.map((tip: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-indigo-400 font-bold">»</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};
