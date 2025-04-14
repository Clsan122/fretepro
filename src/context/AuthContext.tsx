import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/types";
import { getCurrentUser, setCurrentUser, logoutUser } from "@/utils/storage";
import { loadGoogleAPI } from "@/utils/googleAuth";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";
import { useLocalAuth } from "@/hooks/useLocalAuth";

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  setUser: (user: User) => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: async () => false,
  loginWithGoogle: async () => false,
  register: async () => false,
  logout: () => {},
  setUser: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize Google and Local auth hooks
  const { loginWithGoogle } = useGoogleAuth(setUserState, setIsAuthenticated);
  const { login, register } = useLocalAuth(setUserState, setIsAuthenticated);

  useEffect(() => {
    // Check if user is already logged in on component mount
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUserState(currentUser);
      setIsAuthenticated(true);
    }

    // Load Google API
    loadGoogleAPI()
      .catch(error => console.error("Failed to load Google API:", error));
  }, []);

  const logout = () => {
    setUserState(null);
    setIsAuthenticated(false);
    logoutUser();
  };

  const setUser = (updatedUser: User) => {
    setUserState(updatedUser);
    // Also update the user in localStorage to keep it in sync
    setCurrentUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      login, 
      loginWithGoogle, 
      register, 
      logout, 
      setUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
