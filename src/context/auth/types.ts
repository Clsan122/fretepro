
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean; // Adicionando propriedade faltante
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: any) => Promise<boolean>;
  updateProfile: (profileData: any) => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  setUser: (user: User) => void; // Adicionando propriedade faltante
}

// Removendo a interface User duplicada - usar apenas a de src/types/index.ts
export type { User } from '../types';
