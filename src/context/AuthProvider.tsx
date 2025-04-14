
import React, { useState, useEffect } from "react";
import { User } from "@/types";
import { AuthContext, AuthContextType } from "./AuthContext";
import { getCurrentUser, setCurrentUser, logoutUser } from "@/utils/storage";
import { loadGoogleAPI } from "@/utils/googleAuth";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";
import { useLocalAuth } from "@/hooks/useLocalAuth";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const { loginWithGoogle } = useGoogleAuth(setUserState, setIsAuthenticated);
  const { login, register } = useLocalAuth(setUserState, setIsAuthenticated);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUserState(currentUser);
      setIsAuthenticated(true);
    }

    loadGoogleAPI().catch(error => console.error("Failed to load Google API:", error));
  }, []);

  const logout = () => {
    setUserState(null);
    setIsAuthenticated(false);
    logoutUser();
  };

  const setUser = (updatedUser: User) => {
    setUserState(updatedUser);
    setCurrentUser(updatedUser);
  };

  const authContextValue: AuthContextType = {
    user, 
    isAuthenticated, 
    login, 
    loginWithGoogle, 
    register, 
    logout, 
    setUser
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};
