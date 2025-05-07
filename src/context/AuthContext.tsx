
import * as React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { getCurrentUser, setCurrentUser, logoutUser } from "@/utils/storage";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  setUser: (user: User) => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  loading: false,
  login: async () => false,
  register: async () => false,
  logout: () => {},
  setUser: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const userData: User = {
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata.name || '',
          phone: session.user.phone || '',
          bankInfo: '',
          createdAt: session.user.created_at
        };
        setUserState(userData);
        setIsAuthenticated(true);
        setCurrentUser(userData);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        const userData: User = {
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata.name || '',
          phone: session.user.phone || '',
          bankInfo: '',
          createdAt: session.user.created_at
        };
        setUserState(userData);
        setIsAuthenticated(true);
        setCurrentUser(userData);
      } else {
        setUserState(null);
        setIsAuthenticated(false);
        logoutUser();
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      if (data.user) {
        const userData: User = {
          id: data.user.id,
          email: data.user.email!,
          name: data.user.user_metadata.name || '',
          phone: data.user.phone || '',
          bankInfo: '',
          createdAt: data.user.created_at
        };
        setUserState(userData);
        setIsAuthenticated(true);
        setCurrentUser(userData);
        setLoading(false);
        return true;
      }
      setLoading(false);
      return false;
    } catch (error) {
      console.error('Erro no login:', error);
      setLoading(false);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setLoading(true);
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    
    const existingUser = users.find((u: any) => u.email === email);
    if (existingUser) {
      setLoading(false);
      return false;
    }
    
    // Create user object with correct type
    const newUser: User = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      name,
      email,
      phone: "",
      bankInfo: "", // Add default empty string for bankInfo
    };
    
    // Add password to the stored user but not to the state
    const userToStore = {
      ...newUser,
      password // Store password in localStorage but not in the state
    };
    
    users.push(userToStore);
    
    localStorage.setItem("users", JSON.stringify(users));
    
    setUserState(newUser);
    setIsAuthenticated(true);
    setCurrentUser(newUser);
    setLoading(false);
    
    return true;
  };

  const logout = () => {
    setLoading(true);
    setUserState(null);
    setIsAuthenticated(false);
    logoutUser();
    setLoading(false);
  };

  const setUser = (updatedUser: User) => {
    setUserState(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
