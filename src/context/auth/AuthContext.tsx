
import React, { createContext } from 'react';
import { AuthContextType } from './types';

const defaultValue: AuthContextType = {
  user: null,
  loading: true,
  login: async () => false,
  logout: () => {},
  register: async () => false,
  updateProfile: async () => false,
  resetPassword: async () => false,
  updatePassword: async () => false,
  setUser: () => {},
};

export const AuthContext = createContext<AuthContextType>(defaultValue);
