import React from 'react';
import { Bot, Code, Award, Users, BookOpen, RefreshCw } from 'lucide-react';

export const Features: React.FC = () => {
  const cards = [
    {
      title: 'AI Resume scoring',
      icon: <Award size={20} className="text-pink-500" />,
      desc: 'Our scanning engine maps your sections, checks skill densities, highlights missing operational keywords, and outputs a clear ATS percentage score.'
    },
    {
      title: 'Aptitude Practice Hub',
      icon: <BookOpen size={20} className="text-indigo-500" />,
      desc: 'Practice structured tests on Quant, Logical Reasoning, and Verbal skills with instant calculations, step-by-step math breakdowns, and strict timers.'
    },
    {
      title: 'Interactive Live Code Editor',
      icon: <Code size={20} className="text-emerald-500" />,
      desc: 'Build functional algorithms. Write tests in Python, C, SQL, and JS inside our Monaco-inspired console. Compiles with instant feedback.'
    },
    {
      title: 'Dynamic Mock AI Interviewer',
      icon: <Bot size={20} className="text-purple-500" />,
      desc: 'Simulate high-pressure technical and HR interviews. Utilizing voice-to-text dictation and speech voice synthesis responses.'
    },
    {
      title: 'Skill matching Job recommendations',
      icon: <Users size={20} className="text-blue-500" />,
      desc: 'No more generic listings. Our system maps job requirements against your current parsed skills to match internships and full-time careers.'
    },
    {
      title: 'Company Preparation Roadmaps',
      icon: <RefreshCw size={20} className="text-amber-500" />,
      desc: 'Access curated prep roadmaps tailored for corporate hiring tests (TCS, Razorpay, Amazon, Deloitte) to guide your study timelines.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight">Full Suite of Placement Tools</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Everything needed to land SDE and consultancy positions in top firms.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {cards.map((card, idx) => (
          <div
            key={idx}
            className="glass-card p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 hover:scale-[1.02] transition-transform duration-200"
          >
            <div className="p-3 bg-slate-100 dark:bg-slate-900 rounded-xl w-fit mb-4">
              {card.icon}
            </div>
            <h3 className="font-bold text-base mb-2">{card.title}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{card.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
