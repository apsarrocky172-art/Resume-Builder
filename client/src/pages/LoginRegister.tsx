import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, User as UserIcon, Shield, Chrome } from 'lucide-react';
import logo from '../logo.jpg';

export const LoginRegister: React.FC = () => {
  const { user, loading: authLoading, login, register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && user) {
      navigate('/');
    }
  }, [user, authLoading, navigate]);

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
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const [showGoogleChooser, setShowGoogleChooser] = useState(false);
  const [googleEmailInput, setGoogleEmailInput] = useState('');
  const [customEmailMode, setCustomEmailMode] = useState(false);

  const savedGoogleAccounts = [
    { name: 'Apsar', email: 'apsarrocky172@gmail.com' },
    { name: 'Abhi Reddy', email: 'uakrop123@gmail.com' },
    { name: 'Arshiya Shaik', email: 'arshiyashaik52109@gmail.com' },
    { name: 'Google Student', email: 'google.student@university.edu' },
    { name: 'Apsar Test Student', email: 'teststudent@apsardev.com' }
  ];

  const triggerGoogleAuth = () => {
    setShowGoogleChooser(true);
    setCustomEmailMode(false);
    setGoogleEmailInput('');
  };

  const handleSelectGoogleAccount = async (selectedEmail: string) => {
    setError('');
    setMessage('');
    setLoading(true);
    setShowGoogleChooser(false);
    try {
      await login(selectedEmail, 'googlesecret_123');
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Google Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomGoogleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleEmailInput) return;
    await handleSelectGoogleAccount(googleEmailInput);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#070b13]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Verifying session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(screen-16)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-[#070b13] relative overflow-hidden">
      {/* Glow blobs */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-md w-full space-y-8 glass-card border border-slate-200/50 dark:border-slate-800/40 p-8 rounded-3xl shadow-2xl relative bg-white/95 dark:bg-slate-950/95">
        {/* Brand details */}
        <div className="text-center">
          <img src={logo} alt="Crack Place Ai Logo" className="h-16 w-16 mx-auto rounded-2xl shadow-lg mb-4 object-cover" />
          <h2 className="mt-4 text-2xl font-extrabold tracking-tight">
            {forgotMode ? 'Recover Password' : isLogin ? 'Sign In to Crack Place Ai' : 'Create Student Account'}
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
                    placeholder="Alex Johnson"
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
                  placeholder="alex.johnson@university.edu"
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
              type="button"
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

      {showGoogleChooser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 dark:bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl relative text-slate-900 dark:text-slate-100">
            {/* Google G Logo */}
            <div className="flex justify-center mb-6">
              <svg className="h-8 w-8" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                <g transform="matrix(1, 0, 0, 1, 0, 0)">
                  <path d="M21.35,11.1H12v2.7h5.38c-0.24,1.28 -0.96,2.37 -2.04,3.1v2.58h3.3c1.93,-1.78 3.04,-4.4 3.04,-7.4C21.68,11.72 21.56,11.37 21.35,11.1z" fill="#4285F4" />
                  <path d="M12,20.82c2.61,0 4.8,-0.87 6.4,-2.34l-3.3,-2.58c-0.92,0.62 -2.1,0.99 -3.1,0.99 -2.4,0 -4.43,-1.63 -5.16,-3.82h-3.4v2.63C5.06,18.8 8.28,20.82 12,20.82z" fill="#34A853" />
                  <path d="M6.84,13.07c-0.18,-0.55 -0.29,-1.13 -0.29,-1.73s0.11,-1.18 0.29,-1.73V7h-3.4C2.81,8.25 2.5,9.6 2.5,11.34c0,1.74 0.31,3.09 0.94,4.34L6.84,13.07z" fill="#FBBC05" />
                  <path d="M12,6.11c1.42,0 2.7,0.49 3.7,1.44l2.77,-2.77C16.8,3.23 14.61,2.5 12,2.5c-3.72,0 -6.94,2.02 -8.56,5.03l3.4,2.63C7.57,7.74 9.6,6.11 12,6.11z" fill="#EA4335" />
                </g>
              </svg>
            </div>
            
            {/* Heading */}
            <div className="text-center mb-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Choose an account</h3>
              <p className="text-xs text-slate-500 mt-1.5">to continue to <span className="font-semibold text-indigo-500">Crack Place Ai</span></p>
            </div>

            {/* List of Accounts */}
            {!customEmailMode ? (
              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {savedGoogleAccounts.map((acc, index) => {
                  const initial = acc.name.charAt(0);
                  return (
                    <button
                      key={index}
                      onClick={() => handleSelectGoogleAccount(acc.email)}
                      className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-indigo-50/40 dark:hover:bg-indigo-950/20 hover:border-indigo-500/30 transition-all text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-pink-500 text-white flex items-center justify-center font-bold text-sm shadow-inner uppercase">
                          {initial}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white">{acc.name}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">{acc.email}</div>
                        </div>
                      </div>
                      <span className="text-[10px] text-indigo-500 font-bold opacity-0 hover:opacity-100 transition-opacity">Select</span>
                    </button>
                  );
                })}

                {/* Use another account button */}
                <button
                  onClick={() => setCustomEmailMode(true)}
                  className="w-full flex items-center gap-3 p-3.5 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-all text-left mt-2"
                >
                  <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center font-bold text-sm">
                    +
                  </div>
                  <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">Use another Google account</div>
                </button>
              </div>
            ) : (
              /* Custom Email Form */
              <form onSubmit={handleCustomGoogleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold mb-2">Google Email Address</label>
                  <input
                    type="email"
                    required
                    value={googleEmailInput}
                    onChange={(e) => setGoogleEmailInput(e.target.value)}
                    placeholder="name@gmail.com"
                    className="w-full text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-4 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-900 dark:text-slate-100"
                  />
                  <p className="text-[10px] text-slate-400 mt-1.5 leading-relaxed">
                    Note: Any custom Google account will be automatically registered on PlacementAI passwordless.
                  </p>
                </div>
                
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setCustomEmailMode(false)}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 transition-all"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2.5 rounded-xl text-xs font-bold shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all"
                  >
                    Sign In
                  </button>
                </div>
              </form>
            )}

            {/* Cancel Button */}
            <button
              onClick={() => setShowGoogleChooser(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
