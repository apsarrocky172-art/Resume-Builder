import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Pricing: React.FC = () => {
  const plans = [
    {
      title: 'Free Student Basic',
      price: '₹0',
      period: 'forever',
      features: [
        '1 ATS-compliant resume builder profile',
        '2 live templates choice (Modern & Classic)',
        '3 aptitude mock tests / month',
        'Basic local compilation coding practice'
      ],
      cta: 'Get Started',
      accent: false
    },
    {
      title: 'Placement Pro Prep',
      price: '₹499',
      period: 'month',
      features: [
        'Unlimited AI Resume modifications & templates',
        'OpenAI Keyword density checklist and optimization suggestions',
        'Unlimited stateful vocal mock interview questions & grading',
        'Advanced Company Preparation tracks (Deloitte, Amazon, TCS)',
        'Personalized Job recommendation matching alerts'
      ],
      cta: 'Upgrade to Pro',
      accent: true
    },
    {
      title: 'College placement Cell',
      price: 'Custom',
      period: 'annually',
      features: [
        'Student profile overview dashboard metrics for admins',
        'Custom aptitude questions builder and challenge controller',
        'Excel metrics reports & cohort placement progress charts',
        'Internal recruiter profiles with job listing manager options'
      ],
      cta: 'Contact Sales',
      accent: false
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight">Flexible SaaS Subscriptions</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Upgrade your credentials and prep roadmaps to landing premium software jobs.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, idx) => (
          <div
            key={idx}
            className={`glass-card p-8 rounded-3xl border flex flex-col justify-between relative overflow-hidden ${
              plan.accent
                ? 'border-indigo-500 glow-ring bg-indigo-950/10'
                : 'border-slate-200/50 dark:border-slate-800/40'
            }`}
          >
            {plan.accent && (
              <span className="absolute top-4 right-4 bg-gradient-to-r from-indigo-500 to-pink-500 text-white text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                Most Popular
              </span>
            )}
            <div>
              <h3 className="font-extrabold text-lg text-slate-800 dark:text-white">{plan.title}</h3>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-extrabold tracking-tight">{plan.price}</span>
                <span className="text-xs text-slate-400 ml-1">/{plan.period}</span>
              </div>
              <ul className="mt-6 space-y-4">
                {plan.features.map((feat, fidx) => (
                  <li key={fidx} className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300">
                    <ShieldCheck size={14} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Link
              to="/login"
              className={`w-full text-center py-3 rounded-2xl text-xs font-bold transition-all mt-8 inline-block ${
                plan.accent
                  ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:to-pink-700 text-white shadow-lg shadow-indigo-500/20'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {plan.cta}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};
