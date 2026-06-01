import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, User as UserIcon, Shield, Chrome, Sparkles } from 'lucide-react';

export const LoginRegister: React.FC = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'student' | 'recruiter' | 'admin'>('student');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      if (forgotMode) {
        // Simulated reset link trigger
        setMessage(`A secure password reset link has been dispatched to ${email}.`);
        setLoading(false);
        return;
      }

      if (isLogin) {
        await login(email, password);
      } else {
        await register(name, email, password, role);
      }
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const triggerGoogleAuth = () => {
    setLoading(true);
    setTimeout(() => {
      // Direct mock Google Auth loading
      login('google.student@university.edu', 'googlesecret_123');
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-[calc(screen-16)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-[#070b13] relative overflow-hidden">
      {/* Glow blobs */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-md w-full space-y-8 glass-card border border-slate-200/50 dark:border-slate-800/40 p-8 rounded-3xl shadow-2xl relative bg-white/95 dark:bg-slate-950/95">
        {/* Brand details */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-indigo-500 to-pink-500 text-white p-2.5 rounded-2xl w-fit mx-auto shadow-md">
            <Sparkles size={20} className="animate-pulse" />
          </div>
          <h2 className="mt-4 text-2xl font-extrabold tracking-tight">
            {forgotMode ? 'Recover Password' : isLogin ? 'Sign In to PlacementAI' : 'Create Student Account'}
          </h2>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            {forgotMode
              ? 'Enter email to receive dynamic recovery token link'
              : 'Join thousand of freshers practicing coding & securing jobs'}
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs p-3 rounded-xl font-medium text-center">
            {error}
          </div>
        )}

        {message && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs p-3 rounded-xl font-medium text-center">
            {message}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Name field (Register only) */}
            {!isLogin && !forgotMode && (
              <div>
                <label className="block text-xs font-semibold mb-2">Full Name</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                    <UserIcon size={14} />
                  </span>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Apsara Roy"
                    className="pl-10 w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-3 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>
            )}

            {/* Email field */}
            <div>
              <label className="block text-xs font-semibold mb-2">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <Mail size={14} />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="apsara.roy@university.edu"
                  className="pl-10 w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-3 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Password field (Login & Register only) */}
            {!forgotMode && (
              <div>
                <label className="block text-xs font-semibold mb-2">Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                    <Lock size={14} />
                  </span>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-10 w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-3 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>
            )}

            {/* Role select (Register only) */}
            {!isLogin && !forgotMode && (
              <div>
                <label className="block text-xs font-semibold mb-2">Select Platform Role</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                    <Shield size={14} />
                  </span>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="pl-10 w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-3 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-600 dark:text-slate-300"
                  >
                    <option value="student">Student / Job Seeker</option>
                    <option value="recruiter">Corporate Recruiter</option>
                    <option value="admin">College Portal Administrator</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Extra utility row */}
          {isLogin && !forgotMode && (
            <div className="flex items-center justify-between text-xs">
              <span className="w-1"></span>
              <button
                type="button"
                onClick={() => setForgotMode(true)}
                className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Forgot Password?
              </button>
            </div>
          )}

          {/* Form action button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold py-3.5 rounded-2xl shadow-xl shadow-indigo-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all text-xs disabled:opacity-50"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : forgotMode ? (
              'Reset Password'
            ) : isLogin ? (
              'Sign In'
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Divider & Google signin */}
        {!forgotMode && (
          <div className="space-y-4 mt-6">
            <div className="relative flex items-center justify-center">
              <span className="absolute inset-x-0 h-px bg-slate-200 dark:bg-slate-800"></span>
              <span className="relative bg-white dark:bg-slate-950 px-3 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Or Continue With
              </span>
            </div>
            <button
              onClick={triggerGoogleAuth}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 py-3 rounded-2xl text-xs font-bold transition-all"
            >
              <Chrome size={14} className="text-red-500" />
              <span>Sign In with Google</span>
            </button>
          </div>
        )}

        {/* Toggle footer */}
        <div className="text-center text-xs mt-6">
          {forgotMode ? (
            <button
              onClick={() => { setForgotMode(false); setMessage(''); setError(''); }}
              className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Return to Login
            </button>
          ) : (
            <p className="text-slate-500">
              {isLogin ? "New to the platform?" : "Already have an account?"}{' '}
              <button
                onClick={() => { setIsLogin(!isLogin); setError(''); }}
                className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                {isLogin ? 'Register Now' : 'Sign In'}
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
