import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Award, Download, CheckCircle, Plus, Trash2, ArrowRight, ArrowLeft } from 'lucide-react';

interface ResumeData {
  templateId: string;
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    linkedin: string;
    portfolio: string;
    careerObjective: string;
    summary: string;
  };
  education: Array<{ institution: string; degree: string; year: string; gpa: string }>;
  experience: Array<{ company: string; role: string; duration: string; description: string }>;
  projects: Array<{ title: string; description: string; technologies: string; link: string }>;
  skills: string;
  certifications: string;
  achievements: string;
}

// Ensure JSX intrinsic elements exist for projects where TSX config may not provide them
declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

interface AtsRatingDetails {
  label: string;
  emoji: string;
  colorClass: string;
  bgClass: string;
  borderClass: string;
  circleBorderClass: string;
  bgBarClass: string;
}

const getAtsRating = (score: number): AtsRatingDetails => {
  if (score <= 20) {
    return {
      label: 'Very Poor (Needs major improvement)',
      emoji: '❌',
      colorClass: 'text-red-500 dark:text-red-405',
      bgClass: 'bg-red-500/10',
      borderClass: 'border-red-500/25',
      circleBorderClass: 'border-red-500',
      bgBarClass: 'bg-red-500'
    };
  }
  if (score <= 40) {
    return {
      label: 'Poor (Below average)',
      emoji: '⚠️',
      colorClass: 'text-orange-500 dark:text-orange-405',
      bgClass: 'bg-orange-500/10',
      borderClass: 'border-orange-500/25',
      circleBorderClass: 'border-orange-500',
      bgBarClass: 'bg-orange-500'
    };
  }
  if (score <= 60) {
    return {
      label: 'Average (Acceptable but needs improvement)',
      emoji: '👍',
      colorClass: 'text-yellow-500 dark:text-yellow-405',
      bgClass: 'bg-yellow-500/10',
      borderClass: 'border-yellow-500/25',
      circleBorderClass: 'border-yellow-500',
      bgBarClass: 'bg-yellow-500'
    };
  }
  if (score <= 75) {
    return {
      label: 'Good (Suitable for many applications)',
      emoji: '✅',
      colorClass: 'text-lime-500 dark:text-lime-405',
      bgClass: 'bg-lime-500/10',
      borderClass: 'border-lime-500/25',
      circleBorderClass: 'border-lime-500',
      bgBarClass: 'bg-lime-500'
    };
  }
  if (score <= 90) {
    return {
      label: 'Strong (Highly ATS-friendly)',
      emoji: '💪',
      colorClass: 'text-green-500 dark:text-green-405',
      bgClass: 'bg-green-500/10',
      borderClass: 'border-green-500/25',
      circleBorderClass: 'border-green-500',
      bgBarClass: 'bg-green-500'
    };
  }
  return {
    label: 'Very Strong (Excellent, interview-ready)',
    emoji: '🏆',
    colorClass: 'text-emerald-500 dark:text-emerald-405',
    bgClass: 'bg-emerald-500/10',
    borderClass: 'border-emerald-500/25',
    circleBorderClass: 'border-emerald-500',
    bgBarClass: 'bg-emerald-500'
  };
};

const getSubScoreColorClass = (percentage: number): string => {
  if (percentage <= 20) return 'bg-red-500';
  if (percentage <= 40) return 'bg-orange-500';
  if (percentage <= 60) return 'bg-yellow-500';
  if (percentage <= 75) return 'bg-lime-500';
  if (percentage <= 90) return 'bg-green-500';
  return 'bg-emerald-500';
};

const extractTextFromPdf = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = async (e) => {
      const typedarray = new Uint8Array(e.target?.result as ArrayBuffer);
      try {
        if (!(window as any).pdfjsLib) {
          await new Promise<void>((res, rej) => {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js';
            script.onload = () => res();
            script.onerror = () => rej(new Error('Failed to load PDF.js library from CDN.'));
            document.head.appendChild(script);
          });
        }
        
        const pdfjsLib = (window as any).pdfjsLib;
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
        
        const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
        let text = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const strings = content.items.map((item: any) => item.str);
          text += strings.join(' ') + '\n';
        }
        resolve(text);
      } catch (err) {
        reject(err);
      }
    };
    fileReader.onerror = () => reject(new Error('FileReader error'));
    fileReader.readAsArrayBuffer(file);
  });
};

export const ResumeBuilder: React.FC = () => {
  const { token, updateUserSkills } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [template, setTemplate] = useState('modern');
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  // ATS Analysis feedback states
  const [atsScore, setAtsScore] = useState<number | null>(null);
  const [atsFeedback, setAtsFeedback] = useState<any>(null);

  // Standalone Tester states
  const [testerMode, setTesterMode] = useState<'built' | 'external'>('built');
  const [externalText, setExternalText] = useState('');
  const [externalScore, setExternalScore] = useState<number | null>(null);
  const [externalFeedback, setExternalFeedback] = useState<any>(null);
  const [testingExternal, setTestingExternal] = useState(false);
  const [uploadMethod, setUploadMethod] = useState<'file' | 'paste'>('file');
  const [fileName, setFileName] = useState('');

  // Core resume state pre-populated with beautiful starter sample data
  const [resume, setResume] = useState<ResumeData>({
    templateId: 'modern',
    personalInfo: {
      name: 'Alex Johnson',
      email: 'alex.johnson@university.edu',
      phone: '+1 (800) 456-7890',
      linkedin: 'linkedin.com/in/alexjohnson',
      portfolio: 'alexjohnson.dev',
      careerObjective: 'Motivated Computer Science graduate seeking SDE-1 opportunities to build highly scalable frontend & backend platforms.',
      summary: 'Aspiring Full-Stack Software Engineer with robust knowledge in React.js, modern CSS, database design, and Express microservices.'
    },
    education: [
      { institution: 'National Institute of Technology', degree: 'B.Tech in Computer Science', year: '2022 - 2026', gpa: '9.2 CGPA' }
    ],
    experience: [
      { company: 'Razorpay', role: 'Front-End React Intern', duration: 'May 2025 - July 2025', description: 'Assisted in modernizing merchant onboarding flows. Leveraged styled CSS elements reducing page bounce by 15%.' }
    ],
    projects: [
      { title: 'AI Mock Interview Simulator', description: 'Built an interactive voice-to-text assessment platform using Web Speech tools and OpenAI chatbot routing.', technologies: 'React, TypeScript, Express, MongoDB', link: 'github.com/alex/interview-ai' }
    ],
    skills: 'React.js, JavaScript, TypeScript, Node.js, Express, SQL, MongoDB, Tailwind CSS, Git',
    certifications: 'AWS Cloud Practitioner, Oracle Certified SQL Associate',
    achievements: 'Ranked 45th in College Hackathon, 300+ Solved Challenges on LeetCode'
  });

  const steps = [
    { name: 'Personal Details' },
    { name: 'Academics & Jobs' },
    { name: 'Projects & Skills' },
    { name: 'ATS Evaluator' }
  ];

  // Load user's saved resume if it exists
  useEffect(() => {
    const fetchResume = async () => {
      if (!token) return;
      try {
        const res = await axios.get('http://localhost:5000/api/resumes', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data) {
          // split arrays back into comma strings for the form input
          const loadedResume = {
            ...res.data,
            skills: Array.isArray(res.data.skills) ? res.data.skills.join(', ') : res.data.skills,
            certifications: Array.isArray(res.data.certifications) ? res.data.certifications.join(', ') : res.data.certifications,
            achievements: Array.isArray(res.data.achievements) ? res.data.achievements.join(', ') : res.data.achievements,
          };
          setResume(loadedResume);
          if (res.data.resumeScore) {
            setAtsScore(res.data.resumeScore);
            setAtsFeedback(res.data.atsFeedback);
          }
        }
      } catch (error) {
        console.log('[ResumeBuilder] Offline mode / no resume found. Using local template starter state.');
      }
    };
    fetchResume();
  }, [token]);

  const handlePersonalInfo = (key: string, value: string) => {
    setResume(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [key]: value }
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    // Parse commas to arrays
    const payload = {
      ...resume,
      templateId: template,
      skills: resume.skills.split(',').map(s => s.trim()).filter(Boolean),
      certifications: resume.certifications.split(',').map(c => c.trim()).filter(Boolean),
      achievements: resume.achievements.split(',').map(a => a.trim()).filter(Boolean),
    };

    try {
      await axios.post('http://localhost:5000/api/resumes', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      updateUserSkills(payload.skills);
      alert('Resume saved to Cloud Database successfully!');
    } catch (error: any) {
      console.error('[ResumeBuilder] Save error:', error);
      alert(error.response?.data?.message || 'Failed to save resume. Please make sure the database is running and RLS is disabled on the resumes table.');
    } finally {
      setLoading(false);
    }
  };

  const triggerAtsEvaluation = async () => {
    setAnalyzing(true);
    try {
      const res = await axios.post('http://localhost:5000/api/resumes/analyze', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAtsScore(res.data.resumeScore);
      setAtsFeedback(res.data.atsFeedback);
    } catch (error: any) {
      console.error('[ResumeBuilder] Analysis error:', error);
      alert(error.response?.data?.message || 'Failed to analyze resume. Make sure you click Save Progress first, and check if Ollama is running.');
    } finally {
      setAnalyzing(false);
    }
  };

  const triggerExternalAtsTest = async () => {
    if (!externalText.trim()) {
      alert('Please enter or upload your resume text first.');
      return;
    }
    setTestingExternal(true);
    try {
      const res = await axios.post('http://localhost:5000/api/resumes/analyze', {
        resumeText: externalText
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setExternalScore(res.data.resumeScore);
      setExternalFeedback(res.data.atsFeedback);
    } catch (error: any) {
      console.error('[ResumeBuilder] External analysis error:', error);
      alert(error.response?.data?.message || 'Failed to analyze external resume. Verify backend server is running and Ollama is active.');
    } finally {
      setTestingExternal(false);
    }
  };

  const handleExternalFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      alert('Please select a valid PDF file.');
      return;
    }
    setFileName(file.name);
    setTestingExternal(true);
    try {
      const text = await extractTextFromPdf(file);
      setExternalText(text || '');
    } catch (error) {
      console.error('[PDF Extraction Error]:', error);
      alert('Failed to extract text from the PDF file. Please copy-paste the text directly or try another PDF.');
    } finally {
      setTestingExternal(false);
    }
  };

  const exportPDF = () => {
    window.print();
  };

  // Helper lists adder/removers
  const addEducation = () => {
    setResume(prev => ({
      ...prev,
      education: [...prev.education, { institution: '', degree: '', year: '', gpa: '' }]
    }));
  };

  const removeEducation = (index: number) => {
    setResume(prev => ({
      ...prev,
      education: prev.education.filter((_, idx) => idx !== index)
    }));
  };

  const addExperience = () => {
    setResume(prev => ({
      ...prev,
      experience: [...prev.experience, { company: '', role: '', duration: '', description: '' }]
    }));
  };

  const removeExperience = (index: number) => {
    setResume(prev => ({
      ...prev,
      experience: prev.experience.filter((_, idx) => idx !== index)
    }));
  };

  const addProject = () => {
    setResume(prev => ({
      ...prev,
      projects: [...prev.projects, { title: '', description: '', technologies: '', link: '' }]
    }));
  };

  const removeProject = (index: number) => {
    setResume(prev => ({
      ...prev,
      projects: prev.projects.filter((_, idx) => idx !== index)
    }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 lg:grid-cols-2 gap-8 print:p-0 print:block">
      {/* LEFT COLUMN: Input Forms & Steps */}
      <div className="space-y-6 print:hidden">
        {/* Title row */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">AI Resume Canvas</h1>
            <p className="text-xs text-slate-400">Design Canva-grade templates with real-time ATS optimization.</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-md transition-colors"
            >
              {loading ? 'Saving...' : 'Save Progress'}
            </button>
            <button
              onClick={exportPDF}
              className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold px-4 py-2 rounded-xl shadow-md transition-colors flex items-center gap-1.5"
            >
              <Download size={14} />
              <span>Export PDF</span>
            </button>
          </div>
        </div>

        {/* Step indicator */}
        <div className="flex justify-between items-center bg-slate-100 dark:bg-slate-950/60 p-3 rounded-2xl border border-slate-200/50 dark:border-slate-850">
          {steps.map((st, idx) => (
            <button
              key={idx}
              onClick={() => setActiveStep(idx)}
              className={`text-center flex-1 py-2 rounded-xl text-[10px] font-bold transition-all ${
                activeStep === idx
                  ? 'bg-gradient-to-tr from-indigo-500 to-pink-500 text-white shadow-md'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              {st.name}
            </button>
          ))}
        </div>

        {/* Form panel body */}
        <div className="glass-card p-6.5 rounded-3xl border border-slate-200/50 dark:border-slate-800/40 space-y-6">
          {/* STEP 0: Personal details */}
          {activeStep === 0 && (
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-indigo-400">Contact & Objective</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Full Name</label>
                  <input
                    type="text"
                    value={resume.personalInfo.name}
                    onChange={(e) => handlePersonalInfo('name', e.target.value)}
                    placeholder="Alex Johnson"
                    className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Email Address</label>
                  <input
                    type="email"
                    value={resume.personalInfo.email}
                    onChange={(e) => handlePersonalInfo('email', e.target.value)}
                    placeholder="alex.johnson@university.edu"
                    className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Phone Number</label>
                  <input
                    type="text"
                    value={resume.personalInfo.phone}
                    onChange={(e) => handlePersonalInfo('phone', e.target.value)}
                    className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4.5 py-3 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">LinkedIn Profile</label>
                  <input
                    type="text"
                    value={resume.personalInfo.linkedin}
                    onChange={(e) => handlePersonalInfo('linkedin', e.target.value)}
                    placeholder="linkedin.com/in/alexjohnson"
                    className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4.5 py-3 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Portfolio Link</label>
                  <input
                    type="text"
                    value={resume.personalInfo.portfolio}
                    onChange={(e) => handlePersonalInfo('portfolio', e.target.value)}
                    placeholder="alexjohnson.dev"
                    className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4.5 py-3 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Career Objective</label>
                <textarea
                  rows={2}
                  value={resume.personalInfo.careerObjective}
                  onChange={(e) => handlePersonalInfo('careerObjective', e.target.value)}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4.5 py-3 outline-none resize-none"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">Professional Summary</label>
                  {atsFeedback?.optimizedSummary && (
                    <button
                      type="button"
                      onClick={() => handlePersonalInfo('summary', atsFeedback.optimizedSummary)}
                      className="text-[9px] font-bold text-indigo-500 hover:underline flex items-center gap-0.5"
                    >
                      ✓ Apply AI Optimization
                    </button>
                  )}
                </div>
                <textarea
                  rows={3}
                  value={resume.personalInfo.summary}
                  onChange={(e) => handlePersonalInfo('summary', e.target.value)}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4.5 py-3 outline-none resize-none"
                />
              </div>
            </div>
          )}

          {/* STEP 1: Academics & Jobs */}
          {activeStep === 1 && (
            <div className="space-y-6">
              {/* Academics section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-indigo-400">Education Details</h3>
                  <button onClick={addEducation} className="text-xs font-semibold text-indigo-500 flex items-center gap-0.5 hover:underline">
                    <Plus size={14} /> Add
                  </button>
                </div>
                {resume.education.map((edu, idx) => (
                  <div key={idx} className="p-4 bg-slate-100/50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-850 rounded-2xl relative space-y-3">
                    {idx > 0 && (
                      <button onClick={() => removeEducation(idx)} className="absolute top-3 right-3 text-red-500 hover:text-red-600">
                        <Trash2 size={16} />
                      </button>
                    )}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Institution</label>
                        <input
                          type="text"
                          value={edu.institution}
                          onChange={(e) => {
                            const newEdu = [...resume.education];
                            newEdu[idx].institution = e.target.value;
                            setResume({ ...resume, education: newEdu });
                          }}
                          className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Degree / Course</label>
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => {
                            const newEdu = [...resume.education];
                            newEdu[idx].degree = e.target.value;
                            setResume({ ...resume, education: newEdu });
                          }}
                          className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Duration Year</label>
                        <input
                          type="text"
                          value={edu.year}
                          onChange={(e) => {
                            const newEdu = [...resume.education];
                            newEdu[idx].year = e.target.value;
                            setResume({ ...resume, education: newEdu });
                          }}
                          className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">GPA / Marks</label>
                        <input
                          type="text"
                          value={edu.gpa}
                          onChange={(e) => {
                            const newEdu = [...resume.education];
                            newEdu[idx].gpa = e.target.value;
                            setResume({ ...resume, education: newEdu });
                          }}
                          className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Jobs section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-indigo-400">Work Experience</h3>
                  <button onClick={addExperience} className="text-xs font-semibold text-indigo-500 flex items-center gap-0.5 hover:underline">
                    <Plus size={14} /> Add
                  </button>
                </div>
                {resume.experience.map((exp, idx) => (
                  <div key={idx} className="p-4 bg-slate-100/50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-850 rounded-2xl relative space-y-3">
                    <button onClick={() => removeExperience(idx)} className="absolute top-3 right-3 text-red-500 hover:text-red-600">
                      <Trash2 size={16} />
                    </button>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Company</label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => {
                            const newExp = [...resume.experience];
                            newExp[idx].company = e.target.value;
                            setResume({ ...resume, experience: newExp });
                          }}
                          className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Job Role</label>
                        <input
                          type="text"
                          value={exp.role}
                          onChange={(e) => {
                            const newExp = [...resume.experience];
                            newExp[idx].role = e.target.value;
                            setResume({ ...resume, experience: newExp });
                          }}
                          className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Duration</label>
                      <input
                        type="text"
                        value={exp.duration}
                        onChange={(e) => {
                          const newExp = [...resume.experience];
                          newExp[idx].duration = e.target.value;
                          setResume({ ...resume, experience: newExp });
                        }}
                        placeholder="e.g. May 2025 - July 2025"
                        className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Description / Responsibilities</label>
                      <textarea
                        rows={2}
                        value={exp.description}
                        onChange={(e) => {
                          const newExp = [...resume.experience];
                          newExp[idx].description = e.target.value;
                          setResume({ ...resume, experience: newExp });
                        }}
                        className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 outline-none resize-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Projects & Skills */}
          {activeStep === 2 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-indigo-400">Technical Projects</h3>
                  <button onClick={addProject} className="text-xs font-semibold text-indigo-500 flex items-center gap-0.5 hover:underline">
                    <Plus size={14} /> Add
                  </button>
                </div>
                {resume.projects.map((proj, idx) => (
                  <div key={idx} className="p-4 bg-slate-100/50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-850 rounded-2xl relative space-y-3">
                    <button onClick={() => removeProject(idx)} className="absolute top-3 right-3 text-red-500 hover:text-red-600">
                      <Trash2 size={16} />
                    </button>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Project Title</label>
                        <input
                          type="text"
                          value={proj.title}
                          onChange={(e) => {
                            const newProj = [...resume.projects];
                            newProj[idx].title = e.target.value;
                            setResume({ ...resume, projects: newProj });
                          }}
                          className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">GitHub / Demo Link</label>
                        <input
                          type="text"
                          value={proj.link}
                          onChange={(e) => {
                            const newProj = [...resume.projects];
                            newProj[idx].link = e.target.value;
                            setResume({ ...resume, projects: newProj });
                          }}
                          className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Technologies Used (Commas)</label>
                        <input
                          type="text"
                          value={proj.technologies}
                          onChange={(e) => {
                            const newProj = [...resume.projects];
                            newProj[idx].technologies = e.target.value;
                            setResume({ ...resume, projects: newProj });
                          }}
                          placeholder="e.g. React, Node.js, Express"
                          className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Description</label>
                        <textarea
                          rows={2}
                          value={proj.description}
                          onChange={(e) => {
                            const newProj = [...resume.projects];
                            newProj[idx].description = e.target.value;
                            setResume({ ...resume, projects: newProj });
                          }}
                          className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 outline-none resize-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Skills and Certs */}
              <div className="space-y-4">
                <h3 className="font-bold text-sm text-indigo-400">Skills & Highlights</h3>
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1.5">Core Technical Skills (Commas)</label>
                  <input
                    type="text"
                    value={resume.skills}
                    onChange={(e) => setResume({ ...resume, skills: e.target.value })}
                    placeholder="React, JavaScript, Express, Docker"
                    className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4.5 py-3 outline-none"
                  />
                  {atsFeedback?.skillSuggestions && (
                    <div className="mt-2 text-[10px] text-indigo-500 font-semibold flex items-center gap-1 flex-wrap">
                      <span>AI Suggestions:</span>
                      {atsFeedback.skillSuggestions.map((s: string, idx: number) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setResume({ ...resume, skills: resume.skills ? `${resume.skills}, ${s}` : s })}
                          className="bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-500/20 px-2 py-0.5 rounded-full hover:bg-indigo-100 transition-colors"
                        >
                          + {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1.5">Certifications (Commas)</label>
                  <input
                    type="text"
                    value={resume.certifications}
                    onChange={(e) => setResume({ ...resume, certifications: e.target.value })}
                    className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4.5 py-3 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1.5">Achievements (Commas)</label>
                  <input
                    type="text"
                    value={resume.achievements}
                    onChange={(e) => setResume({ ...resume, achievements: e.target.value })}
                    className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4.5 py-3 outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: ATS Evaluator */}
          {activeStep === 3 && (
            <div className="space-y-6 text-center">
              {/* Scan Mode Toggle Tab */}
              <div className="flex justify-center border-b border-slate-200 dark:border-slate-800 pb-1.5 max-w-md mx-auto mb-2 print:hidden">
                <button
                  type="button"
                  onClick={() => setTesterMode('built')}
                  className={`px-4 py-2 text-[11px] font-extrabold transition-all border-b-2 ${
                    testerMode === 'built'
                      ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                      : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Scan Built Resume
                </button>
                <button
                  type="button"
                  onClick={() => setTesterMode('external')}
                  className={`px-4 py-2 text-[11px] font-extrabold transition-all border-b-2 ${
                    testerMode === 'external'
                      ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                      : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  ATS Resume Tester (Upload/Paste)
                </button>
              </div>

              <div className="max-w-md mx-auto space-y-4">
                {/* MODE A: SCAN BUILT RESUME */}
                {testerMode === 'built' && (
                  <>
                    <div className="p-4 bg-gradient-to-r from-indigo-500/10 to-pink-500/10 border border-indigo-500/25 rounded-2xl flex items-center justify-between">
                      <div className="text-left">
                        <h4 className="font-extrabold text-sm flex items-center gap-1.5">
                          <Award size={16} className="text-indigo-500" />
                          <span>ATS Quality Scan</span>
                        </h4>
                        <p className="text-[10px] text-slate-400 mt-1">Review keyword alignment against SDE standards.</p>
                      </div>
                      <button
                        onClick={triggerAtsEvaluation}
                        disabled={analyzing}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md transition-all disabled:opacity-50"
                      >
                        {analyzing ? 'Evaluating...' : 'Run Scan'}
                      </button>
                    </div>

                    {atsScore === null && !analyzing && (
                      <div className="glass-card p-5 rounded-3xl border border-slate-200/50 dark:border-slate-800/40 text-left space-y-4 bg-white/40 dark:bg-slate-950/20 backdrop-blur-sm">
                        {/* Qualification Alert */}
                        <div className="p-3 bg-amber-500/10 border border-amber-500/25 rounded-2xl flex items-start gap-2">
                          <span className="text-amber-500 text-sm mt-0.5">⚠️</span>
                          <div>
                            <h5 className="font-extrabold text-xs text-amber-600 dark:text-amber-400">70% Placement Target Requirement</h5>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">A minimum ATS score of <strong>70% is mandatory</strong> to qualify for corporate recruitment referrals.</p>
                          </div>
                        </div>

                        {/* Weight Breakdown */}
                        <div className="space-y-2">
                          <h5 className="font-extrabold text-[10px] uppercase text-indigo-500 tracking-wider">ATS Scan Criteria Weightage</h5>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            <div className="bg-slate-100/50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-850 p-2 rounded-xl text-center">
                              <span className="block text-[8px] font-bold text-slate-450 uppercase">Keyword Match</span>
                              <span className="text-xs font-black text-slate-700 dark:text-slate-350">40%</span>
                            </div>
                            <div className="bg-slate-100/50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-850 p-2 rounded-xl text-center">
                              <span className="block text-[8px] font-bold text-slate-455 uppercase">Skills Match</span>
                              <span className="text-xs font-black text-slate-700 dark:text-slate-305">25%</span>
                            </div>
                            <div className="bg-slate-100/50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-850 p-2 rounded-xl text-center">
                              <span className="block text-[8px] font-bold text-slate-455 uppercase">Experience</span>
                              <span className="text-xs font-black text-slate-700 dark:text-slate-305">15%</span>
                            </div>
                            <div className="bg-slate-100/50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-850 p-2 rounded-xl text-center">
                              <span className="block text-[8px] font-bold text-slate-455 uppercase">Education</span>
                              <span className="text-xs font-black text-slate-700 dark:text-slate-305">10%</span>
                            </div>
                            <div className="bg-slate-100/50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-850 p-2 rounded-xl text-center col-span-2 sm:col-span-1">
                              <span className="block text-[8px] font-bold text-slate-455 uppercase">Formatting</span>
                              <span className="text-xs font-black text-slate-700 dark:text-slate-305">10%</span>
                            </div>
                          </div>
                        </div>

                        {/* Metrics Table */}
                        <div className="space-y-2">
                          <h5 className="font-extrabold text-[10px] uppercase text-indigo-500 tracking-wider">ATS Score Performance Matrix</h5>
                          <div className="overflow-x-auto border border-slate-200 dark:border-slate-850 rounded-2xl">
                            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-850 text-left text-[9.5px]">
                              <thead className="bg-slate-50 dark:bg-slate-900/80 text-[8.5px] font-bold text-slate-450 uppercase">
                                <tr>
                                  <th className="px-3 py-2">Score</th>
                                  <th className="px-3 py-2">Rating & Status</th>
                                  <th className="px-3 py-2 text-right">Indicator</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-200 dark:divide-slate-850 text-slate-600 dark:text-slate-400">
                                <tr>
                                  <td className="px-3 py-1.5 font-bold">0–20%</td>
                                  <td className="px-3 py-1.5">❌ Very Poor (Needs major improvement)</td>
                                  <td className="px-3 py-1.5 text-right"><span className="inline-block w-2 h-2 rounded-full bg-red-500 align-middle"></span></td>
                                </tr>
                                <tr>
                                  <td className="px-3 py-1.5 font-bold">21–40%</td>
                                  <td className="px-3 py-1.5">⚠️ Poor (Below average)</td>
                                  <td className="px-3 py-1.5 text-right"><span className="inline-block w-2 h-2 rounded-full bg-orange-500 align-middle"></span></td>
                                </tr>
                                <tr>
                                  <td className="px-3 py-1.5 font-bold">41–60%</td>
                                  <td className="px-3 py-1.5">👍 Average (Acceptable but needs improvement)</td>
                                  <td className="px-3 py-1.5 text-right"><span className="inline-block w-2 h-2 rounded-full bg-yellow-500 align-middle"></span></td>
                                </tr>
                                <tr>
                                  <td className="px-3 py-1.5 font-bold">61–75%</td>
                                  <td className="px-3 py-1.5">✅ Good (Suitable for many applications)</td>
                                  <td className="px-3 py-1.5 text-right"><span className="inline-block w-2 h-2 rounded-full bg-lime-500 align-middle"></span></td>
                                </tr>
                                <tr>
                                  <td className="px-3 py-1.5 font-bold">76–90%</td>
                                  <td className="px-3 py-1.5">💪 Strong (Highly ATS-friendly)</td>
                                  <td className="px-3 py-1.5 text-right"><span className="inline-block w-2 h-2 rounded-full bg-green-500 align-middle"></span></td>
                                </tr>
                                <tr>
                                  <td className="px-3 py-1.5 font-bold">91–100%</td>
                                  <td className="px-3 py-1.5">🏆 Very Strong (Excellent, interview-ready)</td>
                                  <td className="px-3 py-1.5 text-right"><span className="inline-block w-2 h-2 rounded-full bg-emerald-500 align-middle"></span></td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    )}

                    {atsScore !== null && (() => {
                      const rating = getAtsRating(atsScore);
                      const keywordScore = typeof atsFeedback?.keywordScore === 'number' ? atsFeedback.keywordScore : Math.round(atsScore * 0.40);
                      const skillsScore = typeof atsFeedback?.skillsScore === 'number' ? atsFeedback.skillsScore : Math.round(atsScore * 0.25);
                      const experienceScore = typeof atsFeedback?.experienceScore === 'number' ? atsFeedback.experienceScore : Math.round(atsScore * 0.15);
                      const educationScore = typeof atsFeedback?.educationScore === 'number' ? atsFeedback.educationScore : Math.round(atsScore * 0.10);
                      const formattingScore = typeof atsFeedback?.formattingScore === 'number' ? atsFeedback.formattingScore : Math.round(atsScore * 0.10);

                      const kwPercent = Math.min(100, Math.max(0, Math.round((keywordScore / 40) * 100)));
                      const skPercent = Math.min(100, Math.max(0, Math.round((skillsScore / 25) * 100)));
                      const exPercent = Math.min(100, Math.max(0, Math.round((experienceScore / 15) * 100)));
                      const edPercent = Math.min(100, Math.max(0, Math.round((educationScore / 10) * 100)));
                      const foPercent = Math.min(100, Math.max(0, Math.round((formattingScore / 10) * 100)));

                      return (
                        <div className="glass-card p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/40 text-left space-y-5 bg-white/40 dark:bg-slate-950/20 backdrop-blur-sm">
                          {/* Rating Tier Banner Alert */}
                          <div className={`p-4 border rounded-2xl flex items-center gap-3 transition-all ${rating.bgClass} ${rating.borderClass}`}>
                            <span className="text-2xl">{rating.emoji}</span>
                            <div>
                              <h5 className={`font-black text-xs ${rating.colorClass}`}>ATS Rating: {rating.label}</h5>
                              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Your resume scored {atsScore}% on SDE standard scans.</p>
                            </div>
                          </div>

                          {/* Circle Score indicator */}
                          <div className="flex items-center gap-4">
                            <div className={`w-16 h-16 rounded-full border-4 ${rating.circleBorderClass} flex items-center justify-center font-extrabold text-lg bg-indigo-500/5 transition-all`}>
                              {atsScore}%
                            </div>
                            <div>
                              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Scan Match Score</div>
                              <div className={`text-sm font-extrabold ${rating.colorClass} capitalize`}>{atsFeedback?.layoutRating || 'ATS Checked'} Match</div>
                            </div>
                          </div>

                          {/* Score Breakdown Section */}
                          <div className="space-y-3 bg-slate-100/50 dark:bg-slate-900/40 p-4.5 rounded-2xl">
                            <h5 className="font-extrabold text-[10px] uppercase text-indigo-500 tracking-wider">ATS Score Breakdown</h5>
                            <div className="space-y-3.5">
                              {/* Keyword Match */}
                              <div>
                                <div className="text-[10px] font-semibold text-slate-700 dark:text-slate-300">
                                  <span>Keyword Match (40% weightage)</span>
                                </div>
                                <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full mt-1.5">
                                  <div className={`h-1.5 rounded-full transition-all duration-500 ${getSubScoreColorClass(kwPercent)}`} style={{ width: `${kwPercent}%` }}></div>
                                </div>
                              </div>

                              {/* Skills Match */}
                              <div>
                                <div className="text-[10px] font-semibold text-slate-700 dark:text-slate-300">
                                  <span>Skills Match (25% weightage)</span>
                                </div>
                                <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full mt-1.5">
                                  <div className={`h-1.5 rounded-full transition-all duration-500 ${getSubScoreColorClass(skPercent)}`} style={{ width: `${skPercent}%` }}></div>
                                </div>
                              </div>

                              {/* Experience */}
                              <div>
                                <div className="text-[10px] font-semibold text-slate-700 dark:text-slate-300">
                                  <span>Experience (15% weightage)</span>
                                </div>
                                <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full mt-1.5">
                                  <div className={`h-1.5 rounded-full transition-all duration-500 ${getSubScoreColorClass(exPercent)}`} style={{ width: `${exPercent}%` }}></div>
                                </div>
                              </div>

                              {/* Education */}
                              <div>
                                <div className="text-[10px] font-semibold text-slate-700 dark:text-slate-300">
                                  <span>Education (10% weightage)</span>
                                </div>
                                <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full mt-1.5">
                                  <div className={`h-1.5 rounded-full transition-all duration-500 ${getSubScoreColorClass(edPercent)}`} style={{ width: `${edPercent}%` }}></div>
                                </div>
                              </div>

                              {/* Formatting */}
                              <div>
                                <div className="text-[10px] font-semibold text-slate-700 dark:text-slate-300">
                                  <span>Formatting (10% weightage)</span>
                                </div>
                                <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full mt-1.5">
                                  <div className={`h-1.5 rounded-full transition-all duration-500 ${getSubScoreColorClass(foPercent)}`} style={{ width: `${foPercent}%` }}></div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Missing terms */}
                          {atsFeedback?.missingKeywords && atsFeedback.missingKeywords.length > 0 && (
                            <div>
                              <div className="text-[10px] font-bold text-red-400 uppercase tracking-widest">Missing Key Industry Words</div>
                              <div className="flex flex-wrap gap-1.5 mt-2">
                                {atsFeedback.missingKeywords.map((kw: string, idx: number) => (
                                  <span key={idx} className="bg-red-500/10 border border-red-500/20 text-red-500 text-[9px] font-bold px-2 py-0.5 rounded-full">
                                    ✖ {kw}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Enhancements checklists */}
                          {atsFeedback?.contentSuggestions && atsFeedback.contentSuggestions.length > 0 && (
                            <div>
                              <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Optimizations Roadmap</div>
                              <ul className="mt-2 space-y-2">
                                {atsFeedback.contentSuggestions.map((sg: string, idx: number) => (
                                  <li key={idx} className="flex items-start gap-2 text-[10px] text-slate-650 dark:text-slate-300">
                                    <CheckCircle size={12} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                                    <span>{sg}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Predicted Jobs Section */}
                          {atsFeedback?.predictedJobs && atsFeedback.predictedJobs.length > 0 && (
                            <div>
                              <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mt-2.5">🎯 Predicted Job Roles</div>
                              <div className="flex flex-wrap gap-1.5 mt-2">
                                {atsFeedback.predictedJobs.map((j: string, idx: number) => (
                                  <span key={idx} className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-650 dark:text-indigo-400 text-[9px] font-bold px-2.5 py-1 rounded-full">
                                    {j}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </>
                )}

                {/* MODE B: ATS RESUME TESTER */}
                {testerMode === 'external' && (
                  <>
                    <div className="p-4 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/25 rounded-2xl text-left space-y-3.5">
                      <div className="flex justify-between items-center">
                        <h4 className="font-extrabold text-xs flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                          <Award size={16} className="text-purple-500" />
                          <span>External Resume ATS Tester</span>
                        </h4>
                        {externalScore !== null && (
                          <button
                            onClick={() => {
                              setExternalScore(null);
                              setExternalFeedback(null);
                              setExternalText('');
                              setFileName('');
                            }}
                            className="text-[9px] font-bold text-slate-400 hover:text-slate-650 transition-colors"
                          >
                            Reset Test
                          </button>
                        )}
                      </div>
                      
                      {/* Sub-mode Selection */}
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setUploadMethod('file')}
                          className={`px-3 py-1 text-[9px] font-bold rounded-lg border transition-all ${
                            uploadMethod === 'file'
                              ? 'bg-purple-650 border-purple-650 text-white dark:bg-purple-600 dark:border-purple-600'
                              : 'border-slate-200 dark:border-slate-800 text-slate-400'
                          }`}
                        >
                          Upload PDF File
                        </button>
                        <button
                          type="button"
                          onClick={() => setUploadMethod('paste')}
                          className={`px-3 py-1 text-[9px] font-bold rounded-lg border transition-all ${
                            uploadMethod === 'paste'
                              ? 'bg-purple-650 border-purple-650 text-white dark:bg-purple-600 dark:border-purple-600'
                              : 'border-slate-200 dark:border-slate-800 text-slate-400'
                          }`}
                        >
                          Paste Plain Text
                        </button>
                      </div>

                      {uploadMethod === 'file' ? (
                        <div className="space-y-3">
                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                            <label className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-250 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 rounded-xl p-3.5 cursor-pointer bg-slate-50/40 dark:bg-slate-900/10 hover:bg-indigo-500/5 transition-all">
                              <span className="text-[10px] font-bold text-slate-500">📁 Select Resume (.pdf)</span>
                              <input
                                type="file"
                                accept=".pdf"
                                onChange={handleExternalFileUpload}
                                className="hidden"
                              />
                            </label>
                            <button
                              onClick={triggerExternalAtsTest}
                              disabled={testingExternal || !externalText}
                              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold px-5 py-3.5 rounded-xl shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
                            >
                              {testingExternal ? 'Scanning...' : 'Test Resume Score'}
                            </button>
                          </div>
                          {fileName && (
                            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/25 px-3 py-2 rounded-xl text-left">
                              ✓ Resume parsed successfully: <span className="font-mono">{fileName}</span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] text-slate-400">Paste your resume content below:</span>
                            <button
                              onClick={triggerExternalAtsTest}
                              disabled={testingExternal || !externalText.trim()}
                              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
                            >
                              {testingExternal ? 'Scanning...' : 'Test Resume Score'}
                            </button>
                          </div>
                          <textarea
                            rows={6}
                            value={externalText}
                            onChange={(e) => setExternalText(e.target.value)}
                            placeholder="Paste your plain text resume content here..."
                            className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 outline-none mt-1 font-mono text-slate-700 dark:text-slate-300 resize-none"
                          />
                        </div>
                      )}
                    </div>

                    {externalScore === null && !testingExternal && (
                      <div className="glass-card p-5 rounded-3xl border border-slate-200/50 dark:border-slate-800/40 text-left space-y-4 bg-white/40 dark:bg-slate-950/20 backdrop-blur-sm">
                        <h5 className="font-extrabold text-[10px] uppercase text-purple-500 tracking-wider">How to test your resume</h5>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">
                          Copy all text content from your PDF, Word, or text resume and paste it in the textbox above. The AI scanner evaluates formatting compatibility, keyword presence, skills match, experience structure, and education. It will output visual ratings and criteria progress bars just like the builder!
                        </p>
                      </div>
                    )}

                    {externalScore !== null && (() => {
                      const rating = getAtsRating(externalScore);
                      const keywordScore = typeof externalFeedback?.keywordScore === 'number' ? externalFeedback.keywordScore : Math.round(externalScore * 0.40);
                      const skillsScore = typeof externalFeedback?.skillsScore === 'number' ? externalFeedback.skillsScore : Math.round(externalScore * 0.25);
                      const experienceScore = typeof externalFeedback?.experienceScore === 'number' ? externalFeedback.experienceScore : Math.round(externalScore * 0.15);
                      const educationScore = typeof externalFeedback?.educationScore === 'number' ? externalFeedback.educationScore : Math.round(externalScore * 0.10);
                      const formattingScore = typeof externalFeedback?.formattingScore === 'number' ? externalFeedback.formattingScore : Math.round(externalScore * 0.10);

                      const kwPercent = Math.min(100, Math.max(0, Math.round((keywordScore / 40) * 100)));
                      const skPercent = Math.min(100, Math.max(0, Math.round((skillsScore / 25) * 100)));
                      const exPercent = Math.min(100, Math.max(0, Math.round((experienceScore / 15) * 100)));
                      const edPercent = Math.min(100, Math.max(0, Math.round((educationScore / 10) * 100)));
                      const foPercent = Math.min(100, Math.max(0, Math.round((formattingScore / 10) * 100)));

                      return (
                        <div className="glass-card p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/40 text-left space-y-5 bg-white/40 dark:bg-slate-950/20 backdrop-blur-sm">
                          {/* Rating Tier Banner Alert */}
                          <div className={`p-4 border rounded-2xl flex items-center gap-3 transition-all ${rating.bgClass} ${rating.borderClass}`}>
                            <span className="text-2xl">{rating.emoji}</span>
                            <div>
                              <h5 className={`font-black text-xs ${rating.colorClass}`}>ATS Rating: {rating.label}</h5>
                              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Your tested resume scored {externalScore}% on SDE standard scans.</p>
                            </div>
                          </div>

                          {/* Circle Score indicator */}
                          <div className="flex items-center gap-4">
                            <div className={`w-16 h-16 rounded-full border-4 ${rating.circleBorderClass} flex items-center justify-center font-extrabold text-lg bg-indigo-500/5 transition-all`}>
                              {externalScore}%
                            </div>
                            <div>
                              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Scan Match Score</div>
                              <div className={`text-sm font-extrabold ${rating.colorClass} capitalize`}>{externalFeedback?.layoutRating || 'ATS Checked'} Match</div>
                            </div>
                          </div>

                          {/* Score Breakdown Section */}
                          <div className="space-y-3 bg-slate-100/50 dark:bg-slate-900/40 p-4.5 rounded-2xl">
                            <h5 className="font-extrabold text-[10px] uppercase text-indigo-500 tracking-wider">ATS Score Breakdown</h5>
                            <div className="space-y-3.5">
                              {/* Keyword Match */}
                              <div>
                                <div className="text-[10px] font-semibold text-slate-700 dark:text-slate-300">
                                  <span>Keyword Match (40% weightage)</span>
                                </div>
                                <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full mt-1.5">
                                  <div className={`h-1.5 rounded-full transition-all duration-500 ${getSubScoreColorClass(kwPercent)}`} style={{ width: `${kwPercent}%` }}></div>
                                </div>
                              </div>

                              {/* Skills Match */}
                              <div>
                                <div className="text-[10px] font-semibold text-slate-700 dark:text-slate-300">
                                  <span>Skills Match (25% weightage)</span>
                                </div>
                                <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full mt-1.5">
                                  <div className={`h-1.5 rounded-full transition-all duration-500 ${getSubScoreColorClass(skPercent)}`} style={{ width: `${skPercent}%` }}></div>
                                </div>
                              </div>

                              {/* Experience */}
                              <div>
                                <div className="text-[10px] font-semibold text-slate-700 dark:text-slate-300">
                                  <span>Experience (15% weightage)</span>
                                </div>
                                <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full mt-1.5">
                                  <div className={`h-1.5 rounded-full transition-all duration-500 ${getSubScoreColorClass(exPercent)}`} style={{ width: `${exPercent}%` }}></div>
                                </div>
                              </div>

                              {/* Education */}
                              <div>
                                <div className="text-[10px] font-semibold text-slate-700 dark:text-slate-300">
                                  <span>Education (10% weightage)</span>
                                </div>
                                <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full mt-1.5">
                                  <div className={`h-1.5 rounded-full transition-all duration-500 ${getSubScoreColorClass(edPercent)}`} style={{ width: `${edPercent}%` }}></div>
                                </div>
                              </div>

                              {/* Formatting */}
                              <div>
                                <div className="text-[10px] font-semibold text-slate-700 dark:text-slate-300">
                                  <span>Formatting (10% weightage)</span>
                                </div>
                                <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full mt-1.5">
                                  <div className={`h-1.5 rounded-full transition-all duration-500 ${getSubScoreColorClass(foPercent)}`} style={{ width: `${foPercent}%` }}></div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Missing terms */}
                          {externalFeedback?.missingKeywords && externalFeedback.missingKeywords.length > 0 && (
                            <div>
                              <div className="text-[10px] font-bold text-red-400 uppercase tracking-widest">Missing Key Industry Words</div>
                              <div className="flex flex-wrap gap-1.5 mt-2">
                                {externalFeedback.missingKeywords.map((kw: string, idx: number) => (
                                  <span key={idx} className="bg-red-500/10 border border-red-500/20 text-red-500 text-[9px] font-bold px-2 py-0.5 rounded-full">
                                    ✖ {kw}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Enhancements checklists */}
                          {externalFeedback?.contentSuggestions && externalFeedback.contentSuggestions.length > 0 && (
                            <div>
                              <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Optimizations Roadmap</div>
                              <ul className="mt-2 space-y-2">
                                {externalFeedback.contentSuggestions.map((sg: string, idx: number) => (
                                  <li key={idx} className="flex items-start gap-2 text-[10px] text-slate-655 dark:text-slate-300">
                                    <CheckCircle size={12} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                                    <span>{sg}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Predicted Jobs Section */}
                          {externalFeedback?.predictedJobs && externalFeedback.predictedJobs.length > 0 && (
                            <div>
                              <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mt-2.5">🎯 Predicted Job Roles</div>
                              <div className="flex flex-wrap gap-1.5 mt-2">
                                {externalFeedback.predictedJobs.map((j: string, idx: number) => (
                                  <span key={idx} className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-650 dark:text-indigo-400 text-[9px] font-bold px-2.5 py-1 rounded-full">
                                    {j}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </>
                )}
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex justify-between border-t border-slate-200 dark:border-slate-800 pt-4 print:hidden">
            <button
              onClick={() => setActiveStep(prev => Math.max(0, prev - 1))}
              disabled={activeStep === 0}
              className="flex items-center gap-1 px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors disabled:opacity-50"
            >
              <ArrowLeft size={14} /> Back
            </button>
            <button
              onClick={() => setActiveStep(prev => Math.min(steps.length - 1, prev + 1))}
              disabled={activeStep === steps.length - 1}
              className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-md transition-colors disabled:opacity-50"
            >
              Next <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Template styling buttons */}
        <div className="glass-card p-4.5 rounded-3xl border border-slate-200/50 dark:border-slate-800/40 print:hidden space-y-2.5">
          <h4 className="font-bold text-xs">Live Templates (Canva-like Choice)</h4>
          <div className="grid grid-cols-4 gap-2.5">
            {['modern', 'corporate', 'minimalist', 'creative'].map((t) => (
              <button
                key={t}
                onClick={() => setTemplate(t)}
                className={`py-2 rounded-xl text-[10px] font-bold capitalize transition-colors ${
                  template === t
                    ? 'bg-gradient-to-tr from-indigo-500 to-purple-500 text-white'
                    : 'bg-slate-100 dark:bg-slate-900 border border-slate-250 dark:border-slate-800 text-slate-500 hover:text-slate-700'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Template Description Panel */}
          <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200/50 dark:border-slate-850 text-[10px] text-slate-500 dark:text-slate-400 mt-2 transition-all">
            {template === 'modern' && (
              <p>🌟 <strong>Modern Style:</strong> Best for tech, startup, and developer roles. Highlights key skills and projects with vibrant indigo accents.</p>
            )}
            {template === 'corporate' && (
              <p>💼 <strong>Corporate Style:</strong> Best for finance, consulting, and traditional corporate industries. Features formal, centered formatting and clean margins.</p>
            )}
            {template === 'minimalist' && (
              <p>📄 <strong>Minimalist Style:</strong> Best for academic applications, senior roles, or CV simplicity. Focuses on content density, maximum whitespace, and elegant thin font tracking.</p>
            )}
            {template === 'creative' && (
              <p>🎨 <strong>Creative Style:</strong> Best for design, UI/UX, product marketing, or landing-page developers. Uses a premium 2-column sidebar design to stand out.</p>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Live Canva-like PDF Template preview */}
      <div className="glass-card rounded-3xl border border-slate-200/50 dark:border-slate-800/40 p-1 print:p-0 print:border-none print:shadow-none bg-slate-100 dark:bg-slate-950 overflow-hidden relative">
        <div className="absolute top-3 left-3 bg-slate-900/80 px-2 py-0.5 rounded-md text-[9px] font-mono text-white/80 print:hidden z-10">
          LIVE INTERACTIVE TEMPLATE
        </div>

        {/* Paper Container sheet */}
        <div className="bg-white text-slate-900 p-8 min-h-[840px] aspect-[1/1.4] shadow-inner font-sans text-left overflow-y-auto leading-relaxed text-xs max-w-full print:p-0 print:shadow-none print:min-h-0 print:aspect-auto">
          {/* TEMPLATE A: MODERN */}
          {template === 'modern' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="border-b-2 border-indigo-600 pb-3 flex justify-between items-end">
                <div>
                  <h1 className="text-2xl font-extrabold text-indigo-900 tracking-tight">{resume.personalInfo.name || 'Alex Johnson'}</h1>
                  <p className="text-[10px] text-slate-500 mt-1 font-semibold flex gap-3 flex-wrap">
                    <span>✉ {resume.personalInfo.email}</span>
                    <span>☎ {resume.personalInfo.phone}</span>
                  </p>
                </div>
                <div className="text-right text-[9px] text-slate-400 font-mono">
                  <div>{resume.personalInfo.linkedin}</div>
                  <div>{resume.personalInfo.portfolio}</div>
                </div>
              </div>

              {/* Summary */}
              {resume.personalInfo.summary && (
                <div className="space-y-1.5">
                  <h4 className="text-[10px] font-bold text-indigo-800 uppercase tracking-widest">Professional Summary</h4>
                  <p className="text-[10px] text-slate-650">{resume.personalInfo.summary}</p>
                </div>
              )}

              {/* Education */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-bold text-indigo-800 uppercase tracking-widest">Education</h4>
                {resume.education.map((edu, idx) => (
                  <div key={idx} className="flex justify-between items-start text-[10px]">
                    <div>
                      <span className="font-bold text-slate-800">{edu.institution}</span> — <span className="italic text-slate-600">{edu.degree}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-500 font-mono">{edu.year}</span>
                      <span className="block font-bold text-indigo-600 text-[9px]">{edu.gpa}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Experience */}
              {resume.experience.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-[10px] font-bold text-indigo-800 uppercase tracking-widest">Experience</h4>
                  {resume.experience.map((exp, idx) => (
                    <div key={idx} className="space-y-1 text-[10px]">
                      <div className="flex justify-between items-start font-bold">
                        <span className="text-slate-800">{exp.company} — <span className="italic font-normal text-slate-600">{exp.role}</span></span>
                        <span className="text-slate-500 font-mono font-normal">{exp.duration}</span>
                      </div>
                      <p className="text-[9.5px] text-slate-650 pl-2 border-l-2 border-slate-200">{exp.description}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Projects */}
              {resume.projects.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-[10px] font-bold text-indigo-800 uppercase tracking-widest">Projects</h4>
                  {resume.projects.map((proj, idx) => (
                    <div key={idx} className="space-y-1 text-[10px]">
                      <div className="flex justify-between items-start font-bold">
                        <span className="text-slate-800">{proj.title} <span className="text-[8px] text-slate-400 font-normal">({proj.link})</span></span>
                        <span className="text-indigo-600 text-[8.5px] font-mono">{proj.technologies}</span>
                      </div>
                      <p className="text-[9.5px] text-slate-650">{proj.description}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Skills */}
              {resume.skills && (
                <div className="space-y-1.5">
                  <h4 className="text-[10px] font-bold text-indigo-800 uppercase tracking-widest">Skills</h4>
                  <p className="text-[10px] text-slate-700 font-medium">{resume.skills}</p>
                </div>
              )}

              {/* Certs & Achievements */}
              <div className="grid grid-cols-2 gap-4 text-[10px]">
                {resume.certifications && (
                  <div className="space-y-1.5">
                    <h4 className="text-[10px] font-bold text-indigo-800 uppercase tracking-widest">Certifications</h4>
                    <p className="text-[9.5px] text-slate-650">{resume.certifications}</p>
                  </div>
                )}
                {resume.achievements && (
                  <div className="space-y-1.5">
                    <h4 className="text-[10px] font-bold text-indigo-800 uppercase tracking-widest">Achievements</h4>
                    <p className="text-[9.5px] text-slate-650">{resume.achievements}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TEMPLATE B: CORPORATE (Simple layout) */}
          {template === 'corporate' && (
            <div className="space-y-5 text-slate-800 text-[10px]">
              <div className="text-center border-b border-slate-900 pb-2">
                <h1 className="text-xl font-bold uppercase tracking-wide text-slate-950">{resume.personalInfo.name}</h1>
                <p className="text-[9px] text-slate-500 font-mono mt-1">
                  {resume.personalInfo.email} | {resume.personalInfo.phone} | {resume.personalInfo.linkedin} | {resume.personalInfo.portfolio}
                </p>
              </div>

              {resume.personalInfo.careerObjective && (
                <div className="space-y-1">
                  <h4 className="font-extrabold uppercase border-b border-slate-200 pb-0.5 text-slate-900 tracking-wider">Career Objective</h4>
                  <p className="text-slate-650">{resume.personalInfo.careerObjective}</p>
                </div>
              )}

              <div className="space-y-1">
                <h4 className="font-extrabold uppercase border-b border-slate-200 pb-0.5 text-slate-900 tracking-wider">Education</h4>
                {resume.education.map((edu, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <span><strong className="text-slate-900">{edu.institution}</strong> — {edu.degree}</span>
                    <span className="font-mono text-slate-500">{edu.year} ({edu.gpa})</span>
                  </div>
                ))}
              </div>

              {resume.experience.length > 0 && (
                <div className="space-y-1.5">
                  <h4 className="font-extrabold uppercase border-b border-slate-200 pb-0.5 text-slate-900 tracking-wider">Experience</h4>
                  {resume.experience.map((exp, idx) => (
                    <div key={idx} className="space-y-0.5">
                      <div className="flex justify-between items-center font-bold text-slate-900">
                        <span>{exp.company} — {exp.role}</span>
                        <span className="font-mono text-slate-500 font-normal">{exp.duration}</span>
                      </div>
                      <p className="text-slate-650 pl-2">{exp.description}</p>
                    </div>
                  ))}
                </div>
              )}

              {resume.projects.length > 0 && (
                <div className="space-y-1.5">
                  <h4 className="font-extrabold uppercase border-b border-slate-200 pb-0.5 text-slate-900 tracking-wider">Projects</h4>
                  {resume.projects.map((proj, idx) => (
                    <div key={idx} className="space-y-0.5">
                      <div className="flex justify-between items-center font-bold text-slate-900">
                        <span>{proj.title} ({proj.link})</span>
                        <span className="font-mono text-slate-500 text-[9px] font-normal">{proj.technologies}</span>
                      </div>
                      <p className="text-slate-650">{proj.description}</p>
                    </div>
                  ))}
                </div>
              )}

              {resume.skills && (
                <div className="space-y-1">
                  <h4 className="font-extrabold uppercase border-b border-slate-200 pb-0.5 text-slate-900 tracking-wider">Skills</h4>
                  <p className="font-semibold text-slate-700">{resume.skills}</p>
                </div>
              )}

              {resume.certifications && (
                <div className="space-y-1">
                  <h4 className="font-extrabold uppercase border-b border-slate-200 pb-0.5 text-slate-900 tracking-wider">Certifications</h4>
                  <p className="text-slate-650">{resume.certifications}</p>
                </div>
              )}
            </div>
          )}

          {/* TEMPLATE C: MINIMALIST */}
          {template === 'minimalist' && (
            <div className="space-y-5 text-slate-800 text-[10px] font-light font-sans tracking-wide">
              {/* Header */}
              <div className="space-y-1">
                <h1 className="text-xl font-normal text-slate-900 tracking-widest">{resume.personalInfo.name}</h1>
                <p className="text-[8.5px] text-slate-500 font-light flex gap-2 flex-wrap">
                  <span>{resume.personalInfo.email}</span> • 
                  <span>{resume.personalInfo.phone}</span> • 
                  <span>{resume.personalInfo.linkedin}</span> • 
                  <span>{resume.personalInfo.portfolio}</span>
                </p>
              </div>

              {/* Career Objective */}
              {resume.personalInfo.careerObjective && (
                <div className="space-y-1 pt-1.5">
                  <h4 className="text-[9px] font-semibold uppercase text-slate-900 tracking-widest">About Me</h4>
                  <p className="text-slate-600 leading-relaxed font-light">{resume.personalInfo.careerObjective}</p>
                </div>
              )}

              {/* Education */}
              <div className="space-y-2 pt-1.5">
                <h4 className="text-[9px] font-semibold uppercase text-slate-900 tracking-widest">Education</h4>
                {resume.education.map((edu, idx) => (
                  <div key={idx} className="flex justify-between items-start">
                    <div>
                      <span className="font-medium text-slate-800">{edu.institution}</span>
                      <span className="block text-slate-500 text-[9px] font-light">{edu.degree}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-500 font-light text-[8.5px]">{edu.year}</span>
                      <span className="block font-medium text-slate-700 text-[8.5px]">{edu.gpa}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Experience */}
              {resume.experience.length > 0 && (
                <div className="space-y-3 pt-1.5">
                  <h4 className="text-[9px] font-semibold uppercase text-slate-900 tracking-widest">Experience</h4>
                  {resume.experience.map((exp, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between items-start font-medium text-slate-800">
                        <span>{exp.company} <span className="font-light text-slate-500">— {exp.role}</span></span>
                        <span className="text-slate-500 font-light text-[8.5px]">{exp.duration}</span>
                      </div>
                      <p className="text-slate-600 pl-3 leading-relaxed font-light">{exp.description}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Projects */}
              {resume.projects.length > 0 && (
                <div className="space-y-3 pt-1.5">
                  <h4 className="text-[9px] font-semibold uppercase text-slate-900 tracking-widest">Projects</h4>
                  {resume.projects.map((proj, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between items-start font-medium text-slate-800">
                        <span>{proj.title} <span className="text-[8px] text-slate-400 font-light font-mono">({proj.link})</span></span>
                        <span className="text-slate-500 text-[8.5px] font-light font-mono">{proj.technologies}</span>
                      </div>
                      <p className="text-slate-600 pl-3 leading-relaxed font-light">{proj.description}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Skills */}
              {resume.skills && (
                <div className="space-y-1 pt-1.5">
                  <h4 className="text-[9px] font-semibold uppercase text-slate-900 tracking-widest">Technical Skills</h4>
                  <p className="text-slate-700 font-medium">{resume.skills}</p>
                </div>
              )}

              {/* Certifications & Achievements */}
              <div className="grid grid-cols-2 gap-4 pt-1.5">
                {resume.certifications && (
                  <div className="space-y-1">
                    <h4 className="text-[9px] font-semibold uppercase text-slate-900 tracking-widest">Certifications</h4>
                    <p className="text-slate-600 font-light leading-relaxed">{resume.certifications}</p>
                  </div>
                )}
                {resume.achievements && (
                  <div className="space-y-1">
                    <h4 className="text-[9px] font-semibold uppercase text-slate-900 tracking-widest">Achievements</h4>
                    <p className="text-slate-600 font-light leading-relaxed">{resume.achievements}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TEMPLATE D: CREATIVE (2-Column Canvas Layout) */}
          {template === 'creative' && (
            <div className="flex flex-row text-slate-800 text-[10px] min-h-[780px] -m-8">
              {/* Sidebar (Left column) */}
              <div className="w-[35%] bg-slate-50 border-r border-slate-200/60 p-6 flex flex-col space-y-5">
                {/* Profile Name & Contact */}
                <div className="space-y-2">
                  <h1 className="text-lg font-black text-indigo-900 tracking-tight leading-tight">{resume.personalInfo.name}</h1>
                  <div className="w-8 h-1 bg-pink-500 rounded-full"></div>
                </div>

                <div className="space-y-2 text-[9px] text-slate-600 font-medium">
                  <div className="space-y-1">
                    <span className="block text-[8px] font-bold text-indigo-600 uppercase">Email</span>
                    <span className="break-all">{resume.personalInfo.email}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="block text-[8px] font-bold text-indigo-650 uppercase">Phone</span>
                    <span>{resume.personalInfo.phone}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="block text-[8px] font-bold text-indigo-650 uppercase">LinkedIn</span>
                    <span className="break-all">{resume.personalInfo.linkedin}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="block text-[8px] font-bold text-indigo-650 uppercase">Portfolio</span>
                    <span className="break-all">{resume.personalInfo.portfolio}</span>
                  </div>
                </div>

                {/* Skills */}
                {resume.skills && (
                  <div className="space-y-1.5 pt-2">
                    <h4 className="text-[9.5px] font-bold text-indigo-900 uppercase tracking-widest border-b border-slate-200 pb-1">Skills</h4>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {resume.skills.split(',').map((skill, sIdx) => {
                        const trimmed = skill.trim();
                        if (!trimmed) return null;
                        return (
                          <span key={sIdx} className="bg-indigo-100/60 border border-indigo-250 text-indigo-850 text-[8px] font-bold px-2 py-0.5 rounded-md">
                            {trimmed}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Certifications */}
                {resume.certifications && (
                  <div className="space-y-1.5 pt-2">
                    <h4 className="text-[9.5px] font-bold text-indigo-900 uppercase tracking-widest border-b border-slate-200 pb-1">Certifications</h4>
                    <ul className="space-y-1 text-[9px] text-slate-600 list-disc pl-3 mt-1.5">
                      {resume.certifications.split(',').map((cert, cIdx) => (
                        <li key={cIdx}>{cert.trim()}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Achievements */}
                {resume.achievements && (
                  <div className="space-y-1.5 pt-2">
                    <h4 className="text-[9.5px] font-bold text-indigo-900 uppercase tracking-widest border-b border-slate-200 pb-1">Highlights</h4>
                    <ul className="space-y-1 text-[9px] text-slate-600 list-disc pl-3 mt-1.5">
                      {resume.achievements.split(',').map((ach, aIdx) => (
                        <li key={aIdx}>{ach.trim()}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Main Body (Right column) */}
              <div className="w-[65%] p-6 flex flex-col space-y-5">
                {/* Summary */}
                {resume.personalInfo.summary && (
                  <div className="space-y-1.5">
                    <h4 className="text-[9.5px] font-bold text-indigo-900 uppercase tracking-widest border-b border-slate-100 pb-1">About Me</h4>
                    <p className="text-[9.5px] text-slate-600 leading-relaxed">{resume.personalInfo.summary}</p>
                  </div>
                )}

                {/* Experience */}
                {resume.experience.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-[9.5px] font-bold text-indigo-900 uppercase tracking-widest border-b border-slate-100 pb-1">Work History</h4>
                    {resume.experience.map((exp, idx) => (
                      <div key={idx} className="space-y-1 text-[9.5px]">
                        <div className="flex justify-between items-start font-bold">
                          <span className="text-slate-800">{exp.company} — <span className="italic font-normal text-indigo-600">{exp.role}</span></span>
                          <span className="text-slate-500 font-mono font-normal text-[8px]">{exp.duration}</span>
                        </div>
                        <p className="text-[9px] text-slate-650 pl-2 border-l border-pink-200">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Projects */}
                {resume.projects.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-[9.5px] font-bold text-indigo-900 uppercase tracking-widest border-b border-slate-100 pb-1">Key Projects</h4>
                    {resume.projects.map((proj, idx) => (
                      <div key={idx} className="space-y-1 text-[9.5px]">
                        <div className="flex justify-between items-start font-bold">
                          <span className="text-slate-800">{proj.title} <span className="text-[8px] text-slate-400 font-normal">({proj.link})</span></span>
                          <span className="text-indigo-600 text-[8px] font-mono">{proj.technologies}</span>
                        </div>
                        <p className="text-[9px] text-slate-650">{proj.description}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Education */}
                <div className="space-y-2">
                  <h4 className="text-[9.5px] font-bold text-indigo-900 uppercase tracking-widest border-b border-slate-100 pb-1">Education</h4>
                  {resume.education.map((edu, idx) => (
                    <div key={idx} className="flex justify-between items-start text-[9.5px]">
                      <div>
                        <span className="font-bold text-slate-800">{edu.institution}</span>
                        <span className="block italic text-slate-600 text-[8.5px]">{edu.degree}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-500 font-mono text-[8px]">{edu.year}</span>
                        <span className="block font-bold text-indigo-650 text-[8.5px]">{edu.gpa}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
