
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  // Update user state with combined Supabase user and profile data
  const updateUserState = async (supabaseUser: SupabaseUser | null) => {
    if (!supabaseUser) {
      setUser(null);
      return;
    }

    try {
      const profileData = await fetchUserProfile(supabaseUser.id);
      setUser(transformUser(supabaseUser, profileData));
    } catch (err) {
      console.error("Error updating user state:", err);
      setUser(null);
    }
  };

  useEffect(() => {
    // Set up a flag to track component mounting state
    let isMounted = true;
    
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        if (!isMounted) return;
        
        console.log("Auth state changed:", event);
        
        if (newSession) {
          setSession(newSession);
          
          // Use setTimeout to prevent potential deadlocks
          setTimeout(() => {
            if (isMounted) {
              updateUserState(newSession.user);
            }
          }, 0);
        } else {
          setSession(null);
          setUser(null);
        }
        
        // Only set loading to false after handling the auth event
        setLoading(false);
        setAuthChecked(true);
      }
    );

    // Then check for an existing session
    supabase.auth.getSession().then(({ data: { session: existingSession } }) => {
      if (!isMounted) return;
      
      console.log("Initial session check:", existingSession ? "Session found" : "No session");
      
      if (existingSession) {
        setSession(existingSession);
        
        // Use setTimeout here too, for consistency
        setTimeout(() => {
          if (isMounted) {
            updateUserState(existingSession.user);
          }
        }, 0);
      }
      
      // Setting loading to false after checking for an existing session
      setLoading(false);
      setAuthChecked(true);
    }).catch(err => {
      console.error("Error getting session:", err);
      if (isMounted) {
        setLoading(false);
        setAuthChecked(true);
      }
    });

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
      
      // Set session immediately to avoid delays
      setSession(data.session);
      
      // Auth state change listener will handle updating the user state
      return true;
    } catch (err: any) {
      console.error("Login exception:", err);
      setError(err.message || 'Erro ao fazer login');
      setLoading(false);
      return false;
    } finally {
      setLoading(false);
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
      
      // Auth state change listener will handle updating the user state
      return true;
    } catch (err: any) {
      setError(err.message || 'Erro ao criar conta');
      setLoading(false);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      // Explicitly clear user and session states
      setUser(null);
      setSession(null);
    } catch (err: any) {
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
    loading: loading && !authChecked,
    error,
    login,
    signup,
    logout,
    isAuthenticated: !!user && !!session,
    setUser: updateUserData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
