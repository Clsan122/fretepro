
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { User } from '@/types';

interface AuthContextType {
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

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  error: null,
  login: async () => false,
  signup: async () => false,
  logout: async () => {},
  isAuthenticated: false,
  setUser: () => {},
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: React.ReactNode;
}

// Helper function to transform Supabase User to our App User type
const transformUser = (supabaseUser: SupabaseUser | null, userMetadata: any = {}): User | null => {
  if (!supabaseUser) return null;
  
  return {
    id: supabaseUser.id,
    email: supabaseUser.email || '',
    name: supabaseUser.user_metadata?.name || userMetadata?.name || '',
    cpf: userMetadata?.cpf || '',
    phone: userMetadata?.phone || '',
    avatar: userMetadata?.avatar_url || '',
    address: userMetadata?.address || '',
    city: userMetadata?.city || '',
    state: userMetadata?.state || '',
    zipCode: userMetadata?.zip_code || '',
    companyName: userMetadata?.company_name || '',
    cnpj: userMetadata?.cnpj || '',
    companyLogo: userMetadata?.company_logo || '',
    pixKey: userMetadata?.pix_key || '',
    bankInfo: userMetadata?.bank_info || '',
    role: userMetadata?.role || 'user',
    createdAt: supabaseUser.created_at,
    updatedAt: userMetadata?.updated_at,
  };
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user profile data from Supabase
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }
      
      return data;
    } catch (err) {
      console.error('Exception fetching user profile:', err);
      return null;
    }
  };

  // Update user state with combined Supabase user and profile data
  const updateUserState = async (supabaseUser: SupabaseUser | null) => {
    if (!supabaseUser) {
      setUser(null);
      return;
    }

    const profileData = await fetchUserProfile(supabaseUser.id);
    setUser(transformUser(supabaseUser, profileData));
  };

  useEffect(() => {
    // Set up the auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        
        if (session?.user) {
          // Use setTimeout to prevent potential deadlocks
          setTimeout(() => {
            updateUserState(session.user);
          }, 0);
        } else {
          setUser(null);
        }
        
        setLoading(false);
      }
    );

    // Then check for an existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      
      if (session?.user) {
        await updateUserState(session.user);
      }
      
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
        return false;
      }
      return true;
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login');
      return false;
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      setError(null);
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            name
          }
        }
      });
      if (error) {
        setError(error.message);
        return false;
      }
      return true;
    } catch (err: any) {
      setError(err.message || 'Erro ao criar conta');
      return false;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer logout');
    }
  };

  // Allow updating user data from profile page
  const updateUserData = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const value = {
    user,
    session,
    loading,
    error,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
    setUser: updateUserData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
