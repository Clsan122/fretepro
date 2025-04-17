
import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { getCurrentUser, setCurrentUser, logoutUser } from "@/utils/storage";
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

  // Função para buscar o perfil do usuário e definir o estado do usuário
  const fetchUserProfileAndSetState = async (userId: string, email: string, createdAt: string, fullName: string = '') => {
    try {
      console.log("Buscando perfil do usuário:", userId);
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error("Erro ao buscar perfil:", error);
        // Criar um usuário básico sem dados de perfil
        const basicUserData = {
          id: userId,
          email: email,
          name: fullName,
          phone: '',
          createdAt: createdAt,
          cpf: '',
          address: '',
          city: '',
          state: '',
          zipCode: '',
          companyName: '',
          cnpj: '',
          companyLogo: '',
          pixKey: '',
        };
        
        setUserState(basicUserData);
        setIsAuthenticated(true);
        setCurrentUser(basicUserData);
        return;
      }

      // Cast profile to our SupabaseProfile type
      const profileData = profile as unknown as SupabaseProfile;
      console.log("Perfil obtido:", profileData);

      const userData = {
        id: userId,
        email: email,
        name: profileData?.full_name || fullName || '',
        phone: profileData?.phone || '',
        createdAt: createdAt,
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

      console.log("Definindo usuário:", userData);
      setUserState(userData);
      setIsAuthenticated(true);
      setCurrentUser(userData);
    } catch (error) {
      console.error("Erro ao processar perfil do usuário:", error);
    }
  };

  // Verifica se há uma sessão existente ao carregar a página
  useEffect(() => {
    console.log("Inicializando AuthContext");
    setLoading(true);
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.id);
      if (session?.user) {
        const fullName = session.user.user_metadata?.name || session.user.user_metadata?.full_name || '';
        await fetchUserProfileAndSetState(
          session.user.id, 
          session.user.email!, 
          session.user.created_at,
          fullName
        );
      } else {
        setUserState(null);
        setIsAuthenticated(false);
        logoutUser();
      }
      setLoading(false);
    });
    
    // THEN check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      console.log("Verificando sessão existente:", session?.user?.id);
      if (session?.user) {
        const fullName = session.user.user_metadata?.name || session.user.user_metadata?.full_name || '';
        await fetchUserProfileAndSetState(
          session.user.id, 
          session.user.email!, 
          session.user.created_at,
          fullName
        );
      } else {
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      console.log("Iniciando login para:", email);
      
      // Tenta fazer login com captcha desativado
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: {
          captchaToken: 'disabled'
        }
      });

      if (error) {
        console.error('Erro no login:', error);
        
        // Tenta novamente sem especificar captchaToken
        console.log("Tentando login sem especificar captchaToken");
        const secondAttempt = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (secondAttempt.error) {
          console.error('Erro na segunda tentativa de login:', secondAttempt.error);
          setLoading(false);
          throw secondAttempt.error;
        }
        
        console.log("Login bem-sucedido na segunda tentativa:", secondAttempt.data.user?.id);
        setLoading(false);
        return true;
      }

      console.log("Login bem-sucedido:", data.user?.id);
      setLoading(false);
      return true;
    } catch (error) {
      console.error('Erro no login:', error);
      setLoading(false);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
          captchaToken: 'disabled'
        }
      });
      
      if (error) {
        console.error('Erro no registro:', error);
        setLoading(false);
        throw error;
      }
      
      console.log("Registro bem-sucedido:", data);
      setLoading(false);
      return true;
    } catch (error) {
      console.error('Erro no registro:', error);
      setLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      // O estado será atualizado pelo listener onAuthStateChange
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      // Mesmo com erro, limpa os estados locais
      setUserState(null);
      setIsAuthenticated(false);
      logoutUser();
    } finally {
      setLoading(false);
    }
  };

  const setUser = (updatedUser: User) => {
    setUserState(updatedUser);
    setCurrentUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
