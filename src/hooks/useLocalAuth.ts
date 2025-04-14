
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { User } from "@/types";
import { setCurrentUser } from "@/utils/storage";

export const useLocalAuth = (setUser: (user: User | null) => void, setIsAuthenticated: (value: boolean) => void) => {
  const [loading, setLoading] = useState(false);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    
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
        
        setUser(userWithoutPassword);
        setIsAuthenticated(true);
        setCurrentUser(userWithoutPassword);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setLoading(true);
    
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
      
      setUser(userWithoutPassword);
      setIsAuthenticated(true);
      setCurrentUser(userWithoutPassword);
      
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { login, register, loading };
};
