
import React, { createContext, useContext, useState, useEffect } from "react";
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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar sessão do usuário no Supabase ao iniciar
    setLoading(true);
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUserState({
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata.name || '',
          phone: session.user.phone || '',
          createdAt: session.user.created_at
        });
        setIsAuthenticated(true);
        setCurrentUser({
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata.name || '',
          phone: session.user.phone || '',
          createdAt: session.user.created_at
        });
      }
      setLoading(false);
    });

    // Listener para mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        const userData = {
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata.name || '',
          phone: session.user.phone || '',
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
        const userData = {
          id: data.user.id,
          email: data.user.email!,
          name: data.user.user_metadata.name || '',
          phone: data.user.phone || '',
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
    // Get users from local storage
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    
    // Check if user with email already exists
    const existingUser = users.find((u: any) => u.email === email);
    if (existingUser) {
      setLoading(false);
      return false;
    }
    
    // Create new user
    const newUser = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      name,
      email,
      phone: "", // Add default empty phone to meet User type requirements
      password, // In a real app, this would be hashed
    };
    
    // Add new user to users array
    users.push(newUser);
    
    // Save users array to local storage
    localStorage.setItem("users", JSON.stringify(users));
    
    // Remove password from user object before storing in state
    const { password: pwd, ...userWithoutPassword } = newUser;
    
    setUserState(userWithoutPassword);
    setIsAuthenticated(true);
    setCurrentUser(userWithoutPassword);
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
