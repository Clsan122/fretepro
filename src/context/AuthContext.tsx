
import React, { createContext, useState, useContext, useEffect } from "react";
import { User } from "@/types";
import { getCurrentUser, setCurrentUser, logoutUser } from "@/utils/storage";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  googleLogin: () => Promise<void>;
  register: (userData: Omit<User, "id" | "createdAt">) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    // Load user from localStorage on initial load
    const storedUser = getCurrentUser();
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);
  
  const login = async (email: string, password: string) => {
    // This is a mock implementation - in a real app, you'd call your backend
    try {
      const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
      const matchedUser = storedUsers.find(
        (u: any) => u.email === email && u.password === password
      );
      
      if (!matchedUser) {
        throw new Error("Email ou senha inválidos");
      }
      
      // Remove password from user object before storing in state
      const { password: _, ...userWithoutPassword } = matchedUser;
      setUser(userWithoutPassword);
      setCurrentUser(userWithoutPassword);
      toast.success("Login realizado com sucesso!");
    } catch (error: any) {
      toast.error(error.message || "Erro ao realizar login");
      throw error;
    }
  };
  
  const googleLogin = async () => {
    // This is a mock implementation - in a real app, you'd integrate Google OAuth
    try {
      toast.info("Funcionalidade em desenvolvimento. Por favor, use o login normal.");
      
      // For demo purposes, we'll just create a mock user
      const mockGoogleUser: User = {
        id: "google-user-123",
        name: "Usuário Google",
        email: "google@example.com",
        phone: "123456789",
        createdAt: new Date().toISOString()
      };
      
      setUser(mockGoogleUser);
      setCurrentUser(mockGoogleUser);
      toast.success("Login com Google realizado com sucesso (simulado)!");
    } catch (error: any) {
      toast.error(error.message || "Erro ao realizar login com Google");
      throw error;
    }
  };
  
  const register = async (userData: Omit<User, "id" | "createdAt">) => {
    try {
      const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
      
      // Check if user already exists
      if (storedUsers.some((u: any) => u.email === userData.email)) {
        throw new Error("Este email já está cadastrado");
      }
      
      // Create new user with ID and createdAt
      const newUser = {
        ...userData,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString()
      };
      
      // Add to users array
      storedUsers.push(newUser);
      localStorage.setItem("users", JSON.stringify(storedUsers));
      
      // Remove password before setting state
      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      setCurrentUser(userWithoutPassword);
      
      toast.success("Cadastro realizado com sucesso!");
    } catch (error: any) {
      toast.error(error.message || "Erro ao realizar cadastro");
      throw error;
    }
  };
  
  const logout = () => {
    setUser(null);
    logoutUser();
    toast.success("Logout realizado com sucesso!");
  };
  
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        googleLogin,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
