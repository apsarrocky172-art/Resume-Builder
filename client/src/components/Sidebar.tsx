import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  LayoutDashboard, BookOpen, Code, Mic, HelpCircle, Briefcase, 
  FileText, Sparkles, FolderHeart, Globe, CheckSquare, Heart, 
  ShieldCheck, Compass, Award, Sun, Moon, LogOut, X, Sparkle
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string, searchTab?: string) => {
    if (searchTab) {
      return location.pathname === path && location.search.includes(`tab=${searchTab}`);
    }
    return location.pathname === path && (!location.search || !location.search.includes('tab='));
  };

  const sidebarSections = [
    {
      title: 'PREPARATION',
      items: [
        { name: 'Aptitude Practice', path: '/trainer', searchTab: 'aptitude', icon: BookOpen },
        { name: 'Coding Practice', path: '/trainer', searchTab: 'coding', icon: Code },
        { name: 'Mock Interviews', path: '/interview', icon: Mic },
        { name: 'Technical MCQs', path: '/trainer', searchTab: 'technical', icon: HelpCircle },
        { name: 'Company Prep', path: '/trainer', searchTab: 'coding', icon: Globe },
      ]
    },
    {
      title: 'RESUME',
      items: [
        { name: 'Resume Builder', path: '/resume', icon: FileText },
        { name: 'AI Resume Review', path: '/resume', searchTab: 'review', icon: Sparkles },
        { name: 'My Resumes', path: '/resume', searchTab: 'my-resumes', icon: FolderHeart },
      ]
    },
    {
      title: 'JOBS',
      items: [
        { name: 'Job Recommendations', path: '/jobs', icon: Briefcase },
        { name: 'Applied Jobs', path: '/jobs', searchTab: 'applied', icon: CheckSquare },
        { name: 'Saved Jobs', path: '/jobs', searchTab: 'saved', icon: Heart },
      ]
    },
    {
      title: 'OTHER',
      items: [
        { name: 'Skill Assessment', path: '/trainer', searchTab: 'aptitude', icon: ShieldCheck },
        { name: 'Learning Paths', path: '/trainer', searchTab: 'coding', icon: Compass },
        { name: 'Certificates', path: '/dashboard', searchTab: 'certificates', icon: Award },
      ]
    }
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#090d16] text-slate-300 border-r border-slate-800/60 select-none">
      {/* Brand Header */}
      <div className="p-6 flex items-center justify-between border-b border-slate-800/40">
        <Link to="/dashboard" className="flex items-center gap-3" onClick={onClose}>
          <div className="bg-indigo-600 p-2.5 rounded-2xl shadow-lg glow-ring text-white flex items-center justify-center">
            <Sparkle className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h1 className="text-base font-extrabold tracking-tight text-white leading-none">Crack Place AI</h1>
            <span className="text-[10px] text-slate-500 font-bold tracking-wider uppercase block mt-1">AI Placement & Resume</span>
          </div>
        </Link>
        {/* Mobile close button */}
        <button onClick={onClose} className="lg:hidden p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Links Scroll Container */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5 scrollbar-thin">
        {/* Dashboard Link (Main) */}
        <div>
          <Link
            to="/dashboard"
            onClick={onClose}
            className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
              isActive('/dashboard')
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                : 'hover:bg-slate-800/50 hover:text-white text-slate-400'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>
        </div>

        {/* Dynamic Sections */}
        {sidebarSections.map((section, idx) => (
          <div key={idx} className="space-y-1.5">
            <h3 className="text-[10px] font-extrabold tracking-wider text-slate-600 px-4 uppercase">
              {section.title}
            </h3>
            <div className="space-y-0.5">
              {section.items.map((item, itemIdx) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={itemIdx}
                    to={item.searchTab ? `${item.path}?tab=${item.searchTab}` : item.path}
                    onClick={onClose}
                    className={`flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                      isActive(item.path, item.searchTab)
                        ? 'bg-slate-800 text-white border-l-2 border-indigo-500 pl-3.5'
                        : 'hover:bg-slate-800/40 hover:text-white text-slate-400'
                    }`}
                  >
                    <Icon className="w-4.5 h-4.5 text-slate-500 group-hover:text-slate-300" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}

        {/* Upgrade to Pro Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-900/60 to-purple-950/60 border border-indigo-500/20 relative overflow-hidden mt-6">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl"></div>
          <h4 className="text-xs font-bold text-white">Upgrade to Pro</h4>
          <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">Unlock all premium placement preparation features.</p>
          <Link
            to="/pricing"
            onClick={onClose}
            className="block w-full text-center bg-white text-slate-900 font-extrabold text-[10px] py-2 rounded-xl mt-3 shadow-md hover:bg-slate-100 transition-colors"
          >
            Upgrade Now
          </Link>
        </div>
      </div>

      {/* Footer / Controls */}
      <div className="p-4 border-t border-slate-800/40 space-y-3.5">
        {/* Dark Mode toggle */}
        <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-950/40 border border-slate-800/20">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-2">
            {theme === 'dark' ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
            <span>Dark Mode</span>
          </span>
          <button
            onClick={toggleTheme}
            className="w-10 h-6 bg-slate-800 rounded-full relative flex items-center p-0.5 transition-colors duration-300 focus:outline-none"
            aria-label="Toggle Dark Mode"
          >
            <div
              className={`w-5 h-5 bg-indigo-600 rounded-full shadow-md transform transition-transform duration-300 ${
                theme === 'dark' ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Log Out */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200"
        >
          <LogOut className="w-4.5 h-4.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Permanent) */}
      <aside className="hidden lg:block w-64 h-screen sticky top-0 flex-shrink-0 z-20">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" />

          {/* Drawer Panel */}
          <div className="relative flex flex-col w-64 max-w-xs h-full transform transition-all duration-300 ease-in-out">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
