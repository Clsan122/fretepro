
import React, { useState, useEffect } from "react";
import { User } from "@/types";
import { AuthContext, AuthContextType } from "./AuthContext";
import { getCurrentUser, setCurrentUser, logoutUser } from "@/utils/storage";
import { useLocalAuth } from "@/hooks/useLocalAuth";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const { login, register } = useLocalAuth(setUserState, setIsAuthenticated);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUserState(currentUser);
      setIsAuthenticated(true);
    }
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
