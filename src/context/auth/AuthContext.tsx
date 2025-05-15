
import React, { createContext } from 'react';
import { Session } from '@supabase/supabase-js';
import { User } from '@/types';
import { AuthContextType } from './types';

const defaultValue: AuthContextType = {
  user: null,
  session: null,
  loading: true,
  error: null,
  login: async () => false,
  signup: async () => false,
  logout: async () => {},
  isAuthenticated: false,
  setUser: () => {},
};

export const AuthContext = createContext<AuthContextType>(defaultValue);
