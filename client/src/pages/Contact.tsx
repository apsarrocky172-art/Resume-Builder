import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* Visual Support Info Column */}
      <div className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight">Get in Touch</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Have questions about our university subscription programs or need help debugging a coding compilation issue? Shoot us a message!
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 rounded-xl">
              <Mail size={18} />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-bold">Email Support</div>
              <div className="text-xs font-semibold">support@crackplaceai.com</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-3 bg-pink-50 dark:bg-pink-950/40 text-pink-500 rounded-xl">
              <Phone size={18} />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-bold">Call Center</div>
              <div className="text-xs font-semibold">+91 (800) 456-7890</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-50 dark:bg-purple-950/40 text-purple-500 rounded-xl">
              <MapPin size={18} />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-bold">Headquarters</div>
              <div className="text-xs font-semibold">MG Road, Bangalore, KA, India</div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Card Column */}
      <div className="glass-card p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800/40">
        <h3 className="font-bold text-lg mb-6">Send support Request</h3>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold mb-2">Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Alex Johnson"
              className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4.5 py-3 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-2">Email Address</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="alex.johnson@university.edu"
              className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4.5 py-3 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-2">Message</label>
            <textarea
              required
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Write your suggestions here..."
              className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4.5 py-3 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none"
            />
          </div>

          {submitted && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs p-3.5 rounded-xl font-medium">
              ✓ Support request transmitted successfully! We'll reply within 24 hours.
            </div>
          )}

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3.5 rounded-2xl shadow-lg transition-all text-xs"
          >
            <Send size={14} />
            <span>Send Message</span>
          </button>
        </form>
      </div>
    </div>
  );
};
