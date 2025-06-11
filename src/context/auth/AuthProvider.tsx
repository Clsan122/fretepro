
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types';
import { fetchUserProfile, transformUser } from './utils';
import { AuthContextType } from './types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Derivar isAuthenticated do estado do user
  const isAuthenticated = !!user;

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      console.log('Initial session:', session);
      if (session?.user) {
        const profileData = await fetchUserProfile(session.user.id);
        const transformedUser = await transformUser(session.user, profileData);
        setUser(transformedUser);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', event, session);
      if (event === 'SIGNED_IN' && session?.user) {
        const profileData = await fetchUserProfile(session.user.id);
        const transformedUser = await transformUser(session.user, profileData);
        setUser(transformedUser);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('Tentando fazer login com:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Erro no login:', error);
        return false;
      }

      console.log('Login bem-sucedido:', data);
      return true;
    } catch (error) {
      console.error('Erro no login:', error);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      console.log('Fazendo logout...');
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  };

  const register = async (userData: any): Promise<boolean> => {
    try {
      console.log('Tentando registrar usuário:', userData);
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: userData.name,
            phone: userData.phone,
          }
        }
      });

      if (error) {
        console.error('Erro no registro:', error);
        return false;
      }

      console.log('Registro bem-sucedido:', data);
      return true;
    } catch (error) {
      console.error('Erro no registro:', error);
      return false;
    }
  };

  const updateProfile = async (profileData: any): Promise<boolean> => {
    try {
      if (!user) return false;

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: profileData.name,
          phone: profileData.phone,
          cpf: profileData.cpf,
          address: profileData.address,
          city: profileData.city,
          state: profileData.state,
          zip_code: profileData.zipCode,
          pix_key: profileData.pixKey,
          bank_info: profileData.bankInfo,
          avatar_url: profileData.avatar,
        });

      if (error) {
        console.error('Erro ao atualizar perfil:', error);
        return false;
      }

      // Atualizar o usuário local
      setUser({ ...user, ...profileData });
      return true;
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      return false;
    }
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        console.error('Erro ao resetar senha:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erro ao resetar senha:', error);
      return false;
    }
  };

  const updatePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        console.error('Erro ao atualizar senha:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erro ao atualizar senha:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      isAuthenticated, 
      login,
      logout,
      register,
      updateProfile,
      resetPassword,
      updatePassword,
      setUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
