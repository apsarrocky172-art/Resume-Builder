import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'recruiter' | 'admin';
  skills?: string[];
  education?: any;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role?: string) => Promise<void>;
  logout: () => void;
  updateUserSkills: (skills: string[]) => void;
  updateUserProfile: (name: string, course: string, specialization: string, photo: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = 'http://localhost:5000/api';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const res = await axios.get(`${API_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(res.data);
        } catch (error) {
          console.error('[Auth] Failed to load user profile', error);
          logout();
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  const login = async (email: string, password: string) => {
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { email, password });
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
    } catch (error: any) {
      console.error('[Auth] Login error:', error);
      throw new Error(error.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  const register = async (name: string, email: string, password: string, role?: string) => {
    try {
      const res = await axios.post(`${API_URL}/auth/register`, { name, email, password, role });
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
    } catch (error: any) {
      console.error('[Auth] Register error:', error);
      throw new Error(error.response?.data?.message || 'Registration failed.');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const updateUserSkills = (skills: string[]) => {
    if (user) {
      setUser({ ...user, skills });
    }
  };

  const updateUserProfile = async (name: string, course: string, specialization: string, photo: string) => {
    try {
      const res = await axios.put(`${API_URL}/auth/profile`, { name, course, specialization, photo }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data);
    } catch (error: any) {
      console.error('[Auth] Profile update error:', error);
      throw new Error(error.response?.data?.message || 'Profile update failed.');
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateUserSkills, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
