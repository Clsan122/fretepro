
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { User } from "@/types";
import { setCurrentUser } from "@/utils/storage";

const generateTemporaryPassword = () => {
  return Math.random().toString(36).slice(-8);
};

export const useLocalAuth = (setUser: (user: User | null) => void, setIsAuthenticated: (value: boolean) => void) => {
  const [loading, setLoading] = useState(false);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    
    try {
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const user = users.find((u: any) => u.email === email);
      
      if (user && user.password === password) {
        const { password: _, ...userWithoutPassword } = user;
        
        // Check if it's first login
        if (user.isTemporaryPassword) {
          return false; // User needs to change password
        }
        
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

  const register = async (name: string, email: string, password: string): Promise<{ success: boolean; temporaryPassword?: string }> => {
    setLoading(true);
    
    try {
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      
      if (users.find((u: any) => u.email === email)) {
        return { success: false };
      }
      
      const temporaryPassword = generateTemporaryPassword();
      
      const newUser = {
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        name,
        email,
        phone: "",
        password: temporaryPassword,
        isTemporaryPassword: true,
      };
      
      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));
      
      const { password: _, isTemporaryPassword: __, ...userWithoutPassword } = newUser;
      
      setUser(userWithoutPassword);
      setIsAuthenticated(true);
      setCurrentUser(userWithoutPassword);
      
      return { success: true, temporaryPassword };
    } catch (error) {
      console.error("Registration error:", error);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (email: string, currentPassword: string, newPassword: string): Promise<boolean> => {
    try {
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const userIndex = users.findIndex((u: any) => u.email === email);
      
      if (userIndex === -1 || users[userIndex].password !== currentPassword) {
        return false;
      }
      
      users[userIndex] = {
        ...users[userIndex],
        password: newPassword,
        isTemporaryPassword: false,
      };
      
      localStorage.setItem("users", JSON.stringify(users));
      return true;
    } catch (error) {
      console.error("Change password error:", error);
      return false;
    }
  };

  return { login, register, changePassword, loading };
};
