/// <reference types="react" />
import React from 'react';
import { motion } from 'framer-motion';
import { Compass, Eye, ShieldCheck, Heart } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      {/* Hero Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <motion.div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
          Our Core Mission
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-extrabold tracking-tight"
        >
          Pioneering AI-Driven Placement Preparations
        </motion.h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
          We bridge the gap between academic education and modern industry demands by providing job seekers and fresh graduates with top-tier artificial intelligence tools to build, practice, and secure jobs.
        </p>
      </div>

      {/* Grid of Values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="glass-card p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 space-y-3">
          <div className="p-3 bg-pink-100 dark:bg-pink-950/40 text-pink-500 w-fit rounded-xl">
            <Compass size={20} />
          </div>
          <h3 className="font-bold text-base">Comprehensive Guidance</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            From writing a resume to passing complex verbal assessments and mock tech interviews, our platform trains candidates step-by-step.
          </p>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 space-y-3">
          <div className="p-3 bg-indigo-100 dark:bg-indigo-950/40 text-indigo-500 w-fit rounded-xl">
            <Eye size={20} />
          </div>
          <h3 className="font-bold text-base">Unbiased Evaluation</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Our state-of-the-art AI engines evaluate answer confidence, structure, and keyword overlap completely objectively.
          </p>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 space-y-3">
          <div className="p-3 bg-purple-100 dark:bg-purple-950/40 text-purple-500 w-fit rounded-xl">
            <ShieldCheck size={20} />
          </div>
          <h3 className="font-bold text-base">Enterprise Grade Security</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Your personal information, resume logs, and recorded audio transcriptions are fully hashed and encrypted locally.
          </p>
        </div>
      </div>

      {/* Team/Philosophy Highlight */}
      <div className="glass-card p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800/40 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <div className="bg-indigo-100 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 p-2 rounded-xl w-fit">
            <Heart size={20} />
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">Crafted for Placement Cells</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Tired of tracking student spreadsheets? Crack Place Ai integrates directly with universities to help professors monitor aptitude metrics, schedule mock interview deadlines, and review detailed candidate stats.
          </p>
          <div className="flex gap-4">
            <div>
              <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">12K+</div>
              <div className="text-[10px] text-slate-400">Colleges Partnered</div>
            </div>
            <div className="border-l border-slate-200 dark:border-slate-800 pl-4">
              <div className="text-2xl font-bold text-pink-600 dark:text-pink-400">98%</div>
              <div className="text-[10px] text-slate-400">Satisfaction Score</div>
            </div>
          </div>
        </div>
        <div className="rounded-2xl overflow-hidden bg-slate-900 aspect-video flex items-center justify-center p-6 text-center border border-slate-800">
          <div>
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-indigo-500 mx-auto flex items-center justify-center text-white text-xl font-bold mb-4">AI</div>
            <h4 className="text-white font-bold text-sm">Advanced Agentic Learning Systems</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">Generating instant evaluations on key technical coding challenges and verbal questions.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
