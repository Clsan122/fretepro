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

// Create a default context value to avoid null checks
const defaultAuthContextValue: AuthContextType = {
  user: null,
  isAuthenticated: false,
  loading: false,
  login: async () => false,
  register: async () => false,
  logout: () => {},
  setUser: () => {},
};

// Create the context with a default value
const AuthContext = createContext<AuthContextType>(defaultAuthContextValue);

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUserState] = React.useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();

  // Este efeito garante que a autenticação é configurada corretamente e persistida entre sessões
  useEffect(() => {
    setLoading(true);

    // Configurar o listener de mudança de estado primeiro (prática recomendada do Supabase)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        // Usuario autenticado
        const userData: User = {
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata.name || session.user.user_metadata.full_name || '',
          phone: session.user.phone || session.user.user_metadata.phone || '',
          bankInfo: session.user.user_metadata.bankInfo || '',
          cpf: session.user.user_metadata.cpf || '',
          avatar: session.user.user_metadata.avatar_url || '',
          pixKey: session.user.user_metadata.pix_key || '',
          address: session.user.user_metadata.address || '',
          city: session.user.user_metadata.city || '',
          state: session.user.user_metadata.state || '',
          zipCode: session.user.user_metadata.zip_code || '',
          companyName: session.user.user_metadata.company_name || '',
          cnpj: session.user.user_metadata.cnpj || '',
          companyLogo: session.user.user_metadata.company_logo || '',
          createdAt: session.user.created_at
        };
        setUserState(userData);
        setIsAuthenticated(true);
        setCurrentUser(userData);
        
        // Usar setTimeout para evitar deadlock do Supabase
        setTimeout(() => {
          // Verificar se temos perfil do usuário no Supabase
          supabase.from('profiles')
            .select('*')
            .eq('id', userData.id)
            .single()
            .then(({ data, error }) => {
              if (!error && data) {
                // Mesclar dados do perfil com os do usuário
                const updatedUser = {
                  ...userData,
                  name: data.full_name || userData.name,
                  phone: data.phone || userData.phone,
                  address: data.address || userData.address,
                  city: data.city || userData.city,
                  state: data.state || userData.state,
                  zipCode: data.zip_code || userData.zipCode,
                  cpf: data.cpf || userData.cpf,
                  companyName: data.company_name || userData.companyName,
                  cnpj: data.cnpj || userData.cnpj,
                  pixKey: data.pix_key || userData.pixKey,
                  avatar: data.avatar_url || userData.avatar,
                  companyLogo: data.company_logo || userData.companyLogo,
                  bankInfo: data.bank_info || userData.bankInfo
                };
                
                setUserState(updatedUser);
                setCurrentUser(updatedUser);
              } else if (error && error.code !== 'PGRST116') {
                // Se não for erro de "não encontrado", registrar
                console.error('Erro ao obter perfil do usuário:', error);
              }
            });
        }, 0);
      } else {
        // Usuário desconectado
        setUserState(null);
        setIsAuthenticated(false);
        logoutUser();
      }
      
      setLoading(false);
    });

    // Verificar se já temos uma sessão existente
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const userData: User = {
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata.name || session.user.user_metadata.full_name || '',
          phone: session.user.phone || session.user.user_metadata.phone || '',
          bankInfo: session.user.user_metadata.bankInfo || '',
          cpf: session.user.user_metadata.cpf || '',
          avatar: session.user.user_metadata.avatar_url || '',
          pixKey: session.user.user_metadata.pix_key || '',
          address: session.user.user_metadata.address || '',
          city: session.user.user_metadata.city || '',
          state: session.user.user_metadata.state || '',
          zipCode: session.user.user_metadata.zip_code || '',
          companyName: session.user.user_metadata.company_name || '',
          cnpj: session.user.user_metadata.cnpj || '',
          companyLogo: session.user.user_metadata.company_logo || '',
          createdAt: session.user.created_at
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
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      if (data.user) {
        const userData: User = {
          id: data.user.id,
          email: data.user.email!,
          name: data.user.user_metadata.name || data.user.user_metadata.full_name || '',
          phone: data.user.phone || data.user.user_metadata.phone || '',
          bankInfo: data.user.user_metadata.bankInfo || '',
          cpf: data.user.user_metadata.cpf || '',
          avatar: data.user.user_metadata.avatar_url || '',
          pixKey: data.user.user_metadata.pix_key || '',
          address: data.user.user_metadata.address || '',
          city: data.user.user_metadata.city || '',
          state: data.user.user_metadata.state || '',
          zipCode: data.user.user_metadata.zip_code || '',
          companyName: data.user.user_metadata.company_name || '',
          cnpj: data.user.user_metadata.cnpj || '',
          companyLogo: data.user.user_metadata.company_logo || '',
          createdAt: data.user.created_at
        };
        
        setUserState(userData);
        setIsAuthenticated(true);
        setCurrentUser(userData);

        // Após login bem-sucedido, iniciar sincronização
        setTimeout(() => {
          // Importar dinâmicamente para evitar problemas de ciclo de dependência
          import('@/utils/sync').then(syncModule => {
            syncModule.syncWithServer().then(() => {
              console.log('Sincronização inicial após login concluída');
            });
          });
        }, 0);

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
    
    try {
      // Registrar usuário com Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          }
        }
      });
      
      if (error) throw error;
      
      if (data.user) {
        // Criar objeto de usuário
        const newUser: User = {
          id: data.user.id,
          name: name,
          email: email,
          phone: "",
          bankInfo: "",
          createdAt: data.user.created_at,
        };
        
        // Criar perfil do usuário no Supabase
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert([
            {
              id: data.user.id,
              full_name: name,
              updated_at: new Date().toISOString(),
            }
          ]);
          
        if (profileError) {
          console.error('Erro ao criar perfil:', profileError);
        }
        
        setUserState(newUser);
        setIsAuthenticated(true);
        setCurrentUser(newUser);
        setLoading(false);
        
        return true;
      }
      
      setLoading(false);
      return false;
    } catch (error: any) {
      console.error('Erro ao registrar:', error);
      setLoading(false);
      return false;
    }
  };

  const logout = async () => {
    setLoading(true);
    
    try {
      // Primeiro, notificar o Service Worker para limpar caches sensíveis
      if (navigator.serviceWorker && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'USER_LOGOUT'
        });
      }

      // Deslogar do Supabase
      await supabase.auth.signOut();
      
      // Limpar estado e storage local
      setUserState(null);
      setIsAuthenticated(false);
      logoutUser();
      
      // Redirecionar para a página inicial
      navigate("/", { replace: true });
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      setLoading(false);
    }
  };

  const setUser = (updatedUser: User) => {
    setUserState(updatedUser);
    
    // Também atualizar metadados do usuário no Supabase quando apropriado
    if (updatedUser && updatedUser.id) {
      // Usar setTimeout para evitar deadlock
      setTimeout(async () => {
        try {
          // Atualizar metadados do usuário
          await supabase.auth.updateUser({
            data: {
              full_name: updatedUser.name,
              phone: updatedUser.phone,
              cpf: updatedUser.cpf,
              address: updatedUser.address,
              city: updatedUser.city,
              state: updatedUser.state,
              zip_code: updatedUser.zipCode,
              company_name: updatedUser.companyName,
              cnpj: updatedUser.cnpj,
              pix_key: updatedUser.pixKey,
              avatar_url: updatedUser.avatar,
              company_logo: updatedUser.companyLogo,
              bank_info: updatedUser.bankInfo
            }
          });
          
          // Também atualizar a tabela de perfis
          await supabase
            .from('profiles')
            .upsert({
              id: updatedUser.id,
              full_name: updatedUser.name,
              phone: updatedUser.phone,
              address: updatedUser.address,
              city: updatedUser.city,
              state: updatedUser.state,
              zip_code: updatedUser.zipCode,
              cpf: updatedUser.cpf,
              company_name: updatedUser.companyName,
              cnpj: updatedUser.cnpj,
              pix_key: updatedUser.pixKey,
              avatar_url: updatedUser.avatar,
              company_logo: updatedUser.companyLogo,
              bank_info: updatedUser.bankInfo,
              updated_at: new Date().toISOString()
            }, { onConflict: 'id' });
        } catch (error) {
          console.error('Erro ao atualizar perfil do usuário:', error);
        }
      }, 0);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
