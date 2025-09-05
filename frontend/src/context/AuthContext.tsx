import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

type Role = 'admin' | 'staff' | 'customer' | null;

type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

type AuthState = {
  token: string | null;
  user: AuthUser | null;
};

type AuthContextType = {
  user: AuthUser | null;
  role: Role;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [state, setState] = useState<AuthState>(() => {
    try {
      const raw = localStorage.getItem('auth');
      return raw ? JSON.parse(raw) : { token: null, user: null };
    } catch {
      return { token: null, user: null };
    }
  });

  useEffect(() => {
    try { localStorage.setItem('auth', JSON.stringify(state)); } catch {}
  }, [state]);

  const login = async (email: string, password: string) => {
    const { data } = await api.post('/api/auth/login', { email, password });
    const { token, user } = data;
    setState({ token, user });
    const role = user?.role;
    if (role === 'admin') navigate('/admin');
    else if (role === 'staff') navigate('/staff');
    else navigate('/customer');
  };

  const register = async (name: string, email: string, password: string) => {
    const { data } = await api.post('/api/auth/register', { name, email, password });
    const { token, user } = data;
    setState({ token, user });
    const role = user?.role;
    if (role === 'admin') navigate('/admin');
    else if (role === 'staff') navigate('/staff');
    else navigate('/customer');
  };

  const logout = () => {
    setState({ token: null, user: null });
    try { localStorage.removeItem('auth'); } catch {}
    navigate('/auth/login');
  };

  const value = useMemo<AuthContextType>(() => ({
    user: state.user,
    role: state.user?.role ?? null,
    token: state.token,
    login,
    register,
    logout
  }), [state]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};


