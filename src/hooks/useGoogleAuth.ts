
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { User } from "@/types";
import { setCurrentUser } from "@/utils/storage";

// Google API Key 
const GOOGLE_API_KEY = "AIzaSyCqysfLqP8UBCdhQ44_nIruQxjFK4gLY3E";

// Flag to check if we're in production environment
const isProduction = window.location.hostname !== 'localhost' && 
                    !window.location.hostname.includes('lovableproject.com');

export const useGoogleAuth = (setUser: (user: User | null) => void, setIsAuthenticated: (value: boolean) => void) => {
  const [loading, setLoading] = useState(false);

  const handleGoogleResponse = async (response: any): Promise<boolean> => {
    if (!response.credential) return false;
    
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
      
      setUser(user);
      setIsAuthenticated(true);
      setCurrentUser(user);
      return true;
    } catch (error) {
      console.error("Error processing Google login:", error);
      return false;
    }
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    setLoading(true);
    
    try {
      // If in production and no valid key configured, alert
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
              const success = await handleGoogleResponse(response);
              resolve(success);
            },
            auto_select: false,
          });
          
          // @ts-ignore - Google API is loaded dynamically
          window.google.accounts.id.prompt((notification: any) => {
            if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
              console.log("Google login prompt not displayed:", notification.getNotDisplayedReason() || notification.getSkippedReason());
              resolve(false);
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
    } finally {
      setLoading(false);
    }
  };

  return { loginWithGoogle, loading };
};
