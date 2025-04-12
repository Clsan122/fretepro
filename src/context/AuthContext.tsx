
import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { getCurrentUser, setCurrentUser, logoutUser } from "@/utils/storage";

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  googleLogin: () => Promise<boolean>; // Add googleLogin function
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  setUser: (user: User) => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: async () => false,
  googleLogin: async () => false, // Initialize googleLogin function
  register: async () => false,
  logout: () => {},
  setUser: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUserState(currentUser);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // This is a mock implementation for demo purposes
    // In a real app, you would call an API to authenticate the user
    
    // Get users from local storage
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    
    // Find user with matching email and password
    const user = users.find((u: any) => 
      u.email === email && u.password === password
    );
    
    if (user) {
      // Remove password from user object before storing in state
      const { password, ...userWithoutPassword } = user;
      
      setUserState(userWithoutPassword);
      setIsAuthenticated(true);
      setCurrentUser(userWithoutPassword);
      return true;
    }
    
    return false;
  };

  // Add googleLogin function implementation
  const googleLogin = async (): Promise<boolean> => {
    // This is a mock implementation for demo purposes
    // In a real app, you would use Google OAuth or Firebase Authentication
    
    try {
      // Mock successful Google login
      const mockGoogleUser = {
        id: uuidv4(),
        name: "Google User",
        email: "google.user@example.com",
        phone: "", // Add required phone property
        createdAt: new Date().toISOString(),
      };
      
      setUserState(mockGoogleUser);
      setIsAuthenticated(true);
      setCurrentUser(mockGoogleUser);
      return true;
    } catch (error) {
      console.error("Google login error:", error);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    // This is a mock implementation for demo purposes
    // In a real app, you would call an API to register the user
    
    // Get users from local storage
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    
    // Check if user with email already exists
    const existingUser = users.find((u: any) => u.email === email);
    if (existingUser) {
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
    
    return true;
  };

  const logout = () => {
    setUserState(null);
    setIsAuthenticated(false);
    logoutUser();
  };

  const setUser = (updatedUser: User) => {
    setUserState(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, googleLogin, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
