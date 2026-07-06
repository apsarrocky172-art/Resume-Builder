import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
  BookOpen, Code, Clock, CheckCircle, AlertTriangle, Play, RefreshCw, Award, Sparkles, HelpCircle,
  Binary, Calculator, BarChart3, Brain, Type, PieChart, ClipboardCheck, Shuffle
} from 'lucide-react';

interface Question {
  _id: string;
  type: string;
  category: string;
  difficulty: string;
  questionText: string;
  options?: string[];
  correctOption?: number;
  codeTemplate?: string;
  explanation?: string;
  testCases?: Array<{ input: string; output: string }>;
}

const APTITUDE_TOPICS = [
  { id: 'number-system', name: 'Number System', icon: Binary },
  { id: 'arithmetic', name: 'Arithmetic', icon: Calculator },
  { id: 'quantitative', name: 'Quantitative Aptitude', icon: BarChart3 },
  { id: 'logical', name: 'Logical Reasoning', icon: Brain },
  { id: 'puzzle-solving', name: 'Puzzle Solving', icon: HelpCircle },
  { id: 'verbal', name: 'Verbal Ability', icon: Type },
  { id: 'data-interpretation', name: 'Data Interpretation', icon: PieChart },
  { id: 'data-sufficiency', name: 'Data Sufficiency', icon: ClipboardCheck },
  { id: 'mixed', name: 'Mixed (All Topics)', icon: Shuffle, badge: 'MIX' }
];



const LANGUAGE_CATEGORIES: Record<string, string[]> = {
  javascript: [
    'Arrays & Strings',
    'Objects & Prototypes',
    'Asynchronous JS',
    'DOM Manipulation',
    'Functions & Closures',
    'Control Flow & Loops'
  ],
  python: [
    'Lists & Tuples',
    'Dictionaries & Sets',
    'Object-Oriented Python',
    'File Handling',
    'Loops & Iterators',
    'Conditionals (If/Else)'
  ],
  sql: [
    'Basic Select',
    'Joins & Subqueries',
    'Aggregations & Grouping',
    'Window Functions',
    'Database Constraints'
  ],
  java: [
    'Arrays & Strings',
    'Collections Framework',
    'Object-Oriented Programming',
    'Exception Handling',
    'Loops & Conditionals'
  ],
  cpp: [
    'STL Containers',
    'Pointers & References',
    'Classes & Templates',
    'Loops & Control Flow',
    'Algorithms'
  ],
  c: [
    'Pointers',
    'Arrays',
    'Strings',
    'Loops',
    'If/Else Conditionals',
    'Memory Management',
    'Structures'
  ],
  html: [
    'Semantic Elements',
    'Forms & Inputs',
    'Layouts & Tables'
  ]
};

const parseQuestionImage = (text: string) => {
  if (!text) return { cleanText: '', imageUrl: null };
  const match = text.match(/\[IMAGE:\s*([^\]]+)\]/);
  if (match) {
    const imageUrl = match[1].trim();
    const cleanText = text.replace(/\[IMAGE:\s*[^\]]+\]/, '').trim();
    return { cleanText, imageUrl };
  }
  return { cleanText: text, imageUrl: null };
};

export const PlacementTrainer: React.FC = () => {
  const { token } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState<'aptitude' | 'coding' | 'technical'>(
    (tabParam === 'aptitude' || tabParam === 'coding' || tabParam === 'technical') ? tabParam : 'aptitude'
  );

  useEffect(() => {
    if (tabParam && (tabParam === 'aptitude' || tabParam === 'coding' || tabParam === 'technical')) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const handleTabChange = (tab: 'aptitude' | 'coding' | 'technical') => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const [loading, setLoading] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string>('number-system');

  // Aptitude state
  const [aptitudeQuestions, setAptitudeQuestions] = useState<Question[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [qId: string]: number }>({});
  const [testResult, setTestResult] = useState<any>(null);
  const [testActive, setTestActive] = useState(false);

  // Timed 10-Question Aptitude states
  const [currentAptitudeIndex, setCurrentAptitudeIndex] = useState(0);
  const [aptitudeTimer, setAptitudeTimer] = useState(60);

  // Refs for tracking variables inside interval without stale closures
  const selectedAnswersRef = useRef(selectedAnswers);
  const currentAptitudeIndexRef = useRef(currentAptitudeIndex);
  const aptitudeQuestionsRef = useRef(aptitudeQuestions);

  useEffect(() => {
    selectedAnswersRef.current = selectedAnswers;
  }, [selectedAnswers]);

  useEffect(() => {
    currentAptitudeIndexRef.current = currentAptitudeIndex;
  }, [currentAptitudeIndex]);

  useEffect(() => {
    aptitudeQuestionsRef.current = aptitudeQuestions;
  }, [aptitudeQuestions]);

  // Coding state
  const [codingChallenges, setCodingChallenges] = useState<Question[]>([]);
  const [currentChallenge, setCurrentChallenge] = useState<Question | null>(null);
  const [code, setCode] = useState('');
  const [lang, setLang] = useState('javascript');
  const [submittingCode, setSubmittingCode] = useState(false);
  const [submissionReport, setSubmissionReport] = useState<any>(null);
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [solvedChallenges, setSolvedChallenges] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('solved_coding_challenges');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('solved_coding_challenges', JSON.stringify(solvedChallenges));
  }, [solvedChallenges]);

  const resetCodingProgress = () => {
    if (window.confirm("Are you sure you want to reset your coding sandbox progress?")) {
      setSolvedChallenges([]);
      localStorage.removeItem('solved_coding_challenges');
    }
  };

  const getChallengeTitle = (text: string): string => {
    if (!text) return 'Coding Challenge';
    const lower = text.toLowerCase();
    if (lower.includes('two sum') || (lower.includes('add up to') && lower.includes('indices'))) return 'Two Sum';
    if (lower.includes('palindrome')) return 'Valid Palindrome';
    if (lower.includes('longest substring without repeating')) return 'Longest Substring';
    if (lower.includes('second highest salary')) return 'Second Highest Salary';
    if (lower.includes('maximum sum') && lower.includes('subarray')) return 'Maximum Subarray Sum';
    if (lower.includes('largest sum') && lower.includes('contiguous subarray')) return 'Maximum Subarray (Kadane\'s)';
    if (lower.includes('kth largest') || lower.includes('kth\' largest')) return 'Kth Largest Element';
    if (lower.includes('longest palindromic')) return 'Longest Palindromic Substring';

    const singleQuoteMatch = text.match(/['`]([a-zA-Z\s\-]{5,40})['`]/);
    if (singleQuoteMatch && singleQuoteMatch[1] && singleQuoteMatch[1].trim().includes(' ')) {
      return singleQuoteMatch[1].trim();
    }

    const firstSentence = text.split(/[.:\n]/)[0];
    if (firstSentence && firstSentence.length < 50) {
      return firstSentence.replace(/^(Write a function to |Implement a function to |Given an? |Write a |Create a )\s*/i, '').trim();
    }
    return 'Coding Challenge';
  };

  const displayedChallenges = codingChallenges.filter(ch => {
    const chLang = ch.category.includes(':') ? ch.category.split(':')[0] : 'javascript';
    const chSubCat = ch.category.includes(':') ? ch.category.split(':')[1] : ch.category;

    const langMatch = chLang.toLowerCase() === lang.toLowerCase();
    const diffMatch = filterDifficulty === 'all' || ch.difficulty.toLowerCase() === filterDifficulty.toLowerCase();
    const catMatch = filterCategory === 'all' || chSubCat.toLowerCase() === filterCategory.toLowerCase();

    return langMatch && diffMatch && catMatch;
  });

  const availableCategories = LANGUAGE_CATEGORIES[lang.toLowerCase()] || [];

  // Technical Quiz state
  const [targetRole, setTargetRole] = useState('Software Engineer');
  const [techLevel, setTechLevel] = useState<'beginner' | 'mid-level' | 'experienced'>('beginner');
  const [techExclusions, setTechExclusions] = useState<string[]>([]);
  const [techQuestions, setTechQuestions] = useState<Question[]>([]);
  const [techAnswers, setTechAnswers] = useState<{ [qId: string]: number }>({});
  const [currentTechIndex, setCurrentTechIndex] = useState(0);
  const [techTimer, setTechTimer] = useState(600); // 10 minutes
  const [techActive, setTechActive] = useState(false);
  const [techResult, setTechResult] = useState<any>(null);

  // Aptitude practice timer runner
  useEffect(() => {
    let interval: any = null;
    if (testActive && aptitudeTimer > 0) {
      interval = setInterval(() => {
        setAptitudeTimer(prev => prev - 1);
      }, 1000);
    } else if (aptitudeTimer === 0 && testActive) {
      handleAptitudeSubmit(); // Submit the whole test when time runs out
    }
    return () => clearInterval(interval);
  }, [testActive, aptitudeTimer]);

  const handleNextQuestion = () => {
    const currIdx = currentAptitudeIndexRef.current;
    const questions = aptitudeQuestionsRef.current;
    if (currIdx < questions.length - 1) {
      setCurrentAptitudeIndex(currIdx + 1);
    } else {
      handleAptitudeSubmit();
    }
  };

  // Technical Timer runner
  useEffect(() => {
    let interval: any = null;
    if (techActive && techTimer > 0) {
      interval = setInterval(() => {
        setTechTimer(prev => prev - 1);
      }, 1000);
    } else if (techTimer === 0 && techActive) {
      handleTechQuizSubmit();
    }
    return () => clearInterval(interval);
  }, [techActive, techTimer]);

  // Load Aptitude questions (loads 10 random questions for active training)
  const startAptitudeTest = async () => {
    setLoading(true);
    setTestResult(null);
    setSelectedAnswers({});
    setCurrentAptitudeIndex(0);
    setAptitudeTimer(600); // 10 minutes for the entire test

    try {
      const activeTopicObj = APTITUDE_TOPICS.find(t => t.id === selectedTopic);
      const selectedTopicName = activeTopicObj ? activeTopicObj.name : 'General Aptitude';
      
      const res = await axios.get(`http://localhost:5000/api/placement/questions?category=${encodeURIComponent(selectedTopicName)}&limit=10`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAptitudeQuestions(res.data);
      setTestActive(true);
    } catch (error: any) {
      console.error('[Trainer] Aptitude load error:', error);
      alert(error.response?.data?.message || 'Failed to load questions. Is Supabase/LM Studio running?');
    } finally {
      setLoading(false);
    }
  };

  const handleAptitudeSubmit = async () => {
    setTestActive(false);
    setLoading(true);

    const questions = aptitudeQuestionsRef.current;
    const answers = selectedAnswersRef.current;

    const answersPayload = questions.map(q => {
      const selectedOption = answers[q._id] !== undefined ? answers[q._id] : -1;
      return {
        questionId: q._id,
        selectedOption: selectedOption,
        correctOption: q.correctOption,
        questionText: q.questionText,
        explanation: q.explanation
      };
    });

    try {
      const res = await axios.post('http://localhost:5000/api/placement/questions/submit', { answers: answersPayload }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTestResult(res.data);
    } catch (error: any) {
      console.error('[Trainer] Submit error:', error);
      alert(error.response?.data?.message || 'Failed to submit test.');
    } finally {
      setLoading(false);
    }
  };

  // Load Coding challenges
  useEffect(() => {
    if (activeTab === 'coding') {
      const loadCoding = async () => {
        setLoading(true);
        try {
          const res = await axios.get('http://localhost:5000/api/placement/coding/challenges?difficulty=all', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setCodingChallenges(res.data);
          if (res.data.length > 0) {
            selectChallenge(res.data[0]);
          }
        } catch (error: any) {
          console.error('[Trainer] Coding challenge load error:', error);
          alert(error.response?.data?.message || 'Failed to load coding challenges.');
        } finally {
          setLoading(false);
        }
      };
      loadCoding();
    }
  }, [activeTab]);

  const selectChallenge = (ch: Question) => {
    setCurrentChallenge(ch);
    setCode(ch.codeTemplate || '');
    setSubmissionReport(null);

    // Automatically switch editor language to match challenge
    const chLang = ch.category.includes(':') ? ch.category.split(':')[0] : 'javascript';
    if (chLang) {
      setLang(chLang.toLowerCase());
    }
  };

  useEffect(() => {
    if (!codingChallenges || codingChallenges.length === 0) return;

    const currentLang = currentChallenge?.category.includes(':') ? currentChallenge.category.split(':')[0] : 'javascript';
    if (!currentChallenge || currentLang.toLowerCase() !== lang.toLowerCase()) {
      const matching = codingChallenges.filter(ch => {
        const chLang = ch.category.includes(':') ? ch.category.split(':')[0] : 'javascript';
        return chLang.toLowerCase() === lang.toLowerCase();
      });
      if (matching.length > 0) {
        selectChallenge(matching[0]);
      } else {
        setCurrentChallenge(null);
        setCode('');
      }
    }
    setFilterCategory('all');
  }, [lang, codingChallenges]);

  const executeCode = async () => {
    if (!currentChallenge) return;
    setSubmittingCode(true);
    setSubmissionReport(null);

    try {
      const res = await axios.post('http://localhost:5000/api/placement/coding/submit', {
        questionId: currentChallenge._id,
        code,
        language: lang
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubmissionReport(res.data);
      if (res.data && res.data.status === 'Accepted') {
        setSolvedChallenges(prev => [...new Set([...prev, currentChallenge._id])]);
      }
    } catch (error: any) {
      console.error('[Trainer] Code execution error:', error);
      alert(error.response?.data?.message || 'Failed to execute code.');
      setSubmittingCode(false);
    } finally {
      setSubmittingCode(false);
    }
  };

  const loadNextChallenge = () => {
    if (!currentChallenge || displayedChallenges.length === 0) return;

    // Filter down to unsolved challenges matching current filters
    const unsolved = displayedChallenges.filter(ch => !solvedChallenges.includes(ch._id));

    if (unsolved.length > 0) {
      // Pick a random unsolved challenge
      const randomIndex = Math.floor(Math.random() * unsolved.length);
      selectChallenge(unsolved[randomIndex]);
    } else {
      // If all are solved, notify and select a random one from the total list
      const randomIndex = Math.floor(Math.random() * displayedChallenges.length);
      selectChallenge(displayedChallenges[randomIndex]);
      alert("All challenges matching your current filters have been completed! Loading a random solved challenge.");
    }
  };

  const startTechQuiz = async () => {
    setLoading(true);
    setTechResult(null);
    setTechAnswers({});
    setCurrentTechIndex(0);
    setTechTimer(600);

    try {
      const excludeParam = techExclusions.length > 0 ? `&exclude=${encodeURIComponent(techExclusions.join(','))}` : '';
      const res = await axios.get(`http://localhost:5000/api/placement/technical-quiz/questions?role=${encodeURIComponent(targetRole)}&level=${techLevel}${excludeParam}&limit=20`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTechQuestions(res.data);
      setTechActive(true);
    } catch (error: any) {
      console.error('[Trainer] Technical Quiz load error:', error);
      alert(error.response?.data?.message || 'Failed to load technical questions. Is the AI server running?');
    } finally {
      setLoading(false);
    }
  };

  const handleTechQuizSubmit = async () => {
    setTechActive(false);
    setLoading(true);

    const answersPayload = Object.keys(techAnswers).map(qId => {
      const q: any = techQuestions.find(qq => qq._id === qId);
      return {
        questionId: qId,
        selectedOption: techAnswers[qId],
        correctOption: q?.correctOption,
        questionText: q?.questionText,
        explanation: q?.explanation
      };
    });

    try {
      const res = await axios.post('http://localhost:5000/api/placement/technical-quiz/submit', { answers: answersPayload }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const timeSpentSecs = 600 - techTimer;
      const minutesSpent = Math.max(0.1, timeSpentSecs / 60);
      const capacityRate = parseFloat((answersPayload.length / minutesSpent).toFixed(1));

      const newExclusions = [...techExclusions, ...techQuestions.map(q => q.questionText)];
      setTechExclusions(newExclusions);

      setTechResult({
        ...res.data,
        timeSpent: formatTime(timeSpentSecs),
        capacityRate
      });
    } catch (error: any) {
      console.error('[Trainer] Technical Quiz submit error:', error);
      alert(error.response?.data?.message || 'Failed to submit quiz.');
    } finally {
      setLoading(false);
    }
  };


  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins}:${remaining < 10 ? '0' : ''}${remaining}`;
  };


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Main Navigation Tabs */}
          <div className="bg-white dark:bg-slate-950 p-4.5 rounded-3xl border border-slate-200/50 dark:border-slate-800/40 space-y-2.5 shadow-sm">
            <button
              onClick={() => {
                handleTabChange('aptitude');
                setTestResult(null);
                setTestActive(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                activeTab === 'aptitude'
                  ? 'bg-gradient-to-tr from-indigo-500 to-pink-500 text-white shadow-md'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/40'
              }`}
            >
              <BookOpen size={16} />
              <span>Aptitude Practice</span>
            </button>
            <button
              onClick={() => {
                handleTabChange('coding');
                setSubmissionReport(null);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                activeTab === 'coding'
                  ? 'bg-gradient-to-tr from-indigo-500 to-pink-500 text-white shadow-md'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/40'
              }`}
            >
              <Code size={16} />
              <span>Coding Sandbox</span>
            </button>
            <button
              onClick={() => {
                handleTabChange('technical');
                setTechResult(null);
                setTechActive(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                activeTab === 'technical'
                  ? 'bg-gradient-to-tr from-indigo-500 to-pink-500 text-white shadow-md'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/40'
              }`}
            >
              <Sparkles size={16} />
              <span>Technical Quiz</span>
            </button>
          </div>

          {/* Choose Topic Sidebar Menu (Aptitude Tab only) */}
          {activeTab === 'aptitude' && !testActive && (
            <div className="bg-white dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/40 p-4.5 rounded-3xl space-y-4 shadow-sm">
              <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-2">
                Choose Topic
              </div>
              <div className="space-y-1">
                {APTITUDE_TOPICS.map((topic) => {
                  const Icon = topic.icon;
                  const isActive = selectedTopic === topic.id;
                  return (
                    <button
                      key={topic.id}
                      onClick={() => {
                        setSelectedTopic(topic.id);
                        setTestResult(null);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-xs font-semibold transition-all border ${
                        isActive
                          ? 'bg-indigo-500/10 border-indigo-500/25 text-indigo-650 dark:text-indigo-400 font-bold'
                          : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/30'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon size={16} className={isActive ? 'text-indigo-500' : 'text-slate-400'} />
                        <span>{topic.name}</span>
                      </div>
                      {topic.badge && (
                        <span className="text-[8px] bg-pink-500/15 text-pink-500 font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider">
                          {topic.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Workspace Column */}
        <div className="lg:col-span-3 space-y-6">
          {/* Header section with Timer (only when test is active) */}
          {activeTab === 'aptitude' && testActive && (
            <div className="flex justify-between items-center bg-white dark:bg-slate-950 p-4 rounded-3xl border border-slate-200/50 dark:border-slate-800/40 shadow-sm">
              <span className="text-xs font-bold text-indigo-500 uppercase tracking-wider">
                {APTITUDE_TOPICS.find(t => t.id === selectedTopic)?.name} Placement Practice
              </span>
            </div>
          )}

          {activeTab === 'technical' && techActive && (
            <div className="flex justify-between items-center bg-white dark:bg-slate-950 p-4 rounded-3xl border border-slate-200/50 dark:border-slate-800/40 shadow-sm">
              <span className="text-xs font-bold text-indigo-500 uppercase tracking-wider">
                Technical Timed Quiz
              </span>
              <div className="flex items-center gap-1.5 text-xs font-bold text-pink-500 bg-pink-500/10 px-3 py-1.5 rounded-xl border border-pink-500/20">
                <Clock size={14} className="animate-spin" />
                <span>Timer: {formatTime(techTimer)}</span>
              </div>
            </div>
          )}

          {/* VIEW A: APTITUDE TESTS */}
          {activeTab === 'aptitude' && (
            <div className="space-y-6">
              {!testActive && !testResult && (
                <div className="glass-card p-12 rounded-3xl border border-slate-200/50 dark:border-slate-800/40 text-center space-y-5 max-w-xl mx-auto shadow-sm">
                  <BookOpen size={48} className="text-indigo-500 mx-auto" />
                  <h2 className="text-xl font-extrabold tracking-tight">
                    {APTITUDE_TOPICS.find(t => t.id === selectedTopic)?.name} Practice
                  </h2>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Solve random {APTITUDE_TOPICS.find(t => t.id === selectedTopic)?.name} placement evaluation questions one-by-one.
                  </p>
              <button
                onClick={startAptitudeTest}
                disabled={loading}
                className={`bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold px-8 py-3.5 rounded-2xl shadow-lg transition-all ${loading ? 'opacity-70 cursor-wait' : 'hover:scale-[1.02]'}`}
              >
                {loading ? 'Booting AI Generator...' : 'Start Practicing'}
              </button>
            </div>
          )}

          {testActive && aptitudeQuestions.length > 0 && (
            <div className="space-y-8 max-w-xl mx-auto flex flex-col items-center">
              {/* 3D Animated Timer */}
              <div className="timer-3d-container mb-4">
                <div className="timer-3d-scene">
                  {/* Base Shadow Ring */}
                  <div className="timer-3d-layer timer-3d-layer-base">
                    <svg className="w-32 h-32 transform rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="54"
                        fill="none"
                        stroke="rgba(99, 102, 241, 0.15)"
                        strokeWidth="8"
                      />
                    </svg>
                  </div>
                  
                  {/* Mid Progress Ring */}
                  <div className="timer-3d-layer timer-3d-layer-progress">
                    <svg className="w-32 h-32 transform -rotate-90">
                      <defs>
                        <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#6366f1" />
                          <stop offset="100%" stopColor="#d946ef" />
                        </linearGradient>
                      </defs>
                      <circle
                        cx="64"
                        cy="64"
                        r="54"
                        fill="none"
                        stroke="url(#timerGradient)"
                        strokeWidth="8"
                        strokeDasharray="339.3"
                        strokeDashoffset={339.3 - (339.3 * aptitudeTimer) / 600}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-linear"
                      />
                    </svg>
                  </div>
                  
                  {/* Top Glassmorphic Timer Card */}
                  <div className={`timer-3d-display ${aptitudeTimer <= 60 ? 'timer-pulse-red' : ''}`}>
                    <div className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-sans font-bold">
                      Time Left
                    </div>
                    <div className={`text-2xl font-extrabold font-mono mt-0.5 tracking-tighter ${
                      aptitudeTimer <= 60 
                        ? 'text-red-500' 
                        : 'bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text text-transparent'
                    }`}>
                      {formatTime(aptitudeTimer)}
                    </div>
                    <div className="text-[8px] text-slate-500 dark:text-slate-600 mt-1 font-sans font-medium">
                      Q {currentAptitudeIndex + 1} of 10
                    </div>
                  </div>
                </div>
              </div>

              {/* Question Navigation Palette */}
              <div className="flex justify-center flex-wrap gap-2 mb-2 w-full max-w-lg">
                {aptitudeQuestions.map((_, idx) => {
                  const qId = aptitudeQuestions[idx]._id;
                  const isAnswered = selectedAnswers[qId] !== undefined;
                  const isActive = idx === currentAptitudeIndex;
                  return (
                    <button
                      key={idx}
                      onClick={() => setCurrentAptitudeIndex(idx)}
                      className={`w-8 h-8 rounded-xl text-[10px] font-black transition-all border flex items-center justify-center ${
                        isActive 
                          ? 'bg-indigo-600 text-white border-indigo-500 ring-2 ring-indigo-500/25 shadow-md shadow-indigo-600/10'
                          : isAnswered
                          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500 font-bold'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              {/* Question Card */}
              {(() => {
                const q = aptitudeQuestions[currentAptitudeIndex];
                if (!q) return null;
                const { cleanText, imageUrl } = parseQuestionImage(q.questionText);
                return (
                  <div className="glass-card w-full p-6.5 rounded-3xl border border-slate-200/50 dark:border-slate-800/40 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] bg-indigo-500/15 text-indigo-500 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Question {currentAptitudeIndex + 1} of 10
                      </span>
                      <span className="text-[9px] text-slate-400 capitalize">{q.category}</span>
                    </div>
                    {imageUrl && (
                      <div className="w-full overflow-hidden rounded-2xl border border-slate-250/60 dark:border-slate-800/50 bg-slate-50 dark:bg-slate-900/60 p-2.5 flex justify-center items-center shadow-inner">
                        <img 
                          src={imageUrl} 
                          alt="Question Illustration" 
                          className="max-h-64 object-contain rounded-xl transition-all duration-300 hover:scale-[1.015]" 
                        />
                      </div>
                    )}
                    <h3 className="font-bold text-xs">{cleanText}</h3>
                    <div className="grid grid-cols-1 gap-3.5">
                      {q.options?.map((opt, oIdx) => (
                        <button
                          key={oIdx}
                          onClick={() => setSelectedAnswers({ ...selectedAnswers, [q._id]: oIdx })}
                          className={`text-left p-3.5 rounded-2xl text-xs font-medium border transition-colors ${
                            selectedAnswers[q._id] === oIdx
                              ? 'border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold'
                              : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 hover:bg-slate-100 dark:hover:bg-slate-800/40'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* Navigation controls */}
              <div className="flex gap-4 w-full">
                {currentAptitudeIndex > 0 && (
                  <button
                    onClick={() => setCurrentAptitudeIndex(prev => prev - 1)}
                    className="w-1/2 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-300 font-bold py-3.5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 transition-all text-xs"
                  >
                    Previous Question
                  </button>
                )}
                <button
                  onClick={handleNextQuestion}
                  className={`${currentAptitudeIndex > 0 ? 'w-1/2' : 'w-full'} bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3.5 rounded-2xl shadow-lg hover:scale-[1.01] transition-all text-xs`}
                >
                  {currentAptitudeIndex < aptitudeQuestions.length - 1 ? 'Next Question' : 'Finish & Submit'}
                </button>
              </div>
            </div>
          )}

          {testResult && (
            <div className="space-y-8 max-w-4xl mx-auto">
              {/* Score summary panel */}
              <div className="glass-card p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800/40 text-center space-y-4">
                {testResult.percentage >= 80 ? (
                  <Award size={40} className="text-indigo-500 mx-auto" />
                ) : testResult.percentage >= 50 ? (
                  <CheckCircle size={40} className="text-emerald-500 mx-auto" />
                ) : (
                  <AlertTriangle size={40} className="text-amber-500 mx-auto" />
                )}
                <h2 className="text-xl font-extrabold tracking-tight">
                  {testResult.percentage >= 80 
                    ? 'Outstanding Performance! 🌟' 
                    : testResult.percentage >= 50 
                    ? 'Good Job! Keep Practicing 👍' 
                    : 'Room for Improvement! Keep Learning 💪'}
                </h2>
                <div className="text-3xl font-extrabold text-indigo-500">
                  {testResult.score} / {testResult.total} Correct ({testResult.percentage}%)
                </div>
                <button
                  onClick={startAptitudeTest}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3 px-8 rounded-2xl shadow-lg hover:scale-[1.02] transition-all inline-block text-xs"
                >
                  Start New Practice Session
                </button>
              </div>

              {/* Explanations checklists */}
              <div className="space-y-6">
                <h3 className="font-bold text-sm">Detailed Solution Breakdown</h3>
                {testResult.results.map((res: any, idx: number) => {
                  const q = aptitudeQuestions.find(qq => qq._id === res.questionId);
                  return (
                    <div key={idx} className="glass-card p-6.5 rounded-3xl border border-slate-200/50 dark:border-slate-800/40 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {res.isCorrect ? (
                            <CheckCircle size={16} className="text-emerald-500" />
                          ) : (
                            <AlertTriangle size={16} className="text-red-500" />
                          )}
                          <h4 className="font-bold text-xs">Question {idx + 1}</h4>
                        </div>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          res.isCorrect 
                            ? 'bg-emerald-500/15 text-emerald-500' 
                            : 'bg-red-500/15 text-red-500'
                        }`}>
                          {res.isCorrect ? 'Correct' : res.selectedOption === -1 ? 'Timed Out' : 'Incorrect'}
                        </span>
                      </div>
                      
                      {(() => {
                        const { cleanText, imageUrl } = parseQuestionImage(res.questionText);
                        return (
                          <>
                            {imageUrl && (
                              <div className="w-full overflow-hidden rounded-2xl border border-slate-200/50 dark:border-slate-800/40 bg-slate-50 dark:bg-slate-900/60 p-2 flex justify-center items-center max-w-sm mb-2 shadow-inner">
                                <img 
                                  src={imageUrl} 
                                  alt="Question Illustration" 
                                  className="max-h-40 object-contain rounded-xl" 
                                />
                              </div>
                            )}
                            <p className="text-xs text-slate-700 dark:text-slate-350 font-semibold">{cleanText}</p>
                          </>
                        );
                      })()}
                      
                      {/* Full Options Display */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        {q?.options?.map((opt, oIdx) => {
                          const isCorrectChoice = oIdx === q.correctOption;
                          const isUserChoice = oIdx === res.selectedOption;
                          
                          let optStyle = 'border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/20';
                          if (isCorrectChoice) {
                            optStyle = 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold';
                          } else if (isUserChoice && !isCorrectChoice) {
                            optStyle = 'border-red-500 bg-red-500/10 text-red-600 dark:text-red-400 font-bold';
                          }

                          return (
                            <div
                              key={oIdx}
                              className={`p-3 rounded-2xl text-xs font-medium border flex items-center justify-between transition-colors ${optStyle}`}
                            >
                              <span>{opt}</span>
                              {isCorrectChoice && (
                                <span className="text-[8px] bg-emerald-500 text-white font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider scale-90">
                                  Correct Answer
                                </span>
                              )}
                              {isUserChoice && !isCorrectChoice && (
                                <span className="text-[8px] bg-red-500 text-white font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider scale-90">
                                  Your Choice
                                </span>
                              )}
                              {isUserChoice && isCorrectChoice && (
                                <span className="text-[8px] bg-emerald-600 text-white font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider scale-90">
                                  Your Choice (Correct)
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Explanation box */}
                      <div className="bg-slate-100 dark:bg-slate-900/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-850 text-[11px] leading-relaxed space-y-1.5">
                        <div className="font-bold text-indigo-400 flex items-center gap-1">
                          <HelpCircle size={12} />
                          <span>Detailed Explanation & Derivation:</span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400">{res.explanation}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW B: CODING COMPILER SANDBOX */}
      {activeTab === 'coding' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left panel: list challenges */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-sm text-indigo-400 font-sans tracking-tight">Coding Sheet Challenges</h3>
              {solvedChallenges.length > 0 && (
                <button
                  onClick={resetCodingProgress}
                  className="text-[9px] font-bold text-slate-400 hover:text-red-500 transition-colors"
                >
                  Reset Progress
                </button>
              )}
            </div>
            
            {/* Difficulty and Category filters */}
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div>
                <label className="block font-bold text-slate-400 uppercase mb-1">Difficulty</label>
                <select
                  value={filterDifficulty}
                  onChange={(e) => setFilterDifficulty(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-1.5 outline-none focus:border-indigo-500 cursor-pointer text-slate-700 dark:text-slate-200"
                >
                  <option value="all">All Difficulties</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-400 uppercase mb-1">Category</label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-1.5 outline-none focus:border-indigo-500 cursor-pointer text-slate-700 dark:text-slate-200 text-ellipsis overflow-hidden whitespace-nowrap"
                >
                  <option value="all">All Categories</option>
                  {availableCategories.map(cat => (
                    <option key={cat} value={cat.toLowerCase()}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {loading ? (
              <div className="p-8 text-center bg-slate-100/50 dark:bg-slate-900/50 rounded-2xl border border-slate-200/50 dark:border-slate-800/50">
                <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                <div className="text-xs font-bold text-indigo-500 animate-pulse">Booting AI Generator...<br/>Fetching DSA challenges</div>
              </div>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {displayedChallenges.map((ch) => {
                  const isSolved = solvedChallenges.includes(ch._id);
                  return (
                    <button
                      key={ch._id}
                      onClick={() => selectChallenge(ch)}
                      className={`w-full text-left p-4 rounded-2xl border transition-all ${
                        currentChallenge?._id === ch._id
                          ? 'border-indigo-500 bg-indigo-500/10'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <h4 className="font-bold text-xs truncate max-w-[70%] flex items-center gap-1.5">
                          {isSolved && <CheckCircle size={12} className="text-emerald-500 shrink-0" />}
                          <span className={isSolved ? 'line-through text-slate-400 dark:text-slate-500' : ''}>
                            {getChallengeTitle(ch.questionText)}
                          </span>
                        </h4>
                        <span className={`text-[8px] px-1.5 py-0.5 rounded uppercase font-bold ${
                          ch.difficulty.toLowerCase() === 'easy'
                            ? 'bg-emerald-500/15 text-emerald-500'
                            : ch.difficulty.toLowerCase() === 'medium'
                            ? 'bg-amber-500/15 text-amber-500'
                            : 'bg-rose-500/15 text-rose-500'
                        }`}>
                          {ch.difficulty}
                        </span>
                      </div>
                      <span className="text-[9px] text-indigo-500 font-bold block mt-1.5 capitalize">{ch.category} Challenge</span>
                    </button>
                  );
                })}
                {displayedChallenges.length === 0 && (
                  <div className="text-center py-8 text-xs text-slate-500">
                    No challenges found matching the filters.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right panel: Live compilation editor */}
          <div className="lg:col-span-2 space-y-6">
            {currentChallenge ? (
              <div className="glass-card p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/40 space-y-5">
                <div className="space-y-2">
                  <h3 className="font-bold text-sm">Coding Challenge Description</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-100 dark:bg-slate-900/60 p-4.5 rounded-2xl border border-slate-200 dark:border-slate-850">
                    {currentChallenge.questionText}
                  </p>
                </div>

                {/* Editor Console */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
                    <span>main.{lang === 'python' ? 'py' : lang === 'sql' ? 'sql' : lang === 'cpp' ? 'cpp' : lang === 'java' ? 'java' : lang === 'c' ? 'c' : lang === 'html' ? 'html' : 'js'}</span>
                    <select
                      value={lang}
                      onChange={(e) => setLang(e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded-md px-2 py-1 outline-none text-slate-300 capitalize cursor-pointer focus:border-indigo-500"
                    >
                      <option value="javascript">JavaScript</option>
                      <option value="java">Java</option>
                      <option value="python">Python</option>
                      <option value="cpp">C++</option>
                      <option value="c">C</option>
                      <option value="html">HTML</option>
                      <option value="sql">SQL</option>
                    </select>
                  </div>
                  <textarea
                    rows={8}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full font-mono text-xs bg-slate-950 text-emerald-400 p-4.5 rounded-2xl border border-slate-800 outline-none focus:ring-1 focus:ring-indigo-500 leading-relaxed"
                  />
                </div>

                {/* Compiler Output reports */}
                {submissionReport && (
                  <div className="space-y-4">
                    <div className={`p-4 rounded-2xl border ${
                      submissionReport.status === 'Accepted'
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                        : 'bg-red-500/10 border-red-500/20 text-red-500'
                    } text-xs font-mono space-y-1.5`}>
                      <div className="font-bold uppercase">{submissionReport.status}</div>
                      <div>Score achieved: {submissionReport.score}/100</div>
                      {submissionReport.errorMessage && (
                        <div className="text-[10px] text-red-400/90 whitespace-pre-wrap">{submissionReport.errorMessage}</div>
                      )}
                      <div>Test cases passed: {submissionReport.passedCount} / {submissionReport.testCasesCount}</div>
                    </div>

                    {submissionReport.status === 'Accepted' && (
                      <div className="p-4 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 dark:bg-indigo-950/20 flex flex-col sm:flex-row justify-between items-center gap-3">
                        <div className="flex items-center gap-2">
                          <CheckCircle size={16} className="text-emerald-500 shrink-0" />
                          <span className="text-xs text-slate-700 dark:text-slate-350 font-semibold font-sans">
                            All test cases passed! Ready for another challenge?
                          </span>
                        </div>
                        <button
                          onClick={loadNextChallenge}
                          className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-95 text-white font-bold text-[10px] px-4 py-2 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1 font-sans"
                        >
                          <span>Ask Another Question</span>
                          <span>➔</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Execute controls */}
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => setCode(currentChallenge.codeTemplate || '')}
                    className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    <RefreshCw size={12} /> Reset code
                  </button>
                  <button
                    onClick={executeCode}
                    disabled={submittingCode}
                    className="flex items-center gap-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-md transition-all hover:scale-[1.01]"
                  >
                    {submittingCode ? (
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      <>
                        <Play size={12} />
                        <span>Run Compilation</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-16 text-slate-500">
                Select a DSA coding challenge to boot editor console.
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW C: TECHNICAL TIMED CAPACITY QUIZ */}
      {activeTab === 'technical' && (
        <div className="space-y-6">
          {!techActive && !techResult && (
            <div className="glass-card p-12 rounded-3xl border border-slate-200/50 dark:border-slate-800/40 text-center space-y-5 max-w-xl mx-auto">
              <Sparkles size={48} className="text-indigo-500 mx-auto animate-pulse" />
              <h2 className="text-xl font-extrabold tracking-tight">Vibrant Technical Quiz (10-Min Speed Capacity Test)</h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                Test your capacity: answer as many conceptual multiple-choice questions as you can in exactly 10 minutes.
              </p>
              
              <div className="text-left space-y-2 max-w-sm mx-auto">
                <label className="block text-[10px] font-bold text-slate-400 uppercase">Target Job Role</label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. Software Engineer, React Developer"
                  className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="text-left space-y-2 max-w-sm mx-auto">
                <label className="block text-[10px] font-bold text-slate-400 uppercase">Difficulty Level</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setTechLevel('beginner')}
                    className={`py-2 rounded-xl text-[10px] font-bold border transition-colors ${
                      techLevel === 'beginner'
                        ? 'border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 hover:bg-slate-100 dark:hover:bg-slate-800/40 text-slate-500'
                    }`}
                  >
                    Beginner Level
                  </button>
                  <button
                    type="button"
                    onClick={() => setTechLevel('mid-level')}
                    className={`py-2 rounded-xl text-[10px] font-bold border transition-colors ${
                      techLevel === 'mid-level'
                        ? 'border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 hover:bg-slate-100 dark:hover:bg-slate-800/40 text-slate-500'
                    }`}
                  >
                    Mid-Level Stage
                  </button>
                  <button
                    type="button"
                    onClick={() => setTechLevel('experienced')}
                    className={`py-2 rounded-xl text-[10px] font-bold border transition-colors ${
                      techLevel === 'experienced'
                        ? 'border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 hover:bg-slate-100 dark:hover:bg-slate-800/40 text-slate-500'
                    }`}
                  >
                    Experience Level
                  </button>
                </div>
              </div>

              <button
                onClick={startTechQuiz}
                disabled={loading}
                className={`bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold px-8 py-3.5 rounded-2xl shadow-lg transition-all ${loading ? 'opacity-70 cursor-wait' : 'hover:scale-[1.02]'} w-full max-w-sm mx-auto block`}
              >
                {loading ? 'Booting AI Quiz...' : 'Launch Speed Quiz'}
              </button>
            </div>
          )}

          {techActive && techQuestions.length > 0 && (
            <div className="space-y-6 max-w-2xl mx-auto">
              {/* Question card */}
              <div className="glass-card p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800/40 space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] bg-indigo-500/15 text-indigo-500 font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Question {currentTechIndex + 1} of {techQuestions.length}
                  </span>
                  <span className="text-[9px] text-slate-400 capitalize font-mono">Difficulty: {techQuestions[currentTechIndex].difficulty}</span>
                </div>
                
                <h3 className="font-extrabold text-sm leading-relaxed">{techQuestions[currentTechIndex].questionText}</h3>
                
                <div className="grid grid-cols-1 gap-3 pt-2">
                  {techQuestions[currentTechIndex].options?.map((opt, oIdx) => (
                    <button
                      key={oIdx}
                      onClick={() => setTechAnswers({ ...techAnswers, [techQuestions[currentTechIndex]._id]: oIdx })}
                      className={`text-left p-4 rounded-2xl text-xs font-medium border transition-all ${
                        techAnswers[techQuestions[currentTechIndex]._id] === oIdx
                          ? 'border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold shadow-sm'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 hover:bg-slate-100 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-850">
                  <button
                    onClick={() => {
                      if (currentTechIndex < techQuestions.length - 1) {
                        setCurrentTechIndex(prev => prev + 1);
                      } else {
                        handleTechQuizSubmit();
                      }
                    }}
                    className="text-xs font-bold text-slate-400 hover:text-slate-200"
                  >
                    Skip Question
                  </button>

                  <div className="flex gap-3">
                    <button
                      onClick={handleTechQuizSubmit}
                      className="bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs font-bold px-4 py-2.5 rounded-xl border border-red-500/20"
                    >
                      Finish Quiz
                    </button>
                    <button
                      onClick={() => {
                        if (currentTechIndex < techQuestions.length - 1) {
                          setCurrentTechIndex(prev => prev + 1);
                        } else {
                          handleTechQuizSubmit();
                        }
                      }}
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md hover:scale-[1.01]"
                    >
                      {currentTechIndex < techQuestions.length - 1 ? 'Next Question' : 'Finish & Grade'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {techResult && (
            <div className="space-y-8 max-w-3xl mx-auto">
              {/* Score rating panel */}
              <div className="glass-card p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800/40 text-center space-y-6">
                <Award size={44} className="text-indigo-500 mx-auto" />
                <div>
                  <h2 className="text-xl font-extrabold tracking-tight">Capacity Assessment Graded</h2>
                  <p className="text-xs text-slate-400 mt-1">Role: <span className="text-indigo-400 font-bold capitalize">{targetRole}</span></p>
                </div>

                {/* Rating badge */}
                <div className="inline-flex items-center gap-1.5 px-4.5 py-2 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 text-xs font-extrabold shadow-inner uppercase tracking-wider mx-auto">
                  <Sparkles size={14} className="animate-spin" />
                  <span>Rating: {techResult.rating}</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                  <div className="p-4 bg-slate-100/50 dark:bg-slate-900/40 border border-slate-200/20 rounded-2xl">
                    <div className="text-2xl font-extrabold text-indigo-500">{techResult.correctCount}</div>
                    <div className="text-[9px] text-slate-400 font-bold uppercase mt-1">Correct Answers</div>
                  </div>
                  <div className="p-4 bg-slate-100/50 dark:bg-slate-900/40 border border-slate-200/20 rounded-2xl">
                    <div className="text-2xl font-extrabold text-purple-500">{techResult.totalQuestions}</div>
                    <div className="text-[9px] text-slate-400 font-bold uppercase mt-1">Total Attempted</div>
                  </div>
                  <div className="p-4 bg-slate-100/50 dark:bg-slate-900/40 border border-slate-200/20 rounded-2xl">
                    <div className="text-2xl font-extrabold text-pink-500">{techResult.accuracy}%</div>
                    <div className="text-[9px] text-slate-400 font-bold uppercase mt-1">Accuracy Rating</div>
                  </div>
                  <div className="p-4 bg-gradient-to-tr from-indigo-500/10 to-pink-500/10 border border-indigo-500/20 rounded-2xl">
                    <div className="text-2xl font-extrabold text-amber-500">{techResult.capacityRate} Q/M</div>
                    <div className="text-[9px] text-slate-400 font-bold uppercase mt-1">Capacity Speed</div>
                  </div>
                </div>

                <div className="text-xs text-slate-500">
                  Time Spent: <span className="font-bold text-slate-700 dark:text-slate-350">{techResult.timeSpent}</span> / 10:00
                </div>

                <div className="pt-2">
                  <button
                    onClick={startTechQuiz}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-md transition-colors"
                  >
                    Retake Capacity Quiz
                  </button>
                </div>
              </div>

              {/* Explanations checklists */}
              {techResult.results && techResult.results.length > 0 && (
                <div className="space-y-6">
                  <h3 className="font-bold text-sm">Attempted Solutions Breakdown</h3>
                  {techResult.results.map((res: any, idx: number) => (
                    <div key={idx} className="glass-card p-6.5 rounded-3xl border border-slate-200/50 dark:border-slate-800/40 space-y-3">
                      <div className="flex items-center gap-2">
                        {res.isCorrect ? (
                          <CheckCircle size={16} className="text-emerald-500" />
                        ) : (
                          <AlertTriangle size={16} className="text-red-500" />
                        )}
                        <h4 className="font-bold text-xs">Question {idx + 1}</h4>
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-300">{res.questionText}</p>
                      <div className="bg-slate-100 dark:bg-slate-900/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-850 text-[11px] leading-relaxed space-y-1.5">
                        <div className="font-bold text-indigo-400">Explanation:</div>
                        <p className="text-slate-500 dark:text-slate-400">{res.explanation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
        </div>
      </div>
    </div>
  );
};
