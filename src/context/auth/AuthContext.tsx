
import React, { createContext } from 'react';
import { AuthContextType } from './types';

const defaultValue: AuthContextType = {
  user: null,
  loading: true,
  isAuthenticated: false, // Adicionando valor padrão
  login: async () => false,
  logout: () => {},
  register: async () => false,
  updateProfile: async () => false,
  resetPassword: async () => false,
  updatePassword: async () => false,
  setUser: () => {}, // Adicionando função padrão
};

export const AuthContext = createContext<AuthContextType>(defaultValue);
