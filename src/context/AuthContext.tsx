
import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { getCurrentUser, setCurrentUser, logoutUser } from "@/utils/storage";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean; // Add loading property to the type
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  setUser: (user: User) => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  loading: false, // Add default value for loading
  login: async () => false,
  register: async () => false,
  logout: () => {},
  setUser: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    setLoading(true);
    
    // Get initial session and fetch profile data
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        const userData = {
          id: session.user.id,
          email: session.user.email!,
          name: profile?.full_name || session.user.user_metadata.name || '',
          phone: profile?.phone || '',
          createdAt: session.user.created_at,
          cpf: profile?.cpf || '',
          address: profile?.address || '',
          city: profile?.city || '',
          state: profile?.state || '',
          zipCode: profile?.zip_code || '',
          companyName: profile?.company_name || '',
          cnpj: profile?.cnpj || '',
          companyLogo: profile?.company_logo || '',
          pixKey: profile?.pix_key || '',
        };

        setUserState(userData);
        setIsAuthenticated(true);
        setCurrentUser(userData);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        const userData = {
          id: session.user.id,
          email: session.user.email!,
          name: profile?.full_name || session.user.user_metadata.name || '',
          phone: profile?.phone || '',
          createdAt: session.user.created_at,
          cpf: profile?.cpf || '',
          address: profile?.address || '',
          city: profile?.city || '',
          state: profile?.state || '',
          zipCode: profile?.zip_code || '',
          companyName: profile?.company_name || '',
          cnpj: profile?.cnpj || '',
          companyLogo: profile?.company_logo || '',
          pixKey: profile?.pix_key || '',
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
      setLoading(true); // Set loading to true when starting login
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
        setLoading(false); // Set loading to false after successful login
        return true;
      }
      setLoading(false); // Set loading to false after failed login
      return false;
    } catch (error) {
      console.error('Erro no login:', error);
      setLoading(false); // Set loading to false after error
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setLoading(true); // Set loading to true when starting registration
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
    setLoading(false); // Set loading to false after successful registration
    
    return true;
  };

  const logout = () => {
    setLoading(true); // Set loading to true when starting logout
    setUserState(null);
    setIsAuthenticated(false);
    logoutUser();
    setLoading(false); // Set loading to false after logout completes
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
