
import React, { useState, useEffect } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types';
import { AuthContext } from './AuthContext';
import { AuthProviderProps } from './types';
import { transformUser, fetchUserProfile } from './utils';

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authInitialized, setAuthInitialized] = useState(true);

  // Update user state with combined Supabase user and profile data
  const updateUserState = async (supabaseUser: SupabaseUser | null) => {
    if (!supabaseUser) {
      setUser(null);
      return;
    }

    try {
      const profileData = await fetchUserProfile(supabaseUser.id);
      const transformedUser = transformUser(supabaseUser, profileData);
      setUser(transformedUser);
      console.log("User state updated:", transformedUser ? "User loaded" : "No user");
    } catch (err) {
      console.error("Error updating user state:", err);
      setUser(null);
    }
  };

  useEffect(() => {
    console.log("AuthProvider initialized");
    
    // Flag to track component mounting state
    let isMounted = true;
    
    // Set up auth state listener for future auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        if (!isMounted) return;
        
        console.log("Auth state changed:", event);
        
        if (newSession) {
          // Update session state immediately
          setSession(newSession);
          
          // Update user state
          await updateUserState(newSession.user);
          setLoading(false);
        } else {
          setSession(null);
          setUser(null);
          setLoading(false);
        }
      }
    );

    // Não verifica mais automaticamente por uma sessão existente
    // Isso fará com que o login só aconteça quando o botão for clicado

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);
      
      console.log("Attempting login for:", email);
      const { error, data } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        console.error("Login error:", error.message);
        setError(error.message);
        setLoading(false);
        return false;
      }
      
      console.log("Login successful, session established");
      return true;
    } catch (err: any) {
      console.error("Login exception:", err);
      setError(err.message || 'Erro ao fazer login');
      setLoading(false);
      return false;
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      setError(null);
      setLoading(true);
      
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
        setLoading(false);
        return false;
      }
      
      return true;
    } catch (err: any) {
      setError(err.message || 'Erro ao criar conta');
      setLoading(false);
      return false;
    }
  };

  const logout = async () => {
    try {
      console.log("Logging out user");
      setLoading(true);
      await supabase.auth.signOut();
      
      // Explicitly clear user and session states
      setUser(null);
      setSession(null);
      console.log("Logout successful");
    } catch (err: any) {
      console.error("Logout error:", err);
      setError(err.message || 'Erro ao fazer logout');
    } finally {
      setLoading(false);
    }
  };

  // Allow updating user data from profile page
  const updateUserData = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const value = {
    user,
    session,
    loading: loading,
    error,
    login,
    signup,
    logout,
    isAuthenticated: !!user && !!session,
    setUser: updateUserData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
