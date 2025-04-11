
import React, { createContext, useState, useContext, useEffect } from "react";
import { User } from "@/types";
import { getCurrentUser, setCurrentUser, logoutUser } from "@/utils/storage";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
  setUser: () => {}
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Check if user is logged in on initial load
    const storedUser = getCurrentUser();
    if (storedUser) {
      setUser(storedUser);
      setIsAuthenticated(true);
    }
  }, []);

  const login = (userData: User) => {
    setCurrentUser(userData);
    setUser(userData);
    setIsAuthenticated(true);
    toast.success(`Bem-vindo, ${userData.name}!`);
  };

  const logout = () => {
    logoutUser();
    setUser(null);
    setIsAuthenticated(false);
    toast.info("Você foi desconectado com sucesso");
  };

  const updateUser = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    setUser(updatedUser);
    toast.success("Perfil atualizado com sucesso");
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isAuthenticated, 
      setUser: updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};
