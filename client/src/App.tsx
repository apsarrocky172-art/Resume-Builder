import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { FloatingBot } from './components/FloatingBot';

// Import Pages
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Features } from './pages/Features';
import { ResumeBuilder } from './pages/ResumeBuilder';
import { PlacementTrainer } from './pages/PlacementTrainer';
import { MockInterview } from './pages/MockInterview';
import { Jobs } from './pages/Jobs';
import { Dashboard } from './pages/Dashboard';
import { AdminPanel } from './pages/AdminPanel';
import { Pricing } from './pages/Pricing';
import { Contact } from './pages/Contact';
import { LoginRegister } from './pages/LoginRegister';

// Protected Route wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode; roles?: string[] }> = ({ children, roles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#070b13]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Loading placement platform...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export const AppContent: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070b13] text-slate-900 dark:text-slate-100 flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/features" element={<Features />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<LoginRegister />} />

          {/* Protected Student Routes */}
          <Route path="/resume" element={
            <ProtectedRoute>
              <ResumeBuilder />
            </ProtectedRoute>
          } />
          <Route path="/trainer" element={
            <ProtectedRoute>
              <PlacementTrainer />
            </ProtectedRoute>
          } />
          <Route path="/interview" element={
            <ProtectedRoute>
              <MockInterview />
            </ProtectedRoute>
          } />
          <Route path="/jobs" element={
            <ProtectedRoute>
              <Jobs />
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />

          {/* Protected Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute roles={['admin']}>
              <AdminPanel />
            </ProtectedRoute>
          } />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <FloatingBot />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
