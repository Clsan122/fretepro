
import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { getCurrentUser, setCurrentUser, logoutUser } from "@/utils/storage";

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

  // Google API Key - Updated with the provided key
  const GOOGLE_API_KEY = "AIzaSyCqysfLqP8UBCdhQ44_nIruQxjFK4gLY3E";
  
  // Flag para controlar se estamos em ambiente de produção
  const isProduction = window.location.hostname !== 'localhost' && 
                      !window.location.hostname.includes('lovableproject.com');

  useEffect(() => {
    // Check if user is already logged in on component mount
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUserState(currentUser);
      setIsAuthenticated(true);
    }

    // Load Google API
    const loadGoogleAPI = () => {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      
      script.onload = () => {
        console.log("Google API loaded successfully");
      };
      
      script.onerror = () => {
        console.error("Error loading Google API");
      };
    };
    
    loadGoogleAPI();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Get users from local storage
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      
      // Find user with matching email and password
      const user = users.find((u: any) => 
        u.email === email && u.password === password
      );
      
      if (user) {
        // Remove password from user object before storing in state
        const { password: _, ...userWithoutPassword } = user;
        
        setUserState(userWithoutPassword);
        setIsAuthenticated(true);
        setCurrentUser(userWithoutPassword);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    try {
      // Se estamos em produção e não há chave válida configurada, alertar
      if (isProduction && !GOOGLE_API_KEY) {
        console.error("Google API Key não configurada para produção");
        return false;
      }
      
      return new Promise((resolve) => {
        // @ts-ignore - Google API is loaded dynamically
        if (window.google && window.google.accounts) {
          // @ts-ignore - Google API is loaded dynamically
          window.google.accounts.id.initialize({
            client_id: GOOGLE_API_KEY,
            callback: async (response: any) => {
              if (response.credential) {
                try {
                  // Decode the JWT token
                  const base64Url = response.credential.split('.')[1];
                  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                  const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                  }).join(''));
                  
                  const { name, email, sub: googleId, picture } = JSON.parse(jsonPayload);
                  
                  // Get users from local storage
                  const users = JSON.parse(localStorage.getItem("users") || "[]");
                  
                  // Check if user with this Google ID or email already exists
                  let user = users.find((u: any) => u.googleId === googleId || u.email === email);
                  
                  if (!user) {
                    // Create new user if not exists
                    user = {
                      id: uuidv4(),
                      createdAt: new Date().toISOString(),
                      name,
                      email,
                      phone: "",
                      googleId,
                      picture,
                    };
                    
                    users.push(user);
                    localStorage.setItem("users", JSON.stringify(users));
                  } else {
                    // Update existing user with latest Google info
                    user.name = name;
                    user.picture = picture;
                    user.googleId = googleId;
                    
                    // Update the user in the array
                    const userIndex = users.findIndex((u: any) => u.id === user.id);
                    users[userIndex] = user;
                    localStorage.setItem("users", JSON.stringify(users));
                  }
                  
                  setUserState(user);
                  setIsAuthenticated(true);
                  setCurrentUser(user);
                  resolve(true);
                } catch (error) {
                  console.error("Error processing Google login:", error);
                  resolve(false);
                }
              } else {
                resolve(false);
              }
            },
            auto_select: false,
          });
          
          // @ts-ignore - Google API is loaded dynamically
          window.google.accounts.id.prompt((notification: any) => {
            if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
              console.log("Google login prompt not displayed:", notification.getNotDisplayedReason() || notification.getSkippedReason());
            }
          });
        } else {
          console.error("Google API not loaded");
          resolve(false);
        }
      });
    } catch (error) {
      console.error("Google login error:", error);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
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
      const { password: _, ...userWithoutPassword } = newUser;
      
      setUserState(userWithoutPassword);
      setIsAuthenticated(true);
      setCurrentUser(userWithoutPassword);
      
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      return false;
    }
  };

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
    <AuthContext.Provider value={{ user, isAuthenticated, login, loginWithGoogle, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
