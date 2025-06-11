
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { User } from '@/types';

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
}

export interface AuthProviderProps {
  children: React.ReactNode;
}
