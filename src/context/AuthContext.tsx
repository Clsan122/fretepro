
import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { getCurrentUser, setCurrentUser, logoutUser } from "@/utils/storage";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SupabaseProfile } from "@/types/profile";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();

  useEffect(() => {
    setLoading(true);
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        // Cast profile to our SupabaseProfile type
        const profileData = profile as unknown as SupabaseProfile;

        const userData = {
          id: session.user.id,
          email: session.user.email!,
          name: profileData?.full_name || session.user.user_metadata.name || '',
          phone: profileData?.phone || '',
          createdAt: session.user.created_at,
          cpf: profileData?.cpf || '',
          address: profileData?.address || '',
          city: profileData?.city || '',
          state: profileData?.state || '',
          zipCode: profileData?.zip_code || '',
          companyName: profileData?.company_name || '',
          cnpj: profileData?.cnpj || '',
          companyLogo: profileData?.company_logo || '',
          pixKey: profileData?.pix_key || '',
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
    
    // THEN check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        // Cast profile to our SupabaseProfile type
        const profileData = profile as unknown as SupabaseProfile;

        const userData = {
          id: session.user.id,
          email: session.user.email!,
          name: profileData?.full_name || session.user.user_metadata.name || '',
          phone: profileData?.phone || '',
          createdAt: session.user.created_at,
          cpf: profileData?.cpf || '',
          address: profileData?.address || '',
          city: profileData?.city || '',
          state: profileData?.state || '',
          zipCode: profileData?.zip_code || '',
          companyName: profileData?.company_name || '',
          cnpj: profileData?.cnpj || '',
          companyLogo: profileData?.company_logo || '',
          pixKey: profileData?.pix_key || '',
        };

        setUserState(userData);
        setIsAuthenticated(true);
        setCurrentUser(userData);
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
      
      // Desativar temporariamente o captcha em desenvolvimento
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: {
          captchaToken: 'disabled'
        }
      });

      if (error) {
        console.error('Erro no login:', error);
        toast({
          title: "Erro ao fazer login",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      if (data.user) {
        // Fetch profile data after login
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
          
        // Cast profile to our SupabaseProfile type
        const profileData = profile as unknown as SupabaseProfile;
        
        const userData = {
          id: data.user.id,
          email: data.user.email!,
          name: profileData?.full_name || data.user.user_metadata.name || '',
          phone: profileData?.phone || '',
          createdAt: data.user.created_at,
          cpf: profileData?.cpf || '',
          address: profileData?.address || '',
          city: profileData?.city || '',
          state: profileData?.state || '',
          zipCode: profileData?.zip_code || '',
          companyName: profileData?.company_name || '',
          cnpj: profileData?.cnpj || '',
          companyLogo: profileData?.company_logo || '',
          pixKey: profileData?.pix_key || '',
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
    
    const newUser = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      name,
      email,
      phone: "",
      password,
    };
    
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    
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
