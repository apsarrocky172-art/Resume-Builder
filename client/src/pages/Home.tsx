import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Bot, Code, Cpu, Award, Users, Star, Sparkles, ShieldCheck, ChevronRight } from 'lucide-react';

export const Home: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  };

  const stats = [
    { label: 'Resumes Generated', value: '150K+', icon: <Award className="text-pink-400" /> },
    { label: 'Mock Interviews Passed', value: '85K+', icon: <Bot className="text-indigo-400" /> },
    { label: 'Placement Rate Success', value: '94.2%', icon: <Sparkles className="text-amber-400" /> },
    { label: 'Partner Institutions', value: '450+', icon: <Users className="text-emerald-400" /> }
  ];

  const features = [
    {
      title: 'AI Resume Engine',
      desc: 'Build recruiter-approved, single-column resumes. Get dynamic ATS keyword checks and optimization feedback driven by our core models.',
      icon: <Cpu size={24} className="text-pink-500" />,
      color: 'from-pink-500/10 to-pink-500/20'
    },
    {
      title: 'Aptitude & Code Sandbox',
      desc: 'Practice logical & quantitative reasoning with immediate grading. Write compiler challenges in C, Java, JavaScript, Python, and SQL.',
      icon: <Code size={24} className="text-indigo-500" />,
      color: 'from-indigo-500/10 to-indigo-500/20'
    },
    {
      title: 'Simulated Vocal Mock Interview',
      desc: 'Practice text & voice-to-text mocks. Get detailed breakdown scores for communication flow, technical facts, and confidence levels.',
      icon: <Bot size={24} className="text-purple-500" />,
      color: 'from-purple-500/10 to-purple-500/20'
    }
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50 dark:bg-[#070b13]">
      {/* Background blobs */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-indigo-500/10 rounded-full filter blur-[100px] pointer-events-none"></div>
      <div className="absolute top-1/3 right-1/10 w-[500px] h-[500px] bg-pink-500/5 rounded-full filter blur-[150px] pointer-events-none"></div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center space-y-8"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-indigo-200 dark:border-indigo-950 bg-indigo-50/50 dark:bg-indigo-950/20 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
            <Sparkles size={12} className="animate-pulse" />
            <span>Empowered by Next-Gen Agentic AI Services</span>
          </motion.div>

          {/* Heading */}
          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-extrabold tracking-tight">
            Build Resumes. Practice Coding.<br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
              Conquer Placement Exams.
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p variants={itemVariants} className="max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-300">
            PlacementAI is the ultimate SaaS ecosystem that designs stunning, ATS-friendly resumes, evaluates live speech mock interviews, and trains you for coding assessments.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              to="/resume"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold px-8 py-3.5 rounded-2xl shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <span>Build AI Resume</span>
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/trainer"
              className="w-full sm:w-auto flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-[#070b13]/70 backdrop-blur hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold px-8 py-3.5 rounded-2xl transition-all"
            >
              <span>Start Mock Tests</span>
            </Link>
          </motion.div>
        </motion.div>

        {/* Floating Mockup Preview */}
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8, ease: 'easeOut' }}
          className="mt-16 relative glass-card p-2.5 rounded-3xl glow-ring overflow-hidden shadow-2xl border border-slate-200/50 dark:border-slate-800/40 max-w-5xl mx-auto"
        >
          <div className="rounded-2xl overflow-hidden bg-slate-900 aspect-video flex flex-col">
            {/* Window bar */}
            <div className="bg-slate-950 px-4 py-3 flex items-center justify-between border-b border-slate-800/50">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
                <span className="w-3 h-3 rounded-full bg-yellow-500/80"></span>
                <span className="w-3 h-3 rounded-full bg-green-500/80"></span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono tracking-wider">https://placementai.sasa.dev/dashboard</span>
              <span className="w-4"></span>
            </div>
            {/* Visual Screen Mock */}
            <div className="flex-1 p-6 grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-950 text-white font-sans text-left">
              {/* Left Widget */}
              <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-indigo-400 uppercase tracking-widest">ATS Evaluator</h4>
                  <div className="text-3xl font-extrabold mt-2 text-indigo-100">89% Score</div>
                  <p className="text-[11px] text-slate-400 mt-2">Resume is extremely optimized. Add "System Design" to boost score to 95%.</p>
                </div>
                <div className="mt-4 flex gap-1.5 flex-wrap">
                  <span className="text-[9px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full">✓ Relational DB</span>
                  <span className="text-[9px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full">✓ API Design</span>
                  <span className="text-[9px] bg-slate-800 text-indigo-400 px-2 py-0.5 rounded-full border border-indigo-500/20 font-bold">+ Jest</span>
                </div>
              </div>
              {/* Center Widget */}
              <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-purple-400 uppercase tracking-widest">Placement Roadmap</h4>
                  <div className="text-lg font-bold mt-2 text-purple-100">Razorpay Prep Track</div>
                  <div className="space-y-2.5 mt-3">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                      <span>Quantitative Aptitude MCQs</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                      <span>Vocal Technical Mock</span>
                    </div>
                  </div>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="w-2/3 bg-purple-500 h-full rounded-full"></div>
                </div>
              </div>
              {/* Right Widget */}
              <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-pink-400 uppercase tracking-widest">Mock Interview AI</h4>
                  <div className="bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-[10px] font-mono text-slate-300 mt-2 h-24 overflow-hidden">
                    <span className="text-pink-400">AI:</span> Can you explain relational indexing?<br />
                    <span className="text-indigo-400">User:</span> Indexes create sorted structural pathways which speeds up SELECT statements...
                  </div>
                </div>
                <button className="bg-gradient-to-r from-pink-500 to-purple-500 py-1.5 rounded-lg text-[10px] font-bold text-center">
                  Review Oral Report
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Stats Counter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((st, idx) => (
            <motion.div
              key={idx}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card p-5 rounded-2xl shadow-sm text-center flex flex-col items-center gap-2 border border-slate-200/50 dark:border-slate-800/40"
            >
              <div className="p-2.5 bg-slate-100 dark:bg-slate-900 rounded-xl">
                {st.icon}
              </div>
              <div className="text-2xl md:text-3xl font-extrabold tracking-tight">{st.value}</div>
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400">{st.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Feature Showcase Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-200/50 dark:border-slate-800/40">
        <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Everything You Need to Succeed</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Get ahead of recruiters with customized prep modules and AI-driven skill matrices.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feat, idx) => (
            <motion.div
              key={idx}
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
              className="glass-card p-6 rounded-2xl shadow-sm border border-slate-200/50 dark:border-slate-800/40 flex flex-col justify-between"
            >
              <div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${feat.color} flex items-center justify-center mb-5`}>
                  {feat.icon}
                </div>
                <h3 className="text-lg font-bold mb-2">{feat.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{feat.desc}</p>
              </div>
              <Link to="/resume" className="mt-5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:gap-2 transition-all">
                <span>Try Feature</span>
                <ChevronRight size={14} />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-200/50 dark:border-slate-800/40 text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="flex justify-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={18} className="fill-amber-400 text-amber-400" />
            ))}
          </div>
          <blockquote className="text-xl font-medium text-slate-700 dark:text-slate-300 leading-relaxed italic">
            "PlacementAI helped me increase my resume's ATS score from 62 to 88 within two minutes. The simulated technical interview questions were spot-on! I scored my SDE internship at Razorpay last week."
          </blockquote>
          <div>
            <div className="font-extrabold text-sm text-slate-900 dark:text-white">Aravind Sharma</div>
            <div className="text-xs text-slate-400 mt-1">Computer Science Student, NIT Trichy</div>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-950 to-purple-900 text-white py-16 text-center">
        <div className="max-w-3xl mx-auto px-4 space-y-6">
          <h2 className="text-3xl md:text-4xl font-extrabold">Ready to Boost Your Employability?</h2>
          <p className="text-xs text-slate-300 leading-relaxed">Join thousands of college candidates preparing, tracking, and nailing placement opportunities at top global firms.</p>
          <div className="pt-4">
            <Link
              to="/login"
              className="bg-white text-indigo-900 font-bold px-8 py-3.5 rounded-2xl shadow-xl hover:bg-slate-100 hover:scale-[1.02] active:scale-[0.98] transition-all inline-block text-sm"
            >
              Sign Up Now For Free
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
