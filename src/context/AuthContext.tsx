
import React, { createContext, useState, useContext, useEffect } from "react";
import { User } from "@/types";
import { getCurrentUser, setCurrentUser, logoutUser } from "@/utils/storage";

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  setUser: (user: User) => void; // Added setUser method
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
  setUser: () => {} // Added default implementation
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
  };

  const logout = () => {
    logoutUser();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isAuthenticated, 
      setUser: (updatedUser: User) => {
        setCurrentUser(updatedUser);
        setUser(updatedUser);
      }
    }}>
      {children}
    </AuthContext.Provider>
  );
};
